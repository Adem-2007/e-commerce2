// src/pages/Dashboard/Delivery/EditDeliveryPanel.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Edit, Trash2, Home, Briefcase, CheckCircle, AlertTriangle } from 'lucide-react';
import { CompanyEditForm } from './CompanyEditForm';
import { ConfirmationModal } from './ConfirmationModal';
import { v4 as uuidv4 } from 'uuid';
import { useDashboardLanguage } from '../../../context/DashboardLanguageContext'; // Import hook

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const EditDeliveryPanel = ({ wilaya, isOpen, onClose, onUpdate }) => {
    const { t } = useDashboardLanguage(); // Initialize hook
    const [companies, setCompanies] = useState([]);
    const [editingCompanyId, setEditingCompanyId] = useState(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [companyToDeleteId, setCompanyToDeleteId] = useState(null);
    const [isAddingNewCourier, setIsAddingNewCourier] = useState(false);

    useEffect(() => {
        if (wilaya?.details?.companies) {
            setCompanies(wilaya.details.companies);
        } else {
            setCompanies([]);
        }
        setEditingCompanyId(null);
        setIsAddingNewCourier(false);
    }, [wilaya]);

    if (!wilaya) return null;

    const handleUpdateAndClose = () => {
        const updatedWilayaDetails = { ...wilaya.details, companies: companies };
        onUpdate(wilaya.code, updatedWilayaDetails);
        onClose();
    };

    const handleAddNew = () => {
        setIsAddingNewCourier(true);
        const newCompany = { 
            _id: `temp-${uuidv4()}`, 
            companyName: '', 
            priceHome: 0, 
            priceOffice: 0,
            logoUrl: '',
            isActive: true,
            isNew: true,
            currency: 'DZD' // --- MODIFIED: Added default currency
        };
        setCompanies(prev => [...prev, newCompany]);
        setEditingCompanyId(newCompany._id);
    };

    const handleSaveCompany = (companyData) => {
        const { isNew, ...companyToSave } = companyData;
        setCompanies(prev => prev.map(c => c._id === companyData._id ? companyToSave : c));
        setEditingCompanyId(null);
        if (isNew) {
            setIsAddingNewCourier(false);
        }
    };
    
    const handleDeleteCompany = (companyId) => {
        setCompanyToDeleteId(companyId);
        setIsDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (companyToDeleteId) {
            setCompanies(prev => prev.filter(c => c._id !== companyToDeleteId));
        }
        setIsDeleteConfirmOpen(false);
        setCompanyToDeleteId(null);
    };

    const panelVariants = { hidden: { x: '100%' }, visible: { x: '0%', transition: { type: 'spring', stiffness: 300, damping: 30 } }, exit: { x: '100%', transition: { duration: 0.2 } } };
    const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div variants={backdropVariants} initial="hidden" animate="visible" exit="exit" onClick={handleUpdateAndClose} className="fixed inset-0 bg-black/60 z-40" />
                    <motion.div variants={panelVariants} initial="hidden" animate="visible" exit="exit" className="fixed top-0 right-0 h-full w-full max-w-lg bg-slate-50 shadow-2xl z-50 flex flex-col">
                        <header className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
                             <div>
                                <h2 className="text-xl font-bold text-slate-800">{t('delivery_costs_page.edit_panel.title')}</h2>
                                <p className="text-sm font-semibold text-blue-600">{wilaya.code} - {wilaya.name}</p>
                            </div>
                            <button onClick={handleUpdateAndClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-100">
                                <X size={24} />
                            </button>
                        </header>

                        <div className="flex-grow p-4 space-y-3 overflow-y-auto">
                            <AnimatePresence>
                            {companies.map(company => (
                                <motion.div layout="position" key={company._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}>
                                    {editingCompanyId === company._id ? (
                                        <CompanyEditForm 
                                            company={company}
                                            onSave={handleSaveCompany}
                                            onCancel={() => {
                                                if (company.isNew) {
                                                     setCompanies(prev => prev.filter(c => c._id !== company._id));
                                                     setIsAddingNewCourier(false);
                                                }
                                                setEditingCompanyId(null);
                                            }}
                                        />
                                    ) : (
                                        <div className="bg-white rounded-lg border border-slate-200 p-3 flex items-center gap-4 hover:border-blue-400 transition-colors">
                                             {/* --- MODIFIED: Use company.logoUrl directly --- */}
                                             <img src={company.logoUrl} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100 flex-shrink-0" onError={(e) => e.currentTarget.style.display = 'none'} onLoad={(e) => e.currentTarget.style.display = 'block'} />
                                            <div className="flex-grow">
                                                <p className="font-semibold text-slate-800">{company.companyName || <span className="text-slate-400">{t('delivery_costs_page.edit_panel.unnamed_company')}</span>}</p>
                                                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                                    {/* --- MODIFIED: Display currency --- */}
                                                    <span className="flex items-center gap-1"><Home size={12}/> {company.priceHome || 0} {company.currency || 'DZD'}</span>
                                                    <span className="flex items-center gap-1"><Briefcase size={12}/> {company.priceOffice || 0} {company.currency || 'DZD'}</span>
                                                </div>
                                            </div>
                                             {company.isActive ? <CheckCircle size={20} className="text-green-500"/> : <AlertTriangle size={20} className="text-amber-500"/>}
                                            <div className="flex gap-2">
                                                <button onClick={() => setEditingCompanyId(company._id)} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md"><Edit size={16} /></button>
                                                <button onClick={() => handleDeleteCompany(company._id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md"><Trash2 size={16}/></button>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                            </AnimatePresence>
                             <button onClick={handleAddNew} disabled={isAddingNewCourier} className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 text-slate-500 font-semibold py-3 rounded-lg hover:bg-slate-100 hover:border-slate-400 transition disabled:bg-slate-200 disabled:cursor-not-allowed">
                                <Plus size={18} /> {t('delivery_costs_page.edit_panel.add_button')}
                            </button>
                        </div>
                        
                        <footer className="p-4 bg-white/80 backdrop-blur-lg border-t border-slate-200">
                            <button onClick={handleUpdateAndClose} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-all">
                                {t('delivery_costs_page.edit_panel.apply_button')}
                            </button>
                        </footer>
                    </motion.div>
                    
                    <ConfirmationModal
                        isOpen={isDeleteConfirmOpen}
                        onClose={() => setIsDeleteConfirmOpen(false)}
                        onConfirm={handleConfirmDelete}
                        title={t('delivery_costs_page.edit_panel.delete_modal_title')}
                    >
                        <p>{t('delivery_costs_page.edit_panel.delete_modal_body')}</p>
                    </ConfirmationModal>
                </>
            )}
        </AnimatePresence>
    );
};
export default EditDeliveryPanel;