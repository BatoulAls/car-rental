import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import CarCard from "./CarCard";
import "../styles/PickCar.css";

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

function Affordablecar() {
  const [carLoading, setCarLoading] = useState({});
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const {
      data = { cars: []},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cars", "affordable"],
    queryFn: () => fetchCarsByType("affordable"),
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

  

  if (isLoading) return <p>Loading the cars...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <section className="pickcar-section">
      <div className="pickcar-container">
        <div className="text-center">
          <h3 className="pickcar-subtitle">Affordable Cars Rental Syria</h3>
          <h2 className="pickcar-title">Explore Our Affordable Cars</h2>
          <p className="pickcar-description">
            Enjoy budget-friendly car rentals starting from $50/day with seasonal discounts from some of the best car rental Syria companies.
          </p>
        </div>

        <div className="car-row" style={(carsData?.length || 0) < 4 ? { justifyContent: "left" } : {}}>
          {carsData.slice(0, 4).map((car, index) => {
            const carId = `car-${index}`;
            const isHovered = hoveredIndex === index;
            const isImgLoading = carLoading[carId] !== false;
            
            const rating =  car.average_rating || 0

            return (
              <div className="car-column" key={carId}>
                <CarCard
                  car={car}
                  carId={carId}
                  isHovered={isHovered}
                  isLoading={isImgLoading}
                  onHoverEnter={() => setHoveredIndex(index)}
                  onHoverLeave={() => setHoveredIndex(null)}
                  onImageLoad={() => handleImageLoad(carId)}
                   average_rating={rating}
                />
              </div>
            );
          })}
        </div>

        <div className="view-all-wrapper">
          <Link
            to="/all-cars"
            state={{ carType: "affordable",maxPrice: 500 }}
            className="view-all-button"
          >
            View All Affordable Cars
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Affordablecar;