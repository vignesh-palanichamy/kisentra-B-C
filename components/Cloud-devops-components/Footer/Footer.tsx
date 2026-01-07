'use client';

import React, { FormEvent } from 'react';
import Link from 'next/link';
import Marquee from 'react-fast-marquee';
import Image from 'next/image';

import shape1 from '@/public/images/shape/cd-newslatter01.png';
import shape2 from '@/public/images/shape/cd-newslatter02.png';
import logo from '@/public/images/logo/logo05.svg';

const SubmitHandler = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // You can add form submission logic here
};

const Footer: React.FC = () => {
  return (
    <footer className="footer footer-style-five pt-140 pos-rel">
      <div className="container">
        <div className="xb-footer">
          {/* Newsletter Section */}
          <div className="cd-newslatter-wrap pos-rel">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="cd-newslatter text-center">
                  <h2 className="xb-item--title">Subscribe to our newsletter</h2>
                  <p className="xb-item--content">
                    Stay up-to-date with insights, updates, and offers.
                  </p>
                  <form className="xb-item--input_field" onSubmit={SubmitHandler}>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="you@example.com"
                      required
                    />
                    <button type="submit" className="xb-item--button">
                      Subscribe
                    </button>
                  </form>
                  <div className="xb-item--privacy">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="agree"
                        required
                      />
                      <label className="form-check-label" htmlFor="agree">
                        I agree to the <Link href="/privacy-policy">Privacy Policy</Link> and{' '}
                        <Link href="/terms-conditions">Terms</Link>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shapes */}
            <div className="cb-shape">
              <div className="shape shape--one">
                <Image src={shape1} alt="Decorative Shape 1" />
              </div>
              <div className="shape shape--two">
                <Image src={shape2} alt="Decorative Shape 2" />
              </div>
            </div>
          </div>

          {/* Footer Main */}
          <div className="footer-inner mt-120 ul_li_between mt-none-30">
            <div className="footer-widget mt-30">
              <div className="xb-logo">
                <Image src={logo} alt="Company Logo" />
              </div>
              <p className="xb-content">
                We create award-winning products for startups and assist enterprises with digital
                transformation. Our team has expertise in building scalable, impactful solutions.
              </p>
            </div>
            <ul className="footer-link ul_li mt-30">
              <li><span>Follow us</span></li>
              <li><Link href="#"><i className="fab fa-twitter"></i></Link></li>
              <li><Link href="#"><i className="fab fa-medium-m"></i></Link></li>
              <li><Link href="#"><i className="fab fa-instagram"></i></Link></li>
              <li><Link href="#"><i className="fab fa-linkedin-in"></i></Link></li>
            </ul>
          </div>

          {/* Copyright */}
          <div className="footer-copyright mb-60 ul_li_between">
            <p className="copyright mb-30">
              © 2025 <Link href="/">Innomax</Link>. All rights reserved.
            </p>
            <ul className="footer-links ul_li mb-30">
              <li><Link href="/terms-conditions">Terms of Use</Link></li>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom CTA Marquee */}
      <div className="footer-bottom pos-rel o-hidden">
        <Link href="/contact" className="title marquee-left" aria-label="Book a free consultation">
          <Marquee speed={50} gradient={false}>
            Book a free consultation Book a free consultation Book a free consultation Book a free consultation
          </Marquee>
        </Link>
        <Link href="/contact" className="footer-btn" aria-label="Let’s discuss about that">
          <i className="far fa-long-arrow-right"></i>
          <span>
            Let’s Discuss <br />
            about that
          </span>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
