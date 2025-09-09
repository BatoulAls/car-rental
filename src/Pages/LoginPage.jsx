import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Shape from '../components/Shape';
import FormCard from '../components/FormCard';
import InputField from '../components/InputField';
import SubmitButton from '../components/SubmitButton';
import AuthOptions from '../components/AuthOptions';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import { useAuth } from '../context/AuthContext';
import {useNavigate} from 'react-router-dom'
import '../styles/Login.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
   const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleRememberMeChange = (e) => {
    const { checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      rememberMe: checked,
    }));
  };

  const  handleForgotPasswordClick  = () => {
    setShowForgotPasswordModal(true);
  };
  const handleCloseForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
  };
   const handleEmailLinkSent = (email) => {
   console.log(`Password reset link has been sent to the email: ${email}`);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async () => {
  if (validateForm()) {
    const button = document.querySelector('.submit-button-reg');
    if (button) button.style.transform = 'scale(0.95)';

    try {
      const response = await axios.post('http://localhost:5050/api/auth/login', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const { token, user } = response.data;

      login(token, user);

      console.log('Login successful:', response.data);

      if (button) button.style.transform = 'scale(1)';
      const card = document.querySelector('.register-card-reg');
      if (card) card.style.animation = 'successPulse 0.6s ease-out';

      setTimeout(() => {
        if (card) card.style.animation = '';
        setFormData({
          email: '',
          password: '',
          rememberMe: false,
        });

        if (user.role === 'vendor') {
          navigate('/vendors/MyCars');    
        } else {
          navigate('/');    
        }

      }, 600);

    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      alert('Login failed. Please check your credentials.');
      if (button) button.style.transform = 'scale(1)';
    }
  } else {
    const card = document.querySelector('.register-card-reg');
    if (card) card.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
      if (card) card.style.animation = '';
    }, 500);
  }
};

  return (
    <Shape>
      <FormCard
        title="Welcome Back"
        subtitle="Sign in to your account to continue"
        footerText="Don't have an account?"
        footerLinkText="Sign up"
        footerLinkHref="/register"
        isVisible={isVisible}
      >
        <InputField
          label="Email Address"
          icon="📧"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          error={errors.email}
          index={0}
        />

        <InputField
          label="Password"
          icon="🔒"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Enter your password"
          error={errors.password}
          index={1}
        />

        <AuthOptions
          rememberMe={formData.rememberMe}
          onRememberMeChange={handleRememberMeChange}
          onForgotPassword={handleForgotPasswordClick}
        />

        <SubmitButton text="Log In" icon="✨" onClick={handleSubmit} />
      </FormCard>
      <ForgotPasswordModal
        isVisible={showForgotPasswordModal}   
        onClose={handleCloseForgotPasswordModal}    
        onSendLink={handleEmailLinkSent}  
      />
    </Shape>
  );
};

export default LoginPage;
