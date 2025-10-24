// frontend/src/components/dashboard/DashboardLayout.jsx

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'; // <-- THIS LINE WAS MISSING
import { useDashboardLanguage } from '../../context/DashboardLanguageContext';
import Sidebar from './Sidebar';
import ProfileDropdown from './ProfileDropdown';
import DashboardLanguageDropdown from './DashboardLanguageDropdown';
import MessagesNotification from './MessagesNotification';

const DashboardLayout = () => {
  const { dir } = useDashboardLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  return (
    <div className="bg-gray-100" dir={dir}>
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
        ></div>
      )}

      <div className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ltr:ml-64 rtl:mr-64' : 'ltr:ml-20 rtl:mr-20'}`}>
        <div className="flex flex-col h-screen">
            <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
                <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                    <div className="flex-1"></div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <MessagesNotification />
                        <DashboardLanguageDropdown />
                        <ProfileDropdown />
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
                <Outlet /> 
            </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;