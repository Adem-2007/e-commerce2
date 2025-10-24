// frontend/src/pages/About/AboutPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader } from 'lucide-react';
import Hero from './components/hero/Hero';
import OurValues from './components/value/OurValues';
import OurStory from './components/story/OurStory';
import OurTeam from './components/team/OurTeam';
import UserTestimonials from './components/UserTestimonials/UserTestimonials';
import { useLanguage } from '../../context/LanguageContext'; // 1. Import useLanguage hook

const AboutPage = () => {
  const { language } = useLanguage(); // 2. Get the current language
  const [aboutData, setAboutData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutInfo = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/info`);
        setAboutData(response.data);
      } catch (err) {
        setError('Failed to load page content.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutInfo();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader className="w-10 h-10 animate-spin text-indigo-600"/></div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">{error}</div>;
  }

  return (
    <>
      <div className="bg-slate-50">
        {/* 3. Select the correct language string before passing as a prop */}
        <Hero 
          title={aboutData?.aboutHeroTitle?.[language]} 
          subtitle={aboutData?.aboutHeroSubtitle?.[language]} 
        />
        <OurValues values={aboutData?.values} />
      </div>

      <OurStory story={aboutData?.story} />
      <OurTeam members={aboutData?.members} />
      <UserTestimonials />
    </>
  );
};

export default AboutPage;