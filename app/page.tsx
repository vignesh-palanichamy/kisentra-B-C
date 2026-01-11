'use client';

import React, { Fragment, useState, useEffect } from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import Scrollbar from '../components/scrollbar/scrollbar';
import ProductCarousel from '../components/ProductCarousel/ProductCarousel';
import ProductCard from '../components/ProductCard/ProductCard';
import { getProducts, Product } from '@/api/products';
import { Fade } from 'react-awesome-reveal';
import Link from 'next/link';

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    setProducts(getProducts());
  }, []);

  // Banner rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Premium Scroll Reveal Animation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    const gridItems = document.querySelectorAll('.premium-grid-item');
    gridItems.forEach((item) => observer.observe(item));

    return () => {
      gridItems.forEach((item) => observer.unobserve(item));
    };
  }, [isMounted]);

  // Amazon-style product categorization
  const categories = isMounted
    ? Array.from(new Set(products.map(p => p.category))).slice(0, 12)
    : [];

  const todaysDeals = isMounted
    ? products.filter(p => p.visible !== false && p.originalPrice && (p.originalPrice - p.price) > 0)
      .sort((a, b) => {
        const discountA = ((a.originalPrice! - a.price) / a.originalPrice!) * 100;
        const discountB = ((b.originalPrice! - b.price) / b.originalPrice!) * 100;
        return discountB - discountA;
      })
      .slice(0, 8)
    : [];

  const bestSellers = isMounted
    ? products.filter(p => p.visible !== false && p.reviews && p.reviews > 100)
      .sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
      .slice(0, 8)
    : [];

  const newArrivals = isMounted
    ? products.filter(p => p.visible !== false).slice(0, 8)
    : [];

  const topRated = isMounted
    ? products.filter(p => p.visible !== false && p.rating && p.rating >= 4.5)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 8)
    : [];

  const recommendedForYou = isMounted
    ? products.filter(p => p.visible !== false).slice(0, 8)
    : [];

  const customerFavorites = isMounted
    ? products.filter(p => p.visible !== false && p.rating && p.rating >= 4.7)
      .slice(0, 8)
    : [];

  return (
    <Fragment>
      <div className='body_wrap sco_agency'>
        <Header />
        <main className="page_content" style={{ paddingTop: '160px' }}>

          {/* Category Bar - Modern Pills */}
          {categories.length > 0 && (
            <section style={{ marginBottom: '50px', marginTop: '20px' }}>
              <div className="container">
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: '12px'
                }}>
                  {categories.map((category, index) => (
                    <Link
                      key={category}
                      href={`/products?category=${encodeURIComponent(category)}`}
                      className="category-pill"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 20px',
                        backgroundColor: 'var(--color-white)',
                        borderRadius: '30px',
                        textDecoration: 'none',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        border: '1px solid #eee',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                        e.currentTarget.style.borderColor = 'var(--color-primary-two)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                        e.currentTarget.style.borderColor = '#eee';
                      }}
                    >
                      <span style={{
                        fontSize: '18px',
                        marginRight: '10px',
                        lineHeight: 1
                      }}>
                        {['📱', '👗', '👟', '🏠', '💄', '🧸', '🚲'][index % 7]}
                      </span>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'var(--color-heading)',
                        whiteSpace: 'nowrap'
                      }}>
                        {category}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Hero Banner - Yellow Collection Slider */}
          <section style={{
            marginBottom: '60px',
            padding: '0 15px'
          }}>
            <div className="container" style={{ maxWidth: '1600px' }}>
              <div style={{
                backgroundColor: '#ffc220',
                borderRadius: '20px',
                padding: '60px 80px',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '400px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <div className="row w-100 align-items-center">

                  {/* Left Content */}
                  <div className="col-lg-5">
                    <Fade direction="left" triggerOnce>
                      <div>
                        <h2 style={{
                          fontSize: '48px',
                          fontWeight: '800',
                          color: '#222',
                          marginBottom: '20px',
                          lineHeight: '1.1'
                        }}>
                          Build an elite collection
                        </h2>
                        <p style={{
                          fontSize: '18px',
                          color: '#333',
                          marginBottom: '35px',
                          fontWeight: '500'
                        }}>
                          Choose your next adventure from thousands of finds.
                        </p>
                        <Link href="/products" style={{
                          display: 'inline-block',
                          backgroundColor: '#4a3b18',
                          color: '#ffc220',
                          padding: '15px 35px',
                          borderRadius: '30px',
                          fontWeight: '700',
                          textDecoration: 'none',
                          transition: 'transform 0.2s',
                          border: '2px solid transparent'
                        }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                          Start your journey
                        </Link>
                      </div>
                    </Fade>
                  </div>

                  {/* Right Content - Categories */}
                  <div className="col-lg-7">
                    <Fade direction="right" triggerOnce>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'flex-end',
                        textAlign: 'center',
                        flexWrap: 'wrap',
                        gap: '20px'
                      }}>
                        {/* Item 1: Lego */}
                        <Link href="/products?category=lego" className="hero-cat-item" style={{ textDecoration: 'none', color: '#000', transition: 'transform 0.3s' }}>
                          <div style={{
                            width: '180px',
                            height: '180px',
                            position: 'relative',
                            marginBottom: '15px'
                          }}>
                            {/* Placeholder for Lego Temple Image - Using a generic toy/building block image or colored div for now if specific asset not available */}
                            <div style={{ width: '100%', height: '100%', background: 'url(https://placehold.co/200x200/png?text=Lego+Set) no-repeat center center / contain' }}></div>
                          </div>
                          <span style={{ fontSize: '16px', fontWeight: '700' }}>Lego <i className="far fa-chevron-right" style={{ fontSize: '12px' }}></i></span>
                        </Link>

                        {/* Item 2: Coins */}
                        <Link href="/products?category=coins" className="hero-cat-item" style={{ textDecoration: 'none', color: '#000', transition: 'transform 0.3s' }}>
                          <div style={{
                            width: '160px',
                            height: '160px',
                            position: 'relative',
                            marginBottom: '15px'
                          }}>
                            <div style={{ width: '100%', height: '100%', background: 'url(https://placehold.co/200x200/png?text=Rare+Coins) no-repeat center center / contain' }}></div>
                          </div>
                          <span style={{ fontSize: '16px', fontWeight: '700' }}>Coins <i className="far fa-chevron-right" style={{ fontSize: '12px' }}></i></span>
                        </Link>

                        {/* Item 3: Comic Books */}
                        <Link href="/products?category=comics" className="hero-cat-item" style={{ textDecoration: 'none', color: '#000', transition: 'transform 0.3s' }}>
                          <div style={{
                            width: '170px',
                            height: '200px',
                            position: 'relative',
                            marginBottom: '15px'
                          }}>
                            <div style={{ width: '100%', height: '100%', background: 'url(https://placehold.co/200x250/png?text=Comics) no-repeat center center / contain' }}></div>
                          </div>
                          <span style={{ fontSize: '16px', fontWeight: '700' }}>Comic books <i className="far fa-chevron-right" style={{ fontSize: '12px' }}></i></span>
                        </Link>
                      </div>
                    </Fade>
                  </div>

                </div>

                {/* Slider Controls */}
                <div style={{
                  position: 'absolute',
                  bottom: '30px',
                  right: '40px',
                  display: 'flex',
                  gap: '10px'
                }}>
                  <button style={{ width: '35px', height: '35px', borderRadius: '50%', border: 'none', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <i className="fas fa-chevron-left" style={{ fontSize: '12px', color: '#333' }}></i>
                  </button>
                  <button style={{ width: '35px', height: '35px', borderRadius: '50%', border: 'none', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <i className="fas fa-chevron-right" style={{ fontSize: '12px', color: '#333' }}></i>
                  </button>
                  <button style={{ width: '35px', height: '35px', borderRadius: '50%', border: 'none', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <i className="fas fa-pause" style={{ fontSize: '12px', color: '#333' }}></i>
                  </button>
                </div>

              </div>
            </div>
          </section>

          {/* Featured / Deals Section - Custom Design */}
          {todaysDeals.length > 0 && (
            <section style={{ marginBottom: '80px' }}>
              <div className="container">
                <div className="row mb-40 align-items-end">
                  <div className="col-lg-8">
                    <span style={{
                      color: 'var(--color-primary-two)',
                      fontWeight: '700',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      fontSize: '12px',
                      display: 'block',
                      marginBottom: '10px'
                    }}>Don't Miss Out</span>
                    <h2 className="title" style={{
                      fontSize: '36px',
                      marginBottom: 0,
                      position: 'relative',
                      display: 'inline-block'
                    }}>
                      Lightning Deals
                      <span style={{
                        position: 'absolute',
                        bottom: '5px',
                        right: '-15px',
                        width: '8px',
                        height: '8px',
                        backgroundColor: 'var(--color-primary-two)',
                        borderRadius: '50%'
                      }}></span>
                    </h2>
                  </div>
                  <div className="col-lg-4 text-lg-end">
                    <Link href="/products" className="text-btn">
                      View All Collections <i className="far fa-long-arrow-right" />
                    </Link>
                  </div>
                </div>

                <div className="row">
                  {todaysDeals.slice(0, 4).map((product) => (
                    <div key={product.Id} className="col-lg-3 col-md-4 col-sm-6 mb-40">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Best Sellers Section */}
          {bestSellers.length > 0 && (
            <section style={{
              marginBottom: '80px',
              backgroundColor: 'var(--color-body)',
              padding: '80px 0',
              position: 'relative'
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.03, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
              <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                <div className="row mb-50 text-center">
                  <div className="col-12">
                    <h2 className="title" style={{ fontSize: '36px' }}>Curated Best Sellers</h2>
                    <div style={{ width: '60px', height: '4px', backgroundColor: 'var(--color-primary-two)', margin: '20px auto' }}></div>
                  </div>
                </div>
                <div className="row">
                  {bestSellers.slice(0, 4).map((product) => (
                    <div key={product.Id} className="col-lg-3 col-md-4 col-sm-6 mb-30">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* New Arrivals Grid */}
          {newArrivals.length > 0 && (
            <section style={{ marginBottom: '80px' }}>
              <div className="container">
                <div className="row mb-50">
                  <div className="col-12">
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid #eee',
                      paddingBottom: '20px'
                    }}>
                      <h2 className="title" style={{ fontSize: '32px', margin: 0 }}>Fresh Arrivals</h2>
                      <Link href="/products" style={{ fontWeight: '600', color: 'var(--color-primary-two)' }}>See All New Items</Link>
                    </div>
                  </div>
                </div>
                <div className="row">
                  {newArrivals.slice(0, 8).map((product) => (
                    <div key={product.Id} className="col-lg-3 col-md-4 col-sm-6 mb-40">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Benefits Section - Modern Grid */}
          <section className="service" style={{
            marginBottom: '80px',
            padding: '0 20px'
          }}>
            <div className="container">
              <div className="row g-4">
                {[
                  { icon: '🚚', title: 'Global Shipping', desc: 'Secure delivery to 100+ countries' },
                  { icon: '🛡️', title: 'Buyer Protection', desc: 'Full refund if not as described' },
                  { icon: '🤝', title: '24/7 Support', desc: 'Dedicated support team' },
                  { icon: '✨', title: 'Quality Promise', desc: 'Handpicked premium items' }
                ].map((benefit, index) => (
                  <div key={index} className="col-xl-3 col-lg-6">
                    <Fade direction="up" triggerOnce duration={600} delay={index * 100}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '30px',
                          borderRadius: '20px',
                          backgroundColor: 'var(--color-white)',
                          boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
                          border: '1px solid rgba(0,0,0,0.02)',
                          transition: 'transform 0.3s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        <div style={{
                          fontSize: '32px',
                          marginRight: '20px',
                          width: '60px',
                          height: '60px',
                          borderRadius: '15px',
                          backgroundColor: 'var(--color-body)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>{benefit.icon}</div>
                        <div>
                          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '5px', color: 'var(--color-heading)' }}>{benefit.title}</h3>
                          <p style={{ color: 'var(--color-text)', fontSize: '14px', marginBottom: 0, lineHeight: 1.4 }}>{benefit.desc}</p>
                        </div>
                      </div>
                    </Fade>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Newsletter Section - Uniquely Shaped */}
          <section className="newsletter-section" style={{
            padding: '100px 0',
            backgroundColor: '#111',
            borderRadius: '40px 40px 0 0',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Abstract Background Shapes */}
            <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '800px', height: '800px', borderRadius: '50%', background: 'radial-gradient(circle, var(--color-primary-two) 0%, transparent 60%)', opacity: 0.1, filter: 'blur(80px)' }}></div>
            <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, var(--color-secondary) 0%, transparent 60%)', opacity: 0.1, filter: 'blur(60px)' }}></div>

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
              <div className="row justify-content-center">
                <div className="col-lg-8 text-center">
                  <span style={{ color: 'var(--color-primary-two)', fontWeight: 'bold', letterSpacing: '2px', fontSize: '12px', textTransform: 'uppercase' }}>Join The Community</span>
                  <h2 style={{ color: '#fff', fontSize: '48px', fontWeight: '800', marginTop: '20px', marginBottom: '20px' }}>Stay Ahead of the Curve</h2>
                  <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '50px', fontSize: '18px' }}>Be the first to know about new collections and exclusive events.</p>

                  <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
                    <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', backgroundColor: 'rgba(255,255,255,0.1)', padding: '5px', borderRadius: '50px' }}>
                      <input
                        type="email"
                        placeholder="Your email address"
                        style={{
                          flex: 1,
                          padding: '20px 30px',
                          background: 'transparent',
                          border: 'none',
                          outline: 'none',
                          color: '#fff',
                          fontSize: '16px'
                        }}
                      />
                      <button type="submit" style={{
                        backgroundColor: 'var(--color-primary-two)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50px',
                        padding: '0 40px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }} className="hover-brightness">
                        Join
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </main>
        <Footer />
      </div>
      <Scrollbar />
    </Fragment>
  );
};

export default HomePage;