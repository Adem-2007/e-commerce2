// src/common/Navbar/navbar_components/ActionIcons.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { ShoppingCart } from 'lucide-react';
import { LayoutDashboard } from 'lucide-react';
import LanguageDropdown from './LanguageDropdown';

const ActionIcons = ({ user, cartCount, setSearchOpen, language, setLanguage, t }) => {
    return (
        <div className="flex items-center gap-1 sm:gap-2">
            {/* Language Dropdown */}
            <LanguageDropdown language={language} setLanguage={setLanguage} />

            {/* Dashboard Link (visible if user is logged in, on md screens and up) */}
            {user && (
                <a
                    href="/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden items-center justify-center rounded-full p-3 text-black transition-all duration-300 hover:scale-110 hover:bg-blue-600/10 hover:text-blue-600 md:flex"
                    aria-label={t('dashboard')}
                >
                    <LayoutDashboard size={22} />
                </a>
            )}

            {/* Search Button */}
            <button
                className="flex items-center justify-center rounded-full p-3 text-black transition-all duration-300 hover:scale-110 hover:bg-blue-600/10 hover:text-blue-600"
                onClick={() => setSearchOpen(true)}
                aria-label={t('search')}
            >
                <Search size={22} />
            </button>

            {/* Cart Link (visible on md screens and up) */}
            <Link
                to="/cart"
                className="relative hidden items-center justify-center rounded-full p-3 text-black transition-all duration-300 hover:scale-110 hover:bg-blue-600/10 hover:text-blue-600 md:flex"
                aria-label={t('shoppingCart')}
            >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                    <span className="absolute -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white ltr:-right-1 rtl:-left-1">
                        {cartCount}
                    </span>
                )}
            </Link>
        </div>
    );
};

export default ActionIcons;