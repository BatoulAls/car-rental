import React, { useState, useEffect, useCallback } from 'react'; 
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/UserProfile.css';

import ProfileDetails from './ProfileDetails';
import RentalHistory from './RentalHistory'; 
import AccountSettings from './AccountSettings';
import ChangePasswordTab from './ChangePasswordTab';
import Favorites from './Favorites';

const RENTAL_HISTORY_API_ENDPOINT = 'http://localhost:5050/api/bookings/my-bookings/';
const FAVORITES_API_ENDPOINT = 'http://localhost:5050/api/favorites/'; 

const ProfileTabs = ({ profileData, setProfileData, loading, error, defaultAvatar }) => {
    
    const role = profileData?.role;
    const isVendor = role === 'vendor';

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialTab = queryParams.get('tab') || 'profile';

    const [activeTab, setActiveTab] = useState(initialTab);
    const { token } = useAuth();

    const [rentalHistoryData, setRentalHistoryData] = useState({
        total: 0, history: [], totalPages: 1, limit: 10, page: 1,
    });
    const [rentalHistoryLoading, setRentalHistoryLoading] = useState(false);
    const [rentalHistoryError, setRentalHistoryError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');

    const [favoriteCars, setFavoriteCars] = useState([]);
    const [favoritesLoading, setFavoritesLoading] = useState(false);
    const [favoritesError, setFavoritesError] = useState(null);

    const allTabs = {
        profile: { label: isVendor ? 'Vendor Profile' : 'User Profile', component: ProfileDetails },
        history: { label: 'Rental History', component: RentalHistory },
        favorites: { label: 'Favorites', component: Favorites },
        'change-password': { label: 'Change Password', component: ChangePasswordTab },
    };

    const visibleTabs = isVendor
        ? ['profile', 'change-password']
        : ['profile', 'history', 'favorites', 'change-password']; 

   

    const fetchRentalHistory = useCallback(async () => {
        if (!token || isVendor) return; 
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
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setRentalHistoryData(response.data);
        } catch (err) {
            setRentalHistoryError(err.response?.data?.message || 'Failed to fetch rental history');
        } finally {
            setRentalHistoryLoading(false);
        }
    }, [currentPage, statusFilter, token, rentalHistoryData.limit, isVendor]);

    const fetchFavoriteCars = useCallback(async () => {
        if (!token || isVendor) return; 
        setFavoritesLoading(true);
        setFavoritesError(null);

        try {
          
            const response = await axios.get(FAVORITES_API_ENDPOINT, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setFavoriteCars(response.data.data || response.data); 
        } catch (err) {
            setFavoritesError(err.response?.data?.message || 'Failed to fetch favorite cars');
        } finally {
            setFavoritesLoading(false);
        }
    }, [token, isVendor]); 

    useEffect(() => {
        if (!isVendor && activeTab === 'history') {
            fetchRentalHistory();
        }
    }, [activeTab, fetchRentalHistory, isVendor]);

    useEffect(() => {
        if (!isVendor && activeTab === 'favorites') {
            fetchFavoriteCars();
        }
    }, [activeTab, fetchFavoriteCars, isVendor]);

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
    

    if (loading) return <div className="profile-card">Loading profile structure...</div>;

    return (
        <div className="profile-card">
            <div className="inner-card">
                <div className="profile-header-section">
                    <h2 className="profile-title">{isVendor ? 'Vendor Profile Management' : 'My Profile'}</h2>
                    <p className="profile-subtitle">
                        {isVendor ? 'Update your business and login details.' : 'Manage your account and rental preferences.'}
                    </p>
                </div>

                <div className="tab-navigation">
                    {visibleTabs.map((key) => {
                        const tab = allTabs[key];
                        return (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`tab-button ${activeTab === key ? 'active' : ''}`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
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
                
                {activeTab === 'change-password' && <ChangePasswordTab token={token} />}

                {activeTab === 'history' && !isVendor && (
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

                {activeTab === 'favorites' && !isVendor && (
                    <Favorites
                        favorites={favoriteCars} 
                        loading={favoritesLoading} 
                        error={favoritesError}
                        onToggleFavorite={handleRemoveFavoriteFromList} 
                        setFavorites={setFavoriteCars} 
                    />
                )}
                
            </div>
        </div>
    );
};

export default ProfileTabs;