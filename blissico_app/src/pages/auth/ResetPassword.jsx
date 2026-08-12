import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
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

  const location = useLocation();
  const email = location.state?.email;
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) return setError('Passwords do not match.');
    if (newPassword.length < 8) return setError('Password must be at least 8 characters.');
    if (!email) return setError('Session expired — please restart from Forgot Password.');

    setLoading(true);
    try {
      await resetPassword(email, otp, newPassword);
      setMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired code.');
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
            <p>{email ? `Enter the code sent to ${email}.` : 'Enter the code from your email.'}</p>
          </div>

          {error && <div className="auth-error">{error}</div>}
          {message && <div className="auth-success">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Reset Code (OTP)</label>
              <input
                type="text"
                placeholder="Enter the 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                placeholder="Re-enter your new password"
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
            <p><Link to="/login" className="auth-link">Back to Sign In</Link></p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;