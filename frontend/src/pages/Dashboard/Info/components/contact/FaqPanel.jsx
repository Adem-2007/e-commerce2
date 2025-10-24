// frontend/src/pages/Dashboard/info/contact/FaqPanel.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare } from 'lucide-react';
import FaqItem from './FaqItem';

const FaqPanel = ({ t, faqs, onFaqChange, onAddFaq, onRemoveFaq, newFaqIndex, onConfirmNewFaq }) => {
  const [activeLang, setActiveLang] = useState('en');

  const languages = [
    { id: 'en', label: 'English' },
    { id: 'fr', label: 'Français' },
    { id: 'ar', label: 'العربية' },
  ];

  return (
    <motion.div
      className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-[0_20px_50px_-20px_rgba(27,33,58,0.15)]"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
    >
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h3 className="flex items-center text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
          <MessageSquare className="mr-3 h-7 w-7 text-indigo-500" />
          {t('contactPage.faq.title')}
        </h3>
        {/* --- Language Tabs --- */}
        <div className="relative w-full sm:w-auto p-1 bg-slate-100 rounded-lg flex items-center justify-around gap-1">
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
                  layoutId="active-faq-lang-pill"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="max-h-[400px] space-y-4 overflow-y-auto pr-2 -mr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300 scrollbar-thumb-rounded-full">
        <AnimatePresence initial={false}>
          {faqs.map((faq, index) => (
            <FaqItem
              key={index}
              t={t}
              faq={faq}
              index={index}
              activeLang={activeLang} // Pass active language down
              // Create a simplified handler for the child component
              onFaqChange={(field, value) => onFaqChange(index, field, activeLang, value)}
              onRemoveFaq={onRemoveFaq}
              isNew={index === newFaqIndex}
              onConfirmNewFaq={onConfirmNewFaq}
            />
          ))}
        </AnimatePresence>
      </div>
      <div className="pt-6">
        <button
          type="button"
          onClick={onAddFaq}
          className="group flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-200 bg-transparent py-3 font-semibold text-indigo-600 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-solid hover:border-indigo-400 hover:bg-indigo-50/70 hover:text-indigo-700 hover:shadow-[0_4px_10px_-4px_rgba(79,70,229,0.3)]"
        >
          <Plus className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
          {t('contactPage.faq.addButton')}
        </button>
      </div>
    </motion.div>
  );
};

export default FaqPanel;