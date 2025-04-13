import { createContext, useState, useContext, useEffect } from 'react';
import { mockUser } from '../data/mockData';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('fitnessUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  
  // Simulate login functionality
  const login = (email, password) => {
    // This would normally validate against a backend
    console.log(`Login attempt with: ${email} / ${password}`);
    
    // TODO: Replace simulation with fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    
    // For simulation, we'll just accept any login and use our mock user
    const user = { ...mockUser };
    setCurrentUser(user);
    localStorage.setItem('fitnessUser', JSON.stringify(user));
    return Promise.resolve(user);
  };
  
  // Simulate signup functionality
  const signup = (name, email, password) => {
    // This would normally send registration details to a backend
    console.log(`Signup attempt with: ${name} / ${email} / ${password}`);
    
    // TODO: Replace simulation with fetch('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) })
    
    // For simulation, create a user based on input but with mock ID
    const user = { 
      ...mockUser,
      name,
      email
    };
    setCurrentUser(user);
    localStorage.setItem('fitnessUser', JSON.stringify(user));
    return Promise.resolve(user);
  };
  
  // Simulate update profile functionality
  const updateUserProfile = (profileData) => {
    // This would normally send update details to a backend
    console.log('Updating user profile:', profileData);
    
    // TODO: Replace simulation with fetch('/api/user/profile', { method: 'PUT', body: JSON.stringify(profileData) })
    
    // For simulation, update user with new data
    const updatedUser = { 
      ...currentUser,
      ...profileData,
      updatedAt: new Date().toISOString()
    };
    
    setCurrentUser(updatedUser);
    localStorage.setItem('fitnessUser', JSON.stringify(updatedUser));
    return Promise.resolve(updatedUser);
  };
  
  // Logout functionality
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('fitnessUser');
    return Promise.resolve();
  };
  
  const value = {
    currentUser,
    login,
    signup,
    logout,
    updateUserProfile,
    loading
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 