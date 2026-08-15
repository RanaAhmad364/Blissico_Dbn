import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Marquee from '../components/Marquee';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const UserDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  if (loading || !user) {
    return <div style={{ padding: 80, textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div className="user-dashboard-page">
      <Marquee />
      <Navbar />

      <div style={{ padding: '60px 40px', maxWidth: 960, margin: '0 auto' }}>
        <h1>Welcome back, {user.first_name}!</h1>
        <p style={{ color: '#666', marginBottom: 40 }}>Here's what's happening with your account.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          <div style={{ border: '1px solid #eee', borderRadius: 10, padding: 24 }}>
            <div style={{ fontSize: 28, fontWeight: 600 }}>0</div>
            <div style={{ color: '#888' }}>Purchased Cards</div>
          </div>
          <div style={{ border: '1px solid #eee', borderRadius: 10, padding: 24 }}>
            <div style={{ fontSize: 28, fontWeight: 600 }}>0</div>
            <div style={{ color: '#888' }}>Downloads</div>
          </div>
          <div style={{ border: '1px solid #eee', borderRadius: 10, padding: 24 }}>
            <div style={{ fontSize: 28, fontWeight: 600 }}>0</div>
            <div style={{ color: '#888' }}>Favorite Cards</div>
          </div>
        </div>

        <p style={{ marginTop: 40, color: '#aaa', fontSize: '0.9rem' }}>
          Purchased cards, downloads, and favorites will populate here once the Orders and Favorites modules are live.
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default UserDashboard;