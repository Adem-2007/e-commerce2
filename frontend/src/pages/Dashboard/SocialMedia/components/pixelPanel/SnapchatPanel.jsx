// src/pages/Dashboard/SocialMedia/components/pixelPanel/SnapchatPanel.jsx

import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2, BarChartBig, CheckCircle, XCircle } from 'lucide-react';
import StatCard from '../common/StatCard';
import Modal from '../Modal';
import AddPixelModal from '../modal/AddPixelModal';
import { useDashboardLanguage } from '../../../../../context/DashboardLanguageContext';

const SnapchatPanel = ({ data }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { t } = useDashboardLanguage();
    const activePixels = data.filter(p => p.status === 'active').length;
    const inactivePixels = data.length - activePixels;

    const platformName = "Snapchat";

    return (
        <>
            {/* --- MODAL FOR ADDING A NEW PIXEL --- */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <AddPixelModal
                    onClose={() => setIsModalOpen(false)}
                    platformName={platformName}
                    platformColor="#FFFC00" // Snapchat's official yellow
                    tokenIdentifier="snapchat"
                />
            </Modal>
            
            {/* --- MAIN PANEL CONTENT --- */}
            <div className="space-y-8 animate-fadeIn">
                {/* Panel Header - Responsive */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{t('social_media_page.pixel_panels.title', { platformName })}</h2>
                        <p className="text-sm text-gray-500 mt-1">{t('social_media_page.pixel_panels.subtitle', { platformName })}</p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-black bg-yellow-400 rounded-lg shadow-sm hover:bg-yellow-500 transition-colors"
                    >
                        <PlusCircle size={18} />
                        {t('social_media_page.pixel_panels.add_button_snap')}
                    </button>
                </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <StatCard icon={<BarChartBig size={22} className="text-yellow-500" />} title={t('social_media_page.pixel_panels.stats_total')} value={data.length} />
                    <StatCard icon={<CheckCircle size={22} className="text-green-600" />} title={t('social_media_page.pixel_panels.stats_active')} value={activePixels} />
                    <StatCard icon={<XCircle size={22} className="text-red-500" />} title={t('social_media_page.pixel_panels.stats_inactive')} value={inactivePixels} />
                </div>

                {/* Pixel List Table - Fully Responsive */}
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
                                    {data.map(pixel => (
                                        <tr key={pixel.id} className="block md:table-row p-4 md:p-0">
                                            <td data-label={t('social_media_page.pixel_panels.table_name')} className="px-6 py-2 md:py-4 font-medium text-gray-800 text-right md:text-left block md:table-cell relative">{pixel.name}</td>
                                            <td data-label={t('social_media_page.pixel_panels.table_id')} className="px-6 py-2 md:py-4 text-gray-600 font-mono text-right md:text-left block md:table-cell relative">{pixel.id}</td>
                                            <td data-label={t('social_media_page.pixel_panels.table_status')} className="px-6 py-2 md:py-4 text-right md:text-left block md:table-cell relative">
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${pixel.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                                                    {pixel.status === 'active' ? t('social_media_page.pixel_panels.status_active') : t('social_media_page.pixel_panels.status_inactive')}
                                                </span>
                                            </td>
                                            <td data-label={t('social_media_page.pixel_panels.table_date')} className="px-6 py-2 md:py-4 text-gray-600 text-right md:text-left block md:table-cell relative">{pixel.date}</td>
                                            <td data-label={t('social_media_page.pixel_panels.table_actions')} className="px-6 py-2 md:py-4 block md:table-cell relative">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-md"><Edit size={16} /></button>
                                                    <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-md"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS for the responsive table data-labels on mobile */}
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

export default SnapchatPanel;