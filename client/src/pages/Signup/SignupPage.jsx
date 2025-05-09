import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import styles from './SignupPage.module.css';
import SignupService from './SignupService';
const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});


  const handleSubmit = async (e) => {
    e.preventDefault();
    if(formData.password !== formData.confirmPassword) {
      setErrors({ ...errors, confirmPassword: 'Passwords do not match' });
      return;
    }
    const data = await SignupService.register(formData);
    if(data)
      console.log('User registered successfully:', data);
    else
      setErrors({ ...errors, general: 'Registration failed. Please try again.' });
      
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear error for the field being edited
  }
  
  return (
    <div className={styles.signupContainer}>
      <div className={styles.formContainer}>
        <div className={styles.headerContainer}>
          <h1 className={styles.title}>Create Your Account</h1>
          <p className={styles.subtitle}>Join FitFlick to start your fitness journey</p>
        </div>
        
        <form className={styles.form} method='post' onSubmit={handleSubmit}>
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
          
          <Button type="submit"fullWidth>
             Sign Up
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
          <p>Track workouts, monitor progress, and reach your personal milestones with FitFlick.</p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage; 