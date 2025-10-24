// src/pages/Product/BuyModal/ConfirmModal.jsx
import React from 'react';
import { PackageCheck, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext'; // Import the hook
import './ConfirmModal.css';

const ConfirmModal = ({ onConfirm, onClose, isSubmitting, isSuccess }) => {
    const { t } = useLanguage(); // Initialize the translation function

    // The Success View
    if (isSuccess) {
        return (
            <div className="confirm-modal-overlay">
                <div className="confirm-modal-content success-state">
                    <div className="confirm-modal-icon success">
                        <CheckCircle size={32} />
                    </div>
                    <h2 className="confirm-modal-title">{t('buy_modal.success_modal.title')}</h2>
                    <p className="confirm-modal-text">
                        {t('buy_modal.success_modal.text')}
                    </p>
                </div>
            </div>
        );
    }

    // The Confirmation View (Default)
    return (
        <div className="confirm-modal-overlay" onClick={onClose}>
            <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="confirm-modal-icon">
                    <PackageCheck size={32} />
                </div>
                <h2 className="confirm-modal-title">{t('buy_modal.confirm_modal.title')}</h2>
                <p className="confirm-modal-text">
                    {t('buy_modal.confirm_modal.text')}
                </p>
                <div className="confirm-modal-actions">
                    <button 
                        className="confirm-btn-secondary" 
                        onClick={onClose} 
                        disabled={isSubmitting}
                    >
                        {t('buy_modal.confirm_modal.cancel_button')}
                    </button>
                    <button 
                        className="confirm-btn-primary" 
                        onClick={onConfirm} 
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? t('buy_modal.confirm_modal.submitting_button') : t('buy_modal.confirm_modal.confirm_button')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;