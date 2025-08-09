import instance from './axios';

export async function getNextPhoto(params) {
  const { data } = await instance.get('/api/ratings/next', { params });
  return data;
}

export async function createRating(payload) {
  const { data } = await instance.post('/api/ratings', payload);
  return data;
}
