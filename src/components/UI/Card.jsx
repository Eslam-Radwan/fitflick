import React from 'react';
import styles from './Card.module.css';

const Card = ({ 
  children, 
  title, 
  icon,
  accentColor, 
  className,
  onClick
}) => {
  return (
    <div 
      className={`${styles.card} ${className || ''}`} 
      style={{ 
        '--accent-color': accentColor || 'var(--color-blue)' 
      }}
      onClick={onClick}
    >
      {(title || icon) && (
        <div className={styles.cardHeader}>
          {icon && <div className={styles.cardIcon}>{icon}</div>}
          {title && <h3 className={styles.cardTitle}>{title}</h3>}
        </div>
      )}
      <div className={styles.cardContent}>
        {children}
      </div>
    </div>
  );
};

export default Card; 