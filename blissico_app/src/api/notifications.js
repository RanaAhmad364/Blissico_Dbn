import api from './axiosConfig';

export const getNotifications = async ({ unreadOnly = false, limit } = {}) => {
  const params = {};
  if (unreadOnly) params.unread_only = true;
  if (limit) params.limit = limit;

  const response = await api.get('/api/notifications', { params });
  return response.data.data || [];
};

export const getUnreadNotificationCount = async () => {
  const response = await api.get('/api/notifications/unread-count');
  return response.data.data?.count || 0;
};

export const markNotificationRead = async (notificationId) => {
  const response = await api.put(`/api/notifications/${notificationId}/read`);
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await api.put('/api/notifications/mark-all-read');
  return response.data;
};
