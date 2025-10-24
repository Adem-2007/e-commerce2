import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiMail, FiPhone, FiMapPin, FiExternalLink, FiHelpCircle } from 'react-icons/fi';
import ReCAPTCHA from 'react-google-recaptcha';
import { useLanguage } from '../../context/LanguageContext';
import { INFO_API_URL, API_BASE_URL } from '../../api/api';

// Child Components
import ContactInfoSection from './ContactInfoSection';
import SuccessModal from '../../common/rusultModal/SuccessModal';

const initialPageInfo = {
    heroTitle: { en: 'Get in Touch' },
    heroSubtitle: { en: "We're here to help and answer any question you might have. We look forward to hearing from you." },
    email: 'loading...',
    phone: 'loading...',
    address: 'loading...',
    googleMapsUrl: '',
    formLabels: {
        name: { en: 'Full Name' },
        email: { en: 'Email Address' },
        message: { en: 'Your Message' }
    },
    faqs: []
};

const MapFallback = ({ address, url, t }) => (
    <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-8 text-center rounded-lg">
        <FiMapPin className="w-12 h-12 text-amber-500 mb-4" />
        <h3 className="text-xl font-bold text-gray-800">{t('contact_page.map_fallback.title')}</h3>
        <p className="text-gray-600 my-2">{address}</p>
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center px-6 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors duration-300"
        >
            {t('contact_page.map_fallback.button')}
            <FiExternalLink className="ml-2" />
        </a>
    </div>
);

const ContactUsPage = () => {
    const { language, t, dir } = useLanguage();
    const [openFaq, setOpenFaq] = useState(null);
    const [formInputData, setFormInputData] = useState({ name: '', email: '', message: '' });
    const [pageInfo, setPageInfo] = useState(initialPageInfo);
    const [loading, setLoading] = useState(true);
    const [isMapUrlValid, setIsMapUrlValid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    const [recaptchaToken, setRecaptchaToken] = useState('');
    const [submissionCount, setSubmissionCount] = useState(0);
    const recaptchaRef = useRef(null);
    const MAX_SUBMISSIONS = 4;
    const isSubmissionLimitReached = useMemo(() => submissionCount >= MAX_SUBMISSIONS, [submissionCount]);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const response = await axios.get(INFO_API_URL);
                setPageInfo(prev => ({ ...prev, ...response.data }));
                if (response.data.googleMapsUrl && response.data.googleMapsUrl.includes('/embed')) {
                    setIsMapUrlValid(true);
                } else {
                    setIsMapUrlValid(false);
                }
            } catch (error) {
                console.error("Failed to fetch page info:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInfo();
    }, []);

    useEffect(() => {
        const storedCount = localStorage.getItem('submissionCount');
        const count = storedCount ? parseInt(storedCount, 10) : 0;
        setSubmissionCount(count);

        if (count >= MAX_SUBMISSIONS) {
            setErrorMessage('You have reached the maximum number of submissions.');
        }
    }, []);

    const contactDetails = useMemo(() => [
        { icon: FiMail, title: t('contact_page.info_card.email_title'), detail: pageInfo.email, href: `mailto:${pageInfo.email}`, accentColor: 'sky-500', accentColorRgb: '14, 165, 233', buttonText: t('contact_page.info_card.email_button') },
        { icon: FiPhone, title: t('contact_page.info_card.phone_title'), detail: pageInfo.phone, href: `tel:${pageInfo.phone}`, accentColor: 'emerald-500', accentColorRgb: '16, 185, 129', buttonText: t('contact_page.info_card.phone_button') },
        { icon: FiMapPin, title: t('contact_page.info_card.address_title'), detail: pageInfo.address, href: pageInfo.googleMapsUrl, accentColor: 'amber-500', accentColorRgb: '245, 158, 11', buttonText: t('contact_page.info_card.address_button') }
    ], [pageInfo, t]);

    const handleFormInputChange = (e) => setFormInputData({ ...formInputData, [e.target.name]: e.target.value });

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (isSubmissionLimitReached) {
            setErrorMessage('You have reached the maximum number of submissions.');
            return;
        }

        if (!recaptchaToken) {
            setErrorMessage('Please complete the reCAPTCHA verification.');
            return;
        }

        setIsSubmitting(true);
        setErrorMessage('');
        try {
            const payload = { ...formInputData, recaptchaToken };
            const response = await axios.post(`${API_BASE_URL}/api/messages/send`, payload);

            if (response.data.success) {
                const newCount = submissionCount + 1;
                setSubmissionCount(newCount);
                localStorage.setItem('submissionCount', newCount.toString());

                setFormInputData({ name: '', email: '', message: '' });
                setShowSuccessModal(true);
                recaptchaRef.current.reset();
                setRecaptchaToken('');
            } else {
                setErrorMessage(response.data.message || 'An unexpected error occurred.');
            }
        } catch (error) {
            console.error("Form submission error:", error);
            const message = error.response?.data?.message || 'Failed to connect to the server. Please try again.';
            setErrorMessage(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const isRtl = language === 'ar';
    const labelClasses = "absolute -top-3.5 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-800";

    return (
        <div className="bg-slate-50 text-gray-800 font-sans">
            <SuccessModal showModal={showSuccessModal} setShowModal={setShowSuccessModal} />

            <header className="bg-white">
                <div className="container mx-auto px-6 py-20 md:py-28">
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
                        initial="hidden"
                        animate="visible"
                        variants={sectionVariants}
                    >
                        <div dir={dir}>
                            <h1 className="text-4xl md:text-6xl font-bold text-blue-900 tracking-tight leading-tight">
                                {pageInfo.heroTitle?.[language] || pageInfo.heroTitle?.en}
                            </h1>
                            <p className="mt-4 text-lg text-slate-600 max-w-lg">
                                {pageInfo.heroSubtitle?.[language] || pageInfo.heroSubtitle?.en}
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <FiHelpCircle className="w-48 h-48 text-blue-100 mx-auto" />
                        </div>
                    </motion.div>
                </div>
            </header>

            <ContactInfoSection contactDetails={contactDetails} dir={dir} />

            <main className="py-20 md:py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                        <motion.div
                            initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                        >
                            <div dir={dir}>
                                <h2 className="text-3xl font-bold text-blue-900 mb-2">{t('contact_page.form_section.title')}</h2>
                                <p className="text-slate-600 mb-8">
                                    {isSubmissionLimitReached
                                        ? "You have reached your submission limit."
                                        : t('contact_page.form_section.subtitle')}
                                </p>
                            </div>
                            <form onSubmit={handleFormSubmit} className="space-y-6" dir={dir}>
                                <fieldset disabled={isSubmissionLimitReached} className="space-y-6">
                                    <div className="relative">
                                        <input type="text" id="name" name="name" className="peer w-full border border-gray-300 rounded-lg p-4 text-base text-slate-800 bg-white placeholder-transparent focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 transition-all" placeholder=" " value={formInputData.name} onChange={handleFormInputChange} required />
                                        <label htmlFor="name" className={`${labelClasses} ${isRtl ? 'right-4' : 'left-4'}`}>
                                            {pageInfo.formLabels?.name?.[language] || pageInfo.formLabels?.name?.en}
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <input type="email" id="email" name="email" className="peer w-full border border-gray-300 rounded-lg p-4 text-base text-slate-800 bg-white placeholder-transparent focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 transition-all" placeholder=" " value={formInputData.email} onChange={handleFormInputChange} required />
                                        <label htmlFor="email" className={`${labelClasses} ${isRtl ? 'right-4' : 'left-4'}`}>
                                            {pageInfo.formLabels?.email?.[language] || pageInfo.formLabels?.email?.en}
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <textarea id="message" name="message" rows="5" className="peer w-full border border-gray-300 rounded-lg p-4 text-base text-slate-800 bg-white placeholder-transparent focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 transition-all" placeholder=" " value={formInputData.message} onChange={handleFormInputChange} required></textarea>
                                        <label htmlFor="message" className={`${labelClasses} ${isRtl ? 'right-4' : 'left-4'}`}>
                                            {pageInfo.formLabels?.message?.[language] || pageInfo.formLabels?.message?.en}
                                        </label>
                                    </div>
                                </fieldset>

                                <div className="flex justify-center">
                                     <ReCAPTCHA
                                        ref={recaptchaRef}
                                        sitekey="6LfZi98rAAAAAGkTJWYurobx86rD1tkvyuEmWfTm"
                                        onChange={(token) => setRecaptchaToken(token || "")}
                                        onExpired={() => setRecaptchaToken("")}
                                        hl={language}
                                    />
                                </div>
                                
                                {/* --- UPDATED: Error message display without animation --- */}
                                {errorMessage && (
                                    <div
                                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center"
                                        role="alert"
                                    >
                                        {errorMessage}
                                    </div>
                                )}
                                
                                <motion.button
                                    type="submit"
                                    className="w-full bg-amber-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-amber-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    whileHover={{ scale: isSubmitting || isSubmissionLimitReached ? 1 : 1.02 }}
                                    whileTap={{ scale: isSubmitting || isSubmissionLimitReached ? 1 : 0.98 }}
                                    disabled={isSubmitting || isSubmissionLimitReached}
                                >
                                    {isSubmitting 
                                        ? t('contact_page.form_section.submitting_button') 
                                        : isSubmissionLimitReached
                                        ? "Limit Reached"
                                        : t('contact_page.form_section.submit_button')}
                                </motion.button>
                            </form>
                        </motion.div>
                        <motion.div className="h-96 lg:h-full w-full rounded-xl shadow-lg overflow-hidden bg-slate-200 lg:min-h-[550px]" initial={{ opacity: 0, x: isRtl ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: "easeOut" }}>
                            {isMapUrlValid && !loading ? (
                                <iframe
                                    src={pageInfo.googleMapsUrl}
                                    width="100%"
                                    height="100%"
                                    className="border-0"
                                    allowFullScreen=""
                                    loading="lazy"
                                    title="Google Maps Location"
                                ></iframe>
                            ) : (
                                !loading && <MapFallback address={pageInfo.address} url={pageInfo.googleMapsUrl} t={t} />
                            )}
                        </motion.div>
                    </div>
                </div>
            </main>

            <section className="py-20 md:py-24 bg-slate-50" dir={dir}>
                <div className="container mx-auto px-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900">{t('contact_page.faq_section.title')}</h2>
                        <p className="text-center text-slate-600 mt-3 max-w-2xl mx-auto">{t('contact_page.faq_section.subtitle')}</p>
                    </motion.div>
                    <div className="max-w-3xl mx-auto mt-12 space-y-4">
                        {loading ? (
                            <p className="text-center text-slate-500">{t('contact_page.faq_section.loading')}</p>
                        ) : (
                            pageInfo.faqs && pageInfo.faqs.map((item, index) => (
                                <motion.div key={index} className="border border-gray-200 rounded-lg overflow-hidden" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                                    <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className={`w-full flex justify-between items-center p-5 font-semibold text-blue-900 bg-white hover:bg-slate-50 transition-colors ${isRtl ? 'text-right' : 'text-left'}`}>
                                        <span className={`flex-1 ${isRtl ? 'pl-4' : 'pr-4'}`}>{item.question?.[language] || item.question?.en}</span>
                                        <motion.div animate={{ rotate: openFaq === index ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                            <FiChevronDown className="w-5 h-5 text-slate-500" />
                                        </motion.div>
                                    </button>
                                    <AnimatePresence>
                                        {openFaq === index && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
                                                <p className={`p-5 pt-0 bg-white text-slate-600 leading-relaxed ${isRtl ? 'text-right' : 'text-left'}`}>{item.answer?.[language] || item.answer?.en}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactUsPage;