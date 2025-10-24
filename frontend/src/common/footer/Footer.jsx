// frontend/src/components/Footer.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    FaTwitter, FaLinkedinIn, FaGithub, FaDribbble,
    FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp
} from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';

const iconComponents = {
    FaTwitter, FaGithub, FaLinkedinIn, FaDribbble, FaFacebookF,
    FaInstagram, FaTiktok, FaWhatsapp
};
const iconAriaLabels = {
    FaTwitter: 'Twitter', FaGithub: 'GitHub', FaLinkedinIn: 'LinkedIn',
    FaDribbble: 'Dribbble', FaFacebookF: 'Facebook', FaInstagram: 'Instagram',
    FaTiktok: 'TikTok', FaWhatsapp: 'WhatsApp',
};

const Footer = () => {
    const [footerData, setFooterData] = useState(null);
    const currentYear = new Date().getFullYear();
    // --- ADDED: Get language and direction from context ---
    const { language, dir } = useLanguage();

    useEffect(() => {
        const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/footer`;
        const fetchFooterData = async () => {
            try {
                const { data } = await axios.get(API_URL);
                setFooterData(data);
            } catch (error) {
                console.error("Could not fetch footer data:", error);
                setFooterData({ linkSections: [], socialLinks: [] });
            }
        };
        fetchFooterData();
    }, []);

    if (!footerData) {
        return (
            <footer className="bg-slate-50 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="space-y-4">
                                <div className="h-5 w-2/3 bg-slate-200 rounded animate-pulse"></div>
                                <div className="h-4 w-1/2 bg-slate-200 rounded animate-pulse"></div>
                                <div className="h-4 w-1/2 bg-slate-200 rounded animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </footer>
        );
    }

    return (
        // --- MODIFIED: Added dir attribute for RTL/LTR support ---
        <footer className="bg-white border-t border-gray-200" dir={dir}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-8 py-16">
                    {footerData.linkSections?.map((section) => (
                        <div key={section._id || section.title?.en}>
                            {/* --- MODIFIED: Render title based on current language, with a fallback to English --- */}
                            <h3 className="text-sm font-semibold tracking-wide text-slate-900 uppercase">
                                {section.title?.[language] || section.title?.en}
                            </h3>
                            <ul className="mt-5 space-y-4">
                                {section.links?.map(link => (
                                    <li key={link._id || link.title?.en}>
                                        <a 
                                            href={link.href} 
                                            className="relative text-base text-slate-600 transition-colors duration-300 hover:text-slate-900 group"
                                        >
                                            {/* --- MODIFIED: Render link title based on current language, with a fallback --- */}
                                            <span>{link.title?.[language] || link.title?.en}</span>
                                            <span className="absolute bottom-0 left-0 w-0 h-px bg-slate-900 transition-all duration-300 ease-in-out group-hover:w-full"></span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="pt-8 pb-12 mt-8 border-t border-slate-200 flex flex-col-reverse gap-y-6 sm:flex-row items-center justify-between">
                    <p className="text-sm text-slate-500">
                        &copy; {currentYear} Nexus, Inc. All Rights Reserved.
                    </p>
                    <div className="flex items-center space-x-2">
                        {footerData.socialLinks?.map(social => {
                             const IconComponent = iconComponents[social.icon];
                             if (!IconComponent) return null;
                             return (
                                 <a 
                                    key={social._id || social.href}
                                    href={social.href}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    aria-label={iconAriaLabels[social.icon] || 'Social Media'}
                                    className="p-2 rounded-full text-slate-500 transition-all duration-300 hover:text-slate-900 hover:bg-slate-100 hover:scale-110"
                                >
                                   <IconComponent className="h-5 w-5" />
                                 </a>
                            )
                        })}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;