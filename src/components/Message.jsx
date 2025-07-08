import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import '../styles/BookingPreviewPage.css'

export const Message = ({ message, status }) => {
  if (!message) return null;

  return (
    <div className={`preview-booking-message ${status}`}>
      {status === 'success' ? (
        <CheckCircle size={20} className="message-icon success-icon" />
      ) : (
        <XCircle size={20} className="message-icon error-icon" />
      )}
      <span>{message}</span>
    </div>
  );
};
export default Message