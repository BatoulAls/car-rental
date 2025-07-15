import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; 
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/BookingPreviewPage.css';
import { BookingCarDetailsCard } from '../components/BookingCarDetailsCard';
import { BookingSummaryCard } from '../components/BookingSummaryCard';
import { PaymentMethodSelector } from '../components/PaymentMethodSelector';
import { Message } from '../components/Message';
import { AdditionalInfoCard } from '../components/AdditionalInfoCard';
import { useNavigate } from 'react-router-dom';
const BookingPreviewPage = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingStatus, setBookingStatus] = useState(''); 
  const [isBookedSuccessfully, setIsBookedSuccessfully] = useState(false); 
  const location = useLocation();
  const [carRentalData, setCarRentalData] = useState(null);
  const { token } = useAuth();
  const navigate= useNavigate()

  useEffect(() => {
    if (location.state && location.state.previewData) {
      setCarRentalData(location.state.previewData);
    }
  }, [location.state]);

 
  useEffect(() => {
    let timer;
    if (bookingMessage) {
      timer = setTimeout(() => {
        setBookingMessage('');
        setBookingStatus('');
       
      }, 5000); 
    }
    return () => clearTimeout(timer);
  }, [bookingMessage]);

  const handleBookNow = async () => {
    
    if (isBooking || isBookedSuccessfully) {
      return;
    }

    if (!selectedPaymentMethod) {
      setBookingMessage('Please select a payment method first.');
      setBookingStatus('error');
      return;
    }

    if (!carRentalData || !carRentalData.car || !carRentalData.booking_summary) {
      setBookingMessage('Booking data is incomplete. Please try again or go back.');
      setBookingStatus('error');
      return;
    }

    if (!token) {
      setBookingMessage('You are not logged in. Please log in to proceed.');
      setBookingStatus('error');
    
      return;
    }

    setIsBooking(true); 
    setBookingMessage(''); 
    setBookingStatus('');

    try {
      const bookingData = {
        car_id: carRentalData.car.id,
        start_date: carRentalData.booking_summary.start_date,
        end_date: carRentalData.booking_summary.end_date,
        payment_method: selectedPaymentMethod,
      };

      const response = await axios.post(
        'http://localhost:5050/api/bookings',
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setBookingStatus('success');
      setBookingMessage(response.data.message || 'Booking successful! Your booking has been confirmed.');
     
      setIsBookedSuccessfully(true); 
       navigate('/UserProfile?tab=history')
      
    } catch (error) {
      setBookingStatus('error');
      if (error.response) {
        if (error.response.status === 401) {
          setBookingMessage('Your session has expired or you are not authorized. Please log in again.');
        } else if (error.response.status === 400 && error.response.data.message.includes("Car not available")) {
            setBookingMessage('The car is no longer available for the selected dates. Please choose different dates or another car.');
        }
        else {
          setBookingMessage(error.response.data.message || error.response.data.error || 'Booking failed. Please try again.');
        }
      } else if (error.request) {
        setBookingMessage('Network error. Please check your connection and try again.');
      } else {
        setBookingMessage('An unexpected error occurred. Please try again.');
      }
      console.error('Booking error:', error);
    } finally {
      setIsBooking(false); 
    }
  };

  if (!carRentalData) {
    return (
      <div className="preview-container">
        <p>Loading car details or no preview data available...</p>
      </div>
    );
  }

  const { car, booking_summary, payment_methods, available } = carRentalData;

  return (
    <div className="preview-container">
      {available !== undefined && (
        <div className={`preview-availability-badge ${available ? 'available' : 'not-available'}`}>
          {available ? '✓ Available' : '✗ Not Available'}
        </div>
      )}

      <div className="preview-main-content">
        <div className="preview-left-section">
          <BookingCarDetailsCard car={car} />
        </div>

        <div className="preview-right-section">
          <BookingSummaryCard bookingSummary={booking_summary} />
          <PaymentMethodSelector
            paymentMethods={payment_methods}
            selectedPaymentMethod={selectedPaymentMethod}
            onSelectPaymentMethod={setSelectedPaymentMethod}
           
            disabled={isBooking || isBookedSuccessfully} 
          />
          <Message message={bookingMessage} status={bookingStatus} />
          <AdditionalInfoCard car={car} />

          {payment_methods && payment_methods.length > 0 && booking_summary.total_price !== undefined && (
            <button
             
              className={`preview-book-button ${selectedPaymentMethod && !isBooking && !isBookedSuccessfully ? 'enabled' : ''}`}
              onClick={handleBookNow}
             
              disabled={!selectedPaymentMethod || isBooking || isBookedSuccessfully}
            >
              {isBooking
                ? 'Processing...'
                : isBookedSuccessfully
                ? 'Booking Confirmed!'
                : selectedPaymentMethod
                ? `Book Now with ${selectedPaymentMethod} - AED ${booking_summary.total_price}`
                : 'Select Payment Method to Proceed'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPreviewPage;