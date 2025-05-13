import { useState, useEffect } from "react";
import { CAR_DATA } from "./CarData";
import { Link } from "react-router-dom";
import CarCard from "./CarCard";
import "../styles/PickCar.css";

function PickCar() {
  const [carLoading, setCarLoading] = useState({});
  const [activeTab] = useState(0); // Fixed, not changing in current version
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const displayedCarsData = CAR_DATA.flat().slice(0, 4); // Only shows first 3 cars

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
          <h3 className="pickcar-subtitle">Premium Selection</h3>
          <h2 className="pickcar-title">Explore Our Luxury Fleet</h2>
          <p className="pickcar-description">
            Discover our handpicked collection of premium vehicles, combining luxury, performance,
            and reliability for your next adventure.
          </p>
        </div>

        <div className="car-grid">
          {displayedCarsData.map((car, index) => {
            const carId = `car-${index}`;
            const isHovered = hoveredIndex === index;
            const isLoading = carLoading[carId] !== false;

            return (
              <CarCard
                key={carId}
                car={car}
                carId={carId}
                isHovered={isHovered}
                isLoading={isLoading}
                onHoverEnter={() => setHoveredIndex(index)}
                onHoverLeave={() => setHoveredIndex(null)}
                onImageLoad={() => handleImageLoad(carId)}
              />
            );
          })}
        </div>

        <div className="view-all-wrapper">
          <Link to="/all-cars" className="view-all-button">View All Cars</Link>
        </div>
      </div>
    </section>
  );
}

export default PickCar;
