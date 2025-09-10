import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; 
import { useLocation, useParams, useNavigate } from "react-router-dom";
import CarCard from "../components/CarCard";
import AdvancedSearch from "../components/AdvancedSearch";
import Pagination from "../components/Pagination";
import "../styles/AllCar.css";
import "../styles/CarCard.css";

const API_BASE_URL = "http://localhost:5050"; 

const fetchAdvancedSearchOptions = async () => {
  const res = await fetch(`${API_BASE_URL}/api/cars/options`);
  if (!res.ok) throw new Error("Failed to load advanced search options");
  const data = await res.json();
  return data;
};

const fetchCarsWithFiltersAndSort = async (
  page,
  limit,
  searchParams,
  sortBy,
  searchOptions,
  carType,
  brandFromUrl,
  vendorIdFromUrl
) => {
  let url;
  const params = new URLSearchParams();

  if (vendorIdFromUrl) {
    url = `${API_BASE_URL}/api/cars/vendors/${vendorIdFromUrl}?page=${page}&limit=${limit}`;
  } else {
    url = `${API_BASE_URL}/api/cars?page=${page}&limit=${limit}`;
  }

  const regions = searchOptions?.regions || [];

  if (brandFromUrl) {
    params.append("brand", brandFromUrl);
  }

  for (const key in searchParams) {
    if (key === "make" && brandFromUrl) continue;
    if (searchParams[key] && searchParams[key] !== "") {
      switch (key) {
        case "make":
          params.append("brand", searchParams[key]);
          break;
        case "Location":
          const selectedRegionId = searchParams[key];
          const selectedRegion = regions.find(
            (region) => region.id === parseInt(selectedRegionId)
          );
          if (selectedRegion) params.append("location", selectedRegion.name_en);
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
          if (!vendorIdFromUrl) params.append("vendor_id", searchParams[key]);
          break;
        case "pickup_date":
          params.append("pickup_date", searchParams[key]);
          break;
        case "dropoff_date":
          params.append("dropoff_date", searchParams[key]);
          break;
        default:
          params.append(key, searchParams[key]);
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

  if (params.toString()) url += `&${params.toString()}`;

  if (process.env.NODE_ENV === "development") console.log("Final API URL:", url);

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load cars with filters and sort");
  const resultData = await res.json();

  if (Array.isArray(resultData)) return { data: resultData, totalPages: 1 };
  return resultData;
};

const fetchFavoriteCars = async (token) => {
  if (!token) return [];
  try {
    const res = await axios.get(`${API_BASE_URL}/api/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (process.env.NODE_ENV === "development") console.debug("Fetched favorites:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
};

function AllCars() {
  const location = useLocation();
  const navigateToDetails = useNavigate();
  const { vendorId: vendorIdFromUrl } = useParams();
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const vendorNameFromState = location.state?.vendorName || null;
  const queryParams = new URLSearchParams(location.search);
  const brandFromUrl = queryParams.get("brand");
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

  const { data: searchOptions, isLoading: loadingSearchOptions, error: searchOptionsError } = useQuery({
    queryKey: ["advancedSearchOptions"],
    queryFn: fetchAdvancedSearchOptions,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const { data: carsData, isLoading: isLoadingCars, error: carsError } = useQuery({
    queryKey: [
      "allCars",
      currentPage,
      searchParams,
      sortBy,
      carType,
      searchOptions,
      brandFromUrl,
      vendorIdFromUrl,
    ],
    queryFn: () =>
      fetchCarsWithFiltersAndSort(
        currentPage,
        carsPerPage,
        searchParams,
        sortBy,
        searchOptions,
        carType,
        brandFromUrl,
        vendorIdFromUrl
      ),
    keepPreviousData: true,
    enabled: !!searchOptions,
  });

  const { data: favoriteCarsData = [], isLoading: favoritesLoading, error: favoritesError } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => fetchFavoriteCars(token),
    enabled: !!token,
  });

  const cars = useMemo(() => {
    if (!carsData?.data || carsData.data.length === 0) return [];

    const favoritedCarIds = new Set(favoriteCarsData.map((favCar) => favCar.id));
    const updatedCars = carsData.data.map((car) => ({
      ...car,
      isFavorite: favoritedCarIds.has(car.id),
      favoriteId: favoritedCarIds.has(car.id) ? car.id : null,
    }));

    updatedCars.slice(0, 6).forEach((car) => {
      if (car.photo) {
        const img = new Image();
        img.src = car.photo;
      }
    });

    if (process.env.NODE_ENV === "development") console.debug("Updated cars with favorites:", updatedCars);

    return updatedCars;
  }, [carsData?.data, favoriteCarsData]);

  useEffect(() => {
    let initialSearchParams = { ...searchParams };

    if (vendorIdFromUrl) {
      initialSearchParams.vendor = vendorIdFromUrl;
      initialSearchParams.make = "";
    } else if (brandFromUrl && searchOptions?.brands) {
      const matchedBrand = searchOptions.brands.find(
        (brand) => brand.toLowerCase() === brandFromUrl.toLowerCase()
      );
      initialSearchParams.make = matchedBrand || brandFromUrl;
    } else if (searchedResultData?.searchFilters) {
      const filters = searchedResultData.searchFilters;
      if (filters.brand) initialSearchParams.make = filters.brand;
      if (filters.location && searchOptions?.regions) {
        const region = searchOptions.regions.find((r) => r.name_en === filters.location);
        if (region) initialSearchParams.Location = region.id.toString();
      }
      if (filters.pickTime) initialSearchParams.pickup_date = filters.pickTime;
      if (filters.dropTime) initialSearchParams.dropoff_date = filters.dropTime;
    }

    if (carType === "affordable") initialSearchParams.maxPrice = "500";
    if (carType === "luxury") initialSearchParams.minPrice = "500";

    setSearchParams(initialSearchParams);
    setCurrentPage(1);
    setSortBy("");
  }, [carType, searchedResultData, searchOptions, brandFromUrl, vendorIdFromUrl]);

  const handleImageLoad = (carId) => {
    setCarLoading((prev) => ({ ...prev, [carId]: false }));
  };

  const handleToggleFavorite = useCallback(
    async (car) => {
      if (!token) return alert("Please log in to manage favorites.");
      try {
        if (car.isFavorite) {
          await axios.delete(`${API_BASE_URL}/api/favorites/${car.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          await axios.post(
            `${API_BASE_URL}/api/favorites`,
            { car_id: car.id },
            { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
          );
        }
      } catch (error) {
        console.error("Failed to toggle favorite:", error);
        alert("An error occurred while updating favorites. Please try again.");
      } finally {
        queryClient.invalidateQueries(["allCars"]);
        queryClient.invalidateQueries(["favorites"]);
      }
    },
    [token, queryClient]
  );

  const handleSearchParamChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => setCurrentPage(1);

  const handleResetSearch = () => {
    setSearchParams({
      make: brandFromUrl || "",
      Location: "",
      minPrice: "",
      maxPrice: carType === "affordable" ? "500" : "",
      transmission: "",
      fuelType: "",
      color: "",
      year: "",
      seats: "",
      review: "",
      vendor: vendorIdFromUrl || "",
      pickup_date: "",
      dropoff_date: "",
    });
    setSortBy("");
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth > 768) setShowSearch(true);
  }, [windowWidth]);

  const currentTotalPages = carsData?.totalPages || 1;
  const currentIsLoading = isLoadingCars || favoritesLoading;
  const currentError = carsError || favoritesError;

  const { subtitle, title, description } = useMemo(() => {
    if (vendorIdFromUrl) {
      const displayVendorName = vendorNameFromState || `Vendor ID: ${vendorIdFromUrl}`;
      return {
        subtitle: `Cars from ${displayVendorName}`,
        title: `Explore Cars from ${displayVendorName}`,
        description: `Browse all available cars from ${displayVendorName}.`,
      };
    }
    if (brandFromUrl) {
      const brandName = brandFromUrl.charAt(0).toUpperCase() + brandFromUrl.slice(1);
      return {
        subtitle: `${brandName} Cars`,
        title: `Explore Our ${brandName} Collection`,
        description: `Browse all available cars from the ${brandName} brand.`,
      };
    }
    switch (carType) {
      case "affordable":
        return {
          subtitle: "Affordable Cars",
          title: "Explore Our Affordable Cars",
          description: "Discover budget-friendly car rentals with great value for money.",
        };
      case "luxury":
        return {
          subtitle: "Luxury Cars",
          title: "Explore Our Luxury Cars",
          description: "Experience premium luxury vehicles with top-tier features and comfort.",
        };
      case "recent":
        return {
          subtitle: "Recent Cars",
          title: "Explore Our Latest Cars",
          description: "Check out our newest additions to the fleet.",
        };
      default:
        return {
          subtitle: "Premium Selection",
          title: "Explore Our Cars",
          description: "Explore our curated collection of new luxury cars.",
        };
    }
  }, [brandFromUrl, carType, vendorIdFromUrl, vendorNameFromState]);

  const onNavigateToDetails = (carId) => navigateToDetails(`/car-details/${carId}`);

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
          <select id="sortBy" value={sortBy} onChange={handleSortChange} className="sort-select">
            <option value="">Default</option>
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="priceHighToLow">Price: High to Low</option>
            <option value="yearNewest">Year: Newest First</option>
            <option value="yearOldest">Year: Oldest First</option>
          </select>
        </div>

        {windowWidth <= 768 && (
          <div className="toggle-search-container">
            <button className="toggle-search-btn" onClick={() => setShowSearch((prev) => !prev)}>
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
                <p style={{ color: "red" }}>Error loading search options: {searchOptionsError.message}</p>
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
              <p style={{ color: "red" }}>Error loading cars: {currentError.message}</p>
            ) : cars.length === 0 ? (
              <p>No cars found matching your criteria.</p>
            ) : (
              cars.map((car, index) => (
                

                <CarCard
  key={car.id}
  car={car}
  carId={car.id}
  cardIndex={index}
  isHovered={hoveredIndex === index}
  isLoading={!!carLoading[car.id]}
  onHoverEnter={() => setHoveredIndex(index)}
  onHoverLeave={() => setHoveredIndex(null)}
  onImageLoad={() => handleImageLoad(car.id)}
  onNavigateToDetails={onNavigateToDetails}
  onToggleFavorite={() => handleToggleFavorite(car)}
  isFavorite={car.isFavorite}
/>
              ))
            )}
          </div>
        </div>

        <Pagination currentPage={currentPage} totalPages={currentTotalPages} onPageChange={handlePageChange} />
      </div>
    </section>
  );
}

export default AllCars;
