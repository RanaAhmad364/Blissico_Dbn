import React from 'react';
import { useNavigate } from 'react-router-dom';
import './QuickActions.css';

const QuickActions = ({ actions }) => {
  const navigate = useNavigate();

  return (
    <div className="quick-actions-card">
      <div className="card-header">
        <h3>Quick Actions</h3>
      </div>
      <div className="actions-grid">
        {actions.map((action, index) => (
          <button
            key={index}
            className="action-btn"
            disabled={!action.path}
            onClick={() => {
              if (!action.path) return;
              if (action.newTab) window.open(action.path, '_blank');
              else navigate(action.path);
            }}
            title={!action.path ? 'Coming soon' : undefined}
          >
            <span className="action-icon">{action.icon}</span>
            <span className="action-label">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;