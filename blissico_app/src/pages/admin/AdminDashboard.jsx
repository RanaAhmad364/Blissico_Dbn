import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import StatCard from '../../components/dashboard/StatCard';
import QuickActions from '../../components/dashboard/QuickActions';
import TrendChart from '../../components/dashboard/TrendChart';
import {
  getUsers, getAdminCards, getCategories, getCollections, getOccasions,
  getAnalyticsOverview, getMostDownloaded, getTopSelling, getMostFavorited,
  getRevenueSeries, getDownloadSeries,
} from '../../api/admin';
// import {
//   getUsers, getAdminCards, getCategories, getCollections, getOccasions,
//   getAnalyticsOverview, getMostDownloaded, getTopSelling, getMostFavorited,
//   getRevenueSeries, getDownloadSeries,
// } from '../../api/admin';
import { assetUrl } from '../../api/catalog';
import './AdminDashboard.css';

const RankedCardList = ({ title, items, metricLabel, metricKey }) => (
  <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
    <h3 style={{ marginTop: 0 }}>{title}</h3>
    {items.length === 0 ? (
      <p style={{ color: '#888' }}>No data yet.</p>
    ) : (
      items.map((item, i) => (
        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < items.length - 1 ? '1px solid #f2f2f2' : 'none' }}>
          <span style={{ width: 20, color: '#aaa', fontWeight: 600 }}>{i + 1}</span>
          <img src={assetUrl(item.thumbnail)} alt={item.title} style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} />
          <span style={{ flex: 1, fontSize: 14 }}>{item.title}</span>
          <span style={{ fontWeight: 600, color: '#7c3aed', fontSize: 13 }}>{item[metricKey]} {metricLabel}</span>
        </div>
      ))
    )}
  </div>
);

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.all([
      getUsers(), getAdminCards(1, 1), getCategories(), getCollections(), getOccasions(),
      getAnalyticsOverview(), getMostDownloaded(), getTopSelling(), getMostFavorited(),
    ])
      .then(([users, cardsRes, categories, collections, occasions, overview, mostDownloaded, topSelling, mostFavorited]) => {
        setData({ totalUsers: users.length, totalCards: cardsRes.total, categories, collections, occasions, overview, mostDownloaded, topSelling, mostFavorited });
      })
      .catch(() => setError('Could not load live dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout><div style={{ padding: 40 }}>Loading...</div></AdminLayout>;
  if (error) return <AdminLayout><div style={{ padding: 40, color: '#c0392b' }}>{error}</div></AdminLayout>;

  const { overview } = data;

  const mainStats = [
    { id: 1, title: 'Total Revenue', value: `$${overview.revenue.total.toFixed(2)}`, icon: 'FiDollarSign', color: '#059669', bgColor: '#d1fae5' },
    { id: 2, title: "Today's Revenue", value: `$${overview.revenue.today.toFixed(2)}`, icon: 'FiTrendingUp', color: '#d97706', bgColor: '#fef3c7' },
    { id: 3, title: 'Total Cards', value: data.totalCards, icon: 'FiShoppingBag', color: '#7c3aed', bgColor: '#f3e8ff' },
    { id: 4, title: 'Total Users', value: data.totalUsers, icon: 'FiUsers', color: '#2563eb', bgColor: '#dbeafe' },
  ];

  const revenueBreakdown = [
    { label: 'Today', value: overview.revenue.today },
    { label: 'This Week', value: overview.revenue.weekly },
    { label: 'This Month', value: overview.revenue.monthly },
    { label: 'This Year', value: overview.revenue.yearly },
  ];

  const orderBreakdown = [
    { label: 'Total Orders', value: overview.orders.total },
    { label: 'Pending', value: overview.orders.pending },
    { label: 'Completed', value: overview.orders.completed },
    { label: 'Failed', value: overview.orders.failed },
  ];

  const quickActions = [
    { icon: '➕', label: 'Add New Card', path: '/admin/products' },
    { icon: '📁', label: 'Add Collection', path: '/admin/collections' },
    { icon: '🎉', label: 'Create Occasion', path: '/admin/occasions' },
    { icon: '🏠', label: 'Manage Homepage',  path: '/', newTab: true },
  ];

  return (
    <AdminLayout>
      <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="stats-grid">
          {mainStats.map((stat) => <StatCard key={stat.id} {...stat} />)}
        </div>

        <TrendChart title="Sales Overview" subtitle="Revenue trends over time" fetcher={getRevenueSeries} color="#7c3aed" valuePrefix="$" />
        <TrendChart title="Downloads Overview" subtitle="Download activity over time" fetcher={getDownloadSeries} color="#059669" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <h3 style={{ marginTop: 0 }}>Revenue Breakdown</h3>
            {revenueBreakdown.map((r) => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f2f2f2' }}>
                <span style={{ color: '#666' }}>{r.label}</span>
                <span style={{ fontWeight: 600 }}>${r.value.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <h3 style={{ marginTop: 0 }}>Orders Breakdown</h3>
            {orderBreakdown.map((o) => (
              <div key={o.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f2f2f2' }}>
                <span style={{ color: '#666' }}>{o.label}</span>
                <span style={{ fontWeight: 600 }}>{o.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
            <RankedCardList title="Top Selling" items={data.topSelling} metricLabel="sales" metricKey="sales" />
            <RankedCardList title="Most Downloaded" items={data.mostDownloaded} metricLabel="downloads" metricKey="downloads" />
            <RankedCardList title="Most Favorited" items={data.mostFavorited} metricLabel="favorites" metricKey="favorites" />
          </div>
        </div>
          <QuickActions actions={quickActions} />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;