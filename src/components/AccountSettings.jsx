
import React from 'react';
import '../styles/UserProfile.css'; 

const AccountSettings = () => {
    return (
        <div className="tab-content">
            <h3 className="section-title">Account Settings</h3>
            <div className="settings-section">
                <div className="setting-item">
                    <div>
                        <h4 className="setting-title">Email Notifications</h4>
                        <p className="setting-description">Receive rental confirmations and updates</p>
                    </div>
                    <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                    </label>
                </div>

                <div className="setting-item">
                    <div>
                        <h4 className="setting-title">SMS Notifications</h4>
                        <p className="setting-description">Receive text messages for important updates</p>
                    </div>
                    <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                    </label>
                </div>

                <div className="setting-item">
                    <div>
                        <h4 className="setting-title">Marketing Communications</h4>
                        <p className="setting-description">Receive promotional offers and deals</p>
                    </div>
                    <label className="switch">
                        <input type="checkbox" />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>

            <div className="danger-zone">
                <h4 className="danger-title">Danger Zone</h4>
                <button className="delete-button">Delete Account</button>
            </div>
        </div>
    );
};

export default AccountSettings;