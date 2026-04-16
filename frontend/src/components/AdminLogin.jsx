import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const inputStyle = {
  width: '100%',
  padding: '12px 14px 12px 42px',
  borderRadius: '12px',
  border: '1px solid rgba(108, 92, 231, 0.2)',
  background: '#0f1630',
  color: '#f0f0f8',
  fontSize: '0.95rem',
};

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    if (username === 'Devan' && password === 'Devan') {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/admin');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#060a14',
      fontFamily: "'Inter', sans-serif",
      padding: '20px',
    }}>
      <form onSubmit={handleLogin} style={{
        background: '#0d1329',
        padding: '48px 40px',
        borderRadius: '20px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
        width: '100%',
        maxWidth: '420px',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '56px', height: '56px',
            background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
            boxShadow: '0 6px 24px rgba(108, 92, 231, 0.4)',
          }}>
            <span style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.3rem', fontWeight: 800,
              color: '#ffffff', letterSpacing: '-0.04em',
            }}>SD</span>
          </div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.75rem', color: '#f0f0f8', marginBottom: '4px', letterSpacing: '-0.02em' }}>
            Stage Decor
          </h1>
          <p style={{ color: '#8892b0', fontSize: '0.88rem', letterSpacing: '0.04em' }}>Admin Panel</p>
        </div>

        {/* Username */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', color: '#8892b0', fontSize: '0.84rem', fontWeight: 600, marginBottom: '8px' }}>
            Username
          </label>
          <div style={{ position: 'relative' }}>
            <HiOutlineUser style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#5a6380', fontSize: '1.1rem' }} />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Password */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', color: '#8892b0', fontSize: '0.84rem', fontWeight: 600, marginBottom: '8px' }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <HiOutlineLockClosed style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#5a6380', fontSize: '1.1rem' }} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <p style={{ color: '#ff6b6b', fontSize: '0.85rem', textAlign: 'center', marginBottom: '16px' }}>{error}</p>
        )}

        {/* Submit */}
        <button type="submit" style={{
          width: '100%',
          padding: '14px',
          background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          fontWeight: 700,
          fontSize: '1rem',
          cursor: 'pointer',
          fontFamily: "'Inter', sans-serif",
          boxShadow: '0 0 30px rgba(108, 92, 231, 0.2)',
        }}>
          Login to Dashboard
        </button>

        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.8rem', color: '#5a6380' }}>
          Use your credentials to access the panel
        </p>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/" style={{ color: '#a29bfe', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 500 }}>
            ← Back to Gallery
          </Link>
        </div>

        {/* Creator credit */}
        <p style={{
          textAlign: 'center', marginTop: '28px',
          fontSize: '0.72rem', color: '#5a6380',
          borderTop: '1px solid rgba(108, 92, 231, 0.12)',
          paddingTop: '16px',
        }}>
          Crafted by{' '}
          <span style={{
            background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 600,
          }}>Devadeth</span>
        </p>
      </form>
    </div>
  );
}
