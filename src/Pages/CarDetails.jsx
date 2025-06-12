import React, { useRef } from 'react';
import '../styles/CarDetails.css';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import CarImageGallery from '../components/CarImageGallery';
import CarOverview from '../components/CarOverview';
import CarFeaturesAndTags from '../components/CarFeaturesAndTags';
import CarDescriptionAndTerms from '../components/CarDescriptionAndTerms';
import CarReviews from '../components/CarReviews';
import SimilarCarsSection from '../components/SimilarCarsSection';
import CarActionButtons from '../components/CarActionButtons';

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

const fetchSimilarCars = async (carId, category, brand) => {
  try {
    let url = `http://Localhost:5050/api/cars/${carId}/similar`;

    const params = new URLSearchParams();

    if (category) {
      params.append('category', category);
    }
    if (brand) {
      params.append('brand', brand);
    }
    params.append('limit', '6'); 

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      const fallbackResponse = await fetch(`http://Localhost:5050/api/cars?limit=6`);
      if (fallbackResponse.ok) {
        const data = await fallbackResponse.json();
        return data.filter(car => car.id !== parseInt(carId));
      }
      return [];
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching similar cars:', error);
    return [];
  }
};

const CarDetails = () => {
  const { carId } = useParams();
  const navigate = useNavigate();

  const {
    data: carData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['carDetails', carId],
    queryFn: () => fetchCarDetails(carId),
    enabled: !!carId,
  });

  const {
    data: similarCars,
    isLoading: similarCarsLoading,
  } = useQuery({
    queryKey: ['similarCars', carId, carData?.category?.name, carData?.brand],
    queryFn: () => fetchSimilarCars(carId, carData?.category?.name, carData?.brand),
    enabled: !!carId && !!carData,
  });

  const renderStars = (rating) => {
    const stars = [];
    const numericRating = parseFloat(rating) || 0;
    const fullStars = Math.floor(numericRating);
    const hasHalfStar = numericRating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="filled-star">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="half-filled-star">★</span>);
      } else {
        stars.push(<span key={i} className="empty-star">★</span>);
      }
    }
    return stars;
  };

  const handleWhatsApp = () => {
    const brand = carData?.brand ?? 'this car';
    const model = carData?.model ?? '';
    const year = carData?.year ?? '';
    const price = carData?.price_per_day ?? 'N/A';

    const message = `Hi! I'm interested in renting the ${brand} ${model} (${year}) for AED ${price}/day. Can you provide more details?`;
    const whatsappUrl = `https://wa.me/${carData?.vendor?.phone ?? ''}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSimilarCarClick = (similarCarId) => {
    navigate(`/car-details/${similarCarId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
   

  if (isLoading) return <p>Loading car Details...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!carData) return <p>No car details found for this ID.</p>;

  return (
    <div className="car-details-container1">
      <CarImageGallery
        images={carData.images}
        carBrand={carData.brand}
        carModel={carData.model}
      />

      <CarOverview carData={carData} />

      <CarFeaturesAndTags
        features={carData.features}
        tags={carData.tags}
      />

      <CarDescriptionAndTerms
        overview={carData.overview}
        mileageLimit={carData.mileage_limit}
        additionalMileageCharge={carData.additional_mileage_charge}
        insuranceIncluded={carData.insurance_included}
      />

      <CarReviews reviews={carData.reviews} carId={carId}/>
     

      <SimilarCarsSection
        similarCars={similarCars}
        similarCarsLoading={similarCarsLoading}
        onSimilarCarClick={handleSimilarCarClick}
        renderStars={renderStars}
      />

      <CarActionButtons
        carData={carData}
        handleWhatsApp={handleWhatsApp}
      />
    </div>
  );
};

export default CarDetails;