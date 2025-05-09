import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginService from './LoginService';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const user = LoginService.login({...formData})
    if(user)
    {
      console.log('User logged in successfully:', user);
      // Redirect to dashboard or another page
      navigate('/app/dashboard');
    }
    else
    {
      setErrors(prev => ({
        ...prev,
        general: 'Invalid email or password'
      }));
    }
    
  };
  
  return (
    <div className={styles.loginContainer}>
      <div className={styles.formContainer}>
        <div className={styles.headerContainer}>
          <h1 className={styles.title}>Welcome to FitFlick</h1>
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
          
          <Button  type="submit"  fullWidth>
            Log In
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
          <p>Set goals, monitor progress, and achieve your fitness dreams with FitFlick.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 