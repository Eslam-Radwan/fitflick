import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button'; 
import DashboardService from './DashboardService';
import styles from './DashboardPage.module.css';
import { 
  FaPlus, 
  FaChartLine, 
  FaRunning, 
  FaWeight, 
  FaHeartbeat 
} from 'react-icons/fa';

const DashboardPage = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <Button onClick={fetchDashboardData}>Retry</Button>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's your fitness overview</p>
        </div>
        <div className={styles.headerActions}>
          <Button 
            onClick={() => {/* Handle quick action */}}
            className={styles.quickActionButton}
          >
            <FaPlus /> Quick Log
          </Button>
        </div>
      </header>


      

      <div className={styles.quickActions}>
        <Card className={styles.quickActionCard}>
          <h3>Quick Actions</h3>
          <div className={styles.actionButtons}>
            <Button 
              onClick={() => {/* Handle workout */}}
              className={styles.actionButton}
            >
              <FaRunning /> Log Workout
            </Button>
            <Button 
              onClick={() => {/* Handle weight */}}
              className={styles.actionButton}
            >
              <FaWeight /> Log Weight
            </Button>
            <Button 
              onClick={() => {/* Handle health */}}
              className={styles.actionButton}
            >
              <FaHeartbeat /> Health Check
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage; 