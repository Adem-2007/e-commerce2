// src/pages/Auth/components/LoginForm.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Lock, AtSign, AlertCircle, LogIn } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import AuthInput from './AuthInput';
import ButtonLoader from './ButtonLoader';

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';

// --- MODIFIED: Added recaptchaRef prop ---
const LoginForm = ({ formData, handleInputChange, handleSubmit, isSubmitting, isThrottled, throttleSeconds, setView, setError, t, error, recaptchaToken, onRecaptchaChange, recaptchaRef }) => {
    
    // --- NEW: A specific error handler for reCAPTCHA ---
    const handleRecaptchaError = () => {
        // You can add a new translation key for this specific error
        setError('Failed to load reCAPTCHA. Please check your connection and refresh.');
        onRecaptchaChange(null); // Ensure the token state is null
    };

    return (
        <>
            <div className="text-left rtl:text-right mb-10">
                <h2 className="text-3xl font-semibold text-gray-800 mb-2">{t('auth_page.login_title')}</h2>
                <p className="text-base text-gray-500">{t('auth_page.login_subtitle')}</p>
            </div>
            {error && <motion.div className="flex rtl:flex-row-reverse items-center gap-2.5 p-3 mb-4 text-sm font-medium bg-red-100 text-red-700 rounded-lg" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}><AlertCircle size={18}/><span>{error}</span></motion.div>}
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-5">
                    <AuthInput id="email" name="email" type="email" placeholder="email@example.com" value={formData.email} onChange={handleInputChange} label={t('auth_page.placeholders.email')} Icon={AtSign} required />
                    <AuthInput id="password" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleInputChange} label={t('auth_page.placeholders.password')} Icon={Lock} required />
                    
                    <div className="flex justify-center mt-2">
                        {/* --- MODIFIED: Added ref and robust error handlers --- */}
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={RECAPTCHA_SITE_KEY}
                            onChange={(token) => onRecaptchaChange(token)}
                            onExpired={() => onRecaptchaChange(null)}
                            onErrored={handleRecaptchaError}
                            onError={handleRecaptchaError}
                        />
                    </div>
                    
                    <button type="submit" className="flex items-center justify-center w-full bg-blue-600 text-white py-4 rounded-lg text-base font-medium transition hover:bg-blue-700 active:scale-[0.98] disabled:bg-gray-400 disabled:cursor-not-allowed mt-2" disabled={isThrottled || isSubmitting || !recaptchaToken}>
                        {isSubmitting ? <ButtonLoader /> : isThrottled ? t('auth_page.buttons.throttled', { seconds: throttleSeconds }) : <><LogIn className="mr-2 rtl:mr-0 rtl:ml-2 h-5 w-5" />{t('auth_page.buttons.sign_in')}</>}
                    </button>
                </div>
            </form>
            <button onClick={() => { setView('forgot'); setError(''); }} className="block mt-6 text-center text-sm text-gray-500 hover:text-blue-600 transition">
                {t('auth_page.buttons.forgot_password')}
            </button>
        </>
    );
};

export default LoginForm;