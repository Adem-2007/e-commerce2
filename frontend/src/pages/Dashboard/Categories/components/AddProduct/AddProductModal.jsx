// src/pages/Dashboard/Categories/components/AddProduct/AddProductModal.jsx
import React from 'react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { X, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { useImageFocus } from '../../../../../hooks/useImageFocus';
import { useDashboardLanguage } from '../../../../../context/DashboardLanguageContext';
import { API_BASE_URL } from '../../../../../api/api';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';

const getMediaUrl = (urlPath) => {
    if (!urlPath) return null;
    // Handle blob URLs for local previews, and construct full URLs for existing images
    if (urlPath.startsWith('data:') || urlPath.startsWith('blob:')) {
        return urlPath;
    }
    return `${API_BASE_URL}${urlPath}`;
};


const AddProductModal = ({ isOpen, onClose, onSave, productToEdit, categories, initialCategoryId }) => {
    const { t, dir } = useDashboardLanguage();
    const isEditMode = Boolean(productToEdit);
    const { focusPoint, setFocusPoint, handleSetFocus, imageRef } = useImageFocus(productToEdit?.focusPoint);
    
    // --- Step State ---
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;

    // --- Refs for validation scrolling ---
    const modalBodyRef = useRef(null);
    const mainImageRef = useRef(null); const nameRef = useRef(null); const descriptionRef = useRef(null); const priceRef = useRef(null); const genderRef = useRef(null); const categoryRef = useRef(null); const materialsRef = useRef(null); const colorsRef = useRef(null); const secondaryMediaRef = useRef(null);

    const [isAnimatingOut, setIsAnimatingOut] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState({});
    
    // Form State
    const [name, setName] = useState(''); const [description, setDescription] = useState(''); const [price, setPrice] = useState(''); const [currency, setCurrency] = useState('DZD'); const [height, setHeight] = useState(''); const [selectedCategoryId, setSelectedCategoryId] = useState(''); const [isNew, setIsNew] = useState(false); const [selectedGenders, setSelectedGenders] = useState([]); const [materials, setMaterials] = useState([]); const [materialInput, setMaterialInput] = useState(''); const [selectedColors, setSelectedColors] = useState([]); const [colorInput, setColorInput] = useState('#000000'); const [selectedSizes, setSelectedSizes] = useState([]); const [sizeInput, setSizeInput] = useState(''); const [mainImage, setMainImage] = useState({ file: null, preview: null }); const [secondaryMedia, setSecondaryMedia] = useState([]);
    const [video, setVideo] = useState({ file: null, preview: null }); const [videoToRemove, setVideoToRemove] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setCurrentStep(1);
            if (isEditMode && productToEdit) {
                setName(productToEdit.name || ''); setDescription(productToEdit.description || ''); setPrice(productToEdit.price?.toString() || ''); setCurrency(productToEdit.currency || 'DZD'); setHeight(productToEdit.height?.toString() || ''); setSelectedCategoryId(productToEdit.category?._id || productToEdit.category || ''); setSelectedSizes(productToEdit.sizes || []); setSelectedColors(productToEdit.colors || []); setIsNew(productToEdit.newArrival || false); setFocusPoint(productToEdit.focusPoint || { x: 0.5, y: 0.5 }); setSelectedGenders(productToEdit.gender || []); setMaterials(productToEdit.materials || []);
                setMainImage({ file: null, preview: getMediaUrl(productToEdit.imageUrls?.large) });
                setVideo({ file: null, preview: getMediaUrl(productToEdit.videoUrl) });
                
                const existingSecondaryMedia = (productToEdit.secondaryImageUrls || []).map(imgObj => ({
                    file: null,
                    preview: getMediaUrl(imgObj.large),
                    type: 'image',
                    id: imgObj.large
                }));
                setSecondaryMedia(existingSecondaryMedia);
                setVideoToRemove(false);
            } else {
                setName(''); setDescription(''); setPrice(''); setHeight(''); setCurrency('DZD'); setSelectedCategoryId(initialCategoryId || ''); setSelectedSizes([]); setSizeInput(''); setSelectedColors([]); setColorInput('#000000'); setIsNew(true); setFocusPoint({ x: 0.5, y: 0.5 }); setSelectedGenders([]); setMaterials([]); setMaterialInput(''); setMainImage({ file: null, preview: null }); setVideo({ file: null, preview: null }); setSecondaryMedia([]); setVideoToRemove(false);
            }
            setIsSubmitting(false); setErrorMessage(''); setErrors({});
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isOpen, productToEdit, categories, isEditMode, setFocusPoint, initialCategoryId]);
    

    if (!isOpen) return null;

    const handleClose = () => { setIsAnimatingOut(true); setTimeout(() => { onClose(); setIsAnimatingOut(false); }, 300); };
    const handleMainImageChange = (e) => { const file = e.target.files[0]; if (!file) return; if (mainImage.preview?.startsWith('blob:')) { URL.revokeObjectURL(mainImage.preview); } setMainImage({ file: file, preview: URL.createObjectURL(file) }); setFocusPoint({ x: 0.5, y: 0.5 }); setErrors(prev => ({ ...prev, mainImage: undefined })); };
    const handleUpdateSecondaryMedia = (newMediaItems) => { setSecondaryMedia(prev => [...prev, ...newMediaItems]); };
    const handleRemoveSecondaryMedia = (idToRemove) => { const mediaToRemove = secondaryMedia.find(m => m.id === idToRemove); if (mediaToRemove && mediaToRemove.preview.startsWith('blob:')) { URL.revokeObjectURL(mediaToRemove.preview); } setSecondaryMedia(prev => prev.filter(item => item.id !== idToRemove)); };
    const handleRemoveMainImage = () => { if (mainImage.preview?.startsWith('blob:')) URL.revokeObjectURL(mainImage.preview); setMainImage({ file: null, preview: null }); };
    const handleVideoChange = (e) => { const file = e.target.files[0]; if (file) { if (video.preview?.startsWith('blob:')) URL.revokeObjectURL(video.preview); setVideo({ file, preview: URL.createObjectURL(file) }); setVideoToRemove(false); } };
    const handleRemoveVideo = () => { if (video.preview?.startsWith('blob:')) URL.revokeObjectURL(video.preview); setVideo({ file: null, preview: null }); if (isEditMode && productToEdit.videoUrl) setVideoToRemove(true); };
    const handleGenderToggle = (genderKey) => { setSelectedGenders(prev => prev.includes(genderKey) ? prev.filter(g => g !== genderKey) : [...prev, genderKey]); };
    const handleAddMaterial = () => { const trimmedInput = materialInput.trim(); if (trimmedInput && !materials.includes(trimmedInput)) { setMaterials([...materials, trimmedInput]); setMaterialInput(''); } };
    const handleRemoveMaterial = (materialToRemove) => setMaterials(materials.filter(m => m !== materialToRemove));
    const handleAddColor = () => { const hex = colorInput.toLowerCase(); if (hex && !selectedColors.includes(hex)) { setSelectedColors([...selectedColors, hex]); setColorInput('#000000'); } };
    const handleRemoveColor = (hexToRemove) => setSelectedColors(selectedColors.filter(c => c !== hexToRemove));
    const handleAddSize = () => { const trimmedInput = sizeInput.trim().toUpperCase(); if (trimmedInput && !selectedSizes.includes(trimmedInput)) { setSelectedSizes([...selectedSizes, trimmedInput]); setSizeInput(''); } };
    const handleRemoveSize = (sizeToRemove) => setSelectedSizes(selectedSizes.filter(s => s !== sizeToRemove));

    const validateStep = (step) => { const newErrors = { ...errors }; let isValid = true; if (step === 1) { if (!mainImage.preview) { newErrors.mainImage = t('collections.addProductModal.errors.mainImage'); isValid = false; } else { delete newErrors.mainImage } if (secondaryMedia.length > 5) { newErrors.secondaryMedia = t('collections.addProductModal.errors.secondaryMediaTooMany', { count: 5 }); isValid = false; } else { delete newErrors.secondaryMedia } } if (step === 2) { if (!name.trim()) { newErrors.name = t('collections.addProductModal.errors.name'); isValid = false; } else { delete newErrors.name } if (!description.trim()) { newErrors.description = t('collections.addProductModal.errors.description'); isValid = false; } else { delete newErrors.description } if (!price || parseFloat(price) <= 0) { newErrors.price = t('collections.addProductModal.errors.price'); isValid = false; } else { delete newErrors.price } } if (step === 3) { if (selectedGenders.length === 0) { newErrors.gender = t('collections.addProductModal.errors.gender'); isValid = false; } else { delete newErrors.gender } if (!selectedCategoryId) { newErrors.category = t('collections.addProductModal.errors.category'); isValid = false; } else { delete newErrors.category } if (materials.length === 0) { newErrors.materials = t('collections.addProductModal.errors.materials'); isValid = false; } else { delete newErrors.materials } if (selectedColors.length === 0) { newErrors.colors = t('collections.addProductModal.errors.colors'); isValid = false; } else { delete newErrors.colors } } setErrors(newErrors); return isValid; };
    const handleNext = () => { if (validateStep(currentStep)) { if (currentStep < totalSteps) setCurrentStep(currentStep + 1); } else { if (modalBodyRef.current) modalBodyRef.current.scrollTo({ top: 0, behavior: 'smooth' }); } };
    const handlePrev = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        const isStep1Valid = validateStep(1); const isStep2Valid = validateStep(2); const isStep3Valid = validateStep(3);
        if (!isStep1Valid || !isStep2Valid || !isStep3Valid) { setErrorMessage(t('collections.addProductModal.errorValidation')); if (!isStep1Valid) setCurrentStep(1); else if (!isStep2Valid) setCurrentStep(2); else if (!isStep3Valid) setCurrentStep(3); return; }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('name', name); formData.append('price', price); formData.append('currency', currency); formData.append('height', height); formData.append('description', description); formData.append('categoryId', selectedCategoryId); formData.append('newArrival', isNew); formData.append('colors', JSON.stringify(selectedColors)); formData.append('sizes', JSON.stringify(selectedSizes)); formData.append('focusPoint', JSON.stringify(focusPoint)); formData.append('gender', JSON.stringify(selectedGenders)); formData.append('materials', JSON.stringify(materials));
        if (mainImage.file) formData.append('image', mainImage.file);
        if (video.file) formData.append('video', video.file);
        if (videoToRemove) formData.append('videoToRemove', 'true');
        secondaryMedia.forEach(mediaItem => { if (mediaItem.file) formData.append('secondaryMedia', mediaItem.file); });
        
        if (isEditMode) {
            const currentImageUrls = new Set(secondaryMedia.map(m => m.id).filter(id => id && !id.startsWith('blob:')));
            const originalImageUrls = (productToEdit.secondaryImageUrls || []).map(img => img.large);
            const imagesToRemove = originalImageUrls.filter(originalUrl => !currentImageUrls.has(originalUrl));
            
            if (imagesToRemove.length > 0) {
                formData.append('imagesToRemove', JSON.stringify(imagesToRemove));
            }
        }

        try { await onSave(formData, productToEdit?._id); handleClose(); } 
        catch (error) { console.error(`Failed to ${isEditMode ? 'update' : 'create'} product:`, error); setErrorMessage(error.message || 'An unexpected error occurred.'); } 
        finally { setIsSubmitting(false); }
    };
    
    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isAnimatingOut ? 'opacity-0' : 'opacity-100'} bg-slate-900/60 backdrop-blur-md max-lg:p-0 max-lg:items-end`} onClick={handleClose} aria-modal="true" role="dialog">
            <div className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col transition-all duration-300 ${isAnimatingOut ? 'lg:scale-95 opacity-0 max-lg:translate-y-full' : 'lg:scale-100 opacity-100 max-lg:translate-y-0'} max-lg:rounded-b-none`} style={{ height: 'calc(100vh - 4rem)', maxHeight: '900px' }} onClick={e => e.stopPropagation()}>
                <button onClick={handleClose} className={`absolute top-4 ${dir === 'rtl' ? 'left-4' : 'right-4'} z-20 w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 transition-all duration-300 hover:bg-gray-300 hover:text-gray-900 hover:rotate-90 hover:scale-110 max-lg:top-3 ${dir === 'rtl' ? 'max-lg:left-3' : 'max-lg:right-3'}`} disabled={isSubmitting} aria-label={t('collections.addProductModal.closeAriaLabel')}><X size={20} /></button>
                <h2 className="text-xl font-bold text-gray-800 p-6 border-b border-gray-200 flex-shrink-0 max-lg:text-lg max-lg:p-4">{isEditMode ? t('collections.addProductModal.editTitle') : t('collections.addProductModal.addTitle')}</h2>
                
                <div className="flex-grow min-h-0">
                    {/* --- THIS IS THE FIX --- */}
                    {/* Added h-full to make this div fill its parent, enabling overflow-y-auto to work */}
                    <div ref={modalBodyRef} className="h-full overflow-y-auto p-6 max-lg:p-4">
                        {currentStep === 1 && <Step1 {...{ mainImage, handleMainImageChange, handleRemoveMainImage, errors, mainImageRef, video, handleVideoChange, handleRemoveVideo, secondaryMedia, secondaryMediaRef, imageRef, handleSetFocus, focusPoint, handleUpdateSecondaryMedia, handleRemoveSecondaryMedia }} />}
                        {currentStep === 2 && <Step2 {...{ name, setName, description, setDescription, price, setPrice, currency, setCurrency, height, setHeight, errors, nameRef, descriptionRef, priceRef }} />}
                        {currentStep === 3 && <Step3 {...{ selectedGenders, handleGenderToggle, errors, genderRef, categories, selectedCategoryId, setSelectedCategoryId, categoryRef, materials, materialInput, setMaterialInput, handleAddMaterial, handleRemoveMaterial, materialsRef, selectedColors, colorInput, setColorInput, handleAddColor, handleRemoveColor, colorsRef, selectedSizes, sizeInput, setSizeInput, handleAddSize, handleRemoveSize }} />}
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-200 flex-shrink-0 max-lg:p-4">
                    {errorMessage && <p className="text-sm text-center text-red-600 bg-red-100 p-3 rounded-lg mb-4">{errorMessage}</p>}
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                             <button type="button" onClick={handlePrev} disabled={currentStep === 1 || isSubmitting} className="px-6 py-3 bg-gray-200 text-gray-700 font-bold text-sm rounded-lg transition-colors hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-2">
                                <ArrowLeft size={16} /> {t('collections.addProductModal.prevButton')}
                             </button>
                             <div className="font-semibold text-sm text-gray-500">{t('collections.addProductModal.stepIndicator', { current: currentStep, total: totalSteps })}</div>
                        </div>

                        <div className="flex items-center gap-3">
                            {currentStep === totalSteps && (
                                <label htmlFor="is-new-checkbox" className="flex items-center cursor-pointer select-none">
                                    <input id="is-new-checkbox" type="checkbox" checked={isNew} onChange={e => setIsNew(e.target.checked)} className="sr-only peer" />
                                    <div className="w-6 h-6 border-2 border-gray-300 rounded-md flex items-center justify-center transition-all duration-200 peer-checked:bg-teal-500 peer-checked:border-teal-500"><Check size={16} className="text-white scale-0 transition-transform duration-200 peer-checked:scale-100" /></div>
                                    <span className="ml-3 font-semibold text-sm text-gray-700">{t('collections.addProductModal.newArrivalLabel')}</span>
                                </label>
                            )}
                            {currentStep < totalSteps ? (
                                <button type="button" onClick={handleNext} className="px-8 py-3 bg-gray-800 text-white font-bold text-sm rounded-lg shadow-lg transition-all hover:bg-gray-900 hover:-translate-y-0.5 flex items-center gap-2">
                                    {t('collections.addProductModal.nextButton')} <ArrowRight size={16} />
                                </button>
                            ) : (
                                <button type="submit" onClick={handleFormSubmit} disabled={isSubmitting} className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold text-sm rounded-lg shadow-lg transition-all duration-300 ease-in-out disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:shadow-none hover:shadow-teal-500/40 hover:-translate-y-1">
                                    {isSubmitting ? t('collections.addProductModal.savingButton') : (isEditMode ? t('collections.addProductModal.editButton') : t('collections.addProductModal.createButton'))}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProductModal;