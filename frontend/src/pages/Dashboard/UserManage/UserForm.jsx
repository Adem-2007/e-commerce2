// src/pages/Dashboard/UserManage/UserForm.jsx

import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { FiMail, FiLock, FiUserCheck, FiArrowRight, FiUser, FiLoader, FiCheckCircle, FiAlertTriangle, FiShield } from 'react-icons/fi';
import { useDashboardLanguage } from '../../../context/DashboardLanguageContext';
import { navigationConfig } from './navigationConfig'; // Import navigation config

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Helper to get default permissions for a role, mirroring the backend logic
const getInitialPermissionsForRole = (role) => {
    const creatorPermissions = ['/dashboard', '/dashboard/orders', '/dashboard/categories-products'];
    const pagerPermissions = ['/dashboard/hero-control', '/dashboard/info-control', '/dashboard/footer-control', '/dashboard/logo-control'];
    const adminPermissions = [
        ...creatorPermissions,
        ...pagerPermissions,
        '/dashboard/delivery-costs',
        '/dashboard/social-media',
        '/dashboard/user-manage',
        '/dashboard/messages',
    ];

    switch (role) {
        case 'admin': return adminPermissions;
        case 'creator': return creatorPermissions;
        case 'pager': return pagerPermissions;
        default: return []; // A new user with no role selected has no pages
    }
};

const UserForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'pager' });
  const [selectedPermissions, setSelectedPermissions] = useState(new Set(getInitialPermissionsForRole('pager')));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
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

  const handlePermissionChange = (path) => {
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

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setFormData({ ...formData, role: newRole });
    setSelectedPermissions(new Set(getInitialPermissionsForRole(newRole)));
  };
  
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    const payload = {
        ...formData,
        permissions: Array.from(selectedPermissions)
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || t('user_management.user_form.messages.error_default'));
      setMessage({ type: 'success', text: t('user_management.user_form.messages.success') });
      setFormData({ name: '', email: '', password: '', role: 'pager' });
      setSelectedPermissions(new Set(getInitialPermissionsForRole('pager')));
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const fullNameLabel = t('user_management.user_form.labels.full_name');
  const emailLabel = t('user_management.user_form.labels.email');
  const passwordLabel = t('user_management.user_form.labels.password');

  return (
    <div className="max-w-xl mx-auto animate-fade-in-up">
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">
        <div className="text-center">
            <h2 className="text-2xl font-semibold text-slate-800">{t('user_management.user_form.title')}</h2>
            <p className="text-slate-500 mt-1">{t('user_management.user_form.subtitle')}</p>
        </div>

        {/* --- FORM INPUTS --- */}
        <div className="space-y-5">
            <div className="relative">
                <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className="peer w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg text-slate-800 placeholder-transparent focus:outline-none focus:border-blue-500 transition-colors" placeholder={fullNameLabel} />
                <label htmlFor="name" className="absolute left-4 -top-2.5 text-sm text-slate-500 bg-white px-1 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600">{fullNameLabel}</label>
            </div>
            <div className="relative">
                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className="peer w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg text-slate-800 placeholder-transparent focus:outline-none focus:border-blue-500 transition-colors" placeholder={emailLabel} />
                <label htmlFor="email" className="absolute left-4 -top-2.5 text-sm text-slate-500 bg-white px-1 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600">{emailLabel}</label>
            </div>
            <div className="relative">
                <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} required className="peer w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg text-slate-800 placeholder-transparent focus:outline-none focus:border-blue-500 transition-colors" placeholder={passwordLabel} />
                <label htmlFor="password" className="absolute left-4 -top-2.5 text-sm text-slate-500 bg-white px-1 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600">{passwordLabel}</label>
            </div>
        </div>
        
        {/* --- ROLE SELECTOR --- */}
        <div>
           <h3 className="text-base font-medium text-slate-600 mb-3 text-center"><FiUserCheck className="mr-2 inline-block"/>{t('user_management.user_form.assign_role_title')}</h3>
           <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                  {val: 'pager', desc: t('user_management.user_form.role_descs.pager')}, 
                  {val: 'creator', desc: t('user_management.user_form.role_descs.creator')}, 
                  {val: 'admin', desc: t('user_management.user_form.role_descs.admin')}
              ].map(({val, desc}) => (
                  <label key={val} className="relative cursor-pointer">
                    <input type="radio" name="role" value={val} checked={formData.role === val} onChange={handleRoleChange} className="sr-only peer" />
                    <div className="text-center p-3 border-2 border-slate-200 rounded-lg peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:shadow-sm transition-all">
                        <p className="font-semibold text-slate-700 capitalize text-sm sm:text-base">{t(`user_management.roles.${val}`)}</p>
                        <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">{desc}</p>
                    </div>
                  </label>
              ))}
           </div>
        </div>

        {/* --- PERMISSIONS CHECKBOXES --- */}
        <div>
          <h3 className="text-base font-medium text-slate-600 mb-3 text-center"><FiShield className="mr-2 inline-block"/>Customize Page Access</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto p-2 bg-slate-50 rounded-lg border">
            {allNavItems.map(item => (
              <label key={item.path} className="flex items-center p-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors has-[:checked]:bg-blue-50 has-[:checked]:border-blue-400">
                <input
                  type="checkbox"
                  checked={selectedPermissions.has(item.path)}
                  onChange={() => handlePermissionChange(item.path)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {/* --- FIX: Applied translation function with the correct key --- */}
                <span className="ml-3 font-medium text-slate-700 text-sm">{t(`navigation.${generateTranslationKey(item.label)}`, item.label)}</span>
              </label>
            ))}
          </div>
        </div>

        {message.text && (
            <div className={`p-3 rounded-lg flex items-center text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {message.type === 'success' ? <FiCheckCircle className="mr-2"/> : <FiAlertTriangle className="mr-2"/>}
                {message.text}
            </div>
        )}

        <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 px-4 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:bg-slate-400 disabled:cursor-not-allowed">
          {loading ? <FiLoader className="animate-spin" /> : <>{t('user_management.user_form.submit_button')} <FiArrowRight /></>}
        </button>
      </form>
    </div>
  );
};

export default UserForm;