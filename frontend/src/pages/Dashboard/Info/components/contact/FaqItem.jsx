// frontend/src/pages/Dashboard/info/contact/FaqItem.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Trash2, CheckCircle } from 'lucide-react';

// UPDATED: Props now include activeLang and a simplified onFaqChange handler
const FaqItem = ({ t, faq, onFaqChange, onRemoveFaq, isNew, onConfirmNewFaq, activeLang, index }) => {
  const [isOpen, setIsOpen] = useState(isNew);
  const isRtl = activeLang === 'ar';

  useEffect(() => {
    const styleId = 'animated-gradient-border-keyframes';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        @keyframes animated-gradient-border {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const handleInteraction = (e) => e.stopPropagation();

  const animatedGradientStyle = {
    background: 'linear-gradient(90deg, #a5b4fc, #818cf8, #6366f1, #a5b4fc)',
    backgroundSize: '400% 400%',
    animation: 'animated-gradient-border 4s ease infinite',
  };

  const content = (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`relative w-full transition-shadow duration-300 ${
        isNew 
          ? 'bg-indigo-50/70 rounded-[14px]'
          : 'bg-slate-50 border border-slate-200 rounded-2xl hover:shadow-lg hover:shadow-slate-500/5'
      }`}
    >
      <header className="flex items-center gap-2 p-2 pr-1 sm:p-2 sm:pl-5">
        <button type="button" onClick={() => setIsOpen(!isOpen)} className="flex flex-grow items-center text-left">
          <input
            type="text"
            // UPDATED: Display value for the active language
            value={faq.question?.[activeLang] || ''}
            // UPDATED: Call the new, simplified handler
            onChange={(e) => onFaqChange('question', e.target.value)}
            placeholder={t('contactPage.faq.questionPlaceholder')}
            className="w-full bg-transparent py-3 text-base font-semibold text-slate-700 placeholder-slate-400 caret-indigo-500 focus:outline-none"
            onClick={handleInteraction}
            dir={isRtl ? 'rtl' : 'ltr'} // Set direction
          />
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="flex-shrink-0 p-2">
            <ChevronDown className="h-5 w-5 text-slate-400" />
          </motion.div>
        </button>
        <div className="flex items-center">
          {isNew ? (
            <button
              type="button" onClick={onConfirmNewFaq}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 transition-all duration-200 hover:scale-110 hover:bg-indigo-200 hover:text-indigo-700"
              aria-label={t('contactPage.faq.ariaConfirm')}
            >
              <CheckCircle className="h-5 w-5" />
            </button>
          ) : (
            <button
              type="button" onClick={() => onRemoveFaq(index)} // onRemoveFaq still needs the index
              className="flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-slate-400 transition-all duration-200 hover:scale-110 hover:bg-red-100 hover:text-red-500"
              aria-label={t('contactPage.faq.ariaRemove')}
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
        </div>
      </header>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            key="content" initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden px-5"
          >
            <textarea
              // UPDATED: Display value for the active language
              value={faq.answer?.[activeLang] || ''}
              // UPDATED: Call the new, simplified handler
              onChange={(e) => onFaqChange('answer', e.target.value)}
              placeholder={t('contactPage.faq.answerPlaceholder')}
              className="w-full resize-none border-t border-slate-200 bg-transparent pt-2 pb-5 text-sm sm:text-[15px] leading-relaxed text-slate-600 placeholder-slate-400 caret-indigo-500 focus:outline-none"
              rows={3}
              dir={isRtl ? 'rtl' : 'ltr'} // Set direction
            />
          </motion.section>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return isNew ? (<div className="rounded-2xl p-0.5" style={animatedGradientStyle}>{content}</div>) : (content);
};

export default FaqItem;