import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import CarCard from "./CarCard";
import "../styles/PickCar.css";
import { useNavigate } from "react-router-dom";


const fetchCarsByType = async (type) => {
  const res = await fetch("http://localhost:5050/api/home");
     if (!res.ok) throw new Error("Failed to fetch");
     const data = await res.json();

     let cars = [];
     if (type === "affordable") cars = data.affordable_cars || [];
     if (type === "luxury") cars = data.luxury_cars || [];
     if (type === "recent") cars = data.recent_cars || [];

     return { cars };
};

function PickCar() {
  const [carLoading, setCarLoading] = useState({});
  const [hoveredIndex, setHoveredIndex] = useState(null);


  const {
   data = { cars: [] },
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cars", "recent"],
    queryFn: () => fetchCarsByType("recent"),
  });
   const carsData = data.cars || [];
     

  useEffect(() => {
    carsData.slice(0, 6).forEach((car) => {
      const img = new Image();
      img.src = car.photo || "";
    });
  }, [carsData]);

  const handleImageLoad = (carId) => {
    setCarLoading((prev) => ({
      ...prev,
      [carId]: false,
    }));
  };
 const navigate = useNavigate();
  const onNavigateToDetails = (carId) => {
    navigate(`/car-details/${carId}`); 
  }
   


  if (isLoading) return <p>Loading cars...</p>;
  if (error)     return <p>Error: {error.message}</p>;

  return (
    <section className="pickcar-section">
      <div className="pickcar-container">
        <div className="text-center">
          <h3 className="pickcar-subtitle">Premium Selection</h3>
          <h2 className="pickcar-title">Explore Our Cars</h2>
          <p className="pickcar-description">
            Discover our handpicked collection of premium Cars, combining luxury, performance,
            and reliability for your next adventure.
          </p>
        </div>


         <div className="car-row" style={(carsData?.length || 0) < 4 ? { justifyContent: "left" } : {}}>
          {carsData.slice(0, 4).map((car, index) => {
            const carUniqueId = car.id; 
            const isHovered = hoveredIndex === index;
            const isImgLoading = carLoading[carUniqueId] !== false;
             const rating =car.average_rating || 0;

            return (
              <div className="car-column" key={carUniqueId}>
                <CarCard
                  car={car}
                  carId={carUniqueId}
                  cardIndex={index} 
                  isHovered={isHovered}
                  isLoading={isImgLoading}
                  onHoverEnter={() => setHoveredIndex(index)}
                  onHoverLeave={() => setHoveredIndex(null)}
                  onImageLoad={() => handleImageLoad(carUniqueId)}
                  onNavigateToDetails={() => onNavigateToDetails(carUniqueId)} 
                  average_rating={rating}
                  
                />
              </div>
            );
          })}
        </div>

        <div className="view-all-wrapper">
          <Link to="/all-cars" className="view-all-button">
            View All Cars
          </Link>
        </div>
      </div>
    </section>
  );
}

export default PickCar;
