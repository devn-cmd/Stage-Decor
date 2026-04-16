import React from 'react';
import { MessageSquare, Camera, Phone, ArrowLeft } from 'lucide-react';
import { CONFIG } from '../config';

const BookingPanel = ({ decoration, onBack }) => {
  return (
    <div className="booking-section">
      <h2>Book {decoration.name}</h2>
      <p style={{ color: 'var(--text-light)', marginTop: '10px' }}>
        Contact us to reserve this beautiful stage decor for your special event.
      </p>
      
      <div className="contact-options">
        <a 
          href={`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=Hi! I am interested in booking the "${decoration.name}" design.`} 
          target="_blank" 
          rel="noreferrer"
          className="contact-btn whatsapp"
        >
          <MessageSquare size={20} />
          WhatsApp
        </a>
        <a 
          href={`https://instagram.com/${CONFIG.INSTAGRAM_HANDLE}`} 
          target="_blank" 
          rel="noreferrer"
          className="contact-btn instagram"
        >
          <Camera size={20} />
          Instagram
        </a>
        <a 
          href={`tel:${CONFIG.PHONE_NUMBER}`} 
          className="contact-btn phone"
        >
          <Phone size={20} />
          Call Us
        </a>
      </div>
      
      <button className="back-btn" onClick={onBack}>
        <ArrowLeft size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
        Back to Photo
      </button>
    </div>
  );
};

export default BookingPanel;
