
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import BusinessCanvas from './BusinessCanvas';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GalleryModal = ({ isOpen, onClose }: GalleryModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full h-[90vh]" style={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(139, 125, 107, 0.2)"
      }}>
        <DialogHeader>
          <DialogTitle style={{ color: "#5a4f3f" }}>Business Model Canvas - All Chapters</DialogTitle>
        </DialogHeader>
        <div className="w-full h-full overflow-auto">
          <BusinessCanvas isEditable={true} canvasId="gallery" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GalleryModal;
