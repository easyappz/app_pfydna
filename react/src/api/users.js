import instance from './axios';

// GET /api/users/me
export async function getMyProfile() {
  const response = await instance.get('/api/users/me');
  return response.data;
}

// PATCH /api/users/me
export async function updateMyProfile({ name, gender, age } = {}) {
  const body = {};
  if (name !== undefined) body.name = name;
  if (gender !== undefined) body.gender = gender;
  if (age !== undefined) body.age = age;
  const response = await instance.patch('/api/users/me', body);
  return response.data;
}

// PATCH /api/users/filter-settings
export async function updateFilterSettings({ gender, ageFrom, ageTo } = {}) {
  const body = {};
  if (gender !== undefined) body.gender = gender;
  if (ageFrom !== undefined) body.ageFrom = ageFrom;
  if (ageTo !== undefined) body.ageTo = ageTo;
  const response = await instance.patch('/api/users/filter-settings', body);
  return response.data;
}

export default {
  getMyProfile,
  updateMyProfile,
  updateFilterSettings,
};
