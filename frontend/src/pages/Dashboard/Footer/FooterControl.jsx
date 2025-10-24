// src/pages/Dashboard/Footer/FooterControl.jsx

import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import axios from 'axios';
import { Plus, Trash2, Save, Link as LinkIcon, AlertTriangle, CheckCircle, Share2, LayoutGrid, X } from 'lucide-react'; // Import X for cancel
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardLanguage } from '../../../context/DashboardLanguageContext';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/footer`;

// --- Sub-Components ---
const LoadingScreen = () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-50 p-20">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
    </div>
);
const ControlModule = ({ icon, title, children }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 flex items-center gap-3 border-b border-slate-100 bg-slate-50/50">
            {icon}
            <h2 className="text-lg font-bold text-slate-800">{title}</h2>
        </div>
        <div className="p-4 md:p-6 space-y-4">{children}</div>
    </div>
);
const FormInput = ({ paddingClass = 'p-3', ...props }) => (
    <input 
        className={`w-full text-base rounded-lg text-slate-700 bg-slate-100 border border-slate-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white ${paddingClass}`}
        autoComplete="off"
        {...props}
    />
);
const motionProps = {
    layout: true, initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95 }, transition: { type: "spring", stiffness: 300, damping: 30 }
};

// --- Main Component ---
const FooterControl = () => {
    const { t } = useDashboardLanguage();
    
    const socialIconOptions = [
        { label: t('footer_control_page.social_icon_labels.twitter'), value: 'FaTwitter' }, 
        { label: t('footer_control_page.social_icon_labels.facebook'), value: 'FaFacebookF' },
        { label: t('footer_control_page.social_icon_labels.instagram'), value: 'FaInstagram' }, 
        { label: t('footer_control_page.social_icon_labels.linkedin'), value: 'FaLinkedinIn' },
        { label: t('footer_control_page.social_icon_labels.github'), value: 'FaGithub' }, 
        { label: t('footer_control_page.social_icon_labels.dribbble'), value: 'FaDribbble' },
        { label: t('footer_control_page.social_icon_labels.tiktok'), value: 'FaTiktok' }, 
        { label: t('footer_control_page.social_icon_labels.whatsapp'), value: 'FaWhatsapp' },
    ];
    
    const [footerData, setFooterData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState({ text: '', type: '' });
    const [editLang, setEditLang] = useState('en');
    const availableLangs = [ { code: 'en', name: 'English' }, { code: 'fr', name: 'Français' }, { code: 'ar', name: 'العربية' }];

    // --- ADDED: State for the new inline section creation form ---
    const [isAddingSection, setIsAddingSection] = useState(false);
    const [newSectionTitle, setNewSectionTitle] = useState({ en: '', fr: '', ar: '' });
    const newSectionInputRef = useRef(null); // To auto-focus the input

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    };

    useEffect(() => {
        const fetchFooterData = async () => {
            setIsLoading(true);
            try {
                const { data } = await axios.get(API_BASE_URL);
                const sanitizedSections = (data.linkSections || []).map(section => ({
                    ...section,
                    title: { en: '', fr: '', ar: '', ...(typeof section.title === 'object' ? section.title : {}) },
                    links: (section.links || []).map(link => ({
                        ...link,
                        title: { en: '', fr: '', ar: '', ...(typeof link.title === 'object' ? link.title : {}) }
                    }))
                }));
                setFooterData({ linkSections: sanitizedSections, socialLinks: data.socialLinks || [] });
            } catch (err) {
                setSaveMessage({ text: t('footer_control_page.fetch_error'), type: 'error' });
            } finally {
                setIsLoading(false);
            }
        };
        fetchFooterData();
    }, [t]);

    // Auto-focus the input field when it appears
    useEffect(() => {
        if (isAddingSection && newSectionInputRef.current) {
            newSectionInputRef.current.focus();
        }
    }, [isAddingSection]);

    // --- Handlers ---
    const handleLinkSectionChange = (sectionIndex, e) => {
        const updatedSections = [...footerData.linkSections];
        if (!updatedSections[sectionIndex].title || typeof updatedSections[sectionIndex].title !== 'object') {
            updatedSections[sectionIndex].title = { en: '', fr: '', ar: '' };
        }
        updatedSections[sectionIndex].title[editLang] = e.target.value;
        setFooterData(prev => ({ ...prev, linkSections: updatedSections }));
    };

    const handleLinkChange = (sectionIndex, linkIndex, e) => {
        const { name, value } = e.target;
        const updatedSections = [...footerData.linkSections];
        const linkToUpdate = updatedSections[sectionIndex].links[linkIndex];
        
        if (name === 'title') {
            if (!linkToUpdate.title || typeof linkToUpdate.title !== 'object') {
                linkToUpdate.title = { en: '', fr: '', ar: '' };
            }
            linkToUpdate.title[editLang] = value;
        } else if (name === 'href') {
            linkToUpdate.href = `/${value.replace(/^\//, '')}`;
        } else {
             linkToUpdate[name] = value;
        }
        setFooterData(prev => ({ ...prev, linkSections: updatedSections }));
    };

    const handleSocialLinkChange = (index, e) => {
        const { name, value } = e.target;
        const updatedSocials = [...footerData.socialLinks];
        updatedSocials[index][name] = value;
        setFooterData(prev => ({ ...prev, socialLinks: updatedSocials }));
    };
    
    // --- MODIFIED: This function is now just for adding links to *existing* sections ---
    const addLink = (sectionIndex) => {
        const newLink = { title: { en: 'New Link', fr: 'Nouveau Lien', ar: 'رابط جديد' }, href: '/new-page' };
        const updatedSections = [...footerData.linkSections];
        updatedSections[sectionIndex].links.push(newLink);
        setFooterData(prev => ({ ...prev, linkSections: updatedSections }));
    };
    
    // --- ADDED: Handlers for the new section form ---
    const handleConfirmAddSection = () => {
        if (Object.values(newSectionTitle).every(title => title.trim() === '')) {
            // If all titles are empty, just cancel
            setIsAddingSection(false);
            return;
        }
        const newSection = {
            title: newSectionTitle,
            links: [] // New sections start with no links
        };
        setFooterData(prev => ({ ...prev, linkSections: [...prev.linkSections, newSection] }));
        
        // Reset state
        setIsAddingSection(false);
        setNewSectionTitle({ en: '', fr: '', ar: '' });
    };

    const handleCancelAddSection = () => {
        setIsAddingSection(false);
        setNewSectionTitle({ en: '', fr: '', ar: '' });
    };

    const removeLinkSection = (sectionIndex) => {
        setFooterData(prev => ({ ...prev, linkSections: prev.linkSections.filter((_, i) => i !== sectionIndex) }));
    };

    const removeLink = (sectionIndex, linkIndex) => {
        const updatedSections = [...footerData.linkSections];
        updatedSections[sectionIndex].links = updatedSections[sectionIndex].links.filter((_, i) => i !== linkIndex);
        setFooterData(prev => ({ ...prev, linkSections: updatedSections }));
    };
    
    const addSocialLink = () => {
        const newSocial = { href: '#', icon: socialIconOptions[0].value };
        setFooterData(prev => ({ ...prev, socialLinks: [...prev.socialLinks, newSocial] }));
    };

    const removeSocialLink = (index) => {
        setFooterData(prev => ({ ...prev, socialLinks: prev.socialLinks.filter((_, i) => i !== index) }));
    };
    
    const handleSaveChanges = async () => {
        setIsSaving(true);
        setSaveMessage({ text: '', type: '' });
        // Make sure we cancel any pending new section before saving
        if(isAddingSection) handleCancelAddSection();
        const config = getAuthHeaders();
        if (!config.headers?.Authorization) {
             setSaveMessage({ text: t('footer_control_page.auth_error'), type: 'error' });
             setIsSaving(false);
             return;
        }
        try {
            await axios.put(API_BASE_URL, footerData, config);
            setSaveMessage({ text: t('footer_control_page.save_success'), type: 'success' });
        } catch (err) {
            const errorMsg = err.response?.data?.message || t('footer_control_page.save_error_default');
            setSaveMessage({ text: errorMsg, type: 'error' });
        } finally {
            setIsSaving(false);
            setTimeout(() => setSaveMessage({ text: '', type: '' }), 5000);
        }
    };

    if (isLoading) return <LoadingScreen />;

    return (
        <div className="bg-slate-50 min-h-full p-6 md:p-8 pb-28">
            <header className="mb-8">
                <div className="flex items-center gap-2 text-sm text-slate-500"><LayoutGrid size={16} /><span>{t('footer_control_page.header_breadcrumb')}</span></div>
                <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mt-1">{t('footer_control_page.header_title')}</h1>
            </header>
            <AnimatePresence>{saveMessage.text && (<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`p-4 mb-6 rounded-lg font-semibold flex items-center justify-center gap-2 text-center ${saveMessage.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{saveMessage.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}{saveMessage.text}</motion.div>)}</AnimatePresence>
            
            <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                    <motion.div {...motionProps}>
                        <ControlModule icon={<LinkIcon size={20} className="text-indigo-600" />} title={t('footer_control_page.link_sections_title')}>
                            <div className="mb-4 p-1 bg-slate-100 rounded-lg flex items-center justify-between">
                                {availableLangs.map(lang => (<button key={lang.code} onClick={() => setEditLang(lang.code)} className={`w-full py-2 px-3 text-sm font-semibold rounded-md transition-colors duration-200 ${ editLang === lang.code ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}>{lang.name}</button>))}
                            </div>
                            <AnimatePresence>
                                {footerData?.linkSections.map((section, sIndex) => (
                                    <motion.div {...motionProps} key={sIndex} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <input type="text" value={section.title?.[editLang] || ''} onChange={(e) => handleLinkSectionChange(sIndex, e)} placeholder={t('footer_control_page.section_title_placeholder')} className="text-lg font-semibold bg-transparent focus:outline-none w-full p-1" />
                                            <button onClick={() => removeLinkSection(sIndex)} className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-red-100 hover:text-red-600"><Trash2 size={16} /></button>
                                        </div>
                                        <div className="space-y-2">
                                            {section.links.map((link, lIndex) => (
                                                <div key={lIndex} className="flex items-center gap-2">
                                                    <FormInput name="title" value={link.title?.[editLang] || ''} onChange={(e) => handleLinkChange(sIndex, lIndex, e)} placeholder={t('footer_control_page.link_title_placeholder')} />
                                                    <div className="relative flex-grow">
                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500" aria-hidden="true">/</span>
                                                        <FormInput name="href" value={link.href.substring(1)} onChange={(e) => handleLinkChange(sIndex, lIndex, e)} placeholder={t('footer_control_page.link_href_placeholder', 'e.g., contact')} paddingClass="p-3 pl-6" />
                                                    </div>
                                                    <button onClick={() => removeLink(sIndex, lIndex)} className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-red-100 hover:text-red-600"><Trash2 size={16} /></button>
                                                </div>
                                            ))}
                                            <button onClick={() => addLink(sIndex)} className="w-full mt-2 p-2 rounded-lg font-semibold text-sm text-indigo-600 bg-indigo-100/60 transition hover:bg-indigo-100"><Plus size={14} className="inline-block -mt-px" /> {t('footer_control_page.add_link_button')}</button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* --- ADDED: The new inline form for adding a section --- */}
                            <AnimatePresence>
                                {isAddingSection && (
                                    <motion.div {...motionProps} className="p-4 mt-2 bg-indigo-50 rounded-xl border border-indigo-200 space-y-3">
                                        <FormInput 
                                            ref={newSectionInputRef}
                                            placeholder={t('footer_control_page.new_section_placeholder', 'Enter title for new section...')}
                                            value={newSectionTitle[editLang] || ''}
                                            onChange={(e) => setNewSectionTitle(prev => ({ ...prev, [editLang]: e.target.value }))}
                                            onKeyDown={(e) => e.key === 'Enter' && handleConfirmAddSection()}
                                        />
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={handleCancelAddSection} 
                                                className="p-2 rounded-full text-slate-500 transition-colors hover:bg-slate-200"
                                            >
                                                <X size={18} />
                                            </button>
                                            <button 
                                                onClick={handleConfirmAddSection} 
                                                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm transition hover:bg-indigo-700"
                                            >
                                                {t('footer_control_page.add_section_confirm_button', 'Add Section')}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            
                            {/* --- MODIFIED: The main "Add" button now just reveals the form --- */}
                            {!isAddingSection && (
                                <button 
                                    onClick={() => setIsAddingSection(true)} 
                                    className="w-full mt-2 p-3 rounded-lg font-semibold text-indigo-600 bg-indigo-100 transition hover:bg-indigo-200"
                                >
                                    <Plus size={16} className="inline-block -mt-px" /> {t('footer_control_page.add_link_section_button')}
                                </button>
                            )}
                        </ControlModule>
                    </motion.div>
                </div>

                {/* --- Social Links Column (No changes needed here) --- */}
                <div className="lg:col-span-1 lg:sticky top-28">
                     <motion.div {...motionProps}>
                        <ControlModule icon={<Share2 size={20} className="text-indigo-600" />} title={t('footer_control_page.social_links_title')}>
                            <AnimatePresence>
                                {footerData?.socialLinks.map((social, index) => (
                                    <motion.div {...motionProps} key={index} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                                        <FormInput name="href" value={social.href} onChange={(e) => handleSocialLinkChange(index, e)} placeholder={t('footer_control_page.social_href_placeholder')} />
                                        <div className="flex items-center gap-2">
                                            <select name="icon" value={social.icon} onChange={(e) => handleSocialLinkChange(index, e)} className="w-full p-3 text-base rounded-lg text-slate-700 bg-slate-100 border border-slate-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white">
                                                {socialIconOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                            </select>
                                            <button onClick={() => removeSocialLink(index)} className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-red-100 hover:text-red-600"><Trash2 size={16} /></button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            <button onClick={addSocialLink} className="w-full mt-2 p-3 rounded-lg font-semibold text-indigo-600 bg-indigo-100 transition hover:bg-indigo-200"><Plus size={16} className="inline-block -mt-px" /> {t('footer_control_page.add_social_link_button')}</button>
                        </ControlModule>
                    </motion.div>
                </div>
            </main>

            {/* --- Save Bar (No changes needed here) --- */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-slate-200 p-4 flex justify-center z-30">
                 <button onClick={handleSaveChanges} disabled={isSaving} className="flex items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:bg-indigo-700 hover:-translate-y-0.5 disabled:bg-indigo-400 disabled:shadow-none disabled:cursor-not-allowed"><Save size={18} />{isSaving ? t('footer_control_page.saving_button') : t('footer_control_page.save_button')}</button>
            </div>
        </div>
    );
};
export default FooterControl;