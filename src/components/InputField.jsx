import React from 'react';
import '../styles/Register.css';

const InputField = ({ label, icon, type, name, value, onChange, placeholder, error, index, disabled = false }) => {
  return (
    <div className="form-group" style={{ animationDelay: `${200 + (index * 100)}ms` }}>
      <label className="label-reg">
        <span className="label-icon-reg">{icon}</span> {label}
      </label>
      <div className="input-container-reg">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`input-reg ${error ? 'error' : ''}`}
          placeholder={placeholder}
          disabled={disabled} 
        />
      </div>
      {error && <span className="error-text-reg">{error}</span>}
    </div>
  );
};

export default InputField;
