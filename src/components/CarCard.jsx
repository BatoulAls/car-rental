import React from "react"; 
import "../styles/CarCard.css";  

function CarCard({
  car,
  carId,
  isHovered,
  isLoading,
  onHoverEnter,
  onHoverLeave,
  onClick,
  onImageLoad 
}) {
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
          src={car.img}
          alt={car.name || `${car.company} ${car.model}`}
          className={`car-image ${isHovered ? "zoomed" : ""} ${isLoading ? "hidden" : "visible"}`}
          onLoad={onImageLoad}
        />
         
        {/* Price tag moved from the image container to be larger and more visible */}
        <div className={`car-overlay ${isHovered ? "show" : ""}`}>
          <div className="car-overlay-content">
            <div><span>{car.year}</span></div>
            <div><span>{car.fuel || "Premium Fuel"}</span></div>
          </div>
        </div>
      </div>
       
      {/* New prominent price banner */}
      <div className="price-banner">
        <span className="price-amount">${car.price}</span>
        <span className="price-period">/day</span>
      </div>
       
      <div className="car-details">
        <div className="car-name-rating">
          <h3>{car.name || `${car.company} ${car.model}`}</h3>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map(star => (
              <span key={star}>★</span>
            ))}
          </div>
        </div>
         
        <div className="specs-grid">
          <div className="spec">
            <span className="spec-icon">🚗</span>
            <span className="label">Model</span>
            <span>{car.model}</span>
          </div>
          <div className="spec">
            <span className="spec-icon">🏢</span>
            <span className="label">Company</span>
            <span>{car.company}</span>
          </div>
          <div className="spec">
            <span className="spec-icon">⚙️</span>
            <span className="label">Transmission</span>
            <span>{car.transmission}</span>
          </div>
          <div className="spec">
            <span className="spec-icon">👥</span>
            <span className="label">Capacity</span>
            <span>{car.capacity || "5 People"}</span>
          </div>
        </div>
         
        {/* WhatsApp button now takes full width with updated color */}
        <div className="contact-options single-contact">
          <a 
            href={`https://wa.me/${car.whatsapp || "+1234567890"}`}
            className="contact-btn whatsapp-btn"
            onClick={(e) => e.stopPropagation()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="whatsapp-icon">📱</i>
            <span>Contact via WhatsApp</span>
          </a>
        </div>
         
        <div className="card-footer">
          <div className="availability">
            <div className={`status-dot ${car.availability === "Available" ? "available" : "pending"}`}></div>
            <span>{car.availability || "Available Now"}</span>
          </div>
          <a
            href="#booking-section"
            className="book-btn"
            onClick={(e) => e.stopPropagation()}
          >
            Book Now
          </a>
        </div>
      </div>
    </div>
  );
}

export default CarCard;