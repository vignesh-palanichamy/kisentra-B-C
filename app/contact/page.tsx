'use client';

import React from 'react';
import ContactSection from '../../components/ContactSection';
import Header from '../../components/header/Header';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Footer from '../../components/footer/Footer';
import CtaSection from '../../components/CtaSection/CtaSection';
import icon from '@/public/images/icon/music-icon.svg';
import bImg1 from '@/public/images/hero/contact-img.png';
import bImg2 from '@/public/images/shape/brd_shape.png';
import Image from 'next/image';

const ContactPage: React.FC = () => {
  return (
    <>
      <div className="body_wrap sco_agency">
        <Header />
        <section
          className="page-title pt-200 pos-rel bg_img"
          style={{ backgroundImage: `url('/images/bg/page_bg01.jpg')` }}
        >
          <div className="container">
            <div className="page-title-wrap sd-title-wrap">
              <div className="row mt-none-30 align-items-end">
                <div className="col-lg-9 mt-30">
                  <div className="page-title-box">
                    <span className="sub-title">
                      <Image src={icon} alt="Contact Icon" /> Contact us
                    </span>
                    <h2 className="title">
                      Connect with our team for <br />
                      innovative solutions and <br />
                      your digital success
                    </h2>
                  </div>
                </div>
                <div className="col-lg-3 mt-30">
                  <div className="sd-right-img pos-rel">
                    <Image src={bImg1} alt="Contact Illustration" />
                    <div className="sd-arrow-shape style-3">
                      <Image className="xbzoominzoomup" src={bImg2} alt="Arrow Decoration" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <ContactSection />
        <CtaSection />
      </div>
      <Footer />
      <Scrollbar />
    </>
  );
};

export default ContactPage;
