import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the JWT (if present) to every outgoing request.
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize errors so callers can rely on a consistent shape,
// and react to an expired/invalid token globally.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token missing/expired/invalid. Clear stale auth state so the UI
      // reflects that the user is logged out. We don't force-redirect here;
      // components decide how to react (e.g. show a message, send to /login).
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
