import instance from './axios';

// Deprecated: POST /api/photos/activate
export async function legacyActivatePhoto({ imageBase64 }) {
  const response = await instance.post('/api/photos/activate', { imageBase64 });
  return response.data;
}

// POST /api/photos/upload
export async function uploadPhoto({ dataBase64, mimeType }) {
  const response = await instance.post('/api/photos/upload', { dataBase64, mimeType });
  return response.data;
}

// GET /api/photos/my
export async function getMyPhotos() {
  const response = await instance.get('/api/photos/my');
  return response.data;
}

// POST /api/photos/{photoId}/toggle-active
export async function togglePhotoActive(photoId, active) {
  const url = `/api/photos/${photoId}/toggle-active`;
  const hasActive = active !== undefined;
  const body = hasActive ? { active } : {};
  const response = await instance.post(url, body);
  return response.data;
}

export default {
  legacyActivatePhoto,
  uploadPhoto,
  getMyPhotos,
  togglePhotoActive,
};
