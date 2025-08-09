import instance from './axios';

export const usersApi = {
  getMe() {
    return instance.get('/api/users/me');
  },
  updateMe(payload) {
    return instance.patch('/api/users/me', payload);
  },
  updateFilterSettings(payload) {
    return instance.patch('/api/users/filter-settings', payload);
  },
};

export default usersApi;
