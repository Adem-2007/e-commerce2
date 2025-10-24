// frontend/src/pages/Dashboard/info/contact/form/FormLabelsPanel.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Type, AtSign, MessageSquare } from 'lucide-react';
import './FormLabelsPanel.css';

const IconicInputField = ({ icon, id, name, placeholder, value, onChange, dir }) => {
  const IconComponent = icon;
  return (
    <div className="aqueous-input-container">
      <IconComponent className="aqueous-icon" />
      <input
        type="text" id={id} name={name} value={value}
        onChange={onChange} className="aqueous-input"
        placeholder={placeholder} required dir={dir}
      />
    </div>
  );
};

const FormLabelsPanel = ({ t, labels, onLabelChange }) => {
  const [activeLang, setActiveLang] = useState('en');

  const languages = [
    { id: 'en', label: 'English' },
    { id: 'fr', label: 'Français' },
    { id: 'ar', label: 'العربية' },
  ];

  const panelVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: "easeIn" } },
  };

  return (
    <motion.div
      className="aqueous-panel"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="aqueous-header-icon">
          <Type className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-700 tracking-wide">
          {t('contactPage.formLabels.title')}
        </h3>
      </div>
      
      {/* --- Language Tabs --- */}
      <div className="relative mb-6 p-1 bg-slate-100 rounded-lg flex items-center justify-around gap-1">
        {languages.map(lang => (
          <button
            key={lang.id}
            type="button"
            onClick={() => setActiveLang(lang.id)}
            className={`relative flex-1 py-2 px-3 text-sm font-semibold transition-colors duration-300 ${activeLang === lang.id ? 'text-indigo-700' : 'text-slate-600 hover:text-slate-800'}`}
          >
            <span className="relative z-10">{lang.label}</span>
            {activeLang === lang.id && (
              <motion.div
                className="absolute inset-0 bg-white rounded-md shadow-sm"
                layoutId="active-label-lang-pill"
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
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <IconicInputField 
              icon={Type} 
              id={`name-${activeLang}`}
              name={`name.${activeLang}`}
              placeholder={t('contactPage.formLabels.namePlaceholder')}
              value={labels.name?.[activeLang] || ''} 
              onChange={onLabelChange}
              dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
            />
            <IconicInputField 
              icon={AtSign}
              id={`email-${activeLang}`}
              name={`email.${activeLang}`} 
              placeholder={t('contactPage.formLabels.emailPlaceholder')}
              value={labels.email?.[activeLang] || ''} 
              onChange={onLabelChange}
              dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
            />
            <IconicInputField 
              icon={MessageSquare}
              id={`message-${activeLang}`}
              name={`message.${activeLang}`} 
              placeholder={t('contactPage.formLabels.messagePlaceholder')}
              value={labels.message?.[activeLang] || ''} 
              onChange={onLabelChange} 
              dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default FormLabelsPanel;