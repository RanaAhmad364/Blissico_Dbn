import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaArrowLeft, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { assetUrl } from '../../api/Catalog';
import api from '../../api/axiosConfig';
import './AddToCart.css';

const AddToCart = () => {
  const { items, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const subtotal = items.reduce((acc, item) => acc + (item.is_free ? 0 : Number(item.price)), 0);
  const total = subtotal; // digital downloads — no shipping

  const handleCheckout = async () => {
    setError('');
    setPlacing(true);
    try {
      const res = await api.post('/api/orders', { card_ids: items.map((i) => i.id) });
      clearCart();
      navigate(`/checkout/${res.data.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create your order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="cart-page-wrapper">
      <div className="cart-page-header">
        <div className="cart-header-content">
          <Link to="/cards" className="back-to-shop"><FaArrowLeft /> Back to Shop</Link>
          <h1>Shopping Cart</h1>
          <p>{items.length} Items in your cart</p>
        </div>
      </div>

      <div className="cart-container">
        <div className="cart-items-section">
          {items.length === 0 ? (
            <div className="empty-cart">
              <FaShoppingBag className="empty-cart-icon" />
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added any cards to your cart yet.</p>
              <Link to="/cards" className="shop-now-btn">Shop Now</Link>
            </div>
          ) : (
            items.map((item) => (
              <div className="cart-item-card" key={item.id}>
                <div className="cart-item-image">
                  <img src={assetUrl(item.thumbnail)} alt={item.title} />
                </div>
                <div className="cart-item-details">
                  <h4>{item.title}</h4>
                  <p className="item-price">{item.is_free ? 'Free' : `$${Number(item.price).toFixed(2)}`}</p>
                  <div className="cart-item-actions">
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                      <FaTrashAlt /> Remove
                    </button>
                  </div>
                </div>
                <div className="cart-item-total">
                  {item.is_free ? 'Free' : `$${Number(item.price).toFixed(2)}`}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-summary-section">
          <div className="summary-card">
            <h3>Order Summary</h3>
            <div className="summary-row"><span>Subtotal ({items.length} items)</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="summary-divider"></div>
            <div className="summary-row total-row"><span>Total</span><span>${total.toFixed(2)}</span></div>

            {error && <div style={{ color: '#c0392b', margin: '10px 0' }}>{error}</div>}

            <button className="checkout-btn" onClick={handleCheckout} disabled={items.length === 0 || placing}>
              {placing ? 'Creating Order...' : 'Proceed to Checkout'}
            </button>
            <div className="secure-badge">
              <span>🔒 Secured Checkout</span>
              <span>PayPal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCart;