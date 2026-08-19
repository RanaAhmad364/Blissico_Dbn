import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaLock } from 'react-icons/fa';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import api from '../../api/axiosConfig';
import './Checkout.css';

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

const Checkout = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/api/orders/${orderId}`)
      .then((res) => setOrder(res.data.data))
      .catch(() => setError('Could not load this order.'))
      .finally(() => setLoading(false));
  }, [orderId]);

  const createPayPalOrder = async () => {
    const res = await api.post(`/api/orders/${orderId}/paypal/create-order`);
    return res.data.data.paypal_order_id;
  };

  const onApprove = async (data) => {
    const res = await api.post(`/api/orders/${orderId}/paypal/capture-order`, {
      paypal_order_id: data.orderID,
    });
    if (res.data.success) {
      navigate('/payment-success', { state: { orderId: order.order_number } });
    } else {
      setError(res.data.message || 'Payment could not be completed.');
    }
  };

  if (loading) return <div style={{ padding: 80, textAlign: 'center' }}>Loading...</div>;
  if (error && !order) return <div style={{ padding: 80, textAlign: 'center' }}>{error}</div>;

  return (
    <div className="checkout-page-wrapper">
      <div className="checkout-header">
        <div className="checkout-header-content">
          <Link to="/cart" className="back-to-cart"><FaArrowLeft /> Back to Cart</Link>
          <h1>Checkout</h1>
          <p>Complete your order securely</p>
        </div>
      </div>

      <div className="checkout-container">
        <div className="checkout-grid">
          <div className="checkout-form-section">
            <div className="form-card">
              <h3>Order #{order.order_number}</h3>
              {order.items.map((item) => (
                <div className="summary-item" key={item.card_id}>
                  <span className="item-name">{item.title}</span>
                  <span className="item-price">${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {error && <div style={{ color: '#c0392b', margin: '12px 0' }}>{error}</div>}

            <div className="form-card">
              <h3>Pay with PayPal</h3>
              {PAYPAL_CLIENT_ID ? (
                <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: 'USD' }}>
                  <PayPalButtons
                    style={{ layout: 'vertical' }}
                    createOrder={createPayPalOrder}
                    onApprove={onApprove}
                    onError={() => setError('PayPal encountered an error. Please try again.')}
                  />
                </PayPalScriptProvider>
              ) : (
                <p style={{ color: '#888' }}>
                  PayPal isn't configured yet — set VITE_PAYPAL_CLIENT_ID once you have sandbox credentials.
                </p>
              )}
            </div>
          </div>

          <div className="checkout-summary-section">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-divider"></div>
              <div className="summary-row total-row"><span>Total</span><span>${order.total_amount.toFixed(2)}</span></div>
              <div className="secure-checkout-badge"><FaLock /> All transactions are secure.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;