import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import UserProfileTabs from '../components/UserProfileTabs'; 
import defaultAvatar from '../images/testimonials/img_avatar.png'; 

const UserProfile = () => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('http://localhost:5050/api/user/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProfileData(response.data);
            } catch (err) {
                console.error('Failed to fetch profile:', err);
                setError(err.response?.data?.message || 'Failed to fetch profile data.');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchProfile();
        }
    }, [token]);

    return (
        <div className="user-profile-container">
            <UserProfileTabs
                profileData={profileData}
                setProfileData={setProfileData}
                loading={loading}
                error={error}
                token={token}
                defaultAvatar={defaultAvatar}
            />
        </div>
    );
};

export default UserProfile;