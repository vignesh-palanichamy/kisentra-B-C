import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface Category {
    id?: string;
    name: string;
    slug: string;
    image_url?: string;
    is_active?: boolean;
}

// Fetch all categories with retry logic
export const getCategories = async (retries = 3): Promise<Category[]> => {
    // Always try to get local categories first for immediate render if needed? 
    // actually, let's keep the logic: try Supabase -> fail -> local.

    if (!isSupabaseConfigured()) {
        return getLocalCategories();
    }

    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('is_active', true)
            .order('name');

        if (error) {
            // Check for AbortError in the returned error object
            if (error.message?.includes('AbortError') || error.message?.includes('signal is aborted')) {
                if (retries > 0) {
                    await new Promise(res => setTimeout(res, 500)); // Wait 500ms
                    return getCategories(retries - 1);
                }
                // Even on Abort, try local
                return getLocalCategories();
            }
            console.error('Error fetching categories:', error);
            return getLocalCategories();
        }

        // Update local storage with fresh data from server
        if (data) {
            localStorage.setItem('adminCategories', JSON.stringify(data));
        }
        return data || [];
    } catch (error: any) {
        if (error.name === 'AbortError' || error.message?.includes('AbortError')) {
            if (retries > 0) {
                await new Promise(res => setTimeout(res, 500));
                return getCategories(retries - 1);
            }
            // Even on Abort, try local
            return getLocalCategories();
        }
        console.error('Error in getCategories:', error);
        return getLocalCategories();
    }
};

// Save a category (Insert or Update)
export const saveCategory = async (category: Category): Promise<boolean> => {
    // Always save to LocalStorage first (Backup/Optimistic)
    saveLocalCategory(category);

    if (!isSupabaseConfigured()) {
        return true;
    }

    try {
        const payload = {
            name: category.name,
            slug: category.slug,
            image_url: category.image_url,
            is_active: category.is_active !== false
        };

        if (category.id && !category.id.startsWith('local-')) {
            // Update
            const { error } = await supabase
                .from('categories')
                .update(payload)
                .eq('id', category.id);

            if (error) throw error;
        } else {
            // Insert
            // Remove ID if it's a local temp ID
            const { error } = await supabase
                .from('categories')
                .insert([payload]);

            if (error) throw error;
        }
        return true;
    } catch (error: any) {
        if (error.name === 'AbortError' || error.message?.includes('AbortError') || error.message?.includes('signal is aborted')) {
            return false; // Silent fail on abort, but local is saved
        }
        console.error('Error saving category:', error);
        return false;
    }
};

// Delete a category
export const deleteCategory = async (id: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) return false;

    try {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error: any) {
        if (error.name === 'AbortError' || error.message?.includes('AbortError') || error.message?.includes('signal is aborted')) {
            return false;
        }
        console.error('Error deleting category:', error);
        return false;
    }
};

// --- LocalStorage Fallbacks ---

const getLocalCategories = (): Category[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('adminCategories');
    return stored ? JSON.parse(stored) : [];
};

const saveLocalCategory = (category: Category): boolean => {
    const current = getLocalCategories();
    let updated = [];
    if (category.id) {
        updated = current.map(c => c.id === category.id ? category : c);
    } else {
        updated = [...current, { ...category, id: `local-${Date.now()}` }];
    }
    localStorage.setItem('adminCategories', JSON.stringify(updated));
    return true;
};
