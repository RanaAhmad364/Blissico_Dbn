// src/components/user/UserSidebar.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiHome, FiShoppingBag, FiDownload, FiRepeat, FiDollarSign, 
  FiHeart, FiTag, FiMapPin, FiCreditCard, FiSettings, FiBell, 
  FiStar, FiHeadphones, FiLogOut 
} from 'react-icons/fi';
import './UserSidebar.css';

// Blissico Logo SVG
const BlissicoLogo = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="36" rx="8" fill="#7C3AED"/>
    <path d="M10 12L18 24L26 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="18" cy="12" r="2" fill="white"/>
    <circle cx="18" cy="24" r="2" fill="white"/>
    <path d="M10 12L26 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const UserSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const mainMenu = [
    { label: 'Dashboard', path: '/dashboard', icon: FiHome },
    { label: 'Orders', path: '/user/orders', icon: FiShoppingBag },
    { label: 'My Downloads', path: '/user/downloads', icon: FiDownload },
    { label: 'Favorites', path: '/user/favorites', icon: FiHeart },
    { label: 'Subscriptions', path: '/user/subscriptions', icon: FiRepeat },
    { label: 'Pricing Plans', path: '/user/pricing-plans', icon: FiDollarSign },
    { label: 'Saved Items', path: '/user/saved-items', icon: FiHeart },
    { label: 'Coupons', path: '/user/coupons', icon: FiTag },
  ];

  const settingsMenu = [
    { label: 'Addresses', path: '/user/addresses', icon: FiMapPin },
    { label: 'Payment Methods', path: '/user/payments', icon: FiCreditCard },
    { label: 'Account Settings', path: '/user/account-settings', icon: FiSettings },
    { label: 'Notifications', path: '/user/notifications', icon: FiBell },
    { label: 'Reviews', path: '/user/reviews', icon: FiStar },
    { label: 'Support', path: '/user/support', icon: FiHeadphones },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const NavLink = ({ item }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;
    return (
      <Link
        to={item.path}
        className={`user-nav-link ${isActive ? 'user-active' : ''}`}
        onClick={onClose}
      >
        <Icon className="user-nav-icon" size={20} />
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      <aside className={`user-sidebar-wrapper ${isOpen ? 'user-sidebar-open' : ''}`}>
        {/* Brand Logo */}
        <div className="user-sidebar-brand">
          <div className="user-brand-logo">
            <BlissicoLogo />
          </div>
          <div className="user-brand-text">
            <span className="user-brand-name">blissico</span>
            <span className="user-brand-sub">User Dashboard</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="user-sidebar-nav">
          <div className="user-nav-section">
            <span className="user-section-title">Main</span>
            {mainMenu.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </div>

          <div className="user-nav-section">
            <span className="user-section-title">Settings</span>
            {settingsMenu.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="user-sidebar-footer">
          <button className="user-logout-btn" onClick={handleLogout}>
            <FiLogOut className="user-nav-icon" size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {isOpen && <div className="user-sidebar-overlay" onClick={onClose}></div>}
    </>
  );
};

export default UserSidebar;