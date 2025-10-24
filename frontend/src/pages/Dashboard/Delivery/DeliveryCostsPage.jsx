// src/pages/Dashboard/Delivery/DeliveryCostsPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Save, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { algerianWilayasMunicipalities } from '../../../data/algerianWilayasMunicipalities';
import WilayaDataPod from './WilayaDataPod';
import EditDeliveryPanel from './EditDeliveryPanel';
import isEqual from 'lodash.isequal';
import { useDashboardLanguage } from '../../../context/DashboardLanguageContext'; // Import hook

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const DeliveryCostsPage = () => {
    const { t } = useDashboardLanguage(); // Initialize hook
    const [costs, setCosts] = useState({});
    const [initialCosts, setInitialCosts] = useState({});
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [selectedWilaya, setSelectedWilaya] = useState(null);

    const wilayas = useMemo(() => 
        Object.entries(algerianWilayasMunicipalities)
            .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
            .map(([code, data]) => ({ code, name: data.name }))
    , []);

    useEffect(() => {
        setHasUnsavedChanges(!isEqual(initialCosts, costs));
    }, [costs, initialCosts]);

    const fetchCosts = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/delivery-costs`);
            if (!response.ok) throw new Error(t('delivery_costs_page.messages.fetch_error'));
            const data = await response.json();
            const fetchedCosts = data.costs || {};
            
            const fullCosts = {};
            wilayas.forEach(w => {
                fullCosts[w.code] = {
                    companies: fetchedCosts[w.code]?.companies || [],
                };
            });
            setCosts(fullCosts);
            setInitialCosts(fullCosts);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [wilayas, t]);

    useEffect(() => {
        fetchCosts();
    }, [fetchCosts]);

    const handleUpdateWilayaDetails = (wilayaCode, newDetails) => {
        setCosts(prev => ({ ...prev, [wilayaCode]: newDetails }));
    };

    const handleOpenPanel = (wilaya) => {
        setSelectedWilaya({ ...wilaya, details: costs[wilaya.code] });
        setIsPanelOpen(true);
    };

    const handleClosePanel = () => {
        setIsPanelOpen(false);
        setSelectedWilaya(null);
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError('');
        setSuccess('');
        try {
            const response = await fetch(`${API_BASE_URL}/api/delivery-costs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ costs }),
            });
            if (!response.ok) throw new Error(t('delivery_costs_page.messages.save_error'));
            setSuccess(t('delivery_costs_page.messages.save_success'));
            fetchCosts(); 
            setTimeout(() => setSuccess(''), 4000);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };
    
    return (
        <div className="h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
            <header className="flex-shrink-0 bg-white/80 backdrop-blur-lg border-b border-slate-200">
                <div className="max-w-7xl mx-auto flex justify-between items-center p-4 sm:p-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{t('delivery_costs_page.header.title')}</h1>
                        <p className="mt-1 text-sm text-slate-500 hidden sm:block">{t('delivery_costs_page.header.subtitle')}</p>
                    </div>
                    <button onClick={handleSave} disabled={isSaving || !hasUnsavedChanges} className={`relative flex items-center gap-2 px-4 sm:px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none ${hasUnsavedChanges && !isSaving ? 'animate-pulse' : ''}`}>
                        {hasUnsavedChanges && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span></span>}
                        {isSaving ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
                        {isSaving ? t('delivery_costs_page.header.saving_button') : t('delivery_costs_page.header.save_button')}
                    </button>
                </div>
            </header>
            <main className="flex-grow overflow-y-auto">
                <div className="max-w-7xl mx-auto p-4 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        <AnimatePresence>
                            {wilayas.map(wilaya => (
                                <WilayaDataPod
                                    key={wilaya.code}
                                    wilaya={{...wilaya, details: costs[wilaya.code]}}
                                    onEdit={handleOpenPanel}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            <EditDeliveryPanel
                isOpen={isPanelOpen}
                onClose={handleClosePanel}
                wilaya={selectedWilaya}
                onUpdate={handleUpdateWilayaDetails}
            />
        </div>
    );
};

export default DeliveryCostsPage;