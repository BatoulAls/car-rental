import { useState, useEffect } from "react";
import { CAR_DATA } from "../components/CarData";
import CarCard from "../components/CarCard";
import AdvancedSearch from "../components/AdvancedSearch";
import Pagination from "../components/Pagination";
import "../styles/AllCar.css";

function AllCar() {
  const [carLoading, setCarLoading] = useState({});
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [searchParams, setSearchParams] = useState({
    model: "",
    minPrice: "",
    maxPrice: "",
    transmission: "",
    fuelType: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showSearch, setShowSearch] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const carsPerPage = 5;

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
      [name]: value
    }));
    setCurrentPage(1);
  };

  const filterCars = () => {
    return CAR_DATA.flat().filter((car) => {
      const matchMake = !searchParams.make || 
        car.make.toLowerCase().includes(searchParams.make.toLowerCase());
      const matchModel = !searchParams.model || 
        car.model.toLowerCase().includes(searchParams.model.toLowerCase());
      const matchMinPrice = !searchParams.minPrice || 
        car.price >= parseFloat(searchParams.minPrice);
      const matchMaxPrice = !searchParams.maxPrice || 
        car.price <= parseFloat(searchParams.maxPrice);
      const matchTransmission = !searchParams.transmission || 
        car.transmission === searchParams.transmission;
      const matchFuelType = !searchParams.fuelType || 
        car.fuelType === searchParams.fuelType;

      return matchMake && matchModel && matchMinPrice &&
             matchMaxPrice && matchTransmission && matchFuelType;
    });
  };

  const filteredCars = filterCars();

  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    CAR_DATA.flat().slice(0, 6).forEach((car) => {
      const img = new Image();
      img.src = car.img;
    });
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // This effect ensures search visibility is properly set when window size changes
  useEffect(() => {
    // Always show search on large screens
    if (windowWidth > 768) {
      setShowSearch(true);
    }
  }, [windowWidth]);

  return (
    <section className="pickcar1-section">
      <div className="pickcar1-container">
        <div className="text-center">
          <h3 className="pickcar1-subtitle">Premium Selection</h3>
          <h2 className="pickcar1-title">Explore Our Luxury Fleet</h2>
          <p className="pickcar1-description">
            Discover our handpicked collection of premium vehicles, combining
            luxury, performance, and reliability for your next adventure.
          </p>
        </div>

        {/* Only show toggle button on small screens */}
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
          <div className="car1-grid">
            {currentCars.map((car, index) => {
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

          {/* For large screens, always show. For small screens, add 'hidden' class when not showing */}
          <div className={`advanced-search ${windowWidth <= 768 && !showSearch ? 'hidden' : ''}`}>
            <AdvancedSearch
              searchParams={searchParams}
              onSearchParamChange={handleSearchParamChange}
            />
          </div>
        </div>

        <div className="pagination-wrapper">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredCars.length / carsPerPage)}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </section>
  );
}

export default AllCar;