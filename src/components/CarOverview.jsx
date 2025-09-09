import React from 'react';
import { useNavigate, Link } from 'react-router-dom'; 

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

  const hasSpecifications = 
    carData.brand || carData.model || carData.year || 
    carData.regional_spec || carData.category?.name || carData.location;

  const hasReviews = (carData.average_rating || carData.review_count);
  
  const hasVendorInfo = carData.vendor?.name || carData.vendor?.phone;

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
            {carData.CarCategory?.name && (
              <div className="car-category1">
                🚗 {carData.CarCategory.name}
              </div>
            )}
          </div>

          {hasReviews && (
            <div className="rating-section1">
              <div className="rating-stars1">
                {renderStars(carData.average_rating ?? 0)}
              </div>
              <span
                className="rating-text1 clickable-reviews" 
                onClick={handleReviewClick}
                title="Click to view all reviews" 
              >
                {parseFloat(carData.average_rating ?? 0).toFixed(1)} ({carData.review_count ?? 0} reviews)
              </span>
            </div>
          )}
        </div>

        {hasVendorInfo && (
          <div className="vendor-availability-section1">
            <div className="vendor-info1">
              <div className="label1">Provided by</div>
              <div>
                <Link className="vendor-name1" to={`/vendors/${carData.vendor?.id}`}>
                  {carData.vendor?.name ?? 'Unknown Vendor'}
                </Link>
              </div>
              {carData.vendor?.phone && (
                <div className="vendor-phone1">📞 {carData.vendor.phone}</div>
              )}
            </div>
            <div className="availability1">
              <div className={`status-dot1 ${carData.available ? 'available' : 'unavailable-dot'}`}></div>
              <span className="availability-text1">{carData.available ? 'Available Now' : 'Unavailable'}</span>
            </div>
          </div>
        )}

        {hasSpecifications && (
          <div className="specifications-section1">
            <h3 className="section-title1">Vehicle Specifications</h3>
            <div className="specs-grid1">
              {carData.brand && (
                <div className="spec1">
                  <div className="label1">🚗 Brand</div>
                  <div className="value1">{carData.brand}</div>
                </div>
              )}

              {carData.model && (
                <div className="spec1">
                  <div className="label1">🏷️ Model</div>
                  <div className="value1">{carData.model}</div>
                </div>
              )}

              {carData.year && (
                <div className="spec1">
                  <div className="label1">📅 Year</div>
                  <div className="value1">{carData.year}</div>
                </div>
              )}

              {carData.regional_spec && (
                <div className="spec1">
                  <div className="label1">🌍 Regional Spec</div>
                  <div className="value1">{carData.regional_spec}</div>
                </div>
              )}

              {carData.CarCategory?.name && (
                <div className="spec1">
                  <div className="label1">🏷️ Category</div>
                  <div className="value1">{carData.CarCategory.name}</div>
                </div>
              )}

              {carData.location && (
                <div className="spec1">
                  <div className="label1">📍 Location</div>
                  <div className="value1">{carData.location}</div>
                </div>
              )}
              
              {carData.color && (
                <div className="spec1">
                  <div className="label1">🎨 Color</div>
                  <div className="value1">{carData.color}</div>
                </div>
              )}
              
              {carData.fuel_type && (
                <div className="spec1">
                  <div className="label1">⛽ Fuel Type</div>
                  <div className="value1">{carData.fuel_type}</div>
                </div>
              )}
              
              {carData.transmission && (
                <div className="spec1">
                  <div className="label1">⚙️ Transmission</div>
                  <div className="value1">{carData.transmission}</div>
                </div>
              )}

              {carData.engine_capacity && (
                <div className="spec1">
                  <div className="label1">  Engine Capacity</div>
                  <div className="value1">{carData.engine_capacity}</div>
                </div>
              )}
              
              {carData.seats && (
                <div className="spec1">
                  <div className="label1"> 💺 Seats</div>
                  <div className="value1">{carData.seats}</div>
                </div>
              )}
              
              {carData.no_of_doors && (
                <div className="spec1">
                  <div className="label1">🚪 Doors</div>
                  <div className="value1">{carData.no_of_doors}</div>
                </div>
              )}
              
              {carData.bags && (
                <div className="spec1">
                  <div className="label1"> 🧳 Bags</div>
                  <div className="value1">{carData.bags}</div>
                </div>
              )}
              
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CarOverview;