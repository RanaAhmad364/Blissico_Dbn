import axios from 'axios';

// export const BASE_URL = 'http://127.0.0.1:5000';
export const API_BASE = 'https://blissico-dbn.onrender.com';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('blissico_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let onSessionExpired = null;
export const registerSessionExpiredHandler = (handler) => { onSessionExpired = handler; };

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    const isAuthCall = url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/refresh');
    const hadToken = !!localStorage.getItem('blissico_token');

    // Only treat this as a "session timed out" event if the person actually
    // had a session — a 401 from a genuinely logged-out guest isn't a timeout.
    if (status === 401 && !isAuthCall && hadToken && onSessionExpired) {
      onSessionExpired();
    }
    return Promise.reject(error);
  }
);

export default api;