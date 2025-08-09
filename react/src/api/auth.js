import instance from './axios';

// POST /api/auth/register
export async function register({ email, password }) {
  const response = await instance.post('/api/auth/register', { email, password });
  return response.data;
}

// POST /api/auth/login
export async function login({ email, password }) {
  const response = await instance.post('/api/auth/login', { email, password });
  return response.data;
}

// GET /api/auth/me
export async function getAuthMe() {
  const response = await instance.get('/api/auth/me');
  return response.data;
}

// POST /api/auth/request-reset
export async function requestPasswordReset({ email }) {
  const response = await instance.post('/api/auth/request-reset', { email });
  return response.data;
}

// POST /api/auth/reset-password
export async function resetPassword({ email, code, newPassword }) {
  const response = await instance.post('/api/auth/reset-password', { email, code, newPassword });
  return response.data;
}

export default {
  register,
  login,
  getAuthMe,
  requestPasswordReset,
  resetPassword,
};
