import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import './Checkout.css';

const PaymentSuccess = () => {
  const location = useLocation();
  const { email, orderId } = location.state || { email: 'your email', orderId: 'ORD-1234' };

  return (
    <div className="checkout-page-wrapper">
      <div className="checkout-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <div className="payment-success-card">
          <div className="success-icon">
            <FaCheckCircle style={{ color: '#22c55e', fontSize: '5rem' }} />
          </div>
          <h2>Payment Successful!</h2>
          <p>Thank you for your purchase. Your order is being processed.</p>
          <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>
            Order ID: <strong>{orderId}</strong>
          </p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            A confirmation email has been sent to <strong>{email}</strong>.
          </p>
          <Link to="/" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;