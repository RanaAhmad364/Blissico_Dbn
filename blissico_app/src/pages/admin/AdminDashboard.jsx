import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import StatCard from '../../components/dashboard/StatCard';
import {
  getUsers, getAdminCards, getCategories, getCollections, getOccasions,
  getAnalyticsOverview, getMostDownloaded, getTopSelling, getMostFavorited,
  getRevenueChart, getDownloadChart,
} from '../../api/admin';
import { assetUrl } from '../../api/catalog';
import './AdminDashboard.css';

const RankedCardList = ({ title, items, metricLabel, metricKey }) => (
  <div style={{ background: '#fff', borderRadius: 10, padding: 20 }}>
    <h3 style={{ marginTop: 0 }}>{title}</h3>
    {items.length === 0 ? (
      <p style={{ color: '#888' }}>No data yet.</p>
    ) : (
      items.map((item, i) => (
        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < items.length - 1 ? '1px solid #f2f2f2' : 'none' }}>
          <span style={{ width: 20, color: '#aaa', fontWeight: 600 }}>{i + 1}</span>
          <img src={assetUrl(item.thumbnail)} alt={item.title} style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} />
          <span style={{ flex: 1 }}>{item.title}</span>
          <span style={{ fontWeight: 600, color: '#7c3aed' }}>{item[metricKey]} {metricLabel}</span>
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
      getRevenueChart(14), getDownloadChart(14),
    ])
      .then(([users, cardsRes, categories, collections, occasions, overview, mostDownloaded, topSelling, mostFavorited, revenueChart, downloadChart]) => {
        setData({
          totalUsers: users.length, totalCards: cardsRes.total,
          categories, collections, occasions, overview,
          mostDownloaded, topSelling, mostFavorited, revenueChart, downloadChart,
        });
      })
      .catch(() => setError('Could not load live dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout><div style={{ padding: 40 }}>Loading...</div></AdminLayout>;
  if (error) return <AdminLayout><div style={{ padding: 40, color: '#c0392b' }}>{error}</div></AdminLayout>;

  const { overview } = data;
  const totalCategories = data.categories.reduce((sum, c) => sum + 1 + (c.subcategories?.length || 0), 0);

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

  return (
    <AdminLayout>
      <div className="dashboard-container">
        <div className="stats-grid">
          {mainStats.map((stat) => <StatCard key={stat.id} {...stat} />)}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 20 }}>
          <div style={{ background: '#fff', borderRadius: 10, padding: 20 }}>
            <h3 style={{ marginTop: 0 }}>Revenue Breakdown</h3>
            {revenueBreakdown.map((r) => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f2f2f2' }}>
                <span style={{ color: '#666' }}>{r.label}</span>
                <span style={{ fontWeight: 600 }}>${r.value.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div style={{ background: '#fff', borderRadius: 10, padding: 20 }}>
            <h3 style={{ marginTop: 0 }}>Orders Breakdown</h3>
            {orderBreakdown.map((o) => (
              <div key={o.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f2f2f2' }}>
                <span style={{ color: '#666' }}>{o.label}</span>
                <span style={{ fontWeight: 600 }}>{o.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginTop: 20 }}>
          <RankedCardList title="Top Selling Cards" items={data.topSelling} metricLabel="sales" metricKey="sales" />
          <RankedCardList title="Most Downloaded Cards" items={data.mostDownloaded} metricLabel="downloads" metricKey="downloads" />
          <RankedCardList title="Most Favorited Cards" items={data.mostFavorited} metricLabel="favorites" metricKey="favorites" />
        </div>

        <div style={{ marginTop: 20, background: '#fff', borderRadius: 10, padding: 20 }}>
          <h3 style={{ marginTop: 0 }}>Revenue — Last 14 Days</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 140 }}>
            {data.revenueChart.map((d) => {
              const max = Math.max(...data.revenueChart.map((x) => x.revenue), 1);
              return (
                <div key={d.date} title={`${d.date}: $${d.revenue.toFixed(2)}`} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ height: `${(d.revenue / max) * 120}px`, background: '#7c3aed', borderRadius: '3px 3px 0 0' }} />
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: 20, background: '#fff', borderRadius: 10, padding: 20 }}>
          <h3 style={{ marginTop: 0 }}>Downloads — Last 14 Days</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 140 }}>
            {data.downloadChart.map((d) => {
              const max = Math.max(...data.downloadChart.map((x) => x.downloads), 1);
              return (
                <div key={d.date} title={`${d.date}: ${d.downloads}`} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ height: `${(d.downloads / max) * 120}px`, background: '#059669', borderRadius: '3px 3px 0 0' }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;