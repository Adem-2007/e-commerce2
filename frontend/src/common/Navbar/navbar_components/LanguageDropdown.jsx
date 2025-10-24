// src/common/Navbar/LanguageDropdown.jsx

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';
import { ChevronDown } from 'lucide-react';

const LanguageDropdown = ({ language, setLanguage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'fr', name: 'French' },
        { code: 'ar', name: 'العربية' },
    ];

    const selectedLang = languages.find(l => l.code === language);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (lang) => {
        setLanguage(lang.code);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center gap-2 rounded-full p-3 text-black transition-all duration-300 hover:scale-110 hover:bg-blue-600/10 hover:text-blue-600"
                aria-label="Select Language"
            >
                <Globe size={22} />
                <span className="hidden text-sm font-medium md:block">{selectedLang?.code.toUpperCase()}</span>
                <ChevronDown size={16} className={`hidden transition-transform duration-300 md:block ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.ul
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="absolute top-full mt-2 w-40 origin-top-right rounded-xl bg-white p-2 shadow-2xl ring-1 ring-black/5 right-[-1rem] md:right-0"
                    >
                        {languages.map((lang) => (
                            <li key={lang.code}>
                                <button
                                    onClick={() => handleSelect(lang)}
                                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${selectedLang?.code === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <span>{lang.name}</span>
                                    {selectedLang?.code === lang.code && <span className="text-xs">✓</span>}
                                </button>
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LanguageDropdown;