import React from 'react';
import { Fade } from 'react-awesome-reveal';
import Link from 'next/link';
import Image from 'next/image';

import sIcon1 from '@/public/images/icon/ser-01.svg';
import brand1 from '@/public/images/award/ap-brand01.jpg';
import brand2 from '@/public/images/award/ap-brand02.jpg';
import brand3 from '@/public/images/award/ap-brand03.jpg';
import brand4 from '@/public/images/award/ap-brand04.jpg';
import brand5 from '@/public/images/award/ap-brand05.jpg';
import brand6 from '@/public/images/award/ap-brand06.jpg';
import brand7 from '@/public/images/award/ap-brand07.jpg';
import brand8 from '@/public/images/award/ap-brand08.jpg';
import brand9 from '@/public/images/award/ap-brand09.jpg';
import brand10 from '@/public/images/award/ap-brand10.jpg';

const AwardSection: React.FC = () => {
  return (
    <section className="award" style={{ backgroundColor: "#f6f6f8" }}>
      <div className="container">
        <div className="row mt-none-30 align-items-center">
          <div className="col-xl-6 col-lg-5 mt-30">
            <div className="service-info ab-award-content pt-100">
              <div className="sec-title--two">
                <Fade direction="down" triggerOnce duration={1000} delay={9}>
                  <div>
                    <span className="sub-title wow fadeInDown" data-wow-duration="600ms">
                      <Image src={sIcon1} alt="Award Icon" /> Our awards
                    </span>
                  </div>
                </Fade>
                <Fade direction="up" triggerOnce duration={1200} delay={9}>
                  <div>
                    <h2 className="title wow skewIn" data-wow-delay="100ms" data-wow-duration="600ms">
                      We've got prestigious awards for our work
                    </h2>
                  </div>
                </Fade>
                <Fade direction="up" triggerOnce duration={1200} delay={9}>
                  <div>
                    <p className="content wow fadeInUp" data-wow-delay="300ms" data-wow-duration="600ms">
                      Receiving prestigious awards for our work is a testament to our unwavering dedication and commitment
                      to excellence. These accolades reflect the tireless efforts and passion.
                    </p>
                  </div>
                </Fade>
              </div>
              <Fade direction="up" triggerOnce duration={1200} delay={9}>
                <div>
                  <div className="xb-btn mt-50 wow fadeInUp" data-wow-delay="450ms" data-wow-duration="600ms">
                    <Link href="/contact" className="thm-btn thm-btn--aso thm-btn--aso_yellow">
                      Book a free consultation
                    </Link>
                  </div>
                </div>
              </Fade>
            </div>
          </div>

          <div className="col-xl-6 col-lg-7 mt-30">
            <div className="ap-award-wrap ul_li">
              {[
                [brand1, brand2, brand3, brand1, brand2, brand3],
                [brand4, brand5, brand6, brand7, brand4, brand5],
                [brand8, brand9, brand10, brand8, brand9, brand10]
              ].map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className={`ap-award-inner ${rowIndex === 1 ? 'marquee-2' : 'marquee-first'}`}
                >
                  {row.map((brand, i) => (
                    <div className="ap-award-item" key={i}>
                      <div className="xb-img">
                        <Image src={brand} alt={`Brand ${rowIndex}-${i}`} />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AwardSection;
