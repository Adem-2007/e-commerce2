// src/pages/Dashboard/common/ConfirmationModal.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import './ConfirmationModal.css';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="confirmation-modal-container"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-icon-wrapper">
              <AlertTriangle size={32} className="modal-icon" />
            </div>
            <h2 className="modal-title">{title}</h2>
            <p className="modal-message">{message}</p>
            <div className="modal-actions">
              <button onClick={onClose} disabled={isLoading} className="cancel-button">
                {cancelText}
              </button>
              <button onClick={onConfirm} disabled={isLoading} className="confirm-button">
                {isLoading ? <Loader2 className="animate-spin" /> : confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;