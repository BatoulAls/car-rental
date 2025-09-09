import { useState, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import CarCard from "./CarCard";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
    console.error("Error fetching favorite cars:", error);
    return [];
  }
};

function Luxurycars() {
  const [carLoading, setCarLoading] = useState({});
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data = { cars: [] }, isLoading, error } = useQuery({
    queryKey: ["cars", "luxury"],
    queryFn: () => fetchCarsByType("luxury"),
  });

  const { data: favoriteCarsData = [], isLoading: favoritesLoading, error: favoritesError } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => fetchFavoriteCars(token),
    enabled: !!token,
  });

  const cars = useMemo(() => {
    if (!data || !data.cars.length) return [];

    const favoritedCarIds = new Set(favoriteCarsData.map((fav) => fav.id));
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
        alert("You must be logged in to manage favorites.");
        return;
      }

      try {
        if (car.isFavorite) {
          await axios.delete(`${API_BASE_URL}/favorites/${car.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          queryClient.invalidateQueries(["cars", "luxury"]);
          queryClient.invalidateQueries(["favorites"]);
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
          const newFavoriteId = response.data.favorite_id;

          queryClient.setQueryData(["cars", "luxury"], (oldData) => {
            if (!oldData) return oldData;
            return {
              cars: oldData.cars.map((c) =>
                c.id === car.id
                  ? { ...c, isFavorite: true, favoriteId: newFavoriteId || car.id }
                  : c
              ),
            };
          });
          queryClient.invalidateQueries(["favorites"]);
        }
      } catch (error) {
        console.error("Failed to toggle favorite status:", error);
        alert("An error occurred while updating favorites. Please try again.");
      }
    },
    [token, queryClient]
  );

  if (isLoading || favoritesLoading) return <p>Loading cars...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (favoritesError) return <p>Error loading favorites.</p>;

  return (
    <section className="pickcar-section">
      <div className="pickcar-container">
        <div className="text-center">
          <h3 className="pickcar-subtitle">Luxury Cars</h3>
          <h2 className="pickcar-title">Explore Our Luxury Cars</h2>
          <p className="pickcar-description">
            Drive in style! Make your first car rental experience great with
            luxury car rentals from top brands like Rolls Royce, Mercedes-Benz,
            Lamborghini, and more.
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
            state={{ carType: "luxury", minPrice: 500 }}
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
