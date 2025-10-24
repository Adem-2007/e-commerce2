// frontend/src/components/dashboard/EditProfileModal.jsx

import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDashboardLanguage } from '../../context/DashboardLanguageContext'; // Use the new context hook
import { FiX, FiUser, FiMail, FiCamera, FiLoader, FiAlertTriangle, FiUploadCloud } from 'react-icons/fi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const EditProfileModal = ({ onClose, onSave }) => {
    const { user, token } = useAuth();
    const { t } = useDashboardLanguage(); // Use the new context hook
    const [formData, setFormData] = useState({ name: user.name || '', email: user.email || '' });
    const [avatarPreview, setAvatarPreview] = useState(user.avatar || null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
                setAvatarFile(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const payload = { ...formData };
        if (avatarFile && avatarFile !== user.avatar) {
            payload.avatar = avatarFile;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/users/me`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to update profile.');
            onSave(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md m-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 text-center border-b border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800">{t('edit_profile_title')}</h2>
                    <p className="text-slate-500 mt-1">{t('edit_profile_desc')}</p>
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"><FiX size={20} /></button>
                </div>

                <form onSubmit={handleSave} className="p-6 space-y-5">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <img src={avatarPreview || `https://i.pravatar.cc/150?u=${user.email}`} alt="Avatar Preview" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" />
                            <button type="button" onClick={() => fileInputRef.current.click()} className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 shadow-md">
                                <FiCamera size={16} />
                            </button>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                        <button type="button" onClick={() => fileInputRef.current.click()} className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800">
                           <FiUploadCloud size={16} /> {t('change_photo')}
                        </button>
                    </div>

                    <div className="relative">
                        <FiUser className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400"/>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder={t('full_name_placeholder')} required className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div className="relative">
                        <FiMail className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400"/>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder={t('email_address_placeholder')} required className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    
                    {error && <div className="flex items-center gap-2 bg-red-100 text-red-700 p-3 rounded-lg text-sm"><FiAlertTriangle /> <span>{error}</span></div>}

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} disabled={loading} className="px-5 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50">{t('cancel')}</button>
                        <button type="submit" disabled={loading} className="px-5 py-2 w-32 flex items-center justify-center text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 disabled:bg-blue-300">
                            {loading ? <FiLoader className="animate-spin" /> : t('save_changes')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;