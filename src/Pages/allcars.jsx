import { useState, useEffect } from "react";
import { CAR_DATA } from "../components/CarData";
import CarCard from "../components/CarCard";
import AdvancedSearch from "../components/AdvancedSearch";
import Pagination from "../components/Pagination";
import "../styles/AllCar.css";
import "../styles/CarCard.css"

function AllCars() {
  const [carLoading, setCarLoading] = useState({});
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [searchParams, setSearchParams] = useState({
    make: "",
    Location:"",
    minPrice: "",
    maxPrice: "",
    transmission: "",
    fuelType: "",
    color: "",
    year: "",
    seats:"",
    review:"",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showSearch, setShowSearch] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sortBy, setSortBy] = useState("");

 

  const carsPerPage = 4;

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
      Location:"",
      minPrice: "",
      maxPrice: "",
      transmission: "",
      fuelType: "",
      color: "",
      year: "",
      seats:"",
      review:"",
    });
    setCurrentPage(1);
  };

  const filterCars = () => {
    return CAR_DATA.flat().filter((car) => {
      const matchMake = !searchParams.make || (car.make && car.make.toLowerCase().includes(searchParams.make.toLowerCase()));
      const matchLocation = !searchParams.Location || (car.Location && car.Location.toLowerCase().includes(searchParams.Location.toLowerCase()));

      const matchMinPrice = !searchParams.minPrice || car.price >= parseFloat(searchParams.minPrice);
      const matchMaxPrice = !searchParams.maxPrice || car.price <= parseFloat(searchParams.maxPrice);
      const matchTransmission = !searchParams.transmission || car.transmission === searchParams.transmission;
      const matchFuelType = !searchParams.fuelType || car.fuelType === searchParams.fuelType;
      const matchColor = !searchParams.color || car.color === searchParams.color;
      const matchYear = !searchParams.year || car.year === parseInt(searchParams.year);
      const matchseats = !searchParams.seats || car.seats === parseInt(searchParams.seats);
      const matchreview = !searchParams.review || car.review === parseInt(searchParams.review);
      
      

      return matchMake && matchLocation  && matchMinPrice && matchMaxPrice &&
        matchTransmission && matchFuelType && matchColor && matchYear&&matchseats && matchreview;
    });
  };

  let filteredCars = filterCars();


  if (sortBy === "priceLowToHigh") {
    filteredCars.sort((a, b) => a.price - b.price);
  } else if (sortBy === "priceHighToLow") {
    filteredCars.sort((a, b) => b.price - a.price);
  } else if (sortBy === "yearNewest") {
    filteredCars.sort((a, b) => b.year - a.year);
  } else if (sortBy === "yearOldest") {
    filteredCars.sort((a, b) => a.year - b.year);
  }

  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const preloadImages = () => {
      CAR_DATA.flat().slice(0, 6).forEach((car) => {
        const img = new Image();
        img.src = car.img;
      });
    };
    preloadImages();
  }, []);

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

  return (
    <section className="pickcar1-section">
      <div className="pickcar1-container">
        <div className="text-center">
          <h3 className="pickcar1-subtitle">Premium Selection</h3>
          <h2 className="pickcar1-title">Explore Our Cars</h2>
          <p className="pickcar1-description">
            Discover our handpicked collection of premium Cars, combining
            luxury, performance, and reliability for your next adventure.
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

export default AllCars;
