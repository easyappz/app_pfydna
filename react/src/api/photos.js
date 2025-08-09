import instance from './axios';

export async function uploadPhoto(payload) {
  const { data } = await instance.post('/api/photos/upload', payload);
  return data;
}

export async function myPhotos() {
  const { data } = await instance.get('/api/photos/my');
  return data;
}

export async function toggleActive(photoId, active) {
  const body = typeof active === 'boolean' ? { active } : {};
  const { data } = await instance.post(`/api/photos/${photoId}/toggle-active`, body);
  return data;
}
