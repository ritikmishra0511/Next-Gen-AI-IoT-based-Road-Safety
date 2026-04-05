// src/utils/api.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL: API_BASE });

// Attach token automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('sr_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sr_token');
      localStorage.removeItem('sr_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// Auth helpers
export const login = (username, password, role) =>
  api.post('/auth/login', { username, password, role });

export const logout = () => api.post('/auth/logout');

// Violations
export const getViolations = (params) => api.get('/violations', { params });
export const createViolation = (data) => api.post('/violations', data);
export const getViolationStats = () => api.get('/violations/stats');
export const payViolation = (id) => api.patch(`/violations/${id}/pay`);

// Emergency
export const getEmergencies = () => api.get('/emergency');
export const createEmergency = (data) => api.post('/emergency', data);
export const resolveEmergency = (id) => api.patch(`/emergency/${id}/resolve`);

// Analytics
export const getAnalytics = () => api.get('/analytics');

// Vehicle
export const getVehicle = (plate) => api.get(`/vehicle/${plate}`);
export const getAllVehicles = () => api.get('/vehicle');

// IoT
export const sendHelmetEvent = (data) => api.post('/iot/helmet', data);
export const sendRfidEvent = (data) => api.post('/iot/rfid', data);
export const getIotStatus = () => api.get('/iot/status');
export const resetIot = () => api.post('/iot/reset');
