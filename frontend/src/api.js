import axios from 'axios';

// ── Use Render backend in production, localhost in dev ───────────
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginAdmin = (username, password) => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  return api.post('/api/login', params);
};


// ── Images ────────────────────────────────────────────────────────
// Upload: frontend sends image file via multipart/form-data
export const uploadImage = (formData) =>
  api.post('/api/images/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getImages = (category) => {
  const params = category ? { category } : {};
  return api.get('/api/images/', { params });
};

export const getImage  = (id) => api.get(`/api/images/${id}`);
export const updateImage = (id, data) => api.put(`/api/images/${id}`, data);
export const deleteImage = (id) => api.delete(`/api/images/${id}`);

// ── Stats ─────────────────────────────────────────────────────────
export const getStats = () => api.get('/api/stats/');

// ── Contact ───────────────────────────────────────────────────────
export const getContact    = () => api.get('/api/contact/');
export const updateContact = (data) => api.put('/api/contact/', data);

// ── Image URL helper ──────────────────────────────────────────────
export const getImageUrl = (filename) => {
  if (filename && filename.startsWith('http')) {
    return filename; // It's an absolute URL
  }
  return filename; // Failover string
};

export default api;
