import instance from './axios';

export async function uploadPhoto(payload) {
  const { data } = await instance.post('/api/photos/upload', payload);
  return data;
}

export async function getMyPhotos() {
  const { data } = await instance.get('/api/photos/my');
  return data;
}

export async function toggleActive(photoId, desiredState) {
  const { data } = await instance.post(`/api/photos/${photoId}/toggle-active`, desiredState !== undefined ? { active: desiredState } : {});
  return data;
}
