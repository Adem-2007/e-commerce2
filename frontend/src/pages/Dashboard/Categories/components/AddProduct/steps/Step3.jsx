// src/pages/Dashboard/Categories/components/AddProduct/steps/Step3.jsx
import React from 'react';
import { User, Baby, Plus, X, Users, Layers, Component, Palette, Ruler } from 'lucide-react';
import { useDashboardLanguage } from '../../../../../../context/DashboardLanguageContext';

const InputGroup = React.forwardRef(({ label, children, error }, ref) => (
    <div ref={ref} className="flex flex-col">
        <label className="mb-2 font-semibold text-sm text-gray-700 flex items-center gap-2">{label}</label>
        {children}
        {error && <p className="mt-1.5 text-xs text-red-600 font-semibold">{error}</p>}
    </div>
));

const GENDERS_CONFIG = [
    { key: 'man', icon: User },
    { key: 'woman', icon: User },
    { key: 'baby', icon: Baby }
];

const Step3 = ({
    selectedGenders, handleGenderToggle, errors, genderRef,
    categories, selectedCategoryId, setSelectedCategoryId, categoryRef,
    materials, materialInput, setMaterialInput, handleAddMaterial, handleRemoveMaterial, materialsRef,
    selectedColors, colorInput, setColorInput, handleAddColor, handleRemoveColor, colorsRef,
    selectedSizes, sizeInput, setSizeInput, handleAddSize, handleRemoveSize
}) => {
    const { t } = useDashboardLanguage();
    const GENDERS = GENDERS_CONFIG.map(g => {
        const labelText = g.key.charAt(0).toUpperCase() + g.key.slice(1);
        const translationKey = `collections.addProductModal.gender${labelText}`;
        return { ...g, label: t(translationKey, labelText) };
    });

    return (
        <div className="flex flex-col gap-6 p-1">
            <InputGroup 
                ref={genderRef} 
                label={<><Users size={16} className="text-gray-500" /> {t('collections.addProductModal.genderLabel')}</>} 
                error={errors.gender}
            >
                <div className={`grid grid-cols-3 gap-2 border bg-gray-100 p-1 rounded-lg transition-colors ${!!errors.gender ? 'border-red-500' : 'border-gray-200'}`}>
                    {GENDERS.map(({ key, label, icon: Icon }) => (
                        <button
                            type="button"
                            key={key}
                            onClick={() => handleGenderToggle(key)}
                            className={`flex items-center justify-center gap-2 p-2 font-semibold text-sm rounded-md transition-all duration-200 ${selectedGenders.includes(key) ? 'bg-white text-teal-600 shadow-sm -translate-y-px' : 'text-gray-600 hover:bg-gray-200'}`}
                        >
                            <Icon size={16} /> {label}
                        </button>
                    ))}
                </div>
            </InputGroup>

            <InputGroup 
                ref={categoryRef} 
                label={<><Layers size={16} className="text-gray-500" /> {t('collections.addProductModal.categoryLabel')}</>} 
                error={errors.category}
            >
                {/* --- MODIFIED SELECT ELEMENT --- */}
                <select value={selectedCategoryId} onChange={e => setSelectedCategoryId(e.target.value)} className={`w-full p-3 border rounded-lg text-sm text-gray-800 bg-gray-50 transition-colors focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none appearance-none bg-no-repeat bg-right-3 ${!!errors.category ? 'border-red-500 ring-red-500/20' : 'border-gray-300'} ${!selectedCategoryId ? 'text-gray-500' : ''}`} style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundSize: '1.2em 1.2em' }}>
                    {/* Added a disabled placeholder option */}
                    <option value="" disabled>
                        {t('collections.addProductModal.selectCategoryPlaceholder', 'Select a category...')}
                    </option>
                    {categories?.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                </select>
                {/* --- END OF MODIFICATION --- */}
            </InputGroup>

            <InputGroup 
                ref={materialsRef} 
                label={<><Component size={16} className="text-gray-500" /> {t('collections.addProductModal.materialsLabel')}</>} 
                error={errors.materials}
            >
                <div className="flex gap-2">
                    <input type="text" value={materialInput} onChange={e => setMaterialInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddMaterial())} placeholder={t('collections.addProductModal.materialsPlaceholder')} className={`flex-grow p-3 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none ${!!errors.materials ? 'border-red-500 ring-red-500/20' : 'border-gray-300'}`} />
                    <button type="button" onClick={handleAddMaterial} className="flex-shrink-0 px-4 bg-gray-800 text-white font-semibold rounded-lg text-sm transition-colors hover:bg-gray-900"><Plus size={16} /></button>
                </div>
                <div className={`flex flex-wrap gap-2 mt-3 pt-3 border-t ${materials.length > 0 ? 'border-gray-100' : 'border-transparent'}`}>
                    {materials.map(m => <span key={m} className="flex items-center gap-2 bg-gray-800 text-white text-xs font-medium px-3 py-1.5 rounded-full">{m} <button type="button" onClick={() => handleRemoveMaterial(m)} className="bg-white/20 rounded-full w-4 h-4 flex items-center justify-center transition-colors hover:bg-red-500"><X size={10} /></button></span>)}
                </div>
            </InputGroup>

            <InputGroup 
                ref={colorsRef} 
                label={<><Palette size={16} className="text-gray-500" /> {t('collections.addProductModal.colorsLabel')}</>} 
                error={errors.colors}
            >
                <div className="flex gap-2">
                    <input type="color" value={colorInput} onChange={e => setColorInput(e.target.value)} className={`flex-grow w-full h-12 p-1 border rounded-lg cursor-pointer bg-gray-50 ${!!errors.colors ? 'border-red-500' : 'border-gray-300'}`} />
                    <button type="button" onClick={handleAddColor} className="flex-shrink-0 px-4 bg-gray-800 text-white font-semibold rounded-lg text-sm transition-colors hover:bg-gray-900"><Plus size={16} /></button>
                </div>
                <div className={`flex flex-wrap gap-2 mt-3 pt-3 border-t ${selectedColors.length > 0 ? 'border-gray-100' : 'border-transparent'}`}>
                    {selectedColors.map(hex => (
                        <span key={hex} className="flex items-center gap-2 bg-gray-100 text-gray-800 text-xs font-medium pl-2 pr-1 py-1 rounded-full border border-gray-200">
                            <span style={{ backgroundColor: hex }} className="w-4 h-4 rounded-full border border-gray-300/50"></span> {hex}
                            <button type="button" onClick={() => handleRemoveColor(hex)} className="bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center transition-colors hover:bg-red-500 hover:text-white"><X size={10} /></button>
                        </span>
                    ))}
                </div>
            </InputGroup>

            <InputGroup label={<><Ruler size={16} className="text-gray-500" /> {t('collections.addProductModal.sizesLabel')}</>}>
                <div className="flex gap-2">
                    <input type="text" value={sizeInput} onChange={e => setSizeInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSize())} placeholder={t('collections.addProductModal.sizesPlaceholder')} className="flex-grow p-3 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none" />
                    <button type="button" onClick={handleAddSize} className="flex-shrink-0 px-4 bg-gray-800 text-white font-semibold rounded-lg text-sm transition-colors hover:bg-gray-900"><Plus size={16} /></button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
                    {selectedSizes.map(s => <span key={s} className="flex items-center gap-2 bg-gray-800 text-white text-xs font-medium px-3 py-1.5 rounded-full">{s} <button type="button" onClick={() => handleRemoveSize(s)} className="bg-white/20 rounded-full w-4 h-4 flex items-center justify-center transition-colors hover:bg-red-500"><X size={10} /></button></span>)}
                </div>
            </InputGroup>
        </div>
    );
};

export default Step3;