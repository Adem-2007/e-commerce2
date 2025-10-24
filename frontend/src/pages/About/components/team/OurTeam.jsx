// frontend/src/pages/About/components/team/OurTeam.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../../context/LanguageContext';

const OurTeam = ({ members }) => {
  const { language, t } = useLanguage();

  if (!members || members.length === 0) return null;

  return (
    <div className="bg-white py-20 sm:py-28 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <svg className="absolute right-0 top-0 h-full w-full transform translate-x-1/2" aria-hidden="true">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40V0h40" fill="none" stroke="rgb(226 232 240)" strokeOpacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-4"
          >
            {t('about_page.team.badge')}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight"
          >
            {t('about_page.team.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto"
          >
            {t('about_page.team.description')}
          </motion.p>
        </div>

        <div className="flex flex-wrap justify-center items-stretch gap-x-8 gap-y-12">
          {members.map((member, index) => (
            <motion.div
              key={member._id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative w-full sm:w-auto sm:basis-[calc(50%-1rem)] lg:basis-[calc(25%-1.5rem)] max-w-sm sm:max-w-none overflow-hidden rounded-2xl bg-slate-100 shadow-lg"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  // --- FIXED: Removed the API_BASE_URL prefix. ---
                  // The 'member.image' field now contains the full Base64 data URI.
                  src={member.image}
                  alt={member.name?.[language] || member.name?.en}
                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                />
              </div>
              <div
                className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-slate-900/80 to-transparent transition-all duration-500 ease-in-out lg:opacity-0 lg:translate-y-6 group-hover:opacity-100 group-hover:translate-y-0"
              >
                <h3 className="text-2xl font-bold text-white tracking-tight mb-1">
                  {member.name?.[language] || member.name?.en}
                </h3>
                <p className="text-indigo-300 font-medium text-sm mb-4">
                  {member.role?.[language] || member.role?.en}
                </p>
                <div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="h-px w-12 bg-indigo-400/50 mb-4"></div>
                  {member.bio && (
                    <p className="text-slate-200 text-sm leading-relaxed opacity-90">{member.bio}</p>
                  )}
                  {member.socialLinks?.length > 0 && (
                    <div className="flex gap-4 mt-4">
                      {member.socialLinks.map((social, idx) => (
                        <a
                          key={idx}
                          href={social.url}
                          className="text-white/70 hover:text-white"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="sr-only">{social.platform}</span>
                          <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurTeam;