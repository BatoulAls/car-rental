import React from 'react';
import '../styles/Register.css';

const SubmitButton = ({ text, icon, onClick, disabled = false }) => {
  return (
    <button
      className="submit-button-reg"
      onClick={onClick}
      disabled={disabled}
      style={{
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
    >
      <span className="button-text-reg">{text}</span>
      <span className="button-icon-reg">{icon}</span>
    </button>
  );
};

export default SubmitButton;
