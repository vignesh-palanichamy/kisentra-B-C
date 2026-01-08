'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import MobileMenu from '../MobileMenu/MobileMenu';
import MegaMenu1 from './MegaMenu1';
import MegaMenu2 from './MegaMenu2';
import { useCart } from '@/contexts/CartContext';

const Header: React.FC = () => {
  const [mobailActive, setMobailState] = useState(false);
  const [isSticky, setSticky] = useState(false);
  const { getTotalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const SubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div id="xb-header-area" className="header-area header-style-two header-transparent">
      {/* Top bar */}
      <div className="header-top">
        <span>
          Get 15% off on all annual plans until September 30! Join Texpo as we transform SEO 🚀
        </span>
        <span>
          <Link href="/">Learn more</Link>
          <i className="far fa-angle-right" />
        </span>
        <div className="header-shape">
          <div className="shape shape--one">
            <Image src="/images/shape/trangle-shape.png" alt="Shape 1" width={50} height={50} />
          </div>
          <div className="shape shape--two">
            <Image src="/images/shape/trangle-shape.png" alt="Shape 2" width={50} height={50} />
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className={`xb-header stricky ${isSticky ? 'stricked-menu stricky-fixed' : ''}`}>
        <div className="container">
          <div className="header__wrap ul_li_between">
            {/* Logo */}
            <div className="header-logo">
              <Link href="/">
                <Image src="/images/logo/logo-black.svg" alt="Texpo Logo" width={150} height={50} />
              </Link>
            </div>

            {/* Main Menu */}
            <div className="main-menu__wrap ul_li navbar navbar-expand-xl">
              <nav className="main-menu collapse navbar-collapse">
                <ul>
                  <li><Link href="/"><span>Home</span></Link></li>

                  <li className="menu-item-has-children">
                    <Link href="/products"><span>Shop</span></Link>
                    <ul className="submenu">
                      <li><Link href="/products"><span>All Products</span></Link></li>
                      <li><Link href="/cart"><span>Shopping Cart</span></Link></li>
                    </ul>
                  </li>

                  <li><Link href="/contact"><span>Contact</span></Link></li>
                </ul>
              </nav>

              {/* Mobile Menu Wrapper */}
              <div className="xb-header-wrap">
                <div className={`xb-header-menu ${mobailActive ? 'active' : ''}`}>
                  <div className="xb-header-menu-scroll lenis lenis-smooth">
                    <div className="xb-menu-close xb-hide-xl xb-close" onClick={() => setMobailState(!mobailActive)} />
                    <div className="xb-logo-mobile xb-hide-xl">
                      <Link href="/" rel="home">
                        <Image src="/images/logo/logo-black.svg" alt="Mobile Logo" width={150} height={50} />
                      </Link>
                    </div>
                    <div className="xb-header-mobile-search xb-hide-xl">
                      <form role="search" onSubmit={SubmitHandler}>
                        <input type="text" placeholder="Search..." name="s" className="search-field" />
                        <button className="search-submit" type="submit">
                          <i className="far fa-search" />
                        </button>
                      </form>
                    </div>
                    <nav className="xb-header-nav">
                      <MobileMenu />
                    </nav>
                  </div>
                </div>
                <div className="xb-header-menu-backdrop"></div>
              </div>
            </div>

            {/* Mobile toggle button & Cart */}
            <div className="header-bar-mobile side-menu d-xl-none ul_li" style={{ gap: '15px', alignItems: 'center' }}>
              <Link href="/cart" className="cart-icon" style={{
                position: 'relative',
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                color: 'var(--color-heading)'
              }}>
                <i className="fas fa-shopping-cart" style={{ fontSize: '20px' }}></i>
                {getTotalItems() > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    backgroundColor: 'var(--color-primary-two)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '700'
                  }}>
                    {getTotalItems()}
                  </span>
                )}
              </Link>
              <button className="xb-nav-mobile" onClick={() => setMobailState(!mobailActive)}>
                <i className="far fa-bars" />
              </button>
            </div>

            {/* Cart & CTA */}
            <div className="header-contact d-none d-md-flex ul_li" style={{ gap: '15px', alignItems: 'center' }}>
              <Link href="/cart" className="cart-icon" style={{
                position: 'relative',
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                color: 'var(--color-heading)'
              }}>
                <i className="fas fa-shopping-cart" style={{ fontSize: '20px' }}></i>
                {getTotalItems() > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    backgroundColor: 'var(--color-primary-two)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '700'
                  }}>
                    {getTotalItems()}
                  </span>
                )}
              </Link>
              <Link href="/contact" className="thm-btn thm-btn--aso thm-btn--header-black">
                Let's talk
                <Image src="/images/icon/sms-white-icon01.svg" alt="Message Icon" width={20} height={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
