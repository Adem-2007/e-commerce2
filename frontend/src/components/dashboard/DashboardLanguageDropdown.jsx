// src/components/dashboard/DashboardLanguageDropdown.jsx

import React, { useState, useEffect, useRef } from 'react';
import { FiChevronDown, FiGlobe } from 'react-icons/fi';
import { useDashboardLanguage } from '../../context/DashboardLanguageContext';

const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    { code: 'ar', name: 'Arabic' }
];

const DashboardLanguageDropdown = () => {
    const { language, setLanguage } = useDashboardLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedLanguage = languages.find(lang => lang.code === language) || languages[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (langCode) => {
        setLanguage(langCode);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-slate-700 hover:bg-slate-100 rounded-md px-3 py-2 transition-colors"
            >
                <FiGlobe size={18} />
                <span className="text-sm font-medium hidden sm:inline">{selectedLanguage.name}</span>
                <FiChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 rtl:right-auto rtl:left-0 top-full mt-2 w-40 bg-white border border-slate-200 rounded-lg shadow-xl z-30 overflow-hidden animate-fade-in-sm">
                    <ul className="p-1">
                        {languages.map((lang) => (
                            <li key={lang.code}>
                                <button
                                    onClick={() => handleSelect(lang.code)}
                                    className={`w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${
                                        language === lang.code
                                            ? 'bg-blue-50 text-blue-600 font-semibold'
                                            : 'text-slate-700 hover:bg-slate-100'
                                    }`}
                                >
                                    {lang.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DashboardLanguageDropdown;