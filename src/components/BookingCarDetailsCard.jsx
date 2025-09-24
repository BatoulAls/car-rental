import React from 'react';
import { Star, MapPin, Car, Users, Briefcase, Settings, Fuel, Award, Paintbrush } from 'lucide-react';

export const BookingCarDetailsCard = ({ car }) => {
  if (!car) return null;

  const renderStars = (rating) => {
    const stars = [];
    const numRating = parseFloat(rating);
    if (isNaN(numRating)) return null;

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={i <= numRating ? 'star-filled' : 'star-empty'}
          size={16}
        />
      );
    }
    return stars;
  };

  return (
    <>
      {(car.name || car.brand || car.model || car.year) && (
        <div className="preview-car-header">
          {car.name && <h1 className="preview-car-title">{car.name}</h1>}
          {(car.brand || car.model || car.year) && (
            <p className="preview-car-subtitle">{car.brand} {car.model} {car.year}</p>
          )}
          <div className="preview-car-details">
            {(car.average_rating || car.review_count) && (
              <div className="preview-rating-section">
                {renderStars(car.average_rating)}
                {car.review_count !== undefined && <span>({car.review_count} reviews)</span>}
              </div>
            )}
            {car.location && (
              <div className="preview-location-info">
                <MapPin size={16} />
                <span>{car.location}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {(car.seats || car.no_of_doors || car.bags || car.transmission || car.fuel_type || car.regional_spec || car.color) && (
        <div className="preview-specs-grid">
          {car.seats && (
            <div className="preview-spec-item">
              <Users className="preview-spec-icon" size={20} />
              <div className="preview-spec-text">
                <strong>Seats:</strong> {car.seats}
              </div>
            </div>
          )}
          {car.no_of_doors && (
            <div className="preview-spec-item">
              <Car className="preview-spec-icon" size={20} />
              <div className="preview-spec-text">
                <strong>Doors:</strong> {car.no_of_doors}
              </div>
            </div>
          )}
          {car.bags && (
            <div className="preview-spec-item">
              <Briefcase className="preview-spec-icon" size={20} />
              <div className="preview-spec-text">
                <strong>Bags:</strong> {car.bags}
              </div>
            </div>
          )}
          {car.transmission && (
            <div className="preview-spec-item">
              <Settings className="preview-spec-icon" size={20} />
              <div className="preview-spec-text">
                <strong>Transmission:</strong> {car.transmission}
              </div>
            </div>
          )}
          {car.fuel_type && (
            <div className="preview-spec-item">
              <Fuel className="preview-spec-icon" size={20} />
              <div className="preview-spec-text">
                <strong>Fuel:</strong> {car.fuel_type}
              </div>
            </div>
          )}
          {car.regional_spec && (
            <div className="preview-spec-item">
              <Award className="preview-spec-icon" size={20} />
              <div className="preview-spec-text">
                <strong>Spec:</strong> {car.regional_spec}
              </div>
            </div>
          )}
          {car.color && (
            <div className="preview-spec-item">
              <Paintbrush className="preview-spec-icon" size={20} />
              <div className="preview-spec-text">
                <strong>Color:</strong> {car.color}
              </div>
            </div>
          )}
        </div>
      )}

      {car.Features && car.Features.length > 0 && (
        <div className="preview-features-section">
          <h3 className="preview-section-title">Features</h3>
          <div className="preview-features-grid">
            {car.Features.map((feature, index) => (
              <div key={index} className="preview-feature-item">
                {feature.name && <div>{feature.name}</div>}
                {feature.type_ && <div className="preview-feature-type">{feature.type_}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {car.Tags && car.Tags.length > 0 && (
        <div className="preview-tags-section">
          <h3 className="preview-section-title">Tags</h3>
          <div className="preview-tags-list">
            {car.Tags.map((tag, index) => (
              <span key={index} className="preview-tag-item">{tag.name}</span>
            ))}
          </div>
        </div>
      )}

      {(car.Vendor && (car.Vendor.name || car.Vendor.phone)) && (
        <div className="preview-vendor-info">
          {car.Vendor.name && <div className="preview-vendor-name">{car.Vendor.name}</div>}
          {car.Vendor.phone && <div className="preview-vendor-phone">📞 {car.Vendor.phone}</div>}
        </div>
      )}

      {car.description && (
        <div className="preview-description-section">
          <h3 className="preview-section-title">Description</h3>
          <div className="preview-description-content" dangerouslySetInnerHTML={{ __html: car.description }} />
        </div>
      )}
    </>
  );
};

export default BookingCarDetailsCard;
