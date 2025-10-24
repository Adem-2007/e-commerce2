import React from 'react';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';

// Animation variants for individual cards
const cardVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', bounce: 0.4, duration: 0.8 },
  },
};

const InfoDisplayCard = ({ icon: Icon, title, value, accentColor, shadowColor }) => {
  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="relative flex h-48 flex-col justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white text-center transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:border-slate-300 hover:shadow-[0_15px_30px_-10px_var(--shadow-color)]"
      style={{ '--accent-color': accentColor, '--shadow-color': shadowColor }}
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-color)] bg-gradient-to-tr from-[var(--accent-color)] to-[oklch(from_var(--accent-color)_calc(l+0.1)_c_h)] shadow-[0_4px_10px_-2px_var(--shadow-color)]">
        <Icon className="h-7 w-7 text-white" />
      </div>
      <h4 className="text-sm font-semibold text-slate-600">{title}</h4>
      <p className="mt-1 truncate px-4 text-base font-medium text-slate-800" title={value}>
        {value}
      </p>

      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white p-1 text-[var(--accent-color)]"
        initial={{ opacity: 0, y: 10 }}
        variants={{ hover: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.3 }}
      >
        <Eye className="h-4 w-4" />
      </motion.div>
    </motion.div>
  );
};

export default InfoDisplayCard;