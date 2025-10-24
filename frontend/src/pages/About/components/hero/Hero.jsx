// frontend/src/pages/About/components/hero/Hero.jsx

import React from 'react';
import { motion } from 'framer-motion';

const Hero = ({ title, subtitle }) => {
  // Framer Motion variants for a staggered animation effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Time between each child animating in
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut", 
      },
    },
  };

  return (
    <section className="relative w-full bg-slate-900 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop"
          alt="A creative team working together in a modern office"
          className="w-full h-full object-cover opacity-30"
        />
        {/* Subtle noise pattern for a textured look */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
      </div>

      {/* Container to center the content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] md:min-h-[75vh] text-center py-24 sm:py-32">
          
          {/* Animated Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible" 
            viewport={{ once: true, amount: 0.5 }}
            className="max-w-4xl"
          >
            {/* --- "Our Story & Vision" span has been removed --- */}

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white tracking-tighter leading-tight"
            >
              {title || 'Crafting the Future of E-commerce'}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
            >
              {subtitle || 'Discover the values, people, and passion that drive us to innovate and deliver excellence every day.'}
            </motion.p>
          </motion.div>

        </div>
      </div>

      {/* --- Fading effect at the bottom --- */}
      <div 
        className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-slate-50 to-transparent" 
        aria-hidden="true"
      ></div>
    </section>
  );
};

export default Hero;