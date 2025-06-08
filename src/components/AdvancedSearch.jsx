import React from "react";
import "../styles/SearchAdvanced.css";

const AdvancedSearch = ({ searchParams, onSearchChange, onReset, onSubmit, searchOptions }) => {
  const { brands, regions, fuel_types, transmissions, colors } = searchOptions || {};

  const currentYear = new Date().getFullYear();

  const years = Array.from({ length: currentYear - 2009 + 1 }, (_, i) => currentYear - i);

  const minPriceOptions = [20, 25, 30, 35, 40, 45, 50, 100, 200, 300, 400, 500];
  const maxPriceOptions = [25, 50, 75, 100, 150, 200, 300, 500, 1000, 2000, 3000];

  const seatOptions = ["1", "2", "3", "4", "5", "6", "7"];
  const reviewOptions = [
    { value: "1", label: "1 Star & Up" },
    { value: "2", label: "2 Stars & Up" },
    { value: "3", label: "3 Stars & Up" },
    { value: "4", label: "4 Stars & Up" },
    { value: "5", label: "5 Stars" },
  ];

  return (
    <div className="advanced-search-panel">
      <h3 className="search-panel-title">Advanced Filters</h3>

     

      {/* Make */}
      <div className="search-field">
        <label className="search-label" htmlFor="make">
          Make
        </label>
        <select
          id="make"
          name="make"
          className="search-select"
          value={searchParams.make}
          onChange={onSearchChange}
        >
          <option value="">Any Make</option>
          {brands?.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      <div className="search-field">
        <label className="search-label" htmlFor="Location">
          All Location
        </label>
        <select
          id="Location"
          name="Location"
          className="search-select"
          value={searchParams.Location}
          onChange={onSearchChange}
        >
          <option value="">Any Location</option>
          {regions?.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name_en}
            </option>
          ))}
        </select>
      </div>
       {/* Pickup Date */}
      <div className="search-field">
        <label className="search-label" htmlFor="pickup_date">
          Pickup Date
        </label>
        <input
          type="date"
          id="pickup_date"
          name="pickup_date"
          className="search-select"
          value={searchParams.pickup_date || ""}
          onChange={onSearchChange}
        />
      </div>

      {/* Dropoff Date */}
      <div className="search-field">
        <label className="search-label" htmlFor="dropoff_date">
          Dropoff Date
        </label>
        <input
          type="date"
          id="dropoff_date"
          name="dropoff_date"
          className="search-select"
          value={searchParams.dropoff_date || ""}
          onChange={onSearchChange}
        />
      </div>

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

      <div className="search-field">
        <label className="search-label" htmlFor="year">
          Year
        </label>
        <select
          id="year"
          name="year"
          className="search-select"
          value={searchParams.year}
          onChange={onSearchChange}
        >
          <option value="">Any Year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      

      {/* Transmission */}
      <div className="search-field">
        <label className="search-label" htmlFor="transmission">
          Transmission
        </label>
        <select
          id="transmission"
          name="transmission"
          className="search-select"
          value={searchParams.transmission}
          onChange={onSearchChange}
        >
          <option value="">Any Transmission</option>

          {transmissions?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="search-field">
        <label className="search-label" htmlFor="fuelType">
          Fuel Type
        </label>
        <select
          id="fuelType"
          name="fuelType"
          className="search-select"
          value={searchParams.fuelType}
          onChange={onSearchChange}
        >
          <option value="">Any Fuel Type</option>

          {fuel_types?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="search-field">
        <label className="search-label" htmlFor="color">
          Color
        </label>
        <select
          id="color"
          name="color"
          className="search-select"
          value={searchParams.color}
          onChange={onSearchChange}
        >
          <option value="">Any Color</option>

          {colors?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="search-field">
        <label className="search-label" htmlFor="seats">
          No. of Seats
        </label>
        <select
          id="seats"
          name="seats"
          className="search-select"
          value={searchParams.seats}
          onChange={onSearchChange}
        >
          <option value="">Any</option>
          {seatOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/*<div className="search-field">
        <label className="search-label" htmlFor="average_rating">Review</label>
        <select
          id="average_rating"
          name="average_rating"
          className="search-select"
          value={searchParams.average_rating}
          onChange={onSearchChange}
        >
          <option value="">Any</option>
          {reviewOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>*/}

      <div className="search-buttons">
        <button type="button" onClick={onReset} className="reset-btn">
          Reset
        </button>

        <button type="button" onClick={onSubmit} className="apply-btn">
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default AdvancedSearch;