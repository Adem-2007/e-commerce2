// src/pages/Dashboard/UserManage/ManagePermissionsModal.jsx

import React, { useState } from 'react';
import { FiX, FiLoader, FiCheckSquare, FiAlertTriangle } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import { navigationConfig } from './navigationConfig';
import { useDashboardLanguage } from '../../../context/DashboardLanguageContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const ManagePermissionsModal = ({ user, onClose, onSave }) => {
  const [selectedPermissions, setSelectedPermissions] = useState(new Set(user.permissions || []));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuth();
  const { t } = useDashboardLanguage();

  const allNavItems = navigationConfig.flatMap(section => section.items);

  // --- FIX: Centralized logic to generate the correct translation key from a nav item label ---
  const generateTranslationKey = (label) => {
    const keyMap = {
      'Brand Identity': 'logo_control',
      'User Management': 'user_manage',
      'Home Control': 'hero_control',
      'Categories & Products': 'categories_products'
    };
    const mappedKey = keyMap[label];
    if (mappedKey) return mappedKey;
    return label.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_');
  };

  const handleCheckboxChange = (path) => {
    setSelectedPermissions(prev => {
      const newPermissions = new Set(prev);
      if (newPermissions.has(path)) {
        newPermissions.delete(path);
      } else {
        newPermissions.add(path);
      }
      return newPermissions;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    const permissionsArray = Array.from(selectedPermissions);

    try {
        const res = await fetch(`${API_BASE_URL}/api/users/${user._id}/permissions`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ permissions: permissionsArray }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || t('user_management.permissions_modal.messages.error_default'));
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
        <div className="p-6 text-center border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">{t('user_management.permissions_modal.title')}</h2>
          <p className="text-slate-500 mt-1">
            {t('user_management.permissions_modal.subtitle')} <span className="font-semibold text-blue-600">{user.name}</span>
          </p>
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
          {allNavItems.map(item => (
            <label key={item.path} className="flex items-center p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors has-[:checked]:bg-blue-50 has-[:checked]:border-blue-400">
              <input
                type="checkbox"
                checked={selectedPermissions.has(item.path)}
                onChange={() => handleCheckboxChange(item.path)}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="ml-4 flex flex-col">
                {/* --- FIX: Applied translation function with the correct key --- */}
                <span className="font-semibold text-slate-800">{t(`navigation.${generateTranslationKey(item.label)}`, item.label)}</span>
                <span className="text-xs text-slate-500">{item.path}</span>
              </div>
            </label>
          ))}
        </div>

        {error && <div className="px-6 pb-2 flex items-center gap-2 text-red-700 text-sm"><FiAlertTriangle /> <span>{error}</span></div>}

        <div className="p-5 bg-slate-50/70 border-t border-slate-200 flex justify-end gap-3">
          <button type="button" onClick={onClose} disabled={loading} className="px-5 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50">{t('user_management.common.cancel')}</button>
          <button onClick={handleSave} disabled={loading} className="px-5 py-2 flex items-center justify-center text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 disabled:bg-blue-300">
            {loading ? <FiLoader className="animate-spin" /> : <><FiCheckSquare className="mr-2" />{t('user_management.common.save_changes')}</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagePermissionsModal;