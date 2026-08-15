import api from './axiosConfig';

// --- Users ---
export const getUsers = () => api.get('/api/admin/users').then(r => r.data.data);
export const getUser = (id) => api.get(`/api/admin/users/${id}`).then(r => r.data.data);
export const updateUser = (id, data) => api.put(`/api/admin/users/${id}`, data).then(r => r.data);
export const deleteUser = (id) => api.delete(`/api/admin/users/${id}`).then(r => r.data);

// --- Categories / Collections / Occasions ---
export const getCategories = () => api.get('/api/admin/categories').then(r => r.data.data);
export const createCategory = (data) => api.post('/api/admin/categories', data).then(r => r.data);
export const updateCategory = (id, data) => api.put(`/api/admin/categories/${id}`, data).then(r => r.data);
export const deleteCategory = (id) => api.delete(`/api/admin/categories/${id}`).then(r => r.data);

export const getCollections = () => api.get('/api/admin/collections').then(r => r.data.data);
export const createCollection = (data) => api.post('/api/admin/collections', data).then(r => r.data);
export const updateCollection = (id, data) => api.put(`/api/admin/collections/${id}`, data).then(r => r.data);
export const deleteCollection = (id) => api.delete(`/api/admin/collections/${id}`).then(r => r.data);

export const getOccasions = () => api.get('/api/admin/occasions').then(r => r.data.data);
export const createOccasion = (data) => api.post('/api/admin/occasions', data).then(r => r.data);
export const updateOccasion = (id, data) => api.put(`/api/admin/occasions/${id}`, data).then(r => r.data);
export const deleteOccasion = (id) => api.delete(`/api/admin/occasions/${id}`).then(r => r.data);

// --- Cards ---
export const getAdminCards = (page = 1, perPage = 20) =>
  api.get('/api/admin/cards', { params: { page, per_page: perPage } }).then(r => r.data);
export const getAdminCard = (id) => api.get(`/api/admin/cards/${id}`).then(r => r.data.data);
export const createCard = (formData) =>
  api.post('/api/admin/cards', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
export const updateCard = (id, formData) =>
  api.put(`/api/admin/cards/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
export const deleteCard = (id) => api.delete(`/api/admin/cards/${id}`).then(r => r.data);

export const addCardTemplate = (cardId, formData) =>
  api.post(`/api/admin/cards/${cardId}/templates`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
export const deleteCardTemplate = (templateId) =>
  api.delete(`/api/admin/card-templates/${templateId}`).then(r => r.data);

