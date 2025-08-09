import instance from './axios';

export async function register(payload) {
  const { data } = await instance.post('/api/auth/register', payload);
  return data;
}

export async function login(payload) {
  const { data } = await instance.post('/api/auth/login', payload);
  return data;
}

export async function authMe() {
  const { data } = await instance.get('/api/auth/me');
  return data;
}

export async function requestReset(payload) {
  const { data } = await instance.post('/api/auth/request-reset', payload);
  return data;
}

export async function resetPassword(payload) {
  const { data } = await instance.post('/api/auth/reset-password', payload);
  return data;
}
