// src/components/user/UserTopbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { assetUrl } from '../../api/catalog';
import { 
  FiMenu, FiSearch, FiHeart, FiShoppingCart, FiBell, 
  FiChevronDown, FiUser, FiSettings, FiLogOut, FiX
} from 'react-icons/fi';
import './UserTopbar.css';

const UserTopbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { favorites, favoritesCount, loading: favoritesLoading } = useFavorites();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getUserName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user?.first_name) return user.first_name;
    if (user?.username) return user.username;
    return 'User';
  };

  const getUserEmail = () => {
    if (user?.email) return user.email;
    return 'user@blissico.com';
  };

  const getAvatarInitial = () => {
    if (user?.first_name) return user.first_name.charAt(0).toUpperCase();
    if (user?.username) return user.username.charAt(0).toUpperCase();
    return 'U';
  };

  const getUserRole = () => {
    if (user?.role?.name) return user.role.name;
    if (user?.role) return user.role;
    return 'Premium Member';
  };

  // ===== DUMMY DATA =====
  const cartItems = [
    { id: 1, name: 'Eid Mubarak Card', price: '$15.00', quantity: 2, image: '🌙' },
    { id: 2, name: 'Anniversary Love', price: '$12.00', quantity: 1, image: '💕' },
    { id: 3, name: 'Thank You Card', price: '$8.00', quantity: 3, image: '🙏' },
  ];

  const notifications = [
    { id: 1, message: 'Your order #BLIS-1250 is delivered!', time: '2 min ago', type: 'success' },
    { id: 2, message: 'New exclusive offer for premium members', time: '1 hour ago', type: 'promo' },
    { id: 3, message: 'Your subscription will renew on June 25', time: '3 hours ago', type: 'reminder' },
    { id: 4, message: 'Ayesha Khan liked your card design', time: '5 hours ago', type: 'social' },
  ];

  // Close all dropdowns
  const closeAllDropdowns = () => {
    setShowNotifications(false);
    setShowFavorites(false);
    setShowCart(false);
    setShowUserMenu(false);
  };

  return (
    <header className="user-topbar-wrapper">
      {/* Left - Menu + Title */}
      <div className="user-topbar-left">
        <button className="user-mobile-menu-btn" onClick={onMenuClick}>
          <FiMenu size={24} />
        </button>
        <div className="user-topbar-title">
          <h1>Dashboard</h1>
          <p>Welcome back, {getUserName()}! Here's what's happening with your account today.</p>
        </div>
      </div>

      {/* Right - Icons + Profile */}
      <div className="user-topbar-right">
        {/* Search */}
        <div className="user-search-wrapper">
          <FiSearch className="user-search-icon" />
          <input type="text" placeholder="Search..." className="user-search-input" />
        </div>

        {/* ===== FAVORITES ICON ===== */}
        <div className="user-icon-dropdown-wrapper">
          <button 
            className="user-icon-btn"
            onClick={() => {
              setShowFavorites(!showFavorites);
              setShowNotifications(false);
              setShowCart(false);
              setShowUserMenu(false);
            }}
          >
            <FiHeart size={20} />
            {favoritesCount > 0 && <span className="user-badge">{favoritesCount}</span>}
          </button>

          {showFavorites && (
            <div className="user-dropdown-panel user-favorites-dropdown">
              <div className="user-dropdown-header">
                <h3>Favorites</h3>
                <button onClick={() => setShowFavorites(false)} className="user-close-dropdown">
                  <FiX size={18} />
                </button>
              </div>
              <div className="user-dropdown-list">
                {favoritesLoading ? (
                  <div className="user-favorites-dropdown-message">Loading favorites...</div>
                ) : favorites.length === 0 ? (
                  <div className="user-favorites-dropdown-message">
                    <span>No favorites yet</span>
                    <Link to="/cards" onClick={closeAllDropdowns}>Browse Cards</Link>
                  </div>
                ) : (
                  favorites.slice(0, 4).map((item) => (
                    <Link
                      key={item.id || item.card_id}
                      to={`/product/${item.card_id}`}
                      className="user-dropdown-item-card user-favorite-dropdown-link"
                      onClick={closeAllDropdowns}
                    >
                      {item.thumbnail ? (
                        <img
                          src={assetUrl(item.thumbnail)}
                          alt=""
                          className="user-favorite-item-thumbnail"
                        />
                      ) : (
                        <span className="user-item-icon"><FiHeart size={18} /></span>
                      )}
                      <div className="user-item-info">
                        <span className="user-item-name">{item.title || 'Favorite card'}</span>
                        <span className="user-item-price">
                          {item.is_free ? 'Free' : `$${(Number(item.price) || 0).toFixed(2)}`}
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
              <div className="user-dropdown-footer">
                <Link to="/user/favorites" onClick={closeAllDropdowns}>View All Favorites</Link>
              </div>
            </div>
          )}
        </div>

        {/* ===== CART ICON ===== */}
        <div className="user-icon-dropdown-wrapper">
          <button 
            className="user-icon-btn"
            onClick={() => {
              setShowCart(!showCart);
              setShowNotifications(false);
              setShowFavorites(false);
              setShowUserMenu(false);
            }}
          >
            <FiShoppingCart size={20} />
            <span className="user-badge">{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
          </button>

          {showCart && (
            <div className="user-dropdown-panel user-cart-dropdown">
              <div className="user-dropdown-header">
                <h3>Shopping Cart</h3>
                <button onClick={() => setShowCart(false)} className="user-close-dropdown">
                  <FiX size={18} />
                </button>
              </div>
              <div className="user-dropdown-list">
                {cartItems.map((item) => (
                  <div key={item.id} className="user-dropdown-item-card">
                    <span className="user-item-icon">{item.image}</span>
                    <div className="user-item-info">
                      <span className="user-item-name">{item.name}</span>
                      <span className="user-item-meta">{item.quantity} × {item.price}</span>
                    </div>
                    <span className="user-item-total">${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="user-dropdown-footer">
                <Link to="/user/cart" onClick={closeAllDropdowns}>View Cart</Link>
                <Link to="/user/checkout" className="user-checkout-btn" onClick={closeAllDropdowns}>Checkout</Link>
              </div>
            </div>
          )}
        </div>

        {/* ===== NOTIFICATIONS ICON ===== */}
        <div className="user-icon-dropdown-wrapper">
          <button 
            className="user-icon-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowFavorites(false);
              setShowCart(false);
              setShowUserMenu(false);
            }}
          >
            <FiBell size={20} />
            <span className="user-badge">{notifications.filter(n => n.type === 'success' || n.type === 'promo').length}</span>
          </button>

          {showNotifications && (
            <div className="user-dropdown-panel user-notifications-dropdown">
              <div className="user-dropdown-header">
                <h3>Notifications</h3>
                <button onClick={() => setShowNotifications(false)} className="user-close-dropdown">
                  <FiX size={18} />
                </button>
              </div>
              <div className="user-dropdown-list">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`user-notif-item ${notif.type}`}>
                    <div className="user-notif-dot"></div>
                    <div className="user-notif-content">
                      <p className="user-notif-message">{notif.message}</p>
                      <span className="user-notif-time">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="user-dropdown-footer">
                <Link to="/user/notifications" onClick={closeAllDropdowns}>View All Notifications</Link>
                <button className="user-mark-all-read">Mark all read</button>
              </div>
            </div>
          )}
        </div>

        {/* ===== PROFILE ===== */}
        <div className="user-profile-wrapper">
          <button 
            className="user-profile-btn"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
              setShowFavorites(false);
              setShowCart(false);
            }}
          >
            <div className="user-profile-avatar">
              {getAvatarInitial()}
            </div>
            <div className="user-profile-info">
              <span className="user-profile-name">{getUserName()}</span>
              <span className="user-profile-role">{getUserRole()}</span>
            </div>
            <FiChevronDown className={`user-chevron-icon ${showUserMenu ? 'user-rotated' : ''}`} />
          </button>

          {showUserMenu && (
            <div className="user-profile-dropdown">
              <div className="user-dropdown-header">
                <div className="user-dropdown-avatar">
                  {getAvatarInitial()}
                </div>
                <div>
                  <div className="user-dropdown-name">{getUserName()}</div>
                  <div className="user-dropdown-email">{getUserEmail()}</div>
                </div>
              </div>
              <div className="user-dropdown-divider"></div>
              <Link to="/edit-profile" className="user-dropdown-item" onClick={() => setShowUserMenu(false)}>
                <FiUser size={18} />
                <span>Edit Profile</span>
              </Link>
              <Link to="/user/settings" className="user-dropdown-item" onClick={() => setShowUserMenu(false)}>
                <FiSettings size={18} />
                <span>Settings</span>
              </Link>
              <div className="user-dropdown-divider"></div>
              <button className="user-dropdown-item user-logout-item" onClick={handleLogout}>
                <FiLogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default UserTopbar;