import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineLocationMarker,
  HiOutlineCheck,
} from 'react-icons/hi';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import Header from './Header';
import { getContact, updateContact } from '../api';
import './ContactSettings.css';

export default function ContactSettings() {
  const [form, setForm] = useState({
    phone: '',
    email: '',
    address: '',
    whatsapp: '',
    instagram: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getContact()
      .then((res) => setForm(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateContact(form);
      toast.success('Contact details saved! 📞');
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { key: 'phone', label: 'Phone Number', icon: HiOutlinePhone, placeholder: '+91 98765 43210', type: 'tel' },
    { key: 'email', label: 'Email Address', icon: HiOutlineMail, placeholder: 'admin@silkstage.com', type: 'email' },
    { key: 'whatsapp', label: 'WhatsApp', icon: FaWhatsapp, placeholder: '+91 98765 43210', type: 'tel' },
    { key: 'instagram', label: 'Instagram', icon: FaInstagram, placeholder: '@silkstage_decor', type: 'text' },
  ];

  return (
    <div className="contact-page">
      <Header
        title="Contact Settings"
        subtitle="Manage your contact details visible to users"
      />

      <form className="contact-form animate-fade-in" onSubmit={handleSubmit}>
        <div className="contact-fields">
          {fields.map(({ key, label, icon: Icon, placeholder, type }) => (
            <div className="contact-field" key={key}>
              <label className="form-label" htmlFor={`contact-${key}`}>
                <Icon className="contact-field__label-icon" />
                {label}
              </label>
              <input
                id={`contact-${key}`}
                type={type}
                className="form-input"
                placeholder={placeholder}
                value={form[key]}
                onChange={handleChange(key)}
                disabled={loading}
              />
            </div>
          ))}
        </div>

        {/* Address (textarea) */}
        <div className="contact-field contact-field--full">
          <label className="form-label" htmlFor="contact-address">
            <HiOutlineLocationMarker className="contact-field__label-icon" />
            Business Address
          </label>
          <textarea
            id="contact-address"
            className="form-input form-textarea"
            placeholder="123 Decoration Street, Mumbai, India"
            value={form.address}
            onChange={handleChange('address')}
            rows={3}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={saving || loading}
        >
          {saving ? (
            <>
              <span className="submit-btn__spinner" />
              Saving...
            </>
          ) : (
            <>
              <HiOutlineCheck />
              Save Contact Details
            </>
          )}
        </button>
      </form>
    </div>
  );
}
