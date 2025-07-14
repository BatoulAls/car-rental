import React, { useState } from "react";
import "../styles/CarCard.css";
import WhatsAppButton from "./WhatsAppButton";
import DEFAULT_CAR_IMAGE_PATH from '../images/cars-big/default-car.png'
import BookingModal from "./BookingModal";

function CarCard({
  car,
  carId,
  cardIndex,
  isHovered,
  isLoading,
  onHoverEnter,
  onHoverLeave,
  onClick,
  onImageLoad,
  onNavigateToDetails,
  average_rating = 0,
}) {
  const [isBookingFocused, setIsBookingFocused] = useState(false);
  const [isWhatsAppFocused, setIsWhatsAppFocused] = useState(false);
 
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleCardClick = () => {
    if (onNavigateToDetails && car?.id) {
      onNavigateToDetails(car.id);
    }
  };

  const handleNavigateClick = (e) => {
    e.stopPropagation();
    if (onNavigateToDetails && car?.id) {
      onNavigateToDetails(car.id);
    }
  };

 
  const handleBookNowClick = (e) => {
    e.stopPropagation(); 
    setShowBookingModal(true);
  };

  
  const handleConfirmBooking = ({ startDate, endDate, available, bookedRange }) => {
   if (!available) {
      alert(`❌ The car is not available. Booked during the following periods: ${bookedRange}`);
    }
    setShowBookingModal(false);
  };

 
  const handleCloseBookingModal = () => {
    setShowBookingModal(false);
  };

  return (
    <div
      className={`car-card ${isHovered ? "hovered" : ""}`}
      style={{ animationDelay: `${cardIndex * 100}ms` }}
      onClick={handleCardClick}
      onMouseEnter={onHoverEnter}
      onMouseLeave={onHoverLeave}
    >
      <div className="car-image-container">
        {isLoading && (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        )}
        <img
          src={car.img || car.photo || DEFAULT_CAR_IMAGE_PATH}
          alt={car.name || `${car.company} ${car.model}` || "Default Car Image"}
          className={`car-image ${isHovered ? "zoomed" : ""} ${isLoading ? "hidden" : "visible"}`}
          onLoad={onImageLoad}
          onError={onImageLoad}
        />

        <div className={`car-overlay ${isHovered ? "show" : ""}`}>
          <div className="car-overlay-content">
            <div><span>{car.year}</span></div>
            <div><span>{car.fuel || "Premium Fuel"}</span></div>
          </div>
        </div>

        <div
          className={`nav-arrow ${isHovered ? "show" : ""}`}
          onClick={handleNavigateClick}
          title="View Details"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleNavigateClick(e);
            }
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div className="price-banner">
        <span className="price-amount">${car.price_per_day}</span>
        <span className="price-period">/day</span>
      </div>

      <div className="car-details">

        <div className="car-name-rating">
          <h3>{car.name || `${car.company} ${car.model}`}</h3>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => {
              const fullStars = Math.floor(average_rating);
              const hasHalfStar = average_rating - fullStars >= 0.5;

              return (
                <span
                  key={star}
                  className={
                    star <= fullStars
                      ? "filled-star"
                      : star === fullStars + 1 && hasHalfStar
                        ? "half-filled-star"
                        : "empty-star"
                  }
                >
                  ★
                </span>
              );
            })}
          </div>
        </div>

        <div className="specs-grid">
          <div className="spec">
            <span className="label">Model</span>
            <span className="value">{car.model}</span>
          </div>
          <div className="spec">
            <span className="label">Company</span>
            <span className="value">{car.Vendor?.name || "Unknown Vendor"}</span>
          </div>
          <div className="spec">
            <span className="label">Transmission</span>
            <span className="value">{car.transmission}</span>
          </div>
          <div className="spec">
            <span className="label">Capacity</span>
            <span className="value">{car.seats || "5 People"}</span>
          </div>
        </div>

        <WhatsAppButton className={`contact-btn whatsapp-btn ${isWhatsAppFocused ? "focused" : ""}`} />

        <div className="card-footer">
          <div className="availability">
            <div className={`status-dot ${car.available ? "available" : "pending"}`}></div>
            <span>{car.available ? "Available Now" : "Unavailable"}</span>
          </div>
          <a
           
            className={`book-btn ${isBookingFocused ? "focused" : ""}`}
            onClick={handleBookNowClick} 
            onMouseEnter={() => setIsBookingFocused(true)}
            onMouseLeave={() => setIsBookingFocused(false)}
            onFocus={() => setIsBookingFocused(true)}
            onBlur={() => setIsBookingFocused(false)}
            aria-label="Book this car"
          >
            Book Now
          </a>
        </div>
      </div>
      <BookingModal
        isVisible={showBookingModal}
        onClose={handleCloseBookingModal}
        onConfirmBooking={handleConfirmBooking}
        carId={carId}
      />
    </div>
  );
}

export default CarCard;
