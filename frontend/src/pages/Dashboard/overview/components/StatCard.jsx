// src/pages/Dashboard/overview/components/StatCard.jsx
import React from 'react';

const StatCard = ({ icon, title, value, iconBgColor = 'bg-gray-100', iconTextColor = 'text-gray-600' }) => (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 shadow-sm hover:-translate-y-1 hover:shadow-lg">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBgColor} ${iconTextColor}`}>
            {icon}
        </div>
        <div className="overflow-hidden">
            <h3 className="text-sm font-medium text-gray-500 truncate">{title}</h3>
            <p className="text-2xl font-bold text-gray-800 mt-1 truncate">{value}</p>
        </div>
    </div>
);

export default StatCard;