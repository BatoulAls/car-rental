import React, { useState, useEffect} from 'react';
import axios from 'axios';
import ProfileAvatar from './ProfileAvatar';
import InputField from '../components/InputField.jsx'; 
import Message from '../components/Message.jsx';
import '../styles/UserProfile.css';

const USER_UPDATE_URL = 'http://localhost:5050/api/user/profile';
const VENDOR_UPDATE_URL = 'http://localhost:5050/api/vendor/profile';
const VENDOR_WORKING_HOURS_URL = 'http://localhost:5050/api/vendor/profile/update_workingHours';
const VENDOR_PROFILE_IMAGE_URL = 'http://localhost:5050/api/vendor/profile/update_profileImage';
const VENDOR_STATUS_URL = 'http://localhost:5050/api/vendor/profile/update_status';

const ProfileDetails = ({ profileData, setProfileData, loading, error, token, defaultAvatar }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
    const [selectedBackgroundFile, setSelectedBackgroundFile] = useState(null);
    // for message 
    const[message,setMessage] = useState('');
    const[messageStatus,setMessageStatus] = useState('');
    const showMessage=(msg,type='success')=>{
        setMessage(msg);
        setMessageStatus(type);
        setTimeout(()=>setMessage(''),3000);
    }


    const getVendorStatus = () => profileData?.is_active ?? profileData?.Vendor?.is_active ?? 0;

    const [vendorStatus, setVendorStatus] = useState(getVendorStatus());

    useEffect(() => {
        setVendorStatus(getVendorStatus());
    }, [profileData]);

    const [workingHours, setWorkingHours] = useState({
        shopOpenTime: profileData?.shopOpenTime || '',
        shopCloseTime: profileData?.shopCloseTime || '',
        open_24_7: profileData?.open_24_7 || 0,
    });

    useEffect(() => {
        setWorkingHours({
            shopOpenTime: profileData?.shopOpenTime || '',
            shopCloseTime: profileData?.shopCloseTime || '',
            open_24_7: profileData?.open_24_7 || 0,
        });
    }, [profileData]);

    const isVendor = profileData?.role === 'vendor';

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'open_24_7') {
            setWorkingHours(prev => ({ ...prev, [name]: type === 'checkbox' ? (checked ? 1 : 0) : value }));
        } else if (['shopOpenTime', 'shopCloseTime'].includes(name)) {
            setWorkingHours(prev => ({ ...prev, [name]: value }));
        } else {
            setProfileData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handlePhotoFileChange = (e) => setSelectedPhotoFile(e.target.files[0]);
    const handleBackgroundFileChange = (e) => setSelectedBackgroundFile(e.target.files[0]);

    const handleToggleStatus = async (e) => {
        if (!isVendor) return;
        const newStatus = e.target.checked ? 1 : 0;
        setVendorStatus(newStatus);

        try {
            const payload = { status: newStatus };
            const response = await axios.patch(VENDOR_STATUS_URL, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            setProfileData(prev => ({
                ...prev,
                is_active: newStatus,
            }));

           
            showMessage(response.data.Message || 'Vendor status update','success')

        } catch (err) {
            console.error('Failed to update vendor status:', err.response?.data || err.message);
            setVendorStatus(prev => prev === 1 ? 0 : 1);
            
           showMessage(err.response?.data?.Message || 'Failed to update vendor status.please try again','error')
        }
    };

    const handleSaveProfileImage = async () => {
        if (!selectedPhotoFile || !isVendor) return;

        try {
            const formData = new FormData();
            formData.append('profileImage', selectedPhotoFile, selectedPhotoFile.name);

            const response = await axios.patch(VENDOR_PROFILE_IMAGE_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

        
            showMessage(response.data.Message || 'profile image update','success')
            setSelectedPhotoFile(null);

        } catch (err) {
            console.error('Failed to update profile image:', err.response?.data || err.message);
         
            showMessage(err.response?.data?.Message || 'Failed to update profile image. plesae try again', 'error')
        }
    };

    const handleSaveWorkingHours = async () => {
        try {
            const payload = {
                shop_open_time: workingHours.shopOpenTime ? workingHours.shopOpenTime.substring(0, 5) : null,
                shop_close_time: workingHours.shopCloseTime ? workingHours.shopCloseTime.substring(0, 5) : null,
                open_24_7: parseInt(workingHours.open_24_7, 10),
            };

            const response = await axios.patch(VENDOR_WORKING_HOURS_URL, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            setProfileData(prev => ({
                ...prev,
                shopOpenTime: payload.shop_open_time,
                shopCloseTime: payload.shop_close_time,
                open_24_7: payload.open_24_7,
            }));

            showMessage(response.data.Message|| 'working hours update','success')
        } catch (err) {
            console.error('Failed to update working hours:', err.response?.data || err.message);
            showMessage(err.response?.data?.Message|| 'Failed to update working hours.please try again','error')
        }
    };

    const handleSaveProfile = async () => {
        try {
            const formData = new FormData();
            
            if (profileData?.username) formData.append('username', profileData.username);
            if (profileData?.phone) formData.append('phone', profileData.phone);

            let apiURL = USER_UPDATE_URL;
            let responseKey = 'user';

            if (isVendor) {
                apiURL = VENDOR_UPDATE_URL;

                if (profileData?.vendorName) formData.append('name', profileData.vendorName);
                if (profileData?.description !== undefined) formData.append('description', profileData.description || '');
                if (profileData?.region_id) formData.append('region_id', String(profileData.region_id));

                if (selectedBackgroundFile) {
                    formData.append('background', selectedBackgroundFile, selectedBackgroundFile.name);
                }
            }

            const response = await axios.put(apiURL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            let updatedDataFromApi = response.data[responseKey] || {};
            const newProfileData = { ...profileData };

            if (isVendor) {
                const updatedVendorData = updatedDataFromApi.Vendor || {};
                newProfileData.username = updatedDataFromApi.username;
                newProfileData.phone = updatedDataFromApi.phone;
                newProfileData.photo = updatedDataFromApi.photo;
                newProfileData.vendorName = updatedVendorData.name;
                newProfileData.description = updatedVendorData.description;
                newProfileData.region_id = updatedVendorData.region_id;
                newProfileData.background_image = updatedVendorData.background_image;
            } else {
                Object.assign(newProfileData, updatedDataFromApi);
            }

            const prefix = 'http://localhost:5050';
            if (newProfileData.photo && !newProfileData.photo.startsWith('http')) {
                newProfileData.photo = `${prefix}${newProfileData.photo}`;
            }
            if (isVendor && newProfileData.background_image && !newProfileData.background_image.startsWith('http')) {
                newProfileData.background_image = `${prefix}${newProfileData.background_image}`;
            }

            setProfileData(newProfileData);
            setSelectedBackgroundFile(null);
            setIsEditing(false);

        } catch (err) {
            console.error('Failed to update profile:', err.response?.data || err.message);
            showMessage(err.response?.data?.Message|| 'Failed to update profile.please try again','error')
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setSelectedPhotoFile(null);
        setSelectedBackgroundFile(null);
        setWorkingHours({
            shopOpenTime: profileData?.shopOpenTime || '',
            shopCloseTime: profileData?.shopCloseTime || '',
            open_24_7: profileData?.open_24_7 || 0,
        });
    };

    if (loading) return <div className="tab-content">Loading profile data...</div>;
    if (error) return <div className="tab-content">Error: {error}</div>;
    if (!profileData) return <div className="tab-content">No profile data available.</div>;

    const isPhotoDirty = isEditing && selectedPhotoFile !== null;
    const isHoursDirty = isEditing && (
        workingHours.shopOpenTime !== (profileData?.shopOpenTime || '') ||
        workingHours.shopCloseTime !== (profileData?.shopCloseTime || '') ||
        String(workingHours.open_24_7) !== String(profileData?.open_24_7 || 0)
    );

    return (
        <div className="tab-content">
            {isVendor && (
                <div className="vendor-background" style={{ 
                    backgroundImage: `url(${profileData?.background_image || ''})`, 
                    minHeight: isEditing ? '150px' : '0' 
                }}>
                    {isEditing && (
                        <>
                            <input type="file" id="background-upload" name="background" style={{ display: 'none' }} onChange={handleBackgroundFileChange} accept="image/*"/>
                            <label htmlFor="background-upload" className="background-button" style={{ cursor: 'pointer' }}>
                                {selectedBackgroundFile ? selectedBackgroundFile.name : 'Change Background'}
                            </label>
                        </>
                    )}
                </div>
            )}

            <div className="profile-details-header">
                <div className="avatar-container">
                    <ProfileAvatar
                        profilePhoto={profileData?.photo}
                        selectedFile={selectedPhotoFile}
                        defaultAvatar={defaultAvatar}
                    />
                    {isEditing && (
                        <div className="avatar-actions">
                            <input type="file" id="photo-upload" style={{ display: 'none' }} onChange={handlePhotoFileChange} accept="image/*"/>
                            <label htmlFor="photo-upload" className="avatar-button" style={{ cursor: 'pointer' }}>
                                {selectedPhotoFile ? selectedPhotoFile.name : 'Change Photo'}
                            </label>
                            {isVendor && isPhotoDirty && (
                                <button onClick={handleSaveProfileImage} className="save-button" style={{ marginLeft: '10px' }}>
                                    Save Photo
                                </button>
                            )}
                        </div>
                    )}
                </div>
                
                <div className="profile-info">
                    <h3 className="profile-name">
                        {isVendor ? profileData?.vendorName || profileData?.username : profileData?.username}
                        {isVendor && (
                            <span className={`status-badge ${vendorStatus === 1 ? 'active' : 'inactive'}`}>
                                {vendorStatus === 1 ? 'Active' : 'Inactive'}
                            </span>
                        )}
                    </h3>
                    <p className="profile-email">{profileData?.email}</p>
                    <div className="profile-actions">
                        {!isEditing ? (
                            <button onClick={() => setIsEditing(true)} className="edit-button">
                                Edit Profile
                            </button>
                        ) : (
                            <div className="edit-actions">
                                <button onClick={handleSaveProfile} className="save-button">
                                    Save Details
                                </button>
                                <button onClick={handleCancelEdit} className="cancel-button">
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
{message && <Message message={message} status={messageStatus} />}

            <div className="form-grid">
                {isVendor && (
                    <InputField
                        label="Vendor Name"
                        type="text"
                        name="vendorName"
                        value={profileData?.vendorName || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                )}

                <InputField
                    label="Username"
                    type="text"
                    name="username"
                    value={profileData?.username || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                />

                <InputField
                    label="Email"
                    type="email"
                    name="email"
                    value={profileData?.email || ''}
                    disabled={true}
                />

                <InputField
                    label="Phone"
                    type="tel"
                    name="phone"
                    value={profileData?.phone || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                />

                {isVendor && (
                    <>
                        <InputField
                            label={vendorStatus === 1 ? 'Currently Active' : 'Currently Inactive'}
                            type="checkbox" 
                            name="is_active_toggle"
                            checked={vendorStatus === 1}
                            onChange={handleToggleStatus} 
                            disabled={!isEditing}
                        />
                        <InputField
                            label="Open 24/7"
                            type="checkbox" 
                            name="open_24_7"
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                        <InputField
                            label="Shop Open Time"
                            type="time"
                            name="shopOpenTime"
                            value={workingHours.shopOpenTime ? workingHours.shopOpenTime.substring(0, 5) : ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                        <InputField
                            label="Shop Close Time"
                            type="time"
                            name="shopCloseTime"
                            value={workingHours.shopCloseTime ? workingHours.shopCloseTime.substring(0, 5) : ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />

                        {isEditing && isHoursDirty && (
                            <div className="form-group">
                                <label className="form-label">&nbsp;</label>
                                <button onClick={handleSaveWorkingHours} className="save-button full-width">
                                    Save Hours
                                </button>
                            </div>
                        )}

                        <div className="form-group full-width">
                            <InputField
                                label="Description"
                                type="textarea"
                                name="description"
                                value={profileData?.description || ''}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfileDetails;
