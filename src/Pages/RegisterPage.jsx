import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Shape from '../components/Shape';
import FormCard from '../components/FormCard';
import InputField from '../components/InputField';
import RadioGroupField from '../components/RadioGroupField';
import SubmitButton from '../components/SubmitButton';
import '../styles/Register.css';

const RegisterPage = () => {
  const navigate = useNavigate(); // ← initialize navigation
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'customer'
  });

  const [errors, setErrors] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

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
        const response = await axios.post('http://localhost:5050/api/auth/register', formData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log('API Response:', response.data);

        if (button) button.style.transform = 'scale(1)';
        const card = document.querySelector('.register-card-reg');
        if (card) card.style.animation = 'successPulse 0.6s ease-out';

        setTimeout(() => {
          
          if (card) card.style.animation = '';
          setFormData({
            username: '',
            email: '',
            password: '',
            role: 'customer'
          });
          navigate('/login'); 
        }, 600);
      }
      catch (error) {
  console.error('API Error:', error.response?.data || error.message);

  const apiMessage = error.response?.data?.error || 'Registration failed. Please try again.';

  // Display the error next to the email field if it's related to email
  if (apiMessage.toLowerCase().includes('email')) {
    setErrors(prev => ({ ...prev, email: apiMessage }));
  } else {
    alert(apiMessage);
  }

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

  const radioOptions = [
    { value: 'customer', text: '🛍️ Customer' },
    { value: 'admin', text: '🧑‍💼 Admin' },
    { value: 'vendor', text: '🏪 Vendor' },
  ];

  return (
    <Shape>
      <FormCard
        title="Create Account"
        subtitle="Join us today and start your journey"
        footerText="Already have an account?"
        footerLinkText="Sign in"
        footerLinkHref="/login"
        isVisible={isVisible}
      >
        <InputField
          label="Username"
          icon="👤"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="Enter your username"
          error={errors.username}
          index={0}
        />
        <InputField
          label="Email Address"
          icon="📧"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          error={errors.email}
          index={1}
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
          index={2}
        />
        <RadioGroupField
          label="Account Type"
          icon="👥"
          name="role"
          options={radioOptions}
          selectedValue={formData.role}
          onChange={handleInputChange}
          index={3}
        />
        <SubmitButton
          text="Create Account"
          icon="✨"
          onClick={handleSubmit}
        />
      </FormCard>
    </Shape>
  );
};

export default RegisterPage;
