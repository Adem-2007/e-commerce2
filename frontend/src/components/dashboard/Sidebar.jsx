// frontend/src/components/dashboard/Sidebar.jsx

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDashboardLanguage } from '../../context/DashboardLanguageContext';
import {
  Home,
  LogOut,
  LayoutGrid,
  ChevronsLeft
} from 'lucide-react';
import { navigationConfig } from '../../pages/Dashboard/UserManage/navigationConfig';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { t } = useDashboardLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

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

  const navLinkClasses = ({ isActive }) =>
    `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 group relative ${
      isActive
        ? 'bg-blue-600 text-white shadow-sm'
        : 'text-gray-700 hover:bg-gray-100'
    }`;

  const NavItem = ({ to, icon: Icon, label, end }) => (
    <NavLink to={to} end={end} className={navLinkClasses}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className={`overflow-hidden transition-all whitespace-nowrap ${isSidebarOpen ? 'w-auto ltr:ml-3 rtl:mr-3' : 'w-0'}`}>
        {label}
      </span>
      {!isSidebarOpen && (
        <div className="absolute ltr:left-full rtl:right-full rounded-md px-2 py-1 ltr:ml-4 rtl:mr-4 bg-gray-800 text-white text-xs invisible opacity-20 ltr:-translate-x-3 rtl:translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0">
          {label}
        </div>
      )}
    </NavLink>
  );

  return (
    <aside className={
      `bg-white ltr:border-r rtl:border-l border-gray-200 flex flex-col flex-shrink-0
      transition-all duration-300 ease-in-out z-40
      fixed inset-y-0 ltr:left-0 rtl:right-0
      ${isSidebarOpen ? 'w-64' : 'w-20'}`
    }>
      <div className={`px-6 py-5 flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
        <div className={`flex items-center overflow-hidden ${!isSidebarOpen && 'w-0 opacity-0'}`}>
          <LayoutGrid className="w-6 h-6 ltr:mr-3 rtl:ml-3 text-gray-800" />
          <h1 className="text-xl font-bold text-gray-900 whitespace-nowrap">{t('dashboard')}</h1>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
           <ChevronsLeft size={20} className={`transition-transform duration-300 text-gray-700 ${!isSidebarOpen && 'rotate-180'} rtl:rotate-180`}/>
        </button>
      </div>

      <div className="border-t border-gray-200 mx-4"></div>

      <nav className={`flex-1 px-4 mt-4 space-y-2 ${
        isSidebarOpen ? 'overflow-y-auto' : 'overflow-visible'
      }`}>
        {user && user.permissions && navigationConfig
          .flatMap(section => section.items)
          // --- MODIFICATION START ---
          // This filter now correctly shows items if the user is an admin OR has the specific permission.
          .filter(item => user.role === 'admin' || user.permissions.includes(item.path))
          // --- MODIFICATION END ---
          .map(item => (
            <NavItem
              key={item.path}
              to={item.path}
              icon={item.icon}
              label={t(`navigation.${generateTranslationKey(item.label)}`) || item.label}
              end={item.path === '/dashboard'}
            />
          ))
        }
      </nav>

      <div className="p-4 border-t border-gray-200 space-y-2">
         <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 group relative text-gray-700 hover:bg-gray-100"
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            <span className={`overflow-hidden transition-all whitespace-nowrap ${isSidebarOpen ? 'w-auto ltr:ml-3 rtl:mr-3' : 'w-0'}`}>
              {t('back_to_site')}
            </span>
            {!isSidebarOpen && (
              <div className="absolute ltr:left-full rtl:right-full rounded-md px-2 py-1 ltr:ml-4 rtl:mr-4 bg-gray-800 text-white text-xs invisible opacity-20 ltr:-translate-x-3 rtl:translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0">
                {t('back_to_site')}
              </div>
            )}
         </a>
         <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 group relative">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className={`overflow-hidden transition-all whitespace-nowrap ${isSidebarOpen ? 'w-auto ltr:ml-3 rtl:mr-3' : 'w-0'}`}>
              {t('logout')}
            </span>
             {!isSidebarOpen && (
              <div className="absolute ltr:left-full rtl:right-full rounded-md px-2 py-1 ltr:ml-4 rtl:mr-4 bg-gray-800 text-white text-xs invisible opacity-20 ltr:-translate-x-3 rtl:translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0">
                {t('logout')}
              </div>
            )}
         </button>
      </div>
    </aside>
  );
};

export default Sidebar;