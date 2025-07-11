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
        e.stopPropagation(); // Prevent the card's onClick from firing
        setShowBookingModal(true); // Open the booking modal
    };

    const carName = car?.name || `${car?.company || car?.brand || 'Unknown'} ${car?.model || 'Car'}`;
    const carImage = car?.img || car?.photo || DEFAULT_CAR_IMAGE_PATH;
    const pricePerDay = car?.price_per_day || car?.price || 0;
    const carBrand = car?.brand || car?.company || 'Unknown Brand';
    const carSeats = car?.seats || car?.capacity || '5 People'; // Derived variable for consistency
    const availabilityStatus = car?.availability_status || 'Available Now';
    const whatsappNumber = car?.whatsapp || '+1234567890';

    const handleConfirmBooking = ({ startDate, endDate, available, bookedRange }) => {
        // In a real application, you'd typically make an API call to book the car here.
        if (!available) {
            console.log(`Car ${car.id} not available for booking from ${startDate} to ${endDate}. Booked periods: ${bookedRange}`);
            alert(`❌ The car is not available. Booked during the following periods: ${bookedRange}`);
        }
        setShowBookingModal(false); // Close the modal after confirmation attempt
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
            onClick={handleCardClick} // Card click navigates to details
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
                        <div className="overlay-item">
                            <span className="overlay-icon">🎒 Bags: </span>
                            <span className="overlay-text">{car?.bags}</span>
                        </div>
                        <div className="overlay-item">
                            <span className="overlay-icon">🚪 Doors:</span> {/* Changed emoji for doors */}
                            <span className="overlay-text">{car?.no_of_doors}</span>
                        </div>
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
                <span className="price-amount">${pricePerDay}</span>
                <span className="price-period">/day</span>
            </div>

            <div className="car-details">
                <div className="specs-grid">
                    <div className="spec">
                        <span className="label">Model</span>
                        <span className="value">{car?.model || 'Unknown'}</span>
                    </div>
                    <div className="spec">
                        <span className="label">Brand</span>
                        <span className="value">{carBrand}</span>
                    </div>
                    <div className="spec">
                        <span className="label">Category</span>
                        <span className="value">{car?.category || 'Standard'}</span>
                    </div>
                    <div className="spec">
                        <span className="label">Capacity</span>
                        <span className="value">{carSeats}</span> {/* Using the derived carSeats variable */}
                    </div>
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
            </div>
            {/* BookingModal component */}
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