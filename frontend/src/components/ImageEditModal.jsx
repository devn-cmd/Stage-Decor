import { useState } from 'react';
import { toast } from 'react-toastify';
import { HiOutlineCheck, HiOutlineX } from 'react-icons/hi';
import { updateImage, getImageUrl } from '../api';
import './ImageEditModal.css';

const CATEGORIES = [
  { value: 'wedding', label: 'Wedding' },
  { value: 'reception', label: 'Reception' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'others', label: 'Others' },
];

export default function ImageEditModal({ image, onClose, onSave }) {
  const [name, setName] = useState(image.name);
  const [category, setCategory] = useState(image.category);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return toast.error('Name cannot be empty');

    setSaving(true);
    try {
      await updateImage(image.id, { name: name.trim(), category });
      toast.success('Image updated! ✨');
      onSave();
    } catch {
      toast.error('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="edit-modal animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="edit-modal__header">
          <h3 className="edit-modal__title">Edit Image</h3>
          <button className="edit-modal__close" onClick={onClose}>
            <HiOutlineX />
          </button>
        </div>

        <div className="edit-modal__preview">
          <img
            src={getImageUrl(image.filename)}
            alt={image.name}
            className="edit-modal__image"
          />
        </div>

        <div className="edit-modal__form">
          <div className="form-group">
            <label className="form-label" htmlFor="edit-name">Image Name</label>
            <input
              id="edit-name"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <div className="edit-modal__categories">
              {CATEGORIES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  className={`filter-chip ${category === value ? 'filter-chip--active' : ''}`}
                  onClick={() => setCategory(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="edit-modal__actions">
          <button className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn--primary"
            onClick={handleSave}
            disabled={saving}
          >
            <HiOutlineCheck />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
