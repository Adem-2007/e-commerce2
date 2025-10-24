// src/pages/Dashboard/Categories/components/ConfirmationPanel.jsx

import React from 'react';
import { AlertTriangle, Loader2, Trash2, X } from 'lucide-react';
import './ConfirmationPanel.css'; // We will create this CSS file next

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const ConfirmationPanel = ({ product, onConfirm, onCancel, isDeleting }) => {
    if (!product) return null;

    const imageUrl = `${API_BASE_URL}${product.thumbnailUrl}`;

    return (
        <div className="confirmation-panel-container">
            <div className="confirmation-content">
                <div className="confirmation-icon-wrapper">
                    <AlertTriangle size={32} className="confirmation-icon" />
                </div>
                <h3 className="confirmation-title">Confirm Deletion</h3>
                <p className="confirmation-message">
                    Are you sure you want to permanently delete this product?
                </p>

                <div className="product-identity">
                    <img src={imageUrl} alt={product.name} className="product-thumbnail" />
                    <span className="product-name-confirm">{product.name}</span>
                </div>

                <p className="confirmation-warning">
                    This action cannot be undone.
                </p>

                <div className="confirmation-actions">
                    <button onClick={onCancel} disabled={isDeleting} className="panel-cancel-button">
                        <X size={18} className="mr-2" />
                        Cancel
                    </button>
                    <button onClick={onConfirm} disabled={isDeleting} className="panel-confirm-button">
                        {isDeleting ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <>
                                <Trash2 size={18} className="mr-2" />
                                Yes, Delete Product
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPanel;

