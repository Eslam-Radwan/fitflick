import React, { useState, useEffect, useCallback } from 'react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
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
import ProgressService from './ProgressService';

// ChartJS components
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
const tabConfig = [
  { id: 'weight', label: 'Weight', icon: <FaWeight />, color: '#4c6ef5', unit: 'kg' },
  { id: 'steps', label: 'Steps', icon: <FaRunning />, color: '#40c057', unit: 'steps' },
  { id: 'calories', label: 'Calories', icon: <FaFireAlt />, color: '#fa5252', unit: 'kcal' },
  { id: 'heartRate', label: 'Heart Rate', icon: <FaHeartbeat />, color: '#e64980', unit: 'bpm' },
  { id: 'water', label: 'Water', icon: <FaWater />, color: '#4dabf7', unit: 'ml' },
];

const ProgressPage = () => {
  const [activeTab, setActiveTab] = useState('weight');
  const [progressData, setProgressData] = useState({});
  const [chartData, setChartData] = useState(null);
  const [timeRange, setTimeRange] = useState('week');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntry, setNewEntry] = useState({ 
    value: '', 
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [formError, setFormError] = useState('');

  useEffect(() => { 

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await ProgressService.getProgress();
        
        
        console.log('Fetched progress data:', data);
        const ret = prepareData(data)
        setProgressData(ret);
        console.log('Prepared progress data:', ret);
        
        setError(null);
      } catch (err) {
        setError('Failed to load progress data');
        console.error('Error fetching progress data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [newEntry]);

  const prepareData = (prog) => {
    
    const data = {};
    tabConfig.forEach((tab) =>
    {
     
      data[tab.id] = [];
    })
      
  
    prog.forEach((item) => 
    {
      tabConfig.forEach((tab) => 
      {
        if (item.metric === tab.id) 
          data[tab.id].push(item);

      })

    })

        
      
      return data;
}
    


  const prepareChartData = useCallback(() => {
    if (!progressData[activeTab]) return;

    const tabData = progressData[activeTab];
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
  }, [progressData, activeTab, timeRange]);

  useEffect(() => {
    if (Object.keys(progressData).length > 0 && activeTab) {
      prepareChartData();
    }
  }, [progressData, activeTab, timeRange, prepareChartData]);

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

  const validateForm = () => {
    if (!newEntry.value || isNaN(newEntry.value)) {
      setFormError('Please enter a valid number');
      return false;
    }
    if (!newEntry.startDate) {
      setFormError('Please select a start date');
      return false;
    }
    if (!newEntry.endDate) {
      setFormError('Please select an end date');
      return false;
    }
    if (new Date(newEntry.startDate) > new Date(newEntry.endDate)) {
      setFormError('Start date cannot be after end date');
      return false;
    }
    return true;
  };

  const handleAddEntry = async () => {
    try {
      setFormError('');
      if (!validateForm()) return;

      const entryData = {
        metric: activeTab,
        value: parseFloat(newEntry.value),
        unit: tabConfig.find(tab => tab.id === activeTab)?.unit,
        startDate: new Date(newEntry.startDate).toISOString(),
        endDate: new Date(newEntry.endDate).toISOString()
      };

      await ProgressService.addProgressEntry(entryData);
      const updatedData = await ProgressService.getProgressStats();
      setProgressData(updatedData);
      setShowAddModal(false);
      setNewEntry({ 
        value: '', 
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0] 
      });
    } catch (err) {
      setFormError(err.message || 'Failed to add new entry');
      console.error('Error adding new entry:', err);
    }
  };

  return (
    <div className={styles.progressContainer}>
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <h1>Your Progress</h1>
          <Button
            variant="primary"
            size="small"
            onClick={() => setShowAddModal(true)}
          >
            Add Entry
          </Button>
        </div>
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

      {/* Add Entry Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setFormError('');
          setNewEntry({ 
            value: '', 
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0] 
          });
        }}
        title={`Add ${tabConfig.find(tab => tab.id === activeTab)?.label} Entry`}
      >
        <div className={styles.addEntryForm}>
          {formError && (
            <div className={styles.formError}>
              {formError}
            </div>
          )}
          <div className={styles.formGroup}>
            <label htmlFor="value">Value ({tabConfig.find(tab => tab.id === activeTab)?.unit})</label>
            <input
              type="number"
              id="value"
              value={newEntry.value}
              onChange={(e) => {
                setFormError('');
                setNewEntry({ ...newEntry, value: e.target.value });
              }}
              step="0.1"
              required
            />
          </div>
          <div className={styles.formDateGroup}>
            <div className={styles.formGroup}>
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                value={newEntry.startDate}
                onChange={(e) => {
                  setFormError('');
                  setNewEntry({ ...newEntry, startDate: e.target.value });
                }}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                value={newEntry.endDate}
                onChange={(e) => {
                  setFormError('');
                  setNewEntry({ ...newEntry, endDate: e.target.value });
                }}
                min={newEntry.startDate}
                required
              />
            </div>
          </div>
          <div className={styles.modalActions}>
            <Button 
              variant="secondary" 
              onClick={() => {
                setShowAddModal(false);
                setFormError('');
                setNewEntry({ 
                  value: '', 
                  startDate: new Date().toISOString().split('T')[0],
                  endDate: new Date().toISOString().split('T')[0] 
                });
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddEntry}>Add Entry</Button>
          </div>
        </div>
      </Modal>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      {isLoading ? (
        <div className={styles.loadingSpinner}>Loading...</div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default ProgressPage;