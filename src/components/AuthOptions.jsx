
import React from 'react';
import '../styles/AuthOptions.css'; 

const AuthOptions = ({ rememberMe, onRememberMeChange, onForgotPassword }) => {
  return (
    <div className="auth-options-container">
     
      <label className="remember-me-label">
        <input
          type="checkbox"
          name="rememberMe"
          checked={rememberMe}
          onChange={onRememberMeChange}
          className="remember-me-checkbox"
        />
        <span>Remember me</span>
      </label>

     
      <button
        type="button"
        onClick={onForgotPassword}
        className="forgot-password-button"
      >
        Forgot password?
      </button>
    </div>
  );
};

export default AuthOptions;