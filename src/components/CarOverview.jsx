import React from 'react';
import { useNavigate } from 'react-router-dom'; 

const renderStars = (rating) => {
  const stars = [];
  const numericRating = parseFloat(rating) || 0;
  const fullStars = Math.floor(numericRating);
  const hasHalfStar = numericRating % 1 !== 0;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<span key={i} className="filled-star">★</span>);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<span key={i} className="half-filled-star">★</span>);
    } else {
      stars.push(<span key={i} className="empty-star">★</span>);
    }
  }
  return stars;
};

const CarOverview = ({ carData }) => {
  const navigate = useNavigate(); 

  const handleReviewClick = () => {
    
    if (carData && carData.id) {
      navigate('/cars/' + carData.id + '/reviews');
    }
  };

  return (
    <>
      <div className="price-banner1">
        <span className="price-amount1">AED {carData.price_per_day ?? 'N/A'}</span>
        <span className="price-period1">/ day</span>
      </div>

      <div className="car-details">
        <div className="car-details-header1">
          <div className="car-title-section1">
            <h1 className="car-details-title1">{carData.brand ?? 'Unknown Brand'} {carData.model ?? 'Unknown Model'}</h1>
            <p className="car-subtitle1">{carData.year ?? 'N/A'} • {carData.regional_spec ?? 'N/A'}</p>
            <div className="car-category1">
              🚗 {carData.category?.name ?? 'Uncategorized'}
            </div>
            <div className="car-location1">
              📍 {carData.location ?? 'Unknown Location'}
            </div>
          </div>

          <div className="rating-section1">
            <div className="rating-stars1">
              {renderStars(carData.average_rating ?? 0)}
            </div>
            
            <span
              className="rating-text1 clickable-reviews" 
              onClick={handleReviewClick}
              title="Click to view all reviews" 
            >
              {carData.average_rating ?? '0.0'} ({carData.review_count ?? 0} reviews)
            </span>
          </div>
        </div>

        <div className="vendor-availability-section1">
          <div className="vendor-info1">
            <div className="label1">Provided by</div>
            <div className="vendor-name1">{carData.vendor?.name ?? 'Unknown Vendor'}</div>
            {carData.vendor?.phone && (
              <div className="vendor-phone1">📞 {carData.vendor.phone}</div>
            )}
            {!carData.vendor?.phone && (
              <div className="vendor-phone1">📞 N/A</div>
            )}
          </div>
          <div className="availability1">
            <div className={`status-dot1 ${carData.available ?? false ? 'available' : 'unavailable-dot'}`}></div>
            <span className="availability-text1">{carData.available ?? false ? 'Available Now' : 'Unavailable'}</span>
          </div>
        </div>

        <div className="specifications-section1">
          <h3 className="section-title1">Vehicle Specifications</h3>
          <div className="specs-grid1">
            <div className="spec1">
              <div className="label1">🚗 Brand</div>
              <div className="value1">{carData.brand ?? 'N/A'}</div>
            </div>

            <div className="spec1">
              <div className="label1">🏷️ Model</div>
              <div className="value1">{carData.model ?? 'N/A'}</div>
            </div>

            <div className="spec1">
              <div className="label1">📅 Year</div>
              <div className="value1">{carData.year ?? 'N/A'}</div>
            </div>

            <div className="spec1">
              <div className="label1">🌍 Regional Spec</div>
              <div className="value1">{carData.regional_spec ?? 'N/A'}</div>
            </div>

            <div className="spec1">
              <div className="label1">🏷️ Category</div>
              <div className="value1">{carData.category?.name ?? 'N/A'}</div>
            </div>

            <div className="spec1">
              <div className="label1">📍 Location</div>
              <div className="value1">{carData.location ?? 'N/A'}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CarOverview;