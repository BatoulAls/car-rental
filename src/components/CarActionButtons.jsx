
import React from 'react';

const CarActionButtons = ({ carData, handleWhatsApp }) => {
  return (
    <div className="contact-options1">
      <button
        onClick={handleWhatsApp}
        className="contact-btn1 whatsapp-btn1"
        disabled={!carData.vendor?.phone}
      >
        <span>Contact via WhatsApp</span>
      </button>

      <button
        className={`contact-btn1 book-btn1 ${!(carData.available ?? false) ? 'disabled' : ''}`}
        disabled={!(carData.available ?? false)}
      >
        <span>{(carData.available ?? false) ? 'Book Now' : 'Not Available'}</span>
      </button>
    </div>
  );
};

export default CarActionButtons;