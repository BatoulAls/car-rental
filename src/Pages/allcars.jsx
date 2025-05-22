import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import CarCard from "../components/CarCard";
import AdvancedSearch from "../components/AdvancedSearch";
import Pagination from "../components/Pagination";
import "../styles/AllCar.css";
import "../styles/CarCard.css";

const fetchCars = async (page, limit) => {
  let url = `http://localhost:5050/api/cars?page=${page}&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load the cars");
  const data = await res.json();
  return data;
};

function AllCars() {
  const location = useLocation();


  const searchedResultData = location.state?.resultData || null;

  const [carLoading, setCarLoading] = useState({});
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [searchParams, setSearchParams] = useState({
    make: "",
    Location: "",
    minPrice: "",
    maxPrice: "",
    transmission: "",
    fuelType: "",
    color: "",
    year: "",
    seats: "",
    review: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showSearch, setShowSearch] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sortBy, setSortBy] = useState("");
  const carsPerPage = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ["cars", currentPage],
    queryFn: () => fetchCars(currentPage, carsPerPage),
    keepPreviousData: true,
    enabled: !searchedResultData,
  });

  const handleImageLoad = (carId) => {
    setCarLoading((prev) => ({
      ...prev,
      [carId]: false,
    }));
  };

  const handleSearchParamChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  const handleResetSearch = () => {
    setSearchParams({
      make: "",
      Location: "",
      minPrice: "",
      maxPrice: "",
      transmission: "",
      fuelType: "",
      color: "",
      year: "",
      seats: "",
      review: "",
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth > 768) {
      setShowSearch(true);
    }
  }, [windowWidth]);


  const fetchedCars = searchedResultData ? searchedResultData.data : data?.data || [];
  const totalPages = searchedResultData ? searchedResultData.totalPages : data?.totalPages || 1;

  return (
    <section className="pickcar1-section">
      <div className="pickcar1-container">
        <div className="text-center">
          <h3 className="pickcar1-subtitle">Premium Selection</h3>
          <h2 className="pickcar1-title">Explore Our Cars</h2>
          <p className="pickcar1-description">
            {searchedResultData
              ? "The search results were displayed according to the information you provided."
              : "Explore our curated collection of new luxury cars."}
          </p>
        </div>

        <div className="sort-by-container">
          <label htmlFor="sortBy" className="sort-label">Sort by:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="">Default</option>
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="priceHighToLow">Price: High to Low</option>
            <option value="yearNewest">Year: Newest First</option>
            <option value="yearOldest">Year: Oldest First</option>
          </select>
        </div>

        {windowWidth <= 768 && (
          <div className="toggle-search-container">
            <button
              className="toggle-search-btn"
              onClick={() => setShowSearch((prev) => !prev)}
            >
              {showSearch ? "Hide Filters" : "Show Filters"}
            </button>
          </div>
        )}

        <div className="car-search-container">
          {showSearch && (
            <div className="advanced-search">
              <AdvancedSearch
                searchParams={searchParams}
                onSearchChange={handleSearchParamChange}
                onReset={handleResetSearch}
              />
            </div>
          )}

          <div className="car1-grid">
            {fetchedCars.map((car, index) => {
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
        </div>

        {!searchedResultData && (
          <div className="pagination-wrapper">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default AllCars;
