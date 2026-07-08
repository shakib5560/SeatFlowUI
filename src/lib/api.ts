import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to attach Authorization header for admin routes
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // Check if this is an admin route
      const isAdminRoute = config.url?.startsWith('/admin') || config.url?.includes('/admin');
      if (isAdminRoute) {
        const token = localStorage.getItem('seatflow_admin_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
