// src/context/LanguageContext.jsx
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');
    
    // 1. حالة جديدة لتخزين الترجمات المحملة حاليًا فقط
    const [translations, setTranslations] = useState({});
    
    // 2. حالة جديدة لتتبع عملية تحميل ملف اللغة
    const [isLoading, setIsLoading] = useState(true);

    // 3. دالة لتحميل ملفات الترجمة ديناميكيًا
    const loadTranslations = useCallback(async (lang) => {
        try {
            setIsLoading(true);
            // يقوم بطلب ملف الـ JSON الخاص باللغة المحددة من مجلد public
            const response = await fetch(`/locales/main/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Could not load ${lang}.json`);
            }
            const data = await response.json();
            setTranslations(data);
        } catch (error) {
            console.error('Failed to load translations:', error);
            setTranslations({}); // في حالة الفشل، استخدم كائن فارغ
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 4. useEffect لتحميل الترجمات عند تغيير اللغة
    useEffect(() => {
        loadTranslations(language);
        localStorage.setItem('language', language);
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language, loadTranslations]);

    // 5. تعديل دالة 't' لتقرأ من الحالة الجديدة
    const t = useCallback((key) => {
        try {
            const keys = key.split('.');
            let result = translations;
            for (const k of keys) {
                result = result?.[k];
            }
            return result || key; // Return the key as a fallback
        } catch {
            return key;
        }
    }, [translations]);
    
    const dir = language === 'ar' ? 'rtl' : 'ltr';

    const value = { language, setLanguage, t, dir };

    // لا تعرض التطبيق حتى يتم تحميل ملف اللغة الأولي
    if (isLoading) {
        return null; // أو يمكنك عرض شاشة تحميل هنا
    }

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};