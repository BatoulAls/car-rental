import React from 'react';
import '../styles/Register.css';

const RadioGroupField = ({ label, icon, name, options, selectedValue, onChange, index }) => {
  return (
    <div className="form-group" style={{ animationDelay: `${200 + (index * 100)}ms` }}>
      <label className="label-reg">
        <span className="label-icon-reg">{icon}</span> {label}
      </label>
      <div className="radio-group-reg">
        {options.map((option) => (
          <label
            key={option.value}
            className={`radio-label-reg ${selectedValue === option.value ? 'active' : ''}`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={onChange}
              className="radio-input-reg"
            />
            <span className="radio-text-reg">{option.text}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroupField;