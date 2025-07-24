import React, { useState, useEffect, useCallback } from 'react'; 
import axios from 'axios';
import ProfileDetails from './ProfileDetails';
import RentalHistory from './RentalHistory';
import AccountSettings from './AccountSettings';
import ChangePasswordTab from './ChangePasswordTab';
import Favorites from './Favorites';
import { useAuth } from '../context/AuthContext';
import '../styles/UserProfile.css';

import { useLocation } from 'react-router-dom';

const UserProfileTabs = ({ profileData, setProfileData, loading, error, defaultAvatar }) => {
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const initialTab = queryParams.get('tab') || 'profile';

    const [activeTab, setActiveTab] = useState(initialTab);
    const { token } = useAuth();


    const [rentalHistoryData, setRentalHistoryData] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
        history: []
    });
    const [rentalHistoryLoading, setRentalHistoryLoading] = useState(true);
    const [rentalHistoryError, setRentalHistoryError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const RENTAL_HISTORY_API_ENDPOINT = 'http://localhost:5050/api/bookings/my-bookings/';

    const [favoriteCars, setFavoriteCars] = useState([]);
    const [favoritesLoading, setFavoritesLoading] = useState(true);
    const [favoritesError, setFavoritesError] = useState(null);
    const FAVORITES_API_ENDPOINT = 'http://localhost:5050/api/favorites/'; 

   
    const fetchRentalHistory = useCallback(async () => {
        if (!token) {
            setRentalHistoryLoading(false);
            setRentalHistoryError("Authentication token not found. Please log in.");
            return;
        }

        setRentalHistoryLoading(true);
        setRentalHistoryError(null);

        try {
            const params = {
                page: currentPage,
                limit: rentalHistoryData.limit,
            };

            if (statusFilter !== 'all') {
                params.status = statusFilter;
            }

            const response = await axios.get(RENTAL_HISTORY_API_ENDPOINT, {
                params: params,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setRentalHistoryData(response.data);

        } catch (err) {
            setRentalHistoryError(err.response?.data?.message || err.message || 'Failed to fetch rental history');
            console.error("Error fetching rental history:", err);
        } finally {
            setRentalHistoryLoading(false);
        }
    }, [currentPage, statusFilter, token, rentalHistoryData.limit, RENTAL_HISTORY_API_ENDPOINT]);

   
    const fetchFavoriteCars = useCallback(async () => {
        if (!token) {
            setFavoritesLoading(false);
            setFavoritesError("Authentication token not found. Please log in to view favorites.");
            return;
        }

        setFavoritesLoading(true);
        setFavoritesError(null);

        try {
            const response = await axios.get(FAVORITES_API_ENDPOINT, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
           
            setFavoriteCars(response.data.data || response.data); 
        } catch (err) {
            setFavoritesError(err.response?.data?.message || err.message || 'Failed to fetch favorite cars');
            console.error("Error fetching favorite cars:", err);
        } finally {
            setFavoritesLoading(false);
        }
    }, [token, FAVORITES_API_ENDPOINT]); 

    useEffect(() => {
        if (activeTab === 'history') {
            fetchRentalHistory();
        }
    }, [activeTab, fetchRentalHistory]);

    
    useEffect(() => {
        if (activeTab === 'favorites') {
            fetchFavoriteCars();
        }
    }, [activeTab, fetchFavoriteCars]);

    const handleStatusFilterChange = (status) => {
        setStatusFilter(status);
        setCurrentPage(1);
    };

    const handleBookingActionSuccess = () => {
        fetchRentalHistory();
    };

    
    const handleRemoveFavoriteFromList = (carId) => {
        setFavoriteCars(prevFavorites => prevFavorites.filter(car => car.id !== carId));
     
    };

    const availableStatuses = ['all', 'completed', 'pending', 'cancelled'];

    return (
        <div className="profile-card">
            <div className="inner-card">
                <div className="profile-header-section">
                    <h2 className="profile-title">My Profile</h2>
                    <p className="profile-subtitle">Manage your account and rental preferences</p>
                </div>

                <div className="tab-navigation">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                    >
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
                    >
                        Rental History
                    </button>
                    <button
                        onClick={() => setActiveTab('favorites')}
                        className={`tab-button ${activeTab === 'favorites' ? 'active' : ''}`}
                    >
                        Favorites
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
                    >
                        Settings
                    </button>
                    <button
                        onClick={() => setActiveTab('change-password')}
                        className={`tab-button ${activeTab === 'change-password' ? 'active' : ''}`}
                    >
                        Change Password
                    </button>
                </div>

                {activeTab === 'profile' && (
                    <ProfileDetails
                        profileData={profileData}
                        setProfileData={setProfileData}
                        loading={loading}
                        error={error}
                        token={token}
                        defaultAvatar={defaultAvatar}
                    />
                )}
                {activeTab === 'history' && (
                    <RentalHistory
                        rentalHistory={rentalHistoryData.history}
                        total={rentalHistoryData.total}
                        totalPages={rentalHistoryData.totalPages}
                        loading={rentalHistoryLoading}
                        error={rentalHistoryError}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        statusFilter={statusFilter}
                        setStatusFilter={handleStatusFilterChange}
                        availableStatuses={availableStatuses}
                        token={token}
                        onBookingActionSuccess={handleBookingActionSuccess}
                    />
                )}
                {activeTab === 'favorites' && (
                    <Favorites
                        favorites={favoriteCars} 
                        loading={favoritesLoading} 
                        error={favoritesError}
                        onToggleFavorite={handleRemoveFavoriteFromList} 
                        setFavorites={setFavoriteCars} 
                    />
                )}
                {activeTab === 'settings' && <AccountSettings />}
                {activeTab === 'change-password' && <ChangePasswordTab token={token} />}
            </div>
        </div>
    );
};

export default UserProfileTabs;