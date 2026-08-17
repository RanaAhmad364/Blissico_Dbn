// src/components/dashboard/StatCard.jsx
import React from 'react';
import './StatCard.css';

// Icon mapping
import { 
  FiDollarSign, 
  FiShoppingBag, 
  FiUsers, 
  FiTrendingUp,
  FiGrid
} from 'react-icons/fi';

const iconMap = {
  'FiDollarSign': FiDollarSign,
  'FiShoppingBag': FiShoppingBag,
  'FiUsers': FiUsers,
  'FiTrendingUp': FiTrendingUp,
  'FiGrid': FiGrid,
};

const StatCard = ({ title, value, growth, icon, color, bgColor }) => {
  const IconComponent = iconMap[icon] || FiDollarSign;

  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-icon-wrapper" style={{ backgroundColor: bgColor, color }}>
          <IconComponent size={20} />
        </div>
        {growth !== undefined && growth !== null && (
          <span className="stat-change positive">↑ {growth}% this month</span>
        )}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{title}</div>
    </div>
  );
};

export default StatCard;