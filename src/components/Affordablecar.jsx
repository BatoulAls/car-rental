import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CarCard from "./CarCard";
import { useAuth } from "../context/AuthContext";
import "../styles/PickCar.css";

const API_BASE_URL = "http://localhost:5050/api";


const fetchCarsByType = async (type) => {
  const res = await axios.get(`${API_BASE_URL}/home`);
  let cars = [];
  if (type === "affordable") cars = res.data.affordable_cars || [];
  if (type === "luxury") cars = res.data.luxury_cars || [];
  if (type === "recent") cars = res.data.recent_cars || [];
  return { cars };
};


const fetchFavoriteCars = async (token) => {
  if (!token) return [];
  try {
    const res = await axios.get(`${API_BASE_URL}/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (process.env.NODE_ENV === "development") {
      console.debug("Fetched favorites:", res.data);
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
};

function Affordablecar() {
  const [cars, setCars] = useState([]);
  const [carLoading, setCarLoading] = useState({});
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: allCarsData = { cars: [] },
    isLoading: allCarsLoading,
    error: allCarsError,
  } = useQuery({
    queryKey: ["cars", "affordable"],
    queryFn: () => fetchCarsByType("affordable"),
  });

  const {
    data: favoriteCarsData = [],
    isLoading: favoritesLoading,
    error: favoritesError,
  } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => fetchFavoriteCars(token),
    enabled: !!token,
  });

  useEffect(() => {
    if (allCarsData.cars.length === 0) return;

    const favoritedCarIds = new Set(favoriteCarsData.map((favCar) => favCar.id));
    const updatedCars = allCarsData.cars.map((car) => ({
      ...car,
      isFavorite: favoritedCarIds.has(car.id),
      favoriteId: favoritedCarIds.has(car.id) ? car.id : null,
    }));

    setCars(updatedCars);


    updatedCars.slice(0, 6).forEach((car) => {
      if (car.photo) {
        const img = new Image();
        img.src = car.photo;
      }
    });

    if (process.env.NODE_ENV === "development") {
      console.debug("Updated cars with favorites:", updatedCars);
    }
  }, [allCarsData.cars, favoriteCarsData]);

  const handleImageLoad = useCallback((carId) => {
    setCarLoading((prev) => ({ ...prev, [carId]: false }));
  }, []);

  const onNavigateToDetails = useCallback(
    (carId) => {
      navigate(`/car-details/${carId}`);
    },
    [navigate]
  );

  const handleToggleFavorite = useCallback(
    async (car) => {
      if (!token) {
        alert("Please log in to manage favorites.");
        return;
      }

      try {
        if (car.isFavorite) {
          await axios.delete(`${API_BASE_URL}/favorites/${car.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (process.env.NODE_ENV === "development") {
            console.debug(`Removed favorite for car ID: ${car.id}`);
          }
        } else {
          const response = await axios.post(
            `${API_BASE_URL}/favorites`,
            { car_id: car.id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (process.env.NODE_ENV === "development") {
            console.debug("Added favorite response:", response.data);
          }
        }
      } catch (error) {
        console.error("Failed to toggle favorite:", error);
        alert("An error occurred while updating favorites. Please try again.");
      } finally {
        queryClient.invalidateQueries(["cars", "affordable"]);
        queryClient.invalidateQueries(["favorites"]);
      }
    },
    [token, queryClient]
  );

  if (allCarsLoading || favoritesLoading) return <p>Loading the cars...</p>;
  if (allCarsError) return <p>Error loading cars: {allCarsError.message}</p>;
  if (favoritesError) return <p>Error loading favorites: {favoritesError.message}</p>;

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

        <div
          className="car-row"
          style={cars.length < 4 ? { justifyContent: "left" } : {}}
        >
          {cars.slice(0, 4).map((car, index) => {
            const carId = car.id;
            const isHovered = hoveredIndex === index;
            const isImgLoading = carLoading[carId] !== false;
            const rating = car.average_rating || 0;

            return (
              <div className="car-column" key={carId}>
                <CarCard
                  car={car}
                  carId={carId}
                  cardIndex={index}
                  isHovered={isHovered}
                  isLoading={isImgLoading}
                  onHoverEnter={() => setHoveredIndex(index)}
                  onHoverLeave={() => setHoveredIndex(null)}
                  onImageLoad={() => handleImageLoad(carId)}
                  average_rating={rating}
                  onNavigateToDetails={() => onNavigateToDetails(carId)}
                  isFavorite={car.isFavorite}
                  onToggleFavorite={() => handleToggleFavorite(car)}
                />
              </div>
            );
          })}
        </div>

        <div className="view-all-wrapper">
          <Link
            to="/all-cars"
            state={{ carType: "affordable", maxPrice: 500 }}
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
