import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Type, MessageSquareText } from 'lucide-react';

const MAX_TITLE_LENGTH = 60;
const MAX_SUBTITLE_LENGTH = 150;

// A reusable, styled character counter component
const CharacterCounter = ({ count, max }) => {
    const percentage = (count / max) * 100;
    let colorClass = 'text-slate-400';
    if (percentage > 100) {
        colorClass = 'text-red-500 font-semibold';
    } else if (percentage >= 85) {
        colorClass = 'text-amber-500';
    }
    return (
        <span className={`absolute top-4 right-4 text-xs font-mono transition-colors duration-300 ${colorClass}`}>
            {count || 0}/{max}
        </span>
    );
};

// A reusable, styled input field for multilingual content
const MultilingualInput = ({ name, value, onChange, maxLength, dir, label }) => (
    <div className="group relative">
        <label htmlFor={name} className="absolute top-4 left-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-all duration-300 group-focus-within:text-indigo-600 group-focus-within:-translate-y-6 group-focus-within:scale-90 group-focus-within:bg-white group-focus-within:px-1">
            <Type className="h-4 w-4" />
            {label}
        </label>
        <input
            type="text"
            id={name}
            name={name}
            value={value || ''}
            onChange={onChange}
            className="w-full bg-slate-100/50 rounded-xl border border-slate-200/80 p-6 pt-10 text-base text-slate-800 outline-none transition-all duration-300 focus:border-indigo-400 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
            maxLength={maxLength + 10}
            dir={dir}
        />
        <CharacterCounter count={value?.length} max={maxLength} />
    </div>
);

// A reusable, styled textarea for multilingual content
const MultilingualTextarea = ({ name, value, onChange, maxLength, dir, label }) => (
    <div className="group relative">
        <label htmlFor={name} className="absolute top-4 left-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-all duration-300 group-focus-within:text-indigo-600 group-focus-within:-translate-y-6 group-focus-within:scale-90 group-focus-within:bg-white group-focus-within:px-1">
            <MessageSquareText className="h-4 w-4" />
            {label}
        </label>
        <textarea
            id={name}
            name={name}
            rows={5}
            value={value || ''}
            onChange={onChange}
            className="w-full resize-y bg-slate-100/50 rounded-xl border border-slate-200/80 p-6 pt-10 text-base leading-relaxed text-slate-800 outline-none transition-all duration-300 focus:border-indigo-400 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
            maxLength={maxLength + 15}
            dir={dir}
        ></textarea>
        <CharacterCounter count={value?.length} max={maxLength} />
    </div>
);


const HeroPanel = ({ t, heroData, onFormChange }) => {
    const [activeLang, setActiveLang] = useState('en');
    const { heroTitle, heroSubtitle } = heroData;

    // Data for language tabs
    const languages = [
        { id: 'en', label: 'English' },
        { id: 'fr', label: 'Français' },
        { id: 'ar', label: 'العربية' },
    ];

    useEffect(() => {
        const styleId = 'pulsate-glow-keyframes';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                @keyframes pulsate-glow {
                    0% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.3), 0 0 20px -5px rgba(79, 70, 229, 0.1); }
                    70% { box-shadow: 0 0 0 10px rgba(79, 70, 229, 0), 0 0 30px 0px rgba(79, 70, 229, 0.2); }
                    100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0), 0 0 20px -5px rgba(79, 70, 229, 0.1); }
                }`;
            document.head.appendChild(style);
        }
    }, []);

    // Animation variants for the content panels
    const panelVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: "easeIn" } },
    };
    
    // Animation variants for the preview text
    const textVariants = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.3, ease: 'easeInOut' } },
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start p-4 sm:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-900/5">
            {/* --- EDITOR SIDE --- */}
            <div className="flex flex-col h-full lg:col-span-3">
                <h3 className="flex items-center text-xl font-bold text-slate-800 mb-4">
                    <Target className="w-6 h-6 mr-3 text-indigo-500" />
                    {t('contactPage.hero.editorTitle')}
                </h3>
                
                {/* --- Language Tabs --- */}
                <div className="relative mb-6 p-1 bg-slate-100 rounded-lg flex items-center justify-around gap-1">
                    {languages.map(lang => (
                        <button
                            key={lang.id}
                            type="button"
                            onClick={() => setActiveLang(lang.id)}
                            className={`relative flex-1 py-2 px-3 text-sm font-semibold transition-colors duration-300 ${
                                activeLang === lang.id ? 'text-indigo-700' : 'text-slate-600 hover:text-slate-800'
                            }`}
                        >
                            <span className="relative z-10">{lang.label}</span>
                            {activeLang === lang.id && (
                                <motion.div
                                    className="absolute inset-0 bg-white rounded-md shadow-sm"
                                    layoutId="active-lang-pill"
                                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* --- Animated Input Panels --- */}
                <div className="relative flex-grow">
                     <AnimatePresence mode="wait">
                        <motion.div
                            key={activeLang}
                            variants={panelVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="space-y-6"
                        >
                           <MultilingualInput
                                label={t('contactPage.hero.titleLabel')}
                                name={`heroTitle.${activeLang}`}
                                value={heroTitle?.[activeLang]}
                                onChange={onFormChange}
                                maxLength={MAX_TITLE_LENGTH}
                                dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                           />
                           <MultilingualTextarea
                                label={t('contactPage.hero.subtitleLabel')}
                                name={`heroSubtitle.${activeLang}`}
                                value={heroSubtitle?.[activeLang]}
                                onChange={onFormChange}
                                maxLength={MAX_SUBTITLE_LENGTH}
                                dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                           />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* --- PREVIEW SIDE --- */}
            <div className="h-full lg:col-span-2">
                 <div className="sticky top-28 flex h-full min-h-[350px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-tr from-slate-50 to-indigo-50 shadow-inner shadow-slate-200 after:pointer-events-none after:absolute after:inset-0 after:z-10 after:rounded-xl after:[animation:pulsate-glow_4s_cubic-bezier(0.4,0,0.6,1)_infinite]">
                    <div className="flex items-center gap-2 border-b border-slate-200/80 bg-white/50 p-3">
                        <div className="h-3 w-3 rounded-full bg-red-400"></div>
                        <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                        <div className="h-3 w-3 rounded-full bg-green-400"></div>
                        <div className="ml-auto text-xs font-medium text-slate-400">Preview</div>
                    </div>
                    <div className="flex flex-grow flex-col items-center justify-center p-8 text-center" dir={activeLang === 'ar' ? 'rtl' : 'ltr'}>
                        <AnimatePresence mode="wait">
                            <motion.h1
                                key={`title-${activeLang}`}
                                className="max-w-[20ch] break-words text-2xl font-extrabold leading-tight text-slate-800 sm:text-3xl lg:text-4xl"
                                variants={textVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            >
                                {heroTitle?.[activeLang] || t('contactPage.hero.previewTitle')}
                            </motion.h1>
                        </AnimatePresence>
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={`subtitle-${activeLang}`}
                                className="mt-4 max-w-[35ch] break-words text-base leading-relaxed text-slate-600 sm:text-lg"
                                variants={textVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            >
                                {heroSubtitle?.[activeLang] || t('contactPage.hero.previewSubtitle')}
                            </motion.p>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroPanel;