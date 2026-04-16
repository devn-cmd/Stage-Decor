import axios from 'axios';

const API_BASE = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
});

// ── Images ────────────────────────────────────────────────────
export const uploadImage = (formData) =>
  api.post('/api/images/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getImages = (category) => {
  const params = category ? { category } : {};
  return api.get('/api/images/', { params });
};

export const getImage = (id) =>
  api.get(`/api/images/${id}`);

export const updateImage = (id, data) =>
  api.put(`/api/images/${id}`, data);

export const deleteImage = (id) =>
  api.delete(`/api/images/${id}`);

// ── Stats ─────────────────────────────────────────────────────
export const getStats = () =>
  api.get('/api/stats/');

// ── Contact ───────────────────────────────────────────────────
export const getContact = () =>
  api.get('/api/contact/');

export const updateContact = (data) =>
  api.put('/api/contact/', data);

// ── Image URL helper ──────────────────────────────────────────
export const getImageUrl = (filename) =>
  `${API_BASE}/uploads/${filename}`;

export default api;
