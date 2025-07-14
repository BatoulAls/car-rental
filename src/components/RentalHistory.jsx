import React from 'react';
import axios from 'axios';
import '../styles/RentalHistory.css';
import Pagination from '../components/Pagination'; 
import SubmitButton from './SubmitButton';
import { useNavigate } from 'react-router-dom'; 

const RentalHistory = ({
    rentalHistory,
    total,
    totalPages,
    loading,
    error,
    currentPage,
    setCurrentPage,
    statusFilter,
    setStatusFilter,
    availableStatuses,
    token,
    onBookingActionSuccess
}) => {
    const navigate = useNavigate(); 

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'completed';
            case 'pending':
                return 'pending';
            case 'cancelled':
                return 'cancelled';
            default:
                return '';
        }
    };

    const getStatusDisplayName = (status) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const CANCEL_BOOKING_API_ENDPOINT = 'http://localhost:5050/api/bookings/';

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
            return;
        }

        try {
            const response = await axios.put(`${CANCEL_BOOKING_API_ENDPOINT}${bookingId}/cancel`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200 || response.status === 204) {
                alert('Booking cancelled successfully!');
                onBookingActionSuccess();
            } else {
                alert(`Failed to cancel booking: ${response.data?.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Error cancelling booking:", error);
            alert(`Error cancelling booking: ${error.response?.data?.message || error.message || 'Please try again.'}`);
        }
    };

   
    const handleViewDetails = (bookingId) => {
        
        navigate(`/booking-details/${bookingId}`);
    };

    if (loading) {
        return (
            <div className="tab-content">
                <h3 className="section-title">Rental History</h3>
                <p>Loading rental history...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="tab-content">
                <h3 className="section-title">Rental History</h3>
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="tab-content">
            <h3 className="section-title">Rental History</h3>

            <div className="filter-section">
                <h4 className="filter-title">Filter by Status</h4>
                <div className="filter-buttons">
                    {availableStatuses.map((status) => (
                        <button
                            key={status}
                            className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
                            onClick={() => setStatusFilter(status)}
                        >
                            <span className="filter-label">{getStatusDisplayName(status)}</span>
                        </button>
                    ))}
                </div>
            </div>

            {rentalHistory && rentalHistory.length > 0 ? (
                <>
                    <div className="pagination-info">
                        <span>Showing {rentalHistory.length} of {total} rentals</span>
                        <span>Page {currentPage} of {totalPages}</span>
                    </div>

                    <div className="rental-list">
                        {rentalHistory.map((rental) => (
                            <div key={rental.booking_id} className="rental-card">
                                <div className="rental-info">
                                    <h4 className="car-model">
                                        {rental.car.brand} {rental.car.model} {rental.car.year}
                                    </h4>
                                    <div className="rental-dates">
                                        {formatDate(rental.start_date)} to {formatDate(rental.end_date)}
                                    </div>
                                </div>
                                <div className="rental-details">
                                    <div className="total-cost">AED {rental.total_price}</div>
                                    <div className={`status ${getStatusClass(rental.status)}`}>
                                        {rental.status}
                                    </div>
                                    <div className="booking-actions">
                                        <SubmitButton
                                            text="View Details"
                                            onClick={() => handleViewDetails(rental.booking_id)}
                                            className="action-btn view-details-btn"
                                        />
                                        {rental.status.toLowerCase() === 'pending' && (
                                            <SubmitButton
                                                text="Cancel Booking"
                                                onClick={() => handleCancelBooking(rental.booking_id)}
                                                className="action-btn cancel-booking-btn"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pagination-controls">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </>
            ) : (
                <p className="no-results-message">No rental history found for "{getStatusDisplayName(statusFilter)}".</p>
            )}
        </div>
    );
};

export default RentalHistory;
