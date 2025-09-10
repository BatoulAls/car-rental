import React, { useState, useEffect } from 'react';
import defaultimg from '../images/cars-big/default-car.png';

const API_BASE_URL = 'http://localhost:5050';

const CarImageGallery = ({ images, carBrand, carModel, mainPhoto }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    setCurrentImageIndex(0);
    setIsImageLoading(true);
  }, [images, mainPhoto]);

  const photos = [];

  if (mainPhoto && mainPhoto.trim() !== '') {
    photos.push(mainPhoto.startsWith('http') ? mainPhoto : `${API_BASE_URL}${mainPhoto}`);
  }

  if (images && images.length > 0) {
    images.forEach(img => {
      if (img.image_url && img.image_url.trim() !== '') {
        photos.push(img.image_url.startsWith('http') ? img.image_url : `${API_BASE_URL}${img.image_url}`);
      }
    });
  }

  if (photos.length === 0) photos.push(defaultimg); 

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const displayImageSrc = photos[currentImageIndex];

  return (
    <div className="car-details-image-container1">
      {isImageLoading && (
        <div className="spinner-container1">
          <div className="spinner1"></div>
        </div>
      )}

      <img
        src={displayImageSrc}
        alt={`${carBrand ?? 'Car'} ${carModel ?? 'Details'} - Image ${currentImageIndex + 1}`}
        className={`car-details-image1 ${isImageLoading ? 'hidden' : 'visible'}`}
        onLoad={() => setIsImageLoading(false)}
        onError={() => setIsImageLoading(false)}
      />

      {photos.length > 1 ? (
        <>
          <button onClick={prevImage} className="image-nav-btn1 image-nav-prev1">←</button>
          <button onClick={nextImage} className="image-nav-btn1 image-nav-next1">→</button>

          <div className="image-indicators1">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`image-indicator1 ${index === currentImageIndex ? 'active' : ''}`}
              />
            ))}
          </div>
        </>
      ) : null}

      <div className="photo-count1">
        📷 {photos.length}
      </div>
    </div>
  );
};

export default CarImageGallery;
