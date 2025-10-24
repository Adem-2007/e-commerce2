// frontend/src/pages/Dashboard/info/contact/coreContact/ContactDetailsPanel.jsx
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Link as LinkIcon, Contact, HelpCircle } from 'lucide-react';
import { useDashboardLanguage } from '../../../../../../context/DashboardLanguageContext'; // Adjust path if necessary

/**
 * A redesigned, self-contained input component matching the new UI.
 * The label is always visible, providing better clarity and accessibility.
 * It's fully responsive to LTR and RTL directions.
 */
const InfoField = ({ icon: Icon, id, label, value, onChange, type = 'text', dir, isUrl = false }) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-slate-600 rtl:text-right">
        {label}
      </label>
      <div 
        className="
          group flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 
          shadow-sm transition-all duration-300 hover:border-slate-300 
          focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 
          rtl:flex-row-reverse
        "
      >
        <Icon className="h-5 w-5 shrink-0 text-slate-400 transition-colors group-focus-within:text-indigo-500" />
        <input
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          // The placeholder is used for accessibility but not visually shown
          placeholder={label}
          className={`
            h-12 w-full flex-grow border-none bg-transparent p-0 text-base 
            text-slate-800 outline-none focus:ring-0
            ${isUrl ? 'truncate' : ''}
            rtl:text-right
          `}
          dir={dir}
        />
      </div>
    </div>
  );
};

// --- Main Panel Component ---
const ContactDetailsPanel = ({ details, onFormChange }) => {
  const { t, dir } = useDashboardLanguage();

  const isEmbedUrl = (url) => typeof url === 'string' && url.includes('/embed');
  
  // Memoize validation to prevent re-renders on every keystroke
  const isMapUrlInvalid = useMemo(() => {
    return !!details.googleMapsUrl && !isEmbedUrl(details.googleMapsUrl);
  }, [details.googleMapsUrl]);

  const handleMapUrlChange = (e) => {
    const rawValue = e.target.value;
    const iframeRegex = /src="([^"]+)"/;
    const match = rawValue.match(iframeRegex);
    if (match && match[1]) {
      onFormChange({ target: { name: 'googleMapsUrl', value: match[1] } });
    } else {
      onFormChange(e);
    }
  };

  return (
    <motion.div
      className="bg-slate-50/50 p-6 sm:p-8 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/80"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      dir={dir} // Set direction on the main container
    >
      <div className="mb-8 flex items-center gap-4 rtl:flex-row-reverse">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 shadow-sm">
          <Contact className="h-6 w-6 text-indigo-600" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
          {t('contactPage.details.title')}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          <InfoField icon={Mail} id="email" label={t('contactPage.details.emailLabel')} value={details.email} onChange={onFormChange} type="email" dir={dir} />
          <InfoField icon={Phone} id="phone" label={t('contactPage.details.phoneLabel')} value={details.phone} onChange={onFormChange} dir={dir} />
          <InfoField icon={MapPin} id="address" label={t('contactPage.details.addressLabel')} value={details.address} onChange={onFormChange} dir={dir} />
        </div>
        
        {/* Right Column */}
        <div className="flex flex-col gap-4">
          <div>
            <InfoField
              icon={LinkIcon}
              id="googleMapsUrl"
              label={t('contactPage.details.mapsUrlLabel')}
              value={details.googleMapsUrl}
              onChange={handleMapUrlChange}
              type="text"
              dir={dir}
              isUrl={true}
            />
            <AnimatePresence>
            {isMapUrlInvalid && (
              <motion.div
                className="mt-2 flex items-center text-xs text-red-600 rtl:flex-row-reverse"
                initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
              >
                <HelpCircle className="h-3.5 w-3.5 shrink-0 ltr:mr-1.5 rtl:ml-1.5" />
                <span>{t('contactPage.details.mapsHelpText')}</span>
              </motion.div>
            )}
            </AnimatePresence>
          </div>

          <div className="aspect-video w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
            <AnimatePresence mode="wait">
              {isEmbedUrl(details.googleMapsUrl) ? (
                <motion.iframe
                  key={details.googleMapsUrl}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={details.googleMapsUrl}
                  className="h-full w-full border-0"
                  title="Map Preview"
                ></motion.iframe>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex h-full w-full flex-col items-center justify-center p-4"
                >
                  <MapPin className="mb-3 h-10 w-10 text-slate-400" />
                  <h4 className="font-semibold text-slate-600">{t('contactPage.details.mapPreview.title')}</h4>
                  <p className="text-center text-sm text-slate-500">
                    {t('contactPage.details.mapPreview.subtitle')}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactDetailsPanel;