// src/pages/Dashboard/UserManage/UserManagePage.jsx

import React, { useState } from 'react';
import UserForm from './UserForm';
import UserList from './UserList';
import { FiUserPlus, FiUsers } from 'react-icons/fi';
import { useDashboardLanguage } from '../../../context/DashboardLanguageContext';

const UserManagePage = () => {
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'form'
  const { t, dir } = useDashboardLanguage(); // Get language direction 'ltr' or 'rtl'

  // This logic now handles both LTR and RTL directions for the sliding animation
  const sliderClasses =
    dir === 'rtl'
      ? `absolute right-1 top-1 h-[calc(100%-8px)] rounded-full bg-blue-600 shadow-md transition-transform duration-300 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)] ${
          activeTab === 'list'
            ? 'w-[140px] sm:w-[150px] translate-x-0'
            : 'w-[150px] sm:w-[160px] -translate-x-[136px] sm:-translate-x-[146px]'
        }`
      : `absolute left-1 top-1 h-[calc(100%-8px)] rounded-full bg-blue-600 shadow-md transition-transform duration-300 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)] ${
          activeTab === 'list'
            ? 'w-[140px] sm:w-[150px] translate-x-0'
            : 'w-[150px] sm:w-[160px] translate-x-[136px] sm:translate-x-[146px]'
        }`;

  return (
    <div className="min-h-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="max-w-7xl mx-auto">
        {/* --- PAGE HEADER --- */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight">{t('user_management.header_title')}</h1>
          <p className="text-base text-slate-500 mt-2 max-w-2xl mx-auto">{t('user_management.header_subtitle')}</p>
        </div>

        {/* --- CORRECTED & RESPONSIVE TAB SWITCHER --- */}
        <div className="flex justify-center mb-8 sm:mb-10">
          <div className="relative flex items-center bg-slate-200/60 p-1 rounded-full">
            <span className={sliderClasses} />
            
            {/* --- "Manage Users" Button --- */}
            <button
              onClick={() => setActiveTab('list')}
              className={`relative z-10 flex items-center justify-center w-[140px] sm:w-[150px] px-3 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
                // FIX: Active text is white, Inactive text is dark gray (slate-600)
                activeTab === 'list' ? 'text-white' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <FiUsers className="mr-2" />
              {t('user_management.tabs.manage_users')}
            </button>
            
            {/* --- "Add New User" Button --- */}
            <button
              onClick={() => setActiveTab('form')}
              className={`relative z-10 flex items-center justify-center w-[150px] sm:w-[160px] px-3 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
                // FIX: Active text is white, Inactive text is dark gray (slate-600)
                activeTab === 'form' ? 'text-white' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <FiUserPlus className="mr-2" />
              {t('user_management.tabs.add_new_user')}
            </button>
          </div>
        </div>

        {/* --- CONTENT PANELS --- */}
        <div className="relative">
            {activeTab === 'list' ? <UserList key="list" /> : <UserForm key="form" />}
        </div>
      </div>
    </div>
  );
};

export default UserManagePage;