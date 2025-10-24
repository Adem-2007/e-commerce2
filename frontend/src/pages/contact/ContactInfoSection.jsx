import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

const cardContainerVariants = {
    offscreen: { y: 50, opacity: 0 },
    onscreen: (i) => ({
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            bounce: 0.4,
            duration: 0.8,
            delay: i * 0.15
        }
    })
};

const ContactCard = ({ detail, index, dir }) => {
    const { icon: IconComponent, title, detail: textDetail, href, buttonText, accentColor, accentColorRgb } = detail;
    const [isHovered, setIsHovered] = useState(false);
    
    const isRtl = dir === 'rtl';
    const accentColorClass = `text-${accentColor}`;

    const shadowStyle = {
        boxShadow: `0 4px 20px -5px rgba(${accentColorRgb}, 0.2)`
    };
    const hoverShadowStyle = {
        boxShadow: `0 10px 30px -5px rgba(${accentColorRgb}, 0.35)`
    };

    return (
        <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.6 }}
            variants={cardContainerVariants}
            custom={index}
            className="h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                dir={dir}
                // --- UPDATED: Added items-center and text-center for centered, responsive content ---
                className="bg-white p-8 rounded-2xl h-full flex flex-col items-center text-center transition-all duration-300 ease-in-out transform hover:-translate-y-2"
                style={isHovered ? hoverShadowStyle : shadowStyle}
            >
                <IconComponent className={`w-8 h-8 mb-4 ${accentColorClass}`} />
                <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                {/* The 'grow' class ensures the link stays at the bottom, creating equal-height cards in a row */}
                <p className="text-gray-500 mt-1 mb-5 grow">{textDetail}</p>
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group inline-flex items-center font-semibold mt-auto ${accentColorClass}`}
                >
                    <span>{buttonText}</span>
                    <FiArrowRight
                        className={`transition-transform duration-300 group-hover:translate-x-1 ${isRtl ? 'mr-2 -scale-x-100 group-hover:-translate-x-1' : 'ml-2'}`}
                    />
                </a>
            </div>
        </motion.div>
    );
};

const ContactInfoSection = ({ contactDetails, dir }) => {
    return (
        <section className="bg-slate-50 py-20 md:py-24">
            <div className="container mx-auto px-6">
                {/* This grid layout is inherently responsive: 1 col on mobile, 2 on tablet, 3 on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {contactDetails.map((detail, index) => (
                        <ContactCard key={index} detail={detail} index={index} dir={dir} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ContactInfoSection;