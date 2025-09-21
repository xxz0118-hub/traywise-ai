import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';

interface CameraPageProps {
  cameraPermission: boolean | null;
  onCameraPermission: (granted: boolean) => void;
}

export default function CameraPage({ cameraPermission, onCameraPermission }: CameraPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6 }}
      className="text-center space-y-8"
    >
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl md:text-6xl font-bold glow-text"
      >
        Scan Your Tray
      </motion.h1>

      <AnimatePresence mode="wait">
        {cameraPermission === null && (
          <motion.div
            key="permission"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Permission Card */}
            <div className="futuristic-panel glow max-w-md mx-auto p-8 rounded-2xl">
              <div className="space-y-6">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#5AF3F2] to-[#54FB82] rounded-full flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-[#090F12]">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-[#FFFFFF] mb-2">Allow Camera Access?</h3>
                  <p className="text-[#5AF3F2]/70">
                    TrayWise AI needs camera access to analyze your food tray and provide sorting recommendations.
                  </p>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => onCameraPermission(false)}
                    className="px-6 py-3 bg-red-500/20 border border-red-400/50 text-red-300 hover:bg-red-500/30 rounded-xl"
                  >
                    Deny
                  </Button>
                  <Button
                    onClick={() => onCameraPermission(true)}
                    className="glow-button px-6 py-3 text-[#FFFFFF] rounded-xl"
                  >
                    <span className="neon-text">Allow</span>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {cameraPermission === true && (
          <motion.div
            key="camera"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Camera Preview Panel */}
            <div className="futuristic-panel glow max-w-2xl mx-auto rounded-2xl overflow-hidden">
              <div className="relative aspect-video bg-gradient-to-br from-[#141C28] via-[#0F1F31] to-[#080D0C] scanning-animation">
                {/* Simulated Camera Feed */}
                <div className="absolute inset-0 cyber-grid opacity-30"></div>
                
                {/* Scanning Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 mx-auto border-4 border-transparent border-t-[#5AF3F2] rounded-full"
                    />
                    <p className="text-[#5AF3F2]">Analyzing tray contents...</p>
                  </div>
                </div>

                {/* Scanning Grid Lines */}
                <motion.div
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0"
                >
                  <div className="absolute top-1/3 left-0 right-0 h-px bg-[#5AF3F2]/50"></div>
                  <div className="absolute bottom-1/3 left-0 right-0 h-px bg-[#5AF3F2]/50"></div>
                  <div className="absolute top-0 bottom-0 left-1/3 w-px bg-[#5AF3F2]/50"></div>
                  <div className="absolute top-0 bottom-0 right-1/3 w-px bg-[#5AF3F2]/50"></div>
                </motion.div>

                {/* Corner Brackets */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#5AF3F2]"></div>
                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-[#5AF3F2]"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-[#5AF3F2]"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[#5AF3F2]"></div>
              </div>
            </div>

            {/* Status */}
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-[#5AF3F2]"
            >
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-[#5AF3F2] rounded-full animate-pulse"></div>
                <span>AI Processing in progress...</span>
              </div>
            </motion.div>
          </motion.div>
        )}

        {cameraPermission === false && (
          <motion.div
            key="denied"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            <div className="futuristic-panel max-w-md mx-auto p-8 rounded-2xl border-red-400/50">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-red-400">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                    <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className="text-xl text-red-300">Camera Access Denied</h3>
                <p className="text-red-200/70">
                  Please enable camera access to use TrayWise AI scanning functionality.
                </p>
                <Button
                  onClick={() => onCameraPermission(null)}
                  className="glow-button text-[#FFFFFF] rounded-xl"
                >
                  <span className="neon-text">Try Again</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}