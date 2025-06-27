import React from 'react';
import { Phone, Mail, MapPin, Clock,Car } from 'lucide-react';
// Corrected import path for WhatsAppButton.
// This path assumes WhatsAppButton.jsx is directly in the same directory as ContactSidebar.jsx.
import WhatsAppButton from './WhatsAppButton';
import { useNavigate } from 'react-router-dom';

const ContactSidebar = ({ phone, email, region, shop_open_time, shop_close_time, vendorId, VendorName }) => { // Correctly receiving VendorName
  const navigate = useNavigate();

  const handleSeeAllCarsClick = () => {
    if (vendorId) {
      navigate(`/cars/vendors/${vendorId}`, { state: { vendorName: VendorName } });
    } else {
      console.warn("Cannot navigate to vendor's cars: Vendor ID is missing.");
    }
  };

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
        <button

          className="see-all-cars-btn"
          onClick={handleSeeAllCarsClick}
        >
          <Car size={18} /> 
          See All Cars
        </button>
      </div>
    </div>
  );
};

export default ContactSidebar;