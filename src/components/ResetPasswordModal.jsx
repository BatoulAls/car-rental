import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SubmitButton from './SubmitButton';
import InputField from './InputField';

const ResetPasswordModal = () => {
  const { token } = useParams();      
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setMessage('');
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5050/api/auth/reset-password', {
        token,
         newPassword: password, 
      });
      setMessage(response.data.message || 'Password has been reset successfully.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Your Password</h2>
      <InputField
        label="New Password"
        icon="🔒"
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter new password"
        disabled={isLoading}
      />
      <InputField
        label="Confirm Password"
        icon="🔒"
        type="password"
        name="confirmPassword"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm new password"
        disabled={isLoading}
      />
      {message && (
        <p style={{ color: message.toLowerCase().includes('failed') ? 'red' : 'green' }}>
          {message}
        </p>
      )}
      <SubmitButton
        text={isLoading ? 'Resetting...' : 'Reset Password'}
        onClick={handleSubmit}
        disabled={isLoading}
      />
    </div>
  );
};

export default ResetPasswordModal;
