import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { getUsers, getAdminCards, getCategories, getCollections, getOccasions } from '../../api/admin';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getUsers(), getAdminCards(1, 1), getCategories(), getCollections(), getOccasions()])
      .then(([users, cardsRes, categories, collections, occasions]) => {
        setStats({
          totalUsers: users.length,
          totalCards: cardsRes.total,
          totalCategories: categories.length,
          totalCollections: collections.length,
          totalOccasions: occasions.length,
        });
      })
      .catch(() => setError('Could not load dashboard stats.'));
  }, []);

  return (
    <AdminLayout>
      <h1 style={{ marginBottom: 24 }}>Dashboard Overview</h1>

      {error && <div style={{ color: '#c0392b', marginBottom: 20 }}>{error}</div>}

      {!stats && !error && <div>Loading...</div>}

      {stats && (
        <div className="admin-stat-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-value">{stats.totalUsers}</div>
            <div className="admin-stat-label">Total Users</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-value">{stats.totalCards}</div>
            <div className="admin-stat-label">Total Cards</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-value">{stats.totalCategories}</div>
            <div className="admin-stat-label">Categories</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-value">{stats.totalCollections}</div>
            <div className="admin-stat-label">Collections</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-value">{stats.totalOccasions}</div>
            <div className="admin-stat-label">Occasions</div>
          </div>
        </div>
      )}

      <p style={{ marginTop: 32, color: '#aaa', fontSize: '0.9rem' }}>
        Revenue, orders, and downloads stats will appear here once the Orders/Payment and Download modules are built.
      </p>
    </AdminLayout>
  );
};

export default AdminDashboard;


