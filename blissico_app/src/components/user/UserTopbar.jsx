import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useCart } from '../../context/CartContext';
import { assetUrl } from '../../api/catalog';
import { getNotifications, getUnreadNotificationCount, markAllNotificationsRead } from '../../api/notifications';
import { 
  FiMenu, FiSearch, FiHeart, FiShoppingCart, FiBell, 
  FiChevronDown, FiUser, FiSettings, FiLogOut, FiX
} from 'react-icons/fi';
import './UserTopbar.css';

const UserTopbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { favorites, favoritesCount, loading: favoritesLoading } = useFavorites();
  const { items: cartItems } = useCart();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const [items, count] = await Promise.all([
        getNotifications({ limit: 6 }),
        getUnreadNotificationCount(),
      ]);
      setNotifications(items);
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(prev => prev.map(item => ({ ...item, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

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

  // ✅ Check if user has a valid profile picture
  const hasProfilePicture = () => {
    return user?.profile_picture && user.profile_picture.trim() !== '';
  };

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
          {/* <div className="user-search-wrapper">
            <FiSearch className="user-search-icon" />
            <input type="text" placeholder="Search..." className="user-search-input" />
          </div> */}

        {/* ===== FAVORITES ICON (Real Data) ===== */}
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

        {/* ===== CART ICON (Real Data) ===== */}
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
            {cartCount > 0 && <span className="user-badge">{cartCount}</span>}
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
                {cartItems.length === 0 ? (
                  <div className="user-favorites-dropdown-message">
                    <span>Your cart is empty</span>
                    <Link to="/cards" onClick={closeAllDropdowns}>Browse Cards</Link>
                  </div>
                ) : (
                  cartItems.slice(0, 4).map((item, index) => (
                    <div key={item.id || index} className="user-dropdown-item-card">
                      {item.thumbnail ? (
                        <img src={assetUrl(item.thumbnail)} alt="" className="user-favorite-item-thumbnail" />
                      ) : (
                        <span className="user-item-icon"><FiShoppingCart size={18} /></span>
                      )}
                      <div className="user-item-info">
                        <span className="user-item-name">{item.title}</span>
                        <span className="user-item-meta">
                          {item.quantity || 1} × ${(Number(item.price) || 0).toFixed(2)}
                        </span>
                      </div>
                      <span className="user-item-total">
                        ${((Number(item.price) || 0) * (item.quantity || 1)).toFixed(2)}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <div className="user-dropdown-footer">
                <Link to="/cart" onClick={closeAllDropdowns}>View Cart</Link>
                {/* <Link to="/user/checkout" className="user-checkout-btn" onClick={closeAllDropdowns}>Checkout</Link> */}
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
            {unreadCount > 0 && <span className="user-badge">{unreadCount}</span>}
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
                {notifications.length === 0 ? (
                  <div className="user-favorites-dropdown-message">
                    <span>No new notifications</span>
                  </div>
                ) : (
                  notifications.map((item) => (
                    <Link
                      key={item.id}
                      to={item.redirect_url || '/dashboard'}
                      className="user-dropdown-item-card user-notif-item"
                      onClick={closeAllDropdowns}
                    >
                      <span className="user-notif-dot" />
                      <div className="user-notif-content">
                        <p className="user-notif-message">{item.title}</p>
                        <p className="user-notif-message" style={{ fontSize: '12px', color: '#64748b' }}>{item.message}</p>
                        <span className="user-notif-time">{new Date(item.created_at).toLocaleString()}</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
              <div className="user-dropdown-footer">
                <button className="user-mark-all-read" onClick={handleMarkAllRead}>Mark all read</button>
                <Link to="/user/notifications" onClick={closeAllDropdowns}>View All Notifications</Link>
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
              {/* ✅ Proper Image Handling */}
              {hasProfilePicture() ? (
                <img src={assetUrl(user.profile_picture)} alt={getUserName()} className="user-avatar-img" />
              ) : (
                <div className="user-avatar-fallback">
                  {getAvatarInitial()}
                </div>
              )}
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
                  {/* ✅ Proper Image Handling in Dropdown */}
                  {hasProfilePicture() ? (
                    <img src={assetUrl(user.profile_picture)} alt={getUserName()} className="user-avatar-img" />
                  ) : (
                    <div className="user-avatar-fallback">
                      {getAvatarInitial()}
                    </div>
                  )}
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