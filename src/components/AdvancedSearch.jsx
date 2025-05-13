
import React from "react";
import '../styles/SearchAdvanced.css'


function AdvancedSearch({ searchParams, onSearchParamChange }) {
  return (
    <div className="advanced-search">
      <h3 className="advanced-search-title">Advanced Search</h3>
      <form className="advanced-search-form">
        <div className="search-input-group">
          <label htmlFor="model">Model</label>
          <input
            type="text"
            id="model"
            name="model"
            value={searchParams.model}
            onChange={onSearchParamChange}
            placeholder="Enter car model"
          />
        </div>

        <div className="search-input-group">
          <label htmlFor="minPrice">Min Price</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            value={searchParams.minPrice}
            onChange={onSearchParamChange}
            placeholder="Minimum price"
          />
        </div>

        <div className="search-input-group">
          <label htmlFor="maxPrice">Max Price</label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            value={searchParams.maxPrice}
            onChange={onSearchParamChange}
            placeholder="Maximum price"
          />
        </div>

        <div className="search-input-group">
          <label htmlFor="transmission">Transmission</label>
          <select
            id="transmission"
            name="transmission"
            value={searchParams.transmission}
            onChange={onSearchParamChange}
          >
            <option value="">All Transmissions</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
        </div>

        <div className="search-input-group">
          <label htmlFor="fuelType">Fuel Type</label>
          <select
            id="fuelType"
            name="fuelType"
            value={searchParams.fuelType}
            onChange={onSearchParamChange}
          >
            <option value="">All Fuel Types</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
      </form>
    </div>
  );
}

export default AdvancedSearch;
