import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Marquee from '../components/Marquee';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Auth.css';

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email; // Email passed from the Register page
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { verifyOTP } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Guard clause in case user lands here directly without registering first
    if (!email) {
      setError('Invalid session. Please register again.');
      setLoading(false);
      return;
    }

    try {
      await verifyOTP(email, otp);
      setSuccess(true);
      // Wait a moment, then redirect to login
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <Marquee />
      <Navbar />
      <div className="auth-container">
        <div className="auth-box">
          <div className="auth-header">
            <h2>Verify Your Email</h2>
            <p>Enter the 6-digit code sent to <strong>{email || 'your email'}</strong></p>
          </div>

          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">Email Verified! Redirecting to login...</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>OTP Code</label>
              <input 
                type="text" 
                placeholder="Enter 6-digit OTP" 
                maxLength="6"
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                required 
                disabled={loading || success}
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading || success}>
              {loading ? 'Verifying...' : 'Verify Account'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VerifyOTP;