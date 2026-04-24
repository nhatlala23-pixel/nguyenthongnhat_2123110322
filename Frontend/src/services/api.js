import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5274/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const IMAGE_BASE_URL = 'http://localhost:5274';

export default api;
