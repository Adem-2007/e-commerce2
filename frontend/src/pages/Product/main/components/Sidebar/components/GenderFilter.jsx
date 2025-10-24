import React from 'react';
import { User, UserPlus, Baby } from 'lucide-react';

const GenderFilter = ({ selectedGender, onGenderChange, t }) => {
    const GENDERS = [
        { key: 'man', label: t('gender_man'), icon: User },
        { key: 'female', label: t('gender_female'), icon: UserPlus },
        { key: 'baby', label: t('gender_baby'), icon: Baby }
    ];

    return (
        <div className="py-6 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-800 mb-4">{t('gender')}</h3>
            <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-lg">
                {GENDERS.map(({ key, label, icon: Icon }) => (
                    <button 
                        key={key} 
                        onClick={() => onGenderChange(prev => prev === key ? '' : key)}
                        className={`flex items-center justify-center gap-2 p-2 text-sm font-semibold rounded-md transition-all duration-200 ${
                            selectedGender === key 
                            ? 'bg-white text-blue-600 shadow-sm' 
                            : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <Icon size={16} />
                        <span>{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default GenderFilter;