import { useState, useEffect } from "react";
import { CAR_DATA } from "./CarData";
import { Link } from "react-router-dom";
import CarCard from "./CarCard";
import "../styles/PickCar.css";

function Affordablecar() {
  const [carLoading, setCarLoading] = useState({});
  const [activeTab] = useState(0); 
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const displayedCarsData = CAR_DATA.flat().slice(0, 4); 

  const handleImageLoad = (carId) => {
    setCarLoading(prev => ({
      ...prev,
      [carId]: false
    }));
  };

  useEffect(() => {
    CAR_DATA.flat().slice(0, 6).forEach(car => {
      const img = new Image();
      img.src = car.img;
    });
  }, []);

  return (
    <section className="pickcar-section">
      <div className="pickcar-container">
        <div className="text-center">
          <h3 className="pickcar-subtitle">Affordable Cars Rental Syria</h3>
          <h2 className="pickcar-title">Explore Our Affordable Cars</h2>
          <p className="pickcar-description">
          Enjoy budget-friendly car rentals starting from  50/day with seasonal discounts from some of the best car rental Syria companies..
          </p>
        </div>

        <div className="car-row">
          {displayedCarsData.map((car, index) => {
            const carId = `car-${index}`;
            const isHovered = hoveredIndex === index;
            const isLoading = carLoading[carId] !== false;
            
            return (
              <div className="car-column" key={carId}>
                <CarCard
                  car={car}
                  carId={carId}
                  isHovered={isHovered}
                  isLoading={isLoading}
                  onHoverEnter={() => setHoveredIndex(index)}
                  onHoverLeave={() => setHoveredIndex(null)}
                  onImageLoad={() => handleImageLoad(carId)}
                />
              </div>
            );
          })}
        </div>

       
      </div>
    </section>
  );
}

export default Affordablecar;
