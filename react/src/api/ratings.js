import instance from './axios';

// GET /api/ratings/next
export async function getNextForRating({ gender, ageFrom, ageTo } = {}) {
  const params = {};
  if (gender !== undefined) params.gender = gender;
  if (ageFrom !== undefined) params.ageFrom = ageFrom;
  if (ageTo !== undefined) params.ageTo = ageTo;
  const response = await instance.get('/api/ratings/next', { params });
  return response.data;
}

// POST /api/ratings
export async function createRating({ photoId, value }) {
  const response = await instance.post('/api/ratings', { photoId, value });
  return response.data;
}

// POST /api/points/rate
export async function transferPointsOnRate({ ownerId, rating }) {
  const response = await instance.post('/api/points/rate', { ownerId, rating });
  return response.data;
}

export default {
  getNextForRating,
  createRating,
  transferPointsOnRate,
};
