import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle, Mail, MessageCircle, FileText } from "lucide-react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" style={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(34, 41, 58, 0.2)"
      }}>
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <HelpCircle className="w-8 h-8 text-blue-600" />
          </div>
          <DialogTitle style={{ color: "#22293a" }}>
            Need Help?
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            We're here to help you succeed. Choose how you'd like to get support.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 mt-6">
          <Button 
            variant="outline"
            className="w-full justify-start"
            onClick={() => window.open('mailto:support@greatleads.io', '_blank')}
          >
            <Mail className="w-4 h-4 mr-2" />
            Email Support
          </Button>
          
          <Button 
            variant="outline"
            className="w-full justify-start"
            onClick={() => window.open('https://greatleads.io/chat', '_blank')}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Live Chat
          </Button>
          
          <Button 
            variant="outline"
            className="w-full justify-start"
            onClick={() => window.open('https://greatleads.io/docs', '_blank')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Documentation
          </Button>
        </div>
        
        <div className="flex justify-center mt-6">
          <Button 
            onClick={onClose}
            style={{
              background: '#22293a',
              color: 'white'
            }}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpModal;
