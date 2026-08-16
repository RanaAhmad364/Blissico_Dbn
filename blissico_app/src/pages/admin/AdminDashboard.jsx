// src/pages/admin/AdminDashboard.jsx
import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

// Import all components
import StatCard from '../../components/dashboard/StatCard';
import QuickStats from '../../components/dashboard/QuickStats';
import QuickActions from '../../components/dashboard/QuickActions';
import RevenueChart from '../../components/dashboard/RevenueChart';
import RecentOrders from '../../components/dashboard/RecentOrders';
import BestSellingCards from '../../components/dashboard/BestSellingCards';
import TopCategories from '../../components/dashboard/TopCategories';
import TopOccasions from '../../components/dashboard/TopOccasions';
import ActiveDiscounts from '../../components/dashboard/ActiveDiscounts';
import CategoriesList from '../../components/dashboard/CategoriesList';

// Import all data from dashboardData.js
import {
  mainStats,
  quickStats,
  quickActions,
  revenueData,
  recentOrders,
  bestSellingCards,
  topCategories,
  topOccasions,
  activeDiscounts,
  categories,  // ✅ Now this exists
} from '../../data/dashboardData';

import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="dashboard-container">
        {/* ===== TOP ROW: MAIN STATS (4 Cards) ===== */}
        <div className="stats-grid">
          {mainStats.map((stat) => (
            <StatCard
              key={stat.id}
              title={stat.title}
              value={stat.value}
              growth={stat.growth}
              icon={stat.icon}
              color={stat.color}
              bgColor={stat.bgColor}
            />
          ))}
        </div>

        {/* ===== CATEGORIES ROW (Recipients) ===== */}
        <CategoriesList categories={categories} />

        {/* ===== REVENUE CHART & QUICK ACTIONS ===== */}
        <div className="revenue-section">
          <div className="revenue-chart-wrapper">
            <RevenueChart revenueData={revenueData} />
          </div>
          <div className="right-sidebar">
            <QuickStats stats={quickStats} />
            <QuickActions actions={quickActions} />
          </div>
        </div>

        {/* ===== RECENT ORDERS ===== */}
        <RecentOrders orders={recentOrders} />

        {/* ===== BOTTOM GRID: Best Selling + Top Categories ===== */}
        <div className="bottom-grid">
          <BestSellingCards cards={bestSellingCards} />
          <TopCategories categories={topCategories} />
        </div>

        {/* ===== BOTTOM GRID 2: Top Occasions + Active Discounts ===== */}
        <div className="bottom-grid">
          <TopOccasions occasions={topOccasions} />
          <ActiveDiscounts discounts={activeDiscounts} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;