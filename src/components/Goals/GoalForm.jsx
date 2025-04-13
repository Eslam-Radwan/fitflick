import React, { useState } from 'react';
import Button from '../UI/Button';
import Input from '../UI/Input';
import styles from './GoalForm.module.css';
import { 
  FaWeight, 
  FaRunning, 
  FaWater, 
  FaDumbbell, 
  FaHeartbeat 
} from 'react-icons/fa';

const goalTypes = [
  { id: 'weight', label: 'Weight', icon: <FaWeight /> },
  { id: 'cardio', label: 'Cardio', icon: <FaRunning /> },
  { id: 'strength', label: 'Strength', icon: <FaDumbbell /> },
  { id: 'water', label: 'Hydration', icon: <FaWater /> },
  { id: 'health', label: 'Health', icon: <FaHeartbeat /> }
];

const GoalForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goalType: '',
    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Default to 30 days from now
  });
  
  const [errors, setErrors] = useState({});
  
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
  
  const handleTypeSelect = (goalType) => {
    setFormData(prev => ({
      ...prev,
      goalType
    }));
    
    if (errors.goalType) {
      setErrors(prev => ({
        ...prev,
        goalType: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.goalType) {
      newErrors.goalType = 'Please select a goal type';
    }
    
    if (!formData.targetDate) {
      newErrors.targetDate = 'Target date is required';
    } else {
      const targetDate = new Date(formData.targetDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (targetDate < today) {
        newErrors.targetDate = 'Target date cannot be in the past';
      }
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
    
    const goalData = {
      ...formData,
      progress: 0, // New goals start at 0% progress
      createdAt: new Date().toISOString()
    };
    
    onSubmit(goalData);
  };
  
  return (
    <div className={styles.formContainer}>
      <h3 className={styles.formTitle}>Set New Goal</h3>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formSection}>
          <label className={styles.sectionLabel}>Goal Type</label>
          <div className={styles.goalTypeGrid}>
            {goalTypes.map(type => (
              <button 
                key={type.id}
                type="button"
                className={`${styles.typeButton} ${formData.goalType === type.id ? styles.activeType : ''}`}
                onClick={() => handleTypeSelect(type.id)}
              >
                <div className={styles.typeIcon}>
                  {type.icon}
                </div>
                <span>{type.label}</span>
              </button>
            ))}
          </div>
          {errors.goalType && <p className={styles.errorText}>{errors.goalType}</p>}
        </div>
        
        <Input 
          id="title"
          name="title"
          label="Goal Title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Lose 5kg, Run 10K, etc."
          error={errors.title}
          required
        />
        
        <Input 
          id="description"
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Add details about your goal"
          error={errors.description}
          required
        />
        
        <Input 
          id="targetDate"
          name="targetDate"
          type="date"
          label="Target Date"
          value={formData.targetDate}
          onChange={handleChange}
          error={errors.targetDate}
          required
        />
        
        <div className={styles.formActions}>
          <Button type="submit" size="medium">
            Set Goal
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

export default GoalForm; 