import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ImageUpload from './components/ImageUpload';
import ImageGallery from './components/ImageGallery';
import ContactSettings from './components/ContactSettings';
import PublicGallery from './components/PublicGallery';
import AdminLogin from './components/AdminLogin';
import AdminLayout from './components/AdminLayout';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicGallery />} />
      <Route path="/login" element={<AdminLogin />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="upload" element={<ImageUpload />} />
        <Route path="gallery" element={<ImageGallery />} />
        <Route path="contact" element={<ContactSettings />} />
      </Route>
    </Routes>
  );
}
