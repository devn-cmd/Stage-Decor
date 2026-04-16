import { useState, useEffect } from 'react';
import {
  HiOutlinePhotograph,
  HiOutlineHeart,
  HiOutlineSparkles,
  HiOutlineCake,
  HiOutlineDotsCircleHorizontal,
} from 'react-icons/hi';
import Header from './Header';
import { getStats } from '../api';
import './Dashboard.css';

const statCards = [
  { key: 'total', label: 'Total Images', icon: HiOutlinePhotograph, color: '#6c5ce7' },
  { key: 'wedding', label: 'Wedding', icon: HiOutlineHeart, color: '#fd79a8' },
  { key: 'reception', label: 'Reception', icon: HiOutlineSparkles, color: '#00cec9' },
  { key: 'birthday', label: 'Birthday', icon: HiOutlineCake, color: '#fdcb6e' },
  { key: 'others', label: 'Others', icon: HiOutlineDotsCircleHorizontal, color: '#a29bfe' },
];

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0, wedding: 0, reception: 0, birthday: 0, others: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard">
      <Header
        title="Dashboard"
        subtitle="Overview of your stage decoration gallery"
      />

      <div className="dashboard__grid">
        {statCards.map(({ key, label, icon: Icon, color }, i) => (
          <div
            key={key}
            className={`stat-card ${loading ? 'stat-card--loading' : ''}`}
            style={{
              '--card-color': color,
              animationDelay: `${i * 0.08}s`,
            }}
          >
            <div className="stat-card__icon" style={{ background: `${color}18` }}>
              <Icon style={{ color }} />
            </div>
            <div className="stat-card__info">
              <span className="stat-card__value">
                {loading ? '—' : stats[key]}
              </span>
              <span className="stat-card__label">{label}</span>
            </div>
            <div
              className="stat-card__accent"
              style={{ background: `linear-gradient(135deg, ${color}20, transparent)` }}
            />
          </div>
        ))}
      </div>

      {/* Quick tips */}
      <div className="dashboard__tips animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <h3 className="dashboard__tips-title">Quick Start Guide</h3>
        <div className="dashboard__tips-grid">
          <div className="tip-card">
            <div className="tip-card__number">1</div>
            <div className="tip-card__text">
              <strong>Upload Images</strong>
              <p>Go to Upload Image to add new stage decoration photos with names and categories.</p>
            </div>
          </div>
          <div className="tip-card">
            <div className="tip-card__number">2</div>
            <div className="tip-card__text">
              <strong>Manage Gallery</strong>
              <p>Edit names, change categories, or remove images from the Manage Gallery page.</p>
            </div>
          </div>
          <div className="tip-card">
            <div className="tip-card__number">3</div>
            <div className="tip-card__text">
              <strong>Update Contact</strong>
              <p>Set your phone, email, and social links in Contact Settings for users to reach you.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
