import React, { useState } from "react";
import "../styles/CarCard.css";
import WhatsAppButton from "./WhatsAppButton";
import DEFAULT_CAR_IMAGE_PATH from '../images/cars-big/default-car.png';
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
  isFavorite = false,
  onToggleFavorite,
}) {
  const [isBookingFocused, setIsBookingFocused] = useState(false);
  const [isWhatsAppFocused, setIsWhatsAppFocused] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState(""); 

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
    setAvailabilityMessage(""); 
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite();
    }
  };

  const handleConfirmBooking = ({ startDate, endDate, available, bookedRange }) => {
    if (!available) {
      const message = `❌ This car  is not available right now.`;
      setAvailabilityMessage(message);
    } else {
      setAvailabilityMessage("");
    }
    setShowBookingModal(false);
  };

  const handleCloseBookingModal = () => {
    setShowBookingModal(false);
    setAvailabilityMessage("");
  };
const API_BASE_URL = "http://localhost:5050"; 

const carImageUrl = car.photo && car.photo.trim() !== ""
  ? car.photo.startsWith("http") 
    ? car.photo
    : `${API_BASE_URL}${car.photo}`
  : DEFAULT_CAR_IMAGE_PATH; 

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
  src={carImageUrl}
  alt={car.name || `${car.brand} ${car.model}` || "Default Car Image"}
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
          className={`favorite-icon ${isFavorite ? "favorited" : ""}`}
          onClick={handleFavoriteClick}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleFavoriteClick(e);
            }
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={isFavorite ? "currentColor" : "none"}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
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

        {availabilityMessage && (
          <div className="availability-message">{availabilityMessage}</div>
        )}
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