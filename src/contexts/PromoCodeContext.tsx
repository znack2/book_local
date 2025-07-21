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

// Local storage keys
const USED_PROMOCODES_KEY = 'usedPromocodes';
const USER_PROMOCODES_KEY = 'userPromocodes';

export const PromoCodeProvider: React.FC<PromoCodeProviderProps> = ({ children }) => {
  const [openChapterId, setOpenChapterId] = useState<number | null>(null);
  const [accessibleChapters, setAccessibleChapters] = useState<number[]>([1]);

  // Helper function to get globally used promocodes from localStorage
  const getGloballyUsedPromocodes = (): string[] => {
    try {
      const stored = localStorage.getItem(USED_PROMOCODES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading globally used promocodes:', error);
      return [];
    }
  };

  // Helper function to save globally used promocodes to localStorage
  const saveGloballyUsedPromocodes = (promocodes: string[]): void => {
    try {
      localStorage.setItem(USED_PROMOCODES_KEY, JSON.stringify(promocodes));
    } catch (error) {
      console.error('Error saving globally used promocodes:', error);
    }
  };

  // Helper function to get user's used promocodes from localStorage
  const getUserPromocodes = (userId: string): string[] => {
    try {
      const stored = localStorage.getItem(`${USER_PROMOCODES_KEY}_${userId}`);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading user promocodes:', error);
      return [];
    }
  };

  // Helper function to save user's promocodes to localStorage
  const saveUserPromocodes = (userId: string, promocodes: string[]): void => {
    try {
      localStorage.setItem(`${USER_PROMOCODES_KEY}_${userId}`, JSON.stringify(promocodes));
    } catch (error) {
      console.error('Error saving user promocodes:', error);
    }
  };

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

  // Check if promocode is already used globally
  const isPromocodeGloballyUsed = (promocode: string): boolean => {
    const globallyUsed = getGloballyUsedPromocodes();
    return globallyUsed.includes(promocode.toUpperCase().trim());
  };

  // Check if user has already used this promocode
  const hasUserUsedPromocode = (userId: string, promocode: string): boolean => {
    const userPromocodes = getUserPromocodes(userId);
    return userPromocodes.includes(promocode.toUpperCase().trim());
  };

  // Mark promocode as used globally and by user
  const markPromocodeAsUsed = (userId: string, promocode: string): void => {
    const upperCode = promocode.toUpperCase().trim();
    
    // Add to global list
    const globallyUsed = getGloballyUsedPromocodes();
    if (!globallyUsed.includes(upperCode)) {
      globallyUsed.push(upperCode);
      saveGloballyUsedPromocodes(globallyUsed);
    }
    
    // Add to user's list
    const userPromocodes = getUserPromocodes(userId);
    if (!userPromocodes.includes(upperCode)) {
      userPromocodes.push(upperCode);
      saveUserPromocodes(userId, userPromocodes);
    }
  };

  // Calculate accessible chapters based on user's promocodes
  const calculateAccessibleChapters = (userId: string): number[] => {
    const userPromocodes = getUserPromocodes(userId);
    const accessibleChapters = new Set<number>([1]); // Always include chapter 1

    userPromocodes.forEach((promocode: string) => {
      const validation = validatePromocode(promocode);
      
      if (validation.type === 'master') {
        // Master code unlocks all chapters
        const totalChapters = galleryData.books.length;
        for (let i = 1; i <= totalChapters; i++) {
          accessibleChapters.add(i);
        }
      } else if (validation.type === 'chapter' && validation.chapterId) {
        // Individual chapter code unlocks that specific chapter
        accessibleChapters.add(validation.chapterId);
      }
    });

    return Array.from(accessibleChapters).sort((a, b) => a - b);
  };

  // Load accessible chapters from current user session
  useEffect(() => {
    const loadUserAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const chapters = calculateAccessibleChapters(session.user.id);
        setAccessibleChapters(chapters);
      } else {
        setAccessibleChapters([1]);
      }
    };

    loadUserAccess();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const chapters = calculateAccessibleChapters(session.user.id);
        setAccessibleChapters(chapters);
      } else {
        setAccessibleChapters([1]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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

      const currentUserId = session.user.id;
      
      // Check if user has already used this promocode
      if (hasUserUsedPromocode(currentUserId, promocode)) {
        return { 
          success: false, 
          message: 'You have already used this promocode.' 
        };
      }

      // Check if promocode is already used globally
      if (isPromocodeGloballyUsed(promocode)) {
        return { 
          success: false, 
          message: 'This promocode has already been used by another user.' 
        };
      }

      // Mark promocode as used
      markPromocodeAsUsed(currentUserId, promocode);

      // Update user metadata for compatibility (optional)
      try {
        const userPromocodes = getUserPromocodes(currentUserId);
        await supabase.auth.updateUser({
          data: {
            ...session.user.user_metadata,
            usedPromocodes: userPromocodes,
            promocode: promocode.trim() // Keep current promocode for compatibility
          }
        });
      } catch (error) {
        console.warn('Could not update user metadata:', error);
        // Continue anyway since we're using localStorage as primary storage
      }

      // Calculate new accessible chapters
      const newAccessibleChapters = calculateAccessibleChapters(currentUserId);
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