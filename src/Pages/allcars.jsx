import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import CarCard from "../components/CarCard";
import AdvancedSearch from "../components/AdvancedSearch";
import Pagination from "../components/Pagination";
import { useNavigate } from "react-router-dom";
import "../styles/AllCar.css";
import "../styles/CarCard.css";

const fetchAdvancedSearchOptions = async () => {
  const res = await fetch("http://localhost:5050/api/cars/options");
  if (!res.ok) throw new Error("Failed to load advanced search options");
  const data = await res.json();
  return data;
};

const fetchCarsWithFiltersAndSort = async (page, limit, searchParams, sortBy, searchOptions, carType) => {
  let url = `http://localhost:5050/api/cars?page=${page}&limit=${limit}`;

  const params = new URLSearchParams();
  const regions = searchOptions?.regions || [];

  if (carType) {
    if (carType === "affordable") {
      params.append("maxPrice", 500);
    } else if (carType === "luxury") {
      params.append("minPrice", 500);
    } else if (carType === "recent") {
      params.append("sort_by", "created_at");
      params.append("order", "desc");
    }
  }

  for (const key in searchParams) {
    if ((key === "maxPrice" && carType === "affordable") || (key === "minPrice" && carType === "luxury")) {
      continue;
    }

    if (searchParams[key] && searchParams[key] !== "") {
      switch (key) {
        case "make":
          params.append("brand", searchParams[key]);
          break;
        case "Location":
          const selectedRegionId = searchParams[key];
          const selectedRegion = regions.find(region => region.id === parseInt(selectedRegionId));
          if (selectedRegion) {
            params.append("location", selectedRegion.name_en);
          }
          break;
        case "minPrice":
          params.append("minPrice", searchParams[key]);
          break;
        case "maxPrice":
          params.append("maxPrice", searchParams[key]);
          break;
        case "fuelType":
          params.append("fuel_type", searchParams[key]);
          break;
        case "transmission":
          params.append("transmission", searchParams[key]);
          break;
        case "color":
          params.append("color", searchParams[key]);
          break;
        case "year":
          params.append("year", searchParams[key]);
          break;
        case "seats":
          params.append("seats", searchParams[key]);
          break;
        case "review":
          params.append("min_review", searchParams[key]);
          break;
        case "vendor":
          params.append("vendor_id", searchParams[key]);
          break;
        default:
          params.append(key, searchParams[key]);
          break;
      }
    }
  }

  if (sortBy) {
    if (!(carType === "recent" && sortBy === "created_at")) {
      switch (sortBy) {
        case "priceLowToHigh":
          params.append("sort_by", "price");
          params.append("order", "asc");
          break;
        case "priceHighToLow":
          params.append("sort_by", "price");
          params.append("order", "desc");
          break;
        case "yearNewest":
          params.append("sort_by", "year");
          params.append("order", "desc");
          break;
        case "yearOldest":
          params.append("sort_by", "year");
          params.append("order", "asc");
          break;
        default:
          break;
      }
    }
  }

  if (params.toString()) {
    url += `&${params.toString()}`;
  }

  console.log('URL:', url); 

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load cars with filters and sort");
  const data = await res.json();
  return data;
};

function AllCars() {
  const location = useLocation();
  const searchedResultData = location.state?.resultData || null;
  const SimpleSearchData = location.state?.searchFilters || {}
  const carType = location.state?.carType || null;

  const [carLoading, setCarLoading] = useState({});
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [searchParams, setSearchParams] = useState({
    make: SimpleSearchData.brand ||{},
    Location: SimpleSearchData.location ||{},
    minPrice: "",
    transmission: "",
    fuelType: "",
    color: "",
    year: "",
    seats: "",
    review: "",
    vendor: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showSearch, setShowSearch] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sortBy, setSortBy] = useState("");

  const [useAdvancedSearch, setUseAdvancedSearch] = useState(true); 

  const carsPerPage = 10;

  const {
    data: searchOptions,
    isLoading: loadingSearchOptions,
    error: searchOptionsError,
  } = useQuery({
    queryKey: ["advancedSearchOptions"],
    queryFn: fetchAdvancedSearchOptions,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  
  const {
    data: carsData,
    isLoading: isLoadingCars,
    error: carsError,
    refetch: refetchCars, 
  } = useQuery({
     
    queryKey: ["allCars", currentPage, searchParams, sortBy, carType, searchOptions],
    queryFn: () => fetchCarsWithFiltersAndSort(currentPage, carsPerPage, searchParams, sortBy, searchOptions, carType),
    keepPreviousData: true,
    enabled: !!searchOptions, 
  });

  
  useEffect(() => {
    let initialSearchParams = {
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
      vendor: "",
    };

    
    if (searchedResultData && searchedResultData.searchFilters) {
      const filters = searchedResultData.searchFilters;

      if (filters.brand) {
        initialSearchParams.make = filters.brand;
      }
      if (filters.location) {
        
        if (searchOptions && searchOptions.regions) {
          const region = searchOptions.regions.find(r => r.name_en === filters.location);
          if (region) {
            initialSearchParams.Location = region.id.toString();
          }
        }
      }
      
    }

    
    if (carType === "affordable") {
      initialSearchParams.maxPrice = "500";
    } else if (carType === "luxury") {
      initialSearchParams.minPrice = "500";
    }

    setSearchParams(initialSearchParams);
    setCurrentPage(1);
    setSortBy("");

  }, [carType, searchedResultData, searchOptions]); 

  const handleImageLoad = (carId) => {
    setCarLoading((prev) => ({
      ...prev,
      [carId]: false,
    }));
  };

  const handleSearchParamChange = (e) => {
    const { name, value } = e.target;
    console.log('Search param changed:', name, value);
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    
  };

  const handleApplyFilters = () => {
    console.log('Applying filters with params:', searchParams);
    setCurrentPage(1);
    
  };

  const handleResetSearch = () => {
    let resetToParams = {
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
      vendor: "",
    };
    if (carType === "affordable") {
      resetToParams.maxPrice = "500";
    } else if (carType === "luxury") {
      resetToParams.minPrice = "500";
    }

    console.log('Resetting search to:', resetToParams); 
    setSearchParams(resetToParams);
    setSortBy("");
    setCurrentPage(1);
    
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
    
  };

  const handleSortChange = (e) => {
    console.log('Sort changed to:', e.target.value); 
    setSortBy(e.target.value);
    setCurrentPage(1);
   
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

 

 
  let currentCars = carsData?.data || [];
  let currentTotalPages = carsData?.totalPages || 1;
  let currentIsLoading = isLoadingCars;
  let currentError = carsError;


  console.log('Using advanced search data:', currentCars.length, 'cars'); 

  const getPageContent = () => {
    switch (carType) {
      case "affordable":
        return {
          subtitle: "Affordable Cars",
          title: "Explore Our Affordable Cars",
          description: "Discover budget-friendly car rentals with great value for money."
        };
      case "luxury":
        return {
          subtitle: "Luxury Cars",
          title: "Explore Our Luxury Cars",
          description: "Experience premium luxury vehicles with top-tier features and comfort."
        };
      case "recent":
        return {
          subtitle: "Recent Cars",
          title: "Explore Our Latest Cars",
          description: "Check out our newest additions to the fleet."
        };
      default:
        return {
          subtitle: "Premium Selection",
          title: "Explore Our Cars",
          
          description: "Explore our curated collection of new luxury cars."
        };
    }
  };



  const { subtitle, title, description } = getPageContent();

   const navigate = useNavigate();
  const onNavigateToDetails = (carId) => {
    navigate(`/car-details/${carId}`); 
  }
   

  return (
    <section className="pickcar1-section">
      <div className="pickcar1-container">
        <div className="text-center">
          <h3 className="pickcar1-subtitle">{subtitle}</h3>
          <h2 className="pickcar1-title">{title}</h2>
          <p className="pickcar1-description">{description}</p>
        </div>

        <div className="sort-by-container">
          <label htmlFor="sortBy" className="sort-label">Sort by:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={handleSortChange}
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
              {loadingSearchOptions ? (
                <p>Loading search options...</p>
              ) : searchOptionsError ? (
                <p style={{ color: 'red' }}>Error loading search options: {searchOptionsError.message}</p>
              ) : (
                <AdvancedSearch
                  searchParams={searchParams}
                  onSearchChange={handleSearchParamChange}
                  onReset={handleResetSearch}
                  onSubmit={handleApplyFilters} 
                  searchOptions={searchOptions}
                />
              )}
            </div>
          )}

          <div className="car1-grid">
            {currentIsLoading ? (
              <p>Loading cars...</p>
            ) : currentError ? (
              <p style={{ color: 'red' }}>Error loading cars: {currentError.message}</p>
            ) : currentCars.length > 0 ? (
              currentCars.map((car, index) => {
                const carUniqueId = car.id; 
                const isHovered = hoveredIndex === index;
                const isLoading = carLoading[carUniqueId] !== false;
                const rating = car.average_rating;

                return (
                  <CarCard
                    key={carUniqueId}
                    car={car}
                    carId={carUniqueId}
                    cardIndex={index} 
                    isHovered={isHovered}
                    isLoading={isLoading}
                    onHoverEnter={() => setHoveredIndex(index)}
                    onHoverLeave={() => setHoveredIndex(null)}
                    onImageLoad={() => handleImageLoad(carUniqueId)}
                    onNavigateToDetails={() => onNavigateToDetails(carUniqueId)} 
                    average_rating={rating}
                  />
                );
              })
            ) : (
              <p>No cars match your search criteria.</p>
            )}
          </div>
        </div>

        <div className="pagination-wrapper">
          <Pagination
            currentPage={currentPage}
            totalPages={currentTotalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </section>
  );
}

export default AllCars;