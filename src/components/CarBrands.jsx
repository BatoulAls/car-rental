import React from 'react';
import "../styles/CarBrands.css";
import { Link } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";

const fetchVendors = async () => {
  const res = await fetch("http://localhost:5050/api/home");
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  return data;
};

const CarBrands = () => {
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["vendors"],
    queryFn: fetchVendors,
  });

  if (isLoading) return <p>Loading cars...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Combine all cars from the response
  const allCars = [
    ...(data?.affordable_cars || []),
    ...(data?.luxury_cars || []),
    ...(data?.recent_cars || []),
  ];

  // Extract unique vendors by id
  const uniqueVendorsMap = new Map();
  allCars.forEach(car => {
    if (car.Vendor && !uniqueVendorsMap.has(car.Vendor.id)) {
      uniqueVendorsMap.set(car.Vendor.id, car.Vendor);
    }
  });
  const uniqueVendors = Array.from(uniqueVendorsMap.values());

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
          {uniqueVendors.slice(0, 10).map(vendor => (
            <div className="brand-logo-wrapper" key={vendor.id}>
              {vendor.photo ? (
                <img
                  src={vendor.photo}
                  alt={`${vendor.name} logo`}
                  className="brand-logo"
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
              ) : (
                <p className="brand-no-logo">No Logo</p>
              )}
              <p className="brand-name">{vendor.name}</p>
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
