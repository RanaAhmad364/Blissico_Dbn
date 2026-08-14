import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Marquee from '../../components/Marquee';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Auth.css';

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1 minute = 60 seconds
  const [timeLeft, setTimeLeft] = useState(60);

  const { verifyOTP, resendOTP } = useAuth();

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0 || success) {
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, success]);

  // Format timer as MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(
    seconds
  ).padStart(2, '0')}`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    if (!email) {
      setError('Invalid session. Please register again.');
      return;
    }

    if (timeLeft <= 0) {
      setError('OTP has expired. Please request a new OTP.');
      return;
    }

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    setLoading(true);

    try {
      await verifyOTP(email, otp);

      setSuccess(true);

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      console.error('OTP verification error:', err);

      const data = err?.response?.data;

      if (data?.errors) {
        const firstError = Object.values(data.errors)[0];
        setError(firstError || data.message || 'Invalid OTP.');
      } else if (data?.message) {
        setError(data.message);
      } else if (data?.error) {
        setError(data.error);
      } else {
        setError('Invalid or expired OTP code.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
  if (!email) {
    setError('Invalid session. Please register again.');
    return;
  }

  setError('');
  setLoading(true);

  try {
    await resendOTP(email);

    // New OTP ke liye timer restart
    setTimeLeft(60);

    // Old OTP clear
    setOtp('');

  } catch (err) {
    console.error('Resend OTP error:', err);

    const data = err?.response?.data;

    if (data?.errors) {
      const firstError = Object.values(data.errors)[0];
      setError(firstError || data.message || 'Failed to resend OTP.');
    } else if (data?.message) {
      setError(data.message);
    } else if (data?.error) {
      setError(data.error);
    } else {
      setError('Failed to resend OTP. Please try again.');
    }
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

            <p>
              Enter the 6-digit code sent to{' '}
              <strong>{email || 'your email'}</strong>
            </p>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          {success && (
            <div className="auth-success">
              Email Verified! Redirecting to login...
            </div>
          )}

          {/* OTP TIMER */}
          {!success && (
            <div
              style={{
                textAlign: 'center',
                margin: '20px 0',
                fontSize: '18px',
                fontWeight: '600'
              }}
            >
              {timeLeft > 0 ? (
                <>
                  OTP expires in{' '}
                  <strong>{formattedTime}</strong>
                </>
              ) : (
                <strong>
                  OTP has expired
                </strong>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>OTP Code</label>

              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, ''));
                  setError('');
                }}
                required
                disabled={loading || success || timeLeft <= 0}
              />
            </div>

            <button
              type="submit"
              className="auth-btn"
              disabled={loading || success || timeLeft <= 0}
            >
              {loading
                ? 'Verifying...'
                : timeLeft <= 0
                ? 'OTP Expired'
                : 'Verify Account'}
            </button>

          </form>

{!success && timeLeft <= 0 && (
  <div
    style={{
      textAlign: 'center',
      marginTop: '20px'
    }}
  >
    <p>OTP has expired. Need a new code?</p>

    <button
      type="button"
      className="auth-btn"
      onClick={handleResendOTP}
      disabled={loading}
    >
      {loading ? 'Sending...' : 'Resend OTP'}
    </button>
  </div>
)}

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VerifyOTP;