// src/pages/Dashboard/Delivery/CompanyEditForm.jsx
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Home, Briefcase, Building, UploadCloud, Trash2, Loader, Image as ImageIcon, AlertCircle, DollarSign } from 'lucide-react';
import { ConfirmationModal } from './ConfirmationModal';
import { useDashboardLanguage } from '../../../context/DashboardLanguageContext'; // Import hook

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const CompanyEditForm = ({ company, onSave, onCancel }) => {
    const { t } = useDashboardLanguage(); // Initialize hook
    const [details, setDetails] = useState(company);
    const [isUploading, setIsUploading] = useState(false);
    const [errors, setErrors] = useState({});
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!details.companyName || details.companyName.trim() === '') {
            newErrors.companyName = t('delivery_costs_page.company_form.validation.name_required');
        }
        if (!details.logoUrl) {
            newErrors.logoUrl = t('delivery_costs_page.company_form.validation.logo_required');
        }
        if (typeof details.priceHome !== 'number' || details.priceHome <= 0) {
            newErrors.priceHome = t('delivery_costs_page.company_form.validation.price_required');
        }
        if (typeof details.priceOffice !== 'number' || details.priceOffice <= 0) {
            newErrors.priceOffice = t('delivery_costs_page.company_form.validation.price_required');
        }
        return newErrors;
    };

    const handleChange = (field, value) => {
        setDetails(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };
    
    const handleSaveClick = () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        onSave(details);
    };

    const handleUpload = async (file) => {
        const formData = new FormData();
        formData.append('logo', file);
        setIsUploading(true);
        try {
            // Note: Old logo removal is handled by state update, no API call needed.
            const res = await fetch(`${API_BASE_URL}/api/delivery-costs/upload-logo`, { method: 'POST', body: formData });
            if (!res.ok) throw new Error('Upload failed');
            const data = await res.json();
            handleChange('logoUrl', data.logoUrl);
        } catch (error) {
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };
    
    // --- MODIFIED: Simplified image removal ---
    const executeImageRemoval = () => {
        // No backend call is needed as the image is a data URL. Just update state.
        handleChange('logoUrl', '');
    };

    // --- MODIFIED: Simplified confirmation handler ---
    const handleConfirmRemove = () => {
        executeImageRemoval();
        setConfirmModalOpen(false);
    };
    
    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            handleUpload(acceptedFiles[0]);
        }
    }, [details.logoUrl]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: false });

    return (
        <>
            <div className="bg-white rounded-lg border-2 border-blue-500 p-4 space-y-4 shadow-lg">
                <div>
                    <div className="flex gap-4 items-start">
                        <div {...getRootProps()} className={`relative w-24 h-24 rounded-lg border-2 border-dashed flex items-center justify-center text-slate-400 cursor-pointer transition-all ${isDragActive ? 'border-blue-600 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:border-blue-500'} ${errors.logoUrl ? 'border-red-500' : ''}`}>
                            <input {...getInputProps()} />
                            {isUploading ? <Loader className="animate-spin" /> : 
                             // --- MODIFIED: Use details.logoUrl directly ---
                             details.logoUrl ? <img src={details.logoUrl} alt="Company Logo" className="w-full h-full object-cover rounded-md" /> : 
                             <div className="text-center"><ImageIcon size={24}/><p className="text-xs mt-1">{t('delivery_costs_page.company_form.uploader.prompt')}</p></div>
                            }
                        </div>
                        <div className="flex-grow">
                            <p className="text-sm font-semibold text-slate-700">{t('delivery_costs_page.company_form.uploader.label')} <span className="text-red-500">*</span></p>
                            <p className="text-xs text-slate-500 mb-2">{t('delivery_costs_page.company_form.uploader.hint')}</p>
                            {details.logoUrl && !isUploading && (
                                 <button onClick={() => setConfirmModalOpen(true)} className="flex items-center gap-1 text-xs text-red-600 hover:underline"><Trash2 size={12}/> {t('delivery_costs_page.company_form.uploader.remove_button')}</button>
                            )}
                        </div>
                    </div>
                    {errors.logoUrl && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><AlertCircle size={14}/> {errors.logoUrl}</p>}
                </div>

                 <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                        <label className="text-xs font-medium text-slate-500">{t('delivery_costs_page.company_form.name_label')} <span className="text-red-500">*</span></label>
                        <Building size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            value={details.companyName} 
                            onChange={(e) => handleChange('companyName', e.target.value)} 
                            className={`w-full pl-9 pr-4 py-2 bg-white border rounded-md text-sm transition-colors ${errors.companyName ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'} focus:outline-none focus:ring-2`} 
                        />
                         {errors.companyName && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><AlertCircle size={14}/> {errors.companyName}</p>}
                    </div>
                     <div className="relative">
                        <label className="text-xs font-medium text-slate-500">Currency <span className="text-red-500">*</span></label>
                        <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <select 
                            value={details.currency || 'DZD'}
                            onChange={(e) => handleChange('currency', e.target.value)}
                            className={`w-full pl-9 pr-4 py-2 bg-white border rounded-md text-sm transition-colors border-slate-300 focus:ring-blue-500 focus:outline-none focus:ring-2 appearance-none`}
                        >
                            <option value="DZD">DZD</option>
                            <option value="EUR">EUR</option>
                            <option value="USD">USD</option>
                        </select>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                        <label className="text-xs font-medium text-slate-500">{t('delivery_costs_page.company_form.price_home_label')} <span className="text-red-500">*</span></label>
                        <Home size={16} className="absolute left-3 top-1/2 mt-1.5 text-slate-400" />
                        <input 
                            type="number" 
                            value={details.priceHome || ''} 
                            onChange={(e) => handleChange('priceHome', e.target.value === '' ? '' : Number(e.target.value))} 
                            className={`w-full pl-9 pr-4 py-2 bg-white border rounded-md text-sm transition-colors ${errors.priceHome ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'} focus:outline-none focus:ring-2`} 
                            placeholder={t('delivery_costs_page.company_form.price_placeholder_home')} 
                        />
                        {errors.priceHome && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><AlertCircle size={14}/> {errors.priceHome}</p>}
                    </div>
                    <div className="relative">
                        <label className="text-xs font-medium text-slate-500">{t('delivery_costs_page.company_form.price_office_label')} <span className="text-red-500">*</span></label>
                        <Briefcase size={16} className="absolute left-3 top-1/2 mt-1.5 text-slate-400" />
                        <input 
                            type="number" 
                            value={details.priceOffice || ''} 
                            onChange={(e) => handleChange('priceOffice', e.target.value === '' ? '' : Number(e.target.value))} 
                            className={`w-full pl-9 pr-4 py-2 bg-white border rounded-md text-sm transition-colors ${errors.priceOffice ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'} focus:outline-none focus:ring-2`} 
                            placeholder={t('delivery_costs_page.company_form.price_placeholder_office')}
                        />
                         {errors.priceOffice && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><AlertCircle size={14}/> {errors.priceOffice}</p>}
                    </div>
                </div>
                
                 <div className="flex items-center gap-2">
                    <input type="checkbox" id={`isActive-${details._id}`} checked={details.isActive} onChange={(e) => handleChange('isActive', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                    <label htmlFor={`isActive-${details._id}`} className="text-sm text-slate-600">{t('delivery_costs_page.company_form.active_label')}</label>
                 </div>

                <div className="flex justify-end gap-2 pt-2">
                    <button onClick={onCancel} className="px-4 py-2 rounded-md text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200">{t('delivery_costs_page.company_form.cancel_button')}</button>
                    <button onClick={handleSaveClick} className="px-4 py-2 rounded-md text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700">{t('delivery_costs_page.company_form.save_button')}</button>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={handleConfirmRemove}
                title={t('delivery_costs_page.company_form.delete_logo_modal_title')}
            >
                <p>{t('delivery_costs_page.company_form.delete_logo_modal_body')}</p>
            </ConfirmationModal>
        </>
    );
};