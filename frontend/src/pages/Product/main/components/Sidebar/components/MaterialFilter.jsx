import React from 'react';

const MaterialFilter = ({ availableMaterials, selectedMaterials, onMaterialToggle, t }) => (
    <div className="py-6">
        <h3 className="text-base font-semibold text-gray-800 mb-4">{t('materials')}</h3>
        <div className="flex flex-wrap gap-2">
            {availableMaterials?.map(material => (
                <button 
                    key={material} 
                    onClick={() => onMaterialToggle(material)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-all duration-200 ${
                        selectedMaterials.includes(material) 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:text-blue-600'
                    }`}
                >
                    {material}
                </button>
            ))}
        </div>
    </div>
);

export default MaterialFilter;