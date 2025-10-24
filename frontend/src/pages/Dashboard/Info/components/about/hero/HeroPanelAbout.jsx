// frontend/src/pages/Dashboard/Info/components/about/hero/HeroPanelAbout.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HeroPanelAbout = ({ heroData, onFormChange, t }) => {
  const [activeLang, setActiveLang] = useState('en');

  const languages = [
    { id: 'en', label: 'English' },
    { id: 'fr', label: 'Français' },
    { id: 'ar', label: 'العربية' },
  ];

  const panelVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: "easeIn" } },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200/80">
      <h3 className="text-xl font-semibold text-slate-800 mb-4">{t('aboutPage.hero.title')}</h3>

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
                layoutId="active-about-lang-pill"
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* --- Animated Input Panels --- */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLang}
            variants={panelVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-4"
            dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
          >
            <div>
              <label htmlFor={`aboutHeroTitle.${activeLang}`} className="block text-sm font-medium text-slate-600 mb-1">
                {t('aboutPage.hero.heroTitleLabel')}
              </label>
              <input
                type="text"
                id={`aboutHeroTitle.${activeLang}`}
                name={`aboutHeroTitle.${activeLang}`}
                value={heroData?.aboutHeroTitle?.[activeLang] || ''}
                onChange={onFormChange}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                placeholder={t('aboutPage.hero.heroTitlePlaceholder')}
              />
            </div>
            <div>
              <label htmlFor={`aboutHeroSubtitle.${activeLang}`} className="block text-sm font-medium text-slate-600 mb-1">
                {t('aboutPage.hero.heroSubtitleLabel')}
              </label>
              <textarea
                id={`aboutHeroSubtitle.${activeLang}`}
                name={`aboutHeroSubtitle.${activeLang}`}
                value={heroData?.aboutHeroSubtitle?.[activeLang] || ''}
                onChange={onFormChange}
                rows="3"
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                placeholder={t('aboutPage.hero.heroSubtitlePlaceholder')}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HeroPanelAbout;