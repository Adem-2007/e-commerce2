// src/context/DashboardLanguageContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';

// --- Import all three translation files ---
import dashboardTranslations from '../translate/dashboard_translations.json';
import dashboardTranslationsV2 from '../translate/dashboard_translations_V2.json';
import dashboardTranslationsV3 from '../translate/dashboard_translations_V3.json';

// --- NEW: Deep Merge Utility ---
// This function recursively merges objects, ensuring nested data is combined, not replaced.
const deepMerge = (target, source) => {
    const output = { ...target };

    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    Object.assign(output, { [key]: source[key] });
                } else {
                    output[key] = deepMerge(target[key], source[key]);
                }
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }

    return output;
};

const isObject = (item) => {
    return (item && typeof item === 'object' && !Array.isArray(item));
};


// --- MODIFICATION: Use deepMerge to combine translations correctly ---
const translationsEN = deepMerge(deepMerge(dashboardTranslations.en, dashboardTranslationsV2.en), dashboardTranslationsV3.en);
const translationsFR = deepMerge(deepMerge(dashboardTranslations.fr, dashboardTranslationsV2.fr), dashboardTranslationsV3.fr);
const translationsAR = deepMerge(deepMerge(dashboardTranslations.ar, dashboardTranslationsV2.ar), dashboardTranslationsV3.ar);

const mergedTranslations = {
    en: translationsEN,
    fr: translationsFR,
    ar: translationsAR,
};

const DashboardLanguageContext = createContext();

export const DashboardLanguageProvider = ({ children }) => {
    const storageKey = 'language_dashboard';
    
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem(storageKey) || 'en';
    });

    useEffect(() => {
        localStorage.setItem(storageKey, language);
    }, [language]);

    const t = (key, options) => {
        try {
            const keys = key.split('.');
            let result = mergedTranslations[language];
            for (const k of keys) {
                if (result === undefined) break;
                result = result[k];
            }

            if (result && typeof result === 'object') {
                console.warn(`Translation for key "${key}" returned an object.`);
                return key;
            }
            
            if (result && typeof result === 'string' && options) {
                for (const optionKey in options) {
                    result = result.replace(new RegExp(`\\{${optionKey}\\}`, 'g'), options[optionKey]);
                }
            }

            return result || key;
        } catch (error) {
            console.error(`Error in translation function for key "${key}":`, error);
            return key;
        }
    };
    
    const dir = language === 'ar' ? 'rtl' : 'ltr';

    const value = {
        language,
        setLanguage,
        t,
        dir,
    };

    return (
        <DashboardLanguageContext.Provider value={value}>
            {children}
        </DashboardLanguageContext.Provider>
    );
};

export const useDashboardLanguage = () => {
    const context = useContext(DashboardLanguageContext);
    if (context === undefined) {
        throw new Error('useDashboardLanguage must be used within a DashboardLanguageProvider');
    }
    return context;
};