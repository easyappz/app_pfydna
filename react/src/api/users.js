import instance from './axios';

export const getMyProfile = async () => {
  const { data } = await instance.get('/api/users/me');
  return data; // { user }
};

export const updateMyProfile = async (payload) => {
  const { data } = await instance.patch('/api/users/me', payload);
  return data; // { user }
};

export const updateFilterSettings = async (payload) => {
  const { data } = await instance.patch('/api/users/filter-settings', payload);
  return data; // { user }
};
