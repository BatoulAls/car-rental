import React, { useState } from 'react';
import axios from 'axios';
import '../styles/RentalHistory.css';
import Pagination from '../components/Pagination';
import SubmitButton from './SubmitButton';
import { useNavigate } from 'react-router-dom';
import PopUpModal from './PopUpModal';
import ReviewModel from './ReviewModel';
import StyledAlert from './StyledAlert'; 

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

   
    const [alert, setAlert] = useState({
        isVisible: false,
        title: '',
        message: '',
        type: 'info',
        showConfirm: false,
        onConfirm: null
    });

    const [showReviewPopup, setShowReviewPopup] = useState(false);
    const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewMessage, setReviewMessage] = useState('');

    const showAlert = (title, message, type = 'info', showConfirm = false, onConfirm = null) => {
        setAlert({
            isVisible: true,
            title,
            message,
            type,
            showConfirm,
            onConfirm
        });
    };

    const closeAlert = () => {
        setAlert(prev => ({ ...prev, isVisible: false }));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'completed';
            case 'pending': return 'pending';
            case 'cancelled': return 'cancelled';
            default: return '';
        }
    };

    const getStatusDisplayName = (status) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const CANCEL_BOOKING_API_ENDPOINT = 'http://localhost:5050/api/bookings/';
    const SUBMIT_REVIEW_API_ENDPOINT = 'http://localhost:5050/api/reviews';

    const handleCancelBooking = async (bookingId) => {
        showAlert(
            'Cancel Booking',
            'Are you sure you want to cancel this booking? This action cannot be undone.',
            'warning',
            true,
            async () => {
                closeAlert();

                try {
                    const response = await axios.put(`${CANCEL_BOOKING_API_ENDPOINT}${bookingId}/cancel`, {}, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.status === 200 || response.status === 204) {
                        showAlert('Success!', 'Booking cancelled successfully!', 'success');
                        onBookingActionSuccess();
                    } else {
                        showAlert('Error', `Failed to cancel booking: ${response.data?.message || 'Unknown error'}`, 'error');
                    }
                } catch (error) {
                    console.error("Error cancelling booking:", error);
                    showAlert('Error', `Error cancelling booking: ${error.response?.data?.message || error.message || 'Please try again.'}`, 'error');
                }
            }
        );
    };

    const handleViewDetails = (bookingId) => {
        navigate(`/booking-details/${bookingId}`);
    };

    const handleWriteReview = (rental) => {
        setSelectedBookingForReview(rental);
        setReviewRating(5);
        setReviewComment('');
        setReviewMessage('');
        setShowReviewPopup(true);
    };

    const handleSubmitReview = async () => {
        if (!selectedBookingForReview) {
            setReviewMessage('No booking selected for review.');
            return;
        }

        if (!selectedBookingForReview.car) {
            setReviewMessage('Car details are missing for this booking. Cannot submit review.');
            console.error("selectedBookingForReview.car is undefined:", selectedBookingForReview);
            return;
        }

        if (reviewRating < 1 || reviewRating > 5) {
            setReviewMessage('Rating must be between 1 and 5 stars.');
            return;
        }

        if (!reviewComment.trim()) {
            setReviewMessage('Review comment cannot be empty.');
            return;
        }

        try {
            const response = await axios.post(SUBMIT_REVIEW_API_ENDPOINT, {
                booking_id: selectedBookingForReview.booking_id,
                car_id: selectedBookingForReview.car.id,
                rating: reviewRating,
                comment: reviewComment
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 201) {
                showAlert('Success!', 'Review submitted successfully!', 'success');
                setShowReviewPopup(false);
                setSelectedBookingForReview(null);
                onBookingActionSuccess();
            } else {
                setReviewMessage(`Failed to submit review: ${response.data?.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            setReviewMessage(`Error submitting review: ${error.response?.data?.message || error.message || 'Please try again.'}`);
        }
    };

    const handleCloseReviewPopup = () => {
        setShowReviewPopup(false);
        setSelectedBookingForReview(null);
        setReviewMessage('');
    };

    const isRentalEnded = (endDate) => {
        const now = new Date();
        const rentalEnd = new Date(endDate);
        return rentalEnd < now;
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
                                        {isRentalEnded(rental.end_date) && (
                                            <SubmitButton
                                                text="🖊️ Write Review"
                                                onClick={() => handleWriteReview(rental)}
                                                className="action-btn write-review-btn"
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
                <p className="no-results-message">
                    No rental history found for "{getStatusDisplayName(statusFilter)}".
                </p>
            )}

            <PopUpModal isVisible={showReviewPopup} onClose={handleCloseReviewPopup}>
                {selectedBookingForReview && (
                    <ReviewModel
                        car={selectedBookingForReview.car}
                        rating={reviewRating}
                        comment={reviewComment}
                        onRatingChange={setReviewRating}
                        onCommentChange={(e) => setReviewComment(e.target.value)}
                        onSubmit={handleSubmitReview}
                        onCancel={handleCloseReviewPopup}
                        message={reviewMessage}
                    />
                )}
            </PopUpModal>

            <StyledAlert
                isVisible={alert.isVisible}
                onClose={closeAlert}
                title={alert.title}
                message={alert.message}
                type={alert.type}
                showConfirm={alert.showConfirm}
                onConfirm={alert.onConfirm}
            />
        </div>
    );
};

export default RentalHistory;
