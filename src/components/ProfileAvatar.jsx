
import React from 'react';
import '../styles/UserProfile.css'; 

const ProfileAvatar = ({ profilePhoto, selectedFile, defaultAvatar }) => {
    let imageUrl = defaultAvatar;

    if (selectedFile) {
        imageUrl = URL.createObjectURL(selectedFile);
    } else if (profilePhoto) {
        imageUrl = profilePhoto;
    }

    return (
        <div className="avatar">
            <img
                src={imageUrl}
                alt="Profile Avatar"
                className="avatar-image"
                onError={(e) => {
                    e.target.src = defaultAvatar;
                }}
            />
        </div>
    );
};

export default ProfileAvatar;