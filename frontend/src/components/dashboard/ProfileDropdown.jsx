// frontend/src/components/dashboard/ProfileDropdown.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useDashboardLanguage } from '../../context/DashboardLanguageContext';
import { FiLogOut, FiShield, FiEdit3, FiUser, FiSettings } from 'react-icons/fi';
import EditProfileModal from './EditProfileModal';

const roleStyles = {
    admin: { icon: FiShield, color: "bg-blue-500", tag: "text-blue-600" },
    creator: { icon: FiEdit3, color: "bg-indigo-500", tag: "text-indigo-600" },
    pager: { icon: FiUser, color: "bg-slate-500", tag: "text-slate-600" },
};

const ProfileDropdown = () => {
    const { user, logout, updateCurrentUser } = useAuth();
    const { t } = useDashboardLanguage();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const getInitials = (name) => {
        if (!name) return '?';
        const names = name.split(' ');
        if (names.length > 1) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (!user || !user.role) return null;

    const style = roleStyles[user.role.toLowerCase()] || roleStyles.pager;
    const RoleIcon = style.icon;

    return (
        <>
            <div className="relative" ref={dropdownRef}>
                <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-inner cursor-pointer overflow-hidden ${style.color}`}
                >
                    {user.avatar ? (
                        <img src={user.avatar} alt="User Avatar" className="w-full h-full object-cover" />
                    ) : (
                        getInitials(user.name)
                    )}
                </button>

                <div 
                    className={`absolute right-0 rtl:right-auto rtl:left-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-xl z-20 p-2 transform transition-all duration-200 ease-in-out ${
                        isDropdownOpen ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'
                    }`}
                >
                    <div className="px-3 py-2 border-b border-slate-200">
                        <p className="font-semibold text-slate-800 truncate">{user.name}</p>
                        <p className="text-sm text-slate-500 truncate">{user.email}</p>
                    </div>
                    <div className="px-3 py-2 flex items-center gap-2">
                        <RoleIcon className={`w-4 h-4 ${style.tag}`} />
                        <span className={`font-semibold text-sm capitalize ${style.tag}`}>{user.role}</span>
                    </div>
                    <div className="mt-1 p-1">
                        <button 
                            onClick={() => {
                                setIsModalOpen(true);
                                setIsDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-3 text-start px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 hover:text-blue-600 rounded-md transition-colors"
                        >
                            <FiSettings size={15}/> {t('edit_profile')}
                        </button>
                         <button 
                            onClick={() => { 
                                logout(); 
                                navigate('/auth'); 
                            }}
                            className="w-full flex items-center gap-3 text-start px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                            <FiLogOut size={15}/> {t('logout')}
                        </button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <EditProfileModal 
                    onClose={() => setIsModalOpen(false)} 
                    onSave={(updatedUser) => {
                        updateCurrentUser(updatedUser);
                        setIsModalOpen(false);
                    }}
                />
            )}
        </>
    );
};

export default ProfileDropdown;