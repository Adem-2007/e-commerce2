// frontend/src/pages/About/components/story/OurStory.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../../../context/LanguageContext';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';

// Custom styles for Swiper pagination to match the design
const swiperStyles = `
  .our-story-slider .swiper-pagination-bullet {
    width: 10px; height: 10px; background-color: #94a3b8;
    opacity: 1; border: none; transition: all 0.3s ease;
  }
  .our-story-slider .swiper-pagination-bullet-active {
    background-color: #4f46e5; width: 28px; border-radius: 6px;
  }
`;

const OurStory = ({ story }) => {
  // Use the language hook to get the current language and translation function
  const { language, t } = useLanguage();

  // If there's no story data, don't render the component
  if (!story || story.length === 0) return null;

  return (
    <>
      <style>{swiperStyles}</style>
      <div className="bg-gradient-to-b from-white via-slate-50/50 to-white py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block px-4 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-4"
            >
              {t('about_page.story.badge')}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight"
            >
              {t('about_page.story.title')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 text-lg text-slate-600 leading-relaxed"
            >
              {t('about_page.story.description')}
            </motion.p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Swiper
            modules={[Navigation, Pagination, EffectFade, Autoplay]}
            navigation={{
              nextEl: '.our-story-button-next',
              prevEl: '.our-story-button-prev',
            }}
            pagination={{ clickable: true }}
            loop={true}
            effect="fade"
            autoplay={{ delay: 5500, disableOnInteraction: false }}
            className="our-story-slider rounded-2xl overflow-hidden shadow-2xl shadow-slate-200/80 border border-slate-200/60"
          >
            {story.map((milestone) => (
              <SwiperSlide key={milestone._id}>
                <div className="relative w-full aspect-[4/3] lg:aspect-[16/7] bg-slate-100">
                  {milestone.image && (
                     <img
                       src={`${import.meta.env.VITE_API_BASE_URL}${milestone.image}`}
                       alt={`Milestone ${milestone.year}`}
                       className="w-full h-full object-cover"
                     />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-white/60 md:bg-gradient-to-r md:from-white md:via-white/90 md:to-transparent"></div>
                  <div className="relative z-10 grid md:grid-cols-2 h-full">
                     <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
                        <motion.h4 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="text-4xl lg:text-5xl font-bold mb-4 text-indigo-600">
                          {milestone.title?.[language] || milestone.title?.en}
                        </motion.h4>
                        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }} className="text-slate-700 text-lg mb-6 max-w-lg">
                          {milestone.description?.[language] || milestone.description?.en}
                        </motion.p>
                        <motion.ul className="space-y-3">
                           {milestone.achievements.map((ach, achIndex) => (
                              <motion.li key={achIndex} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.7 + achIndex * 0.15 }} className="flex items-center gap-3">
                                 <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                 <span className="text-slate-600 font-medium">
                                  {ach?.[language] || ach?.en}
                                 </span>
                              </motion.li>
                           ))}
                        </motion.ul>
                     </div>
                     <div className="hidden md:flex items-center justify-end p-12">
                        <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}>
                           <h3 className="text-[12rem] lg:text-[15rem] font-black text-slate-900/10 leading-none select-none">{milestone.year}</h3>
                        </motion.div>
                     </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <button className="our-story-button-prev absolute top-1/2 -translate-y-1/2 left-4 z-10 flex items-center justify-center w-12 h-12 bg-white/60 text-slate-800 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out hover:bg-white hover:scale-110">
            <ArrowLeft size={24} />
          </button>
          <button className="our-story-button-next absolute top-1/2 -translate-y-1/2 right-4 z-10 flex items-center justify-center w-12 h-12 bg-white/60 text-slate-800 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out hover:bg-white hover:scale-110">
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
    </>
  );
};

export default OurStory;