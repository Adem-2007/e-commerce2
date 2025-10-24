// src/pages/Dashboard/SocialMedia/components/StatCard.jsx

import React from 'react';

const StatCard = ({ icon, title, value }) => (
    // Updated styling to match the provided image
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
        <div className="bg-gray-100 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);

export default StatCard;