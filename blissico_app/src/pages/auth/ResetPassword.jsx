import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Marquee from '../../components/Marquee';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Auth.css';

const ResetPassword = () => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    if (newPassword.length < 8) {
      return setError('Password must be at least 8 characters.');
    }

    setLoading(true);
    try {
      // Connect this to your backend later
      // await api.post('/api/auth/reset-password', { otp, newPassword });
      setMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired code.');
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
            <h2>Reset Password</h2>
            <p>Enter the OTP code sent to your email and set your new password.</p>
          </div>

          {message && <div className="auth-success">{message}</div>}
          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>OTP Code</label>
              <input 
                type="text" 
                placeholder="6-digit code" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                required 
                disabled={loading}
                maxLength="6"
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input 
                type="password" 
                placeholder="Enter new password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                required 
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input 
                type="password" 
                placeholder="Confirm new password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                disabled={loading}
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Back to <Link to="/login" className="auth-link">Login</Link></p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;