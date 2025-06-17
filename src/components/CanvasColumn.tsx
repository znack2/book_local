
import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid3X3, EyeOff } from 'lucide-react';
import BusinessCanvas from './BusinessCanvas';
import vanillaAppData from '../data/vanillaAppData.json';

interface CanvasColumnProps {
  isVisible: boolean;
  canvasId: string;
  isHalfWidth?: boolean;
  showCanvasToggle?: boolean;
  onCanvasToggle?: () => void;
}

const CanvasColumn: React.FC<CanvasColumnProps> = ({ 
  isVisible, 
  canvasId, 
  isHalfWidth = false,
  showCanvasToggle = false,
  onCanvasToggle
}) => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-3 bg-white/50 border-b border-amber-200/30 flex justify-between items-center flex-shrink-0">
        <h3 className="text-amber-900 text-sm font-semibold">Business Model Canvas</h3>
        {showCanvasToggle && onCanvasToggle && (
          <Button
            variant="outline"
            size="sm"
            onClick={onCanvasToggle}
            className="transition-all duration-300 bg-gradient-to-r from-amber-200 to-amber-300 text-amber-900 shadow-md"
          >
            <EyeOff size={16} className="mr-1" />
            <span className="text-xs">
              Hide Canvas
            </span>
          </Button>
        )}
      </div>
      
      {isVisible && (
        <div className="flex-1 min-h-0 overflow-hidden">
          <BusinessCanvas isEditable={true} canvasId={canvasId} hideButtons={true} />
        </div>
      )}
    </div>
  );
};

export default CanvasColumn;
