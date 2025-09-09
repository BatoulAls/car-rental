import React, { useState, useEffect } from 'react';
import { Eye, Edit, Plus, Trash } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Pagination from '../../components/Pagination';
import PopUpModal from '../../components/PopUpModal';
import '../../styles/VendorCarComponent.css';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5050';

const VendorCarComponent = () => {
  const [cars, setCars] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);

  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);

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

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

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

  useEffect(() => {
    if (token) fetchVendorCars();
  }, [token, currentPage]);

  const handleEdit = (carId) => {
    navigate(`/vendors/edit-car/${carId}`);
  };

  const handleViewDetails = (carId) => navigate(`/VendorsCarDetails/${carId}`);

  const handleAddNewCar = () => navigate('/vendors/add-car');

  const handlePageChange = (page) => setCurrentPage(page);

  const handleOpenDeleteModal = (carId) => {
    setCarToDelete(carId);
    setIsModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/vendor/car/${carToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete car');

      setCars(cars.filter((car) => car.id !== carToDelete));
      setIsModalVisible(false);
      setCarToDelete(null);
      fetchVendorCars();
    } catch (err) {
      console.error(err);
      alert('An error occurred while deleting the car.');
    }
  };

  if (loading) return <div className="loading-message">Loading cars...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="vendor-car-container">
      <section className="vendor-car-section">
        <div className="header-container">
          <div>
            <h1 className="main-heading">My Car Listings</h1>
            <p className="sub-heading">Manage your rental fleet and track performance</p>
          </div>
          <button onClick={handleAddNewCar} className="add-car-button">
            <Plus size={20} /> Add New Car
          </button>
        </div>

        {cars.length === 0 ? (
          <div className="no-cars-added-container">
            <div className="no-cars-icon">🚗</div>
            <h1 className="no-cars-heading">No Cars Added Yet!</h1>
            <p className="no-cars-text">
              It looks like you haven't listed any cars for rent. Start by adding your first car to manage your fleet and attract customers.
            </p>
            <button onClick={handleAddNewCar} className="add-car-cta-button">
              <Plus size={20} /> Add Your First Car
            </button>
          </div>
        ) : (
          <div className="car-grid">
            {cars.map((car) => (
              <div
                key={car.id}
                className={`car-card ${hoveredCard === car.id ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredCard(car.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="action-buttons-container">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDeleteModal(car.id);
                    }}
                    className="action-button"
                  >
                    <Trash />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(car.id);
                    }}
                    className="action-button"
                  >
                    <Edit size={16} />
                  </button>
                </div>

                <div className="car-image-container">
                  <img src={`${API_BASE_URL}${car.photo}`} alt={car.name} className="car-image" />
                </div>

                <div className="price-banner">
                  <span className="price-text">${car.price_per_day}</span>
                  <span className="price-per-day">/day</span>
                </div>

                <div className="car-details">
                  <div className="car-header">
                    <h3 className="car-name">{car.name}</h3>
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
                      {car.availability_status || "Available"}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(car.id);
                      }}
                      className="view-details-button"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {cars.length > 0 && totalPages > 1 && (
          <div className="pagination-container">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        )}

        <PopUpModal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)}>
          <h2>Are you sure you want to delete this car?</h2>
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-around' }}>
            <button
              onClick={handleConfirmDelete}
              style={{ backgroundColor: '#ff4d30', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px' }}
            >
              Yes
            </button>
            <button
              onClick={() => setIsModalVisible(false)}
              style={{ padding: '0.5rem 1rem', borderRadius: '4px' }}
            >
              No
            </button>
          </div>
        </PopUpModal>
      </section>
    </div>
  );
};

export default VendorCarComponent;
