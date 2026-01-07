"use client";

import React from 'react';
import Link from "next/link";
import { Fade } from "react-awesome-reveal";
import Image from 'next/image';

import hImg from '@/public/images/shape/hero-glassisom2.png';

const Hero3: React.FC = () => {
  return (
    <section className="hero hero-style-six pos-rel pt-110">
      <div className="container">
        <div className="hero_wrap">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="xb-hero">
                
                {/* Heading */}
                <Fade direction="up" triggerOnce={false} duration={800} delay={6}>
                  <h1 className="xb-item--title wow fadeInUp" data-wow-delay="0ms" data-wow-duration="600ms">
                    Get AI and Data Analytics solutions With Innomax
                  </h1>
                </Fade>

                {/* Paragraph */}
                <Fade direction="up" triggerOnce={false} duration={1500} delay={9}>
                  <p className="xb-item--content wow fadeInUp" data-wow-delay="150ms" data-wow-duration="600ms">
                    Get greater clarity on the data that matters to you. And start making better informed decisions to help your business grow.
                  </p>
                </Fade>

                {/* CTA Button */}
                <Fade direction="up" triggerOnce={false} duration={1800} delay={9}>
                  <div className="xb-btn mt-50 wow fadeInUp" data-wow-delay="300ms" data-wow-duration="600ms">
                    <Link href="/contact" className="thm-btn thm-btn--fill_icon thm-btn--data">
                      <div className="xb-item--hidden">
                        <span className="xb-item--hidden-text">Book a Discover Call</span>
                      </div>
                      <div className="xb-item--holder">
                        <span className="xb-item--text xb-item--text1">Book a Discover Call</span>
                        <div className="xb-item--icon"><i className="fal fa-plus"></i></div>
                        <span className="xb-item--text xb-item--text2">Book a Discover Call</span>
                      </div>
                    </Link>
                  </div>
                </Fade>

              </div>
            </div>
          </div>
        </div>

        {/* Background shape */}
        <div className="xb-shape">
          <Image src={hImg} alt="Hero Background Shape" />
        </div>
      </div>
    </section>
  );
};

export default Hero3;
