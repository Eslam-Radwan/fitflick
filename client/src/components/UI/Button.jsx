import React from 'react';
import styles from './Button.module.css';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled,
  fullWidth,
  className,
  ...props
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    className || ''
  ].join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 