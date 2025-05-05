import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/UI/Card';
import Tabs from '../../components/UI/Tabs';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import WorkoutForm from '../../components/Workouts/WorkoutForm';
import { mockDashboardStats, mockChartData, mockWorkouts } from '../../data/mockData';
import styles from './DashboardPage.module.css';
import { 
  FaWalking, 
  FaWater, 
  FaFireAlt, 
  FaHeartbeat, 
  FaBed,
  FaHome,
  FaRunning,
  FaAppleAlt,
  FaHeart,
  FaPlus,
  FaDumbbell,
  FaBicycle,
  FaSwimmer
} from 'react-icons/fa';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  PointElement, 
  LineElement 
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

//ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [userWorkouts, setUserWorkouts] = useState(mockWorkouts);
  const [activeTab, setActiveTab] = useState(0);
  
  // chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };
  
  // weekly steps chart data
  const stepsChartData = {
    labels: mockChartData.weeklySteps.labels,
    datasets: [
      {
        label: 'Steps',
        data: mockChartData.weeklySteps.data,
        backgroundColor: 'rgba(0, 198, 173, 0.7)',
        borderColor: 'rgb(0, 198, 173)',
        borderWidth: 1,
      },
    ],
  };
  
  // weekly calories chart data
  const caloriesChartData = {
    labels: mockChartData.calorieBalance.labels,
    datasets: [
      {
        label: 'Calories Consumed',
        data: mockChartData.calorieBalance.consumed,
        backgroundColor: 'rgba(255, 175, 122, 0.7)',
        borderColor: 'rgb(255, 175, 122)',
        borderWidth: 1,
      },
      {
        label: 'Calories Burned',
        data: mockChartData.calorieBalance.burned,
        backgroundColor: 'rgba(255, 122, 159, 0.7)',
        borderColor: 'rgb(255, 122, 159)',
        borderWidth: 1,
      },
    ],
  };
  
  // weekly activity chart data
  const activityChartData = {
    labels: mockChartData.weeklyWorkouts.labels,
    datasets: [
      {
        label: 'Activity Minutes',
        data: mockChartData.weeklyWorkouts.data,
        backgroundColor: 'rgba(136, 111, 234, 0.7)',
        borderColor: 'rgb(136, 111, 234)',
        borderWidth: 1,
      },
    ],
  };
  
  // find user's stats or fall back to mock
  const userStats = mockDashboardStats.find(user => user.userId === currentUser?.id) || mockDashboardStats[0];
  
  // handle workout form submission
  const handleWorkoutSubmit = (workoutData) => {
    const newWorkout = {
      id: Date.now(),
      ...workoutData
    };
    
    // add the new workout to state
    setUserWorkouts(prevWorkouts => [newWorkout, ...prevWorkouts]);
    
    // close the modal
    setIsWorkoutModalOpen(false);
    
    // switch to Activities tab
    setActiveTab(1);
  };
  
  // format date helper function
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // get icon for workout type
  const getWorkoutIcon = (type) => {
    switch (type) {
      case 'running':
        return <FaRunning />;
      case 'cycling':
        return <FaBicycle />;
      case 'swimming':
        return <FaSwimmer />;
      case 'walking':
        return <FaWalking />;
      case 'weight_training':
        return <FaDumbbell />;
      default:
        return <FaRunning />;
    }
  };
  
  // return the dashboard with tabs
  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <h1>Dashboard</h1>
        <p>Welcome back, {currentUser?.name}! Here's your fitness summary.</p>
      </header>
      
      <Tabs defaultTab={activeTab} onTabChange={setActiveTab}>
        <Tabs.Tab label="Overview" icon={<FaHome />}>
          <div className={styles.statsGrid}>
            {/* Daily Steps Card */}
            <Card 
              className={styles.statsCard} 
              title="Daily Steps" 
              icon={<FaWalking />}
              accentColor="var(--color-teal)"
            >
              <div className={styles.statValue}>
                {userStats.steps.toLocaleString()}
                <span className={styles.statUnit}>steps</span>
              </div>
              
              <div className={styles.statProgress}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ 
                      width: `${Math.min(userStats.steps / 100, 100)}%`,
                      backgroundColor: 'var(--color-teal)'
                    }}
                  ></div>
                </div>
                <p className={styles.progressText}>{Math.round(userStats.steps / 100)}% of 10,000 goal</p>
              </div>
            </Card>
            
            {/* Water Intake Card */}
            <Card 
              className={styles.statsCard} 
              title="Water Intake" 
              icon={<FaWater />}
              accentColor="var(--color-blue)"
            >
              <div className={styles.statValue}>
                {userStats.water}
                <span className={styles.statUnit}>oz</span>
              </div>
              
              <div className={styles.statProgress}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ 
                      width: `${Math.min(userStats.water / 64 * 100, 100)}%`,
                      backgroundColor: 'var(--color-blue)'
                    }}
                  ></div>
                </div>
                <p className={styles.progressText}>{Math.round(userStats.water / 64 * 100)}% of 64 oz goal</p>
              </div>
            </Card>
            
            {/* Calories Card */}
            <Card 
              className={styles.statsCard} 
              title="Calories" 
              icon={<FaFireAlt />}
              accentColor="var(--color-orange)"
            >
              <div className={styles.statValue}>
                {userStats.caloriesBurned.toLocaleString()}
                <span className={styles.statUnit}>kcal</span>
              </div>
              
              <div className={styles.caloriesDetail}>
                <div className={styles.caloriesItem}>
                  <p className={styles.caloriesLabel}>Consumed</p>
                  <p className={styles.caloriesValue}>{userStats.caloriesConsumed.toLocaleString()} kcal</p>
                </div>
                <div className={styles.caloriesItem}>
                  <p className={styles.caloriesLabel}>Burned</p>
                  <p className={styles.caloriesValue}>{userStats.caloriesBurned.toLocaleString()} kcal</p>
                </div>
                <div className={styles.caloriesItem}>
                  <p className={styles.caloriesLabel}>Remaining</p>
                  <p className={styles.caloriesValue}>{(userStats.caloriesConsumed - userStats.caloriesBurned).toLocaleString()} kcal</p>
                </div>
              </div>
            </Card>
            
            {/* Heart Rate Card */}
            <Card 
              className={styles.statsCard} 
              title="Heart Rate" 
              icon={<FaHeartbeat />}
              accentColor="var(--color-pink)"
            >
              <div className={styles.statValue}>
                {userStats.heartRate}
                <span className={styles.statUnit}>bpm</span>
              </div>
              
              <div className={styles.heartRateDetail}>
                <div className={styles.heartRateItem}>
                  <p className={styles.heartRateLabel}>Resting</p>
                  <p className={styles.heartRateValue}>{userStats.restingHeartRate} bpm</p>
                </div>
                <div className={styles.heartRateItem}>
                  <p className={styles.heartRateLabel}>Max Today</p>
                  <p className={styles.heartRateValue}>{userStats.maxHeartRate} bpm</p>
                </div>
              </div>
            </Card>
            
            {/* Sleep Hours Card */}
            <Card 
              className={styles.statsCard} 
              title="Sleep" 
              icon={<FaBed />}
              accentColor="var(--color-purple)"
            >
              <div className={styles.statValue}>
                {userStats.sleepHours}
                <span className={styles.statUnit}>hours</span>
              </div>
              
              <div className={styles.statProgress}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ 
                      width: `${Math.min(userStats.sleepHours / 8 * 100, 100)}%`,
                      backgroundColor: 'var(--color-purple)'
                    }}
                  ></div>
                </div>
                <p className={styles.progressText}>{Math.round(userStats.sleepHours / 8 * 100)}% of 8 hours goal</p>
              </div>
            </Card>
          </div>
          
          <div className={styles.chartsGrid}>
            {/* Weekly Steps Chart */}
            <Card className={styles.chartCard} title="Weekly Steps">
              <div className={styles.chartContainer}>
                <Bar options={chartOptions} data={stepsChartData} />
              </div>
            </Card>
            
            {/* Weekly Calories Chart */}
            <Card className={styles.chartCard} title="Weekly Calorie Balance">
              <div className={styles.chartContainer}>
                <Bar options={chartOptions} data={caloriesChartData} />
              </div>
            </Card>
            
            {/* Weekly Activity Chart */}
            <Card className={styles.chartCard} title="Weekly Activity Minutes">
              <div className={styles.chartContainer}>
                <Bar options={chartOptions} data={activityChartData} />
              </div>
            </Card>
          </div>
        </Tabs.Tab>

        <Tabs.Tab label="Activities" icon={<FaRunning />}>
          <div className={styles.tabHeader}>
            <div className={styles.tabIntro}>
              <h2>Your Recent Activities</h2>
              <p>Track and analyze your workouts and physical activities</p>
            </div>
            <Button 
              onClick={() => setIsWorkoutModalOpen(true)}
              className={styles.addButton}
            >
              <FaPlus className={styles.buttonIcon} /> Log Workout
            </Button>
          </div>
          
          <Card className={styles.chartCard} title="Activity Distribution">
            <div className={styles.chartContainer}>
              <Bar options={chartOptions} data={activityChartData} />
            </div>
          </Card>
          
          <div className={styles.activitiesList}>
            {userWorkouts.map(workout => (
              <Card 
                key={workout.id} 
                className={styles.activityCard} 
                title={workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}
                icon={getWorkoutIcon(workout.type)}
              >
                <div className={styles.activityDetails}>
                  {workout.distance && <p>Distance: {workout.distance} km</p>}
                  <p>Duration: {workout.duration} minutes</p>
                  <p>Calories: {workout.calories} kcal</p>
                  <p>Date: {formatDate(workout.date)}</p>
                </div>
              </Card>
            ))}
          </div>
        </Tabs.Tab>

        <Tabs.Tab label="Nutrition" icon={<FaAppleAlt />}>
          <div className={styles.tabIntro}>
            <h2>Nutrition Overview</h2>
            <p>Monitor your diet and nutritional intake</p>
          </div>
          
          <Card className={styles.chartCard} title="Calorie Balance">
            <div className={styles.chartContainer}>
              <Bar options={chartOptions} data={caloriesChartData} />
            </div>
          </Card>
          
          <div className={styles.nutritionSummary}>
            <Card className={styles.nutritionCard} title="Today's Intake">
              <div className={styles.macrosList}>
                <div className={styles.macroItem}>
                  <p className={styles.macroLabel}>Protein</p>
                  <div className={styles.macroBar}>
                    <div 
                      className={styles.macroFill} 
                      style={{ 
                        width: '65%',
                        backgroundColor: 'var(--color-teal)'
                      }}
                    ></div>
                  </div>
                  <p className={styles.macroValue}>78g / 120g</p>
                </div>
                
                <div className={styles.macroItem}>
                  <p className={styles.macroLabel}>Carbs</p>
                  <div className={styles.macroBar}>
                    <div 
                      className={styles.macroFill} 
                      style={{ 
                        width: '70%',
                        backgroundColor: 'var(--color-orange)'
                      }}
                    ></div>
                  </div>
                  <p className={styles.macroValue}>210g / 300g</p>
                </div>
                
                <div className={styles.macroItem}>
                  <p className={styles.macroLabel}>Fat</p>
                  <div className={styles.macroBar}>
                    <div 
                      className={styles.macroFill} 
                      style={{ 
                        width: '50%',
                        backgroundColor: 'var(--color-pink)'
                      }}
                    ></div>
                  </div>
                  <p className={styles.macroValue}>40g / 80g</p>
                </div>
              </div>
            </Card>
          </div>
        </Tabs.Tab>

        <Tabs.Tab label="Health" icon={<FaHeart />}>
          <div className={styles.tabIntro}>
            <h2>Health Metrics</h2>
            <p>Track important health indicators</p>
          </div>
          
          <div className={styles.healthMetrics}>
            <Card className={styles.healthCard} title="Sleep Analysis">
              <div className={styles.chartContainer}>
                <Bar 
                  options={chartOptions} 
                  data={{
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                      label: 'Sleep Hours',
                      data: [6.5, 7.2, 8, 5.5, 7, 8.5, 7.5],
                      backgroundColor: 'rgba(136, 111, 234, 0.7)',
                      borderColor: 'rgb(136, 111, 234)',
                    }]
                  }} 
                />
              </div>
            </Card>
            
            <Card className={styles.healthCard} title="Heart Rate Trends">
              <div className={styles.chartContainer}>
                <Line 
                  options={chartOptions} 
                  data={{
                    labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
                    datasets: [{
                      label: 'BPM',
                      data: [62, 85, 75, 90, 82, 68],
                      backgroundColor: 'rgba(255, 122, 159, 0.2)',
                      borderColor: 'rgba(255, 122, 159, 1)',
                      tension: 0.4,
                      fill: true
                    }]
                  }} 
                />
              </div>
            </Card>
          </div>
        </Tabs.Tab>
      </Tabs>
      
      {/* Workout Modal */}
      <Modal 
        isOpen={isWorkoutModalOpen} 
        onClose={() => setIsWorkoutModalOpen(false)}
        title="Log New Workout"
      >
        <WorkoutForm 
          onSubmit={handleWorkoutSubmit}
          onCancel={() => setIsWorkoutModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default DashboardPage; 