import React from 'react';
import { blogs } from '../../../api/blogs';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';

interface Blog {
  slug: string;
  screens: string | StaticImageData; // accept string or StaticImageData
  create_at: string;
  title: string;
}

const DataSolutioBlogSection: React.FC = () => {
  return (
    <section
      className="blog pos-rel pb-150 bg_img"
      style={{ backgroundImage: `url('/images/bg/da-blog_bg.png')` }}
    >
      <div className="container">
        <div className="da-blog-wrapper">
          <div className="da-sec-titlte text-center mb-60">
            <h2 className="title">
              Great AI & data analytics <br /> resources
            </h2>
          </div>
          <div className="row mt-none-40">
            {blogs.slice(0, 6).map((blog, index) => {
              const imageSrc =
                typeof blog.screens === 'string' ? blog.screens : blog.screens.src;

              return (
                <div className="col-lg-4 col-md-6 mt-40" key={index}>
                  <div className="da-blog-item">
                    <div className="xb-item--img">
                      <Link href={`/blog/${blog.slug}`}>
                        <Image
                          src={imageSrc}
                          alt={blog.title || 'Blog image'}
                          width={400}
                          height={250}
                          style={{ objectFit: 'cover' }}
                        />
                      </Link>
                    </div>
                    <div className="xb-item--holder">
                      <span className="xb-item--date">
                        Published on {blog.create_at}
                      </span>
                      <h2 className="xb-item--title border-effect">
                        <Link href={`/blog/${blog.slug}`} className="blog-title-link">
                          {blog.title}
                        </Link>
                      </h2>
                      <Link href={`/blog/${blog.slug}`} className="xb-item--arrow">
                        <span>
                          <i className="fal fa-arrow-right"></i>
                        </span>{' '}
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="xb-btn text-center mt-70">
            <Link
              href="/blog"
              className="thm-btn thm-btn--fill_icon thm-btn--data thm-btn--data-strock_white"
            >
              <div className="xb-item--hidden">
                <span className="xb-item--hidden-text">View More Insights</span>
              </div>
              <div className="xb-item--holder">
                <span className="xb-item--text xb-item--text1">View More Insights</span>
                <div className="xb-item--icon">
                  <i className="fal fa-plus"></i>
                </div>
                <span className="xb-item--text xb-item--text2">View More Insights</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataSolutioBlogSection;
