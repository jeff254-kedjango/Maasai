import React from 'react';
import styles from '../../css/SalesModal.module.css';

function SalesModal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    X
                </button>
                {children}
            </div>
        </div>
    );
}

export default SalesModal;