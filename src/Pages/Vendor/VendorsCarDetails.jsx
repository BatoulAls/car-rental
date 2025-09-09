import React from 'react';
import '../../styles/CarDetails.css';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import CarImageGallery from '../../components/CarImageGallery';
import CarOverview from '../../components/CarOverview';
import CarFeaturesAndTags from '../../components/CarFeaturesAndTags';
import CarDescriptionAndTerms from '../../components/CarDescriptionAndTerms';

import { useAuth } from '../../context/AuthContext';


const fetchCarDetails = async (carId, token) => {
  if (!carId) {
    throw new Error('Car ID is required to fetch details.');
  }
  if (!token) {
    throw new Error('Authentication token is required.');
  }
  const response = await fetch(`http://localhost:5050/api/vendor/car/${carId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch car with ID ${carId}: ${response.statusText}`);
  }
  const data = await response.json();
  return data.car;
};

const formatCarData = (carData) => {
  if (!carData) return null;

  const formattedFeatures = {
    technical: carData.Features?.filter(f => f.type_ === 'technical').map(f => f.name) || [],
    comfort: carData.Features?.filter(f => f.type_ === 'comfort').map(f => f.name) || [],
  };

  const formattedTags = carData.Tags?.map(t => t.name) || [];

  return {
    ...carData,
    formattedFeatures,
    formattedTags,
  };
};

const VendorsCarDetails = () => {
  const { carId } = useParams();
  const { token } = useAuth();

  const {
    data: carData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['carDetails', carId, token],
    queryFn: () => fetchCarDetails(carId, token),
    enabled: !!carId && !!token,
  });

  const formattedData = formatCarData(carData);

  if (isLoading) return <p>Loading car Details...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!formattedData) return <p>No car details found for this ID.</p>;

  return (
    <div className="car-details-container1">
      <CarImageGallery
        images={formattedData.CarImages}
        carBrand={formattedData.brand}
        carModel={formattedData.model}
      />

      <CarOverview carData={formattedData} />

      <CarFeaturesAndTags
        features={formattedData.formattedFeatures}
        tags={formattedData.formattedTags}
      />

      <CarDescriptionAndTerms
        overview={formattedData.description}
        mileageLimit={formattedData.mileage_limit}
        additionalMileageCharge={formattedData.additional_mileage_charge}
        insuranceIncluded={formattedData.insurance_included}
      />

    </div>
  );
};

export default VendorsCarDetails;