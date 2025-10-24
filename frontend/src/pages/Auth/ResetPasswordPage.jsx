// src/pages/Auth/ResetPasswordPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, Hash, CheckCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import DecorativePanel from './components/DecorativePanel';
import ButtonLoader from './components/ButtonLoader'; // <-- Import the new loader

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const ResetPasswordPage = () => {
    // ... State and useEffect logic remains the same ...
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [logoData, setLogoData] = useState({ name: 'Your Store', imageUrl: '' });

    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    const { t, dir } = useLanguage();

    useEffect(() => {
        if (!email) {
            navigate('/auth');
        }

        const fetchLogo = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/logo`);
                const data = await res.json();
                setLogoData({
                    name: data.name,
                    imageUrl: `${API_BASE_URL}${data.imageUrl}`
                });
            } catch (err) {
                console.error("Failed to fetch logo for reset page.");
            }
        };
        fetchLogo();
    }, [email, navigate]);

    const handleSubmit = async (e) => {
        // ... handleSubmit logic remains the same ...
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) return setError(t('reset_password_page.errors.passwords_no_match'));
        if (password.length < 6) return setError(t('reset_password_page.errors.password_too_short'));
        if (code.length !== 6 || !/^\d{6}$/.test(code)) return setError(t('reset_password_page.errors.invalid_code'));

        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/users/verify-and-reset`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            
            setMessage(t('reset_password_page.messages.success'));
            setTimeout(() => navigate('/auth'), 3000);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row w-full min-h-screen font-sans" dir={dir}>
            <div className="w-full lg:w-[45%] flex justify-center items-center bg-gray-50 p-8 order-2 lg:order-1">
                <div className="w-full max-w-sm">
                    {/* ... (Header and message logic) ... */}
                    <div className="text-left rtl:text-right mb-10">
                        <h2 className="text-3xl font-semibold text-gray-800 mb-2">{t('reset_password_page.title')}</h2>
                        <p className="text-base text-gray-500">
                            {t('reset_password_page.subtitle_prefix')}{' '}
                            <strong>{email || t('reset_password_page.subtitle_email_fallback')}</strong>
                            {t('reset_password_page.subtitle_suffix')}
                        </p>
                    </div>

                    {message ? (
                        <motion.div 
                            className="flex rtl:flex-row-reverse items-center gap-2.5 p-3 text-sm font-medium bg-green-100 text-green-700 rounded-lg"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <CheckCircle size={18} />
                            <span>{message}</span>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <motion.div 
                                    className="flex rtl:flex-row-reverse items-center gap-2.5 p-3 text-sm font-medium bg-red-100 text-red-700 rounded-lg"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <AlertCircle size={18} />
                                    <span>{error}</span>
                                </motion.div>
                            )}
                            
                            {/* ... (Input fields) ... */}
                            <div className="relative">
                                <input id="code" type="text" placeholder=" " className="peer w-full py-3.5 px-4 border border-gray-300 bg-white rounded-lg text-gray-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent" value={code} onChange={(e) => setCode(e.target.value)} required maxLength="6" />
                                <label htmlFor="code" className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600 flex items-center">
                                    <Hash className="inline w-4 h-4 mr-1.5" />{t('reset_password_page.placeholders.code')}
                                </label>
                            </div>
                            <div className="relative">
                                <input id="password" type="password" placeholder=" " className="peer w-full py-3.5 px-4 border border-gray-300 bg-white rounded-lg text-gray-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                <label htmlFor="password" className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600 flex items-center">
                                    <Lock className="inline w-4 h-4 mr-1.5" />{t('reset_password_page.placeholders.new_password')}
                                </label>
                            </div>
                            <div className="relative">
                                <input id="confirmPassword" type="password" placeholder=" " className="peer w-full py-3.5 px-4 border border-gray-300 bg-white rounded-lg text-gray-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                                <label htmlFor="confirmPassword" className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600 flex items-center">
                                    <Lock className="inline w-4 h-4 mr-1.5" />{t('reset_password_page.placeholders.confirm_password')}
                                </label>
                            </div>

                            <button type="submit" className="flex items-center justify-center w-full bg-blue-600 text-white py-4 rounded-lg text-base font-medium transition hover:bg-blue-700 active:scale-[0.98] disabled:bg-gray-400 disabled:cursor-not-allowed mt-2" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <ButtonLoader />
                                ) : (
                                    <>
                                        <RefreshCw className="mr-2 rtl:mr-0 rtl:ml-2 h-5 w-5" />
                                        {t('reset_password_page.buttons.reset')}
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
            
            <DecorativePanel logoData={logoData} t={t} />
        </div>
    );
};

export default ResetPasswordPage;