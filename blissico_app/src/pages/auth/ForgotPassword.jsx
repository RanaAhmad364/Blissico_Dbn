import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Marquee from '../../components/Marquee';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setMessage('If an account exists with this email, you will receive a password reset code shortly.');
      setTimeout(() => navigate('/reset-password', { state: { email } }), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
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
            <h2>Forgot Password</h2>
            <p>Enter your email and we'll send you a reset code.</p>
          </div>

          {error && <div className="auth-error">{error}</div>}
          {message && <div className="auth-success">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Code'}
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

export default ForgotPassword;