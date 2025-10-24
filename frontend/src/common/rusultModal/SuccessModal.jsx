import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants = {
    hidden: {
        y: "-50px",
        opacity: 0,
        scale: 0.95,
    },
    visible: {
        y: "0",
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.3,
            ease: "easeOut",
        },
    },
    exit: {
        y: "50px",
        opacity: 0,
        scale: 0.95,
        transition: {
            duration: 0.2,
            ease: "easeIn",
        },
    },
};

const SuccessModal = ({ showModal, setShowModal }) => {
    return (
        <AnimatePresence>
            {showModal && (
                <motion.div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center px-4"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    onClick={() => setShowModal(false)}
                >
                    <motion.div
                        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-center items-center w-20 h-20 bg-emerald-100 rounded-full mx-auto mb-6">
                            <FiCheckCircle className="text-emerald-500 w-12 h-12" />
                        </div>
                        <h3 className="text-2xl font-bold text-blue-900 mb-2">Message Sent Successfully!</h3>
                        <p className="text-slate-600 mb-8">
                            Thank you for your message. We'll be in touch shortly.
                        </p>
                        <motion.button
                            onClick={() => setShowModal(false)}
                            className="bg-amber-500 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-amber-600 w-full"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Got it!
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SuccessModal;