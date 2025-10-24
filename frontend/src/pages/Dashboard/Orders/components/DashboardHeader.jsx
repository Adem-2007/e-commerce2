// src/pages/Dashboard/Orders/components/DashboardHeader.jsx

import React, { useState, useEffect, useRef } from 'react';
import { FiDownload, FiCalendar, FiList, FiGrid, FiChevronDown } from 'react-icons/fi'; // MODIFIED: Replaced lucide-react with react-icons
import { DateRangePicker } from 'react-date-range';
import { subDays, format } from 'date-fns';
import { useDashboardLanguage } from '../../../../context/DashboardLanguageContext';
import { statusConfig } from './StatusBadge';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const DashboardHeader = ({ onDateChange, onDownload, currentView, onToggleView }) => {
    const { t, dir } = useDashboardLanguage();
    const [showCalendar, setShowCalendar] = useState(false);
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const [dateRange, setDateRange] = useState([
        {
            startDate: subDays(new Date(), 30),
            endDate: new Date(),
            key: 'selection'
        }
    ]);
    
    const calendarRef = useRef(null);
    const downloadRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) setShowCalendar(false);
            if (downloadRef.current && !downloadRef.current.contains(event.target)) setIsDownloadOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDateSelect = (ranges) => {
        setDateRange([ranges.selection]);
        onDateChange(ranges.selection);
    };

    const handleDownloadSelect = (status) => {
        onDownload(status);
        setIsDownloadOpen(false);
    };

    const formattedDate = `${format(dateRange[0].startDate, "MMM d, yyyy")} - ${format(dateRange[0].endDate, "MMM d, yyyy")}`;
    
    const calendarPositionClass = dir === 'rtl' ? 'right-0' : 'left-0';
    const downloadMenuPositionClass = dir === 'rtl' ? 'left-0' : 'right-0';

    return (
        <div className="p-4 md:p-5 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex-wrap flex items-center gap-4">
                <div className="relative" ref={calendarRef}>
                    <button 
                        className="flex items-center gap-2 w-full sm:w-auto text-left bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50" 
                        onClick={() => setShowCalendar(!showCalendar)}>
                        <FiCalendar size={16} className="text-gray-500" />
                        <span>{formattedDate}</span>
                    </button>
                    {showCalendar && (
                        <div className={`absolute top-full mt-2 z-20 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden ${calendarPositionClass} ${dir === 'rtl' ? '[&_.rdrMonth]:!direction-rtl [&_.rdrDateDisplayWrapper]:!direction-rtl [&_.rdrMonths]:!direction-rtl' : ''}`}>
                            <DateRangePicker
                                onChange={handleDateSelect}
                                showSelectionPreview={true}
                                moveRangeOnFirstSelection={false}
                                months={1}
                                ranges={dateRange}
                                direction="horizontal"
                            />
                        </div>
                    )}
                </div>

                <button 
                    onClick={onToggleView}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    {currentView === 'details' ? <FiGrid size={16} /> : <FiList size={16} />}
                    <span>{currentView === 'details' ? t('summary_view') : t('details_view')}</span>
                </button>
            </div>
            
            <div className="relative" ref={downloadRef}>
                <button 
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors" 
                    onClick={() => setIsDownloadOpen(prev => !prev)}>
                    <FiDownload size={16} />
                    {t('download_excel')}
                    <FiChevronDown size={16} className={`transition-transform ${isDownloadOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDownloadOpen && (
                    <div className={`absolute top-full mt-2 w-60 bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden max-h-80 overflow-y-auto ${downloadMenuPositionClass}`}>
                        {Object.entries(statusConfig).filter(([key]) => key !== 'default').map(([key, config]) => (
                            <button 
                                key={key}
                                onClick={() => handleDownloadSelect(key)} 
                                className={`w-full text-start px-4 py-2 text-sm font-medium hover:bg-gray-100 flex items-center gap-3 ${config.textColor}`}
                            >
                               {config.icon} {t(config.labelKey)}
                            </button>
                        ))}
                        <button onClick={() => handleDownloadSelect('all')} className="w-full text-start px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-gray-100 flex items-center gap-3 border-t border-gray-100">
                           <FiDownload size={16}/> {t('all_orders')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardHeader;