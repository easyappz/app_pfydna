import instance from './axios';

export const authApi = {
  register(payload) {
    return instance.post('/api/auth/register', payload);
  },
  login(payload) {
    return instance.post('/api/auth/login', payload);
  },
  me() {
    return instance.get('/api/auth/me');
  },
  requestReset(payload) {
    return instance.post('/api/auth/request-reset', payload);
  },
  resetPassword(payload) {
    return instance.post('/api/auth/reset-password', payload);
  },
};

export default authApi;
