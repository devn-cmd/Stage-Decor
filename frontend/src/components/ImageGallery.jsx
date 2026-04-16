import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSearch,
  HiOutlineFilter,
} from 'react-icons/hi';
import Header from './Header';
import ImageEditModal from './ImageEditModal';
import { getImages, deleteImage, getImageUrl } from '../api';
import './ImageGallery.css';

const FILTER_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'reception', label: 'Reception' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'others', label: 'Others' },
];

export default function ImageGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [editImage, setEditImage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchImages = () => {
    setLoading(true);
    getImages(filter || undefined)
      .then((res) => setImages(res.data))
      .catch(() => toast.error('Failed to load images'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchImages();
  }, [filter]);

  const handleDelete = async (id) => {
    try {
      await deleteImage(id);
      toast.success('Image deleted');
      setDeleteConfirm(null);
      fetchImages();
    } catch {
      toast.error('Failed to delete image');
    }
  };

  const filtered = images.filter((img) =>
    img.name.toLowerCase().includes(search.toLowerCase())
  );

  const categoryColor = {
    wedding: '#fd79a8',
    reception: '#00cec9',
    birthday: '#fdcb6e',
    others: '#a29bfe',
  };

  return (
    <div className="gallery-page">
      <Header
        title="Manage Gallery"
        subtitle={`${images.length} images in your collection`}
      />

      {/* Toolbar */}
      <div className="gallery-toolbar animate-fade-in">
        <div className="gallery-search">
          <HiOutlineSearch className="gallery-search__icon" />
          <input
            type="text"
            className="gallery-search__input"
            placeholder="Search images..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="gallery-filters">
          <HiOutlineFilter className="gallery-filters__icon" />
          {FILTER_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              className={`filter-chip ${filter === value ? 'filter-chip--active' : ''}`}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="gallery-loading">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="gallery-empty animate-fade-in">
          <p className="gallery-empty__text">No images found</p>
          <span className="gallery-empty__hint">
            {search ? 'Try a different search term' : 'Upload some images to get started'}
          </span>
        </div>
      ) : (
        <div className="gallery-grid">
          {filtered.map((img, i) => (
            <div
              key={img.id}
              className="gallery-card animate-fade-in"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="gallery-card__image-wrap">
                <img
                  src={getImageUrl(img.filename)}
                  alt={img.name}
                  className="gallery-card__image"
                  loading="lazy"
                />
                <div className="gallery-card__overlay">
                  <button
                    className="gallery-card__action gallery-card__action--edit"
                    onClick={() => setEditImage(img)}
                    title="Edit"
                  >
                    <HiOutlinePencil />
                  </button>
                  <button
                    className="gallery-card__action gallery-card__action--delete"
                    onClick={() => setDeleteConfirm(img)}
                    title="Delete"
                  >
                    <HiOutlineTrash />
                  </button>
                </div>
              </div>
              <div className="gallery-card__info">
                <span className="gallery-card__name">{img.name}</span>
                <span
                  className="gallery-card__category"
                  style={{
                    color: categoryColor[img.category],
                    background: `${categoryColor[img.category]}14`,
                    borderColor: `${categoryColor[img.category]}30`,
                  }}
                >
                  {img.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editImage && (
        <ImageEditModal
          image={editImage}
          onClose={() => setEditImage(null)}
          onSave={() => {
            setEditImage(null);
            fetchImages();
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="modal-backdrop" onClick={() => setDeleteConfirm(null)}>
          <div className="delete-modal animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="delete-modal__title">Delete Image?</h3>
            <p className="delete-modal__text">
              Are you sure you want to delete "<strong>{deleteConfirm.name}</strong>"?
              This action cannot be undone.
            </p>
            <div className="delete-modal__actions">
              <button
                className="btn btn--ghost"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn--danger"
                onClick={() => handleDelete(deleteConfirm.id)}
              >
                <HiOutlineTrash /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
