import api from './axiosConfig';

export const downloadCard = (cardId) => api.post(`/api/cards/${cardId}/download`).then(r => r.data.data);
export const getMyDownloads = () => api.get('/api/downloads').then(r => r.data.data);

export const downloadCardFile = async (cardId, format = 'image') => {
  const res = await api.get(`/api/cards/${cardId}/download/file`, {
    params: { format },
    responseType: 'blob',
  });

  const disposition = res.headers['content-disposition'];
  let filename = `card.${format === 'pdf' ? 'pdf' : 'jpg'}`;
  const match = disposition && disposition.match(/filename="?([^"]+)"?/);
  if (match) filename = match[1];

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};



