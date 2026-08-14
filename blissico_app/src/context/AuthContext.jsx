import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';

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
    return response.data;
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

  return (
    <AuthContext.Provider value={{ user, loading, login, register, verifyOTP, resendOTP, resendPasswordResetOTP, logout, forgotPassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);