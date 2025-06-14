import { useState, useEffect, useMemo } from "react"; 
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

const fetchCarsWithFiltersAndSort = async (page, limit, searchParams, sortBy, searchOptions, carType, brandFromUrl) => {
  let url = `http://localhost:5050/api/cars?page=${page}&limit=${limit}`;

  const params = new URLSearchParams();
  const regions = searchOptions?.regions || [];


  if (brandFromUrl) {
    params.append("brand", brandFromUrl);
    console.log('API Call: Adding brand from URL:', brandFromUrl);
  }


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

    if (
      (key === "make" && brandFromUrl) ||
      (key === "maxPrice" && carType === "affordable") ||
      (key === "minPrice" && carType === "luxury")
    ) {
      continue;
    }

    if (searchParams[key] && searchParams[key] !== "") {
      switch (key) {
        case "make":

          if (!brandFromUrl) {
            params.append("brand", searchParams[key]);
          }
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
        case "pickup_date":
          params.append("pickup_date", searchParams[key]);
          break;
        case "dropoff_date":
          params.append("dropoff_date", searchParams[key]);
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

  console.log('Final API URL:', url);
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load cars with filters and sort");
  const data = await res.json();
  return data;
};

function AllCars() {
  const location = useLocation();
  const navigateToDetails = useNavigate();


  const queryParams = new URLSearchParams(location.search);
  const brandFromUrl = queryParams.get("brand");

  console.log('Brand from URL (brandFromUrl):', brandFromUrl);
  console.log('Current URL search:', location.search);

  const searchedResultData = location.state?.resultData || null;
  const carType = location.state?.carType || null;

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
    vendor: "",
    pickup_date: "",
    dropoff_date: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showSearch, setShowSearch] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sortBy, setSortBy] = useState("");

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
    queryKey: ["allCars", currentPage, searchParams, sortBy, carType, searchOptions, brandFromUrl],
    queryFn: () => fetchCarsWithFiltersAndSort(currentPage, carsPerPage, searchParams, sortBy, searchOptions, carType, brandFromUrl),
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
      pickup_date: "",
      dropoff_date: "",
    };


    if (brandFromUrl && searchOptions?.brands) {
      console.log('Available brands:', searchOptions.brands);
      console.log('Brand from URL (raw):', brandFromUrl);


      const matchedBrand = searchOptions.brands.find(brand =>
        brand.toLowerCase() === brandFromUrl.toLowerCase()
      );

      if (matchedBrand) {
        initialSearchParams.make = matchedBrand;
        console.log('Matched brand exactly:', matchedBrand);
      } else {

        const variations = [
          brandFromUrl.toUpperCase(),
          brandFromUrl.charAt(0).toUpperCase() + brandFromUrl.slice(1).toLowerCase(),
          brandFromUrl.toLowerCase(),
          brandFromUrl
        ];

        for (const variation of variations) {
          const found = searchOptions.brands.find(brand => brand === variation);
          if (found) {
            initialSearchParams.make = found;
            console.log('Matched brand with variation:', found);
            break;
          }
        }

        if (!initialSearchParams.make) {
          console.warn('No brand match found for:', brandFromUrl);
          console.warn('Available brands:', searchOptions.brands);

          initialSearchParams.make = brandFromUrl;
        }
      }
    }
    else if (searchedResultData && searchedResultData.searchFilters) {
      const filters = searchedResultData.searchFilters;
      if (filters.brand) {
        initialSearchParams.make = filters.brand;
        console.log('Setting initial search params.make from location.state:', filters.brand);
      }
      if (filters.location) {
        if (searchOptions && searchOptions.regions) {
          const region = searchOptions.regions.find(r => r.name_en === filters.location);
          if (region) {
            initialSearchParams.Location = region.id.toString();
          }
        }
      }
      if (filters.pickTime) {
        initialSearchParams.pickup_date = filters.pickTime;
      }
      if (filters.dropTime) {
        initialSearchParams.dropoff_date = filters.dropTime;
      }
    }


    if (carType === "affordable") {
      initialSearchParams.maxPrice = "500";
    } else if (carType === "luxury") {
      initialSearchParams.minPrice = "500";
    }

    console.log('Final initial search params:', initialSearchParams);
    setSearchParams(initialSearchParams);
    setCurrentPage(1);
    setSortBy("");
  }, [carType, searchedResultData, searchOptions, brandFromUrl]);

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
    console.log('Brand from URL during filter apply:', brandFromUrl);
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
      pickup_date: "",
      dropoff_date: "",
    };


    if (brandFromUrl) {
      resetToParams.make = brandFromUrl;
    }

    else if (searchedResultData && searchedResultData.searchFilters && searchedResultData.searchFilters.brand) {
      resetToParams.make = searchedResultData.searchFilters.brand;
    }


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

  console.log('Current cars data:', currentCars);
  console.log('Total cars found:', currentCars.length);


  const { subtitle, title, description } = useMemo(() => {
    if (brandFromUrl) {
      const brandName = brandFromUrl.charAt(0).toUpperCase() + brandFromUrl.slice(1);
      return {
        subtitle: `${brandName} Cars`,
        title: `Explore Our ${brandName} Collection`,
        description: `Browse all available cars from the ${brandName} brand.`
      };
    }

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
  }, [brandFromUrl, carType]);  

  const onNavigateToDetails = (carId) => {
    navigateToDetails(`/car-details/${carId}`);
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
              <div>
                <p>No cars match your search criteria.</p>
                {brandFromUrl && (
                  <p style={{ color: 'orange' }}>
                    No cars found for brand: {brandFromUrl}. Please check if the brand name is correct.
                  </p>
                )}
              </div>
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