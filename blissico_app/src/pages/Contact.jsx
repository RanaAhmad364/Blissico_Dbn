import React from 'react';
import Marquee from '../components/Marquee';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ContactPage.css';
const Contact = () => {
  return (
    <div className="contact-page">
      <Marquee />
      <Navbar />
      
      {/* Pink Hero Header */}
      <section className="contact-hero">
        <h1>Contact Us</h1>
      </section>

      {/* Form Section */}
      <section className="contact-form-section">
        <form className="contact-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" rows="6"></textarea>
          </div>

          <button type="submit" className="send-btn">Send</button>
        </form>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;