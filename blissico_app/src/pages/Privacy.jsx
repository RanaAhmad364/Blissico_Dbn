import React from 'react';
import Marquee from '../components/Marquee';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import './Privacy.css';

const Privacy = () => {
  return (
    <div className="privacy-page">
      <Marquee />
      <Navbar />
      
      {/* Pink Hero Header */}
      <section className="privacy-hero">
        <h1>Privacy Policy</h1>
      </section>

      {/* Main Content */}
      <section className="privacy-content">
        <p className="last-updated">Last Updated: June 2026</p>
        <p>
          At Blissico by Nimrah, your privacy matters. This Privacy Policy explains how we collect, use, and protect your information when you visit our website or place an order.
        </p>

        <h3>Information We Collect</h3>
        <p>
          We may collect personal details such as your name, email address, phone number, billing information, and any event details you provide for personalized designs.
        </p>

        <h3>How We Use Your Information</h3>
        <p>Your information is used to:</p>
        <ul>
          <li>Process and deliver your orders.</li>
          <li>Provide customer support.</li>
          <li>Communicate updates regarding your purchase.</li>
          <li>Improve our products and website experience.</li>
        </ul>

        <h3>Data Protection</h3>
        <p>
          We take reasonable measures to protect your personal information and do not sell, rent, or trade your data to third parties.
        </p>

        <h3>Cookies</h3>
        <p>
          Our website may use cookies and similar technologies to improve functionality and enhance your browsing experience.
        </p>

        <h3>Third-Party Services</h3>
        <p>
          Payments are processed through secure third-party payment providers. We only share the information necessary to complete your transaction.
        </p>

        <h3>Your Consent</h3>
        <p>
          By using our website, you agree to this Privacy Policy and the collection and use of your information as described above.
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

export default Privacy;