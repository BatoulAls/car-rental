import React, { useState } from 'react'; 
import BookingModal from './BookingModal'; 

const CarActionButtons = ({ carData, handleWhatsApp }) => {
  const [showBookingModal, setShowBookingModal] = useState(false); 

  
  const handleBookNowClick = (e) => {
    e.stopPropagation(); 
    setShowBookingModal(true);
  };

  
  const handleCloseBookingModal = () => {
    setShowBookingModal(false);
  };

 
  const handleConfirmBooking = ({ startDate, endDate, available, bookedRange }) => {
    
    if (!available) {
      console.log(`Car ${carData.id} not available. Booked periods: ${bookedRange}`);
      alert(`❌ ${carData.name} is not available. Booked during: ${bookedRange}`);
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