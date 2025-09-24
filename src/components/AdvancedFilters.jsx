import React from 'react';
import { Filter, X, Search, ChevronDown } from 'lucide-react';
import '../styles/AdvancedFilter.css'; 

const AdvancedFilter = ({
  searchTerm,
  setSearchTerm,
  filters,
  handleFilterChange,
  showFilters,
  setShowFilters,
  clearFilters,
  activeFiltersCount,
  filterOptions
}) => {
  return (
    <>
   
      <div className="controls-section">
        <div className="search-container">
          <Search size={20} color="#6c757d" />
          <input
            type="text"
            placeholder="Search by car name, brand, model, customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="filter-button"
        >
          <Filter size={20} />
          Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          <ChevronDown 
            size={16} 
            className={`chevron-icon ${showFilters ? 'rotate' : ''}`}
          />
        </button>

        {activeFiltersCount > 0 && (
          <button onClick={clearFilters} className="clear-button">
            <X size={16} />
            Clear All
          </button>
        )}
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filters-grid">
            <div className="filter-group">
              <label className="filter-label">Status</label>
              <select 
                value={filters.status} 
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="filter-select"
              >
                <option value="">All Statuses</option>
                {filterOptions.status.map(status => (
                  <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Brand</label>
              <select 
                value={filters.brand} 
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                className="filter-select"
              >
                <option value="">All Brands</option>
                {filterOptions.brand.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Transmission</label>
              <select 
                value={filters.transmission} 
                onChange={(e) => handleFilterChange('transmission', e.target.value)}
                className="filter-select"
              >
                <option value="">All Types</option>
                {filterOptions.transmission.map(trans => (
                  <option key={trans} value={trans}>{trans.charAt(0).toUpperCase() + trans.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Fuel Type</label>
              <select 
                value={filters.fuel_type} 
                onChange={(e) => handleFilterChange('fuel_type', e.target.value)}
                className="filter-select"
              >
                <option value="">All Types</option>
                {filterOptions.fuel_type.map(fuel => (
                  <option key={fuel} value={fuel}>{fuel.charAt(0).toUpperCase() + fuel.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Payment Method</label>
              <select 
                value={filters.payment_method} 
                onChange={(e) => handleFilterChange('payment_method', e.target.value)}
                className="filter-select"
              >
                <option value="">All Methods</option>
                {filterOptions.payment_method.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Location</label>
              <select 
                value={filters.location} 
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="filter-select"
              >
                <option value="">All Locations</option>
                {filterOptions.location.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Seats</label>
              <select 
                value={filters.seats} 
                onChange={(e) => handleFilterChange('seats', e.target.value)}
                className="filter-select"
              >
                <option value="">All Seats</option>
                {filterOptions.seats.map(seats => (
                  <option key={seats} value={seats}>{seats} seats</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Insurance</label>
              <select 
                value={filters.insurance_included} 
                onChange={(e) => handleFilterChange('insurance_included', e.target.value)}
                className="filter-select"
              >
                <option value="">All</option>
                <option value="true">Included</option>
                <option value="false">Not Included</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Year From</label>
              <input 
                type="number" 
                placeholder="2020"
                value={filters.year_from}
                onChange={(e) => handleFilterChange('year_from', e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Year To</label>
              <input 
                type="number" 
                placeholder="2025"
                value={filters.year_to}
                onChange={(e) => handleFilterChange('year_to', e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Price From ($)</label>
              <input 
                type="number" 
                placeholder="0"
                value={filters.price_from}
                onChange={(e) => handleFilterChange('price_from', e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Price To ($)</label>
              <input 
                type="number" 
                placeholder="50000"
                value={filters.price_to}
                onChange={(e) => handleFilterChange('price_to', e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Start Date From</label>
              <input 
                type="date"
                value={filters.date_from}
                onChange={(e) => handleFilterChange('date_from', e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">End Date To</label>
              <input 
                type="date"
                value={filters.date_to}
                onChange={(e) => handleFilterChange('date_to', e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Customer Status</label>
              <select 
                value={filters.customer_verified} 
                onChange={(e) => handleFilterChange('customer_verified', e.target.value)}
                className="filter-select"
              >
                <option value="">All Customers</option>
                <option value="true">Verified</option>
                <option value="false">Not Verified</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdvancedFilter;