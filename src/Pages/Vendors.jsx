import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Star, MapPin, Phone, Mail } from 'lucide-react';
import '../styles/Vendors.css';
import defaultVendor from '../images/Vendor/default-vendorImg.jpg'
import Pagination from '../components/Pagination' 

const Vendors = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const vendorsPerPage = 10;

 
  const { data, isLoading, isError } = useQuery({
    queryKey: ['vendors', currentPage],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5050/api/vendors?page=${currentPage}&limit=${vendorsPerPage}`);
      return res.data;
    },
    keepPreviousData: true,
  });

  if (isLoading) return <div className="vendors-container">Loading vendors...</div>;
  if (isError) return <div className="vendors-container">Error loading vendors.</div>;

  const vendors = Array.isArray(data) ? data : data?.vendors || [];
  const totalVendors = data?.total || vendors.length; 
  const totalPages = Math.ceil(totalVendors / vendorsPerPage);


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderStars = (rating = 0) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" style={{ opacity: 0.5 }} />);
    }

    return stars;
  };

  return (
    <div className="vendors-container">
      <div className="vendors-header">
        <h1 className="vendors-title">Our Vendors</h1>
        <p className="vendors-subtitle">Discover trusted partners for your business needs</p>
      </div>

      <div className="vendors-grid">
        {vendors.length === 0 ? (
          <p>No vendors found.</p>
        ) : (
          vendors.map((vendor) => (
            <div key={vendor._id || vendor.id} className="vendor-card">
              <img
                src={vendor.photo || defaultVendor}
                alt={vendor.name}
                className="vendor-image"
              />
              <div className="vendor-info">
                <div className="vendor-header">
                  <h3 className="vendor-name">{vendor.name}</h3>
                  <div className="category-tag">
                    {vendor.open_24_7 ? (
                      <span className="open-always">🕒 Open 24/7</span>
                    ) : (
                      <span>
                        🕒 {vendor.shop_open_time || 'N/A'} - {vendor.shop_close_time || 'N/A'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="verified-status">
                  {vendor.verified ? (
                    <span className="verified-badge">✅ Verified</span>
                  ) : (
                    <span className="not-verified">❌ Not Verified</span>
                  )}
                </div>
                <div className="contact-info">
                  <div className="contact-item"><MapPin /><span>{vendor.Region?.name_en || 'N/A'}</span></div>
                  <div className="contact-item"><Phone /><span>{vendor.phone || 'N/A'}</span></div>
                  <div className="contact-item"><Mail /><span>{vendor.User?.email || 'N/A'}</span></div>
                </div>
                <button className="details-button">View Details</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="pagination-wrapper">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages} 
          onPageChange={handlePageChange} 
        />
      </div>
    </div>
  );
};

export default Vendors;