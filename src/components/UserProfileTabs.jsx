import React, { useState } from 'react';
import ProfileDetails from './ProfileDetails';
import RentalHistory from './RentalHistory';
import AccountSettings from './AccountSettings';
import ChangePasswordTab from './ChangePasswordTab'; 
import '../styles/UserProfile.css';

const UserProfileTabs = ({ profileData, setProfileData, loading, error, token, defaultAvatar }) => {
    const [activeTab, setActiveTab] = useState('profile');

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
                {activeTab === 'history' && <RentalHistory />}
                {activeTab === 'settings' && <AccountSettings />}
                {activeTab === 'change-password' && <ChangePasswordTab token={token} />}
            </div>
        </div>
    );
};

export default UserProfileTabs;