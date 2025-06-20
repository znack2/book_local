
import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid3X3, EyeOff } from 'lucide-react';
import BusinessCanvas from './BusinessCanvas';

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
      <div className="p-3 bg-white/50 border-b border-amber-200/30 flex justify-between items-center flex-shrink-0" style={{
        height: '60px',
        backgroundColor: 'rgb(239 232 214)',
        borderBottom: '1px solid white'
      }}>
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
        <div className="flex-1 min-h-0 overflow-hidden" style={{
          padding: '10px 15px 0 0px',
          background: '#eadfc5'
        }}>
          <BusinessCanvas isEditable={true} canvasId={canvasId} hideButtons={false} />
        </div>
      )}
    </div>
  );
};

export default CanvasColumn;



