import api from './axiosConfig';

export const getMyProfile = () => api.get('/api/profile').then(r => r.data.data);
export const updateMyProfile = (data) => api.put('/api/profile', data).then(r => r.data);
export const uploadProfilePicture = (file) => {
  const fd = new FormData();
  fd.append('profile_picture', file);
  return api.post('/api/profile/picture', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
};
export const removeProfilePicture = () => api.delete('/api/profile/picture').then(r => r.data);









