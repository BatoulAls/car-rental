import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from'../../context/AuthContext'
import ProfileTabs from '../../components/UserProfileTabs' 
import defaultAvatar from '../../images/testimonials/img_avatar.png'; 

const VENDOR_API_URL = 'http://localhost:5050/api/vendor/profile';


const VendorProfile = () => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();
    

    const transformApiData = (data) => {
        if (!data || !data.data) return null;
        
        const userData = data.data;
        const vendorData = userData.Vendor || {};

        return {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            phone: userData.phone,
            photo: userData.photo,
            role: userData.role,
            
            vendorId: vendorData.id,
            vendorName: vendorData.name,
            vendorPhone: vendorData.phone,
            description: vendorData.description,
            shopOpenTime: vendorData.shop_open_time,
            shopCloseTime: vendorData.shop_close_time,
            open247: vendorData.open_24_7,
            region: vendorData.Region ? vendorData.Region.name_en : null,
            backgroundImage: vendorData.background_image,
        };
    };

    const fetchProfileData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(VENDOR_API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const transformedData = transformApiData(response.data);

            if (transformedData && transformedData.photo && !transformedData.photo.startsWith('http')) {
                transformedData.photo = `http://localhost:5050${transformedData.photo}`;
            }

            setProfileData(transformedData);
        } catch (err) {
            console.error('Failed to fetch vendor profile:', err);
            setError(err.response?.data?.message || 'Unable to load vendor profile.');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchProfileData();
        } else {
            setLoading(false);
            setError('Authentication token is missing');
        }
    }, [fetchProfileData, token]);


    return (
        
        <div className="user-profile-container">
            
            
            <ProfileTabs 
                profileData={profileData} 
                setProfileData={setProfileData} 
                loading={loading} 
                error={error} 
                defaultAvatar={defaultAvatar} 
            />
        </div>
    );
};

export default VendorProfile;