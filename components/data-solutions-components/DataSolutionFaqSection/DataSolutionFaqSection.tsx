'use client';

import React, { useState } from "react";
import Link from "next/link";

interface Faq {
  number: string;
  question: string;
  answer: string;
}

const FaqSection: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setActiveFaq(prev => (prev === index ? null : index));
  };

  const faqsLeft: Faq[] = [
    {
      number: "1",
      question: "What services does Innomax offer?",
      answer:
        "Data integration, AI-powered insights, predictive analytics, and business intelligence.",
    },
    {
      number: "2",
      question: "How will Innomax’s solutions help my business?",
      answer: "By turning data into actionable insights for growth.",
    },
    {
      number: "3",
      question: "What types of data can be analyzed?",
      answer: "All major data sources, unified into a single view.",
    },
    {
      number: "4",
      question: "Why are AI and Data Analytics important?",
      answer: "They enable smarter, faster decisions.",
    },
  ];

  const faqsRight: Faq[] = [
    {
      number: "5",
      question: "Can Innomax solutions be customized?",
      answer: "Yes, tailored to fit unique business needs.",
    },
    {
      number: "6",
      question: "How secure is my data with Innomax?",
      answer: "Innomax ensures top-level data security.",
    },
    {
      number: "7",
      question: "What industries does Innomax support?",
      answer: "Suitable for finance, retail, healthcare, and more.",
    },
    {
      number: "8",
      question: "How quickly can I see results?",
      answer: "Many clients notice improvements within weeks.",
    },
  ];

  const renderFaqs = (faqs: Faq[], offset: number) =>
    faqs.map((faq, index) => {
      const currentIndex = index + offset;
      const isActive = activeFaq === currentIndex;

      return (
        <li
          key={faq.number}
          className={`accordion block ${isActive ? "active-block" : ""}`}
        >
          <div
            className={`acc-btn ${isActive ? "active" : ""}`}
            onClick={() => toggleFaq(currentIndex)}
          >
            <span className="number">{faq.number}</span>
            {faq.question}
            <span className="arrow"></span>
          </div>
          <div
            className="acc_body"
            style={{
              maxHeight: isActive ? "1000px" : "0",
              overflow: "hidden",
              transition: "max-height 0.3s ease",
            }}
          >
            <div className="content">
              <p>{faq.answer}</p>
            </div>
          </div>
        </li>
      );
    });

  return (
    <section
      className="faq pt-150 pb-115"
      style={{ backgroundColor: "#f4f5fc" }}
    >
      <div className="container">
        <div className="da-sec-titlte text-center mb-30">
          <h2 className="title">Your Questions, Answered!</h2>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <div className="da-left-faq">
              <div className="xb-faq xb-faq-two da-faq">
                <ul className="accordion_box clearfix list-unstyled">
                  {renderFaqs(faqsLeft, 0)}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="da-right-faq">
              <div className="xb-faq xb-faq-two da-faq">
                <ul className="accordion_box clearfix list-unstyled">
                  {renderFaqs(faqsRight, faqsLeft.length)}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="xb-btn text-center mt-70">
          <Link
            href="/contact"
            className="thm-btn thm-btn--fill_icon thm-btn--data thm-btn--data_blue"
          >
            <div className="xb-item--hidden">
              <span className="xb-item--hidden-text">Book a Discover Call</span>
            </div>
            <div className="xb-item--holder">
              <span className="xb-item--text xb-item--text1">
                Book a Discover Call
              </span>
              <div className="xb-item--icon">
                <i className="fal fa-plus"></i>
              </div>
              <span className="xb-item--text xb-item--text2">
                Book a Discover Call
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
