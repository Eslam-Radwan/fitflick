import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
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

const ProfilePage = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthdate: '',
    phoneNumber: '',
    address: '',
    profilePicture: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Add user data to form when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        birthdate: currentUser.birthdate || '',
        phoneNumber: currentUser.phoneNumber || '',
        address: currentUser.address || '',
        profilePicture: currentUser.profilePicture || ''
      });
    }
  }, [currentUser]);
  
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
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    // // send data to a backend
    // console.log('Profile update submitted:', formData);
    
    // Update user profile 
    if (updateUserProfile) {
      updateUserProfile(formData)
        .then(() => {
          setIsEditing(false);
          setSuccessMessage('Profile updated successfully!');
          

          setTimeout(() => {
            setSuccessMessage('');
          }, 3000);
        })
        .catch(error => {
          setErrors({ form: error.message || 'Failed to update profile' });
        });
    } 
    // else {

    //   // Would be replaced with actual API calls 
    //   setTimeout(() => {
    //     setIsEditing(false);
    //     setSuccessMessage('Profile updated successfully!');
        
    //     setTimeout(() => {
    //       setSuccessMessage('');
    //     }, 3000);
    //   }, 500);
    // }
  };
  
  const handleCancel = () => {
    // Reset form data to current user data
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        birthdate: currentUser.birthdate || '',
        phoneNumber: currentUser.phoneNumber || '',
        address: currentUser.address || '',
        profilePicture: currentUser.profilePicture || ''
      });
    }
    
    setErrors({});
    setIsEditing(false);
  };
  
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {

      // Create a local URL
      const fileURL = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        profilePicture: fileURL
      }));
    }
  };
  
  return (
    <div className={styles.profileContainer}>
      <header className={styles.profileHeader}>
        <h1>My Profile</h1>
        <p>View and manage your personal information</p>
      </header>
      
      {successMessage && (
        <div className={styles.successMessage}>
          <FaCheck /> {successMessage}
        </div>
      )}
      
      {errors.form && (
        <div className={styles.errorMessage}>
          {errors.form}
        </div>
      )}
      
      <div className={styles.profileContent}>
        <Card className={styles.profileCard}>
          {/* Profile Avatar & Name Section */}
          <div className={styles.profileAvatar}>
            <div className={styles.avatarWrapper}>
              <img 
                src={formData.profilePicture || 'https://via.placeholder.com/150'} 
                alt={formData.name} 
                className={styles.avatar}
              />
              {isEditing && (
                <label className={styles.avatarEditButton}>
                  <FaCamera />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleProfilePictureChange}
                    className={styles.fileInput}
                  />
                </label>
              )}
            </div>
            <h2 className={styles.profileName}>{formData.name}</h2>
            <p className={styles.profileMeta}>
              <FaCalendarAlt className={styles.metaIcon} />
              Member since {currentUser?.joinDate}
            </p>
          </div>
          
          {/* Profile Form with Tabs */}
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
                  onClick={() => setIsEditing(true)}
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
                  
                  <div className={styles.formField}>
                    <div className={styles.fieldIcon}>
                      <FaCalendarAlt />
                    </div>
                    
                    <div className={styles.fieldContent}>
                      <p className={styles.fieldLabel}>Date of Birth</p>
                      {isEditing ? (
                        <Input 
                          id="birthdate"
                          name="birthdate"
                          type="date"
                          value={formData.birthdate || ''}
                          onChange={handleChange}
                          error={errors.birthdate}
                        />
                      ) : (
                        <p className={styles.fieldValue}>
                          {formData.birthdate ? new Date(formData.birthdate).toLocaleDateString() : 'Not specified'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Tabs.Tab>
              
              <Tabs.Tab label="Account" icon={<FaUserCog />}>
                <div className={styles.formSection}>
                  <h3>Account Settings</h3>
                  
                  <div className={styles.accountSettings}>
                    <div className={styles.settingsCard}>
                      <div className={styles.settingIcon}>
                        <FaKey />
                      </div>
                      <div className={styles.settingInfo}>
                        <h4>Password</h4>
                        <p>Last changed: 3 months ago</p>
                      </div>
                      <Button variant="secondary" size="small">Change</Button>
                    </div>
                    
                    <div className={styles.settingsCard}>
                      <div className={styles.settingIcon}>
                        <FaBell />
                      </div>
                      <div className={styles.settingInfo}>
                        <h4>Notifications</h4>
                        <p>Email, Push, SMS</p>
                      </div>
                      <Button variant="secondary" size="small">Configure</Button>
                    </div>
                    
                    <div className={styles.settingsCard}>
                      <div className={styles.settingIcon}>
                        <FaShieldAlt />
                      </div>
                      <div className={styles.settingInfo}>
                        <h4>Two-Factor Authentication</h4>
                        <p>Disabled</p>
                      </div>
                      <Button variant="secondary" size="small">Enable</Button>
                    </div>
                  </div>
                </div>
              </Tabs.Tab>
              
              <Tabs.Tab label="Devices" icon={<FaMobileAlt />}>
                <div className={styles.formSection}>
                  <h3>Connected Devices</h3>
                  
                  <div className={styles.devicesList}>
                    <div className={styles.deviceItem}>
                      <div className={styles.deviceIcon}>
                        <FaMobileAlt />
                      </div>
                      <div className={styles.deviceInfo}>
                        <p className={styles.deviceName}>Fitbit Charge 5</p>
                        <p className={styles.deviceStatus}>Connected</p>
                      </div>
                      <Button variant="secondary" size="small">Disconnect</Button>
                    </div>
                    
                    <div className={styles.deviceItem}>
                      <div className={styles.deviceIcon}>
                        <FaMobileAlt />
                      </div>
                      <div className={styles.deviceInfo}>
                        <p className={styles.deviceName}>Apple Health</p>
                        <p className={styles.deviceStatus}>Not Connected</p>
                      </div>
                      <Button variant="secondary" size="small">Connect</Button>
                    </div>
                    
                    <div className={styles.deviceItem}>
                      <div className={styles.deviceIcon}>
                        <FaMobileAlt />
                      </div>
                      <div className={styles.deviceInfo}>
                        <p className={styles.deviceName}>Garmin Connect</p>
                        <p className={styles.deviceStatus}>Not Connected</p>
                      </div>
                      <Button variant="secondary" size="small">Connect</Button>
                    </div>
                  </div>
                </div>
              </Tabs.Tab>
              
              <Tabs.Tab label="Privacy" icon={<FaShieldAlt />}>
                <div className={styles.formSection}>
                  <h3>Privacy Settings</h3>
                  
                  <div className={styles.privacySettings}>
                    <div className={styles.privacyOption}>
                      <div className={styles.optionLabel}>
                        <h4>Profile Visibility</h4>
                        <p>Control who can see your profile information</p>
                      </div>
                      <select className={styles.privacySelect}>
                        <option>Public</option>
                        <option>Friends Only</option>
                        <option>Private</option>
                      </select>
                    </div>
                    
                    <div className={styles.privacyOption}>
                      <div className={styles.optionLabel}>
                        <h4>Activity Sharing</h4>
                        <p>Control how your activities are shared</p>
                      </div>
                      <select className={styles.privacySelect}>
                        <option>Share All</option>
                        <option>Limited Sharing</option>
                        <option>No Sharing</option>
                      </select>
                    </div>
                    
                    <div className={styles.privacyOption}>
                      <div className={styles.optionLabel}>
                        <h4>Data Usage</h4>
                        <p>Manage how your data is used</p>
                      </div>
                      <Button variant="secondary" size="small">Manage Data</Button>
                    </div>
                    
                    <div className={styles.dangerZone}>
                      <h4>Danger Zone</h4>
                      <p>These actions cannot be undone</p>
                      <div className={styles.dangerActions}>
                        <Button variant="secondary" size="small" className={styles.dangerButton}>
                          <FaTrashAlt className={styles.buttonIcon} /> Delete Account
                        </Button>
                      </div>
                    </div>
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