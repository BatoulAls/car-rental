import React, { useState, useEffect } from 'react';
import {  Eye, Edit, Plus,Trash } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Pagination from '../../components/Pagination';
import '../../styles/VendorCarComponent.css';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5050';

const VendorCarComponent = () => {
  const [cars, setCars] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate=useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchVendorCars = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/api/vendor/my-cars?page=${currentPage}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCars(data.cars);
        setTotalPages(data.totalPages);
        setLoading(false);
      } catch (e) {
        console.error('Failed to fetch vendor cars:', e);
        setError('Failed to load cars. Please try again later.');
        setLoading(false);
      }
    };

    if (token) {
      fetchVendorCars();
    }
  }, [token, currentPage]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="filled-star">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="half-filled-star">★</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="empty-star">★</span>);
    }

    return stars;
  };

  const toggleFavorite = (carId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(carId)) {
      newFavorites.delete(carId);
    } else {
      newFavorites.add(carId);
    }
    setFavorites(newFavorites);
  };

  const handleEdit = (carId) => {
    console.log('Edit car:', carId);
  };

  const handleViewDetails = (carId) => {
    console.log('View details for car:', carId);
  };

  const handleAddNewCar = () => {
    console.log('Add new car');
    navigate('/vendors/add-car')
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div className="loading-message">Loading cars...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className='vendor-car-container'>
      <section className="vendor-car-section">
        <div className="header-container">
          <div>
            <h1 className="main-heading">
              My Car Listings
            </h1>
            <p className="sub-heading">
              Manage your rental fleet and track performance
            </p>
          </div>
          <button onClick={handleAddNewCar} className="add-car-button">
            <Plus size={20} />
            Add New Car
          </button>
        </div>

        <div className="car-grid">
          {cars.map((car) => (
            <div
              key={car.id}
              className={`car-card ${hoveredCard === car.id ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredCard(car.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >

              <div className="action-buttons-container">
                <button onClick={(e) => { e.stopPropagation(); handleViewDetails(car.id); }} className="action-button">
                  <Trash  />
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleEdit(car.id); }} className="action-button">
                  <Edit size={16} />
                </button>
              </div>

              <div className="car-image-container">
                <img
                  src={`${API_BASE_URL}${car.photo}`} 
                  alt={car.name}
                  className="car-image"
                />
              </div>

              <div className="price-banner">
                <span className="price-text">
                  ${car.price_per_day}
                </span>
                <span className="price-per-day">
                  /day
                </span>
              </div>

              <div className="car-details">
                <div className="car-header">
                  <h3 className="car-name">
                    {car.name}
                  </h3>
                  <div className="car-rating">
                    <div className="rating-stars">
                      {renderStars(car.average_rating)}
                    </div>
                    <span className="review-count">
                      ({car.review_count})
                    </span>
                  </div>
                </div>

                <div className="car-specs-grid">
                  <div className="spec-item">
                    <div className="spec-label">Transmission</div>
                    <div className="spec-value">{car.transmission}</div>
                  </div>
                  <div className="spec-item">
                    <div className="spec-label">Fuel Type</div>
                    <div className="spec-value">{car.fuel_type}</div>
                  </div>
                  <div className="spec-item">
                    <div className="spec-label">Seats</div>
                    <div className="spec-value">{car.seats}</div>
                  </div>
                  <div className="spec-item">
                    <div className="spec-label">Doors</div>
                    <div className="spec-value">{car.no_of_doors}</div>
                  </div>
                </div>

                <div className="car-footer">
                  <div className="car-availability">
                    <div className={`status-dot available`} />
                    {car.availability_status}
                  </div>

                  <button onClick={(e) => { e.stopPropagation(); handleViewDetails(car.id); }} className="view-details-button">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination-container">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default VendorCarComponent;