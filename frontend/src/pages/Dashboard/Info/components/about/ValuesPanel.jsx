// frontend/src/pages/Dashboard/Info/components/about/ValuesPanel.jsx
import React, { useState } from 'react';
import { Trash2, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ValuesPanel = ({ values, onValueChange, onAddValue, onRemoveValue, t, dir }) => {
  const [activeLang, setActiveLang] = useState('en');

  const languages = [
    { id: 'en', label: 'English' },
    { id: 'fr', label: 'Français' },
    { id: 'ar', label: 'العربية' },
  ];

  const panelVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200/80" dir={dir}>
      <div className="flex justify-between items-center mb-4 rtl:flex-row-reverse">
        <h3 className="text-xl font-semibold text-slate-800">{t('aboutPage.values.title')}</h3>
        <button
          type="button"
          onClick={onAddValue}
          className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors rtl:flex-row-reverse"
        >
          <PlusCircle className="w-5 h-5" />
          <span>{t('aboutPage.values.addValueButton')}</span>
        </button>
      </div>

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
                layoutId="active-value-lang-pill"
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {values && values.map((value, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: dir === 'rtl' ? 100 : -100 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="bg-slate-50 p-4 rounded-lg border border-slate-200"
              dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
            >
              <div className="flex justify-between items-center mb-4">
                <p className="font-semibold text-slate-700">{t('aboutPage.values.valueCardTitle').replace('{index}', index + 1)}</p>
                <button
                  type="button"
                  onClick={() => onRemoveValue(index)}
                  className="text-red-500 hover:text-red-700 p-1 rounded-full transition-colors"
                  aria-label={t('aboutPage.values.removeAriaLabel').replace('{index}', index + 1)}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* --- Animated Input Fields --- */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLang}
                  variants={panelVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div>
                    <label htmlFor={`value-title-${index}-${activeLang}`} className="block text-sm font-medium text-slate-600 mb-1">
                      {t('aboutPage.values.titleLabel')}
                    </label>
                    <input
                      type="text"
                      id={`value-title-${index}-${activeLang}`}
                      placeholder={t('aboutPage.values.titlePlaceholder')}
                      value={value.title?.[activeLang] || ''}
                      onChange={(e) => onValueChange(index, 'title', activeLang, e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor={`value-desc-${index}-${activeLang}`} className="block text-sm font-medium text-slate-600 mb-1">
                      {t('aboutPage.values.descriptionLabel')}
                    </label>
                    <textarea
                      id={`value-desc-${index}-${activeLang}`}
                      placeholder={t('aboutPage.values.descriptionPlaceholder')}
                      value={value.description?.[activeLang] || ''}
                      onChange={(e) => onValueChange(index, 'description', activeLang, e.target.value)}
                      rows="3"
                      className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ValuesPanel;