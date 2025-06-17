
import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import WhatsAppButton from './WhatsAppButton';

const ContactSidebar = ({ phone, email, region, shop_open_time, shop_close_time }) => {
  return (
    <div className="contact-sidebar">
      <div className="contact-card">
        <h3>Contact Information</h3>
        <div className="contact-details">
          <div className="contact-row"><Phone size={18} /><span>{phone || 'N/A'}</span></div>
          <div className="contact-row"><Mail size={18} /><span>{email || 'N/A'}</span></div>
          <div className="contact-row"><MapPin size={18} /><span>{region?.name_en} / {region?.name_ar || 'N/A'}</span></div>
          <div className="contact-row"><Clock size={18} /><span>🕒 {shop_open_time || 'N/A'} - {shop_close_time || 'N/A'}</span></div>
        </div>
        <div className="contact-actions">
          <WhatsAppButton />
        </div>
      </div>
    </div>
  );
};

export default ContactSidebar;
