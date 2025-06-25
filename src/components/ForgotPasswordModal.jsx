import React, { useState } from 'react';
import axios from 'axios';
import SubmitButton from './SubmitButton';
import InputField from './InputField';
import '../styles/ForgotPasswordModal.css';

const ForgotPasswordModal = ({ isVisible, onClose, onSendLink }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setMessage('');
  
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5050/api/auth/forgot-password', { email });

      
      const successMessage = response.data.message || response.data.msg || 'A reset link has been sent to your email.';

      setMessage(successMessage);

      if (onSendLink) onSendLink(email);


    } catch (error) {
      console.error('Failed to send reset link:', error.response?.data || error.message);

      const errMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Something went wrong. Please try again later.';

      setMessage(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          width: '90%',
          maxWidth: '400px',
          textAlign: 'center',
        }}
      >
        <h1 className="title-for">Reset Password</h1>
        <div className="title-underline-for"></div>
        <p className="subtitle-for">Please enter your email to receive a password reset link.</p>

        <InputField
          label="Email Address"
          icon="📧"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={isLoading}
          index={0}
        />

        {message && (
          <p
            style={{
              color:
                message.toLowerCase().includes('fail') || message.toLowerCase().includes('error')
                  ? 'red'
                  : 'green',
              marginBottom: '1rem',
            }}
          >
            {message}
          </p>
        )}

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
            marginTop: '1rem',
          }}
        >
          <SubmitButton text="Close" onClick={onClose} disabled={isLoading} />
          <SubmitButton text={isLoading ? 'Sending...' : 'Send'} onClick={handleSubmit} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
