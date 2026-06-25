import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lendtrack_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRedirecting = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Something went wrong. Please try again.';

    if (status === 401 && !isRedirecting) {
      isRedirecting = true;
      localStorage.removeItem('lendtrack_token');
      localStorage.removeItem('lendtrack_user');
      if (!window.location.pathname.startsWith('/login')) {
        toast.error('Session expired. Please log in again.');
        window.location.href = '/login';
      }
    }

    return Promise.reject({ ...error, message });
  }
);

export default api;
