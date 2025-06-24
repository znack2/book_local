import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { usePromoCode } from "@/contexts/PromoCodeContext";
import { useToast } from "@/hooks/use-toast";

interface LockedChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapterNumber: number;
}

const LockedChapterModal: React.FC<LockedChapterModalProps> = ({ 
  isOpen, 
  onClose, 
  chapterNumber 
}) => {
  const navigate = useNavigate();
  const { unlockChapter } = usePromoCode();
  const { toast } = useToast();
  
  const [promocodeInput, setPromocodeInput] = useState('');
  const [promocodeError, setPromocodeError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePromocodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromocodeError('');
    setIsLoading(true);
    
    if (!promocodeInput.trim()) {
      setPromocodeError('Please enter a promocode');
      setIsLoading(false);
      return;
    }
    
    try {
      const result = await unlockChapter(promocodeInput);
      
      if (result.success) {
        toast({
          title: "Success! 🎉",
          description: result.message || "Promocode applied successfully!",
        });
        setPromocodeInput('');
        setPromocodeError('');
        
        // If this specific chapter was unlocked, navigate to it
        if (result.chapterId === chapterNumber) {
          onClose();
          navigate(`/canvas?item=${chapterNumber}`);
        } else {
          // If it was a master code or different chapter, just close modal
          onClose();
        }
      } else {
        setPromocodeError(result.message || 'Invalid promocode. Please try again.');
      }
    } catch (error) {
      console.error('Error applying promocode:', error);
      setPromocodeError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const openAvailableChapter = () => {
    console.log('openAvailableChapter');
    onClose();
    navigate(`/canvas?item=1`);
  };

  const handleClose = () => {
    setPromocodeInput('');
    setPromocodeError('');
    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md" style={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(139, 125, 107, 0.2)"
      }}>
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-amber-600" />
          </div>
          <DialogTitle style={{ color: "#5a4f3f" }}>
            Chapter {chapterNumber} is Locked
          </DialogTitle>
          <DialogDescription className="text-gray-600 mb-4">
            This chapter requires a valid promocode to access. Enter a promocode below to unlock this chapter or all chapters.
          </DialogDescription>
        </DialogHeader>

        {/* Promocode Input Section */}
        <div className="space-y-4">
          <form onSubmit={handlePromocodeSubmit} className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Enter Promocode:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promocodeInput}
                  onChange={(e) => setPromocodeInput(e.target.value)}
                  placeholder="Enter your promocode"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  maxLength={16}
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !promocodeInput.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Applying...' : 'Apply'}
                </Button>
              </div>
            </div>
            
            {promocodeError && (
              <p className="text-red-500 text-sm">{promocodeError}</p>
            )}
          </form>

          {/* Help Text */}
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
            <p className="mb-1">💡 <strong>Tip:</strong></p>
            <p>• Use a chapter-specific code to unlock this chapter only</p>
            <p>• Use a master code to unlock all chapters at once</p>
          </div>
        </div>
        
        {/* Alternative Action */}
        <div className="flex justify-center mt-6 pt-4 border-t border-gray-200">
          <Button 
            onClick={openAvailableChapter}
            variant="outline"
            style={{
              background: 'linear-gradient(135deg, #d4c4a8 0%, #c4b59b 100%)',
              color: '#5a4f3f',
              border: 'none'
            }}
            disabled={isLoading}
          >
            Go to Chapter 1 (Free)
          </Button>          
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LockedChapterModal;