import React from 'react';
import { Calendar } from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const BookingSummaryCard = ({ bookingSummary }) => {
  if (!bookingSummary) return null;

  return (
    <>
      {(bookingSummary.start_date || bookingSummary.end_date || bookingSummary.days !== undefined) && (
        <div className="preview-booking-section">
          <h3 className="preview-section-title">Booking Summary</h3>
          <div className="preview-booking-dates">
            {bookingSummary.start_date && (
              <div className="preview-date-item">
                <Calendar size={16} />
                <span className="preview-date-label">Start Date:</span>
                <span className="preview-date-value">{formatDate(bookingSummary.start_date)}</span>
              </div>
            )}
            {bookingSummary.end_date && (
              <div className="preview-date-item">
                <Calendar size={16} />
                <span className="preview-date-label">End Date:</span>
                <span className="preview-date-value">{formatDate(bookingSummary.end_date)}</span>
              </div>
            )}
            {bookingSummary.days !== undefined && (
              <div className="preview-date-item">
                <span className="preview-date-label">Total Days:</span>
                <span className="preview-date-value">{bookingSummary.days} days</span>
              </div>
            )}
          </div>
        </div>
      )}

    
      {(bookingSummary.price_per_day !== undefined || bookingSummary.total_price !== undefined) && (
        <div className="preview-pricing-section">
          <h3 className="preview-section-title">Pricing</h3>
          {bookingSummary.price_per_day !== undefined && (
            <div className="preview-price-row">
              <span className="preview-price-label">Daily Price:</span>
              <span className="preview-price-value">AED {bookingSummary.price_per_day}</span>
            </div>
          )}
          {bookingSummary.price_per_day !== undefined && bookingSummary.days !== undefined && (
            <div className="preview-price-row">
              <span className="preview-price-label">Days ({bookingSummary.days}):</span>
              <span className="preview-price-value">AED {bookingSummary.price_per_day * bookingSummary.days}</span>
            </div>
          )}
          {bookingSummary.total_price !== undefined && (
            <div className="preview-price-row">
              <span className="preview-price-label total-price">Total:</span>
              <span className="preview-price-value total-price">AED {bookingSummary.total_price}</span>
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default BookingSummaryCard