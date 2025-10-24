// frontend/src/pages/Dashboard/Info/components/about/MembersPanel.jsx
import React, { useState } from 'react';
import { Trash2, PlusCircle, UploadCloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardLanguage } from '../../../../../context/DashboardLanguageContext';

// A reusable component for language selection within each member card
const LanguageTabs = ({ activeLang, setActiveLang, memberIndex }) => (
  <div className="relative mb-4 p-1 bg-slate-200/60 rounded-lg flex items-center justify-around gap-1">
    {['en', 'fr', 'ar'].map(lang => (
      <button
        key={lang}
        type="button"
        onClick={() => setActiveLang(lang)}
        className={`relative flex-1 py-1 px-2 text-xs font-semibold transition-colors duration-300 ${activeLang === lang ? 'text-indigo-700' : 'text-slate-600 hover:text-slate-800'}`}
      >
        <span className="relative z-10 capitalize">{lang}</span>
        {activeLang === lang && (
          <motion.div
            className="absolute inset-0 bg-white rounded-md shadow-sm"
            layoutId={`member-lang-pill-${memberIndex}`} // Unique layoutId per member
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
          />
        )}
      </button>
    ))}
  </div>
);

const MembersPanel = ({ members, onMemberChange, onAddMember, onRemoveMember, onMemberImageChange }) => {
  const { t, dir } = useDashboardLanguage();
  
  const [activeLangs, setActiveLangs] = useState({});

  const handleLangChange = (index, lang) => {
    setActiveLangs(prev => ({ ...prev, [index]: lang }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200/80" dir={dir}>
      <div className="flex justify-between items-center mb-6 rtl:flex-row-reverse">
        <h3 className="text-xl font-semibold text-slate-800">{t('aboutPage.members.title')}</h3>
        <button type="button" onClick={onAddMember} className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors rtl:flex-row-reverse">
          <PlusCircle className="w-5 h-5" />
          <span>{t('aboutPage.members.addMemberButton')}</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {members && members.map((member, index) => {
            const activeLang = activeLangs[index] || 'en';
            return (
              <motion.div
                key={member._id || index}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring' }}
                className="bg-slate-50 p-4 rounded-lg border border-slate-200"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2 rtl:text-right">{t('aboutPage.members.photoLabel')}</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        {member.image ? (
                          // --- UPDATED: Simplified img src to directly use the Base64 string ---
                          <img src={member.image} alt={member.name?.[activeLang] || 'Member'} className="mx-auto h-24 w-24 object-cover rounded-full mb-2" />
                        ) : (
                          <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                        )}
                        <div className="flex text-sm text-slate-600 justify-center">
                          <label htmlFor={`file-upload-${index}`} className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                            <span>{member.image ? t('aboutPage.members.changePhoto') : t('aboutPage.members.uploadFile')}</span>
                            <input id={`file-upload-${index}`} name={`file-upload-${index}`} type="file" className="sr-only" onChange={(e) => onMemberImageChange(index, e.target.files[0])} accept="image/*" />
                          </label>
                        </div>
                        <p className="text-xs text-slate-500">{t('aboutPage.members.uploadHint')}</p>
                      </div>
                    </div>
                  </div>

                  <LanguageTabs
                    activeLang={activeLang}
                    setActiveLang={(lang) => handleLangChange(index, lang)}
                    memberIndex={index}
                  />

                  <div dir={activeLang === 'ar' ? 'rtl' : 'ltr'}>
                    <div>
                      <label htmlFor={`name-${index}-${activeLang}`} className="block text-sm font-medium text-slate-600">{t('aboutPage.members.nameLabel')}</label>
                      <input
                        type="text"
                        id={`name-${index}-${activeLang}`}
                        value={member.name?.[activeLang] || ''}
                        onChange={(e) => onMemberChange(index, 'name', activeLang, e.target.value)}
                        className="mt-1 block w-full p-2 border border-slate-300 rounded-md"
                        placeholder={t('aboutPage.members.namePlaceholder')}
                      />
                    </div>
                    <div className="mt-4">
                      <label htmlFor={`role-${index}-${activeLang}`} className="block text-sm font-medium text-slate-600">{t('aboutPage.members.roleLabel')}</label>
                      <input
                        type="text"
                        id={`role-${index}-${activeLang}`}
                        value={member.role?.[activeLang] || ''}
                        onChange={(e) => onMemberChange(index, 'role', activeLang, e.target.value)}
                        className="mt-1 block w-full p-2 border border-slate-300 rounded-md"
                        placeholder={t('aboutPage.members.rolePlaceholder')}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-5 text-right rtl:text-left">
                  <button
                    type="button"
                    onClick={() => onRemoveMember(index)}
                    className="inline-flex items-center justify-center text-sm font-semibold text-red-600 hover:text-red-800 transition-colors rtl:flex-row-reverse"
                  >
                    <Trash2 className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                    <span>{t('aboutPage.members.removeButton')}</span>
                  </button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MembersPanel;