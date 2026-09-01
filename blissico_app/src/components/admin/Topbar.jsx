// src/components/admin/Topbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { assetUrl } from '../../api/catalog';
import { getNotifications, getUnreadNotificationCount, markAllNotificationsRead } from '../../api/notifications';
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
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

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

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const [items, count] = await Promise.all([
        getNotifications({ limit: 8 }),
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
        {/* <div className="search-wrapper">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search anything..." className="search-input" />
        </div> */}

        <div className="notification-wrapper">
          <button 
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FiBell className="notification-icon" />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h4>Notifications</h4>
                <button className="mark-all-read" onClick={handleMarkAllRead}>Mark all read</button>
              </div>
              <div className="notification-list">
                {notifications.length === 0 ? (
                  <div className="notification-empty">No notifications yet.</div>
                ) : (
                  notifications.map(notif => (
                    <div key={notif.id} className={`notification-item ${notif.is_read ? 'read' : 'unread'}`}>
                      <div className={`notification-dot ${notif.notification_type || 'order'}`}></div>
                      <div>
                        <p className="notification-message">{notif.title}</p>
                        <p className="notification-detail">{notif.message}</p>
                        <span className="notification-time">{new Date(notif.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="notification-footer">
                <Link to="/admin/notifications" className="view-all-btn">View all notifications</Link>
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
               <img src={assetUrl(user.profile_picture)} alt={getUserName()} className="user-avatar-img" />
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
                   <img src={assetUrl(user.profile_picture)} alt={getUserName()} className="user-avatar-img" />
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