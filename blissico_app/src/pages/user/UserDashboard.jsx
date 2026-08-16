// src/pages/user/UserDashboard.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import UserLayout from '../../components/user/UserLayout';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="user-loading-container">
        <div className="user-loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <UserLayout>
      <div className="user-dashboard-container">
        {/* Stats Cards */}
        <div className="user-stats-grid">
          <div className="user-stat-card">
            <div className="user-stat-icon">📦</div>
            <div>
              <div className="user-stat-number">0</div>
              <div className="user-stat-label">Purchased Cards</div>
            </div>
          </div>
          <div className="user-stat-card">
            <div className="user-stat-icon">⬇️</div>
            <div>
              <div className="user-stat-number">0</div>
              <div className="user-stat-label">Downloads</div>
            </div>
          </div>
          <div className="user-stat-card">
            <div className="user-stat-icon">❤️</div>
            <div>
              <div className="user-stat-number">0</div>
              <div className="user-stat-label">Favorite Cards</div>
            </div>
          </div>
        </div>

        <div className="user-coming-soon">
          <p>
            Purchased cards, downloads, and favorites will populate here once the 
            Orders and Favorites modules are live.
          </p>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserDashboard;