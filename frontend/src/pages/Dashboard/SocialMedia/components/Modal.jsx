// src/pages/Dashboard/SocialMedia/components/Modal.jsx

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, children }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const modalContent = (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-70 backdrop-blur-sm animate-fadeIn"
            onClick={onClose}
        >
            <div 
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl m-4 animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Close modal"
                >
                    <X size={24} />
                </button>
                {/* Responsive padding */}
                <div className="p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
                    {children}
                </div>
            </div>
             <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
                .animate-scaleIn {
                    animation: scaleIn 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );

    if (isMounted) {
        return createPortal(modalContent, document.body);
    }

    return null;
};

export default Modal;