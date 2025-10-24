// src/common/Navbar/navbar_components/MobileMenu.jsx

import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ShoppingCart, X, LayoutDashboard } from 'lucide-react';

const MobileMenu = ({ onClose, cartCount, user, t, navLinks, logoData }) => (
    <>
        {/* Backdrop overlay */}
        <div onClick={onClose} className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm" aria-hidden="true" />

        {/* Mobile Menu Panel */}
        <div className="fixed top-0 left-0 right-0 z-[100] flex w-full flex-col rounded-b-2xl bg-white p-6 shadow-2xl">
            <div className="absolute top-0 left-0 right-0 flex h-20 items-center justify-between px-6">
                <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-800">
                    {logoData.imageUrl && <img src={logoData.imageUrl} alt={`${logoData.name} logo`} className="h-8 w-auto" />}
                    <span>{logoData.name}</span>
                </Link>
                <button 
                    onClick={onClose} 
                    className="flex items-center justify-center rounded-full p-3 text-black transition-all duration-300 hover:scale-110 hover:bg-blue-600/10 hover:text-blue-600"
                    aria-label={t('close_menu')}
                >
                    <X size={24} />
                </button>
            </div>

            <nav className="flex flex-col mt-20">
                {user && (
                    <a href="/dashboard" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 py-3 text-lg font-semibold text-black transition-colors duration-300 hover:text-blue-600">
                        <LayoutDashboard size={22} /> 
                        <span>{t('dashboard')}</span>
                    </a>
                )}
                {navLinks.map(link => (
                    <NavLink key={link.name} to={link.path} className={({ isActive }) => `flex items-center gap-4 py-3 text-lg font-semibold text-black transition-colors duration-300 hover:text-blue-600 ${isActive ? 'text-blue-600' : ''}`}>
                        {link.icon} 
                        <span>{link.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="mt-6 flex justify-around border-t border-gray-200 pt-5">
                <Link to="/cart" className="relative flex flex-col items-center gap-1  text-black transition-colors duration-300 hover:text-blue-600">
                    <ShoppingCart size={24} />
                    {cartCount > 0 && <span className="absolute -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white ltr:-right-2 rtl:-left-2">{cartCount}</span>}
                    <span className="text-sm font-medium">{t('cart')}</span>
                </Link>
            </div>
        </div>
    </>
);

export default MobileMenu;