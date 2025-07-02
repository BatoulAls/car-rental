
import React, { useState } from 'react';
import axios from 'axios';
import InputField from '../components/InputField';
import '../styles/ChangePasswordTab.css';
import { useNavigate } from 'react-router-dom';

const ChangePasswordTab = ({ token }) => {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [fieldErrors, setFieldErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setFieldErrors({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });

    let hasError = false;

    if (!currentPassword.trim()) {
      setFieldErrors(prev => ({ ...prev, currentPassword: 'Please enter your current password.' }));
      hasError = true;
    }

    if (!newPassword.trim()) {
      setFieldErrors(prev => ({ ...prev, newPassword: 'Please enter a new password.' }));
      hasError = true;
    } else if (newPassword.length < 6) {
      setFieldErrors(prev => ({ ...prev, newPassword: 'Password must be at least 6 characters.' }));
      hasError = true;
    }

    if (newPassword !== confirmNewPassword) {
      setFieldErrors(prev => ({ ...prev, confirmNewPassword: "New passwords don't match." }));
      hasError = true;
    }

    if (hasError) {
      setError('Please fix the errors before submitting.');
      return;
    }

    try {
      const response = await axios.put(
        'http://localhost:5050/api/user/change-password',
        {
          currentPassword,
          newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      setMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');

     
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err) {
      console.error('Password change error:', err);
      setError(err.response?.data?.message || 'Failed to change password. Please try again.');
    }
  };

  return (
    <div className="change-password-container">
      <h3>Change Password</h3>
      <p>Update your account password below.</p>
      <form onSubmit={handleSubmit} className="password-form">
        <InputField
          label="Current Password"
          icon="🔒"
          type="password"
          name="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Enter current password"
          error={fieldErrors.currentPassword}
          index={0}
        />
        <InputField
          label="New Password"
          icon="🔑"
          type="password"
          name="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          error={fieldErrors.newPassword}
          index={1}
        />
        <InputField
          label="Confirm New Password"
          icon="🔑"
          type="password"
          name="confirmNewPassword"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          placeholder="Confirm new password"
          error={fieldErrors.confirmNewPassword}
          index={2}
        />

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="submit-button">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePasswordTab;
