import React, { useState, useEffect } from 'react';
import styles from './Tabs.module.css';

const Tabs = ({ children, defaultTab = 0, onTabChange }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  // Update active tab when defaultTab prop changes
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);
  
  // Filter only Tab components as children
  const tabs = React.Children.toArray(children).filter(
    child => child.type && child.type.displayName === 'Tab'
  );
  
  const handleTabChange = (index) => {
    setActiveTab(index);
    if (onTabChange) {
      onTabChange(index);
    }
  };
  
  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabsList}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`${styles.tabButton} ${activeTab === index ? styles.activeTab : ''}`}
            onClick={() => handleTabChange(index)}
            aria-selected={activeTab === index}
            role="tab"
          >
            {tab.props.label}
            {tab.props.icon && <span className={styles.tabIcon}>{tab.props.icon}</span>}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>
        {tabs[activeTab]}
      </div>
    </div>
  );
};

const Tab = ({ children }) => {
  return <div className={styles.tabPanel}>{children}</div>;
};

// Add displayName to Tab for component filtering
Tab.displayName = 'Tab';

// Export both Tabs and Tab
Tabs.Tab = Tab;

export default Tabs; 