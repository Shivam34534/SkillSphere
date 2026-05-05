import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    try {
      const userInfo = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
      if (userInfo) {
        const parsed = JSON.parse(userInfo);
        if (parsed && parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      }
    } catch (err) {
      console.error('Interceptor storage parse error:', err);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
