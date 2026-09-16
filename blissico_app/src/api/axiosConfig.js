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

// --- Silent token refresh ---
// The access token expires after ~15 minutes (backend default). Without
// this, every request made after that point failed with a raw 401 — even
// while the person was still actively using the site — because nothing
// automatically used the refresh token that's already sitting in
// localStorage. This queues concurrent requests so a burst of calls (e.g.
// notifications + admin/downloads firing together) only triggers ONE
// refresh call, then retries all of them with the new token.
let isRefreshing = false;
let queue = [];

const processQueue = (error, token = null) => {
  queue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token)));
  queue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const url = original?.url || '';
    const isAuthCall = url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/refresh');
    const hadToken = !!localStorage.getItem('blissico_token');

    if (status === 401 && !isAuthCall && hadToken && !original._retried) {
      const refreshToken = localStorage.getItem('blissico_refresh_token');
      if (!refreshToken) {
        if (onSessionExpired) onSessionExpired();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Another request already triggered a refresh — wait for it instead
        // of firing a second /auth/refresh call.
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then((newToken) => {
          original._retried = true;
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original);
        }).catch((err) => Promise.reject(err));
      }

      original._retried = true;
      isRefreshing = true;
      try {
        const res = await axios.post(`${API_BASE}/api/auth/refresh`, {}, {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });
        const newToken = res.data.data.access_token;
        localStorage.setItem('blissico_token', newToken);
        processQueue(null, newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // The refresh token itself is invalid/expired — THIS is a genuine
        // session timeout, so fall back to the existing "please log in
        // again" flow.
        if (onSessionExpired) onSessionExpired();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;