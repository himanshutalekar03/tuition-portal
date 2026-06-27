"use client"
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="relative w-full h-[90vh] bg-slate-900 text-white">
      {/* Replaced Next.js Image with standard img tag for compatibility */}
      <img
        src="https://placehold.co/1920x1080/000000/FFFFFF?text=Students+Learning"
        alt="Students learning in class"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent z-10"></div>
      <div className="relative z-20 flex items-center justify-center h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center px-4 max-w-3xl"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
            Admissions Open for 2025
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-slate-200 max-w-xl mx-auto">
            Building Bright Futures Through Quality Education and Personalized Guidance.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 px-8 py-3 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 rounded-full transition-transform shadow-lg text-white"
          >
            Enroll Today
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
