import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import styles from './SignupPage.module.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signup(formData.name, formData.email, formData.password);
      console.log('Signup successful!');
      navigate('/app/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
      setErrors({ general: 'Failed to create account. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={styles.signupContainer}>
      <div className={styles.formContainer}>
        <div className={styles.headerContainer}>
          <h1 className={styles.title}>Create Your Account</h1>
          <p className={styles.subtitle}>Join Fit-N to start your fitness journey</p>
        </div>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          {errors.general && (
            <div className={styles.errorAlert}>{errors.general}</div>
          )}
          
          <Input
            id="name"
            name="name"
            type="text"
            label="Full Name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            error={errors.name}
            required
          />
          
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            error={errors.email}
            required
          />
          
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            error={errors.password}
            required
          />
          
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            error={errors.confirmPassword}
            required
          />
          
          <Button
            type="submit"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </Button>
          
          <div className={styles.formFooter}>
            <p>
              Already have an account?{' '}
              <Link to="/login" className={styles.loginLink}>
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
      
      <div className={styles.imageContainer}>
        <div className={styles.overlayContent}>
          <h2>Achieve Your Fitness Goals</h2>
          <p>Track workouts, monitor progress, and reach your personal milestones with Fit-N.</p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage; 