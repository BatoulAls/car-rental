import React from "react";
import "../styles/SearchAdvanced.css";

const AdvancedSearch = ({ searchParams, onSearchChange, onReset }) => {
  const transmissionOptions = ["Automatic", "Manual", "CVT", "Semi-Automatic"];
  const fuelTypeOptions = ["Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"];
  const colorOptions = ["Black", "White", "Silver", "Red", "Blue", "Grey", "Brown", "Green"];
  const LocationOptions = ["Kafar Souseh", "Sahnaya", "Shaalan", "Baramkeh", "Bab Touma", "Qasaa", "Mazzeh"];
  const seatOptions = ["1-2 seats", "4-5 seats", "6-7 seats"];
  const reviewOptions = [
    { value: "1", label: "1 Star & Up" },
    { value: "2", label: "2 Stars & Up" },
    { value: "3", label: "3 Stars & Up" },
    { value: "4", label: "4 Stars & Up" },
    { value: "5", label: "5 Stars" }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2009 }, (_, i) => currentYear - i);

  const minPriceOptions = [20, 25, 30, 35, 40, 45, 50];
  const maxPriceOptions = [25, 50, 75, 100, 150, 200, 300];

  const makeOptions = [
    "Audi", "BMW", "Chevrolet", "Ford", "Honda", "Hyundai",
    "Kia", "Lexus", "Mazda", "Mercedes-Benz", "Nissan", "Tesla", "Toyota", "Volkswagen"
  ];

  return (
    <div className="advanced-search-panel">
      <h3 className="search-panel-title">Advanced Filters</h3>

      {/* Make */}
      <div className="search-field">
        <label className="search-label" htmlFor="make">Make</label>
        <select
          id="make"
          name="make"
          className="search-select"
          value={searchParams.make}
          onChange={onSearchChange}
        >
          <option value="">Any Make</option>
          {makeOptions.map((make) => (
            <option key={make} value={make}>{make}</option>
          ))}
        </select>
      </div>

      {/* Location */}
      <div className="search-field">
        <label className="search-label" htmlFor="Location">All Location</label>
        <select
          id="Location"
          name="Location"
          className="search-select"
          value={searchParams.Location}
          onChange={onSearchChange}
        >
          <option value="">Any Location</option>
          {LocationOptions.map((location) => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="search-field">
        <label className="search-label">Price Range</label>
        <div className="price-range">
          <select
            name="minPrice"
            className="search-select half-width"
            value={searchParams.minPrice}
            onChange={onSearchChange}
          >
            <option value="">Min Price</option>
            {minPriceOptions.map((price) => (
              <option key={`min-${price}`} value={price}>
                ${price.toLocaleString()}
              </option>
            ))}
          </select>
          <select
            name="maxPrice"
            className="search-select half-width"
            value={searchParams.maxPrice}
            onChange={onSearchChange}
          >
            <option value="">Max Price</option>
            {maxPriceOptions.map((price) => (
              <option key={`max-${price}`} value={price}>
                ${price.toLocaleString()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Year */}
      <div className="search-field">
        <label className="search-label" htmlFor="year">Year</label>
        <select
          id="year"
          name="year"
          className="search-select"
          value={searchParams.year}
          onChange={onSearchChange}
        >
          <option value="">Any Year</option>
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Transmission */}
      <div className="search-field">
        <label className="search-label" htmlFor="transmission">Transmission</label>
        <select
          id="transmission"
          name="transmission"
          className="search-select"
          value={searchParams.transmission}
          onChange={onSearchChange}
        >
          <option value="">Any Transmission</option>
          {transmissionOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Fuel Type */}
      <div className="search-field">
        <label className="search-label" htmlFor="fuelType">Fuel Type</label>
        <select
          id="fuelType"
          name="fuelType"
          className="search-select"
          value={searchParams.fuelType}
          onChange={onSearchChange}
        >
          <option value="">Any Fuel Type</option>
          {fuelTypeOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Color */}
      <div className="search-field">
        <label className="search-label" htmlFor="color">Color</label>
        <select
          id="color"
          name="color"
          className="search-select"
          value={searchParams.color}
          onChange={onSearchChange}
        >
          <option value="">Any Color</option>
          {colorOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Seats */}
      <div className="search-field">
        <label className="search-label" htmlFor="seats">No. of Seats</label>
        <select
          id="seats"
          name="seats"
          className="search-select"
          value={searchParams.seats}
          onChange={onSearchChange}
        >
          <option value="">Any</option>
          {seatOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Review Rating */}
      <div className="search-field">
        <label className="search-label" htmlFor="reviewRating">Review</label>
        <select
          id="reviewRating"
          name="reviewRating"
          className="search-select"
          value={searchParams.reviewRating}
          onChange={onSearchChange}
        >
          <option value="">Any</option>
          {reviewOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Filter Buttons */}
      <div className="search-buttons">
        <button type="button" onClick={onReset} className="reset-btn">Reset</button>
        <button type="button" className="apply-btn">Apply Filters</button>
      </div>
    </div>
  );
};

export default AdvancedSearch;
