import React, { useState, useEffect, useMemo } from 'react';
import { Play, Maximize } from 'lucide-react';
import ImageModal from './ImageModal'; // Assuming ImageModal is in the same folder
import { useLanguage } from '../../../../../context/LanguageContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const getMediaUrl = (url) => url ? (url.startsWith('data:') ? url : `${API_BASE_URL}${url}`) : null;

const ProductMediaGallery = ({ product }) => {
    const { language, t } = useLanguage();
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const allMedia = useMemo(() => {
        const media = [];
        if (product.imageUrls) {
            media.push({ type: 'image', url: getMediaUrl(product.imageUrls.large), thumbnailUrl: getMediaUrl(product.imageUrls.thumbnail) });
        }
        (product.secondaryImageUrls || []).forEach(img => {
            media.push({ type: 'image', url: getMediaUrl(img.large), thumbnailUrl: getMediaUrl(img.thumbnail) });
        });
        if (product.videoUrl) {
            media.push({ type: 'video', url: getMediaUrl(product.videoUrl) });
        }
        return media;
    }, [product]);
    
    useEffect(() => {
        if (allMedia.length > 0) {
            setSelectedMedia(allMedia[0]);
        }
    }, [allMedia]);

    const allImagesForModal = useMemo(() => allMedia.filter(m => m.type === 'image').map(m => m.url), [allMedia]);
    const initialModalImage = selectedMedia?.type === 'image' ? selectedMedia.url : null;

    return (
        <>
            {/* Thumbnails */}
            <div className="order-2 lg:order-1 flex flex-row lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto max-h-[600px] p-2">
                {allMedia.map((media, index) => (
                    <div key={index} className={`group aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 ease-in-out shadow-sm flex-shrink-0 w-20 h-20 lg:w-full lg:h-auto ${selectedMedia?.url === media.url ? 'border-blue-600 scale-105 shadow-md' : 'border-transparent hover:border-blue-200 hover:scale-105'}`} onClick={() => setSelectedMedia(media)}>
                        {media.type === 'image'
                            ? <img src={media.thumbnailUrl || media.url} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                            : <div className="w-full h-full bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors"><Play size={32} className="text-white/80 group-hover:text-white transition-colors" /></div>
                        }
                    </div>
                ))}
            </div>

            {/* Main Display */}
            <div className="order-1 lg:order-2 flex flex-col justify-between">
                <div className="relative aspect-square w-full rounded-xl overflow-hidden shadow-lg group">
                    {selectedMedia?.type === 'image' 
                        ? <img src={selectedMedia.url} alt={product.name} className="w-full bg-white h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" /> 
                        : <video src={selectedMedia?.url} className="w-full h-full object-cover" controls autoPlay loop muted playsInline key={selectedMedia?.url} />
                    }
                    {product.newArrival && <span className={`absolute top-4 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 px-3 py-1.5 rounded-md text-xs font-bold z-10 ${language === 'ar' ? 'right-4' : 'left-4'}`}>{t('new_arrival')}</span>}
                    {selectedMedia?.type === 'image' && <button className={`absolute top-4 z-10 inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full border border-gray-900/10 text-sm font-semibold transition-all duration-200 ease-in-out hover:bg-white hover:shadow-md hover:scale-105 ${language === 'ar' ? 'left-4' : 'right-4'}`} onClick={() => setIsImageModalOpen(true)}><Maximize size={16} /><span>{t('view')}</span></button>}
                </div>
            </div>

            <ImageModal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} images={allImagesForModal} initialImage={initialModalImage} altText={product.name} />
        </>
    );
};

export default ProductMediaGallery;