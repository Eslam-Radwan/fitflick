import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';
import styles from './Modal.module.css';

const Modal = ({ isOpen, onClose, title, children, size = 'medium' }) => {
  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      // Restore body scroll when modal is closed
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);
  
  // Close modal when clicking outside content area
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  // Create portal to render modal at the end of document body
  return createPortal(
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={`${styles.modalContent} ${styles[size]}`}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button 
            className={styles.closeButton} 
            onClick={onClose}
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </div>
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal; 