import api from './axiosConfig';

export const getCustomization = (cardId) =>
  api.get(`/api/cards/${cardId}/customization`).then(r => r.data.data);

export const saveCustomization = (cardId, payload) =>
  api.post(`/api/cards/${cardId}/customization`, payload).then(r => r.data.data);






