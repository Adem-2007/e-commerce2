// src/pages/Auth/components/ForgotPasswordForm.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { AtSign, AlertCircle, Send } from 'lucide-react';
import AuthInput from './AuthInput';
import ButtonLoader from './ButtonLoader'; // <-- Import the new loader

const ForgotPasswordForm = ({ forgotEmail, setForgotEmail, handleSubmit, isSubmitting, setView, setError, t, error }) => {
    return (
        <>
            {/* ... (Header and error message) ... */}
            <div className="text-left rtl:text-right mb-10">
                <h2 className="text-3xl font-semibold text-gray-800 mb-2">{t('auth_page.forgot_view.title')}</h2>
                <p className="text-base text-gray-500">{t('auth_page.forgot_view.subtitle')}</p>
            </div>
            {error && <motion.div className="flex rtl:flex-row-reverse items-center gap-2.5 p-3 mb-4 text-sm font-medium bg-red-100 text-red-700 rounded-lg" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}><AlertCircle size={18}/><span>{error}</span></motion.div>}
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-5">
                    <AuthInput id="email-forgot" name="email-forgot" type="email" placeholder="email@example.com" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} label={t('auth_page.placeholders.email')} Icon={AtSign} required />
                    
                    <button type="submit" className="flex items-center justify-center w-full bg-blue-600 text-white py-4 rounded-lg text-base font-medium transition hover:bg-blue-700 active:scale-[0.98] disabled:bg-gray-400 disabled:cursor-not-allowed mt-2" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <ButtonLoader />
                        ) : (
                            <>
                                <Send className="mr-2 rtl:mr-0 rtl:ml-2 h-5 w-5" />
                                {t('auth_page.buttons.send_code')}
                            </>
                        )}
                    </button>
                </div>
            </form>
            {/* ... (Back to login button) ... */}
            <button onClick={() => { setView('login'); setError(''); }} className="block mt-6 text-center text-sm text-gray-500 hover:text-blue-600 transition">
                {t('auth_page.buttons.back_to_login')}
            </button>
        </>
    );
};

export default ForgotPasswordForm;