import api from './axiosConfig';

export const getCategories = () => api.get('/api/categories').then(r => r.data.data);
export const getCollections = () => api.get('/api/collections').then(r => r.data.data);
export const getOccasions = () => api.get('/api/occasions').then(r => r.data.data);

export const getCards = (params = {}) =>
  api.get('/api/cards', { params }).then(r => r.data);

export const getCard = (id) =>
  api.get(`/api/cards/${id}`).then(r => r.data.data);

export const API_BASE = 'http://127.0.0.1:5000';
export const assetUrl = (path) => (path ? `${API_BASE}${path}` : path);

