// src/common/Navbar/Navbar.jsx

import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, Home, Store, Mail, Info } from 'lucide-react'; // Removed unused icons to slightly clean up
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import axios from 'axios';

// --- LAZY IMPORTS ---
// Lazily import heavy components that are not needed on initial render
const MonolithSearch = lazy(() => import('./navbar_components/MonolithSearch'));
const MobileMenu = lazy(() => import('./navbar_components/MobileMenu')); // Lazy load the mobile menu

import ActionIcons from './navbar_components/ActionIcons';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Navbar = () => {
    const { language, setLanguage, t } = useLanguage();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setSearchOpen] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { cartCount } = useCart();
    const { user } = useAuth();
    const location = useLocation();
    const [logoData, setLogoData] = useState({ name: '', imageUrl: '' });
    
    // --- OPTIMIZATION: Memoize navLinks with useCallback to prevent re-creation on every render ---
    const navLinks = React.useMemo(() => [
        { name: t('home'), path: '/', icon: <Home size={18} /> },
        { name: t('shop'), path: '/shop', icon: <Store size={18} /> },
        { name: t('contact'), path: '/contact', icon: <Mail size={18} /> },
        { name: t('about'), path: '/about', icon: <Info size={18} /> },
    ], [t]);

    const fetchLogo = useCallback(async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/logo`);
            setLogoData(data);
        } catch (error) {
            console.error('Failed to fetch logo:', error);
        }
    }, []);

    useEffect(() => {
        if (language === 'ar') {
            document.documentElement.dir = 'rtl';
            document.documentElement.lang = 'ar';
        } else {
            document.documentElement.dir = 'ltr';
            document.documentElement.lang = language;
        }
    }, [language]);

    useEffect(() => {
        fetchLogo();
        const handleLogoUpdate = () => fetchLogo();
        window.addEventListener('logoUpdated', handleLogoUpdate);
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('logoUpdated', handleLogoUpdate);
        };
    }, [fetchLogo]);

    useEffect(() => {
        if (isMobileMenuOpen || isSearchOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isMobileMenuOpen, isSearchOpen]);

    useEffect(() => {
        if (isMobileMenuOpen) {
            setMobileMenuOpen(false);
        }
    }, [location.pathname]);

    return (
        <>
            <header className={`sticky top-0 z-50 w-full border-b transition-all duration-400 ease-in-out ${isScrolled ? 'border-gray-200/50 bg-white/85 shadow-sm backdrop-blur-lg' : 'border-transparent bg-white/60 backdrop-blur-xl'}`}>
                <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between">
                        <div className="flex-1">
                            <Link to="/" className="flex items-center gap-3 text-2xl font-bold text-gray-800 transition-transform duration-300 hover:scale-105">
                                {logoData.imageUrl && <img src={logoData.imageUrl} alt={`${logoData.name} logo`} className="h-10 w-auto" />}
                                <span>{logoData.name}</span>
                            </Link>
                        </div>
                        <div className="hidden md:flex items-center justify-center">
                            <nav className="flex items-center gap-2 text-black">
                                {navLinks.map((link) => (
                                    <NavLink
                                        key={link.name}
                                        to={link.path}
                                        className={({ isActive }) =>
                                            `group flex items-center gap-2 py-4 px-3 font-medium text-black outline-none transition-colors duration-300 hover:text-blue-600 ${isActive ? 'text-blue-600' : ''}`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                {link.icon}
                                                <span className="relative">
                                                    {link.name}
                                                    <span
                                                        className={`absolute bottom-[-0.7rem] left-0 h-[2px] w-full origin-center bg-blue-600 transition-transform duration-400 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-x-100 ${
                                                            isActive ? 'scale-x-100' : 'scale-x-0'
                                                        }`}
                                                    ></span>
                                                </span>
                                            </>
                                        )}
                                    </NavLink>
                                ))}
                            </nav>
                        </div>
                        <div className="flex flex-1 items-center justify-end gap-1">
                            <ActionIcons
                                user={user}
                                cartCount={cartCount}
                                setSearchOpen={setSearchOpen}
                                language={language}
                                setLanguage={setLanguage}
                                t={t}
                            />
                            <div className="md:hidden">
                                <button
                                    className="flex items-center justify-center rounded-full p-3 text-black transition-all duration-300 hover:scale-110 hover:bg-blue-600/10 hover:text-blue-600"
                                    onClick={() => setMobileMenuOpen(true)}
                                    aria-label="Open menu"
                                >
                                    <Menu size={24} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            
            <Suspense fallback={null}>
                {isSearchOpen && <MonolithSearch onClose={() => setSearchOpen(false)} t={t} />}
                {isMobileMenuOpen && <MobileMenu onClose={() => setMobileMenuOpen(false)} cartCount={cartCount} user={user} t={t} navLinks={navLinks} logoData={logoData} />}
            </Suspense>
        </>
    );
};

export default Navbar;