import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    // Animate loading dots
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 300);

    // Complete loading after 2 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => {
      clearInterval(dotsInterval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#0D0D0D] flex flex-col items-center justify-center z-50">
      {/* TV Static Animation */}
      <div className="relative w-32 h-32 mb-8 rounded-lg overflow-hidden border-2 border-[#E6A800] shadow-lg shadow-[#E6A800]/20">
        <div className="absolute inset-0 tv-static"></div>
        <div className="absolute inset-0 scanlines"></div>
        <img 
          src="https://mocha-cdn.com/019a4a51-6aba-7e37-9c32-fae9f7a8c064/icon.png" 
          alt="tvc15"
          className="absolute inset-2 w-auto h-auto object-contain opacity-70 z-10"
        />
      </div>

      {/* App Title */}
      <h1 className="text-4xl font-bold text-[#E6A800] mb-4 font-mono tracking-wider">
        tvc15
      </h1>

      {/* Loading Text */}
      <p className="text-white/80 text-lg font-mono">
        Loading{dots}
      </p>

      {/* Glow Effect */}
      <div className="absolute inset-0 bg-[#E6A800]/5 blur-3xl animate-pulse"></div>

      
    </div>
  );
}
