import axios from 'axios';

const api = axios.create({
  baseURL: 'https://nguyenthongnhat-2123110322.onrender.com/api', 
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

export const IMAGE_BASE_URL = 'https://nguyenthongnhat-2123110322.onrender.com';

export default api;
