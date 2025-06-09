import React from 'react';
import "../styles/CarBrands.css"; 

import { Link } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";


const fetchHomeData = async () => {
  const res = await fetch("http://localhost:5050/api/home");
  if (!res.ok) throw new Error("Failed to fetch home data");
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

const CarBrands = () => {
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["homePageData"],
    queryFn: fetchHomeData,
  });

  if (isLoading) return <p>Loading car brands...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const allCars = [
    ...(data?.affordable_cars || []),
    ...(data?.luxury_cars || []),
    ...(data?.recent_cars || []),
  ];

  const uniqueBrandsSet = new Set();
  allCars.forEach(car => {
    if (car.brand) {
      uniqueBrandsSet.add(car.brand);
    }
  });

  const brandsToDisplay = Array.from(uniqueBrandsSet).sort();

  return (
    <section className="brands-section">
      <div className="text-center">
        <h3 className="pickcar-subtitle">Drive in Style and Luxury</h3>
        <h2 className="pickcar-title">All Brands</h2>
        <p className="pickcar-description">
          Experience the thrill of the road with our premium car rentals, featuring top-tier brands like BMW, Audi, Porsche, Ferrari, and more — where luxury meets performance.
        </p>
      </div>

      <div className="brands-container">
        <div className="brands-logos">
          {brandsToDisplay.slice(0, 10).map(brandName => {
            const logoSrc = brandLogos[brandName.toLowerCase()];
            return (
              <Link to={`/cars?brand=${brandName.toLowerCase()}`} key={brandName} className="brand-logo-link">
                <div className="brand-logo-wrapper">
                  {logoSrc ? (
                    <img src={logoSrc} alt={`${brandName} Logo`} className="brand-logo" />
                  ) : (
                   
                    <div className="brand-card-no-logo">
                          <span className="brand-initial">{brandName.charAt(0)}</span>
                        </div>
                  )}
                  <p className="brand-name">{brandName}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="brands-action">
          <Link to="/all-brands" className="brands-button">View All Brands</Link>
        </div>
      </div>
    </section>
  );
};

export default CarBrands;