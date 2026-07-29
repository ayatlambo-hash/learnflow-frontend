import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 60000, // long timeout to survive Render free-tier cold starts
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lf_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401, and auto-retry once on network/timeout errors
// (handles the backend "waking up" from Render free-tier sleep)
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const config = err.config;
    const isNetworkOrTimeout = err.code === 'ECONNABORTED' || !err.response;

    if (config && isNetworkOrTimeout && !config._retry) {
      config._retry = true;
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return api(config);
    }

    if (err.response?.status === 401) {
      localStorage.removeItem('lf_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
