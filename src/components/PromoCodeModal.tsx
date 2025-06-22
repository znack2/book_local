import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Unlock } from 'lucide-react';
import { usePromoCode } from '@/contexts/PromoCodeContext';
import { toast } from '@/components/ui/use-toast';

interface PromoCodeModalProps {
  children: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const PromoCodeModal: React.FC<PromoCodeModalProps> = ({ 
  children, 
  isOpen, 
  onOpenChange 
}) => {
  const [promocode, setPromocode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { unlockChapter } = usePromoCode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = unlockChapter(promocode.trim());
      
      if (result.success) {
        toast({
          title: "Chapter Unlocked! 🎉",
          description: `You now have access to "${result.title}"`,
        });
        setPromocode('');
        onOpenChange?.(false);
      } else {
        toast({
          title: "Invalid Promocode",
          description: "Please check your promocode and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Enter Promocode
          </DialogTitle>
          <DialogDescription>
            Enter your promocode to unlock this chapter and gain access to exclusive content.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="promocode">Promocode</Label>
            <Input
              id="promocode"
              placeholder="Enter promocode..."
              value={promocode}
              onChange={(e) => setPromocode(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!promocode.trim() || isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                "Unlocking..."
              ) : (
                <>
                  <Unlock className="h-4 w-4" />
                  Unlock Chapter
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};