// src/pages/Auth/components/ButtonLoader.jsx
import React from 'react';

const ButtonLoader = () => (
    <div className="flex items-center justify-center space-x-1.5" style={{ minHeight: '24px' }}>
        <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" style={{ animationDelay: '-0.3s' }}></div>
        <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" style={{ animationDelay: '-0.15s' }}></div>
        <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></div>
    </div>
);

export default ButtonLoader;