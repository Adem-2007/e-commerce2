// src/pages/Dashboard/SocialMedia/SocialMediaControl.jsx

import React, { useState } from 'react';
import { Facebook, Instagram, Mail, MessageSquare, PlusCircle, Share2, Sheet, Phone, Camera } from 'lucide-react';

// Import panel components (assuming they are in the path below)
import FacebookPanel from './components/pixelPanel/FacebookPanel';
import InstagramPanel from './components/InstagramPanel';
import TikTokPanel from './components/pixelPanel/TikTokPanel';
import SnapchatPanel from './components/pixelPanel/SnapchatPanel';
import GoogleSheetsPanel from './components/GoogleSheetsPanel';
import WhatsAppPanel from './components/WhatsAppPanel';
import EmailPanel from './components/EmailPanel';
import { useDashboardLanguage } from '../../../context/DashboardLanguageContext';

const SocialMediaControl = () => {
    const [activeTab, setActiveTab] = useState('facebook');
    const { t } = useDashboardLanguage();

    // --- MOCK DATA ---
    const facebookPixels = [
        { id: '392983679965870', name: 'Main Pixel', status: 'active', date: 'July 03, 2024' },
        { id: '481290049382115', name: 'Campaign Pixel', status: 'inactive', date: 'June 15, 2024' },
    ];
    const instagramAccounts = [
        { username: '@AuraStore', followers: '12,450', following: '320', posts: '288', status: 'connected' },
    ];
    const tiktokPixels = [
        { id: 'TIK73459821', name: 'Global TikTok Pixel', status: 'active', date: 'August 12, 2024' },
    ];
    const snapchatPixels = [
        { id: 'SNAP-982137-1', name: 'Snap Funnel Pixel', status: 'active', date: 'August 01, 2024' },
        { id: 'SNAP-112837-5', name: 'Snap Lead Gen', status: 'inactive', date: 'July 22, 2024' },
    ];
    const googleSheets = [
        { id: 'sheet-001', name: 'Live Order Sync', rows: '1,482', lastSync: '2 mins ago', status: 'connected' },
        { id: 'sheet-002', name: 'Customer Feedback', rows: '934', lastSync: '4 hours ago', status: 'connected' },
    ];
    const whatsappAccounts = [
        { id: 'wa-01', number: '+1 (555) 123-4567', messagesSent: '1,890', deliveryRate: '98.5%', status: 'active' },
    ];
    const emailAccounts = [
        { id: 'email-01', email: 'marketing@aurastore.com', provider: 'Mailchimp', emailsSent: '45,210', openRate: '22.4%', status: 'connected' },
    ];

    // --- UI COMPONENTS ---
    const TabButton = ({ tabName, icon, label }) => {
        const isActive = activeTab === tabName;
        return (
            <button
                onClick={() => setActiveTab(tabName)}
                className={`flex-shrink-0 flex items-center gap-2.5 px-3 sm:px-4 py-3 font-semibold text-sm transition-all duration-300 border-b-2 ${
                    isActive
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                }`}
            >
                {icon}
                <span className="hidden sm:inline">{label}</span>
            </button>
        );
    };
    
    const renderActivePanel = () => {
        switch (activeTab) {
            case 'facebook': return <FacebookPanel data={facebookPixels} />;
            case 'instagram': return <InstagramPanel data={instagramAccounts} />;
            case 'tiktok': return <TikTokPanel data={tiktokPixels} />;
            case 'snapchat': return <SnapchatPanel data={snapchatPixels} />;
            case 'google-sheets': return <GoogleSheetsPanel data={googleSheets} />;
            case 'whatsapp': return <WhatsAppPanel data={whatsappAccounts} />;
            case 'emails': return <EmailPanel data={emailAccounts} />;
            default: return null;
        }
    }

    return (
        <div className="space-y-6 sm:space-y-8 animate-fadeIn p-4 sm:p-0">
            {/* --- PAGE HEADER --- */}
            <div className="pb-5 border-b border-gray-200">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">{t('social_media_page.header_title')}</h1>
                <p className="mt-2 text-sm sm:text-base text-gray-600">{t('social_media_page.header_subtitle')}</p>
            </div>

            {/* --- TAB NAVIGATION --- */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-1 sm:p-2">
                <div className="flex items-center overflow-x-auto">
                    <TabButton tabName="facebook" icon={<Facebook size={18} />} label={t('social_media_page.tabs.facebook')} />
                    <TabButton tabName="instagram" icon={<Instagram size={18} />} label={t('social_media_page.tabs.instagram')} />
                    <TabButton tabName="tiktok" icon={<Share2 size={18} />} label={t('social_media_page.tabs.tiktok')} />
                    <TabButton tabName="snapchat" icon={<Camera size={18} />} label={t('social_media_page.tabs.snapchat')} />
                    <TabButton tabName="google-sheets" icon={<Sheet size={18} />} label={t('social_media_page.tabs.google_sheets')} />
                    <TabButton tabName="whatsapp" icon={<MessageSquare size={18} />} label={t('social_media_page.tabs.whatsapp')} />
                    <TabButton tabName="emails" icon={<Mail size={18} />} label={t('social_media_page.tabs.emails')} />
                </div>
            </div>

            {/* --- DYNAMIC CONTENT PANELS --- */}
            <div>
                {renderActivePanel()}
            </div>
            
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
                /* For browsers that support scrollbar styling */
                .overflow-x-auto::-webkit-scrollbar {
                    height: 4px;
                }
                .overflow-x-auto::-webkit-scrollbar-thumb {
                    background-color: #d1d5db;
                    border-radius: 20px;
                }
            `}</style>
        </div>
    );
};

export default SocialMediaControl;