import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaArrowLeft, FaHeartBroken } from 'react-icons/fa';
import './FavoritesPage.css';

const FavoritesPage = () => {
  // Mock state for favorite items (Later fetch from backend)
  const [favorites, setFavorites] = useState([
    {
      id: 101,
      name: 'Vintage Floral Birthday Card',
      price: 14.99,
      image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=200&auto=format&fit=crop',
      category: 'Birthday',
      addedDate: '2025-08-15'
    },
    {
      id: 102,
      name: 'Elegant Gold Wedding Invite',
      price: 24.50,
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=200&auto=format&fit=crop',
      category: 'Wedding',
      addedDate: '2025-08-14'
    },
    {
      id: 103,
      name: 'Minimalist Love Card',
      price: 9.99,
      image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=200&auto=format&fit=crop',
      category: 'Anniversary',
      addedDate: '2025-08-12'
    }
  ]);

  // Remove from favorites
  const removeFavorite = (id) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
  };

  // Calculate total items and savings (mock)
  const totalItems = favorites.length;
  const estimatedValue = favorites.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="favorites-page-wrapper">
      {/* --- Page Header --- */}
      <div className="favorites-page-header">
        <div className="favorites-header-content">
          <Link to="/cards" className="back-to-shop">
            <FaArrowLeft /> Back to Shop
          </Link>
          <h1>My Favorites</h1>
          <p>{totalItems} Items saved</p>
        </div>
      </div>

      <div className="favorites-container">
        {/* --- LEFT: Favorite Items --- */}
        <div className="favorites-items-section">
          {favorites.length === 0 ? (
            <div className="empty-favorites">
              <FaHeartBroken className="empty-fav-icon" />
              <h3>No favorites yet</h3>
              <p>Start adding cards you love to your favorites list.</p>
              <Link to="/cards" className="shop-now-btn">Browse Cards</Link>
            </div>
          ) : (
            favorites.map((item) => (
              <div className="favorite-item-card" key={item.id}>
                <div className="favorite-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                
                <div className="favorite-item-details">
                  <div className="fav-item-header">
                    <h4>{item.name}</h4>
                    <span className="fav-category">{item.category}</span>
                  </div>
                  <p className="fav-added">Added on {item.addedDate}</p>
                  <p className="item-price">${item.price.toFixed(2)}</p>
                  
                  <div className="fav-item-actions">
                    <Link to={`/product/${item.id}`} className="view-product-btn">
                      View Card
                    </Link>
                    <button className="remove-fav-btn" onClick={() => removeFavorite(item.id)}>
                      <FaHeartBroken /> Unfavorite
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- RIGHT: Summary Section --- */}
        <div className="favorites-summary-section">
          <div className="summary-card">
            <h3>Favorites Summary</h3>
            
            <div className="summary-row">
              <span>Total Saved Cards</span>
              <span>{totalItems} items</span>
            </div>
            <div className="summary-row">
              <span>Estimated Value</span>
              <span>${estimatedValue.toFixed(2)}</span>
            </div>
            <div className="summary-divider"></div>
            
            <div className="summary-actions">
              <Link to="/cart" className="action-btn-primary">
                Move All to Cart
              </Link>
              <button className="action-btn-secondary" onClick={() => setFavorites([])}>
                Clear All
              </button>
            </div>
            
            <div className="secure-badge">
              <span>❤️ Saved items are synced to your account</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;