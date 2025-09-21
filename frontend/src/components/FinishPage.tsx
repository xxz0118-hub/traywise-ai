import React from 'react';
import { motion } from 'motion/react';

export default function FinishPage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.6 }}
      className="text-center space-y-8 min-h-[60vh] flex flex-col items-center justify-center"
    >
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8, type: "spring", bounce: 0.4 }}
        className="relative"
      >
        {/* Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 border-4 border-[#54FB82]/30 rounded-full absolute inset-0"
        >
          <div className="absolute top-0 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5 bg-[#54FB82] rounded-full blur-sm"></div>
        </motion.div>

        {/* Success Icon */}
        <div className="w-32 h-32 bg-gradient-to-br from-[#54FB82] via-[#5AF3F2] to-[#54FB82] rounded-full flex items-center justify-center relative z-10">
          <motion.svg
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#090F12]"
          >
            <motion.path
              d="M20 6L9 17l-5-5"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 w-32 h-32 bg-[#54FB82]/20 rounded-full blur-2xl animate-pulse"></div>
      </motion.div>

      {/* Success Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="space-y-4"
      >
        <h1 className="text-5xl md:text-6xl font-bold success-glow">
          Sorting Complete!
        </h1>
        <p className="text-xl text-[#5AF3F2]/80">
          Thank you for using TrayWise AI
        </p>
      </motion.div>

      {/* Loading Dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="flex items-center gap-2 text-[#5AF3F2]"
      >
        <span>Redirecting</span>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1, 
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-1.5 h-1.5 bg-[#5AF3F2] rounded-full"
            />
          ))}
        </div>
      </motion.div>

      {/* Floating Particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-[#54FB82]/60 rounded-full"
          initial={{ 
            opacity: 0,
            x: 0,
            y: 0,
          }}
          animate={{
            opacity: [0, 1, 0],
            x: [0, (Math.random() - 0.5) * 400],
            y: [0, (Math.random() - 0.5) * 400],
          }}
          transition={{
            duration: 2,
            delay: 1 + i * 0.1,
            ease: "easeOut"
          }}
          style={{
            left: '50%',
            top: '50%',
          }}
        />
      ))}
    </motion.div>
  );
}