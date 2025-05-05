import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import GoalForm from '../../components/Goals/GoalForm';
import { mockGoals } from '../../data/mockData';
import styles from './GoalsPage.module.css';
import { 
  FaBullseye, 
  FaPlus, 
  FaCheck, 
  FaWeight, 
  FaRunning, 
  FaWater, 
  FaDumbbell, 
  FaHeartbeat,
  FaTrophy
} from 'react-icons/fa';

const GoalsPage = () => {
  const { currentUser } = useAuth();
  const [userGoals, setUserGoals] = useState(
    // Add goalType if missing from mockGoals data
    mockGoals.map(goal => ({
      ...goal,
      goalType: goal.goalType || 'weight'
    }))
  );
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  
  // Handle goal form submission
  const handleGoalSubmit = (goalData) => {
    const newGoal = {
      id: Date.now(), 
      ...goalData
    };
    
    // Add the new goal to state
    setUserGoals(prevGoals => [newGoal, ...prevGoals]);
    
    // Close the modal
    setIsGoalModalOpen(false);
  };
  
  // Handle goal update
  const handleGoalProgress = (goalId, newProgress) => {
    setUserGoals(prevGoals => 
      prevGoals.map(goal => 
        goal.id === goalId 
          ? { ...goal, progress: newProgress } 
          : goal
      )
    );
  };
  
  // Determining status text
  const getStatusText = (progress) => {
    if (progress >= 100) return 'Completed';
    if (progress > 75) return 'Almost there';
    if (progress > 50) return 'Good progress';
    if (progress > 25) return 'In progress';
    return 'Just started';
  };
  
  // Icon for goal type
  const getGoalIcon = (goalType) => {
    switch (goalType) {
      case 'weight':
        return <FaWeight />;
      case 'cardio':
        return <FaRunning />;
      case 'strength':
        return <FaDumbbell />;
      case 'water':
        return <FaWater />;
      case 'health':
        return <FaHeartbeat />;
      default:
        return <FaBullseye />;
    }
  };
  
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Calculate days remaining
  const getDaysRemaining = (targetDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  return (
    <div className={styles.goalsContainer}>
      <header className={styles.goalsHeader}>
        <div>
          <h1>My Goals</h1>
          <p>Track your progress towards your fitness goals</p>
        </div>
        <Button 
          onClick={() => setIsGoalModalOpen(true)}
          className={styles.addButton}
        >
          <FaPlus className={styles.buttonIcon} /> Add New Goal
        </Button>
      </header>
      
      {userGoals.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>
            <FaBullseye />
          </div>
          <h2>No goals set yet</h2>
          <p>Set your first fitness goal to start tracking your progress</p>
          <Button 
            onClick={() => setIsGoalModalOpen(true)}
            className={styles.addEmptyButton}
          >
            <FaPlus className={styles.buttonIcon} /> Set Your First Goal
          </Button>
        </div>
      ) : (
        <div className={styles.goalsGrid}>
          {userGoals.map(goal => (
            <Card 
              key={goal.id} 
              className={styles.goalCard}
            >
              <div className={styles.goalHeader}>
                <div 
                  className={styles.goalIcon}
                  style={{ 
                    backgroundColor: goal.progress >= 100 ? 'var(--color-teal)' : 'var(--color-purple)'
                  }}
                >
                  {goal.progress >= 100 ? <FaTrophy /> : getGoalIcon(goal.goalType)}
                </div>
                <div className={styles.goalInfo}>
                  <h3 className={styles.goalTitle}>{goal.title}</h3>
                  <p className={styles.goalType}>
                    {goal.goalType.charAt(0).toUpperCase() + goal.goalType.slice(1)}
                  </p>
                </div>
              </div>
              
              <p className={styles.goalDescription}>{goal.description}</p>
              
              <div className={styles.goalProgress}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ 
                      width: `${Math.min(goal.progress, 100)}%`,
                      backgroundColor: goal.progress >= 100 ? 'var(--color-teal)' : 'var(--color-purple)'
                    }}
                  ></div>
                </div>
                <div className={styles.progressDetails}>
                  <span>{goal.progress}%</span>
                  <span className={styles.statusText}>
                    {getStatusText(goal.progress)}
                  </span>
                </div>
              </div>
              
              <div className={styles.goalFooter}>
                <div className={styles.goalDates}>
                  <p className={styles.targetDate}>
                    Target: {formatDate(goal.targetDate)}
                  </p>
                  <p className={styles.daysRemaining}>
                    {getDaysRemaining(goal.targetDate) > 0 
                      ? `${getDaysRemaining(goal.targetDate)} days remaining` 
                      : 'Due today'}
                  </p>
                </div>
                
                <div className={styles.goalActions}>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={goal.progress} 
                    onChange={(e) => handleGoalProgress(goal.id, Number(e.target.value))}
                    className={styles.progressSlider}
                  />
                  
                  {goal.progress >= 100 && (
                    <div className={styles.completedBadge}>
                      <FaCheck /> Completed
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {/* Goal Modal */}
      <Modal 
        isOpen={isGoalModalOpen} 
        onClose={() => setIsGoalModalOpen(false)}
        title="Set New Goal"
      >
        <GoalForm 
          onSubmit={handleGoalSubmit}
          onCancel={() => setIsGoalModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default GoalsPage; 