import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LandingPage from './components/LandingPage';
import CameraPage from './components/CameraPage';
import ResultsPage from './components/ResultsPage';
import FinishPage from './components/FinishPage';
import './styles/futuristic.css';

type Page = 'landing' | 'camera' | 'results' | 'finish';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [scanResults, setScanResults] = useState({
    instructions: ["Separate bottle cap", "Drain remaining soup", "Remove plastic wrapper"],
    category: "Mixed Waste",
    confidence: 87
  });

  const navigateToPage = (page: Page) => {
    setCurrentPage(page);
  };

  const handleCameraPermission = (granted: boolean) => {
    setCameraPermission(granted);
    if (granted) {
      // Simulate scanning process
      setTimeout(() => {
        setCurrentPage('results');
      }, 3000);
    }
  };

  const handleFinish = () => {
    setCurrentPage('finish');
    setTimeout(() => {
      setCurrentPage('landing');
      setCameraPermission(null);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#080D0C] to-[#090F12] overflow-hidden">
      {/* Futuristic Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Subtle ambient glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#5AF3F2]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-[#54FB82]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        {/* Animated Grid Lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#5AF3F2]/30 to-transparent animate-pulse" style={{animationDelay: '0s', animationDuration: '4s'}}></div>
          <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-[#54FB82]/30 to-transparent animate-pulse" style={{animationDelay: '2s', animationDuration: '4s'}}></div>
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#5AF3F2]/30 to-transparent animate-pulse" style={{animationDelay: '1s', animationDuration: '4s'}}></div>
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#54FB82]/30 to-transparent animate-pulse" style={{animationDelay: '3s', animationDuration: '4s'}}></div>
        </div>

        {/* Floating Geometric Elements */}
        <div className="absolute top-20 right-20 w-8 h-8 border border-[#5AF3F2]/20 rotate-45 animate-spin" style={{animationDuration: '20s'}}></div>
        <div className="absolute bottom-20 left-20 w-6 h-6 border border-[#54FB82]/20 animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}}></div>
        <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-[#5AF3F2]/10 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-[#54FB82]/10 rounded-full animate-pulse" style={{animationDelay: '2.5s'}}></div>

        {/* Circuit-like connections */}
        <svg className="absolute top-10 left-10 opacity-10" width="200" height="200" viewBox="0 0 200 200">
          <path d="M20 20 L180 20 L180 80 L100 80 L100 120 L180 120 L180 180" 
                stroke="#5AF3F2" strokeWidth="1" fill="none" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" values="0;10" dur="3s" repeatCount="indefinite"/>
          </path>
          <circle cx="20" cy="20" r="2" fill="#5AF3F2" opacity="0.5"/>
          <circle cx="180" cy="80" r="2" fill="#54FB82" opacity="0.5"/>
          <circle cx="100" cy="120" r="2" fill="#5AF3F2" opacity="0.5"/>
        </svg>

        <svg className="absolute bottom-10 right-10 opacity-10" width="150" height="150" viewBox="0 0 150 150">
          <path d="M130 130 L20 130 L20 70 L80 70 L80 30 L20 30 L20 20" 
                stroke="#54FB82" strokeWidth="1" fill="none" strokeDasharray="3,3">
            <animate attributeName="stroke-dashoffset" values="0;6" dur="4s" repeatCount="indefinite"/>
          </path>
          <circle cx="130" cy="130" r="2" fill="#54FB82" opacity="0.5"/>
          <circle cx="80" cy="70" r="2" fill="#5AF3F2" opacity="0.5"/>
          <circle cx="20" cy="30" r="2" fill="#54FB82" opacity="0.5"/>
        </svg>

        {/* Starfield */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#5AF3F2]/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {currentPage === 'landing' && (
              <LandingPage key="landing" onStart={() => navigateToPage('camera')} />
            )}
            {currentPage === 'camera' && (
              <CameraPage 
                key="camera" 
                cameraPermission={cameraPermission}
                onCameraPermission={handleCameraPermission}
              />
            )}
            {currentPage === 'results' && (
              <ResultsPage 
                key="results" 
                results={scanResults}
                onFinish={handleFinish}
              />
            )}
            {currentPage === 'finish' && (
              <FinishPage key="finish" />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}