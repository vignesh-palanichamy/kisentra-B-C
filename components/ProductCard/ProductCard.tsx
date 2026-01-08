'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Fade } from 'react-awesome-reveal';
import { Product } from '@/api/products';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);
  
  // Safely get the main image with fallback
  const getMainImage = () => {
    if (!product.images || product.images.length === 0) {
      return '/images/placeholder.jpg'; // Fallback placeholder
    }
    
    const firstImage = product.images[0];
    if (typeof firstImage === 'string') {
      return firstImage;
    }
    
    // Handle StaticImageData or object with src property
    if (firstImage && typeof firstImage === 'object') {
      return (firstImage as any).src || firstImage;
    }
    
    return '/images/placeholder.jpg'; // Final fallback
  };
  
  const mainImage = getMainImage();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <Fade direction="up" triggerOnce duration={600}>
      <div className="product-card-wrapper">
        <div className="service-box product-card">
          <div className="service-item product-card-item">
            {/* Product Image - Clickable to go to details */}
            <Link href={`/products/${product.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
              <div className="product-card-image">
                <Image
                  src={mainImage}
                  alt={product.title}
                  width={300}
                  height={300}
                  style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                />
              </div>
            </Link>
            
            {/* Product Title - Clickable to go to details */}
            <div className="xb-item--holder mb-30 mt-30">
              <Link href={`/products/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3 className="xb-item--title">{product.title}</h3>
              </Link>
              <span className="xb-item--contact">{product.description}</span>
            </div>

            <div className="product-card-footer ul_li_between">
              <div className="product-price">
                <span className="current-price">${product.price}</span>
                {product.originalPrice && (
                  <span className="original-price">${product.originalPrice}</span>
                )}
              </div>
              
              {product.rating && (
                <div className="product-rating">
                  <i className="fas fa-star"></i>
                  <span>{product.rating}</span>
                  {product.reviews && <span className="reviews-count">({product.reviews})</span>}
                </div>
              )}
            </div>

            {/* Add to Cart Button - Works directly without navigation */}
            <div className="product-card-actions mt-30">
              <button
                onClick={handleAddToCart}
                className="thm-btn thm-btn--aso thm-btn--aso_yellow w-100"
                style={{ width: '100%' }}
              >
                {addedToCart ? (
                  <>
                    <i className="fas fa-check" style={{ marginRight: '8px' }}></i>
                    Added!
                  </>
                ) : (
                  'Add to Cart'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fade>
  );
};

export default ProductCard;



