// src/pages/Dashboard/Categories/components/AddProduct/steps/Step2.jsx
import React from 'react';
import { useDashboardLanguage } from '../../../../../../context/DashboardLanguageContext';
import { Package, FileText, Ruler, Tag } from 'lucide-react'; // --- MODIFICATION: Icons imported ---

// --- MODIFICATION: The <label> element is now a flex container ---
const InputGroup = React.forwardRef(({ label, children, error }, ref) => (
    <div ref={ref} className="flex flex-col">
        <label className="mb-2 font-semibold text-sm text-gray-700 flex items-center gap-2">
            {label}
        </label>
        {children}
        {error && <p className="mt-1.5 text-xs text-red-600 font-semibold">{error}</p>}
    </div>
));

const Step2 = ({
    name, setName, description, setDescription, price, setPrice, currency, setCurrency, height, setHeight, errors,
    nameRef, descriptionRef, priceRef
}) => {
    const { t } = useDashboardLanguage();

    return (
        <div className="flex flex-col gap-6 p-1">
            {/* --- MODIFICATION: Label now includes an icon --- */}
            <InputGroup 
                ref={nameRef} 
                label={<><Package size={16} className="text-gray-500" /> {t('collections.addProductModal.nameLabel')}</>} 
                error={errors.name}
            >
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={t('collections.addProductModal.namePlaceholder')} required className={`w-full p-3 border rounded-lg text-sm text-gray-800 bg-gray-50 transition-colors focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none ${!!errors.name ? 'border-red-500 ring-red-500/20' : 'border-gray-300'}`} />
            </InputGroup>

            {/* --- MODIFICATION: Label now includes an icon --- */}
            <InputGroup 
                ref={descriptionRef} 
                label={<><FileText size={16} className="text-gray-500" /> {t('collections.addProductModal.descriptionLabel')}</>} 
                error={errors.description}
            >
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder={t('collections.addProductModal.descriptionPlaceholder')}
                    className={`w-full p-3 border rounded-lg text-sm text-gray-800 bg-gray-50 transition-colors focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none min-h-[160px] resize-y ${!!errors.description ? 'border-red-500 ring-red-500/20' : 'border-gray-300'}`}
                />
            </InputGroup>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* --- MODIFICATION: Label now includes an icon --- */}
                <InputGroup label={<><Ruler size={16} className="text-gray-500" /> {t('collections.addProductModal.heightLabel')}</>}>
                    <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder={t('collections.addProductModal.heightPlaceholder')} className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-800 bg-gray-50 transition-colors focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none" />
                </InputGroup>
                
                {/* --- MODIFICATION: Label now includes an icon --- */}
                <InputGroup 
                    ref={priceRef} 
                    label={<><Tag size={16} className="text-gray-500" /> {t('collections.addProductModal.priceLabel')}</>} 
                    error={errors.price}
                >
                    <div className="flex items-center gap-2">
                        <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder={t('collections.addProductModal.pricePlaceholder')} required className={`flex-grow p-3 border rounded-lg text-sm text-gray-800 bg-gray-50 transition-colors focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none ${!!errors.price ? 'border-red-500 ring-red-500/20' : 'border-gray-300'}`} />
                        <select value={currency} onChange={e => setCurrency(e.target.value)} className={`flex-shrink-0 p-3 border rounded-lg text-sm text-gray-800 bg-gray-50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none ${!!errors.price ? 'border-red-500' : 'border-gray-300'}`}>
                            <option value="DZD">DZD</option>
                            <option value="EUR">EUR</option>
                            <option value="USD">USD</option>
                        </select>
                    </div>
                </InputGroup>
            </div>
        </div>
    );
};

export default Step2;