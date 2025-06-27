// src/components/ProfileDetails.jsx
import React, { useState } from 'react';
import axios from 'axios';
import ProfileAvatar from './ProfileAvatar'; 
import '../styles/UserProfile.css'; 

const ProfileDetails = ({ profileData, setProfileData, loading, error, token, defaultAvatar }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null); 

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSaveProfile = async () => {
        try {
            const formData = new FormData();
            if (profileData.username) formData.append('username', profileData.username);
            if (profileData.phone) formData.append('phone', profileData.phone);
            if (selectedFile) formData.append('photo', selectedFile);

            const response = await axios.put('http://localhost:5050/api/user/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            setProfileData(response.data);
            setIsEditing(false);
            setSelectedFile(null);
            alert('Profile updated successfully!');
        } catch (err) {
            console.error('Failed to update profile:', err);
            alert(err.response?.data?.message || 'Failed to update profile. Please try again.');
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setSelectedFile(null);
    };

    if (loading) {
        return <div className="tab-content">Loading profile data...</div>;
    }

    if (error) {
        return <div className="tab-content">Error: {error}</div>;
    }

    if (!profileData) {
        return <div className="tab-content">No profile data available.</div>;
    }

    return (
        <div className="tab-content">
            <div className="profile-details-header">
                <div className="avatar-container">
                    <ProfileAvatar 
                        profilePhoto={profileData.photo} 
                        selectedFile={selectedFile} 
                        defaultAvatar={defaultAvatar} 
                    />
                    {isEditing && (
                        <>
                            <input
                                type="file"
                                id="photo-upload"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                            <label htmlFor="photo-upload" className="avatar-button" style={{ cursor: 'pointer' }}>
                                Change Photo
                            </label>
                        </>
                    )}
                    {!isEditing && (
                        <button className="avatar-button" style={{ cursor: 'default' }}>
                            View Photo
                        </button>
                    )}
                </div>
                <div className="profile-info">
                    <h3 className="profile-name">
                        {profileData.username}
                    </h3>
                    <p className="profile-email">{profileData.email}</p>
                    <div className="profile-actions">
                        {!isEditing ? (
                            <button onClick={() => setIsEditing(true)} className="edit-button">
                                Edit Profile
                            </button>
                        ) : (
                            <div className="edit-actions">
                                <button onClick={handleSaveProfile} className="save-button">
                                    Save Changes
                                </button>
                                <button onClick={handleCancelEdit} className="cancel-button">
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={profileData.username || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`form-input ${!isEditing ? 'disabled' : ''}`}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={profileData.email || ''}
                        onChange={handleInputChange}
                        disabled={true}
                        className="form-input disabled"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={profileData.phone || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`form-input ${!isEditing ? 'disabled' : ''}`}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProfileDetails;