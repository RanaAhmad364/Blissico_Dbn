import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrashAlt, FaArrowLeft, FaShoppingBag } from 'react-icons/fa';
import './AddToCart.css';

const AddToCart = () => {
  // Mock state for cart items (Later fetch from backend)
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Birthday Card - Floral Delight',
      price: 14.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=200&auto=format&fit=crop',
      options: 'Size: 5x7 inch'
    },
    {
      id: 2,
      name: 'Wedding Invitation - Elegant Gold',
      price: 19.99,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=200&auto=format&fit=crop',
      options: 'Size: 5x7 inch'
    }
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => 
      prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
    );
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 5.00;
  const total = subtotal + shipping;

  return (
    <div className="cart-page-wrapper">
      {/* --- Page Header --- */}
      <div className="cart-page-header">
        <div className="cart-header-content">
          <Link to="/cards" className="back-to-shop">
            <FaArrowLeft /> Back to Shop
          </Link>
          <h1>Shopping Cart</h1>
          <p>{cartItems.length} Items in your cart</p>
        </div>
      </div>

      <div className="cart-container">
        {/* --- LEFT: Cart Items --- */}
        <div className="cart-items-section">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <FaShoppingBag className="empty-cart-icon" />
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added any cards to your cart yet.</p>
              <Link to="/cards" className="shop-now-btn">Shop Now</Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div className="cart-item-card" key={item.id}>
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p className="item-options">{item.options}</p>
                  <p className="item-price">${item.price.toFixed(2)}</p>
                  
                  <div className="cart-item-actions">
                    <div className="quantity-control">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button className="remove-btn" onClick={() => removeItem(item.id)}>
                      <FaTrashAlt /> Remove
                    </button>
                  </div>
                </div>
                
                <div className="cart-item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- RIGHT: Order Summary --- */}
        <div className="cart-summary-section">
          <div className="summary-card">
            <h3>Order Summary</h3>
            
            <div className="summary-row">
              <span>Subtotal ({cartItems.reduce((a, i) => a + i.quantity, 0)} items)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total-row">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

          <Link to="/checkout">
            <button className="checkout-btn">
              Proceed to Checkout
            </button>
            </Link>
            <div className="secure-badge">
              <span>🔒 Secured Checkout</span>
              <span>PayPal / Credit Card</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCart;