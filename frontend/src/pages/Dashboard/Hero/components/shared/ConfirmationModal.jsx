import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useDashboardLanguage } from '../../../../../context/DashboardLanguageContext';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, isConfirming, title, message }) => {
  const { dir } = useDashboardLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop-grid"
          onClick={onClose}
          dir={dir}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="modal-content-shell relative w-full max-w-md rounded-lg text-gray-200 p-8 text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-900/50 border-2 border-red-500/50 mb-4">
              <AlertTriangle className="h-8 w-8 text-red-400" aria-hidden="true" />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-400 mb-8">{message}</p>

            <div className="flex justify-center items-center gap-4">
              <button
                type="button"
                onClick={onClose}
                className="wireframe-button text-sm font-semibold"
              >
                {/* This button text will be passed from the parent */}
                CANCEL
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isConfirming}
                className="pressable-button-modal min-w-[150px] px-6 py-2.5 rounded-md text-sm font-bold flex items-center justify-center bg-red-600 border-b-4 border-red-800 hover:bg-red-500 active:border-b-2"
              >
                {isConfirming ? <Loader2 className="animate-spin" size={20} /> : 'DELETE'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;