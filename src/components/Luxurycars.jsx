import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CarCard from "./CarCard";
import { useQuery } from "@tanstack/react-query";
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

function Luxurycars() {
  const [carLoading, setCarLoading] = useState({});
  const [hoveredIndex, setHoveredIndex] = useState(null);


  const {
    data = { cars: [] },
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cars", "luxury"],
    queryFn: () => fetchCarsByType("luxury"),
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
  if (error) return <p>Error: {error.message}</p>;

  return (
    <section className="pickcar-section">
      <div className="pickcar-container">
        <div className="text-center">
          <h3 className="pickcar-subtitle">Luxury Cars</h3>
          <h2 className="pickcar-title">Explore Our Luxury Cars</h2>
          <p className="pickcar-description">
            Drive in style! Make your first car rental experience great with luxury car rentals
            from top brands like Rolls Royce, Mercedes-Benz, Lamborghini, and more.
          </p>
        </div>

       <div className="car-row" style={(carsData?.length || 0) < 4 ? { justifyContent: "left" } : {}}>

          {carsData.slice(0, 4).map((car, index) => {
            const carUniqueId = car.id; 
            const isHovered = hoveredIndex === index;
            const isImgLoading = carLoading[carUniqueId] !== false; 
            const rating = car.average_rating || 0

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
                  average_rating={rating}
                  onNavigateToDetails={() => onNavigateToDetails(carUniqueId)} 
                />
              </div>
            );
          })}
        </div>

        <div className="view-all-wrapper">
          <Link
            to="/all-cars"
            state={{ carType: "luxury",minPrice: 500 }}
            className="view-all-button"
          >
            View All Luxury Cars
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Luxurycars;