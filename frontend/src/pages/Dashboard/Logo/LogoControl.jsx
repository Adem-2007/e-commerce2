// src/pages/Dashboard/Logo/LogoControl.jsx

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { useDashboardLanguage } from '../../../context/DashboardLanguageContext';
import { UploadCloud, Save, Image as ImageIcon, Loader2, AlertTriangle, Sparkles } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LogoControl = () => {
    const { token } = useAuth();
    const { t } = useDashboardLanguage();
    const [logoName, setLogoName] = useState('');
    const [currentImageUrl, setCurrentImageUrl] = useState('');
    const [imageLoadError, setImageLoadError] = useState(false);
    const [newImage, setNewImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchLogo = async () => {
            try {
                setIsLoading(true);
                const { data } = await axios.get(`${API_BASE_URL}/api/logo`);
                setLogoName(data.name);
                // The data.imageUrl is now the full Base64 Data URI
                setCurrentImageUrl(data.imageUrl); 
                setImageLoadError(!data.imageUrl);
            } catch (err) {
                setError(t('logo_control.fetch_error'));
                setImageLoadError(true);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLogo();
    }, [t]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setNewImage(file);
            setImageLoadError(false);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('name', logoName);
        if (newImage) {
            formData.append('logoImage', newImage);
        }

        try {
            const { data } = await axios.put(`${API_BASE_URL}/api/logo`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            setSuccess(data.message);
            // The data.logo.imageUrl is now the full Base64 Data URI
            setCurrentImageUrl(data.logo.imageUrl);
            setImageLoadError(false);
            setNewImage(null);
            setPreviewUrl('');
            
            // Dispatch a global event to notify other components (like the Navbar) of the change
            window.dispatchEvent(new CustomEvent('logoUpdated'));
            
        } catch (err) {
            setError(err.response?.data?.message || t('logo_control.save_error_default'));
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageError = () => {
        setImageLoadError(true);
    };

    const showImage = (previewUrl || currentImageUrl) && !imageLoadError;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full text-blue-500">
                <Loader2 className="animate-spin" size={48} />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8">
            <div className="mb-10 pl-2 border-l-4 border-blue-500">
                <h1 className="text-4xl font-extrabold text-gray-900">{t('logo_control.header_title')}</h1>
                <p className="mt-1 text-lg text-gray-500">{t('logo_control.header_subtitle')}</p>
            </div>
            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8">
                {/* --- Uploader Column --- */}
                <div className="sticky top-8">
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">{t('logo_control.card_title_logo')}</h3>
                        <div 
                            className="group relative w-full aspect-square border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden bg-gray-50 transition-all duration-300 hover:border-blue-500 hover:bg-blue-50" 
                            onClick={() => fileInputRef.current.click()}
                        >
                            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/png, image/jpeg, image/svg+xml, image/webp" className="hidden" />
                            {showImage ? (
                                <img src={previewUrl || currentImageUrl} alt="Logo Preview" className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105" onError={handleImageError} />
                            ) : (
                                <div className="text-center text-gray-400">
                                    <ImageIcon size={48} className="mx-auto mb-2" />
                                    <p className="font-medium">{t('logo_control.upload_prompt_text')}</p>
                                    <p className="text-sm">{t('logo_control.upload_prompt_subtext')}</p>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gray-900/70 text-white flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                                <UploadCloud size={24} />
                                <span>{showImage ? t('logo_control.upload_overlay_change') : t('logo_control.upload_overlay_upload')}</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 text-center mt-4">{t('logo_control.uploader_hint')}</p>
                    </div>
                </div>
                {/* --- Settings Column --- */}
                <div>
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">{t('logo_control.card_title_config')}</h3>
                        <div className="mb-6">
                            <label htmlFor="logoName" className="block text-sm font-medium text-gray-700 mb-2">{t('logo_control.brand_name_label')}</label>
                            <div className="relative">
                                <Sparkles size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <input id="logoName" type="text" value={logoName} onChange={(e) => setLogoName(e.target.value)} placeholder={t('logo_control.brand_name_placeholder')} className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg text-gray-900 bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white" required />
                            </div>
                        </div>
                        {error && <div className="flex items-center gap-3 p-4 mb-6 font-medium text-red-800 bg-red-100 rounded-lg"><AlertTriangle size={16}/>{error}</div>}
                        {success && <div className="flex items-center gap-3 p-4 mb-6 font-medium text-green-800 bg-green-100 rounded-lg"><Save size={16}/>{success}</div>}
                        <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 px-4 text-base font-semibold text-white bg-blue-600 rounded-lg cursor-pointer transition-all duration-300 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none" disabled={isSaving}>
                            {isSaving ? <><Loader2 className="animate-spin" size={20} /> {t('logo_control.saving_button')}</> : <><Save size={20} /> {t('logo_control.save_button')}</>}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default LogoControl;