import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { FaWeight, FaRunning, FaHeartbeat, FaFireAlt, FaWater } from 'react-icons/fa';
import styles from './ProgressPage.module.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

// Mock data for progress metrics
const mockProgressData = {
  weight: [
    { date: '2023-06-01', value: 75.5 },
    { date: '2023-06-08', value: 74.8 },
    { date: '2023-06-15', value: 74.0 },
    { date: '2023-06-22', value: 73.5 },
    { date: '2023-06-29', value: 72.8 },
  ],
  steps: [
    { date: '2023-06-24', value: 8500 },
    { date: '2023-06-25', value: 10200 },
    { date: '2023-06-26', value: 7800 },
    { date: '2023-06-27', value: 9300 },
    { date: '2023-06-28', value: 11500 },
    { date: '2023-06-29', value: 8900 },
    { date: '2023-06-30', value: 10800 },
  ],
  calories: [
    { date: '2023-06-24', value: 450 },
    { date: '2023-06-25', value: 520 },
    { date: '2023-06-26', value: 380 },
    { date: '2023-06-27', value: 410 },
    { date: '2023-06-28', value: 550 },
    { date: '2023-06-29', value: 480 },
    { date: '2023-06-30', value: 510 },
  ],
  heartRate: [
    { date: '2023-06-24', value: 72 },
    { date: '2023-06-25', value: 75 },
    { date: '2023-06-26', value: 70 },
    { date: '2023-06-27', value: 73 },
    { date: '2023-06-28', value: 74 },
    { date: '2023-06-29', value: 71 },
    { date: '2023-06-30', value: 72 },
  ],
  water: [
    { date: '2023-06-24', value: 2000 },
    { date: '2023-06-25', value: 2200 },
    { date: '2023-06-26', value: 1800 },
    { date: '2023-06-27', value: 2100 },
    { date: '2023-06-28', value: 2500 },
    { date: '2023-06-29', value: 2300 },
    { date: '2023-06-30', value: 2400 },
  ],
};

const tabConfig = [
  { id: 'weight', label: 'Weight', icon: <FaWeight />, color: '#4c6ef5', unit: 'kg' },
  { id: 'steps', label: 'Steps', icon: <FaRunning />, color: '#40c057', unit: 'steps' },
  { id: 'calories', label: 'Calories', icon: <FaFireAlt />, color: '#fa5252', unit: 'kcal' },
  { id: 'heartRate', label: 'Heart Rate', icon: <FaHeartbeat />, color: '#e64980', unit: 'bpm' },
  { id: 'water', label: 'Water', icon: <FaWater />, color: '#4dabf7', unit: 'ml' },
];

const ProgressPage = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('weight');
  const [progressData, setProgressData] = useState({});
  const [chartData, setChartData] = useState(null);
  const [timeRange, setTimeRange] = useState('week'); // 'week', 'month', 'year'

  useEffect(() => {
    // This would be replaced with an API call in a real application
    // fetchUserProgressData(currentUser.uid)
    setProgressData(mockProgressData);
  }, [currentUser]);

  useEffect(() => {
    if (Object.keys(progressData).length > 0 && activeTab) {
      prepareChartData();
    }
  }, [progressData, activeTab, timeRange]);

  const prepareChartData = () => {
    const tabData = progressData[activeTab] || [];
    const activeTabConfig = tabConfig.find(tab => tab.id === activeTab);
    
    const data = {
      datasets: [
        {
          label: activeTabConfig.label,
          data: tabData.map(item => ({
            x: new Date(item.date),
            y: item.value,
          })),
          borderColor: activeTabConfig.color,
          backgroundColor: `${activeTabConfig.color}33`,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: timeRange === 'week' ? 'day' : timeRange === 'month' ? 'week' : 'month',
            displayFormats: {
              day: 'MMM d',
              week: 'MMM d',
              month: 'MMM yyyy',
            },
          },
          title: {
            display: true,
            text: 'Date',
          },
        },
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: activeTabConfig.unit,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += context.parsed.y + ' ' + activeTabConfig.unit;
              }
              return label;
            },
          },
        },
      },
    };

    setChartData({ data, options });
  };

  const calculateChange = () => {
    const data = progressData[activeTab];
    if (!data || data.length < 2) return { value: 0, percentage: 0 };

    const latest = data[data.length - 1].value;
    const previous = data[0].value;
    const change = latest - previous;
    const percentage = ((change / previous) * 100).toFixed(1);

    return { value: change, percentage };
  };

  const handleRangeChange = (range) => {
    setTimeRange(range);
  };

  return (
    <div className={styles.progressContainer}>
      <div className={styles.pageHeader}>
        <h1>Your Progress</h1>
        <div className={styles.timeRangeSelector}>
          <Button 
            variant={timeRange === 'week' ? 'primary' : 'secondary'} 
            size="small"
            onClick={() => handleRangeChange('week')}
          >
            Week
          </Button>
          <Button 
            variant={timeRange === 'month' ? 'primary' : 'secondary'} 
            size="small"
            onClick={() => handleRangeChange('month')}
          >
            Month
          </Button>
          <Button 
            variant={timeRange === 'year' ? 'primary' : 'secondary'} 
            size="small"
            onClick={() => handleRangeChange('year')}
          >
            Year
          </Button>
        </div>
      </div>

      <div className={styles.tabsContainer}>
        {tabConfig.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab.id)}
            style={{ 
              '--tab-color': tab.color,
              '--tab-bg-color': `${tab.color}11`
            }}
          >
            <div className={styles.tabIcon}>{tab.icon}</div>
            <span className={styles.tabLabel}>{tab.label}</span>
          </button>
        ))}
      </div>

      <Card className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <div className={styles.metricInfo}>
            <div className={styles.metricIcon} style={{ backgroundColor: tabConfig.find(t => t.id === activeTab)?.color }}>
              {tabConfig.find(t => t.id === activeTab)?.icon}
            </div>
            <div>
              <h2>{tabConfig.find(t => t.id === activeTab)?.label} Progress</h2>
              {progressData[activeTab]?.length > 0 && (
                <p className={styles.latestValue}>
                  Current: <strong>{progressData[activeTab][progressData[activeTab].length - 1].value} {tabConfig.find(t => t.id === activeTab)?.unit}</strong>
                </p>
              )}
            </div>
          </div>
          
          {progressData[activeTab]?.length > 1 && (
            <div className={styles.changeIndicator}>
              {calculateChange().value !== 0 && (
                <>
                  <span 
                    className={`${styles.changeValue} ${calculateChange().value > 0 ? styles.increase : styles.decrease}`}
                  >
                    {calculateChange().value > 0 ? '+' : ''}{calculateChange().value} {tabConfig.find(t => t.id === activeTab)?.unit}
                  </span>
                  <span 
                    className={`${styles.changePercentage} ${calculateChange().value > 0 ? styles.increase : styles.decrease}`}
                  >
                    ({calculateChange().value > 0 ? '+' : ''}{calculateChange().percentage}%)
                  </span>
                </>
              )}
            </div>
          )}
        </div>
        
        <div className={styles.chartContainer}>
          {chartData ? (
            <Line data={chartData.data} options={chartData.options} />
          ) : (
            <div className={styles.noDataMessage}>
              No data available for this metric
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProgressPage; 