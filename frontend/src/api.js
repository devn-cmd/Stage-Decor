import axios from 'axios';

// ── Use Render backend in production, localhost in dev ───────────
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({ baseURL: API_BASE });

// ── Images ────────────────────────────────────────────────────────
// Upload: frontend sends firebase_url (already uploaded to Firebase Storage)
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
// filename is now the full Firebase Storage URL — return it as-is
export const getImageUrl = (filename) => filename;

export default api;
