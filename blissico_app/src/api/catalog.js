import api, {API_BASE} from './axiosConfig';

const pendingCardRequests = new Map();

const dedupeCardRequest = (key, request) => {
  const token = localStorage.getItem('blissico_token') || '';
  const requestKey = `${key}\u0000${token}`;
  if (!pendingCardRequests.has(requestKey)) {
    const pending = request().finally(() => pendingCardRequests.delete(requestKey));
    pendingCardRequests.set(requestKey, pending);
  }
  return pendingCardRequests.get(requestKey);
};

export const getCategories = () => api.get('/api/categories').then(r => r.data.data);
export const getCollections = () => api.get('/api/collections').then(r => r.data.data);
export const getOccasions = () => api.get('/api/occasions').then(r => r.data.data);

export const getCards = (params = {}) => {
  const query = new URLSearchParams(
    Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null)
      .sort(([left], [right]) => left.localeCompare(right))
  ).toString();
  const key = `/api/cards${query ? `?${query}` : ''}`;
  return dedupeCardRequest(key, () => api.get('/api/cards', { params }).then(r => r.data));
};

export const getCard = (id) =>
  dedupeCardRequest(`/api/cards/${id}`, () => api.get(`/api/cards/${id}`).then(r => r.data.data));

// export const API_BASE = 'https://blissico-dbn.onrender.com';
export const assetUrl = (path) => (path ? `${API_BASE}${path}` : path);


