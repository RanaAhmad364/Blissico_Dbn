import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import './FAQ.css';


const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How does Blissico work?",
      answer: "Browse our collection, choose your favorite design, personalize it with your details, complete your purchase, and instantly download your digital files."
    },
    {
      question: "Are the cards personalized?",
      answer: "Yes. Every card can be personalized with your names, dates, messages, and other event details using our online editor before checkout."
    },
    {
      question: "How long does it take to receive my card?",
      answer: "Most digital cards are available for instant download immediately after your payment is confirmed."
    },
    {
      question: "Can I print my card?",
      answer: "Absolutely. All printable designs are provided in high-resolution, print-ready formats, making them suitable for home printing or any professional print shop."
    },
    {
      question: "What is Signature Design?",
      answer: "Signature Design is our exclusive custom design service for clients looking for a completely bespoke card. Every design is created from scratch by Nimrah to reflect your unique celebration, style, and vision."
    },
    {
      question: "Can I request a completely custom design?",
      answer: "Yes. If you're looking for something truly one of a kind, our Signature Design service is the perfect choice. Simply complete the inquiry form, and we'll create a design tailored exclusively for your occasion. For Signature Design orders, you'll receive a confirmation email within 24–48 hours, and delivery timelines will depend on your project requirements."
    },
    {
      question: "Do you offer refunds?",
      answer: "Due to the personalized nature of our digital products and services, all purchases are non-refundable. If you experience any issues with your order, please contact us, and we'll be happy to help find a solution."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqs.map((faq, idx) => (
          <div 
            key={idx} 
            className={`faq-item ${activeIndex === idx ? 'active' : ''}`} 
            onClick={() => toggleFAQ(idx)}
          >
            <div className="faq-question">
              <span>{faq.question}</span>
              <FaChevronDown className={`faq-icon ${activeIndex === idx ? 'rotate' : ''}`} />
            </div>
            {activeIndex === idx && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;