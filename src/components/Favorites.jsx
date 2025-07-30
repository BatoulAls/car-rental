import React, { useState } from 'react';
import { Heart, Loader } from 'lucide-react';
import CarCard from './CarCard';
import '../styles/Favorites.css'; 
import Pagination from './Pagination';

const RentalCarFavorites = ({ favorites, loading, error, onToggleFavorite }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);

  
  const carsPerPage = 10;

  const handleFavoriteAction = (carId) => {
    if (onToggleFavorite) {
      onToggleFavorite(carId);
    
    }
  };

  const filteredCars = (favorites || [])
    .filter(car =>
      (selectedCategory === 'all' || car.category === selectedCategory) &&
      (car.name ? car.name.toLowerCase().includes(searchTerm.toLowerCase()) : false)
    )
    .sort((a, b) => {
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'price') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });


  const totalPages = Math.ceil(filteredCars.length / carsPerPage);
  
  if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
  } else if (totalPages === 0 && currentPage !== 1) { 
      setCurrentPage(1);
  }


  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);

  const handlePageChange = (page) => {
   
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="favorites-loading">
        <Loader className="favorites-loading-spinner" />
        <p>Loading your favorite cars...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="favorites-error">
        <p>Error loading favorites: {error}</p>
        <p>Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <div className="favorites-header-content">
          <div className="favorites-header-left">
            <div className="favorites-header-icon">
              <Heart className="favorites-heart-icon" />
            </div>
            <div>
              <h1 className="favorites-title">My Favorites</h1>
              <p className="favorites-subtitle">{filteredCars.length} saved cars</p>
            </div>
          </div>
         
        </div>
      </div>

      <div className="favorites-main">
        {filteredCars.length === 0 ? (
          <div className="favorites-empty-state">
            <Heart className="favorites-empty-icon" />
            <h3 className="favorites-empty-title">No favorites found</h3>
            <p className="favorites-empty-subtitle">Try adjusting your search or category filter</p>
          </div>
        ) : (
          <>
            <div className="favorites-car-grid">
              {currentCars.map(car => (
                <CarCard
                  key={car.id || car._id}
                  car={car}
                  carId={car.id || car._id}
                  isFavorite={true}
                  onToggleFavorite={handleFavoriteAction}
                  average_rating={car.rating || car.average_rating}
                  onHoverEnter={() => {}}
                  onHoverLeave={() => {}}
                  onClick={() => {}}
                  onImageLoad={() => {}}
                  onNavigateToDetails={(id) => console.log(`Navigating to car details for ID: ${id}`)}
                />
              ))}
            </div>

           
            {totalPages > 1 && ( 
                <div className="pagination-wrapper">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RentalCarFavorites;