
import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const loadingSteps = [
    { name: 'Loading emails...', icon: '📧' },
    { name: 'Loading highlights...', icon: '✨' },
    { name: 'Loading canvas...', icon: '🎨' }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < loadingSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setTimeout(onComplete, 500);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [currentStep, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{
      background: 'rgba(255, 249, 242, 0.95)',
      backdropFilter: 'blur(10px)'
    }}>
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="text-2xl mb-2">📚</div>
          <h2 className="text-xl font-semibold text-amber-900 mb-2">Loading Chapter</h2>
          <p className="text-amber-700">Preparing your content...</p>
        </div>
        
        <div className="space-y-4">
          {loadingSteps.map((step, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                index <= currentStep 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-400'
              }`}>
                {index <= currentStep ? <Check size={14} /> : step.icon}
              </div>
              <span className={`transition-all duration-300 ${
                index <= currentStep ? 'text-green-700 font-medium' : 'text-amber-700'
              }`}>
                {step.name}
              </span>
              {index === currentStep && (
                <div className="ml-auto">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-amber-300 border-t-amber-600"></div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-amber-400 to-amber-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / loadingSteps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
