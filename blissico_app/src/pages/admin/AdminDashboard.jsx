import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import StatCard from '../../components/dashboard/StatCard';
import QuickStats from '../../components/dashboard/QuickStats';
import QuickActions from '../../components/dashboard/QuickActions';
import CategoriesList from '../../components/dashboard/CategoriesList';
import { getUsers, getAdminCards, getCategories, getCollections, getOccasions } from '../../api/admin';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.all([getUsers(), getAdminCards(1, 1), getCategories(), getCollections(), getOccasions()])
      .then(([users, cardsRes, categories, collections, occasions]) => {
        setData({ totalUsers: users.length, totalCards: cardsRes.total, categories, collections, occasions });
      })
      .catch(() => setError('Could not load live dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout><div style={{ padding: 40 }}>Loading...</div></AdminLayout>;
  if (error) return <AdminLayout><div style={{ padding: 40, color: '#c0392b' }}>{error}</div></AdminLayout>;

  const totalCategories = data.categories.reduce((sum, c) => sum + 1 + (c.subcategories?.length || 0), 0);

  const mainStats = [
    { id: 1, title: 'Total Cards', value: data.totalCards, icon: 'FiShoppingBag', color: '#7c3aed', bgColor: '#f3e8ff' },
    { id: 2, title: 'Total Users', value: data.totalUsers, icon: 'FiUsers', color: '#059669', bgColor: '#d1fae5' },
    { id: 3, title: 'Categories', value: totalCategories, icon: 'FiGrid', color: '#2563eb', bgColor: '#dbeafe' },
    { id: 4, title: 'Occasions', value: data.occasions.length, icon: 'FiTrendingUp', color: '#d97706', bgColor: '#fef3c7' },
  ];

  const categoryChips = [
    { id: 'cat', icon: '📁', name: 'Categories', count: totalCategories },
    { id: 'col', icon: '🎨', name: 'Collections', count: data.collections.length },
    { id: 'occ', icon: '🎉', name: 'Occasions', count: data.occasions.length },
    { id: 'usr', icon: '👥', name: 'Customers', count: data.totalUsers },
  ];

  const quickStats = [
    { id: 1, icon: 'FiPackage', value: data.totalCards, label: 'Total Cards' },
    { id: 2, icon: 'FiTag', value: data.collections.length, label: 'Total Collections' },
    { id: 3, icon: 'FiStar', value: data.occasions.length, label: 'Total Occasions' },
  ];

  const quickActions = [
    { icon: '➕', label: 'Add New Card', path: '/admin/products' },
    { icon: '📁', label: 'Add Collection', path: '/admin/collections' },
    { icon: '🎉', label: 'Create Occasion', path: '/admin/occasions' },
    { icon: '🏠', label: 'Manage Homepage', path: null },
  ];

  return (
    <AdminLayout>
      <div className="dashboard-container">
        <div className="stats-grid">
          {mainStats.map((stat) => <StatCard key={stat.id} {...stat} />)}
        </div>

        <CategoriesList categories={categoryChips} />

        <div className="revenue-section">
          <div className="revenue-chart-wrapper" style={{ padding: 24, background: '#fff', borderRadius: 10, color: '#888' }}>
            Orders, revenue, and sales analytics will appear here once the Orders/Payment module is built.
          </div>
          <div className="right-sidebar">
            <QuickStats stats={quickStats} />
            <QuickActions actions={quickActions} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;