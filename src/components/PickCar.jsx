import { useState, useMemo, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CarCard from "./CarCard";
import { useAuth } from "../context/AuthContext";
import "../styles/PickCar.css";

const API_BASE_URL = "http://localhost:5050/api";

const fetchCarsByType = async (type) => {
  const res = await fetch(`${API_BASE_URL}/home`);
  if (!res.ok) throw new Error("Failed to fetch cars");
  const data = await res.json();

  switch (type) {
    case "affordable":
      return { cars: data.affordable_cars || [] };
    case "luxury":
      return { cars: data.luxury_cars || [] };
    case "recent":
      return { cars: data.recent_cars || [] };
    default:
      return { cars: [] };
  }
};

const fetchFavoriteCars = async (token) => {
  if (!token) return [];
  try {
    const res = await axios.get(`${API_BASE_URL}/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
};

function PickCar() {
  const [carLoading, setCarLoading] = useState({});
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data = { cars: [] }, isLoading, error } = useQuery({
    queryKey: ["cars", "recent"],
    queryFn: () => fetchCarsByType("recent"),
  });

  const { data: favoriteCarsData = [], isLoading: favoritesLoading, error: favoritesError } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => fetchFavoriteCars(token),
    enabled: !!token,
  });

  const cars = useMemo(() => {
    if (!data || !data.cars.length) return [];
    const favoritedCarIds = new Set(favoriteCarsData.map((favCar) => favCar.id));
    return data.cars.map((car) => ({
      ...car,
      isFavorite: favoritedCarIds.has(car.id),
      favoriteId: favoritedCarIds.has(car.id) ? car.id : null,
    }));
  }, [data, favoriteCarsData]);

  const handleImageLoad = useCallback((carId) => {
    setCarLoading((prev) => ({ ...prev, [carId]: false }));
  }, []);

  const onNavigateToDetails = useCallback(
    (carId) => navigate(`/car-details/${carId}`),
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
        } else {
          await axios.post(
            `${API_BASE_URL}/favorites`,
            { car_id: car.id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
        }
      } catch (error) {
        console.error("Failed to toggle favorite:", error);
        alert("An error occurred while updating favorites. Please try again.");
      } finally {
        queryClient.invalidateQueries(["cars", "recent"]);
        queryClient.invalidateQueries(["favorites"]);
      }
    },
    [token, queryClient]
  );

  if (isLoading || favoritesLoading) return <p>Loading cars...</p>;
  if (error) return <p>Error loading cars: {error.message}</p>;
  if (favoritesError) return <p>Error loading favorites: {favoritesError.message}</p>;

  return (
    <section className="pickcar-section">
      <div className="pickcar-container">
        <div className="text-center">
          <h3 className="pickcar-subtitle">Premium Selection</h3>
          <h2 className="pickcar-title">Explore Our Cars</h2>
          <p className="pickcar-description">
            Discover our handpicked collection of premium Cars, combining luxury,
            performance, and reliability for your next adventure.
          </p>
        </div>

        <div className="car-row" style={cars.length < 4 ? { justifyContent: "left" } : {}}>
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
                  onNavigateToDetails={() => onNavigateToDetails(carId)}
                  average_rating={rating}
                  isFavorite={car.isFavorite}
                  onToggleFavorite={() => handleToggleFavorite(car)}
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
