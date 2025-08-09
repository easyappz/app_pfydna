import instance from './axios';

export const ratingsApi = {
  next(params) {
    return instance.get('/api/ratings/next', { params });
  },
  create(payload) {
    return instance.post('/api/ratings', payload);
  },
};

export default ratingsApi;
