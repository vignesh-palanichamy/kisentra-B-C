'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Fade } from 'react-awesome-reveal';
import { getProducts } from '@/api/products';
import ProductCard from '../ProductCard/ProductCard';
import hIcon from '@/public/images/icon/ser-01.svg';

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState(getProducts());
  
  useEffect(() => {
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

  // Filter visible products only
  const featuredProducts = products.filter(p => p.visible !== false).slice(0, 6);

  return (
    <section className="service pt-140 pb-140">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="sec-title--two text-center mb-60">
              <Fade direction="down" triggerOnce duration={1000}>
                <div>
                  <span className="sub-title">
                    <Image src={hIcon} alt="Featured products icon" />
                    Featured Products
                  </span>
                </div>
              </Fade>
              <Fade direction="up" triggerOnce duration={1200}>
                <div>
                  <h2 className="title">
                    Discover Our <br /> Premium Solutions
                  </h2>
                </div>
              </Fade>
              <Fade direction="up" triggerOnce duration={1400}>
                <div>
                  <p className="content">
                    Explore our curated selection of premium products designed to elevate your business.
                  </p>
                </div>
              </Fade>
            </div>
          </div>
        </div>

        <div className="row mt-none-30">
          {featuredProducts.map((product) => (
            <div key={product.Id} className="col-lg-4 col-md-6 mt-30">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="row mt-60">
          <div className="col-12 text-center">
            <Fade direction="up" triggerOnce duration={1600}>
              <div>
                <Link href="/products" className="thm-btn thm-btn--aso thm-btn--aso_yellow">
                  View All Products
                </Link>
              </div>
            </Fade>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;



