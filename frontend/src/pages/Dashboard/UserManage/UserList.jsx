// src/pages/Dashboard/UserManage/UserList.jsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { FiUser, FiEdit3, FiShield, FiMoreVertical, FiSearch, FiLoader, FiTrash2, FiSettings, FiAlertTriangle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import EditUserModal from './EditUserModal';
import ManagePermissionsModal from './ManagePermissionsModal';
import { useDashboardLanguage } from '../../../context/DashboardLanguageContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

const roleStyles = {
    admin: { icon: FiShield, avatar: "bg-blue-100 text-blue-600", tag: "bg-blue-200 text-blue-800" },
    creator: { icon: FiEdit3, avatar: "bg-indigo-100 text-indigo-600", tag: "bg-indigo-200 text-indigo-800" },
    pager: { icon: FiUser, avatar: "bg-slate-200 text-slate-600", tag: "bg-slate-200 text-slate-800" },
};

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeMenu, setActiveMenu] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const { token, user: currentUser, updateCurrentUser } = useAuth();
    const { t } = useDashboardLanguage();
    
    const menuRef = useRef(null); // Ref for the dropdown menu

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = useCallback(async (page, search) => {
        if (!token) {
            setError('Authentication failed. Please log in again.');
            setLoading(false);
            return;
        }
        setLoading(true);
        setError('');

        const url = new URL(`${API_BASE_URL}/api/users`);
        url.searchParams.append('page', page);
        url.searchParams.append('limit', 9);
        if (search) url.searchParams.append('search', search);

        try {
            const res = await fetch(url.toString(), { 
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            if (!res.ok) throw new Error(t('user_management.user_list.errors.fetch_failed'));
            const data = await res.json();
            
            setUsers(data.users || []);
            setCurrentPage(data.page || 1);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            setError(err.message);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, [token, t]);

    useEffect(() => {
        fetchUsers(currentPage, debouncedSearchTerm);
    }, [currentPage, debouncedSearchTerm, fetchUsers]);
    
    // --- FIXED: This effect now correctly handles clicks outside the active dropdown menu ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            // If there's an active menu and the click happens outside of the menu's container, close it
            if (activeMenu && menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeMenu]); // Dependency array ensures this runs only when the active menu changes

    const handleDelete = async (userId) => {
        if (!window.confirm(t('user_management.user_list.delete_confirm_message'))) return;
        try {
            await fetch(`${API_BASE_URL}/api/users/${userId}`, {
                method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` },
            });
            fetchUsers(currentPage, debouncedSearchTerm);
            setActiveMenu(null);
        } catch (err) {
            alert(t('user_management.user_list.errors.delete_failed', { message: err.message }));
        }
    };
    
    const handleOpenEditModal = (user) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
        setActiveMenu(null);
    };

    const handleOpenPermissionsModal = (user) => {
        setSelectedUser(user);
        setIsPermissionsModalOpen(true);
        setActiveMenu(null);
    };

    const handleUpdateUser = (updatedUser) => {
        setUsers(users.map(u => (u._id === updatedUser._id ? updatedUser : u)));
        if (currentUser?._id === updatedUser._id) {
            updateCurrentUser(updatedUser);
        }
    };

    const Pagination = () => {
        if (totalPages <= 1) return null;
        return (
            <div className="flex justify-center items-center gap-2 mt-8">
                <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || loading}
                    className="p-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-md hover:bg-slate-100"
                >
                    <FiChevronLeft />
                </button>
                <span className="text-sm font-medium text-slate-600">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || loading}
                    className="p-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-md hover:bg-slate-100"
                >
                    <FiChevronRight />
                </button>
            </div>
        );
    };

    return (
        <>
            <div className="animate-fade-in">
                <div className="relative max-w-md mx-auto mb-8">
                    <FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder={t('user_management.user_list.search_placeholder')}
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset to page 1 on new search
                        }}
                        className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
                    />
                </div>
                
                {loading && users.length === 0 ? (
                    <div className="flex justify-center p-10"><FiLoader size={32} className="animate-spin text-blue-600" /></div>
                ) : error ? (
                    <div className="flex items-center justify-center gap-3 text-center p-4 text-red-600 bg-red-100 rounded-lg max-w-md mx-auto"><FiAlertTriangle />{error}</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {users.length === 0 ? (
                                <p className="col-span-full text-center text-slate-500 py-10">{t('user_management.user_list.no_users_found')}</p>
                            ) : (
                                users.map(user => {
                                    const style = roleStyles[user.role.toLowerCase()] || roleStyles.pager;
                                    const RoleIcon = style.icon;
                                    return (
                                        <div key={user._id} className="bg-white border border-slate-200/80 rounded-xl p-4 flex justify-between items-center shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300">
                                            <div className="flex items-center gap-4 overflow-hidden">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0 ${style.avatar}`}>
                                                    <RoleIcon />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 truncate">{user.name}</p>
                                                    <p className="text-sm text-slate-500 truncate">{user.email}</p>
                                                    <div className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full inline-block mt-2 ${style.tag}`}>
                                                        {user.role}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="relative flex-shrink-0">
                                                <button onClick={() => setActiveMenu(activeMenu === user._id ? null : user._id)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                                                    <FiMoreVertical />
                                                </button>
                                                {activeMenu === user._id && (
                                                    <div ref={menuRef} className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-lg shadow-xl z-10 p-1.5 animate-fade-in-up">
                                                        {currentUser?._id !== user._id && (
                                                            <button onClick={() => handleOpenPermissionsModal(user)} className="w-full flex items-center gap-3 text-left px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 hover:text-indigo-600 rounded-md transition-colors">
                                                                <FiSettings size={15}/> {t('user_management.user_list.actions.manage_permissions')}
                                                            </button>
                                                        )}
                                                        <button onClick={() => handleOpenEditModal(user)} className="w-full flex items-center gap-3 text-left px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 hover:text-blue-600 rounded-md transition-colors">
                                                            <FiEdit3 size={15}/> {t('user_management.user_list.actions.edit_details')}
                                                        </button>
                                                        {currentUser?._id !== user._id && (
                                                            <button onClick={() => handleDelete(user._id)} className="w-full flex items-center gap-3 text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors">
                                                                <FiTrash2 size={15}/> {t('user_management.user_list.actions.delete_user')}
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                        <Pagination />
                    </>
                )}
            </div>
            {isEditModalOpen && (
                <EditUserModal user={selectedUser} onClose={() => setIsEditModalOpen(false)} onSave={handleUpdateUser} />
            )}
            {isPermissionsModalOpen && (
                <ManagePermissionsModal user={selectedUser} onClose={() => setIsPermissionsModalOpen(false)} onSave={handleUpdateUser} />
            )}
        </>
    );
};

export default UserList;