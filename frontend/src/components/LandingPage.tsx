import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="text-center space-y-8"
    >
      {/* Main Title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="space-y-4"
      >
        <h1 className="text-6xl md:text-8xl font-bold text-[#FFFFFF] tracking-tight">
          TrayWise AI
        </h1>
        <p className="text-xl md:text-2xl text-[#5AF3F2]/80 max-w-2xl mx-auto leading-relaxed">
          Smart Food Waste Recognition & Sorting Assistant
        </p>
      </motion.div>

      {/* Central Futuristic Visual Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="relative mx-auto w-80 h-80 md:w-96 md:h-96"
      >
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-[#5AF3F2]/30 animate-spin" style={{ animationDuration: '20s' }}>
          <div className="absolute top-0 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5 bg-[#5AF3F2] rounded-full blur-sm"></div>
          <div className="absolute bottom-0 right-1/4 w-2 h-2 -mr-1 -mb-1 bg-[#54FB82] rounded-full blur-sm"></div>
        </div>

        {/* Middle Ring */}
        <div className="absolute inset-4 rounded-full border border-[#5AF3F2]/20 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
          <div className="absolute top-1/4 right-0 w-2 h-2 -mr-1 bg-[#54FB82] rounded-full blur-sm"></div>
        </div>

        {/* Interactive Central Core */}
        <motion.div 
          className="absolute inset-8 rounded-full futuristic-panel holographic-effect glow-border pulse-glow cursor-pointer"
          onClick={onStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#5AF3F2]/20 via-[#54FB82]/20 to-[#084229]/30 flex items-center justify-center">
            {/* Central Waste Sorting Icon */}
            <motion.div
              animate={{ 
                rotateY: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-16 h-16 bg-gradient-to-br from-[#5AF3F2] to-[#54FB82] rounded-lg flex items-center justify-center"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-[#090F12]">
                {/* Waste sorting/recycling icon */}
                <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 8V18M15 8V18M9 12H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          </div>
        </motion.div>

        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full blur-sm ${i % 2 === 0 ? 'bg-[#5AF3F2]' : 'bg-[#54FB82]'}`}
            animate={{
              x: [0, Math.cos(i * 60 * Math.PI / 180) * 150],
              y: [0, Math.sin(i * 60 * Math.PI / 180) * 150],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
            style={{
              left: '50%',
              top: '50%',
            }}
          />
        ))}
      </motion.div>

      {/* Interactive Instruction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="text-center space-y-2"
      >
        <p className="text-[#5AF3F2] text-lg">Click the circle to start scanning</p>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center justify-center gap-2 text-[#54FB82]/60"
        >
          <div className="w-2 h-2 bg-[#54FB82] rounded-full"></div>
          <span className="text-sm">Ready to analyze your tray</span>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-[#5AF3F2]/60 text-sm"
      >
        Powered by Advanced AI Recognition Technology
      </motion.footer>
    </motion.div>
  );
}