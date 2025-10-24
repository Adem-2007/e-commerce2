// src/pages/Dashboard/SocialMedia/components/modal/AddPixelModal.jsx

import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useDashboardLanguage } from '../../../../../context/DashboardLanguageContext';

// --- NEW: Accept onAddPixel prop ---
const AddPixelModal = ({ onAddPixel, onClose, platformName, platformColor, tokenIdentifier = "default" }) => {
    // --- NEW: State for each form input ---
    const [name, setName] = useState('');
    const [pixelId, setPixelId] = useState('');
    const [apiToken, setApiToken] = useState('');
    const [status, setStatus] = useState('active');
    
    // --- NEW: State for handling errors ---
    const [error, setError] = useState('');

    const { t, language } = useDashboardLanguage();
    const tokenName = t(`social_media_page.add_pixel_modal.token_names.${tokenIdentifier}`);

    // --- NEW: Handle form submission ---
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
        
        if (!name || !pixelId) {
            setError('Pixel Name and Pixel ID are required.');
            return;
        }
        
        const newPixel = {
            name,
            pixelId,
            apiToken,
            status,
            platform: platformName.toLowerCase(), // Add the platform field for the backend model
        };

        onAddPixel(newPixel); // Call the function passed from FacebookPanel
    };


    const ToggleSwitch = ({ checked, onChange }) => (
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-pink-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] rtl:after:left-auto rtl:after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
        </label>
    );

    return (
        <div className="space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div>
                <h2 className="text-center text-xl sm:text-2xl font-bold text-gray-900">
                    {t('social_media_page.add_pixel_modal.title', { platformName: '' })} <span style={{ color: platformColor }}>{platformName} Pixel</span>
                </h2>
            </div>
            
            {/* --- NEW: Connect form to handleSubmit --- */}
            <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="pixelName" className="block text-sm font-medium text-gray-700 mb-1 rtl:text-right">{t('social_media_page.add_pixel_modal.name_label')}</label>
                    <input 
                        type="text" 
                        id="pixelName" 
                        value={name} // Controlled component
                        onChange={(e) => setName(e.target.value)} // Update state on change
                        placeholder={t('social_media_page.add_pixel_modal.name_placeholder', { platformName })} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 rtl:text-right" 
                    />
                </div>
                
                <div>
                    <label htmlFor="pixelId" className="block text-sm font-medium text-gray-700 mb-1 rtl:text-right">{t('social_media_page.add_pixel_modal.id_label')}</label>
                    <input 
                        type="text" 
                        id="pixelId"
                        value={pixelId} // Controlled component
                        onChange={(e) => setPixelId(e.target.value)} // Update state on change
                        placeholder={t('social_media_page.add_pixel_modal.id_placeholder')} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 rtl:text-right" 
                    />
                </div>

                <div>
                    <label htmlFor="apiToken" className="block text-sm font-medium text-gray-700 mb-1 rtl:text-right">{t('social_media_page.add_pixel_modal.token_label_optional', { tokenName })}</label>
                    <input 
                        type="text" 
                        id="apiToken"
                        value={apiToken} // Controlled component
                        onChange={(e) => setApiToken(e.target.value)} // Update state on change
                        placeholder={t('social_media_page.add_pixel_modal.token_placeholder', { tokenName })} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 rtl:text-right" 
                    />
                </div>

                <div className="bg-green-50 text-green-800 p-3 rounded-md flex rtl:flex-row-reverse items-start sm:items-center gap-3 text-sm border border-green-200">
                    <CheckCircle size={20} className="flex-shrink-0 mt-0.5 sm:mt-0" />
                    <span className="flex-grow rtl:text-right">{t('social_media_page.add_pixel_modal.recommendation')}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 gap-3 sm:gap-0 rtl:sm:flex-row-reverse">
                    <label htmlFor="activatePixel" className="text-sm font-medium text-gray-800 rtl:text-right">{t('social_media_page.add_pixel_modal.activate_label')}</label>
                    <ToggleSwitch 
                        checked={status === 'active'} // Control checked state
                        onChange={(e) => setStatus(e.target.checked ? 'active' : 'inactive')} // Update status
                    />
                </div>

                {/* --- NEW: Displaying validation error --- */}
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                <div className="flex justify-end rtl:justify-start pt-4">
                    <button type="submit" className="w-full sm:w-auto px-6 py-2.5 font-semibold text-white bg-pink-600 rounded-lg shadow-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors">
                        {t('social_media_page.add_pixel_modal.add_button')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddPixelModal;