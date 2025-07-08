
import React, { useState } from 'react';
import PopUpModal from './PopUpModal';
import InputField from './InputField';
import SubmitButton from './SubmitButton';
import axios from 'axios';


const ForgotPasswordModal = ({ isVisible, onClose, onSendLink }) => { 
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      setMessage('Reset link sent!');
      if (onSendLink) {
        onSendLink(email);
      }
    } catch (err) {
      setMessage('Failed to send link.');
    }
  };

  return (
    <PopUpModal isVisible={isVisible} onClose={onClose}>
      <h2 className="title-Booking">Reset Password</h2>
      <InputField value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      {message && <p>{message}</p>}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        <SubmitButton text="Close" onClick={onClose} />
        <SubmitButton text="Send" onClick={handleSend} />
      </div>
    </PopUpModal>
  );
};
export default ForgotPasswordModal;