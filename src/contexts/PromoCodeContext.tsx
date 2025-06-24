import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import promocodesData from '../data/promocodes.json';
import galleryData from '../data/galleryData.json';

interface PromoCodeContextType {
  openChapterId: number | null;
  unlockChapter: (promocode: string) => Promise<{ success: boolean; chapterId?: number; title?: string; message?: string }>;
  isChapterUnlocked: (bookId: number) => boolean;
  setOpenChapter: (chapterId: number | null) => void;
  getAccessibleChapters: () => number[];
}

const PromoCodeContext = createContext<PromoCodeContextType | undefined>(undefined);

export const usePromoCode = () => {
  const context = useContext(PromoCodeContext);
  if (!context) {
    throw new Error('usePromoCode must be used within a PromoCodeProvider');
  }
  return context;
};

interface PromoCodeProviderProps {
  children: ReactNode;
}

export const PromoCodeProvider: React.FC<PromoCodeProviderProps> = ({ children }) => {
  const [openChapterId, setOpenChapterId] = useState<number | null>(null);
  const [accessibleChapters, setAccessibleChapters] = useState<number[]>([1]);

  // Helper function to validate promocodes
  const validatePromocode = (code: string): { isValid: boolean; type: 'master' | 'chapter' | 'none'; chapterId?: number } => {
    if (!code || code.trim() === '') {
      return { isValid: false, type: 'none' };
    }

    const upperCode = code.toUpperCase().trim();
    
    // Check master codes (unlock all chapters)
    if (promocodesData.masterCodes.includes(upperCode)) {
      return { isValid: true, type: 'master' };
    }
    
    // Check individual chapter codes
    for (const [chapterKey, codes] of Object.entries(promocodesData.chapterCodes)) {
      if (codes.includes(upperCode)) {
        const chapterId = parseInt(chapterKey.replace('chapter_', ''));
        return { isValid: true, type: 'chapter', chapterId };
      }
    }
    
    return { isValid: false, type: 'none' };
  };

  // Load accessible chapters from current user session
  useEffect(() => {
    const loadUserAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const userPromocode = session.user.user_metadata?.promocode;
        const chapters = calculateAccessibleChapters(userPromocode);
        setAccessibleChapters(chapters);
      } else {
        setAccessibleChapters([1]);
      }
    };

    loadUserAccess();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const userPromocode = session.user.user_metadata?.promocode;
        const chapters = calculateAccessibleChapters(userPromocode);
        setAccessibleChapters(chapters);
      } else {
        setAccessibleChapters([1]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Helper function to calculate accessible chapters
  const calculateAccessibleChapters = (userPromocode?: string): number[] => {
    if (!userPromocode || userPromocode.trim() === '') {
      return [1]; // Only first chapter without promocode
    }

    const validation = validatePromocode(userPromocode);
    
    if (validation.type === 'master') {
      // Master code unlocks all chapters
      const totalChapters = galleryData.books.length;
      return Array.from({ length: totalChapters }, (_, i) => i + 1);
    } else if (validation.type === 'chapter' && validation.chapterId) {
      // Individual chapter code unlocks only that chapter + chapter 1
      return [1, validation.chapterId];
    }
    
    return [1]; // Default to only chapter 1
  };

  const unlockChapter = async (promocode: string): Promise<{ success: boolean; chapterId?: number; title?: string; message?: string }> => {
    const validation = validatePromocode(promocode);
    
    if (!validation.isValid) {
      return { 
        success: false, 
        message: 'Invalid promocode. Please check and try again.' 
      };
    }

    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        return { 
          success: false, 
          message: 'Please sign in to use promocodes.' 
        };
      }

      // Check if user already has this promocode
      const currentPromocode = session.user.user_metadata?.promocode;
      if (currentPromocode === promocode.trim()) {
        return { 
          success: false, 
          message: 'You have already used this promocode.' 
        };
      }

      // Update user metadata with new promocode
      const { error } = await supabase.auth.updateUser({
        data: {
          ...session.user.user_metadata,
          promocode: promocode.trim()
        }
      });

      if (error) {
        console.error('Error updating user metadata:', error);
        return { 
          success: false, 
          message: 'Failed to apply promocode. Please try again.' 
        };
      }

      // Calculate new accessible chapters
      const newAccessibleChapters = calculateAccessibleChapters(promocode.trim());
      setAccessibleChapters(newAccessibleChapters);

      if (validation.type === 'master') {
        // Close all chapters first
        setOpenChapterId(null);
        
        return { 
          success: true, 
          message: 'All chapters unlocked! You now have full access to the playbook.' 
        };
      } else if (validation.type === 'chapter' && validation.chapterId) {
        const book = galleryData.books.find(book => book.id === validation.chapterId);
        
        if (book) {
          // Close all chapters first
          setOpenChapterId(null);
          
          // Open the specific chapter after a brief delay
          setTimeout(() => {
            setOpenChapterId(validation.chapterId!);
          }, 100);
          
          return { 
            success: true, 
            chapterId: validation.chapterId, 
            title: book.title,
            message: `Chapter ${validation.chapterId} unlocked: ${book.title}` 
          };
        }
      }

      return { 
        success: false, 
        message: 'Chapter not found.' 
      };
    } catch (error) {
      console.error('Error in unlockChapter:', error);
      return { 
        success: false, 
        message: 'An unexpected error occurred. Please try again.' 
      };
    }
  };

  const isChapterUnlocked = (bookId: number): boolean => {
    return accessibleChapters.includes(bookId);
  };

  const setOpenChapter = (chapterId: number | null) => {
    setOpenChapterId(chapterId);
  };

  const getAccessibleChapters = (): number[] => {
    return accessibleChapters;
  };

  return (
    <PromoCodeContext.Provider value={{
      openChapterId,
      unlockChapter,
      isChapterUnlocked,
      setOpenChapter,
      getAccessibleChapters
    }}>
      {children}
    </PromoCodeContext.Provider>
  );
};