// src/components/dashboard/QuickStats.jsx
import React from 'react';
import { FiPackage, FiTag, FiStar } from 'react-icons/fi';
import './QuickStats.css';

const iconMap = {
  'FiPackage': FiPackage,
  'FiTag': FiTag,
  'FiStar': FiStar,
};

const QuickStats = ({ stats }) => {
  return (
    <div className="quick-stats">
      {stats.map((stat) => {
        const IconComponent = iconMap[stat.icon] || FiPackage;
        return (
          <div key={stat.id} className="quick-stat-item">
            <div className="quick-stat-icon">
              <IconComponent size={18} />
            </div>
            <div>
              <div className="quick-stat-value">{stat.value}</div>
              <div className="quick-stat-label">{stat.label}</div>
            </div>
            {stat.warning && (
              <span className="quick-stat-warning">⚠️</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default QuickStats;