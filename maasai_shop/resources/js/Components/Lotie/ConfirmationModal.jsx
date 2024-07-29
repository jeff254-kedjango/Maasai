import React from 'react';
import styles from '../../../css/components/ConfirmationModal.module.css'; // Adjust the path as needed

const ConfirmationModal = ({ show, onClose, onConfirm, title }) => {
    if (!show) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3>Are you sure you want to delete "{title}"?</h3>
                <div className={styles.modalActions}>
                    <button onClick={onConfirm} className={styles.confirmButton}>Confirm</button>
                    <button onClick={onClose} className={styles.cancelButton}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;