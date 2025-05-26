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

          {brandsToDisplay.slice(0, 10).map(brandName => (
            <div className="brand-logo-wrapper" key={brandName}>


              <p className="brand-no-logo">{brandName}</p>
              <p className="brand-name">{brandName}</p>
            </div>
          ))}
        </div>

        <div className="brands-action">
          <Link to="/all-brands" className="brands-button">View All Brands</Link>
        </div>
      </div>
    </section>
  );
};

export default CarBrands;