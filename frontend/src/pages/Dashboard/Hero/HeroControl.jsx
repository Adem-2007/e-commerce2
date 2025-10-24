// frontend/src/pages/Dashboard/Hero/HeroControl.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroModalEdit from './components/hero/HeroModalEdit';
import HeroModalCreate from './components/hero/HeroModalCreate';
import { useDashboardLanguage } from '../../../context/DashboardLanguageContext';
import { HERO_API_URL } from '../../../api/api';

const getBackgroundStyle = (background) => {
  if (!background) return { backgroundColor: '#eee' };
  if (background.type === 'gradient') {
    return { backgroundImage: `linear-gradient(${background.direction}, ${background.color1}, ${background.color2})` };
  }
  return { backgroundColor: background.color1 || '#eee' };
};

const HeroControl = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [slideToDelete, setSlideToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { t, dir, language } = useDashboardLanguage();

  const fetchSlides = async () => { setLoading(true); try { const response = await axios.get(HERO_API_URL); setSlides(response.data); } catch (error) { console.error("Failed to fetch slides:", error); } finally { setLoading(false); } };
  useEffect(() => { fetchSlides(); }, []);
  const handleOpenEditModal = (slide) => { setEditingSlide(slide); setIsEditModalOpen(true); };
  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseModals = () => { setIsEditModalOpen(false); setIsCreateModalOpen(false); setEditingSlide(null); setSlideToDelete(null); };
  const handleCreate = async (formData) => { setIsSaving(true); try { await axios.post(HERO_API_URL, formData, { headers: { 'Content-Type': 'multipart/form-data' } }); fetchSlides(); handleCloseModals(); } catch (error) { console.error('Failed to create slide:', error); alert(t('hero_control.error_create')); } finally { setIsSaving(false); } };
  const handleUpdate = async (id, formData) => { setIsSaving(true); try { await axios.put(`${HERO_API_URL}/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }); fetchSlides(); handleCloseModals(); } catch (error) { console.error('Failed to save slide:', error); } finally { setIsSaving(false); } };
  const handleConfirmDelete = async () => { if (!slideToDelete) return; setIsDeleting(true); try { await axios.delete(`${HERO_API_URL}/${slideToDelete}`); setSlides(prevSlides => prevSlides.filter(s => s._id !== slideToDelete)); setSlideToDelete(null); } catch (error) { console.error('Failed to delete slide:', error); fetchSlides(); } finally { setIsDeleting(false); } };

  const AddNewCard = () => (
    <button onClick={handleOpenCreateModal} className="group aspect-[4/5] sm:aspect-video md:aspect-[4/5] lg:aspect-square xl:aspect-[4/5] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 transition-all duration-300 hover:border-blue-500 hover:text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800/50">
      <Plus size={32} className="mb-2 transition-transform duration-300 group-hover:scale-110" />
      <span className="font-semibold text-sm">{t('hero_control.new_slide_button')}</span>
    </button>
  );

  return (
    <>
      <div className="min-h-screen p-4 sm:p-6 lg:p-8" dir={dir}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center gap-4 mb-8">
            {/* --- MODIFICATION: Ensured text is black in light mode --- */}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-black dark:text-white">
              {t('hero_control.title')}
            </h1>
          </div>
          
          {loading ? ( <div className="flex justify-center items-center h-96"><Loader2 className="w-12 h-12 animate-spin text-blue-600" /></div> ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              <AddNewCard />
              {slides.map(slide => {
                const title = slide.title?.[language] || slide.title?.en || 'Untitled';
                const category = slide.category?.[language] || slide.category?.en || 'No Category';
                
                return (
                  <div key={slide._id} className="group relative aspect-[4/5] sm:aspect-video md:aspect-[4/5] lg:aspect-square xl:aspect-[4/5] rounded-2xl overflow-hidden shadow-xl shadow-black/10 transition-transform duration-300 ease-in-out hover:-translate-y-1.5">
                    <AnimatePresence>
                      {slideToDelete === slide._id && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white/90 dark:bg-gray-900/95 backdrop-blur-sm z-30 flex flex-col justify-center items-center p-4 text-center">
                           <AlertTriangle className="w-10 h-10 text-red-500 mb-3" />
                           <h4 className="font-bold text-gray-900 dark:text-white mb-2">{t('hero_control.modal_delete.title')}</h4>
                           <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">{t('hero_control.modal_delete.message', { title: `"${title}"` })}</p>
                           <div className="flex gap-3 w-full">
                             <button onClick={() => setSlideToDelete(null)} className="flex-1 p-2 text-sm font-semibold rounded-md transition-colors bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600">{t('hero_control.modal_delete.cancel_button')}</button>
                             <button onClick={handleConfirmDelete} disabled={isDeleting} className="flex-1 p-2 text-sm font-semibold rounded-md transition-colors bg-red-600 text-white hover:bg-red-700 disabled:bg-red-900 flex justify-center items-center">{isDeleting ? <Loader2 className="animate-spin" size={18} /> : t('hero_control.modal_delete.confirm_button')}</button>
                           </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="absolute inset-0 w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-110" style={getBackgroundStyle(slide.background)} />
                    <img src={slide.thumbnailUrl || slide.imageUrl} alt={title} className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 ease-in-out group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button onClick={() => handleOpenEditModal(slide)} className="bg-white/10 text-white rounded-full p-2.5 backdrop-blur-md transition-all duration-200 ease-in-out hover:bg-blue-600"><Edit size={16} /></button>
                      <button onClick={() => setSlideToDelete(slide._id)} className="bg-white/10 text-white rounded-full p-2.5 backdrop-blur-md transition-all duration-200 ease-in-out hover:bg-red-600"><Trash2 size={16} /></button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
                      <p className="text-xs font-semibold uppercase tracking-widest text-white/70">{category}</p>
                      <h3 className="font-bold text-lg text-white mt-1 truncate">{title}</h3>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
      
      <HeroModalEdit isOpen={isEditModalOpen} onClose={handleCloseModals} slide={editingSlide} onSave={handleUpdate} isSaving={isSaving} />
      <HeroModalCreate isOpen={isCreateModalOpen} onClose={handleCloseModals} onSave={handleCreate} isSaving={isSaving} />
    </>
  );
};

export default HeroControl; 