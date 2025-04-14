import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Sidebar.module.css';
import { 
  FaHome, 
  FaDumbbell, 
  FaChartLine, 
  FaBullseye, 
  FaUser, 
  FaSignOutAlt 
} from 'react-icons/fa';

const Sidebar = ({ isOpen }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.sidebarHeader}>
        <h2 className={styles.logo}>FitFlick</h2>
        <div className={styles.userInfo}>
          <img 
            src={currentUser?.profilePicture || 'https://via.placeholder.com/40'} 
            alt="User" 
            className={styles.avatar}
          />
          <p className={styles.userName}>{currentUser?.name}</p>
        </div>
      </div>
      
      <nav className={styles.navigation}>
        <NavLink 
          to="/app/dashboard" 
          className={({ isActive }) => 
            `${styles.navLink} ${isActive ? styles.activeLink : ''}`
          }
        >
          <FaHome className={styles.navIcon} />
          <span className={styles.navText}>Dashboard</span>
        </NavLink>
        
        <NavLink 
          to="/app/workouts" 
          className={({ isActive }) => 
            `${styles.navLink} ${isActive ? styles.activeLink : ''}`
          }
        >
          <FaDumbbell className={styles.navIcon} />
          <span className={styles.navText}>Workouts</span>
        </NavLink>
        
        <NavLink 
          to="/app/progress" 
          className={({ isActive }) => 
            `${styles.navLink} ${isActive ? styles.activeLink : ''}`
          }
        >
          <FaChartLine className={styles.navIcon} />
          <span className={styles.navText}>Progress</span>
        </NavLink>
        
        <NavLink 
          to="/app/goals" 
          className={({ isActive }) => 
            `${styles.navLink} ${isActive ? styles.activeLink : ''}`
          }
        >
          <FaBullseye className={styles.navIcon} />
          <span className={styles.navText}>Goals</span>
        </NavLink>
        
        <NavLink 
          to="/app/profile" 
          className={({ isActive }) => 
            `${styles.navLink} ${isActive ? styles.activeLink : ''}`
          }
        >
          <FaUser className={styles.navIcon} />
          <span className={styles.navText}>Profile</span>
        </NavLink>
      </nav>
      
      <div className={styles.sidebarFooter}>
        <button onClick={handleLogout} className={styles.logoutButton}>
          <FaSignOutAlt className={styles.navIcon} />
          <span className={styles.navText}>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar; 