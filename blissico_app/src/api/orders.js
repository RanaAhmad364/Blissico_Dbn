import api from './axiosConfig';

export const getMyOrders = () => api.get('/api/orders').then(r => r.data.data);
export const getOrder = (id) => api.get(`/api/orders/${id}`).then(r => r.data.data);



