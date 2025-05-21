import React, { useState } from "react";
import "../styles/CarCard.css";

function CarCard({
  car,
  carId,
  isHovered,
  isLoading,
  onHoverEnter,
  onHoverLeave,
  onClick,
  onImageLoad,
  rating = 0,
}) {
  const [isBookingFocused, setIsBookingFocused] = useState(false);
  const [isWhatsAppFocused, setIsWhatsAppFocused] = useState(false);


  const numRating = Number(rating);
  console.log(`CarCard ${carId} received rating: ${rating}, converted to numRating: ${numRating}`);

  return (
    <div
      className={`car-card ${isHovered ? "hovered" : ""}`}
      style={{ animationDelay: `${parseInt(carId.split("-")[1]) * 100}ms` }}
      onClick={onClick}
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
          src={car.img || car.photo}
          alt={car.name || `${car.company} ${car.model}`}
          className={`car-image ${isHovered ? "zoomed" : ""} ${isLoading ? "hidden" : "visible"}`}
          onLoad={onImageLoad}
        />

        <div className={`car-overlay ${isHovered ? "show" : ""}`}>
          <div className="car-overlay-content">
            <div><span>{car.year}</span></div>
            <div><span>{car.fuel || "Premium Fuel"}</span></div>
          </div>
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
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= numRating ? "filled-star" : "empty-star"}
              >
                {console.log(`Star ${star}, numRating ${numRating}, filled: ${star <= numRating}`)}
                ★
              </span>
            ))}
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

        <div className="contact-options">
          <a
            href={`https://wa.me/${car.whatsapp || "+1234567890"}`}
            className={`contact-btn whatsapp-btn ${isWhatsAppFocused ? "focused" : ""}`}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setIsWhatsAppFocused(true)}
            onMouseLeave={() => setIsWhatsAppFocused(false)}
            onFocus={() => setIsWhatsAppFocused(true)}
            onBlur={() => setIsWhatsAppFocused(false)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Contact via WhatsApp</span>
          </a>
        </div>

        <div className="card-footer">
          <div className="availability">
            <div className={`status-dot ${car.availability_status?.toLowerCase() === "available" ? "available" : "pending"}`}></div>
            <span>{car.availability_status || "Available Now"}</span>
          </div>
          <a
            href="#booking-section"
            className={`book-btn ${isBookingFocused ? "focused" : ""}`}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setIsBookingFocused(true)}
            onMouseLeave={() => setIsBookingFocused(false)}
            onFocus={() => setIsBookingFocused(true)}
            onBlur={() => setIsBookingFocused(false)}
          >
            Book Now
          </a>
        </div>
      </div>
    </div>
  );
}

export default CarCard;