import instance from './axios';

export const photosApi = {
  upload(payload) {
    return instance.post('/api/photos/upload', payload);
  },
  my() {
    return instance.get('/api/photos/my');
  },
  toggleActive(photoId, payload) {
    return instance.post(`/api/photos/${photoId}/toggle-active`, payload);
  },
};

export default photosApi;
