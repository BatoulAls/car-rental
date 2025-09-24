import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { CreditCard, Info, CheckCircle, XCircle, Wallet } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CustomerInfoCard } from '../../components/CustomerInfoCard';
import { BookingCarDetailsCard } from '../../components/BookingCarDetailsCard';
import { BookingSummaryCard } from '../../components/BookingSummaryCard';
import SubmitButton from '../../components/SubmitButton'; 

import '../../styles/BookingDetails.css';

const VendorBookingDetails = () => {
    const { token } = useAuth();
    const { bookingId } = useParams();

    const [bookingData, setBookingData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            if (!bookingId) {
                setError('Booking ID not provided in URL.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await axios.get(
                    `http://localhost:5050/api/vendor/booking/${bookingId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );

                const fetchedData = response.data;

                const transformedData = {
                    booking_id: fetchedData.id,
                    car: fetchedData.Car,
                    start_date: fetchedData.start_date,
                    end_date: fetchedData.end_date,
                    status: fetchedData.status,
                    total_price: fetchedData.total_price,
                    payment_method: fetchedData.payment_method,
                    User: fetchedData.User,
                };

                setBookingData(transformedData);
            } catch (err) {
                console.error('Failed to fetch booking details:', err);
                if (err.response) {
                    if (err.response.status === 401) {
                        setError('Unauthorized: Please log in again.');
                    } else if (err.response.status === 404) {
                        setError('Booking not found for the given ID.');
                    } else {
                        setError(`Error: ${err.response.status} - ${err.response.statusText || 'Something went wrong.'}`);
                    }
                } else if (err.request) {
                    setError('Network Error: No response received from server.');
                } else {
                    setError('Error: Could not set up request.');
                }
            } finally {
                setLoading(false);
            }
        };

        if (token && bookingId) {
            fetchBookingDetails();
        } else if (!token) {
            setError('Authentication token not available. Please log in.');
            setLoading(false);
        }
    }, [bookingId, token]);

 const handleBookingAction = async (action) => {
    if (!bookingData) return;
    try {
        setActionLoading(true);

        const requestBody = {
            bookingId: bookingData.booking_id,
            newstatus: action,
        };

        
        console.log('Sending to API:', requestBody);

        const response = await axios.post(
            `http://localhost:5050/api/vendor/booking/updateBooking`,
            requestBody,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        if (response.data.message === "Booking status updated successfully.") {
            setBookingData((prev) => ({ ...prev, status: action }));
        }
    } catch (err) {
        console.error(`Failed to ${action} booking:`, err);
        alert(`Failed to ${action} booking. Please try again.`);
    } finally {
        setActionLoading(false);
    }
};

    const getStatusClass = (status) =>
        status?.toLowerCase() === 'confirmed'
            ? 'Booking-availability-badge available'
            : 'Booking-availability-badge not-available';

    const getBookingStatusText = (status) => status ? status.charAt(0).toUpperCase() + status.slice(1) : '';

    const calculateDays = () => {
        if (!bookingData || !bookingData.start_date || !bookingData.end_date) return 0;
        const start = new Date(bookingData.start_date);
        const end = new Date(bookingData.end_date);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const formatPaymentMethod = (method) =>
        method ? method.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Not Specified';

    const getPaymentMethodIcon = (method) => {
        switch (method?.toLowerCase()) {
            case 'card': return <CreditCard size={20} className="Booking-payment-icon" />;
            case 'bank_transfer':
            case 'bank': return <Info size={20} className="Booking-payment-icon" />;
            case 'cash': return <Wallet size={20} className="Booking-payment-icon" />;
            default: return null;
        }
    };

    if (loading) return <div className="Booking-container" style={{ textAlign: 'center', color: '#6c757d' }}>Loading booking details...</div>;
    if (error) return <div className="Booking-container" style={{ textAlign: 'center', color: '#dc3545' }}>Error: {error}</div>;
    if (!bookingData) return <div className="Booking-container" style={{ textAlign: 'center', color: '#6c757d' }}>No booking data available.</div>;

    const { car, start_date, end_date, total_price, status, booking_id, payment_method } = bookingData;

    const bookingSummary = {
        start_date,
        end_date,
        days: calculateDays(),
        price_per_day: car?.price_per_day,
        total_price,
    };

    return (
        <div className="Booking-container">
            {status && (
                <span className={getStatusClass(status)}>
                    Booking Status: {getBookingStatusText(status)}
                </span>
            )}
            <div className="Booking-main-content">
                <div className="Booking-left-section">
                    <BookingCarDetailsCard car={car} />
                    <CustomerInfoCard user={bookingData.User} />
                </div>
                <div className="Booking-right-section">
                    <BookingSummaryCard bookingSummary={bookingSummary} />

                    {payment_method && (
                        <div className="Booking-payment-display-section">
                            <h3 className="Booking-section-title">Payment Method</h3>
                            <div className="Booking-payment-item-display">
                                {getPaymentMethodIcon(payment_method)}
                                <span className="Booking-payment-label-display">{formatPaymentMethod(payment_method)}</span>
                            </div>
                        </div>
                    )}

                    <div className="Booking-additional-info">
                        {booking_id && <div className="Booking-info-item"><span className="Booking-info-label">Booking ID:</span> #{booking_id}</div>}
                        {status && <div className="Booking-info-item"><span className="Booking-info-label">Current Status:</span> {getBookingStatusText(status)}</div>}
                    </div>

                    <div className="Booking-actions">
                        {status === 'pending' && (
                            <>
                                <SubmitButton
                                    text="Accept"
                                    onClick={() => handleBookingAction('confirmed')}
                                    disabled={actionLoading}
                                    className="btn-accept"
                                    icon="✔"
                                />
                                <SubmitButton
                                    text="Reject"
                                    onClick={() => handleBookingAction('rejected')}
                                    disabled={actionLoading}
                                    className="btn-reject"
                                    icon="✖"
                                />
                            </>
                        )}
                        {status === 'confirmed' && (
                            <>
                                <SubmitButton
                                    text="Complete"
                                    onClick={() => handleBookingAction('completed')}
                                    disabled={actionLoading}
                                    className="btn-complete"
                                    icon="✔"
                                />
                                <SubmitButton
                                    text="Cancel"
                                    onClick={() => handleBookingAction('cancelled')}
                                    disabled={actionLoading}
                                    className="btn-cancel"
                                    icon="✖"
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorBookingDetails;