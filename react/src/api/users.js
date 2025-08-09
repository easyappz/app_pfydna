import instance from './axios';

export async function getMe() {
  const res = await instance.get('/api/users/me');
  return res.data.user;
}

export default { getMe };
