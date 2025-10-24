// src/pages/Dashboard/Categories/components/AddProduct/steps/Step1.jsx

import React, { useState, useCallback } from 'react';
import { Image as ImageIcon, Video as VideoIcon, Loader, Crop, UploadCloud, Trash2, ShieldAlert } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useDashboardLanguage } from '../../../../../../context/DashboardLanguageContext';

const InputGroup = React.forwardRef(({ label, children, error }, ref) => (
    <div ref={ref} className="flex flex-col">
        <label className="mb-2 font-semibold text-sm text-gray-700">{label}</label>
        {children}
        {error && <p className="mt-1.5 text-xs text-red-600 font-semibold">{error}</p>}
    </div>
));

const renderUploader = (id, media, onChange, onRemove, title, icon, acceptedFiles, hasError, isProcessingImage, processingText, uploaderPromptText, handleSetFocus, imageRef, focusPoint, t) => (
    <div className={`relative border-2 border-dashed rounded-xl transition-colors duration-300 ${media.preview ? 'border-gray-300' : 'border-gray-300 hover:border-teal-500 bg-gray-50'} ${hasError ? '!border-red-500' : ''}`}>
        <input id={id} type="file" className="hidden" onChange={onChange} accept={acceptedFiles} disabled={isProcessingImage} />
        {isProcessingImage && id === 'main-image-upload' ? (
            <div className="flex flex-col items-center justify-center text-center p-8 min-h-[200px]">
                <Loader className="animate-spin text-teal-500" size={32} />
                <p className="mt-2 font-semibold text-gray-800">{processingText}</p>
            </div>
        ) : !media.preview ? (
            <label htmlFor={id} className="flex flex-col items-center justify-center text-center p-8 cursor-pointer min-h-[200px]">
                {icon}
                <p className="mt-2 font-semibold text-gray-800">{title}</p>
                <p className="text-xs text-gray-500">{uploaderPromptText}</p>
            </label>
        ) : (
            <div className="relative group p-2">
                {id === 'main-image-upload' ? (
                    <div className="relative">
                        <div className="relative cursor-crosshair" onClick={handleSetFocus}>
                            <img ref={imageRef} src={media.preview} alt="Product Preview" className="w-full max-h-72 object-cover rounded-lg" />
                            <div style={{ left: `${focusPoint.x * 100}%`, top: `${focusPoint.y * 100}%` }} className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-white/90 drop-shadow-lg transition-all duration-200 pointer-events-none">
                                <Crop />
                            </div>
                        </div>
                        <div className="absolute top-2 right-2 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <label htmlFor={id} className="cursor-pointer p-2.5 bg-white/90 backdrop-blur-sm text-gray-800 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all" title={t('collections.addProductModal.changeImageTooltip', 'Change Image')}>
                                <UploadCloud size={18} />
                            </label>
                            <button type="button" onClick={onRemove} className="p-2.5 bg-white/90 backdrop-blur-sm text-red-600 rounded-full shadow-lg hover:bg-red-500 hover:text-white hover:scale-110 transition-all" title={t('collections.addProductModal.removeImageTooltip', 'Remove Image')}>
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="relative">
                        <video src={media.preview} controls className="w-full max-h-48 object-cover rounded-lg" />
                        <button type="button" onClick={onRemove} className="absolute top-2 right-2 z-10 p-2.5 bg-white/90 backdrop-blur-sm text-red-600 rounded-full shadow-lg hover:bg-red-500 hover:text-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100" title={t('collections.addProductModal.removeVideoTooltip', 'Remove Video')}>
                            <Trash2 size={18} />
                        </button>
                    </div>
                )}
            </div>
        )}
    </div>
);

const GalleryUploader = ({ secondaryMedia, handleUpdateSecondaryMedia, error }) => {
    const { t } = useDashboardLanguage();
    const [panelError, setPanelError] = useState('');
    const MAX_FILES = 5;

    const onDrop = useCallback((acceptedFiles) => {
        const currentCount = secondaryMedia.length;
        const spaceAvailable = MAX_FILES - currentCount;

        if (acceptedFiles.length > spaceAvailable) {
            setPanelError(t('collections.mediaGallery.maxFilesError', { count: MAX_FILES }));
            setTimeout(() => setPanelError(''), 4000);
        }
        
        const filesToProcess = acceptedFiles.slice(0, spaceAvailable);
        if (filesToProcess.length === 0) return;

        setPanelError('');

        const newMediaItems = filesToProcess.map(file => {
            const previewUrl = URL.createObjectURL(file);
            return { file: file, preview: previewUrl, type: 'image', id: previewUrl }; // Use blob URL as temporary ID
        });
        handleUpdateSecondaryMedia(newMediaItems);

    }, [secondaryMedia, t, handleUpdateSecondaryMedia]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif', '.avif'] },
        disabled: secondaryMedia.length >= MAX_FILES
    });

    return (
        <div className="flex flex-col gap-4">
            <div {...getRootProps()} className={`p-6 text-center border-2 border-dashed rounded-xl transition-all ${isDragActive ? 'border-teal-500 bg-teal-50 text-teal-600' : 'border-gray-300'} ${(secondaryMedia.length >= MAX_FILES) ? 'bg-gray-200 border-gray-300 cursor-not-allowed text-gray-400' : 'cursor-pointer text-gray-500 hover:border-teal-400 hover:bg-gray-100'} ${error ? '!border-red-500' : ''}`}>
                <input {...getInputProps()} />
                {secondaryMedia.length >= MAX_FILES ? (
                    <><ShieldAlert size={32} className="mx-auto mb-2" /><p className="font-semibold text-sm">{t('collections.mediaGallery.limitReached', { count: MAX_FILES })}</p></>
                ) : (
                    <><UploadCloud size={32} className="mx-auto mb-2" /><p className="font-semibold text-sm">{t('collections.mediaGallery.dropzone_prompt_bold')}</p><p className="text-xs">{t('collections.mediaGallery.dropzone_prompt_light')}</p></>
                )}
            </div>
            {panelError && <p className="text-xs text-center text-red-600 font-semibold">{panelError}</p>}
        </div>
    );
};


const Step1 = ({
    mainImage, handleMainImageChange, handleRemoveMainImage, errors, mainImageRef,
    video, handleVideoChange, handleRemoveVideo,
    secondaryMedia, secondaryMediaRef, handleUpdateSecondaryMedia, handleRemoveSecondaryMedia,
    isProcessingImage, imageRef, handleSetFocus, focusPoint
}) => {
    const { t } = useDashboardLanguage();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-1">
            <div className="flex flex-col gap-6">
                <InputGroup ref={mainImageRef} label={t('collections.addProductModal.mainImageLabel')} error={errors.mainImage}>
                    {renderUploader(
                        'main-image-upload', mainImage, handleMainImageChange, handleRemoveMainImage,
                        t('collections.addProductModal.mainImageUploadTitle'), <ImageIcon size={32} className="text-gray-400" />, 'image/*',
                        !!errors.mainImage, isProcessingImage, t('collections.addProductModal.processingImage'),
                        t('collections.addProductModal.uploaderPrompt'), handleSetFocus, imageRef, focusPoint, t
                    )}
                </InputGroup>
                <InputGroup label={t('collections.addProductModal.videoLabel')}>
                    {renderUploader(
                        'video-upload', video, handleVideoChange, handleRemoveVideo,
                        t('collections.addProductModal.videoUploadTitle'), <VideoIcon size={32} className="text-gray-400" />, 'video/*'
                    )}
                </InputGroup>
            </div>

            {/* --- MODIFIED SECTION FOR BETTER LAYOUT --- */}
            <div className="flex flex-col gap-4">
                <InputGroup ref={secondaryMediaRef} label={t('collections.addProductModal.additionalMediaLabel')} error={errors.secondaryMedia}>
                    <GalleryUploader secondaryMedia={secondaryMedia} handleUpdateSecondaryMedia={handleUpdateSecondaryMedia} error={!!errors.secondaryMedia} />
                </InputGroup>

                {secondaryMedia.length > 0 && (
                    <div className="relative flex-1 min-h-0">
                        <div className="absolute inset-0 overflow-y-auto pr-2">
                            <div className="grid grid-cols-2 gap-3">
                                {secondaryMedia.map((item) => (
                                    <div key={item.id} className="relative group aspect-square">
                                        <img src={item.preview} alt="Media preview" className="w-full h-full object-cover rounded-lg border border-gray-200" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSecondaryMedia(item.id)}
                                            className="absolute top-1.5 right-1.5 w-7 h-7 flex items-center justify-center bg-black/50 text-white rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:scale-110"
                                            aria-label="Remove media"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* --- END OF MODIFIED SECTION --- */}
        </div>
    );
};

export default Step1;