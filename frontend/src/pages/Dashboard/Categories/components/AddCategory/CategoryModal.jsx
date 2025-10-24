// src/pages/Dashboard/Categories/components/AddCategory/CategoryModal.jsx

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, FolderPlus, Edit, UploadCloud, Trash2, Loader, Sparkles, Palette, 
    Tag, CaseUpper, CaseLower, Baseline, Grid, Image 
} from 'lucide-react';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import { useDashboardLanguage } from '../../../../../context/DashboardLanguageContext';
import { CATEGORIES_API_URL } from '../../../../../api/api';

// --- RENAMED: This is now the unified CategoryModal ---
const CategoryModal = ({ isOpen, onClose, onSave, categoryToEdit }) => {
    const { t, dir } = useDashboardLanguage();

    const isEditMode = Boolean(categoryToEdit);

    const [categoryName, setCategoryName] = useState('');
    const [cardTitle, setCardTitle] = useState('');
    const [cardSubtitle, setCardSubtitle] = useState('');
    const [cardBgColor, setCardBgColor] = useState('#E5E7EB');
    const [cardTextColor, setCardTextColor] = useState('text-black');
    const [cardGridClasses, setCardGridClasses] = useState('col-span-1 row-span-1');
    const [imagePreview, setImagePreview] = useState('');
    const [originalImageUrl, setOriginalImageUrl] = useState('');
    const [compressedFile, setCompressedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const resetState = useCallback(() => {
        setCategoryName('');
        setCardTitle('');
        setCardSubtitle('');
        setCardBgColor('#E5E7EB');
        setCardTextColor('text-black');
        setCardGridClasses('col-span-1 row-span-1');
        setImagePreview('');
        setOriginalImageUrl('');
        setCompressedFile(null);
        setIsDragging(false);
        setIsLoading(false);
        setIsCompressing(false);
        setError('');
    }, []);
    
    // --- UPDATED: Effect now populates the form for edit mode ---
    useEffect(() => {
        if (isOpen) {
            if (isEditMode) {
                setCategoryName(categoryToEdit.name);
                setCardTitle(categoryToEdit.cardTitle || '');
                setCardSubtitle(categoryToEdit.cardSubtitle || '');
                setCardBgColor(categoryToEdit.cardBgColor?.startsWith('#') ? categoryToEdit.cardBgColor : '#E5E7EB');
                setCardTextColor(categoryToEdit.cardTextColor || 'text-black');
                setCardGridClasses(categoryToEdit.cardGridClasses || 'col-span-1 row-span-1');
                setImagePreview(categoryToEdit.imageUrl);
                setOriginalImageUrl(categoryToEdit.imageUrl);
                setCompressedFile(null);
                setError('');
            } else {
                resetState();
            }
        }
    }, [categoryToEdit, isOpen, isEditMode, resetState]);

    const handleClose = useCallback(() => {
        if (isLoading || isCompressing) return;
        onClose();
    }, [isLoading, isCompressing, onClose]);

    const handleFileChange = async (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        setError('');
        setIsCompressing(true);
        setCompressedFile(null);
        const tempPreviewUrl = URL.createObjectURL(file);
        setImagePreview(tempPreviewUrl);
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
        try {
            const fileToCompress = await imageCompression(file, options);
            setCompressedFile(fileToCompress);
            const finalPreviewUrl = URL.createObjectURL(fileToCompress);
            setImagePreview(finalPreviewUrl);
            URL.revokeObjectURL(tempPreviewUrl);
        } catch (compressionError) {
            setError(t('collections.addCategoryModal.errorOptimize'));
            setImagePreview(isEditMode ? originalImageUrl : '');
        } finally {
            setIsCompressing(false);
        }
    };

    // --- UPDATED: handleSubmit now handles both POST and PUT requests ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!categoryName.trim() || !cardTitle.trim() || !cardSubtitle.trim() || (!isEditMode && !compressedFile)) {
            setError(isEditMode ? 'Please fill out all required fields.' : t('collections.addCategoryModal.errorRequired'));
            return;
        }
        setIsLoading(true);
        setError('');
        const formData = new FormData();
        formData.append('name', categoryName.trim());
        formData.append('cardTitle', cardTitle.trim());
        formData.append('cardSubtitle', cardSubtitle.trim());
        formData.append('cardBgColor', cardBgColor);
        formData.append('cardTextColor', cardTextColor);
        formData.append('cardGridClasses', cardGridClasses);
        if (compressedFile) {
            formData.append('image', compressedFile);
        }
        try {
            const response = isEditMode
                ? await axios.put(`${CATEGORIES_API_URL}/${categoryToEdit._id}`, formData)
                : await axios.post(CATEGORIES_API_URL, formData);
            
            onSave(response.data); // Use the unified onSave callback
            handleClose();
        } catch (err) {
            setError(err.response?.data?.message || `Could not ${isEditMode ? 'update' : 'create'} category.`);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
    const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
    const handleDrop = (e) => {
        e.preventDefault(); e.stopPropagation(); setIsDragging(false);
        if (e.dataTransfer.files?.[0]) { handleFileChange(e.dataTransfer.files[0]); }
    };

    const onUploadZoneClick = () => { if(!isCompressing && !isLoading) fileInputRef.current?.click(); };
    const removeImage = (e) => {
        e.stopPropagation(); setImagePreview(''); setCompressedFile(null);
        if(fileInputRef.current) fileInputRef.current.value = "";
    };
    
    // --- Dynamic UI text and icons ---
    const modalTitle = isEditMode ? t('collections.editCategoryModal.title') : t('collections.addCategoryModal.title');
    const modalSubtitle = isEditMode ? categoryToEdit.name : t('collections.addCategoryModal.subtitle');
    const submitButtonText = isEditMode ? t('collections.editCategoryModal.updateButton') : t('collections.addCategoryModal.createButton');
    const ModalIcon = isEditMode ? Edit : FolderPlus;

    const inputStyles = "w-full px-4 py-3 border border-blue-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none";

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-gray-900/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={handleClose}>
                    <motion.div
                        initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
                        className="bg-white rounded-2xl p-8 sm:p-10 w-full max-w-lg relative shadow-2xl overflow-y-auto max-h-[90vh]"
                        onClick={e => e.stopPropagation()} dir={dir}
                    >
                        <button onClick={handleClose} className="absolute top-4 right-4 bg-blue-100 text-blue-600 rounded-full w-9 h-9 flex items-center justify-center hover:bg-blue-200 transition-colors" disabled={isLoading || isCompressing}><X size={20} /></button>
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"><ModalIcon size={32} className="text-blue-600" /></div>
                            <h2 className="text-2xl font-bold text-black">{modalTitle}</h2>
                            <p className="text-gray-600 mt-2 truncate">{modalSubtitle}</p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && <p className="text-red-600 bg-red-100 p-3 text-sm text-center rounded-lg">{error}</p>}
                            <h3 className="text-lg font-bold text-black border-b border-blue-200 pb-2">Category Details</h3>
                            <div>
                                <label htmlFor="categoryName" className="text-sm font-semibold text-black mb-2 flex items-center gap-2">
                                    <Tag size={16} className="text-blue-600"/>
                                    Category Name
                                </label>
                                <input type="text" id="categoryName" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} className={inputStyles} required autoFocus />
                            </div>
                            <h3 className="text-lg font-bold text-black border-b border-blue-200 pb-2 pt-4">Card Display Properties</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="cardTitle" className="text-sm font-semibold text-black mb-2 flex items-center gap-2">
                                        <CaseUpper size={16} className="text-blue-600"/>
                                        Card Title
                                    </label>
                                    <input type="text" id="cardTitle" value={cardTitle} onChange={(e) => setCardTitle(e.target.value)} className={inputStyles} required />
                                </div>
                                <div>
                                    <label htmlFor="cardSubtitle" className="text-sm font-semibold text-black mb-2 flex items-center gap-2">
                                        <CaseLower size={16} className="text-blue-600"/>
                                        Card Subtitle
                                    </label>
                                    <input type="text" id="cardSubtitle" value={cardSubtitle} onChange={(e) => setCardSubtitle(e.target.value)} className={inputStyles} required />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="cardBgColor" className="text-sm font-semibold text-black mb-2 flex items-center gap-2">
                                    <Palette size={16} className="text-blue-600"/>
                                    Background Color
                                </label>
                                <div className="flex items-center gap-3 p-2 border border-blue-200 rounded-lg bg-gray-50">
                                    <input type="color" id="cardBgColor" value={cardBgColor} onChange={(e) => setCardBgColor(e.target.value)} className="w-full h-8 p-0 border-none cursor-pointer bg-transparent" />
                                    <span className="font-mono text-black">{cardBgColor.toUpperCase()}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="cardTextColor" className="text-sm font-semibold text-black mb-2 flex items-center gap-2">
                                        <Baseline size={16} className="text-blue-600"/>
                                        Text Color
                                    </label>
                                    <select id="cardTextColor" value={cardTextColor} onChange={(e) => setCardTextColor(e.target.value)} className={inputStyles}><option value="text-black">Black</option><option value="text-white">White</option></select>
                                </div>
                                <div>
                                    <label htmlFor="cardGridClasses" className="text-sm font-semibold text-black mb-2 flex items-center gap-2">
                                        <Grid size={16} className="text-blue-600"/>
                                        Card Layout
                                    </label>
                                    <select id="cardGridClasses" value={cardGridClasses} onChange={(e) => setCardGridClasses(e.target.value)} className={inputStyles}><option value="col-span-1 row-span-1">Standard (1x1)</option><option value="col-span-2 row-span-1">Wide (2x1)</option></select>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-black mb-2 flex items-center gap-2 pt-4">
                                    <Image size={16} className="text-blue-600"/>
                                    {t('collections.addCategoryModal.imageLabel')}
                                </label>
                                <div className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-blue-300'} ${imagePreview ? 'p-0 border-solid' : ''}`} onClick={onUploadZoneClick} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                                    <input type="file" ref={fileInputRef} onChange={(e) => handleFileChange(e.target.files?.[0])} className="hidden" accept="image/*" disabled={isCompressing || isLoading}/>
                                    {!imagePreview && (<div className="flex flex-col items-center justify-center gap-2 text-gray-500 py-6"><UploadCloud className="w-10 h-10 text-blue-500" /><span className="font-medium text-black">Upload a New Image</span></div>)}
                                    {imagePreview && (<div className="relative w-full h-48 rounded-xl overflow-hidden group">
                                        {isCompressing && (<div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-10"><Sparkles size={36} className="text-blue-600 animate-pulse" /><span className="font-semibold mt-2 text-blue-800">{t('collections.addCategoryModal.optimizingText')}</span></div>)}
                                        <img src={imagePreview} alt="Preview" className={`w-full h-full object-cover ${isCompressing ? 'blur-md' : ''}`} />
                                        {!isCompressing && imagePreview && (<button type="button" onClick={removeImage} className="absolute top-3 right-3 bg-white/80 text-red-500 rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white transition-opacity"><Trash2 size={16} /></button>)}
                                    </div>)}
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center mt-6 hover:bg-blue-700 transition-colors disabled:bg-gray-400" disabled={isLoading || isCompressing || !categoryName}>
                                {isLoading ? <Loader className="animate-spin" /> : (isCompressing ? t('collections.addCategoryModal.optimizingText') : submitButtonText)}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CategoryModal;