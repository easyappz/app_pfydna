import instance from './axios';

export async function uploadPhoto({ dataBase64, mimeType }) {
  const res = await instance.post('/api/photos/upload', { dataBase64, mimeType });
  return res.data.photo;
}

export async function getMyPhotos() {
  const res = await instance.get('/api/photos/my');
  return res.data.photos || [];
}

export async function togglePhotoActive({ photoId, active }) {
  const body = typeof active === 'boolean' ? { active } : {};
  const res = await instance.post(`/api/photos/${photoId}/toggle-active`, body);
  return res.data.photo;
}

export default {
  uploadPhoto,
  getMyPhotos,
  togglePhotoActive,
};
