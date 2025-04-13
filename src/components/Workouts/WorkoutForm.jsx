import React, { useState, useEffect } from 'react';
import Button from '../UI/Button';
import Input from '../UI/Input';
import styles from './WorkoutForm.module.css';
import { FaDumbbell, FaRunning, FaSwimmer, FaWalking, FaBicycle } from 'react-icons/fa';

const workoutTypes = [
  { id: 'running', label: 'Running', icon: <FaRunning /> },
  { id: 'cycling', label: 'Cycling', icon: <FaBicycle /> },
  { id: 'swimming', label: 'Swimming', icon: <FaSwimmer /> },
  { id: 'walking', label: 'Walking', icon: <FaWalking /> },
  { id: 'weight_training', label: 'Weight Training', icon: <FaDumbbell /> }
];

const WorkoutForm = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    type: '',
    duration: '',
    distance: '',
    calories: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [errors, setErrors] = useState({});

  // Initialize the form with data if provided (for editing mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type || '',
        duration: initialData.duration || '',
        distance: initialData.distance || '',
        calories: initialData.calories || '',
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      });
    }
  }, [initialData]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is filled
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleTypeSelect = (type) => {
    setFormData(prev => ({
      ...prev,
      type
    }));
    
    if (errors.type) {
      setErrors(prev => ({
        ...prev,
        type: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.type) {
      newErrors.type = 'Please select a workout type';
    }
    
    if (!formData.duration) {
      newErrors.duration = 'Duration is required';
    } else if (isNaN(formData.duration) || Number(formData.duration) <= 0) {
      newErrors.duration = 'Please enter a valid duration';
    }
    
    if (formData.distance && (isNaN(formData.distance) || Number(formData.distance) <= 0)) {
      newErrors.distance = 'Please enter a valid distance';
    }
    
    if (!formData.calories) {
      newErrors.calories = 'Calories is required';
    } else if (isNaN(formData.calories) || Number(formData.calories) <= 0) {
      newErrors.calories = 'Please enter a valid calorie value';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    return newErrors;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    // Convert numeric fields to numbers
    const processedData = {
      ...formData,
      duration: Number(formData.duration),
      distance: formData.distance ? Number(formData.distance) : undefined,
      calories: Number(formData.calories),
      date: new Date(formData.date).toISOString()
    };
    
    onSubmit(processedData);
  };
  
  return (
    <div className={styles.formContainer}>
      <h3 className={styles.formTitle}>
        {initialData ? 'Edit Workout' : 'Log New Workout'}
      </h3>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formSection}>
          <label className={styles.sectionLabel}>Workout Type</label>
          <div className={styles.workoutTypeGrid}>
            {workoutTypes.map(type => (
              <button 
                key={type.id}
                type="button"
                className={`${styles.typeButton} ${formData.type === type.id ? styles.activeType : ''}`}
                onClick={() => handleTypeSelect(type.id)}
              >
                <div className={styles.typeIcon}>
                  {type.icon}
                </div>
                <span>{type.label}</span>
              </button>
            ))}
          </div>
          {errors.type && <p className={styles.errorText}>{errors.type}</p>}
        </div>
        
        <div className={styles.formRow}>
          <Input 
            id="duration"
            name="duration"
            type="number"
            label="Duration (minutes)"
            value={formData.duration}
            onChange={handleChange}
            placeholder="45"
            error={errors.duration}
            required
          />
          
          <Input 
            id="distance"
            name="distance"
            type="number"
            step="0.1"
            label="Distance (km)"
            value={formData.distance}
            onChange={handleChange}
            placeholder="5.0"
            error={errors.distance}
          />
        </div>
        
        <div className={styles.formRow}>
          <Input 
            id="calories"
            name="calories"
            type="number"
            label="Calories Burned"
            value={formData.calories}
            onChange={handleChange}
            placeholder="350"
            error={errors.calories}
            required
          />
          
          <Input 
            id="date"
            name="date"
            type="date"
            label="Date"
            value={formData.date}
            onChange={handleChange}
            error={errors.date}
            required
          />
        </div>
        
        <div className={styles.formActions}>
          <Button type="submit" size="medium">
            {initialData ? 'Update Workout' : 'Save Workout'}
          </Button>
          <Button 
            type="button" 
            variant="secondary" 
            size="medium"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WorkoutForm; 