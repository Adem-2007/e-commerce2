// src/pages/Auth/components/AuthInput.jsx
import React from 'react';

const AuthInput = ({ id, name, type = "text", placeholder, value, onChange, label, Icon, required = false }) => {
    return (
        <div>
            <label htmlFor={id} className="flex items-center text-sm font-medium text-gray-700 mb-2 rtl:text-right">
                {Icon && <Icon size={16} className="mr-2 rtl:mr-0 rtl:ml-2 text-gray-500" />}
                {label}
            </label>
            <input
                id={id}
                type={type}
                name={name}
                placeholder={placeholder}
                className="w-full py-3 px-4 border border-gray-300 bg-white rounded-lg text-gray-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 rtl:text-right"
                value={value}
                onChange={onChange}
                required={required}
            />
        </div>
    );
};

export default AuthInput;