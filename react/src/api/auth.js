import instance from './axios';

export const authRegister = async ({ email, password }) => {
  const { data } = await instance.post('/api/auth/register', { email, password });
  return data; // { token, user }
};

export const authLogin = async ({ email, password }) => {
  const { data } = await instance.post('/api/auth/login', { email, password });
  return data; // { token, user }
};

export const authMe = async () => {
  const { data } = await instance.get('/api/auth/me');
  return data; // { user }
};

export const requestPasswordReset = async ({ email }) => {
  const { data } = await instance.post('/api/auth/request-reset', { email });
  return data; // { message, code?, expiresAt }
};

export const resetPassword = async ({ email, code, newPassword }) => {
  const { data } = await instance.post('/api/auth/reset-password', { email, code, newPassword });
  return data; // { message }
};
