import React from 'react';
import Link from "next/link";
import Marquee from "react-fast-marquee";
import logo from '@/public/images/logo/logo07.svg';
import Image from 'next/image';

const Footer: React.FC = () => {
  return (
    <footer
      className="footer footer-style-six pb-80 bg_img pos-rel bg_img"
      style={{ backgroundImage: `url('/images/bg/da-footer.jpg')` }}
    >
      <div className="da-footer-title">
        <h2 className="title marquee-left">
          <Link href="/">
            <div className="marquee" style={{ cursor: 'pointer' }}>
              <div className="marquee-content">
                <Marquee speed={50} gradient={false}>
                  Book a Discover Call Now <span>Take advantage of our expert knowledge.</span>
                  Book a Discover Call Now <span>Take advantage of our expert knowledge.</span>
                </Marquee>
              </div>
            </div>
          </Link>
        </h2>
      </div>
      <div className="container">
        <div className="xb-footer">
          <div className="da-footer-inner ul_li_between mt-none-30">
            <div className="xb-item--left mt-10">
              <div className="xb-item--logo mt-20">
                {/* Remove <a>, just keep Image inside Link */}
                <Link href="/home-3" >
                  <Image src={logo} alt="Innomax Logo" />
                </Link>
              </div>
              <span className="xb-item--content mt-20">AI and Data Analytics solutions</span>
            </div>
            <ul className="xb-item--nav_item mt-30 list-unstyled ul_li">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/service">Services</Link></li>
              <li><Link href="/service">Case Study</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-copyright mt-40 ul_li_between">
            <p className="copyright">
              ©Copyright 2024 <Link href="/home-3">innomax</Link>. All rights reserved.
            </p>
            <ul className="footer-links ul_li">
              <li><Link href="/terms-conditions">Terms of Up</Link></li>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
