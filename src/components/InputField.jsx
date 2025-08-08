import React from 'react';
import '../styles/Register.css';

const InputField = ({
  label,
  icon,
  type,
  name,
  value,
  onChange,
  placeholder,
  error,
  index,
  disabled = false,
  options = [],
  min,        
  max        
}) => {
 
  if (type === 'checkbox') {
    return (
      <div className="form-group form-group-checkbox" style={{ animationDelay: `${200 + index * 100}ms` }}>
        <label className="checkbox-label-reg">
          <input
            type="checkbox"
            name={name}
            checked={value} 
            onChange={onChange}
            disabled={disabled}
            className={`checkbox-input-reg ${error ? 'error' : ''}`}
          />
          <span className="checkbox-text-reg">
            <span className="label-icon-reg">{icon}</span> {label}
          </span>
        </label>
        {error && <span className="error-text-reg">{error}</span>}
      </div>
    );
  }


  const renderInput = () => {
    if (type === 'textarea') {
      return (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`input-reg ${error ? 'error' : ''}`}
          rows="5"
        />
      );
    }

    
    if (type === 'select') {
      return (
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`input-reg ${error ? 'error' : ''}`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

   
    return (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`input-reg ${error ? 'error' : ''}`}
        placeholder={placeholder}
        disabled={disabled}
        min={min}        
       max={max} 
      />
    );
  };


  return (
    <div className="form-group" style={{ animationDelay: `${200 + index * 100}ms` }}>
      <label className="label-reg">
        <span className="label-icon-reg">{icon}</span> {label}
      </label>
      <div className="input-container-reg">
        {renderInput()}
      </div>
      {error && <span className="error-text-reg">{error}</span>}
    </div>
  );
};

export default InputField;
