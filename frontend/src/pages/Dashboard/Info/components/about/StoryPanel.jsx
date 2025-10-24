// frontend/src/pages/Dashboard/Info/components/about/StoryPanel.jsx
import React, { useState } from 'react';
import { Trash2, PlusCircle, X, Check, List, Eye, Edit, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmationModal from '../../../common/ConfirmationModal';
import { useDashboardLanguage } from '../../../../../context/DashboardLanguageContext';

const StoryPanel = ({ story, onMilestoneChange, onMilestoneYearChange, onAddMilestone, onRemoveMilestone, onAchievementChange, onAddAchievement, onRemoveAchievement }) => {
  const { t, dir } = useDashboardLanguage();
  
  // Component state
  const [activeLang, setActiveLang] = useState('en');
  const [view, setView] = useState('manage'); // 'manage' or 'create'
  const [editingIndex, setEditingIndex] = useState(null); // index of the story item being edited
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [newMilestone, setNewMilestone] = useState({
    title: { en: '', ar: '', fr: '' },
    year: '',
    description: { en: '', ar: '', fr: '' },
    achievements: [],
  });

  const languages = [
    { id: 'en', label: 'English' },
    { id: 'fr', label: 'Français' },
    { id: 'ar', label: 'العربية' },
  ];
  
  // --- Event Handlers ---

  const handleNewMilestoneChange = (field, lang, value) => {
    setNewMilestone(prev => ({ ...prev, [field]: { ...prev[field], [lang]: value } }));
  };
  
  const handleSaveNewMilestone = () => {
    // Basic validation
    if (!newMilestone.title.en || !newMilestone.year) {
      alert(t('aboutPage.story.alertMissingFields'));
      return;
    }
    onAddMilestone(newMilestone);
    // Reset form and switch view
    setNewMilestone({ title: { en: '', ar: '', fr: '' }, year: '', description: { en: '', ar: '', fr: '' }, achievements: [] });
    setView('manage');
  };

  const handleOpenModal = (index) => {
    setDeletingIndex(index);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setDeletingIndex(null);
    setIsModalOpen(false);
  };
  const handleConfirmDelete = () => {
    if (deletingIndex !== null) {
      onRemoveMilestone(deletingIndex);
    }
    handleCloseModal();
  };
  
  // --- Reusable UI Components ---

  const LanguageTabs = ({ uniqueId }) => (
    <div className="relative mb-6 p-1 bg-slate-100 rounded-lg flex items-center justify-around gap-1">
      {languages.map(lang => (
        <button key={lang.id} type="button" onClick={() => setActiveLang(lang.id)} className={`relative flex-1 py-2 px-3 text-sm font-semibold transition-colors duration-300 ${activeLang === lang.id ? 'text-indigo-700' : 'text-slate-600 hover:text-slate-800'}`}>
          <span className="relative z-10">{lang.label}</span>
          {activeLang === lang.id && <motion.div className="absolute inset-0 bg-white rounded-md shadow-sm" layoutId={`story-lang-pill-${uniqueId}`} transition={{ type: "spring", stiffness: 400, damping: 35 }} />}
        </button>
      ))}
    </div>
  );
  
  // --- Render Functions for Views ---

  const renderEditView = () => {
    const milestone = story[editingIndex];
    if (!milestone) return null;

    return (
      <motion.div key={`editing-${editingIndex}`} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
        <div className="mb-4">
           <button type="button" onClick={() => setEditingIndex(null)} className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors">
              <ArrowLeft className="w-4 h-4" /> {t('aboutPage.story.backButton')}
           </button>
        </div>
        <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
          <LanguageTabs uniqueId={editingIndex} />
          <div className="space-y-4" dir={activeLang === 'ar' ? 'rtl' : 'ltr'}>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">{t('aboutPage.story.titleLabel')}</label>
              <input type="text" value={milestone.title?.[activeLang] || ''} onChange={(e) => onMilestoneChange(editingIndex, 'title', activeLang, e.target.value)} className="w-full p-2 border border-slate-300 rounded-md"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">{t('aboutPage.story.yearLabel')}</label>
              <input type="text" value={milestone.year} onChange={(e) => onMilestoneYearChange(editingIndex, e.target.value)} className="w-full p-2 border border-slate-300 rounded-md"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">{t('aboutPage.story.descriptionLabel')}</label>
              <textarea value={milestone.description?.[activeLang] || ''} onChange={(e) => onMilestoneChange(editingIndex, 'description', activeLang, e.target.value)} rows="3" className="w-full p-2 border border-slate-300 rounded-md"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">{t('aboutPage.story.achievementsLabel')}</label>
              {milestone.achievements.map((ach, achIndex) => (
                 <div key={achIndex} className="flex items-center gap-2 mb-2">
                    <input type="text" value={ach?.[activeLang] || ''} onChange={(e) => onAchievementChange(editingIndex, achIndex, activeLang, e.target.value)} className="w-full p-2 border border-slate-200 rounded-md bg-white text-sm" />
                    <button type="button" onClick={() => onRemoveAchievement(editingIndex, achIndex)} className="text-slate-400 hover:text-red-500 p-1"><X className="w-4 h-4" /></button>
                 </div>
              ))}
              <button type="button" onClick={() => onAddAchievement(editingIndex)} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-2 mt-2">
                <PlusCircle className="w-4 h-4" />
                {t('aboutPage.story.addPointPlaceholder')}
              </button>
            </div>
            <div className="flex justify-end pt-2">
              <button type="button" onClick={() => setEditingIndex(null)} className="flex items-center gap-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors px-6 py-2.5 rounded-lg shadow-sm">
                <Check className="w-5 h-5" /> {t('aboutPage.story.doneButton')}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };
  
  const renderManageView = () => (
    <motion.div key="card-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-4">
      {story && story.length > 0 ? (
        story.map((milestone, index) => (
          <motion.div key={milestone._id || index} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 shadow-sm">
            <div>
              <span className="text-xs font-semibold text-slate-500 bg-slate-200/80 px-2 py-1 rounded-full">{milestone.year}</span>
              <p className="font-bold text-lg text-slate-800 mt-1">{milestone.title?.[dir === 'rtl' ? 'ar' : 'en'] || milestone.title?.en}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setEditingIndex(index)} type="button" className="p-2 rounded-md text-slate-500 hover:bg-slate-200 hover:text-indigo-600 transition-colors"><Edit className="w-5 h-5" /></button>
              <button onClick={() => handleOpenModal(index)} type="button" className="p-2 rounded-md text-slate-500 hover:bg-red-100 hover:text-red-600 transition-colors"><Trash2 className="w-5 h-5" /></button>
            </div>
          </motion.div>
        ))
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
          <Eye className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-2 text-lg font-medium text-slate-800">{t('aboutPage.story.emptyTitle')}</h3>
          <p className="mt-1 text-sm text-slate-500">{t('aboutPage.story.emptyDescription')}</p>
        </div>
      )}
    </motion.div>
  );

  const renderCreateView = () => (
    <motion.div key="create" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>
      <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
        <LanguageTabs uniqueId="create" />
        <div className="space-y-4" dir={activeLang === 'ar' ? 'rtl' : 'ltr'}>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">{t('aboutPage.story.titleLabel')}</label>
              <input type="text" placeholder={t('aboutPage.story.titlePlaceholder')} value={newMilestone.title[activeLang]} onChange={(e) => handleNewMilestoneChange('title', activeLang, e.target.value)} className="w-full p-2 border border-slate-300 rounded-md"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">{t('aboutPage.story.yearLabel')}</label>
              <input type="text" placeholder={t('aboutPage.story.yearPlaceholder')} value={newMilestone.year} onChange={(e) => setNewMilestone(p => ({...p, year: e.target.value}))} className="w-full p-2 border border-slate-300 rounded-md"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">{t('aboutPage.story.descriptionLabel')}</label>
              <textarea placeholder={t('aboutPage.story.descriptionPlaceholder')} value={newMilestone.description[activeLang]} onChange={(e) => handleNewMilestoneChange('description', activeLang, e.target.value)} rows="4" className="w-full p-2 border border-slate-300 rounded-md"/>
            </div>
            <div className="flex justify-end pt-2">
              <button type="button" onClick={handleSaveNewMilestone} className="flex items-center gap-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors px-6 py-2.5 rounded-lg shadow-sm">
                <PlusCircle className="w-5 h-5" /> <span>{t('aboutPage.story.saveButton')}</span>
              </button>
            </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      <ConfirmationModal isOpen={isModalOpen} onClose={handleCloseModal} onConfirm={handleConfirmDelete} title={t('aboutPage.story.deleteModalTitle')} message={t('aboutPage.story.deleteModalMessage')} confirmText={t('aboutPage.story.deleteModalConfirm')} />
      <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200/80" dir={dir}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-slate-800">{t('aboutPage.story.title')}</h3>
          <div className="relative p-1 bg-slate-100 rounded-lg flex items-center">
            <button onClick={() => { setView('manage'); setEditingIndex(null); }} className={`relative flex items-center py-1.5 px-4 text-sm font-semibold transition-colors ${view === 'manage' ? "text-indigo-700" : "text-slate-600 hover:text-slate-800"}`}><span className="relative z-10 flex items-center"><List className="w-4 h-4 mr-2" />{t('aboutPage.story.manageView')}</span>{view === 'manage' && <motion.div className="absolute inset-0 bg-white rounded-md shadow-sm" layoutId="story-panel-pill" />}</button>
            <button onClick={() => { setView('create'); setEditingIndex(null); }} className={`relative flex items-center py-1.5 px-4 text-sm font-semibold transition-colors ${view === 'create' ? "text-indigo-700" : "text-slate-600 hover:text-slate-800"}`}><span className="relative z-10 flex items-center"><PlusCircle className="w-4 h-4 mr-2" />{t('aboutPage.story.createView')}</span>{view === 'create' && <motion.div className="absolute inset-0 bg-white rounded-md shadow-sm" layoutId="story-panel-pill" />}</button>
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          {view === 'manage' ? (editingIndex !== null ? renderEditView() : renderManageView()) : renderCreateView()}
        </AnimatePresence>
      </div>
    </>
  );
};

export default StoryPanel;