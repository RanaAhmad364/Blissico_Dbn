// src/components/admin/Topbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Topbar.css';
import { 
  FiMenu, 
  FiSearch, 
  FiBell, 
  FiChevronDown,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMail
} from 'react-icons/fi';

const Topbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Notifications data
  const notifications = [
    { id: 1, message: 'New order #BLIS-1251 placed', time: '5 min ago', type: 'order' },
    { id: 2, message: 'Ayesha Khan completed payment', time: '1 hour ago', type: 'payment' },
    { id: 3, message: 'New customer registered', time: '3 hours ago', type: 'user' },
  ];

  // Get user display name
  const getUserName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user?.first_name) {
      return user.first_name;
    }
    if (user?.username) {
      return user.username;
    }
    return 'Admin';
  };

  // Get user avatar initial
  const getAvatarInitial = () => {
    if (user?.first_name) {
      return user.first_name.charAt(0).toUpperCase();
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return 'A';
  };

  // Get user role
  const getUserRole = () => {
    if (user?.role) {
      return user.role;
    }
    return 'Super Admin';
  };

  // Get user email
  const getUserEmail = () => {
    if (user?.email) {
      return user.email;
    }
    return 'admin@blissico.com';
  };

  return (
    <header className="admin-topbar">
      <div className="topbar-left">
        <button className="mobile-menu-btn" onClick={onMenuClick}>
          <FiMenu size={24} />
        </button>
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="welcome-text">
            {getGreeting()}, {getUserName()}! Here's what's happening with your store today.
          </p>
        </div>
      </div>

      <div className="topbar-right">
        <div className="search-wrapper">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search anything..." className="search-input" />
        </div>

        <div className="notification-wrapper">
          <button 
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FiBell className="notification-icon" />
            <span className="notification-badge">3</span>
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h4>Notifications</h4>
                <button className="mark-all-read">Mark all read</button>
              </div>
              <div className="notification-list">
                {notifications.map(notif => (
                  <div key={notif.id} className="notification-item">
                    <div className={`notification-dot ${notif.type}`}></div>
                    <div>
                      <p className="notification-message">{notif.message}</p>
                      <span className="notification-time">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="notification-footer">
                <button className="view-all-btn">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        <div className="user-menu-wrapper">
          <button 
            className="user-menu-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar">
              {getAvatarInitial()}
            </div>
            <div className="user-info">
              <span className="user-name">{getUserName()}</span>
              <span className="user-role">{getUserRole()}</span>
            </div>
            <FiChevronDown className={`chevron-icon ${showUserMenu ? 'rotated' : ''}`} />
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <div className="user-avatar-large">
                  {getAvatarInitial()}
                </div>
                <div>
                  <div className="dropdown-user-name">{getUserName()}</div>
                  <div className="dropdown-user-email">{getUserEmail()}</div>
                </div>
              </div>
              <div className="dropdown-divider"></div>
                 <Link to="/admin/profile" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
      <FiUser />
      <span>Edit Profile</span>
    </Link>
              <Link to="/admin/settings" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                <FiSettings />
                <span>Settings</span>
              </Link>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item logout-item" onClick={handleLogout}>
                <FiLogOut />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;