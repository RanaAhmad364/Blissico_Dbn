// src/components/dashboard/QuickActions.jsx
import React from 'react';
import { quickActions } from '../../data/dashboardData';
import './QuickActions.css';

const QuickActions = () => {
  return (
    <div className="quick-actions-card">
      <div className="card-header">
        <h3>Quick Actions</h3>
      </div>
      <div className="actions-grid">
        {quickActions.map((action, index) => (
          <button key={index} className="action-btn">
            <span className="action-icon">{action.icon}</span>
            <span className="action-label">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;