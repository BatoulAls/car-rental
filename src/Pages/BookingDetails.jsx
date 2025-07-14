import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
    CreditCard,
    Info,
    CheckCircle,
    XCircle,
    Wallet,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/BookingDetails.css';
import { BookingCarDetailsCard } from '../components/BookingCarDetailsCard';
import { BookingSummaryCard } from '../components/BookingSummaryCard'; 

const BookingDetails = () => {
    const { token } = useAuth();
    const { bookingId } = useParams();

    const [bookingData, setBookingData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);

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

                const response = await axios.get(`http://localhost:5050/api/bookings/${bookingId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const fetchedData = response.data;
                setBookingData(fetchedData);

                if (fetchedData.payment_method) {
                    setSelectedPayment(fetchedData.payment_method);
                } else {
                    setSelectedPayment('N/A');
                }

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

 
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getStatusClass = (status) => {
        if (status?.toLowerCase() === 'confirmed') {
            return 'Booking-availability-badge available';
        }
        return 'Booking-availability-badge not-available';
    };

    const getBookingStatusText = (status) => {
        if (!status) return '';
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const calculateDays = () => {
        if (!bookingData || !bookingData.start_date || !bookingData.end_date) return 0;
        const start = new Date(bookingData.start_date);
        const end = new Date(bookingData.end_date);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    if (loading) {
        return <div className="Booking-container" style={{ textAlign: 'center', color: '#6c757d' }}>Loading booking details...</div>;
    }

    if (error) {
        return <div className="Booking-container" style={{ textAlign: 'center', color: '#dc3545' }}>Error: {error}</div>;
    }

    if (!bookingData) {
        return <div className="Booking-container" style={{ textAlign: 'center', color: '#6c757d' }}>No booking data available.</div>;
    }

    const { car, start_date, end_date, total_price, status, booking_id, payment_status, payment_method } = bookingData;

    
    const bookingSummary = {
        start_date: start_date,
        end_date: end_date,
        days: calculateDays(),
        price_per_day: car?.price_per_day, 
        total_price: total_price,
    };

    const formatPaymentMethod = (method) => {
        if (!method) return 'Not Specified';
        return method.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const getPaymentMethodIcon = (method) => {
        switch (method?.toLowerCase()) {
            case 'card':
                return <CreditCard size={20} className="Booking-payment-icon" />;
            case 'bank_transfer':
            case 'bank':
                return <Info size={20} className="Booking-payment-icon" />;
            case 'cash':
                return <Wallet size={20} className="Booking-payment-icon" />;
            default:
                return null;
        }
    };

    return (
        <div className="Booking-container">
            {status && (
                <span className={getStatusClass(status)}>
                    {status === 'confirmed' ? 'Booking Confirmed' : 'Booking Status: ' + getBookingStatusText(status)}
                </span>
            )}

            <div className="Booking-main-content">
                
                <div className="Booking-left-section">
                    <BookingCarDetailsCard car={car} />
                </div>

              
                <div className="Booking-right-section">
                  
                    <BookingSummaryCard bookingSummary={bookingSummary} />

               
                    {payment_method && (
                        <div className="Booking-payment-display-section">
                            <h3 className="Booking-section-title">Payment Method</h3>
                            <div className="Booking-payment-item-display">
                                {getPaymentMethodIcon(payment_method)}
                                <span className="Booking-payment-label-display">
                                    {formatPaymentMethod(payment_method)}
                                </span>
                            </div>
                        </div>
                    )}

                  
                    {(booking_id || status || payment_status) && (
                        <div className="Booking-additional-info">
                            {booking_id && (
                                <div className="Booking-info-item">
                                    <span className="Booking-info-label">Booking ID:</span> #{booking_id}
                                </div>
                            )}
                            {status && (
                                <div className="Booking-info-item">
                                    <span className="Booking-info-label">Current Status:</span> {getBookingStatusText(status)}
                                </div>
                            )}
                            {payment_status && (
                                <div className="Booking-info-item">
                                    <span className="Booking-info-label">Payment Status:</span> {payment_status}
                                </div>
                            )}
                        </div>
                    )}

                   
                    {error && (
                        <div className="Booking-booking-message error">
                            <XCircle size={20} className="message-icon error-icon" />
                            <span>{error}</span>
                        </div>
                    )}
                    {status === 'confirmed' && (
                        <div className="Booking-booking-message success">
                            <CheckCircle size={20} className="message-icon success-icon" />
                            <span>Your booking is confirmed! Details sent to your email.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingDetails;