
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
          <DialogDescription className="text-gray-600">
            This chapter requires a valid promocode to access. Please contact your administrator or sign up with a valid promocode to unlock all chapters.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center mt-6">
          <Button 
            onClick={onClose}
            style={{
              background: 'linear-gradient(135deg, #d4c4a8 0%, #c4b59b 100%)',
              color: '#5a4f3f'
            }}
          >
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LockedChapterModal;
