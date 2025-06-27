
import React from 'react';

const VendorImageGallery = ({ photo, name }) => {
  return (
    <div className="image-gallery">
      <div className="main-image">
        <img
          src={photo}
          alt={name || "Vendor Image"}
          className="gallery-main-img"
        />
      </div>
    </div>
  );
};

export default VendorImageGallery;
