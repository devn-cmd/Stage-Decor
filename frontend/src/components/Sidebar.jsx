import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  HiOutlineViewGrid,
  HiOutlineCloudUpload,
  HiOutlinePhotograph,
  HiOutlinePhone,
  HiOutlineLogout,
  HiMenu,
  HiX,
} from 'react-icons/hi';
import { RiSparklingLine } from 'react-icons/ri';
import './Sidebar.css';

const navItems = [
  { path: '/admin',         icon: HiOutlineViewGrid,     label: 'Dashboard' },
  { path: '/admin/upload',  icon: HiOutlineCloudUpload,  label: 'Upload Image' },
  { path: '/admin/gallery', icon: HiOutlinePhotograph,   label: 'Manage Gallery' },
  { path: '/admin/contact', icon: HiOutlinePhone,        label: 'Contact Settings' },
];

export default function Sidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [open, setOpen] = useState(false);

  // Close sidebar whenever route changes (mobile)
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Lock body scroll when sidebar open on mobile
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  return (
    <>
      {/* ── Hamburger button (mobile only) ───────────────────── */}
      <button
        className={`sidebar__hamburger ${open ? 'sidebar__hamburger--open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle menu"
      >
        {open ? <HiX /> : <HiMenu />}
      </button>

      {/* ── Overlay backdrop ─────────────────────────────────── */}
      {open && (
        <div className="sidebar__backdrop" onClick={() => setOpen(false)} />
      )}

      {/* ── Sidebar panel ────────────────────────────────────── */}
      <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>

        {/* Brand */}
        <div className="sidebar__brand">
          <div className="sidebar__logo"><RiSparklingLine /></div>
          <div className="sidebar__brand-text">
            <span className="sidebar__title">SilkStage</span>
            <span className="sidebar__subtitle">Admin Panel</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar__nav">
          <span className="sidebar__section-label">Main Menu</span>
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/admin'}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
              }
            >
              <Icon className="sidebar__link-icon" />
              <span className="sidebar__link-label">{label}</span>
              <div className="sidebar__link-indicator" />
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar__footer">
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'transparent', border: 'none',
              color: 'var(--text-secondary)', cursor: 'pointer',
              fontSize: '0.9rem', padding: '8px 12px',
              borderRadius: 'var(--radius-md)', width: '100%',
            }}
          >
            <HiOutlineLogout style={{ fontSize: '1.2rem' }} />
            Logout
          </button>
          <div className="sidebar__version">v1.0.0</div>
        </div>
      </aside>
    </>
  );
}
