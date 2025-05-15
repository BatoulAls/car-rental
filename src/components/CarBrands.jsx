import React from 'react';
import "../styles/CarBrands.css";
import { Link } from 'react-router-dom';

// Import brand logos
import BMWLogo from "../images/brands/bmw-7.svg";
import AudiLogo from "../images/brands/audi-11.svg";
import MercedesLogo from "../images/brands/mercedes-benz-1.svg";
import ToyotaLogo from "../images/brands/toyota-1.svg";
import HondaLogo from "../images/brands/honda-11.svg";
import TeslaLogo from "../images/brands/tesla-motors.svg";
import JeepLogo from "../images/brands/jeep-7.svg";
import NissanLogo from "../images/brands/nissan-6.svg";
import KiaLogo from "../images/brands/kia.svg";
import FordLogo from '../images/brands/ford-8.svg'

/**
 * CarBrands Component
 * Compact display of trusted car brands with their logos
 */
const CarBrands = () => {
  // Complete brand data including all imported logos
  const brands = [
    { id: 1, name: "BMW", logo: BMWLogo },
    { id: 2, name: "Audi", logo: AudiLogo },
    { id: 3, name: "Mercedes", logo: MercedesLogo },
    { id: 4, name: "Toyota", logo: ToyotaLogo },
    { id: 5, name: "Honda", logo: HondaLogo },
    { id: 6, name: "Tesla", logo: TeslaLogo },
    { id: 7, name: "Jeep", logo: JeepLogo },
    { id: 8, name: "Nissan", logo: NissanLogo },
    { id: 9, name: "Kia", logo: KiaLogo },
    {id:10, name:"Ford", logo:FordLogo},
  ];
  
  // Show only the first 6 brands in the compact view
  const displayedBrands = brands.slice(0, 10);
  
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
  {displayedBrands.map((brand) => (
    <div className="brand-logo-wrapper" key={brand.id}>
      <img 
        src={brand.logo} 
        alt={`${brand.name} logo`} 
        className="brand-logo"
      />
      <p className="brand-name">{brand.name}</p> {/* Brand name added here */}
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