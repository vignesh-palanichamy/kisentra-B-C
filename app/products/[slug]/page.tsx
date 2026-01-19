'use client';

import React, { Fragment, useState, useEffect } from 'react';
import { useParams, notFound, useRouter } from 'next/navigation';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import Scrollbar from '@/components/scrollbar/scrollbar';
import { getProducts, getProductsFromSupabaseAsync, Product } from '@/api/products';
import { useCart } from '@/contexts/CartContext';
import ProductCard from '@/components/ProductCard/ProductCard';
import Image from 'next/image';
import { Fade } from 'react-awesome-reveal';
import Link from 'next/link';

const ProductDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
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

  const product = isMounted ? products.find((p) => p.slug === slug) : null;
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [activeTab, setActiveTab] = useState('Description');
  const [showLightbox, setShowLightbox] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!isMounted) {
    return (
      <Fragment>
        <div className='body_wrap sco_agency'>
          <Header />
          <main className="page_content">
            <section className="service pt-140 pb-140">
              <div className="container">
                <div className="row">
                  <div className="col-12 text-center">
                    <p className="content">Loading...</p>
                  </div>
                </div>
              </div>
            </section>
          </main>
          <Footer />
          <Scrollbar />
        </div>
      </Fragment>
    );
  }

  if (!product) {
    notFound();
  }

  // Get related products (same category, excluding current product, only visible)
  const relatedProducts = products.filter(
    (p) => p.category === product.category && p.Id !== product.Id && p.visible !== false
  ).slice(0, 4);

  // Safely get the main image with fallback
  const getMainImage = () => {
    if (!product.images || product.images.length === 0) {
      return '/images/placeholder.jpg'; // Fallback placeholder
    }

    const selectedImage = product.images[selectedImageIndex] || product.images[0];
    if (typeof selectedImage === 'string') {
      return selectedImage;
    }

    // Handle StaticImageData or object with src property
    if (selectedImage && typeof selectedImage === 'object') {
      return (selectedImage as any).src || selectedImage;
    }

    return '/images/placeholder.jpg'; // Final fallback
  };

  const mainImage = getMainImage();

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  };

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Fragment>
      <div className='body_wrap sco_agency'>
        <Header />
        <main className="page_content" style={{ backgroundColor: '#fff', paddingBottom: '80px', paddingTop: '160px', fontFamily: 'Inter, sans-serif' }}>

          {/* Breadcrumb - Clean & Simple */}
          <div style={{ borderBottom: '1px solid #e0e6ef', padding: '15px 0' }}>
            <div className="container" style={{ maxWidth: '1600px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb" style={{ margin: 0, padding: 0, fontSize: '13px', background: 'transparent', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <li className="breadcrumb-item"><Link href="/" style={{ color: '#0046be', textDecoration: 'none', fontWeight: '500' }}>Home</Link></li>
                  <li style={{ color: '#c5cbd5', fontSize: '12px' }}><i className="fas fa-chevron-right"></i></li>
                  <li className="breadcrumb-item"><Link href="/products" style={{ color: '#0046be', textDecoration: 'none', fontWeight: '500' }}>{product.category || 'Products'}</Link></li>
                  <li style={{ color: '#c5cbd5', fontSize: '12px' }}><i className="fas fa-chevron-right"></i></li>
                  <li className="breadcrumb-item active" aria-current="page" style={{ color: '#20262e', fontWeight: '600' }}>{product.title}</li>
                </ol>
              </nav>
              {/* Share / Print icons could go here */}
            </div>
          </div>

          <div className="container" style={{ maxWidth: '1600px', marginTop: '30px' }}>

            {/* Header Info Section - Title & Ratings */}
            <div className="row mb-30">
              <div className="col-12">
                <h1 style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: '#040c13',
                  marginBottom: '15px',
                  lineHeight: '1.2'
                }}>
                  {product.title}
                </h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: '30px', fontSize: '14px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ color: '#ffe000', fontSize: '14px', WebkitTextStroke: '1px #bca500' }}>
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={`fa${i < Math.floor(product.rating || 4) ? 's' : 'r'} fa-star`} />
                      ))}
                    </div>
                    <strong style={{ color: '#040c13', marginLeft: '5px' }}>{product.rating || '4.8'}</strong>
                    <span style={{ color: '#0046be', cursor: 'pointer', fontWeight: '500' }}>({product.reviews || 85} Reviews)</span>
                    <span style={{ margin: '0 8px', color: '#c5cbd5' }}>|</span>
                    <span style={{ color: '#0046be', fontWeight: '600', cursor: 'pointer' }}>Answered Questions</span>
                  </div>

                  <div style={{ display: 'flex', gap: '20px', color: '#555' }}>
                    <div>
                      <strong>Model:</strong> {product.Id ? product.Id.substring(0, 8).toUpperCase() : 'N/A'}
                    </div>
                    <div>
                      <strong>SKU:</strong> {Math.floor(Math.random() * 1000000)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">

              {/* LEFT COLUMN: Image Gallery (Larger Column 7 or 8) */}
              <div className="col-lg-8">
                <div style={{
                  position: 'relative',
                  marginBottom: '30px'
                }}>
                  {/* Main Image Container */}
                  <div className="main-image-container" style={{
                    position: 'relative',
                    width: '100%',
                    height: '600px',
                    marginBottom: '20px',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}
                    onMouseEnter={() => setIsZoomed(true)}
                    onMouseLeave={() => setIsZoomed(false)}
                    onMouseMove={(e) => {
                      if (!isZoomed) return;
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = ((e.clientX - rect.left) / rect.width) * 100;
                      const y = ((e.clientY - rect.top) / rect.height) * 100;
                      setZoomPosition({ x, y });
                    }}
                  >
                    <Image
                      src={mainImage}
                      alt={product.title}
                      fill
                      style={{
                        objectFit: 'contain',
                        transform: isZoomed ? `scale(2)` : 'scale(1)',
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        transition: isZoomed ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        cursor: 'zoom-in'
                      }}
                    />

                    {/* Overlay Icons */}
                    <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', flexDirection: 'column', gap: '15px', zIndex: 5 }}>
                      <button
                        onClick={() => setIsWishlisted(!isWishlisted)}
                        title="Save"
                        style={{
                          width: '45px', height: '45px', borderRadius: '50%', border: '1px solid #e0e6ef', background: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)', transition: 'all 0.2s'
                        }}>
                        <i className={`${isWishlisted ? 'fas' : 'far'} fa-heart`} style={{ color: isWishlisted ? '#c00' : '#0046be', fontSize: '18px' }}></i>
                      </button>
                      <button title="Share" style={{
                        width: '45px', height: '45px', borderRadius: '50%', border: '1px solid #e0e6ef', background: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                      }}>
                        <i className="fas fa-share-alt" style={{ color: '#0046be', fontSize: '18px' }}></i>
                      </button>
                    </div>
                  </div>

                  {/* Thumbnails Row */}
                  {product.images && product.images.length > 0 && (
                    <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', padding: '10px 0', justifyContent: 'center' }}>
                      {product.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImageIndex(idx)}
                          style={{
                            width: '80px',
                            height: '80px',
                            border: selectedImageIndex === idx ? '2px solid #0046be' : '1px solid #e0e6ef',
                            borderRadius: '8px',
                            position: 'relative',
                            cursor: 'pointer',
                            background: '#fff',
                            padding: '5px',
                            transition: 'all 0.2s'
                          }}
                        >
                          <Image
                            src={typeof img === 'string' ? img : (img as any).src || '/images/placeholder.jpg'}
                            alt="thumbnail"
                            fill
                            style={{ objectFit: 'contain', padding: '5px' }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Below The Fold - Tabs/Overview */}
                <div style={{ marginTop: '60px' }}>
                  <div style={{ borderBottom: '1px solid #c5cbd5', marginBottom: '30px', display: 'flex', gap: '40px' }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      borderBottom: '3px solid #0046be',
                      paddingBottom: '10px',
                      marginBottom: '-2px',
                      color: '#040c13',
                      cursor: 'pointer'
                    }}>Overview</h3>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      paddingBottom: '10px',
                      color: '#555',
                      cursor: 'pointer'
                    }}>Specifications</h3>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      paddingBottom: '10px',
                      color: '#555',
                      cursor: 'pointer'
                    }}>Reviews ({product.reviews || 85})</h3>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      paddingBottom: '10px',
                      color: '#555',
                      cursor: 'pointer'
                    }}>Q&A</h3>
                  </div>

                  <div className="row">
                    <div className="col-lg-8">
                      <div style={{ marginBottom: '40px' }}>
                        <h4 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#040c13' }}>Description</h4>
                        <div style={{ fontSize: '16px', lineHeight: '1.6', color: '#1d252c' }}>
                          {product.longDescription ? (
                            <div dangerouslySetInnerHTML={{ __html: product.longDescription }} />
                          ) : (
                            <p>{product.description}</p>
                          )}
                        </div>
                      </div>

                      <div style={{ backgroundColor: '#f0f2f4', padding: '30px', borderRadius: '12px' }}>
                        <h4 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Features</h4>
                        <ul style={{ padding: 0, listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                          {product.features?.map((f, i) => (
                            <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                              <i className="fas fa-check-circle" style={{ color: '#0046be', marginTop: '4px' }}></i>
                              <span style={{ fontSize: '15px' }}>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Buy Box (Sticky if possible) */}
              <div className="col-lg-4">
                <div style={{
                  border: '1px solid #e0e6ef',
                  borderRadius: '8px',
                  padding: '24px',
                  backgroundColor: '#fff',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  position: 'sticky',
                  top: '120px'
                }}>

                  {/* Price Info */}
                  <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #e0e6ef' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <span style={{ fontSize: '36px', fontWeight: '800', color: '#040c13' }}>
                        ₹{product.price.toLocaleString()}
                      </span>
                    </div>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div style={{ display: 'flex', flexDirection: 'column', marginTop: '5px' }}>
                        <span style={{ fontSize: '14px', color: '#555' }}>
                          Was <span style={{ textDecoration: 'line-through' }}>₹{product.originalPrice.toLocaleString()}</span>
                        </span>
                        <span style={{ fontSize: '14px', color: '#b1110e', fontWeight: '700', marginTop: '2px' }}>
                          Save ₹{(product.originalPrice - product.price).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Fulfillment */}
                  <div style={{ marginBottom: '25px' }}>
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', alignItems: 'flex-start' }}>
                      <div style={{ minWidth: '24px', textAlign: 'center' }}>
                        <i className="fas fa-store" style={{ fontSize: '20px', color: '#040c13' }}></i>
                      </div>
                      <div>
                        <strong style={{ display: 'block', fontSize: '15px', marginBottom: '2px' }}>Pickup</strong>
                        <span style={{ color: '#138a0c', fontWeight: '600', fontSize: '13px' }}>Order now for pickup tomorrow</span>
                        <div style={{ fontSize: '12px', color: '#555' }}>at <a href="#" style={{ color: '#0046be', fontWeight: '600', textDecoration: 'underline' }}>Nearby Store</a></div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                      <div style={{ minWidth: '24px', textAlign: 'center' }}>
                        <i className="fas fa-truck" style={{ fontSize: '20px', color: '#040c13' }}></i>
                      </div>
                      <div>
                        <strong style={{ display: 'block', fontSize: '15px', marginBottom: '2px' }}>Shipping</strong>
                        <span style={{ color: '#040c13', fontSize: '13px' }}>Free Shipping to <span style={{ color: '#0046be', fontWeight: '600' }}>Zip 96701</span></span>
                        <div style={{ fontSize: '12px', color: '#555' }}>Get it by <strong>Thu, Jan 16</strong></div>
                      </div>
                    </div>
                  </div>

                  {/* Main Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '25px' }}>
                    <button
                      onClick={handleAddToCart}
                      className="hover-brightness"
                      style={{
                        width: '100%',
                        backgroundColor: '#ffe000', // Matches Best Buy primary CTA
                        color: '#040c13',
                        fontWeight: '700',
                        border: 'none',
                        padding: '16px',
                        borderRadius: '4px',
                        fontSize: '16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <i className="fas fa-shopping-cart"></i>
                      {addedToCart ? 'Added to Cart' : 'Add to Cart'}
                    </button>
                  </div>

                  {/* Secondary Actions */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', borderTop: '1px solid #e0e6ef', paddingTop: '20px' }}>
                    <button style={{ background: 'none', border: 'none', color: '#0046be', fontWeight: '600', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <i className="fas fa-retweet"></i> Compare
                    </button>
                    <button style={{ background: 'none', border: 'none', color: '#0046be', fontWeight: '600', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <i className="far fa-bookmark"></i> Save
                    </button>
                  </div>

                  {/* Mini Specs */}
                  <div style={{ backgroundColor: '#f9f9fb', margin: '20px -24px -24px', padding: '20px', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', borderTop: '1px solid #e0e6ef' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>Highlights</h4>
                    <ul style={{ padding: 0, listStyle: 'none', fontSize: '13px' }}>
                      <li style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#555' }}>Screen</span>
                        <strong>14" OLED</strong>
                      </li>
                      <li style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#555' }}>CPU</span>
                        <strong>Intel Core Ultra 9</strong>
                      </li>
                      <li style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#555' }}>RAM</span>
                        <strong>32GB</strong>
                      </li>
                    </ul>
                    <a href="#" style={{ display: 'block', textAlign: 'center', color: '#0046be', fontSize: '13px', fontWeight: '600', marginTop: '15px' }}>See all specifications</a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
        <Footer />
        <Scrollbar />
      </div>
    </Fragment>
  );
};

export default ProductDetailPage;
