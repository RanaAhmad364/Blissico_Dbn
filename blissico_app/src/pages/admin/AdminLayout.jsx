import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/admin/dashboard', ready: true },
  { label: 'Users', path: '/admin/users', ready: false },
  { label: 'Categories', path: '/admin/categories', ready: false },
  { label: 'Collections', path: '/admin/collections', ready: false },
  { label: 'Occasions', path: '/admin/occasions', ready: false },
  { label: 'Cards', path: '/admin/cards', ready: false },
];

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-logo">Blissico Admin</div>
        <nav>
          {NAV_ITEMS.map((item) =>
            item.ready ? (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ) : (
              <span key={item.path} className="admin-nav-link disabled" title="Coming soon">
                {item.label}
              </span>
            )
          )}
        </nav>
        <button className="admin-logout-btn" onClick={logout}>Logout</button>
      </aside>

      <main className="admin-content">
        <header className="admin-topbar">
          <span>Welcome, {user?.first_name}</span>
        </header>
        <div className="admin-page-body">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;