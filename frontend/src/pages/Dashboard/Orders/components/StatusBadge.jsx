// src/pages/Dashboard/Orders/components/StatusBadge.jsx

import React from 'react';
// MODIFIED: Replaced all lucide icons with react-icons
import { FiClock, FiCheckCircle, FiPhoneOff, FiPackage, FiCalendar, FiTruck, FiArchive, FiUserX, FiCornerUpLeft } from 'react-icons/fi';
import { BsShieldX } from 'react-icons/bs'; // --- FIXED: Imported the correct icon from the Bootstrap set
import { useDashboardLanguage } from '../../../../context/DashboardLanguageContext';

export const statusConfig = {
    'pending': { 
        labelKey: 'status_labels.pending', 
        classes: 'bg-gray-100 text-gray-800 border-gray-200',
        textColor: 'text-gray-700',
        icon: <FiClock size={16} /> 
    },
    'confirmed': { 
        labelKey: 'status_labels.confirmed', 
        classes: 'bg-blue-100 text-blue-800 border-blue-200',
        textColor: 'text-blue-700',
        icon: <FiCheckCircle size={16} /> 
    },
    'no-answer': { 
        labelKey: 'status_labels.no-answer', 
        classes: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        textColor: 'text-yellow-700',
        icon: <FiPhoneOff size={16} /> 
    },
    'ready': { 
        labelKey: 'status_labels.ready', 
        classes: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        textColor: 'text-indigo-700',
        icon: <FiPackage size={16} /> 
    },
    'postponed': { 
        labelKey: 'status_labels.postponed', 
        classes: 'bg-purple-100 text-purple-800 border-purple-200',
        textColor: 'text-purple-700',
        icon: <FiCalendar size={16} /> 
    },
    'on-the-way': { 
        labelKey: 'status_labels.on-the-way', 
        classes: 'bg-cyan-100 text-cyan-800 border-cyan-200',
        textColor: 'text-cyan-700',
        icon: <FiTruck size={16} /> 
    },
    'delivered': { 
        labelKey: 'status_labels.delivered', 
        classes: 'bg-green-100 text-green-800 border-green-200',
        textColor: 'text-green-700',
        icon: <FiArchive size={16} /> 
    },
    'canceled-staff': { 
        labelKey: 'status_labels.canceled-staff', 
        classes: 'bg-red-100 text-red-800 border-red-200',
        textColor: 'text-red-700',
        icon: <FiUserX size={16} /> 
    },
    'canceled-customer': { 
        labelKey: 'status_labels.canceled-customer', 
        classes: 'bg-red-100 text-red-800 border-red-200',
        textColor: 'text-red-700',
        icon: <BsShieldX size={16} /> // --- FIXED: Used the correct icon component
    },
    'returned': { 
        labelKey: 'status_labels.returned', 
        classes: 'bg-pink-100 text-pink-800 border-pink-200',
        textColor: 'text-pink-700',
        icon: <FiCornerUpLeft size={16} /> 
    },
    'default': { 
        labelKey: 'status_labels.pending',
        classes: 'bg-gray-100 text-gray-800 border-gray-200',
        textColor: 'text-gray-700',
        icon: <FiClock size={16} /> 
    },
};

const StatusBadge = ({ status }) => {
  const { t } = useDashboardLanguage();
  const { labelKey, classes } = statusConfig[status] || statusConfig.default;
  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize border whitespace-nowrap ${classes}`}>
      {t(labelKey)}
    </span>
  );
};

export default StatusBadge;