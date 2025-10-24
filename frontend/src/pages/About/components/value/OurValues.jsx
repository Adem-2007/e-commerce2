// frontend/src/pages/About/components/value/OurValues.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../../context/LanguageContext';

const OurValues = ({ values }) => {
  const { language, t } = useLanguage(); // --- GET THE CURRENT LANGUAGE ---

  if (!values || values.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-50/50 py-20 sm:py-28 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-4"
          >
            {t('about_page.values.badge')}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight"
          >
            {t('about_page.values.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto"
          >
            {t('about_page.values.description')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              className="group relative bg-white p-8 sm:p-10 rounded-2xl overflow-hidden transition-all duration-500 ease-in-out hover:shadow-2xl hover:shadow-indigo-100/50"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -right-12 -top-12 w-40 h-40 bg-indigo-50 rounded-full transition-transform duration-700 ease-out group-hover:scale-[1.5] group-hover:translate-x-6"></div>
                <div className="absolute right-0 bottom-0 w-24 h-24 bg-blue-50 rounded-full transition-transform duration-700 ease-out group-hover:translate-x-8 group-hover:translate-y-8"></div>
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg mb-6 transition-all duration-500 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 transition-colors duration-300 group-hover:text-indigo-600">
                  {/* --- UPDATED: Display text for the current language --- */}
                  {value.title?.[language]}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {/* --- UPDATED: Display text for the current language --- */}
                  {value.description?.[language]}
                </p>
                <div className="mt-6 flex items-center gap-2 text-slate-400 transition-colors duration-300 group-hover:text-indigo-500">
                  <div className="w-12 h-px bg-current transition-all duration-500 group-hover:w-16"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurValues;