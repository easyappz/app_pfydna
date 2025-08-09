import instance from './axios';

export async function getMe() {
  const { data } = await instance.get('/api/users/me');
  return data;
}

export async function updateProfile(payload) {
  const { data } = await instance.patch('/api/users/me', payload);
  return data;
}

export async function updateFilterSettings(payload) {
  const { data } = await instance.patch('/api/users/filter-settings', payload);
  return data;
}
