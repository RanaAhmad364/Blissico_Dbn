import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in when the app loads
    const token = localStorage.getItem('blissico_token');
    const storedUser = localStorage.getItem('blissico_user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // --- REGISTER ---
  const register = async (name, email, password) => {
    const response = await api.post('/api/auth/register', { name, email, password });
    return response.data;
  };

  // --- VERIFY OTP ---
  const verifyOTP = async (email, code) => {
    const response = await api.post('/api/auth/verify-otp', { email, code });
    return response.data;
  };

  // --- LOGIN ---
  const login = async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    const { access_token, user } = response.data;
    
    // Save to local storage
    localStorage.setItem('blissico_token', access_token);
    localStorage.setItem('blissico_user', JSON.stringify(user));
    setUser(user);
    return response.data;
  };

  // --- LOGOUT ---
  const logout = () => {
    localStorage.removeItem('blissico_token');
    localStorage.removeItem('blissico_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, verifyOTP, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);