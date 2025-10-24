import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CATEGORIES_API_URL } from '../../../../api/api';
import { AlertTriangle } from 'lucide-react';
import CategoriesSectionSkeleton from './CategoriesSectionSkeleton';

const getButtonClasses = (textColor) => {
    if (textColor === 'text-white') {
        return 'bg-white hover:bg-gray-200 text-black';
    }
    return 'bg-red-600 hover:bg-red-700 text-white';
};

const ProductCard = ({
  category,
  title,
  imageUrl,
  bgColor,
  textColor,
  gridClasses,
}) => {
  const imageClasses = gridClasses?.includes('col-span-2')
    ? 'w-1/2 max-w-[200px] lg:max-w-[250px]'
    : 'w-3/5 max-w-[150px] lg:max-w-[180px]';

  return (
    <div
        className={`relative overflow-hidden rounded-3xl p-6 md:p-8 flex flex-col justify-between transition-transform duration-300 ease-in-out hover:scale-105 h-48 md:h-64 ${gridClasses} ${textColor}`}
        style={{ backgroundColor: bgColor }}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          decoding="async"
          className={`absolute top-1/2 right-0 transform -translate-y-1/2 h-auto object-contain ${imageClasses}`}
        />
      )}
      <div className="relative z-10">
        <p className="font-light text-sm md:text-base">{category}</p>
        <h3 className="font-bold text-2xl md:text-3xl mt-1">{title}</h3>
      </div>
      <div className="relative z-10">
        <button className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase transition-all duration-300 ${getButtonClasses(textColor)}`}>
          Browse
        </button>
      </div>
    </div>
  );
};

const CategoriesSection = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setError(null);
                const response = await axios.get(CATEGORIES_API_URL);
                setCategories(response.data.slice(0, 6));
            } catch (err) {
                setError('Failed to load categories. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) {
        return <CategoriesSectionSkeleton />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-10 font-sans">
                <div className="text-center p-10 bg-red-50 rounded-lg shadow-md">
                    <AlertTriangle className="mx-auto text-red-500" size={40} />
                    <p className="mt-4 font-semibold text-red-700">{error}</p>
                </div>
            </div>
        );
    }

    const gridRowCount = categories.length <= 4 ? 1 : 2;
    const gridContainerHeightClass = gridRowCount === 1 ? 'h-auto' : 'lg:h-[700px]';

    return (
        <div className="h-full flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans">
            <div className="w-full max-w-7xl">
                {/* ---------- ADDED TITLE AND DESCRIPTION ---------- */}
                <div className="mb-10 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">CATEGORIES</h2>
                    <p className="mt-2 text-lg text-gray-500">Discover our categories</p>
                </div>
                {/* ------------------------------------------------- */}
                <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 ${gridContainerHeightClass}`}>
                    {categories.map((category) => (
                        <ProductCard
                            key={category._id}
                            category={category.cardSubtitle}
                            title={category.cardTitle}
                            imageUrl={category.imageUrl}
                            bgColor={category.cardBgColor}
                            textColor={category.cardTextColor}
                            gridClasses={category.cardGridClasses}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoriesSection;