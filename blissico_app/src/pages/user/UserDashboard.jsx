// src/pages/user/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { getMyOrders } from '../../api/orders';
import { getMyDownloads } from '../../api/downloads';
import { getMyCustomizations } from '../../api/customization';
import UserLayout from '../../components/user/UserLayout';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { favoritesCount } = useFavorites();
  const navigate = useNavigate();

  const [purchasedCount, setPurchasedCount] = useState(0);
  const [downloadsCount, setDownloadsCount] = useState(0);
  const [customizedCount, setCustomizedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;

    // Fetch all the data in parallel
    Promise.all([
      getMyOrders().catch(() => []),
      getMyDownloads().catch(() => []),
      getMyCustomizations().catch(() => []),
    ])
      .then(([orders, downloads, customizations]) => {
        // Calculate purchased cards count (de-duplicate by card_id)
        const paidItems = (orders || [])
          .filter((o) => o.status === 'paid')
          .flatMap((o) => o.items || []);

        const seen = new Set();
        const uniquePurchased = paidItems.filter((item) => {
          if (seen.has(item.card_id)) return false;
          seen.add(item.card_id);
          return true;
        });

        setPurchasedCount(uniquePurchased.length);
        setDownloadsCount((downloads || []).length);
        setCustomizedCount((customizations || []).length);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (authLoading || !user) {
    return (
      <UserLayout>
        <div className="user-loading-container">
          <div className="user-loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="user-dashboard-container">
        {/* Stats Cards */}
        <div className="user-stats-grid">
          {loading ? (
            <>
              <div className="user-stat-card user-stat-loading">
                <div className="user-stat-skeleton"></div>
              </div>
              <div className="user-stat-card user-stat-loading">
                <div className="user-stat-skeleton"></div>
              </div>
              <div className="user-stat-card user-stat-loading">
                <div className="user-stat-skeleton"></div>
              </div>
              <div className="user-stat-card user-stat-loading">
                <div className="user-stat-skeleton"></div>
              </div>
            </>
          ) : (
            <>
              <div className="user-stat-card">
                <div className="user-stat-icon">📦</div>
                <div>
                  <div className="user-stat-number">{purchasedCount}</div>
                  <div className="user-stat-label">Purchased Cards</div>
                </div>
              </div>
              <div className="user-stat-card">
                <div className="user-stat-icon">⬇️</div>
                <div>
                  <div className="user-stat-number">{downloadsCount}</div>
                  <div className="user-stat-label">Downloads</div>
                </div>
              </div>
              <div className="user-stat-card">
                <div className="user-stat-icon">❤️</div>
                <div>
                  <div className="user-stat-number">{favoritesCount}</div>
                  <div className="user-stat-label">Favorite Cards</div>
                </div>
              </div>
              <div className="user-stat-card">
                <div className="user-stat-icon">✨</div>
                <div>
                  <div className="user-stat-number">{customizedCount}</div>
                  <div className="user-stat-label">Customized Cards</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default UserDashboard;