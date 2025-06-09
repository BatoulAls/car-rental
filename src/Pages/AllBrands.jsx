import React, { useState, useEffect } from 'react';
import "../styles/Brand.css";
import { Link } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import Pagination from '../components/Pagination';

const fetchBrandsData = async (page, limit) => {
  const res = await fetch(`http://localhost:5050/api/brands?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch brands data");
  const data = await res.json();
  return data;
};

const brandLogos = {};

const importAll = (r) => {
  r.keys().forEach((key) => {
    const brandName = key.replace('./', '').split('.')[0];
    brandLogos[brandName.toLowerCase()] = r(key);
  });
};

importAll(require.context('../images/brands', false, /\.(png|jpe?g|svg)$/));

const AllBrands = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  const {
    data,
    isLoading,
    error,
    refetch 
  } = useQuery({
    queryKey: ["brandsData", currentPage], 
    queryFn: () => fetchBrandsData(currentPage, itemsPerPage), 
  });


  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  if (isLoading) return (
    <div className="all-brands-page">
      <div className="loading-container">
        <p>Loading all car brands...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="all-brands-page">
      <div className="error-container">
        <p>Error: {error.message}</p>
      </div>
    </div>
  );

  const brandsToDisplay = data?.brands || [];
  const totalBrands = data?.total || 0;
  const currentTotalPages = Math.ceil(totalBrands / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="all-brands-page">
      <div className="page-container">
       
        <div className="page-header">
          
          
          <div className="header-content">
            <h3 className="page-subtitle">Explore Premium Automotive</h3>
            <h1 className="page-title">All Car Brands</h1>
            <p className="page-description">
              Discover our complete collection of luxury and premium car brands. From exotic supercars to elegant sedans, 
              find the perfect vehicle that matches your style and needs. Each brand represents excellence in automotive engineering and design.
            </p>
            <div className="stats-container">
              <div className="stat-item">
                <span className="stat-number">{totalBrands}</span>
                <span className="stat-label">Premium Brands</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100+</span>
                <span className="stat-label">Available Cars</span>
              </div>
            </div>
          </div>
        </div>

      
        <div className="brands-grid-section">
          <div className="section-header">
            <h2 className="section-title">Choose Your Preferred Brand</h2>
            <p className="section-description">
              Click on any brand to explore available vehicles and rental options
            </p>
          </div>

          <div className="brands-grid-container">
            <div className="brands-grid">
              {brandsToDisplay.map(brandName => {
                const logoSrc = brandLogos[brandName.toLowerCase()];
                
                return (
                  <div className="brand-card" key={brandName}>
                    <div className="brand-card-header">
                      {logoSrc ? (
                        <img 
                          src={logoSrc} 
                          alt={`${brandName} Logo`} 
                          className="brand-card-logo" 
                        />
                      ) : (
                        <div className="brand-card-no-logo">
                          <span className="brand-initial">{brandName.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="brand-card-content">
                      <h3 className="brand-card-name">{brandName}</h3>
                      <p className="brand-card-count">
                        Multiple Vehicles Available
                      </p>
                      
                      <div className="brand-card-actions">
                        <Link 
                          to={`/cars?brand=${brandName.toLowerCase()}`}
                          className="brand-card-button primary"
                        >
                          View Cars
                        </Link>
                        
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

       
        <div className="cta-section">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Experience Luxury?</h2>
            <p className="cta-description">
              Book your premium car rental today and drive in style. Our fleet of luxury vehicles 
              is maintained to the highest standards for your comfort and safety.
            </p>
            <div className="cta-actions">
              <Link to="/all-cars" className="cta-button primary">
                Browse All Cars
              </Link>
              <Link to="/contact" className="cta-button secondary">
                Get Support
              </Link>
            </div>
          </div>
        </div>
      </div>
        <div className="pagination-wrapper">
          <Pagination
            currentPage={currentPage}
            totalPages={currentTotalPages}
            onPageChange={handlePageChange}
          />
        </div>
    </div>
    
  );
};

export default AllBrands;