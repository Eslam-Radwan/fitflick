import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import WorkoutForm from '../../components/Workouts/WorkoutForm';
import { FaPlus, FaEdit, FaTrash, FaDumbbell, FaRunning, FaSwimmer, FaWalking, FaBicycle } from 'react-icons/fa';
import styles from './WorkoutsPage.module.css';

const mockWorkouts = [
  {
    id: '1',
    type: 'running',
    duration: 45,
    distance: 5.2,
    calories: 450,
    date: '2023-06-15T08:30:00Z'
  },
  {
    id: '2',
    type: 'weight_training',
    duration: 60,
    distance: null,
    calories: 320,
    date: '2023-06-14T17:15:00Z'
  },
  {
    id: '3',
    type: 'cycling',
    duration: 75,
    distance: 20,
    calories: 580,
    date: '2023-06-12T06:45:00Z'
  }
];

const workoutIcons = {
  running: <FaRunning />,
  cycling: <FaBicycle />,
  swimming: <FaSwimmer />,
  walking: <FaWalking />,
  weight_training: <FaDumbbell />
};

const WorkoutsPage = () => {
  const { currentUser } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);

  useEffect(() => {

    // Would be replaced with an API call 
    setWorkouts(mockWorkouts);
  }, [currentUser]);

  const handleAddWorkout = () => {
    setEditingWorkout(null);
    setShowForm(true);
  };

  const handleEditWorkout = (workout) => {
    setEditingWorkout(workout);
    setShowForm(true);
  };

  const handleDeleteWorkout = (workoutId) => {
    // Call an API to delete the workout
    setWorkouts(workouts.filter(workout => workout.id !== workoutId));
  };

  const handleFormSubmit = (workoutData) => {
    if (editingWorkout) {
      const updatedWorkouts = workouts.map(workout => 
        workout.id === editingWorkout.id ? { ...workout, ...workoutData } : workout
      );
      setWorkouts(updatedWorkouts);
    } else {
      // Add new workout
      const newWorkout = {
        id: Math.random().toString(36).substr(2, 9),
        ...workoutData
      };
      setWorkouts([newWorkout, ...workouts]);
    }
    
    setShowForm(false);
    setEditingWorkout(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingWorkout(null);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getWorkoutTypeLabel = (type) => {
    const typeMap = {
      running: 'Running',
      cycling: 'Cycling',
      swimming: 'Swimming',
      walking: 'Walking',
      weight_training: 'Weight Training'
    };
    return typeMap[type] || type;
  };

  return (
    <div className={styles.workoutsContainer}>
      <div className={styles.pageHeader}>
        <h1>Your Workouts</h1>
        <Button onClick={handleAddWorkout} icon={<FaPlus />}>
          Log Workout
        </Button>
      </div>

      {showForm ? (
        <Card>
          <WorkoutForm 
            onSubmit={handleFormSubmit} 
            onCancel={handleFormCancel}
            initialData={editingWorkout}
          />
        </Card>
      ) : (
        <>
          {workouts.length === 0 ? (
            <Card>
              <div className={styles.emptyState}>
                <FaDumbbell size={48} />
                <h3>No workouts yet</h3>
                <p>Start logging your fitness activities to track your progress</p>
                <Button onClick={handleAddWorkout}>Log Your First Workout</Button>
              </div>
            </Card>
          ) : (
            <div className={styles.workoutsList}>
              {workouts.map(workout => (
                <Card key={workout.id} className={styles.workoutCard}>
                  <div className={styles.workoutHeader}>
                    <div className={styles.workoutType}>
                      <div className={styles.workoutIcon}>
                        {workoutIcons[workout.type]}
                      </div>
                      <h3>{getWorkoutTypeLabel(workout.type)}</h3>
                    </div>
                    <div className={styles.workoutDate}>
                      {formatDate(workout.date)}
                    </div>
                  </div>
                  
                  <div className={styles.workoutDetails}>
                    <div className={styles.workoutStat}>
                      <span className={styles.statLabel}>Duration</span>
                      <span className={styles.statValue}>{workout.duration} min</span>
                    </div>
                    
                    {workout.distance && (
                      <div className={styles.workoutStat}>
                        <span className={styles.statLabel}>Distance</span>
                        <span className={styles.statValue}>{workout.distance} km</span>
                      </div>
                    )}
                    
                    <div className={styles.workoutStat}>
                      <span className={styles.statLabel}>Calories</span>
                      <span className={styles.statValue}>{workout.calories}</span>
                    </div>
                  </div>
                  
                  <div className={styles.workoutActions}>
                    <Button 
                      variant="icon" 
                      size="small"
                      onClick={() => handleEditWorkout(workout)}
                      aria-label="Edit workout"
                    >
                      <FaEdit />
                    </Button>
                    <Button 
                      variant="icon" 
                      size="small"
                      onClick={() => handleDeleteWorkout(workout.id)}
                      aria-label="Delete workout"
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WorkoutsPage; 