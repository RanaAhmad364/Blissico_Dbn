import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaLock, FaCreditCard, FaPaypal } from 'react-icons/fa';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();

  // --- Mock Data from Cart ---
  const [orderSummary] = useState({
    subtotal: 49.97,
    shipping: 5.00,
    tax: 2.50,
    total: 57.47,
    items: [
      { name: 'Birthday Card - Floral Delight', price: 14.99, qty: 1 },
      { name: 'Wedding Invitation - Elegant Gold', price: 19.99, qty: 2 },
    ]
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'paypal'
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // --- YEHA BACKEND SE PAYMENT INTEGRATION HOGI ---
    // Payment successful hone ke baad:
    setTimeout(() => {
      setLoading(false);
      // 🚀 REDIRECT TO SEPARATE SUCCESS PAGE
      navigate('/payment-success', { 
        state: { 
          email: formData.email,
          orderId: 'ORD-' + Math.floor(Math.random() * 10000)
        } 
      });
    }, 2000);
  };

  return (
    <div className="checkout-page-wrapper">
      <div className="checkout-header">
        <div className="checkout-header-content">
          <Link to="/cart" className="back-to-cart">
            <FaArrowLeft /> Back to Cart
          </Link>
          <h1>Checkout</h1>
          <p>Complete your order securely</p>
        </div>
      </div>

      <div className="checkout-container">
        <form onSubmit={handleSubmit} className="checkout-grid">
          
          {/* LEFT: Form */}
          <div className="checkout-form-section">
            <div className="form-card">
              <h3>Shipping Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="John" />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Doe" />
                </div>
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+1 234 567 890" />
              </div>
              <div className="form-group">
                <label>Street Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} required placeholder="123 Main St" />
              </div>
              <div className="form-row">
                <div className="form-group"><label>City</label><input type="text" name="city" value={formData.city} onChange={handleChange} required /></div>
                <div className="form-group"><label>State</label><input type="text" name="state" value={formData.state} onChange={handleChange} required /></div>
                <div className="form-group"><label>ZIP Code</label><input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} required /></div>
              </div>
            </div>

            <div className="form-card">
              <h3>Payment Method</h3>
              <div className="payment-options">
                <label className={`payment-option ${formData.paymentMethod === 'paypal' ? 'selected' : ''}`}>
                  <input type="radio" name="paymentMethod" value="paypal" checked={formData.paymentMethod === 'paypal'} onChange={handleChange} />
                  <FaPaypal className="payment-icon" /> PayPal
                </label>
                <label className={`payment-option ${formData.paymentMethod === 'credit' ? 'selected' : ''}`}>
                  <input type="radio" name="paymentMethod" value="credit" checked={formData.paymentMethod === 'credit'} onChange={handleChange} />
                  <FaCreditCard className="payment-icon" /> Credit Card
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT: Summary */}
          <div className="checkout-summary-section">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-items">
                {orderSummary.items.map((item, index) => (
                  <div className="summary-item" key={index}>
                    <span className="item-name">{item.name} <span className="item-qty">x{item.qty}</span></span>
                    <span className="item-price">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row"><span>Subtotal</span><span>${orderSummary.subtotal.toFixed(2)}</span></div>
              <div className="summary-row"><span>Shipping</span><span>${orderSummary.shipping.toFixed(2)}</span></div>
              <div className="summary-row"><span>Tax</span><span>${orderSummary.tax.toFixed(2)}</span></div>
              <div className="summary-divider"></div>
              <div className="summary-row total-row"><span>Total</span><span>${orderSummary.total.toFixed(2)}</span></div>
              <button type="submit" className="place-order-btn" disabled={loading}>
                {loading ? 'Processing...' : `Place Order • $${orderSummary.total.toFixed(2)}`}
              </button>
              <div className="secure-checkout-badge"><FaLock /> All transactions are secure.</div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Checkout;