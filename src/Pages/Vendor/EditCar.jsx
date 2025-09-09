import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import InputField from '../../components/InputField';
import SubmitButton from '../../components/SubmitButton';
import { useAuth } from '../../context/AuthContext';
import '../../styles/AddCar.css';
import { useParams } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5050';

const staticData = {
  brands: ["Audi", "BMW", "Chevrolet", "Ford", "Honda", "Hyundai", "Kia", "Lexus", "Mazda", "Mercedes", "Nissan", "Toyota"],
  transmissions: ["Automatic", "Manual"],
  fuelTypes: ["Petrol", "Diesel", "Hybrid", "Electric"],
  engineCapacities: ["1.5L", "2.0L", "2.5L", "3.0L", "4.0L"],
  regionalSpecs: ["GCC", "American", "European", "Japanese"],
  color: ["Red", "Black", "Blue", "Green", "Yellow", "Orange", "Silver", "Gold", "White", "Grey", "Beige", "Brown"]
};

const EditCar = ({ onCancel, onUpdateSuccess }) => {
  const { carId } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_per_day: '',
    seats: '',
    no_of_doors: '',
    bags: '',
    color: '',
    year: '',
    mileage_limit: '',
    additional_mileage_charge: '',
    category_id: '',
    country_id: '',
    city_id: '',
    region_id: '',
    brand: '',
    custom_brand: '',
    model: '',
    transmission: '',
    custom_transmission: '',
    fuel_type: '',
    custom_fuel_type: '',
    engine_capacity: '',
    custom_engine_capacity: '',
    regional_spec: '',
    custom_regional_spec: '',
    location: '',
    insurance_included: false,
    deposit_amount: '',
    tags: [],
    features: [],
    images: [] 
  });

  const [apiData, setApiData] = useState({
    categories: [],
    countries: [],
    cities: [],
    regions: [],
    tags: [],
    features: []
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useAuth();
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!carId || !token) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [
          categoriesRes,
          countriesRes,
          tagsRes,
          featuresRes,
          carRes
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/api/meta/car-categories`),
          fetch(`${API_BASE_URL}/api/meta/countries`),
          fetch(`${API_BASE_URL}/api/meta/tags`),
          fetch(`${API_BASE_URL}/api/meta/features`),
          fetch(`${API_BASE_URL}/api/vendor/car/${carId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        

        if (!carRes.ok) {
          throw new Error('Failed to fetch car data');
        }

        const [
          categories,
          countries,
          tags,
          features,
          response
        ] = await Promise.all([
          categoriesRes.json(),
          countriesRes.json(),
          tagsRes.json(),
          featuresRes.json(),
          carRes.json()
        ]);
        console.log('API Response:', response);
        
        const carData = response.car;

        if (!carData) {
            throw new Error('Car data is incomplete or missing');
        }
        
        const countryId = carData.region?.city?.country_id || '';
        const cityId = carData.region?.city?.id || '';
        const regionId = carData.region?.id || '';

        let cities = [];
        let regions = [];
        if (countryId) {
          const citiesRes = await fetch(`${API_BASE_URL}/api/meta/cities?country_id=${countryId}`);
          cities = await citiesRes.json();
          if (cityId) {
            const regionsRes = await fetch(`${API_BASE_URL}/api/meta/regions?city_id=${cityId}`);
            regions = await regionsRes.json();
          }
        }

        setApiData({
          categories: categories || [],
          countries: countries || [],
          cities: cities || [],
          regions: regions || [],
          tags: tags || [],
          features: features || []
        });

        const brand = staticData.brands.includes(carData.brand) ? carData.brand : 'other';
        const transmission = staticData.transmissions.includes(carData.transmission) ? carData.transmission : 'other';
        const fuel_type = staticData.fuelTypes.includes(carData.fuel_type) ? carData.fuel_type : 'other';
        const engine_capacity = staticData.engineCapacities.includes(carData.engine_capacity) ? carData.engine_capacity : 'other';
        const regional_spec = staticData.regionalSpecs.includes(carData.regional_spec) ? carData.regional_spec : 'other';

        setFormData({
          ...carData,
          brand,
          custom_brand: brand === 'other' ? carData.brand : '',
          transmission,
          custom_transmission: transmission === 'other' ? carData.transmission : '',
          fuel_type,
          custom_fuel_type: fuel_type === 'other' ? carData.fuel_type : '',
          engine_capacity,
          custom_engine_capacity: engine_capacity === 'other' ? carData.engine_capacity : '',
          regional_spec,
          custom_regional_spec: regional_spec === 'other' ? carData.regional_spec : '',
          tags: carData.Tags?.map(t => t.id) ?? [],
  features: carData.Features?.map(f => f.CarFeature?.feature_id || f.id) ?? [],
  insurance_included: carData.insurance_included || false,
  
        
          
          country_id: countryId,
          city_id: cityId,
          region_id: regionId,

          images: [] 
        });
        
        setExistingImages(carData.CarImages || []);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [carId, token]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'country_id') {
      fetchCities(value);
    } else if (name === 'city_id') {
      fetchRegions(value);
    }
  };

  const fetchCities = async (countryId) => {
    if (!countryId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/meta/cities?country_id=${countryId}`);
      const cities = await response.json();
      setApiData(prev => ({ ...prev, cities: cities || [], regions: [] }));
      setFormData(prev => ({ ...prev, city_id: '', region_id: '' }));
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const fetchRegions = async (cityId) => {
    if (!cityId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/meta/regions?city_id=${cityId}`);
      const regions = await response.json();
      setApiData(prev => ({ ...prev, regions: regions || [] }));
      setFormData(prev => ({ ...prev, region_id: '' }));
    } catch (error) {
      console.error('Error fetching regions:', error);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: files
    }));
  };

  const handleCheckboxChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter(item => item !== value)
        : [...prev[name], value]
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price_per_day || !formData.year || (!formData.brand && !formData.custom_brand) || !formData.model) {
      alert('Please fill in all required fields (Name, Model, Price, Year, Brand)');
      return;
    }

    const dataToSubmit = {
      ...formData,
      brand: formData.brand === 'other' ? formData.custom_brand : formData.brand,
      transmission: formData.transmission === 'other' ? formData.custom_transmission : formData.transmission,
      fuel_type: formData.fuel_type === 'other' ? formData.custom_fuel_type : formData.fuel_type,
      engine_capacity: formData.engine_capacity === 'other' ? formData.custom_engine_capacity : formData.engine_capacity,
      regional_spec: formData.regional_spec === 'other' ? formData.custom_regional_spec : formData.regional_spec,
      feature_ids: formData.features,
      tag_ids: formData.tags,
    };

    const { custom_brand, custom_transmission, custom_fuel_type, custom_engine_capacity, custom_regional_spec, features, tags, country_id, city_id, images, ...finalData } = dataToSubmit;

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      Object.keys(finalData).forEach(key => {
        if (finalData[key] !== '' && finalData[key] !== null && finalData[key] !== undefined) {
          if (Array.isArray(finalData[key])) {
            finalData[key].forEach(item => formDataToSend.append(`${key}[]`, item));
          } else {
            formDataToSend.append(key, finalData[key]);
          }
        }
      });

      if (images && images.length > 0) {
        images.forEach(image => {
          formDataToSend.append('images', image);
        });
      }

      const response = await fetch(`${API_BASE_URL}/api/vendor/car/${carId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update car');
      }

      const result = await response.json();
      console.log('Car updated successfully!', result);
      alert('Car updated successfully!');
      onUpdateSuccess();
    } catch (error) {
      console.error('Error updating car:', error);
      alert(`Error updating car: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading car data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-vendor">
      <div className="main-content">
        <div className="form-card">
          <div className="form-header">
            <h2 className="form-title">Edit Car</h2>
            <button
              onClick={onCancel}
              className="close-button"
            >
              <X size={24} />
            </button>
          </div>
          <div className="form-content">
            <div className="grid grid-cols-1 grid-md-2 grid-lg-3">
              <div className="col-span-3">
                <h3 className="section-title">Basic Information</h3>
              </div>
              <InputField label="Car Name" type="text" name="name" value={formData.name} onChange={handleInputChange} required={true} />
              <InputField label="price_per_day" type="number" name="price_per_day" value={formData.price_per_day} onChange={handleInputChange} required={true} min={0} />
              <InputField label="seats" type="number" name="seats" value={formData.seats} onChange={handleInputChange} required={true} min={0} />
              <InputField label="no_of_doors" type="number" name="no_of_doors" value={formData.no_of_doors} onChange={handleInputChange} required={true} min={0} />
              <InputField label="bags" type="number" name="bags" value={formData.bags} onChange={handleInputChange} required={true} min={0} />
              <InputField label="color" type="select" name="color" value={formData.color} onChange={handleInputChange} required options={[{ value: '', label: 'Select color' }, ...staticData.color.map(color => ({ value: color, label: color }))]} />
              <InputField label="Year" type="number" name="year" value={formData.year} onChange={handleInputChange} required={true} min="1900" max="2025" />
              <InputField label="mileage_limit" type="number" name="mileage_limit" value={formData.mileage_limit} onChange={handleInputChange} min={0} />
              <InputField label="additional_mileage_charge" type="number" name="additional_mileage_charge" value={formData.additional_mileage_charge} onChange={handleInputChange} min={0} />
              <InputField label="Category" type="select" name="category_id" value={formData.category_id} onChange={handleInputChange} options={[{ value: '', label: 'Select Category' }, ...apiData.categories.map(cat => ({ value: cat.id, label: cat.name }))]} />
              <InputField label="Brand *" type="select" name="brand" value={formData.brand} onChange={handleInputChange} required options={[{ value: '', label: 'Select Brand' }, ...staticData.brands.map(brand => ({ value: brand, label: brand })), { value: 'other', label: 'Other...' }]} />
              {formData.brand === 'other' && (<InputField label="Enter Custom Brand" type="text" name="custom_brand" value={formData.custom_brand || ''} onChange={handleInputChange} />)}
              <InputField label="Model *" type="text" name="model" value={formData.model} onChange={handleInputChange} required={true} />
              <InputField label="Location" type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="" />
               <InputField label="Region" type="text" name="Region" value={formData.region.name_en} onChange={handleInputChange} placeholder="" />
              <InputField label="Deposit Amount" type="number" name="deposit_amount" value={formData.deposit_amount} onChange={handleInputChange} min={0} />

              <div className="col-span-3">
                <h3 className="section-title">Location</h3>
              </div>
              <InputField label="Country" type="select" name="country_id" value={formData.country_id} onChange={handleInputChange} options={[{ value: '', label: 'Select Country' }, ...apiData.countries.map(country => ({ value: country.id, label: country.name_en }))]} />
              <InputField label="City" type="select" name="city_id" value={formData.city_id} onChange={handleInputChange} disabled={!formData.country_id} options={[{ value: '', label: 'Select City' }, ...apiData.cities.map(city => ({ value: city.id, label: city.name_en }))]} />
              <InputField label="Region" type="select" name="region_id" value={formData.region_id} onChange={handleInputChange} disabled={!formData.city_id} options={[{ value: '', label: 'Select Region' }, ...apiData.regions.map(region => ({ value: region.id, label: region.name_en }))]} />

              <div className="col-span-3">
                <h3 className="section-title">Specifications</h3>
              </div>
              <InputField label="Transmission" type="select" name="transmission" value={formData.transmission} onChange={handleInputChange} options={[{ value: '', label: 'Select Transmission' }, ...staticData.transmissions.map(t => ({ value: t, label: t })), { value: 'other', label: 'Other...' }]} />
              {formData.transmission === 'other' && (<InputField label="Enter Custom Transmission" type="text" name="custom_transmission" value={formData.custom_transmission || ''} onChange={handleInputChange} />)}
              <InputField label="Fuel Type" type="select" name="fuel_type" value={formData.fuel_type} onChange={handleInputChange} options={[{ value: '', label: 'Select Fuel Type' }, ...staticData.fuelTypes.map(ft => ({ value: ft, label: ft })), { value: 'other', label: 'Other...' }]} />
              {formData.fuel_type === 'other' && (<InputField label="Enter Custom Fuel Type" type="text" name="custom_fuel_type" value={formData.custom_fuel_type || ''} onChange={handleInputChange} />)}
              <InputField label="Engine Capacity" type="select" name="engine_capacity" value={formData.engine_capacity} onChange={handleInputChange} options={[{ value: '', label: 'Select Engine Capacity' }, ...staticData.engineCapacities.map(ec => ({ value: ec, label: ec })), { value: 'other', label: 'Other...' }]} />
              {formData.engine_capacity === 'other' && (<InputField label="Enter Custom Engine Capacity" type="text" name="custom_engine_capacity" value={formData.custom_engine_capacity || ''} onChange={handleInputChange} />)}
              <InputField label="Regional Spec" type="select" name="regional_spec" value={formData.regional_spec} onChange={handleInputChange} options={[{ value: '', label: 'Select Regional Spec' }, ...staticData.regionalSpecs.map(rs => ({ value: rs, label: rs })), { value: 'other', label: 'Other...' }]} />
              {formData.regional_spec === 'other' && (<InputField label="Enter Custom Regional Spec" type="text" name="custom_regional_spec" value={formData.custom_regional_spec || ''} onChange={handleInputChange} />)}
              <div className="col-span-3">
                <InputField label="Description" type="textarea" name="description" value={formData.description} onChange={handleInputChange} placeholder="Enter car description..." />
              </div>
              <div className="col-span-3">
                <h3 className="section-title">Car Images</h3>
                <div className="existing-images-container">
                  {existingImages.map((image, index) => (
                    <div key={index} className="existing-image-wrapper">
                     
                       <img src={`${API_BASE_URL}${image.image_url}`} alt={`Car image ${index + 1}`} className="existing-image" />
                    </div>
                  ))}
                </div>
                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                {formData.images.length > 0 && (<p className="text-sm text-gray-600 mt-1">{formData.images.length} new file(s) selected</p>)}
              </div>

              <div className="col-span-3">
                <h3 className="section-title">Insurance Included</h3>
                <InputField label="Insurance Included" type="checkbox" name="insurance_included" checked={formData.insurance_included} onChange={handleInputChange} />
              </div>
              {apiData.tags.length > 0 && (
                <div className="col-span-3">
                  <h3 className="section-title">Tags</h3>
                  <div className="checkbox-grid">
                    {apiData.tags.map((tag, index) => (<InputField key={tag.id} label={tag.name} type="checkbox" name="tags" checked={formData.tags.includes(tag.id)} onChange={() => handleCheckboxChange('tags', tag.id)} index={index} />))}
                  </div>
                </div>
              )}
              {apiData.features.length > 0 && (
                <div className="col-span-3">
                  <h3 className="section-title">Features</h3>
                  <div className="checkbox-grid">
                    {apiData.features.map((feature, index) => (<InputField key={feature.id} label={feature.name} type="checkbox" name="features" checked={formData.features.includes(feature.id)} onChange={() => handleCheckboxChange('features', feature.id)} index={index} />))}
                  </div>
                </div>
              )}
            </div>

            <div className="form-actions">
              <SubmitButton onClick={onCancel} type="secondary" text="Cancel" />
              <SubmitButton onClick={handleSubmit} loading={isSubmitting} type="primary" text="Save Changes" loadingText="Saving..." icon={<Save size={16} />} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCar;