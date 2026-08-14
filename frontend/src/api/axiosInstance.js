import axios from 'axios';
const backendAPI = import.meta.env.VITE_BACKEND_API;
const api = axios.create({
  baseURL: `${backendAPI}/`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;