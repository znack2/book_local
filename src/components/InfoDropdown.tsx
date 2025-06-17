
import React, { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';
import { TwicImg } from '@twicpics/components/react';

const InfoDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="p-1.5 rounded-md transition-all duration-300 text-amber-700 hover:bg-amber-200/20 z-50 relative"
        type="button"
      >
        <Info size={16} />
      </button>
      
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[9999]" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Content */}
          <div 
            className="absolute top-full right-0 mt-2 bg-white border border-amber-200/40 rounded-xl shadow-xl p-4 min-w-72"
            style={{ 
              zIndex: 99999,
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
          >
            <div className="text-sm font-semibold text-amber-900 mb-3 border-b border-amber-200/30 pb-2">
              Canvas Studio Analytics
            </div>
            
            <div className="w-full mb-3 rounded-lg overflow-hidden">
              <TwicImg domain="bookgoglobal.twic.pics" src={`data/data_${id}.png`} alt="Analytics Dashboard" className="w-full h-full object-cover" />
            </div>
            
            <div className="flex gap-4 mb-3">
              <div className="text-center flex-1">
                <div className="text-lg font-bold text-amber-300 mb-0.5">127</div>
                <div className="text-[10px] text-amber-700 font-medium">Active Templates</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-lg font-bold text-amber-300 mb-0.5">89%</div>
                <div className="text-[10px] text-amber-700 font-medium">Success Rate</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-lg font-bold text-amber-300 mb-0.5">2.3k</div>
                <div className="text-[10px] text-amber-700 font-medium">Users Online</div>
              </div>
            </div>
            
            <div className="text-[10px] text-amber-700 leading-relaxed">
              Business Model Canvas has been used by over 5 million entrepreneurs worldwide. 
              The methodology was developed by Alexander Osterwalder and has become the standard 
              for strategic planning and business model innovation.
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InfoDropdown;
