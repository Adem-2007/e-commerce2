// src/pages/Auth/components/DecorativePanel.jsx
import React from 'react';
import { motion } from 'framer-motion';

const DECORATIVE_IMAGE_URL = 'https://tse4.mm.bing.net/th/id/OIP.tNA7ml1W_5V1hdeb1oVtHQHaEK?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3';

const DecorativePanel = ({ logoData, t }) => {
    return (
        <div
            className="w-full lg:w-[55%] bg-cover bg-center flex justify-center items-center p-8 sm:p-16 text-left rtl:text-right relative overflow-hidden order-1 lg:order-2 min-h-[40vh] lg:min-h-screen"
            style={{ backgroundImage: `url(${DECORATIVE_IMAGE_URL})` }}
        >
            <div className="absolute inset-0 bg-black/60 z-0"></div>
            <motion.div
                className="relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <div className="max-w-xl text-white">
                    {logoData.imageUrl && (
                        <img
                            src={logoData.imageUrl}
                            alt={`${logoData.name} Logo`}
                            className="h-12 w-auto mb-6 drop-shadow-lg"
                            onError={(e) => e.target.style.display = 'none'}
                        />
                    )}
                    <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight mb-4 drop-shadow-md">
                        {t('auth_page.decorative.title')}{' '}
                        <span className="text-amber-300">{logoData.name}</span>
                        .
                    </h1>
                    <p className="text-lg opacity-90 leading-relaxed drop-shadow-sm">
                        {t('auth_page.decorative.subtitle')}
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default DecorativePanel;