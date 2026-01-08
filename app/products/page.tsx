'use client';

import React, { useState, Fragment, useEffect } from 'react';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import Scrollbar from '@/components/scrollbar/scrollbar';
import { getProducts, getProductsFromSupabaseAsync, Product } from '@/api/products';
import ProductCard from '@/components/ProductCard/ProductCard';
import { Fade } from 'react-awesome-reveal';

const ProductsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('default');
  const [products, setProducts] = useState<Product[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Load products only on client side to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    setProducts(getProducts());
    
    // Also try to load from Supabase in background
    getProductsFromSupabaseAsync().then((supabaseProducts) => {
      if (supabaseProducts && supabaseProducts.length > 0) {
        setProducts(supabaseProducts);
        // Also update localStorage with Supabase data
        localStorage.setItem('adminProducts', JSON.stringify(supabaseProducts));
      }
    });
    
    const handleStorageChange = () => {
      setProducts(getProducts());
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, []);

  const categories = isMounted 
    ? ['All', ...Array.from(new Set(products.map(p => p.category)))]
    : ['All'];
  
  // Filter visible products only - only after mount
  const filteredProducts = isMounted
    ? products.filter(
        product => (selectedCategory === 'All' || product.category === selectedCategory) && product.visible !== false
      )
    : [];

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <Fragment>
      <div className='body_wrap sco_agency'>
        <Header />
        <main className="page_content">
          <section className="service pt-140 pb-140">
            <div className="container">
              {/* Page Header */}
              <div className="row mb-60">
                <div className="col-12">
                  <Fade direction="up" triggerOnce duration={1000}>
                    <h1 className="title text-center mb-30">Our Products</h1>
                    <p className="content text-center">
                      Browse our complete collection of premium solutions
                    </p>
                  </Fade>
                </div>
              </div>

              {/* Filters */}
              <div className="row mb-50">
                <div className="col-lg-6 col-md-6">
                  <Fade direction="right" triggerOnce duration={1000}>
                    <div className="filter-group">
                      <label className="filter-label">Category:</label>
                      <select
                        className="filter-select"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        style={{
                          padding: '12px 20px',
                          borderRadius: '7px',
                          border: '1px solid #e7e8ec',
                          fontSize: '16px',
                          fontFamily: 'var(--font-body)',
                          color: 'var(--color-heading)',
                          backgroundColor: '#fff',
                          cursor: 'pointer',
                          width: '100%',
                          maxWidth: '300px'
                        }}
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Fade>
                </div>
                <div className="col-lg-6 col-md-6 text-end">
                  <Fade direction="left" triggerOnce duration={1000}>
                    <div className="filter-group">
                      <label className="filter-label">Sort by:</label>
                      <select
                        className="filter-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{
                          padding: '12px 20px',
                          borderRadius: '7px',
                          border: '1px solid #e7e8ec',
                          fontSize: '16px',
                          fontFamily: 'var(--font-body)',
                          color: 'var(--color-heading)',
                          backgroundColor: '#fff',
                          cursor: 'pointer',
                          width: '100%',
                          maxWidth: '300px',
                          marginLeft: 'auto'
                        }}
                      >
                        <option value="default">Default</option>
                        <option value="name">Name (A-Z)</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                      </select>
                    </div>
                  </Fade>
                </div>
              </div>

              {/* Products Grid */}
              <div className="row mt-none-30">
                {sortedProducts.length > 0 ? (
                  sortedProducts.map((product) => (
                    <div key={product.Id} className="col-lg-4 col-md-6 mt-30">
                      <ProductCard product={product} />
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center">
                    <p className="content">No products found in this category.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
        <Footer />
        <Scrollbar />
      </div>
    </Fragment>
  );
};

export default ProductsPage;



