'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/contexts/AdminContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Fade } from 'react-awesome-reveal';
import Image from 'next/image';
import Link from 'next/link';

interface OrderItem {
  id: string;
  product_id: string;
  product_title: string;
  quantity: number;
  price: number;
  image_url: string | null;
}

interface Order {
  id: string;
  user_id: string;
  address_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: string;
  created_at: string;
  order_items: OrderItem[];
  address?: {
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    pincode: string;
  };
  user?: {
    email: string;
  };
}

const AdminOrdersPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAdmin();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/admin/login';
      return;
    }
  }, [isAuthenticated, isLoading]);

  // Handle unhandled AbortErrors from Turbopack hot reload
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.name === 'AbortError' || 
          event.reason?.message?.includes('aborted') ||
          event.reason?.message?.includes('signal is aborted')) {
        event.preventDefault();
        // Silently ignore AbortErrors from hot reload
        return;
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const controller = new AbortController();
    loadOrders(controller.signal);
    
    return () => controller.abort();
  }, [isAuthenticated, selectedStatus]);

  const loadOrders = async (signal?: AbortSignal) => {
    if (signal?.aborted) return;
    
    setLoading(true);
    let loadingTimeout: NodeJS.Timeout | null = null;
    
    try {
      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase is not configured. Please check your environment variables.');
      }

      // Check Supabase session (RLS requires authentication)
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.warn('No Supabase session found. Admin may need to be logged in as a Supabase user to view orders.');
        // Continue anyway - RLS might allow it or we'll get a proper error
      }

      // Set a timeout to prevent infinite loading
      loadingTimeout = setTimeout(() => {
        if (!signal?.aborted) {
          console.warn('Orders query is taking too long, this might indicate a connection or RLS policy issue');
          setLoading(false);
          setOrders([]);
          alert('Loading orders is taking too long. Please check:\n1. Your internet connection\n2. Supabase RLS policies\n3. Browser console for errors');
        }
      }, 10000); // 10 second timeout

      console.log('Fetching orders from Supabase...');
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (selectedStatus !== 'all') {
        query = query.eq('status', selectedStatus);
      }

      const { data, error } = await query;
      
      // Clear timeout if query completes
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
        loadingTimeout = null;
      }

      if (signal?.aborted) return;

      if (error) {
        console.error('Supabase query failed:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        // Check if it's an authentication/RLS issue
        if (error.code === '42501' || error.message?.includes('permission') || error.message?.includes('RLS')) {
          throw new Error('Permission denied. Admin users need to be authenticated in Supabase to view orders. Please log in as a Supabase user or adjust RLS policies.');
        }
        
        throw error;
      }

      if (!data || data.length === 0) {
        if (loadingTimeout) clearTimeout(loadingTimeout);
        setOrders([]);
        setLoading(false);
        return;
      }

      if (signal?.aborted) return;

      // Collect unique address IDs
      const addressIds = [...new Set(
        data
          .map((order: any) => order.address_id)
          .filter((id: string | null) => id !== null)
      )];

      // Fetch all addresses in one query (much faster!)
      let addressesMap: Record<string, any> = {};
      if (addressIds.length > 0) {
        try {
          const { data: addressesData, error: addressesError } = await supabase
            .from('addresses')
            .select('*')
            .in('id', addressIds);

          if (signal?.aborted) return;

          if (!addressesError && addressesData) {
            // Create a map for quick lookup
            addressesMap = addressesData.reduce((acc: Record<string, any>, addr: any) => {
              acc[addr.id] = addr;
              return acc;
            }, {});
          }
        } catch (addrErr: any) {
          // Ignore abort errors
          if (!addrErr?.message?.includes('aborted') && addrErr?.code !== '20') {
            console.warn('Error fetching addresses:', addrErr);
          }
        }
      }

      if (signal?.aborted) {
        if (loadingTimeout) clearTimeout(loadingTimeout);
        return;
      }

      // Map addresses to orders
      const ordersWithDetails: Order[] = data.map((order: any) => ({
        ...order,
        address: order.address_id ? addressesMap[order.address_id] : undefined
      }));

      console.log(`Loaded ${ordersWithDetails.length} orders successfully`);
      setOrders(ordersWithDetails);
      setLoading(false);
    } catch (error: any) {
      // Clear timeout on error
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
        loadingTimeout = null;
      }
      // Ignore AbortError from hot reload
      if (error?.name === 'AbortError' || 
          error?.message?.includes('aborted') || 
          error?.code === '20' ||
          signal?.aborted) {
        return;
      }
      
      // Extract detailed error message before logging
      let errorMessage = 'Unknown error occurred';
      let errorDetails: any = {};
      
      if (error) {
        errorDetails = {
          name: error.name,
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        };

        if (error.message) {
          errorMessage = error.message;
        } else if (error.code === 'PGRST116' || error.code === '42P01') {
          errorMessage = 'Orders table not found. Please run the SQL script in Supabase.';
        } else if (error.code === '42501') {
          errorMessage = 'Permission denied. Check your RLS policies.';
        } else if (error.code) {
          errorMessage = `Database error (${error.code}): ${error.message || error.details || 'Unknown error'}`;
        } else if (typeof error === 'string') {
          errorMessage = error;
        } else if (error.details) {
          errorMessage = error.details;
        } else {
          try {
            errorMessage = JSON.stringify(error, null, 2);
          } catch {
            errorMessage = String(error);
          }
        }
      }
      
      console.error('Error loading orders:', errorDetails);
      
      // Only show alert if it's a real error (not abort)
      if (!error?.message?.includes('aborted') && error?.code !== '20') {
        alert('Failed to load orders:\n\n' + errorMessage);
      }
      
      // Always reset loading state on error
      setLoading(false);
      setOrders([]); // Set empty array so UI doesn't stay in loading state
    } finally {
      // Ensure loading is always reset
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    setUpdatingStatus(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      // Update local state
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));

      // Update selected order if it's the one being updated
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }

      alert('Order status updated successfully!');
    } catch (error: any) {
      console.error('Error updating order status:', error);
      
      // Extract detailed error message
      let errorMessage = 'Unknown error occurred';
      if (error) {
        if (error.message) {
          errorMessage = error.message;
        } else if (error.code) {
          errorMessage = `Database error (${error.code}): ${error.message || error.details || 'Unknown error'}`;
        } else if (typeof error === 'string') {
          errorMessage = error;
        } else {
          try {
            errorMessage = JSON.stringify(error, null, 2);
          } catch {
            errorMessage = String(error);
          }
        }
      }
      
      alert('Failed to update order status:\n\n' + errorMessage);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const viewOrderDetails = async (order: Order) => {
    try {
      // If address or user not loaded, fetch them
      if (!order.address && order.address_id) {
        const { data: addressData, error: addressError } = await supabase
          .from('addresses')
          .select('*')
          .eq('id', order.address_id)
          .single();
        
        if (!addressError && addressData) {
          order.address = addressData;
        } else if (addressError) {
          console.warn('Error fetching address:', addressError);
          // Continue without address - not critical
        }
      }

      // Note: User email fetching requires admin API (service role key)
      // This would need to be done via a server-side API route
      // For now, we'll skip this

      setSelectedOrder(order);
      setShowDetails(true);
    } catch (error: any) {
      console.error('Error loading order details:', error);
      // Still show the order even if address fetch fails
      setSelectedOrder(order);
      setShowDetails(true);
    }
  };

  const statusColors: Record<string, { bg: string; color: string }> = {
    pending: { bg: '#fff3cd', color: '#856404' },
    processing: { bg: '#cfe2ff', color: '#084298' },
    shipped: { bg: '#d1e7dd', color: '#0f5132' },
    delivered: { bg: '#d4edda', color: '#155724' },
    cancelled: { bg: '#f8d7da', color: '#721c24' }
  };

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="body_wrap sco_agency">
      <main className="page_content">
        <section className="service pt-140 pb-140">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div style={{ marginBottom: '40px' }}>
                  <h1 className="title mb-20">Order Management</h1>
                  <p className="content">View and manage all customer orders</p>
                </div>

                {/* Filter */}
                <div style={{ marginBottom: '30px' }}>
                  <label style={{ marginRight: '15px', fontWeight: '600' }}>Filter by Status:</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    style={{
                      padding: '10px 15px',
                      borderRadius: '8px',
                      border: '1px solid #e7e8ec',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="all">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {loading ? (
                  <div className="text-center" style={{ padding: '60px' }}>
                    <p className="content">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center" style={{ padding: '60px' }}>
                    <p className="content">No orders found.</p>
                  </div>
                ) : (
                  <div className="orders-table" style={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid #e7e8ec'
                  }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #e7e8ec' }}>
                          <th style={{ padding: '15px', textAlign: 'left', fontWeight: '700' }}>Order ID</th>
                          <th style={{ padding: '15px', textAlign: 'left', fontWeight: '700' }}>Date</th>
                          <th style={{ padding: '15px', textAlign: 'left', fontWeight: '700' }}>Customer</th>
                          <th style={{ padding: '15px', textAlign: 'left', fontWeight: '700' }}>Items</th>
                          <th style={{ padding: '15px', textAlign: 'left', fontWeight: '700' }}>Total</th>
                          <th style={{ padding: '15px', textAlign: 'left', fontWeight: '700' }}>Status</th>
                          <th style={{ padding: '15px', textAlign: 'left', fontWeight: '700' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => {
                          const statusColor = statusColors[order.status] || statusColors.pending;
                          const orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          });

                          return (
                            <tr key={order.id} style={{ borderBottom: '1px solid #e7e8ec' }}>
                              <td style={{ padding: '15px' }}>
                                <code style={{ fontSize: '12px', color: '#666' }}>
                                  {order.id.substring(0, 8)}...
                                </code>
                              </td>
                              <td style={{ padding: '15px' }}>{orderDate}</td>
                              <td style={{ padding: '15px' }}>
                                {order.user?.email || 'N/A'}
                              </td>
                              <td style={{ padding: '15px' }}>
                                {order.order_items?.length || 0} item(s)
                              </td>
                              <td style={{ padding: '15px', fontWeight: '600' }}>
                                ₹{order.total_amount.toFixed(2)}
                              </td>
                              <td style={{ padding: '15px' }}>
                                <span style={{
                                  padding: '5px 12px',
                                  borderRadius: '6px',
                                  backgroundColor: statusColor.bg,
                                  color: statusColor.color,
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  textTransform: 'uppercase'
                                }}>
                                  {order.status}
                                </span>
                              </td>
                              <td style={{ padding: '15px' }}>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                  <button
                                    onClick={() => viewOrderDetails(order)}
                                    style={{
                                      padding: '6px 12px',
                                      backgroundColor: '#2563eb',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '6px',
                                      cursor: 'pointer',
                                      fontSize: '12px',
                                      fontWeight: '600'
                                    }}
                                  >
                                    View
                                  </button>
                                  <select
                                    value={order.status}
                                    onChange={(e) => handleStatusUpdate(order.id, e.target.value as Order['status'])}
                                    disabled={updatingStatus === order.id}
                                    style={{
                                      padding: '6px 10px',
                                      borderRadius: '6px',
                                      border: '1px solid #e7e8ec',
                                      fontSize: '12px',
                                      cursor: updatingStatus === order.id ? 'not-allowed' : 'pointer',
                                      opacity: updatingStatus === order.id ? 0.6 : 1
                                    }}
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowDetails(false)}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              padding: '40px',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowDetails(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ×
            </button>

            <h2 style={{ marginBottom: '30px', fontSize: '24px', fontWeight: '700' }}>
              Order Details
            </h2>

            <div style={{ marginBottom: '30px' }}>
              <div style={{ marginBottom: '15px' }}>
                <strong>Order ID:</strong> {selectedOrder.id}
              </div>
              <div style={{ marginBottom: '15px' }}>
                <strong>Date:</strong>{' '}
                {new Date(selectedOrder.created_at).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <div style={{ marginBottom: '15px' }}>
                <strong>Status:</strong>{' '}
                <span style={{
                  padding: '5px 15px',
                  borderRadius: '5px',
                  backgroundColor: statusColors[selectedOrder.status].bg,
                  color: statusColors[selectedOrder.status].color,
                  fontSize: '14px',
                  fontWeight: '600',
                  textTransform: 'uppercase'
                }}>
                  {selectedOrder.status}
                </span>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <strong>Payment Method:</strong> {selectedOrder.payment_method.toUpperCase()}
              </div>
              {selectedOrder.user && (
                <div style={{ marginBottom: '15px' }}>
                  <strong>Customer Email:</strong> {selectedOrder.user.email}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '700' }}>
                Order Items
              </h3>
              {selectedOrder.order_items?.map((item) => {
                const imageUrl = item.image_url || '/placeholder-product.png';
                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      gap: '20px',
                      marginBottom: '20px',
                      paddingBottom: '20px',
                      borderBottom: '1px solid #e7e8ec'
                    }}
                  >
                    <div style={{
                      position: 'relative',
                      width: '80px',
                      height: '80px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      backgroundColor: '#f6f6f8'
                    }}>
                      <Image
                        src={imageUrl}
                        alt={item.product_title}
                        fill
                        style={{ objectFit: 'cover' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-product.png';
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '16px', marginBottom: '5px', fontWeight: '600' }}>
                        {item.product_title}
                      </h4>
                      <p style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                        Quantity: {item.quantity}
                      </p>
                      <p style={{ fontSize: '16px', fontWeight: '700', color: '#2563eb' }}>
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedOrder.address && (
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '700' }}>
                  Shipping Address
                </h3>
                <p style={{ lineHeight: '1.8' }}>
                  {selectedOrder.address.full_name}<br />
                  {selectedOrder.address.address_line1}, {selectedOrder.address.address_line2}<br />
                  {selectedOrder.address.city}, {selectedOrder.address.state} - {selectedOrder.address.pincode}<br />
                  Phone: {selectedOrder.address.phone}
                </p>
              </div>
            )}

            <div style={{
              paddingTop: '20px',
              borderTop: '2px solid #e7e8ec',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <strong style={{ fontSize: '20px' }}>Total Amount:</strong>
                <span style={{ fontSize: '24px', fontWeight: '700', color: '#2563eb', marginLeft: '10px' }}>
                  ₹{selectedOrder.total_amount.toFixed(2)}
                </span>
              </div>
              <select
                value={selectedOrder.status}
                onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value as Order['status'])}
                disabled={updatingStatus === selectedOrder.id}
                style={{
                  padding: '10px 15px',
                  borderRadius: '8px',
                  border: '1px solid #e7e8ec',
                  fontSize: '14px',
                  cursor: updatingStatus === selectedOrder.id ? 'not-allowed' : 'pointer'
                }}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
