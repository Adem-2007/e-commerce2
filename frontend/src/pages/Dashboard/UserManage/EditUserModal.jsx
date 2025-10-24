// src/pages/Dashboard/UserManage/EditUserModal.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { FiX, FiUser, FiMail, FiLock, FiShield, FiLoader, FiAlertTriangle } from 'react-icons/fi';
import { useDashboardLanguage } from '../../../context/DashboardLanguageContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const EditUserModal = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({ name: '', email: '', role: 'pager', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { token } = useAuth();
    const { t } = useDashboardLanguage();

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                role: user.role || 'pager',
                password: '',
            });
        }
    }, [user]);

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const payload = { name: formData.name, email: formData.email, role: formData.role };
        if (formData.password) {
            payload.password = formData.password;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/users/${user._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || t('user_management.edit_modal.messages.error_default'));
            onSave(data);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg m-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 sm:p-8 text-center border-b border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800">{t('user_management.edit_modal.title')}</h2>
                    <p className="text-slate-500 mt-1">
                        {t('user_management.edit_modal.subtitle')} <span className="font-semibold text-blue-600">{user.name}</span>
                    </p>
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"><FiX size={20} /></button>
                </div>

                <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-4 max-h-[75vh] overflow-y-auto">
                    <div className="relative"><FiUser className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400"/><input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder={t('user_management.user_form.labels.full_name')} required className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                    <div className="relative"><FiMail className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400"/><input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder={t('user_management.user_form.labels.email')} required className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                    <div className="relative"><FiLock className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400"/><input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder={t('user_management.edit_modal.labels.password_placeholder')} className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                    <div className="relative"><FiShield className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400"/><select name="role" value={formData.role} onChange={handleInputChange} required className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 outline-none bg-white"><option value="pager">{t('user_management.roles.pager')}</option><option value="creator">{t('user_management.roles.creator')}</option><option value="admin">{t('user_management.roles.admin')}</option></select></div>
                    
                    {error && <div className="flex items-center gap-2 bg-red-100 text-red-700 p-3 rounded-lg text-sm"><FiAlertTriangle /> <span>{error}</span></div>}

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} disabled={loading} className="px-5 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50">{t('user_management.common.cancel')}</button>
                        <button type="submit" disabled={loading} className="px-5 py-2 flex items-center justify-center text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 disabled:bg-blue-300">
                            {loading ? <FiLoader className="animate-spin" /> : t('user_management.common.save_changes')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;