import React, { useEffect, useState } from 'react';
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
  const [resendLoading, setResendLoading] = useState(false);

  // 1 minute = 60 seconds
  const [timeLeft, setTimeLeft] = useState(60);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const { resetPassword, resendPasswordResetOTP } = useAuth();

  // =========================
  // COUNTDOWN TIMER
  // =========================
  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  // =========================
  // FORMAT TIMER
  // =========================
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(
    seconds
  ).padStart(2, '0')}`;

  // =========================
  // RESET PASSWORD
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');

    if (!email) {
      setError('Session expired. Please restart from Forgot Password.');
      return;
    }

    if (timeLeft <= 0) {
      setError('OTP has expired. Please resend a new OTP.');
      return;
    }

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(email, otp, newPassword);

      setMessage(
        'Password reset successfully! Redirecting to login...'
      );

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error('Reset password error:', err);

      const data = err?.response?.data;

      if (data?.errors) {
        const firstError = Object.values(data.errors)[0];
        setError(firstError || data.message || 'Invalid OTP.');
      } else if (data?.message) {
        setError(data.message);
      } else if (data?.error) {
        setError(data.error);
      } else {
        setError('Invalid or expired OTP.');
      }

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // RESEND OTP
  // =========================
const handleResendOTP = async () => {
  if (!email) {
    setError('Session expired. Please restart from Forgot Password.');
    return;
  }

  setError('');
  setMessage('');
  setResendLoading(true);

  try {
    await resendPasswordResetOTP(email);

    setTimeLeft(60);
    setOtp('');

    setMessage('A new password reset OTP has been sent to your email.');

  } catch (err) {
    console.error('Resend password reset OTP error:', err);

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
    setResendLoading(false);
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

            <p>
              {email
                ? `Enter the code sent to ${email}.`
                : 'Enter the code from your email.'}
            </p>

          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          {message && (
            <div className="auth-success">
              {message}
            </div>
          )}

          {/* =========================
              OTP TIMER
          ========================= */}

          {timeLeft > 0 ? (

            <div
              style={{
                textAlign: 'center',
                margin: '20px 0',
                fontSize: '18px',
                fontWeight: '600'
              }}
            >
              OTP expires in{' '}
              <strong>{formattedTime}</strong>
            </div>

          ) : (

            <div
              style={{
                textAlign: 'center',
                margin: '20px 0'
              }}
            >
              <strong>OTP has expired</strong>
            </div>

          )}

          <form onSubmit={handleSubmit}>

            {/* OTP */}

            <div className="form-group">

              <label>Reset Code (OTP)</label>

              <input
                type="text"
                placeholder="Enter the 6-digit code"
                maxLength="6"
                value={otp}
                onChange={(e) => {
                  setOtp(
                    e.target.value.replace(/\D/g, '')
                  );
                  setError('');
                }}
                required
                disabled={
                  loading ||
                  timeLeft <= 0
                }
              />

            </div>

            {/* NEW PASSWORD */}

            <div className="form-group">

              <label>New Password</label>

              <input
                type="password"
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                required
                disabled={loading}
              />

            </div>

            {/* CONFIRM PASSWORD */}

            <div className="form-group">

              <label>Confirm New Password</label>

              <input
                type="password"
                placeholder="Re-enter your new password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
                disabled={loading}
              />

            </div>

            {/* RESET BUTTON */}

            <button
              type="submit"
              className="auth-btn"
              disabled={
                loading ||
                timeLeft <= 0
              }
            >
              {loading
                ? 'Resetting...'
                : timeLeft <= 0
                ? 'OTP Expired'
                : 'Reset Password'}
            </button>

          </form>

          {/* =========================
              RESEND OTP
          ========================= */}

          {timeLeft <= 0 && !loading && (

            <div
              style={{
                textAlign: 'center',
                marginTop: '20px'
              }}
            >

              <p>
                Didn't receive the OTP?
              </p>

              <button
                type="button"
                className="auth-btn"
                onClick={handleResendOTP}
                disabled={resendLoading}
              >
                {resendLoading
                  ? 'Sending...'
                  : 'Resend OTP'}
              </button>

            </div>

          )}

          <div className="auth-footer">

            <p>
              <Link
                to="/login"
                className="auth-link"
              >
                Back to Sign In
              </Link>
            </p>

          </div>

        </div>
      </div>

      <Footer />

    </div>
  );
};

export default ResetPassword;