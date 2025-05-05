import React from 'react';
import styles from './Input.module.css';

const Input = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required,
  className,
  ...props
}) => {
  return (
    <div className={`${styles.inputGroup} ${className || ''}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        required={required}
        {...props}
      />
      
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
};

export default Input; 