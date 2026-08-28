import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import axios from 'axios';
import { BASE_URL, registerSessionExpiredHandler } from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('blissico_token');
    const storedUser = localStorage.getItem('blissico_user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // --- REGISTER ---
  // Splits the single "Full Name" field into first_name/last_name
  // to match what the backend requires.
  const register = async (first_name, last_name, email, password, confirmPassword) => {
  const response = await api.post('/api/auth/register', {
    first_name,
    last_name,
    email,
    password,
    confirmPassword, // harmless extra field, backend ignores it
  });
  return response.data;
}

  // --- VERIFY OTP ---
  const verifyOTP = async (email, otp) => {
    const response = await api.post('/api/auth/verify-otp', { email, otp });
    return response.data;
  };

  // --- RESEND OTP ---
  const resendOTP = async (email) => {
    const response = await api.post('/api/auth/resend-otp', { email });
    return response.data;
  };

  // --- LOGIN ---
  const login = async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    const { access_token, refresh_token, user } = response.data.data; // <-- unwrap .data.data
    localStorage.setItem('blissico_token', access_token);
    localStorage.setItem('blissico_refresh_token', refresh_token);
    localStorage.setItem('blissico_user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  // --- LOGOUT ---
  const logout = () => {
    api.post('/api/auth/logout').catch(() => {});
    localStorage.removeItem('blissico_token');
    localStorage.removeItem('blissico_refresh_token');
    localStorage.removeItem('blissico_user');
    setUser(null);
  };

  // --- FORGOT PASSWORD ---
  const forgotPassword = async (email) => {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  };

  // --- RESET PASSWORD ---
  const resetPassword = async (email, otp, new_password) => {
    const response = await api.post('/api/auth/reset-password', { email, otp, new_password });
    return response.data;
  };

  // --- RESEND PASSWORD RESET OTP ---
const resendPasswordResetOTP = async (email) => {
  const response = await api.post(
    '/api/auth/resend-password-reset-otp',
    { email }
  );
  return response.data;
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedFields };
      localStorage.setItem('blissico_user', JSON.stringify(newUser));
      return newUser;
    });
  };  

  const [sessionExpired, setSessionExpired] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    registerSessionExpiredHandler(() => setSessionExpired(true));
  }, []);

  const extendSession = async () => {
    const refreshToken = localStorage.getItem('blissico_refresh_token');
    if (!refreshToken) {
      handleLoginAgain();
      return;
    }
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/refresh`, {}, {
        headers: { Authorization: `Bearer ${refreshToken}` },
      });
      localStorage.setItem('blissico_token', res.data.data.access_token);
      setSessionExpired(false);
    } catch {
      handleLoginAgain();
    }
  };

  const handleLoginAgain = () => {
    logout();
    setSessionExpired(false);
    navigate('/login');
  };


  return (
     <AuthContext.Provider value={{ user, loading, login, register, verifyOTP, resendOTP, resendPasswordResetOTP, logout, forgotPassword, resetPassword, updateUser }}>
    {children}
    {sessionExpired && (
      <div style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
      }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: '32px 36px', maxWidth: 380, textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px' }}>Your session has timed out</h3>
          <p style={{ color: '#888', margin: '0 0 24px' }}>
            For your security, you've been signed out due to inactivity.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button
              onClick={extendSession}
              style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: '#7c3aed', color: '#fff', cursor: 'pointer' }}
            >
              Extend Session
            </button>
            <button
              onClick={handleLoginAgain}
              style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}
            >
              Login Again
            </button>
          </div>
        </div>
      </div>
    )}
  </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);