import { apiClient } from './client.js';

export async function registerUser(payload) {
  const { data } = await apiClient.post('/api/auth/register', payload);
  return data.data;
}

export async function loginUser(payload) {
  const { data } = await apiClient.post('/api/auth/login', payload);
  return data.data;
}

export async function fetchMe() {
  const { data } = await apiClient.get('/api/auth/me');
  return data.data;
}
