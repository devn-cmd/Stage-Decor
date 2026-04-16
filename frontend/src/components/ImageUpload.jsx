import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { HiOutlineCloudUpload, HiOutlineX, HiOutlineCheck } from 'react-icons/hi';
import Header from './Header';
import { uploadImage } from '../api';
import './ImageUpload.css';

const CATEGORIES = [
  { value: 'wedding',   label: 'Wedding',   emoji: '💒' },
  { value: 'reception', label: 'Reception', emoji: '✨' },
  { value: 'birthday',  label: 'Birthday',  emoji: '🎂' },
  { value: 'others',    label: 'Others',    emoji: '🎭' },
];

export default function ImageUpload() {
  const [file,      setFile]      = useState(null);
  const [preview,   setPreview]   = useState(null);
  const [name,      setName]      = useState('');
  const [category,  setCategory]  = useState('');
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) {
      const f = accepted[0];
      setFile(f);
      setPreview(URL.createObjectURL(f));
      if (!name) setName(f.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
    }
  }, [name]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] },
    maxFiles: 1,
    multiple: false,
  });

  const clearFile = () => { setFile(null); setPreview(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file)          return toast.error('Please select an image');
    if (!name.trim())   return toast.error('Please enter a name');
    if (!category)      return toast.error('Please select a category');

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', name.trim());
      formData.append('category', category);

      await uploadImage(formData);
      toast.success('Image uploaded successfully! 🎉');

      // Reset form
      setFile(null); setPreview(null); setName(''); setCategory('');
    } catch (err) {
      toast.error(err.response?.data?.detail || err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-page">
      <Header
        title="Upload Image"
        subtitle="Add new stage decoration photos to your gallery"
      />

      <form className="upload-form animate-fade-in" onSubmit={handleSubmit}>
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'dropzone--active' : ''} ${preview ? 'dropzone--has-preview' : ''}`}
        >
          <input {...getInputProps()} />

          {preview ? (
            <div className="dropzone__preview">
              <img src={preview} alt="Preview" className="dropzone__image" />
              <button
                type="button"
                className="dropzone__clear"
                onClick={(e) => { e.stopPropagation(); clearFile(); }}
              >
                <HiOutlineX />
              </button>
            </div>
          ) : (
            <div className="dropzone__placeholder">
              <div className="dropzone__icon"><HiOutlineCloudUpload /></div>
              <p className="dropzone__text">
                {isDragActive ? 'Drop your image here...' : 'Drag & drop an image here, or click to browse'}
              </p>
              <span className="dropzone__hint">Supports JPG, PNG, WebP, GIF</span>
            </div>
          )}
        </div>

        {/* Name input */}
        <div className="form-group">
          <label className="form-label" htmlFor="image-name">Image Name</label>
          <input
            id="image-name"
            type="text"
            className="form-input"
            placeholder="e.g. Royal Gold Wedding Stage"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Category selector */}
        <div className="form-group">
          <label className="form-label">Category</label>
          <div className="category-selector">
            {CATEGORIES.map(({ value, label, emoji }) => (
              <button
                key={value}
                type="button"
                className={`category-btn ${category === value ? 'category-btn--active' : ''}`}
                onClick={() => setCategory(value)}
              >
                <span className="category-btn__emoji">{emoji}</span>
                <span className="category-btn__label">{label}</span>
                {category === value && <HiOutlineCheck className="category-btn__check" />}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button type="submit" className={`submit-btn ${uploading ? 'submit-btn--loading' : ''}`} disabled={uploading}>
          {uploading ? (
            <><span className="submit-btn__spinner" />Uploading…</>
          ) : (
            <><HiOutlineCloudUpload />Upload Image</>
          )}
        </button>
      </form>
    </div>
  );
}
