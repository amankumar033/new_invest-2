import { useState, useEffect } from 'react';

export default function InvestmentLoader() {
  const [dots, setDots] = useState('');
  const [currentText, setCurrentText] = useState(0);
  
  const loadingTexts = [
    "Analyzing market trends",
    "Calculating investment opportunities", 
    "Preparing personalized insights",
    "Optimizing your portfolio",
    "Almost ready"
  ];
  
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400);
    
    const textInterval = setInterval(() => {
      setCurrentText(prev => (prev + 1) % loadingTexts.length);
    }, 2000);
    
    return () => {
      clearInterval(dotsInterval);
      clearInterval(textInterval);
    };
  }, [loadingTexts.length]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Main Loading Container */}
      <div className="relative">
        {/* Outer Ring */}
        <div className="h-32 w-32 rounded-full border-4 border-gray-700 border-t-green-500 animate-spin"></div>
        
        {/* Middle Ring */}
        <div className="absolute top-4 left-4 h-24 w-24 rounded-full border-4 border-gray-600 border-r-green-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        
        {/* Inner Ring */}
        <div className="absolute top-8 left-8 h-16 w-16 rounded-full border-4 border-gray-500 border-b-green-300 animate-spin" style={{ animationDuration: '2s' }}></div>
        
        {/* Center Logo/Icon */}
        <div className="absolute top-12 left-12 h-8 w-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
          <div className="h-4 w-4 bg-black rounded-full"></div>
        </div>
      </div>
      
      {/* Loading Text */}
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          MyInvestoryy
        </h2>
        <p className="text-green-400 font-medium text-lg mb-1">
          {loadingTexts[currentText]}
        </p>
        <div className="flex justify-center items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-8 w-64 bg-gray-800 rounded-full h-2 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full animate-pulse" style={{ width: '60%' }}></div>
      </div>
      
      {/* Subtitle */}
      <p className="mt-4 text-gray-400 text-sm text-center max-w-md px-4">
        Crafting your personalized investment strategy with cutting-edge financial insights
      </p>
    </div>
  );
}