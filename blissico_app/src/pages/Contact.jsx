import React, { useState } from 'react';
import Marquee from '../components/Marquee';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axiosConfig';
import './ContactPage.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await api.post('/api/contact', formData);
      setStatus({ type: 'success', message: response.data.message || 'Your message has been sent.' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Unable to send your message right now.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <Marquee />
      <Navbar />

      <section className="contact-hero">
        <h1>Contact Us</h1>
      </section>

      <section className="contact-form-section">
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="Optional" />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="6" value={formData.message} onChange={handleChange} required />
          </div>

          {status.message && (
            <div className={`contact-status ${status.type === 'success' ? 'success' : 'error'}`}>
              {status.message}
            </div>
          )}

          <button type="submit" className="send-btn" disabled={submitting}>
            {submitting ? 'Sending...' : 'Send'}
          </button>
        </form>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;