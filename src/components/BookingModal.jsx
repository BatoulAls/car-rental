import React, { useState, useEffect } from 'react';
import PopUpModal from './PopUpModal';
import InputField from './InputField';
import SubmitButton from './SubmitButton';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/BookingModal.css';

const BookingModal = ({ isVisible, onClose, onConfirmBooking, carId }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); 
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const previewBooking = async () => {
    setLoading(true);
    try {
      if (!token) {
        setMessage('Please log in.');
        setMessageType('error');
        navigate('/Login');
        setLoading(false);
        return;
      }

      const response = await axios.post(
        'http://localhost:5050/api/bookings/preview',
        {
          car_id: carId,
          start_date: startDate,
          end_date: endDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data;
      console.log('Booking preview successful:', data);

      onClose();

      navigate('/preview-booking', {
        state: {
          carId,
          startDate,
          endDate,
          previewData: data,
        },
      });

      if (onConfirmBooking) {
        onConfirmBooking({
          startDate,
          endDate,
          available: true,
          previewData: data,
        });
      }
    } catch (error) {
      console.error('Error during booking preview:', error);
      setMessage(
        `Error during booking preview: ${
          error.response?.data?.message || error.message
        }`
      );
      setMessageType('error');
      if (onConfirmBooking) {
        onConfirmBooking({ startDate, endDate, available: true, previewError: true });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!startDate || !endDate) {
      setMessage('Please select both start and end dates.');
      setMessageType('error');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedStartDate = new Date(startDate);
    selectedStartDate.setHours(0, 0, 0, 0);

    if (selectedStartDate < today) {
      setMessage('Start date cannot be in the past. Please select a future date.');
      setMessageType('error');
      return;
    }

    if (end < start) {
      setMessage('End date cannot be before start date.');
      setMessageType('error');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get('http://localhost:5050/api/bookings/check-availability', {
        params: {
          car_id: carId,
          start_date: startDate,
          end_date: endDate,
        },
      });

      const data = response.data;

      if (data.available) {
        await previewBooking();
      } else {
        const bookedRange = data.booked_dates
          .map(
            (d) =>
              `From ${new Date(d.start_date).toLocaleDateString()} to ${new Date(
                d.end_date
              ).toLocaleDateString()}`
          )
          .join(', ');
        setMessage(`Not available. Booked during: ${bookedRange}`);
        setMessageType('error');
         if (onConfirmBooking) {
    onConfirmBooking({ startDate, endDate, available: false, bookedRange }); 
  }
      }
    } catch (error) {
      console.error(error);
      setMessage(`Error while checking availability: ${error.message}`);
      setMessageType('error');
      if (onConfirmBooking) {
        onConfirmBooking({ startDate, endDate, available: false });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setStartDate('');
    setEndDate('');
    setMessage('');
    setMessageType('');
    setLoading(false);
    onClose();
  };

  return (
    <PopUpModal isVisible={isVisible} onClose={handleCancel}>
      <h2 className="title-Booking">Book Your Ride</h2>

      <InputField
        label="Start Date"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        placeholder="Select start date"
        className="booking-input-margin"
      />

      <InputField
        label="End Date"
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        placeholder="Select end date"
        className="booking-input-margin-bottom"
      />

      {message && (
        <div className={`booking-message booking-message--${messageType}`}>
          {message}
        </div>
      )}

      <div className="booking-actions">
        <SubmitButton
          text="Cancel"
          onClick={handleCancel}
        />
        <SubmitButton
          text={loading ? 'Processing...' : 'Check Availability'}
          onClick={handleConfirm}
          disabled={loading}
        />
      </div>
    </PopUpModal>
  );
};

export default BookingModal;
