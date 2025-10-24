// src/pages/Auth/AuthPage.jsx
import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

import DecorativePanel from './components/DecorativePanel';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const AuthPage = () => {
    const [view, setView] = useState('login');
    const [forgotEmail, setForgotEmail] = useState('');
    const [isSubmittingForgot, setIsSubmittingForgot] = useState(false);
    const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
    
    const [isRegister, setIsRegister] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const [logoData, setLogoData] = useState({ name: 'Your Store', imageUrl: '' });

    const [attemptCount, setAttemptCount] = useState(0);
    const [isThrottled, setIsThrottled] = useState(false);
    const [throttleSeconds, setThrottleSeconds] = useState(10);
    
    // --- NEW: Create a ref for the reCAPTCHA component ---
    const recaptchaRef = useRef(null);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { t, dir } = useLanguage();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const errorParam = params.get('error');
        const messageParam = params.get('message'); 

        if (errorParam === 'google_auth_failed') {
            setError(messageParam || t('auth_page.errors.google_auth_failed'));
            navigate('/auth', { replace: true });
        }

        const checkUserExists = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/users/exists`);
                const data = await res.json();
                setIsRegister(!data.exists);
            } catch (err) {
                setError(t('auth_page.errors.connect_failed'));
            } finally {
                setLoading(false);
            }
        };

        const fetchLogo = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/logo`);
                const data = await res.json();
                setLogoData({
                    name: data.name,
                    imageUrl: `${API_BASE_URL}${data.imageUrl}`
                });
            } catch (err) {
                console.error("Failed to fetch logo for auth page.");
            }
        };

        checkUserExists();
        fetchLogo();
    }, [t, location, navigate]);

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (isThrottled) {
            setError(t('auth_page.errors.throttled', { seconds: throttleSeconds }));
            return;
        }

        if (!isRegister && !recaptchaToken) {
            setError(t('auth_page.errors.recaptcha_required'));
            return;
        }

        const newAttemptCount = attemptCount + 1;
        setAttemptCount(newAttemptCount);

        if (newAttemptCount >= 5) {
            setIsThrottled(true);
            const cooldown = 10;
            setError(t('auth_page.errors.throttled', { seconds: cooldown }));

            let secondsRemaining = cooldown;
            setThrottleSeconds(secondsRemaining);
            const interval = setInterval(() => {
                secondsRemaining -= 1;
                setThrottleSeconds(secondsRemaining);
                if (secondsRemaining <= 0) {
                    clearInterval(interval);
                }
            }, 1000);

            setTimeout(() => {
                setIsThrottled(false);
                setAttemptCount(0);
                setError('');
            }, cooldown * 1000);

            return;
        }

        const endpoint = isRegister ? 'register' : 'login';
        setIsSubmittingAuth(true);
        try {
            const body = isRegister 
                ? JSON.stringify(formData)
                : JSON.stringify({ ...formData, recaptchaToken });

            const res = await fetch(`${API_BASE_URL}/api/users/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'An error occurred.');
            
            setAttemptCount(0);
            login(data, data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
            // --- NEW: Reset reCAPTCHA on any login failure ---
            if (!isRegister && recaptchaRef.current) {
                recaptchaRef.current.reset();
                setRecaptchaToken(null); // Clear the token from state
            }
        } finally {
            setIsSubmittingAuth(false);
        }
    };

    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmittingForgot(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/users/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            navigate('/reset-password', { state: { email: forgotEmail } });
        } catch (err) {
            setError(err.message || 'Failed to send request.');
        } finally {
            setIsSubmittingForgot(false);
        }
    };

    if (loading) {
        return ( <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 font-sans" dir={dir}> <div className="flex items-center justify-center space-x-2"> <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse" style={{ animationDelay: '-0.3s' }}></div> <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse" style={{ animationDelay: '-0.15s' }}></div> <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse"></div> </div> <p className="mt-4 text-gray-600">{t('auth_page.loading_message')}</p> </div> );
    }
    
    const renderContent = () => {
        if (view === 'forgot') {
            return ( <ForgotPasswordForm forgotEmail={forgotEmail} setForgotEmail={setForgotEmail} handleSubmit={handleForgotSubmit} isSubmitting={isSubmittingForgot} setView={setView} setError={setError} t={t} error={error} /> );
        }
        if (isRegister) {
            return ( <RegisterForm formData={formData} handleInputChange={handleInputChange} handleSubmit={handleAuthSubmit} isSubmitting={isSubmittingAuth} isThrottled={isThrottled} t={t} error={error} /> );
        }
        return (
            <LoginForm
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleAuthSubmit}
                isSubmitting={isSubmittingAuth}
                isThrottled={isThrottled}
                throttleSeconds={throttleSeconds}
                setView={setView}
                setError={setError}
                t={t}
                error={error}
                recaptchaToken={recaptchaToken}
                onRecaptchaChange={setRecaptchaToken}
                // --- NEW: Pass the ref to the LoginForm ---
                recaptchaRef={recaptchaRef}
            />
        );
    };

    return (
        <div className="flex flex-col lg:flex-row w-full min-h-screen font-sans" dir={dir}>
            <div className="w-full lg:w-[45%] flex justify-center items-center bg-gray-50 p-8 order-2 lg:order-1">
                <div className="w-full max-w-sm">
                    {renderContent()}
                </div>
            </div>
            <DecorativePanel logoData={logoData} t={t} />
        </div>
    );
};

export default AuthPage;