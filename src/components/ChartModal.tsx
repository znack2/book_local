import React from 'react';

interface ChartModalProps {
  isOpen: boolean;
  title: string;
  chapterId: number;
  position: { x: number; y: number };
  onClose: () => void;
}

const ChartModal: React.FC<ChartModalProps> = ({ isOpen, title, chapterId, position, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Modal positioned at card center */}
      <div 
        className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-md w-80 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: Math.max(160, Math.min(position.x, window.innerWidth - 160)),
          top: Math.max(120, Math.min(position.y, window.innerHeight - 120)),
        }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">
            Chapter {chapterId} Analytics
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Chart Image */}
        <div className="w-full">
          <img 
            src={`/charts/${title || chapterId}.png`}
            alt={`Chapter ${chapterId} Chart`}
            className="w-full h-auto rounded-md border border-gray-200"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZCNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+Q2hhcnQgbm90IGF2YWlsYWJsZTwvdGV4dD4KPHN2Zz4=';
            }}
          />
        </div>
        
        {/* Optional: Chart info */}
        <div className="mt-3 text-xs text-gray-600">
          Performance metrics and analytics for this chapter
        </div>
      </div>
    </>
  );
};

export default ChartModal;