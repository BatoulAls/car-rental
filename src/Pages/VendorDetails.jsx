import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import '../styles/VendorDetails.css';
import defaultVendorImage from '../images/Vendor/default-vendorImg.jpg';

import VendorImageGallery from '../components/VendorImageGallery';
import VendorMainInfo from '../components/VendorMainInfo';
import ContactSidebar from '../components/ContactSidebar';

const fetchVendorDetails = async (vendorId) => {
  if (!vendorId) throw new Error('Vendor ID is required');
  const response = await fetch(`http://localhost:5050/api/vendors/${vendorId}`);
  if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
  return response.json();
};

const VendorDetails = () => {
  const { vendorId } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: vendor, isLoading, error } = useQuery({
    queryKey: ['vendorDetails', vendorId],
    queryFn: () => fetchVendorDetails(vendorId),
    enabled: !!vendorId,
  });

  if (isLoading) return <p>Loading vendor details...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!vendor) return <p>No vendor data found.</p>;

  const photo = vendor.photo || defaultVendorImage;

  return (
    <div className="vendor-details-container">
      <div className="details-header"></div>
      <div className="details-content">
        <VendorImageGallery photo={photo} name={vendor.name} />
        <div className="vendor-details-info">
          <VendorMainInfo
            name={vendor.name}
            open_24_7={vendor.open_24_7}
            shop_open_time={vendor.shop_open_time}
            shop_close_time={vendor.shop_close_time}
            verified={vendor.verified}
            description={vendor.description}
          />
          <ContactSidebar
            phone={vendor.phone}
            email={vendor.email}
            region={vendor.region}
            shop_open_time={vendor.shop_open_time}
            shop_close_time={vendor.shop_close_time}
          />
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;
