import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/app/dashboard';
  
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
      await login(formData.email, formData.password);
      console.log('Login successful!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
      setErrors({ general: 'Invalid email or password. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={styles.loginContainer}>
      <div className={styles.formContainer}>
        <div className={styles.headerContainer}>
          <h1 className={styles.title}>Welcome to Fit-N</h1>
          <p className={styles.subtitle}>Log in to access your fitness dashboard</p>
        </div>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          {errors.general && (
            <div className={styles.errorAlert}>{errors.general}</div>
          )}
          
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
            placeholder="Enter your password"
            error={errors.password}
            required
          />
          
          <Button
            type="submit"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </Button>
          
          <div className={styles.formFooter}>
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className={styles.signupLink}>
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
      
      <div className={styles.imageContainer}>
        <div className={styles.overlayContent}>
          <h2>Track Your Fitness Journey</h2>
          <p>Set goals, monitor progress, and achieve your fitness dreams with Fit-N.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 