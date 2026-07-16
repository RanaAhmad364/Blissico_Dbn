import React from 'react';
import Marquee from '../components/Marquee';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Terms.css';

const Terms = () => {
  return (
    <div className="terms-page">
      <Marquee />
      <Navbar />
      
      {/* Pink Hero Header */}
      <section className="terms-hero">
        <h1>Terms &amp; Conditions</h1>
      </section>

      {/* Main Content */}
      <section className="terms-content">
        <p className="last-updated">Last Updated: June 2026</p>
        <p>
          Welcome to Blissico by Nimrah. By using our website or purchasing our products, you agree to the following terms.
        </p>

        <h3>Digital Products</h3>
        <p>
          All products are digital downloads only. No physical items will be shipped. Your files will be available instantly after successful payment through your account or via email.
        </p>

        <h3>Personal Use Only</h3>
        <p>
          All designs are for personal, non-commercial use. You may not resell, redistribute, edit for resale, or use any Blissico design for commercial purposes.
        </p>

        <h3>Signature Design Services</h3>
        <p>
          Custom Signature Design projects require full payment before work begins. Please submit your request at least 15 days before your event. A confirmation email will be sent within 24–48 hours, and final files will be delivered via blissicobynimrah@gmail.com. If you do not receive our email, please check your spam or junk folder.
        </p>

        <h3>Customer Responsibility</h3>
        <p>
          Please ensure that all names, dates, times, venues, and event details provided are accurate. Blissico is not responsible for errors resulting from incorrect information submitted by the customer.
        </p>

        <h3>Payments &amp; Refunds</h3>
        <p>
          All prices are listed in USD. Due to the nature of digital products and instant downloads, all sales are final. Refunds, exchanges, or cancellations are not available once an order has been placed.
        </p>

        <h3>Intellectual Property</h3>
        <p>
          All artwork, illustrations, and designs remain the property of Blissico by Nimrah and are protected by copyright laws. Unauthorized copying, sharing, or commercial use is strictly prohibited.
        </p>

        <h3>Changes to These Terms</h3>
        <p>
          Blissico reserves the right to update these Terms &amp; Conditions at any time. Continued use of the website constitutes acceptance of any changes.
        </p>

        <h3>Contact</h3>
        <p>
          For any questions regarding your order or these terms, please contact us at:<br />
          Blissico by Nimrah<br />
          Email: blissicobynimrah@gmail.com
        </p>
      </section>

      <Footer />
    </div>
  );
};

export default Terms;