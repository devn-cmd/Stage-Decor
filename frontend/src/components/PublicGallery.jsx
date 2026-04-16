import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { getImages, getImageUrl, getContact } from '../api';
import './PublicGallery.css';

const FILTER_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'wedding',   label: 'Wedding' },
  { value: 'reception', label: 'Reception' },
  { value: 'birthday',  label: 'Birthday' },
  { value: 'others',    label: 'Others' },
];

export default function PublicGallery() {
  const [images,   setImages]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('');
  const [selected, setSelected] = useState(null);   // lightbox image
  const [booking,  setBooking]  = useState(false);  // show booking panel
  const [contact,  setContact]  = useState(null);

  // fetch gallery
  useEffect(() => {
    setLoading(true);
    getImages(filter || undefined)
      .then((res) => setImages(res.data))
      .catch(() => toast.error('Failed to load gallery'))
      .finally(() => setLoading(false));
  }, [filter]);

  // fetch contact info
  useEffect(() => {
    getContact()
      .then((res) => setContact(res.data))
      .catch(() => {});
  }, []);

  const openModal  = (img)  => { setSelected(img); setBooking(false); };
  const closeModal = ()     => { setSelected(null); setBooking(false); };

  return (
    <div className="public-page">

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="pub-header">
        <h1>Stage Decor</h1>
        <p className="tagline">Elegant Decorations · Timeless Memories</p>
        <Link to="/login" className="pub-header__admin-link">Admin Login</Link>
      </header>

      <div className="pub-container">

        {/* ── Category Filters ───────────────────────────────────── */}
        <div className="pub-filters">
          {FILTER_OPTIONS.map(({ value, label }) => (
            <button
              key={label}
              className={`pub-filter-btn ${filter === value ? 'active' : ''}`}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Grid ──────────────────────────────────────────────── */}
        {loading ? (
          <div className="pub-grid">
            {[...Array(6)].map((_, i) => <div key={i} className="pub-skeleton" />)}
          </div>
        ) : images.length === 0 ? (
          <div className="pub-empty">No designs found in this category.</div>
        ) : (
          <div className="pub-grid">
            {images.map((img, i) => (
              <div
                key={img.id}
                className="pub-card"
                style={{ animationDelay: `${i * 0.06}s` }}
                onClick={() => openModal(img)}
              >
                <div className="pub-card__image-wrap">
                  <img
                    src={getImageUrl(img.filename)}
                    alt={img.name}
                    className="pub-card__image"
                    loading="lazy"
                  />
                </div>
                <div className="pub-card__info">
                  <h3 className="pub-card__name">{img.name}</h3>
                  <span className="pub-card__badge">{img.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modal ─────────────────────────────────────────────── */}
      {selected && (
        <div className="pub-modal-overlay" onClick={closeModal}>
          <div className="pub-modal" onClick={(e) => e.stopPropagation()}>
            <button className="pub-modal__close" onClick={closeModal}>✕</button>

            {!booking ? (
              /* ── Detail view ─────────────────────────────── */
              <>
                <div className="pub-modal__image-wrap">
                  <img src={getImageUrl(selected.filename)} alt={selected.name} />
                </div>
                <div className="pub-modal__details">
                  <h2>{selected.name}</h2>
                  <p className="pub-modal__subtitle">
                    <span className="pub-card__badge">{selected.category}</span>
                  </p>
                  <button className="pub-book-btn" onClick={() => setBooking(true)}>
                    ✦ Book This Design
                  </button>
                </div>
              </>
            ) : (
              /* ── Booking panel ───────────────────────────── */
              <div className="pub-booking">
                <h2>Book "{selected.name}"</h2>
                <p className="pub-booking__subtitle">
                  Contact us below to reserve this design for your special event.
                </p>

                <div className="pub-contact-options">
                  {contact?.whatsapp && (
                    <a
                      href={`https://wa.me/${contact.whatsapp.replace(/\D/g,'')}?text=Hi! I'm interested in booking "${selected.name}".`}
                      target="_blank" rel="noreferrer"
                      className="pub-contact-btn pub-contact-btn--whatsapp"
                    >
                      💬 WhatsApp
                    </a>
                  )}
                  {contact?.instagram && (
                    <a
                      href={`https://instagram.com/${contact.instagram.replace('@','')}`}
                      target="_blank" rel="noreferrer"
                      className="pub-contact-btn pub-contact-btn--instagram"
                    >
                      📷 Instagram
                    </a>
                  )}
                  {contact?.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      className="pub-contact-btn pub-contact-btn--phone"
                    >
                      📞 Call Us
                    </a>
                  )}
                </div>

                <button className="pub-back-btn" onClick={() => setBooking(false)}>
                  ← Back to Photo
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="pub-footer">
        <p className="pub-footer__copy">
          &copy; {new Date().getFullYear()} Stage Decor. All rights reserved.
        </p>
        <p className="pub-footer__creator">
          Crafted with ✦ by <span>Devadeth</span>
        </p>
      </footer>

    </div>
  );
}
