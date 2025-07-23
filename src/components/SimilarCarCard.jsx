import React, { useState } from "react";
import "../styles/CarCard.css";
import DEFAULT_CAR_IMAGE_PATH from '../images/cars-big/default-car.png';
import BookingModal from "./BookingModal";

function SimilarCarCard({
    car,
    cardIndex,
    isLoading,
    onImageLoad,
    onNavigateToDetails,
}) {
    const [isComponentHovered, setIsComponentHovered] = useState(false);
    const [isBookingFocused, setIsBookingFocused] = useState(false);
    const [isWhatsAppFocused, setIsWhatsAppFocused] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [availabilityMessage, setAvailabilityMessage] = useState('');

    const handleNavigateClick = (e) => {
        e.stopPropagation();
        if (onNavigateToDetails && car?.id) {
            onNavigateToDetails(car.id);
        }
    };

    const handleCardClick = () => {
        if (onNavigateToDetails && car?.id) {
            onNavigateToDetails(car.id);
        }
    };

    const handleBookingClick = (e) => {
        e.stopPropagation();
        setShowBookingModal(true); 
    };

    const carName = car?.name || `${car?.company || car?.brand || 'Unknown'} ${car?.model || 'Car'}`;
    const carImage = car?.img || car?.photo || DEFAULT_CAR_IMAGE_PATH;
    const pricePerDay = car?.price_per_day || car?.price || 0;
    const carBrand = car?.brand || car?.company;
    const carSeats = car?.seats || car?.capacity;
    const availabilityStatus = car?.availability_status || 'Available Now';
    const whatsappNumber = car?.whatsapp || '';

    const handleConfirmBooking = ({ startDate, endDate, available, bookedRange }) => {
        if (!available) {
            setAvailabilityMessage(`❌ ${carBrand || 'This car'} ${car?.model || ''} is not available at the moment.`);
            setTimeout(() => setAvailabilityMessage(''), 5000);
        } else {
            setAvailabilityMessage('');
        }
        setShowBookingModal(false);
    };

    const handleCloseBookingModal = () => {
        setShowBookingModal(false);
    };

    return (
        <div
            className={`car-card ${isComponentHovered ? "hovered" : ""}`}
            style={{ animationDelay: `${(cardIndex || 0) * 100}ms` }}
            onMouseEnter={() => setIsComponentHovered(true)}
            onMouseLeave={() => setIsComponentHovered(false)}
            onClick={handleCardClick}
        >
            <div className="car-image-container">
                {isLoading && (
                    <div className="spinner-container">
                        <div className="spinner"></div>
                    </div>
                )}

                <img
                    src={carImage}
                    alt={carName}
                    className={`car-image ${isComponentHovered ? "zoomed" : ""} ${isLoading ? "hidden" : "visible"}`}
                    onLoad={onImageLoad}
                    onError={onImageLoad}
                />

                <div className={`car-overlay ${isComponentHovered ? "show" : ""}`}>
                    <div className="car-overlay-content">
                        {car?.bags && (
                            <div className="overlay-item">
                                <span className="overlay-icon">🎒 Bags: </span>
                                <span className="overlay-text">{car.bags}</span>
                            </div>
                        )}
                        {car?.no_of_doors && (
                            <div className="overlay-item">
                                <span className="overlay-icon">🚪 Doors: </span> 
                                <span className="overlay-text">{car.no_of_doors}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div
                    className={`nav-arrow ${isComponentHovered ? "show" : ""}`}
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
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>

            <div className="price-banner">
                <span className="price-amount">${pricePerDay}</span>
                <span className="price-period">/day</span>
            </div>

            <div className="car-details">
                <div className="specs-grid">
                    {car?.model && (
                        <div className="spec">
                            <span className="label">Model</span>
                            <span className="value">{car.model}</span>
                        </div>
                    )}
                    {carBrand && (
                        <div className="spec">
                            <span className="label">Brand</span>
                            <span className="value">{carBrand}</span>
                        </div>
                    )}
                    {car?.category && (
                        <div className="spec">
                            <span className="label">Category</span>
                            <span className="value">{car.category}</span>
                        </div>
                    )}
                    {carSeats && (
                        <div className="spec">
                            <span className="label">Capacity</span>
                            <span className="value">{carSeats}</span>
                        </div>
                    )}
                </div>

               
                    <div className="contact-options">
                        <a
                            href={`https://wa.me/${whatsappNumber.replace(/[^\d+]/g, '')}`}
                            className={`contact-btn whatsapp-btn ${isWhatsAppFocused ? "focused" : ""}`}
                            onClick={(e) => e.stopPropagation()}
                            onMouseEnter={() => setIsWhatsAppFocused(true)}
                            onMouseLeave={() => setIsWhatsAppFocused(false)}
                            onFocus={() => setIsWhatsAppFocused(true)}
                            onBlur={() => setIsWhatsAppFocused(false)}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Contact via WhatsApp"
                        >
                            <span>Contact via WhatsApp</span>
                        </a>
                    </div>
                

                <div className="card-footer">
                    <div className="availability">
                        <div className={`status-dot ${availabilityStatus.toLowerCase() === "available" ? "available" : "pending"}`}></div>
                        <span>{availabilityStatus}</span>
                    </div>
                    <button
                        type="button"
                        className={`book-btn ${isBookingFocused ? "focused" : ""}`}
                        onClick={handleBookingClick}
                        onMouseEnter={() => setIsBookingFocused(true)}
                        onMouseLeave={() => setIsBookingFocused(false)}
                        onFocus={() => setIsBookingFocused(true)}
                        onBlur={() => setIsBookingFocused(false)}
                        aria-label="Book this car"
                    >
                        Book Now
                    </button>
                </div>

                {availabilityMessage && (
                    <div className="availability-message">
                        <p>{availabilityMessage}</p>
                    </div>
                )}
            </div>

            <BookingModal
                isVisible={showBookingModal}
                onClose={handleCloseBookingModal}
                onConfirmBooking={handleConfirmBooking}
                carId={car?.id}
            />
        </div>
    );
}

export default SimilarCarCard;
