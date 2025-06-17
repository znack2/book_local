
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CanvasHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CanvasHelpModal = ({ isOpen, onClose }: CanvasHelpModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" style={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(139, 125, 107, 0.2)"
      }}>
        <DialogHeader>
          <DialogTitle style={{ color: "#5a4f3f" }}>How the Business Model Canvas Works</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-sm text-gray-700">
          <p>
            The Business Model Canvas is a strategic management tool that allows you to visualize, design, and reinvent your business model.
          </p>
          
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-amber-900">Key Components:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Value Propositions:</strong> The core value you deliver to customers</li>
                <li><strong>Customer Segments:</strong> The groups of people you serve</li>
                <li><strong>Channels:</strong> How you reach and deliver to customers</li>
                <li><strong>Customer Relationships:</strong> How you interact with customers</li>
                <li><strong>Revenue Streams:</strong> How you make money</li>
                <li><strong>Key Resources:</strong> Essential assets required</li>
                <li><strong>Key Activities:</strong> Critical actions for success</li>
                <li><strong>Key Partners:</strong> Strategic alliances and suppliers</li>
                <li><strong>Cost Structure:</strong> Major costs involved</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-amber-900">How to Use:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Click on any field to edit and add your content</li>
                <li>Use the arrow buttons to navigate between fields</li>
                <li>Each field supports scrolling for longer content</li>
                <li>Your changes are automatically saved</li>
                <li>Click the chapter link to focus on specific sections</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="outline">
            Got it!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CanvasHelpModal;
