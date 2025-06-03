import React, { useRef, useState } from 'react';
import SimilarCarCard from './SimilarCarCard'; 
import defaultimg from '../images/cars-big/default-car.png';  
import { useNavigate } from 'react-router-dom';
const SimilarCarsSection = ({ similarCars, similarCarsLoading, onSimilarCarClick, renderStars }) => {
  const scrollContainerRef = useRef(null);
  const [showAllSimilarCars, setShowAllSimilarCars] = useState(false);

  const navigate = useNavigate();
  const onNavigateToDetails = (carId) => {
    navigate(`/car-details/${carId}`); 
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  if (!similarCars || similarCars.length === 0) {
    return null;
  }

  return (
    <div className="similar-cars-section1">
      <div className="similar-cars-header">
        <h3 className="section-title1">Similar Cars You Might Like</h3>
        <button
          onClick={() => setShowAllSimilarCars(!showAllSimilarCars)}
          className="view-all-btn"
        >
          <span>{showAllSimilarCars ? 'Show Less' : 'View All'}</span>
          <span className={`arrow-icon ${showAllSimilarCars ? 'rotated' : ''}`}>→</span>
        </button>
      </div>

      {showAllSimilarCars ? (
        <div className="similar-cars-grid1">
          {similarCars.map((car) => (
            <SimilarCarCard
              key={car.id}
              car={car}
              onClick={onSimilarCarClick}
              renderStars={renderStars}
              defaultImage={defaultimg}
              onNavigateToDetails={onNavigateToDetails}
            />
          ))}
        </div>
      ) : (
        <div className="similar-cars-horizontal-container">
          <button
            onClick={scrollLeft}
            className="scroll-btn scroll-btn-left"
            aria-label="Scroll left"
          >
            ←
          </button>
          

          <div className="similar-cars-horizontal-scroll" ref={scrollContainerRef}>
            {similarCars.slice(0, 6).map((car) => (
              <div key={car.id} className="similar-car-item">
                <SimilarCarCard
                  car={car}
                  onClick={onSimilarCarClick}
                  renderStars={renderStars}
                  defaultImage={defaultimg}
                   onNavigateToDetails={onNavigateToDetails}
                />
              </div>
            ))}
          </div>

          <button
            onClick={scrollRight}
            className="scroll-btn scroll-btn-right"
            aria-label="Scroll right"
          >
            →
          </button>
        </div>
      )}

      {similarCarsLoading && (
        <div className="similar-cars-loading">
          <div className="spinner1"></div>
          <p>Loading similar cars...</p>
        </div>
      )}
    </div>
  );
};

export default SimilarCarsSection;