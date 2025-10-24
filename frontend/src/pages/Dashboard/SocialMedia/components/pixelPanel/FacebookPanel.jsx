// src/pages/Dashboard/SocialMedia/components/pixelPanel/FacebookPanel.jsx

import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, BarChartBig, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import StatCard from '../common/StatCard';
import Modal from '../Modal';
import AddPixelModal from '../modal/AddPixelModal';
import { useDashboardLanguage } from '../../../../../context/DashboardLanguageContext';

const FacebookPanel = () => { // We remove the 'data' prop as we will fetch data now
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pixels, setPixels] = useState([]); // State to hold pixels from the API
    const [loading, setLoading] = useState(true); // State to handle loading UI
    const { t } = useDashboardLanguage();

    const platformName = "Facebook";
    const API_URL = 'http://localhost:5000/api/pixels'; // Your backend API URL

    // --- NEW: Function to fetch pixels from the backend ---
    const fetchPixels = async () => {
        setLoading(true);
        try {
            // We fetch only the pixels for the 'facebook' platform
            const response = await fetch(`${API_URL}?platform=${platformName.toLowerCase()}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setPixels(data);
        } catch (error) {
            console.error("Failed to fetch pixels:", error);
            // Here you could set an error state to show a message to the user
        } finally {
            setLoading(false);
        }
    };

    // --- NEW: useEffect to fetch data when the component mounts ---
    useEffect(() => {
        fetchPixels();
    }, []);

    // --- NEW: Function to handle adding a new pixel ---
    const handleAddPixel = async (pixelData) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pixelData),
            });
            if (!response.ok) {
                throw new Error('Failed to add pixel');
            }
            fetchPixels(); // Refresh the list after adding
            setIsModalOpen(false); // Close the modal on success
        } catch (error) {
            console.error("Error adding pixel:", error);
            // Here you could show an error message in the modal
        }
    };
    
    // --- NEW: Function to handle deleting a pixel ---
    const handleDeletePixel = async (pixelId) => {
        // Optional: Ask for confirmation before deleting
        if (window.confirm('Are you sure you want to delete this pixel?')) {
            try {
                const response = await fetch(`${API_URL}/${pixelId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Failed to delete pixel');
                }
                fetchPixels(); // Refresh the list after deleting
            } catch (error) {
                console.error("Error deleting pixel:", error);
            }
        }
    };


    // --- CALCULATED STATS (Now based on state) ---
    const activePixels = pixels.filter(p => p.status === 'active').length;
    const inactivePixels = pixels.length - activePixels;

    return (
        <>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {/* We now pass the handleAddPixel function to the modal */}
                <AddPixelModal
                    onClose={() => setIsModalOpen(false)}
                    onAddPixel={handleAddPixel} // Pass the handler function
                    platformName={platformName}
                    platformColor="#1877F2"
                    tokenIdentifier="facebook"
                />
            </Modal>

            <div className="space-y-8 animate-fadeIn">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{t('social_media_page.pixel_panels.title', { platformName })}</h2>
                    <p className="text-sm text-gray-500 mt-1">{t('social_media_page.pixel_panels.subtitle', { platformName })}</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
                >
                    <PlusCircle size={18} />
                    {t('social_media_page.pixel_panels.add_button')}
                </button>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <StatCard icon={<BarChartBig size={22} className="text-blue-600" />} title={t('social_media_page.pixel_panels.stats_total')} value={pixels.length} />
                    <StatCard icon={<CheckCircle size={22} className="text-green-600" />} title={t('social_media_page.pixel_panels.stats_active')} value={activePixels} />
                    <StatCard icon={<XCircle size={22} className="text-red-500" />} title={t('social_media_page.pixel_panels.stats_inactive')} value={inactivePixels} />
                </div>

                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{t('social_media_page.pixel_panels.list_header')}</h3>
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="border-b border-gray-200">
                                    <tr className="hidden md:table-row">
                                        <th className="px-6 py-4 font-semibold text-left text-gray-500">{t('social_media_page.pixel_panels.table_name')}</th>
                                        <th className="px-6 py-4 font-semibold text-left text-gray-500">{t('social_media_page.pixel_panels.table_id')}</th>
                                        <th className="px-6 py-4 font-semibold text-left text-gray-500">{t('social_media_page.pixel_panels.table_status')}</th>
                                        <th className="px-6 py-4 font-semibold text-left text-gray-500">{t('social_media_page.pixel_panels.table_date')}</th>
                                        <th className="px-6 py-4 font-semibold text-right text-gray-500">{t('social_media_page.pixel_panels.table_actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {loading ? (
                                        <tr><td colSpan="5" className="text-center p-8">Loading pixels...</td></tr>
                                    ) : pixels.length === 0 ? (
                                        <tr><td colSpan="5" className="text-center p-8 text-gray-500">No pixels found. Add your first one!</td></tr>
                                    ) : (
                                        pixels.map(pixel => (
                                            <tr key={pixel._id} className="block md:table-row p-4 md:p-0">
                                                <td data-label={t('social_media_page.pixel_panels.table_name')} className="px-6 py-2 md:py-4 font-medium text-gray-800 text-right md:text-left block md:table-cell relative">{pixel.name}</td>
                                                <td data-label={t('social_media_page.pixel_panels.table_id')} className="px-6 py-2 md:py-4 text-gray-600 font-mono text-right md:text-left block md:table-cell relative">{pixel.pixelId}</td>
                                                <td data-label={t('social_media_page.pixel_panels.table_status')} className="px-6 py-2 md:py-4 text-right md:text-left block md:table-cell relative">
                                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${pixel.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                                                        {pixel.status === 'active' ? t('social_media_page.pixel_panels.status_active') : t('social_media_page.pixel_panels.status_inactive')}
                                                    </span>
                                                </td>
                                                {/* Displaying the creation date from the database */}
                                                <td data-label={t('social_media_page.pixel_panels.table_date')} className="px-6 py-2 md:py-4 text-gray-600 text-right md:text-left block md:table-cell relative">{new Date(pixel.createdAt).toLocaleDateString()}</td>
                                                <td data-label={t('social_media_page.pixel_panels.table_actions')} className="px-6 py-2 md:py-4 block md:table-cell relative">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-md"><Edit size={16} /></button>
                                                        {/* --- NEW: Delete button --- */}
                                                        <button onClick={() => handleDeletePixel(pixel._id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-md"><Trash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @media (max-width: 767px) {
                    tbody tr {
                        border-bottom-width: 8px;
                        border-color: #f3f4f6; /* bg-gray-100 */
                    }
                    td[data-label]::before {
                        content: attr(data-label);
                        position: absolute;
                        left: 1.5rem; /* px-6 */
                        font-weight: 600;
                        color: #4b5563; /* text-gray-600 */
                    }
                }
            `}</style>
        </>
    );
};

export default FacebookPanel;