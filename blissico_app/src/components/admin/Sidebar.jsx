// src/components/admin/Sidebar.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';
import { 
  FiHome, 
  FiUsers, 
  FiGrid, 
  FiLayers, 
  FiCalendar, 
  FiCreditCard,
  FiLogOut,
  FiShoppingBag,
  FiTag,
  FiStar,
  FiDollarSign,
  FiPackage,
  FiBarChart2,
  FiBell,
  FiHeadphones,
  FiSettings,
  FiActivity
} from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const mainNav = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: FiHome },
    { label: 'Orders', path: '/admin/orders', icon: FiShoppingBag },
    { label: 'Customers', path: '/admin/customers', icon: FiUsers },
    { label: 'Products', path: '/admin/products', icon: FiPackage },
    { label: 'Categories', path: '/admin/categories', icon: FiGrid },
    { label: 'Collections', path: '/admin/collections', icon: FiTag },  
    { label: 'Occasions', path: '/admin/occasions', icon: FiStar },
    { label: 'Pricing Plans', path: '/admin/pricing', icon: FiDollarSign },
    { label: 'Coupons', path: '/admin/coupons', icon: FiTag },
    { label: 'Reviews', path: '/admin/reviews', icon: FiStar },
  ];

  const managementNav = [
    { label: 'Users', path: '/admin/users', icon: FiUsers },
    { label: 'Notifications', path: '/admin/notifications', icon: FiBell },
    { label: 'Support', path: '/admin/support', icon: FiHeadphones },
  ];

  const systemNav = [
    { label: 'Settings', path: '/admin/settings', icon: FiSettings },
    { label: 'Appearance', path: '/admin/appearance', icon: FiLayers },
    { label: 'Activity Logs', path: '/admin/activity-logs', icon: FiActivity },
  ];

  // Handle logout
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
    return (
      <Link
        to={item.path}
        className={`admin-nav-link ${isActive ? 'active' : ''}`}
        onClick={onClose}
      >
        <item.icon className="nav-icon" />
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">✨</div>
          <div className="brand-text">
            <span className="brand-name">blissico</span>
            <span className="brand-sub">Admin Dashboard</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <span className="nav-section-title">Main</span>
            {mainNav.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </div>

          <div className="nav-section">
            <span className="nav-section-title">Management</span>
            {managementNav.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </div>

          <div className="nav-section">
            <span className="nav-section-title">System</span>
            {systemNav.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut className="nav-icon" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
    </>
  );
};

export default Sidebar;