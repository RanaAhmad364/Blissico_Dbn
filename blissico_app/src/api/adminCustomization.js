import api from './axiosConfig';

export const getDefaultCustomization = (cardId) =>
  api.get(`/api/admin/cards/${cardId}/default-customization`).then((r) => r.data);

export const saveDefaultCustomization = (cardId, payload) =>
  api.post(`/api/admin/cards/${cardId}/default-customization`, payload).then((r) => r.data);


