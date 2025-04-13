import React, { useState } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import styles from './AppLayout.module.css';
import { FaBars, FaTimes } from 'react-icons/fa';

const AppLayout = () => {
  const { currentUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Close sidebar when clicking outside on mobile
  const handleContentClick = () => {
    if (window.innerWidth <= 768 && sidebarOpen) {
      setSidebarOpen(false);
    }
  };
  
  return (
    <div className={styles.appContainer}>
      {/* Mobile Toggle Button */}
      <button 
        className={styles.sidebarToggle} 
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />
      
      {/* Main Content */}
      <main 
        className={`${styles.mainContent} ${sidebarOpen ? styles.shifted : ''}`}
        onClick={handleContentClick}
      >
        <div className={styles.contentWrapper}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout; 