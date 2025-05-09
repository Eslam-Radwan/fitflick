import React, { useState, useEffect } from 'react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Tabs from '../../components/UI/Tabs';
import styles from './ProfilePage.module.css';
import { 
  FaUser, 
  FaEnvelope, 
  FaCalendarAlt, 
  FaCamera, 
  FaEdit, 
  FaSave, 
  FaTimes, 
  FaKey, 
  FaBell, 
  FaShieldAlt, 
  FaMobileAlt,
  FaUserCog,
  FaCogs,
  FaTrashAlt,
  FaCheck
} from 'react-icons/fa';
import { getUser } from '../../hooks/User';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({name: '',email: ''});
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState(null)

  useEffect(() => {
    const user = getUser();
    setFormData({
      name: user.name,
      email: user.email, 
    });
    setUser(user);
  }, []);
  
  const handleChange = (e) => {
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Hello from handleSubmit');
    
    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    else {
      setIsEditing(false);
    }
    
  };
  
  const handleCancel = () => {
    // Reset form data to current user data
    setFormData({
      name: user.name,
      email: user.email, 
    });
    
    setErrors({});
    setIsEditing(false);
  };
  
  
  return (
    <div className={styles.profileContainer}>
      <header className={styles.profileHeader}>
        <h1>My Profile</h1>
        <p>View and manage your personal information</p>
      </header>
      
      
      {errors.form && (
        <div className={styles.errorMessage}>
          {errors.form}
        </div>
      )}
      
      <div className={styles.profileContent}>
        <Card className={styles.profileCard}>
          <div className={styles.profileAvatar}>
            <h2 className={styles.profileName}>{formData.name}</h2>
          </div>
          
          <form onSubmit={handleSubmit} className={styles.profileForm}>
            <div className={styles.formActions}>
              {isEditing ? (
                <>
                  <Button 
                    type="submit" 
                    className={styles.saveButton}
                  >
                    <FaSave className={styles.buttonIcon} /> Save Changes
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={handleCancel}
                    className={styles.cancelButton}
                  >
                    <FaTimes className={styles.buttonIcon} /> Cancel
                  </Button>
                </>
              ) : (
                <Button 
                  type="button" 
                  onClick={(e) => {e.preventDefault();setIsEditing(true);return false;}}
                  className={styles.editButton}
                >
                  <FaEdit className={styles.buttonIcon} /> Edit Profile
                </Button>
              )}
            </div>
            
            <Tabs defaultTab={0}>
              <Tabs.Tab label="Personal Info" icon={<FaUser />}>
                <div className={styles.formSection}>
                  <div className={styles.formField}>
                    <div className={styles.fieldIcon}>
                      <FaUser />
                    </div>
                    
                    {isEditing ? (
                      <Input 
                        id="name"
                        name="name"
                        label="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        required
                      />
                    ) : (
                      <div className={styles.fieldContent}>
                        <p className={styles.fieldLabel}>Full Name</p>
                        <p className={styles.fieldValue}>{formData.name}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.formField}>
                    <div className={styles.fieldIcon}>
                      <FaEnvelope />
                    </div>
                    
                    {isEditing ? (
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        label="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        required
                      />
                    ) : (
                      <div className={styles.fieldContent}>
                        <p className={styles.fieldLabel}>Email Address</p>
                        <p className={styles.fieldValue}>{formData.email}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Tabs.Tab>
            </Tabs>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;