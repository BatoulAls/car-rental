import React, { useState } from 'react'; 
import BookingModal from './BookingModal'; 

const CarActionButtons = ({ carData, handleWhatsApp }) => {
  const [showBookingModal, setShowBookingModal] = useState(false); 
  const [availabilityMessage, setAvailabilityMessage] = useState(''); 

  const handleBookNowClick = (e) => {
    e.stopPropagation(); 
    setShowBookingModal(true); 
  };

  const handleCloseBookingModal = () => {
    setShowBookingModal(false);
    setAvailabilityMessage(''); 
  };

  const handleConfirmBooking = ({ startDate, endDate, available }) => {
    if (!available) {
      const message = `❌ this car is not available right now.}`;
      setAvailabilityMessage(message);
    } else {
      setAvailabilityMessage('');
    }
    setShowBookingModal(false);
  };

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
        onClick={handleBookNowClick} 
      >
        <span>{(carData.available ?? false) ? 'Book Now' : 'Not Available'}</span>
      </button>

      {availabilityMessage && (
  <div className="availability-message">
    <p>{availabilityMessage}</p>
  </div>
)}

      <BookingModal
        isVisible={showBookingModal}
        onClose={handleCloseBookingModal}
        onConfirmBooking={handleConfirmBooking}
        carId={carData.id}
        carName={carData.name} 
      />
    </div>
  );
};

export default CarActionButtons;
