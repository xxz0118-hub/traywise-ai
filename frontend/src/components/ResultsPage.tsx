import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface ResultsPageProps {
  results: {
    instructions: string[];
    category: string;
    confidence: number;
  };
  onFinish: () => void;
}

export default function ResultsPage({ results, onFinish }: ResultsPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold glow-text mb-4">
          TrayWise Results
        </h1>
        <p className="text-[#5AF3F2]/70 text-lg">
          AI analysis complete. Follow the recommendations below.
        </p>
      </motion.div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        
        {/* Instructions Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="lg:col-span-2"
        >
          <div className="futuristic-panel glow h-full p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-[#5AF3F2] to-[#54FB82] rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#090F12]">
                  <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#FFFFFF]">Sorting Instructions</h2>
            </div>
            
            <div className="space-y-4">
              {results.instructions.map((instruction, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-[#0F1F31]/40 rounded-xl border border-[#5AF3F2]/20"
                >
                  <div className="w-6 h-6 bg-[#54FB82] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-[#090F12] text-sm font-bold">{index + 1}</span>
                  </div>
                  <p className="text-[#FFFFFF]">{instruction}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Category Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="space-y-6"
        >
          <div className="futuristic-panel glow p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-[#54FB82] to-[#084229] rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#FFFFFF]">
                  <path d="M3 6h18l-2 13H5L3 6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-[#FFFFFF]">Waste Category</h2>
            </div>
            
            <div className="text-center space-y-4">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-3xl font-bold text-[#54FB82]"
              >
                {results.category}
              </motion.div>
              
              <div className="text-[#5AF3F2]/70">
                Primary classification based on detected materials
              </div>
            </div>
          </div>

          {/* Confidence Panel */}
          <div className="futuristic-panel glow p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-[#5AF3F2] to-[#54FB82] rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#090F12]">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 12l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-[#FFFFFF]">Confidence</h2>
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-4xl font-bold text-[#5AF3F2] mb-2"
                >
                  {results.confidence}%
                </motion.div>
                <div className="text-[#5AF3F2]/70 text-sm">
                  AI Analysis Accuracy
                </div>
              </div>
              
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.6, duration: 1 }}
              >
                <Progress 
                  value={results.confidence} 
                  className="h-3 bg-[#0F1F31]"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Finish Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="text-center"
      >
        <Button
          onClick={onFinish}
          className="glow-button text-[#FFFFFF] px-12 py-6 text-xl rounded-xl hover:scale-105 transition-transform duration-300"
        >
          <span className="neon-text">Complete Sorting</span>
        </Button>
      </motion.div>
    </motion.div>
  );
}