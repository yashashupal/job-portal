import axios from 'axios';

// Default to live Render backend if VITE_API_URL is not provided
export const SERVER_BASE_URL = (
  import.meta.env.VITE_API_URL || 'https://job-portal-backend-46no.onrender.com/api'
).replace(/\/api\/?$/, '');

export const API_BASE_URL = `${SERVER_BASE_URL}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: auto-clear tokens if invalid/expired
      // localStorage.removeItem('access_token');
      // localStorage.removeItem('refresh_token');
      // localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;
