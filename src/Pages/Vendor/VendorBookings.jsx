import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Calendar, User, Car, DollarSign, MapPin, Clock } from 'lucide-react';
import AdvancedFilter from '../../components/AdvancedFilters.jsx';
import '../../styles/VendorBookings.css';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';


const VendorBookings = () => {
  const navigate = useNavigate();
  const { token } = useAuth(); 
  const [bookings, setBookings] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    brand: '',
    transmission: '',
    fuel_type: '',
    payment_method: '',
    location: '',
    year_from: '',
    year_to: '',
    price_from: '',
    price_to: '',
    seats: '',
    insurance_included: '',
    customer_verified: '',
    date_from: '',
    date_to: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchBookings = async () => {
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.date_from) params.start_date = filters.date_from;
      if (filters.date_to) params.end_date = filters.date_to;

      const response = await axios.get('http://localhost:5050/api/vendor/booking', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params
      });

      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      brand: '',
      transmission: '',
      fuel_type: '',
      payment_method: '',
      location: '',
      year_from: '',
      year_to: '',
      price_from: '',
      price_to: '',
      seats: '',
      insurance_included: '',
      customer_verified: '',
      date_from: '',
      date_to: ''
    });
    setSearchTerm('');
  };

  const filterOptions = useMemo(() => {
    return {
      status: [...new Set(bookings.map(b => b.status))],
      brand: [...new Set(bookings.map(b => b.Car.brand))],
      transmission: [...new Set(bookings.map(b => b.Car.transmission))],
      fuel_type: [...new Set(bookings.map(b => b.Car.fuel_type))],
      payment_method: [...new Set(bookings.map(b => b.payment_method))],
      location: [...new Set(bookings.map(b => b.Car.location))],
      seats: [...new Set(bookings.map(b => b.Car.seats))].sort((a, b) => a - b)
    };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      if (searchTerm && !(
        booking.Car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.Car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.Car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.User.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.User.email.toLowerCase().includes(searchTerm.toLowerCase())
      )) return false;

      if (filters.brand && booking.Car.brand !== filters.brand) return false;
      if (filters.transmission && booking.Car.transmission !== filters.transmission) return false;
      if (filters.fuel_type && booking.Car.fuel_type !== filters.fuel_type) return false;
      if (filters.payment_method && booking.payment_method !== filters.payment_method) return false;
      if (filters.location && booking.Car.location !== filters.location) return false;
      if (filters.year_from && booking.Car.year < parseInt(filters.year_from)) return false;
      if (filters.year_to && booking.Car.year > parseInt(filters.year_to)) return false;
      if (filters.price_from && booking.total_price < parseInt(filters.price_from)) return false;
      if (filters.price_to && booking.total_price > parseInt(filters.price_to)) return false;
      if (filters.seats && booking.Car.seats !== parseInt(filters.seats)) return false;
      if (filters.insurance_included !== '' && booking.Car.insurance_included !== (filters.insurance_included === 'true')) return false;
      if (filters.customer_verified !== '' && booking.User.is_verified !== (filters.customer_verified === 'true')) return false;
      if (filters.date_from && new Date(booking.start_date) < new Date(filters.date_from)) return false;
      if (filters.date_to && new Date(booking.end_date) > new Date(filters.date_to)) return false;

      return true;
    });
  }, [bookings, filters, searchTerm]);

  const activeFiltersCount = Object.values(filters).filter(v => v !== '').length + (searchTerm ? 1 : 0);

  const formatDate = dateString => new Date(dateString).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' });
  const formatPrice = price => `$${price.toLocaleString()}`;
  const getStatusColor = status => {
    switch(status.toLowerCase()) {
      case 'confirmed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };
  const calculateDays = (start, end) => Math.ceil((new Date(end) - new Date(start)) / (1000*60*60*24));
  const handleViewDetails = (bookingId) => {
    navigate(`/vendorsbooking-details/${bookingId}`);
  }

  return (
    <div className="container-vendor-booking">
      <div className="header-vendor-booking">
        <h1 className="title-vendor-booking">Car Bookings Dashboard</h1>
        <p className="subtitle-vendor-booking">Manage and track your vehicle rentals</p>
      </div>

      <AdvancedFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        handleFilterChange={handleFilterChange}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        clearFilters={clearFilters}
        activeFiltersCount={activeFiltersCount}
        filterOptions={filterOptions}
      />

      <div className="stats-container-vendor-booking">
        <div className="stat-card-vendor-booking">
          <Calendar size={24} color="#ff4d30" />
          <div>
            <h3 className="stat-number-vendor-booking">{filteredBookings.length}</h3>
            <p className="stat-label-vendor-booking">
              {filteredBookings.length === bookings.length ? 'Total Bookings' : `Filtered Bookings (${bookings.length} total)`}
            </p>
          </div>
        </div>
        <div className="stat-card-vendor-booking">
          <DollarSign size={24} color="#ff4d30" />
          <div>
            <h3 className="stat-number-vendor-booking">
              {formatPrice(filteredBookings.reduce((sum,b) => sum + b.total_price,0))}
            </h3>
            <p className="stat-label-vendor-booking">Revenue from Results</p>
          </div>
        </div>
      </div>

      <div className="bookings-grid-vendor-booking">
        {filteredBookings.map(booking => (
          <div key={booking.id} className="booking-card-vendor-booking">
            <div className="card-header-vendor-booking">
              <div>Booking #{booking.id}</div>
              <div style={{ backgroundColor: getStatusColor(booking.status) }}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </div>
            </div>
            <div className="card-content-vendor-booking">
              <div>
                <Car size={20} color="#ff4d30" />
                <h3>{booking.Car.brand} {booking.Car.model} ({booking.Car.year})</h3>
                <p>{booking.Car.name}</p>
              </div>
              <div>
                <User size={16} color="#666" />
                <p>{booking.User.username} {booking.User.is_verified && '✓'}</p>
                <p>{booking.User.email}</p>
              </div>
              <div>
                <Calendar size={16} color="#666" />
                <p>{formatDate(booking.start_date)} - {formatDate(booking.end_date)}</p>
                <Clock size={16} color="#666" />
                <p>Duration: {calculateDays(booking.start_date, booking.end_date)} days</p>
                <MapPin size={16} color="#666" />
                <p>{booking.Car.location}</p>
              </div>
              <div>
                <p>{formatPrice(booking.Car.price_per_day)}/day • {booking.Car.seats} seats • {booking.Car.transmission}</p>
                <p>{booking.payment_method} • {booking.Car.insurance_included ? 'Insurance ✓' : 'No Insurance'}</p>
                <p>Total: {formatPrice(booking.total_price)}</p>
              </div>
            </div>
            <div className="card-actions-vendor-booking">
               <button onClick={() => handleViewDetails(booking.id)}>View Details</button>
              <button>Contact Customer</button>
            </div>
          </div>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="no-results-vendor-booking">
          <h3>No bookings found</h3>
          <button onClick={clearFilters}>Clear All Filters</button>
        </div>
      )}
    </div>
  );
};

export default VendorBookings;
