import axios from 'axios';

// Determine API URL based on environment
const getApiUrl = () => {
  // Production: use environment variable or default to production backend
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || 'https://valididea.onrender.com/api';
  }
  // Development: use localhost
  return import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401/403 errors (optional: auto-logout)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // window.location.href = '/login'; // Optional: force redirect
    }
    return Promise.reject(error);
  }
);

export default api;
