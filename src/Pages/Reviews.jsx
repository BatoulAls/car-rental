import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import CarReviews from '../components/CarReviews';
import '../styles/Reviews.css'
import Pagination from '../components/Pagination';

const fetchCarDetails = async (carId) => {
  if (!carId) {
    throw new Error('Car ID is required to fetch details.');
  }
  const response = await fetch(`http://Localhost:5050/api/cars/${carId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch car with ID ${carId}: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
};

const Reviews = () => {
  const { carId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  const {
    data: carData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['carDetails', carId],
    queryFn: () => fetchCarDetails(carId),
    enabled: !!carId,
  });

  if (isLoading) return <p>Loading reviews...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const reviews = carData?.reviews || [];

  if (reviews.length === 0) return <p>No reviews available for this car yet.</p>;

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="all-reviews-container">
      <h1>All Customers Reviews for {carData?.brand} {carData?.model}</h1>
      <CarReviews
        reviews={currentReviews}
        carId={carId}
        displayLimit={currentReviews.length}
        showReadMoreButton={false}
        title={`All Reviews for ${carData?.brand} ${carData?.model}`}
      />
      <div className="pagination-wrapper">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Reviews;
