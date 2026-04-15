import axios from 'axios';

// Use environment variable for production, fallback to proxy for development
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Reports API
export const reportsAPI = {
  create: (formData) => {
    return axios.post(`${API_URL}/reports`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getAll: (params) => api.get('/reports', { params }),
  getRecent: () => api.get('/reports/recent'),
  getById: (id) => api.get(`/reports/${id}`),
  updateStatus: (id, data) => api.put(`/reports/${id}/status`, data),
  delete: (id) => api.delete(`/reports/${id}`),
  acceptTask: (id, data) => api.post(`/reports/${id}/accept`, data),
  updateProgress: (id, formData) => {
    const token = localStorage.getItem('token');
    return axios.put(`${API_URL}/reports/${id}/progress`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
  },
  checkIn: (id, data) => api.post(`/reports/${id}/checkin`, data)
};

// Users API
export const usersAPI = {
  getPetugasCount: () => api.get('/users/petugas/count'),
  getAllPetugas: () => api.get('/users/petugas'),
  getPetugasLocations: () => api.get('/users/petugas/locations'),
  createPetugas: (data) => api.post('/users/petugas', data),
  updatePetugas: (id, data) => api.put(`/users/petugas/${id}`, data),
  deletePetugas: (id) => api.delete(`/users/petugas/${id}`),
  getMyTasks: (params) => api.get('/users/tasks', { params }),
  updateGPSLocation: (data) => api.post('/users/gps/update', data)
};

// Stats API
export const statsAPI = {
  getStats: () => api.get('/stats'),
  getPerformance: () => api.get('/stats/performance')
};

export default api;

