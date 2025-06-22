import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PromoCodeContextType {
  unlockedChapters: number[];
  unlockChapter: (promocode: string) => { success: boolean; bookId?: number; title?: string };
  isChapterUnlocked: (bookId: number) => boolean;
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
  const [unlockedChapters, setUnlockedChapters] = useState<number[]>([]);

  // Load unlocked chapters from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('unlockedChapters');
    if (saved) {
      setUnlockedChapters(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever unlockedChapters changes
  useEffect(() => {
    localStorage.setItem('unlockedChapters', JSON.stringify(unlockedChapters));
  }, [unlockedChapters]);

  const generatePromocode = (title: string): string => {
    return title.toLowerCase().replace(/\s+/g, '') + '2025';
  };

  const unlockChapter = (promocode: string) => {
    // Import galleryData here or pass it as prop
    const galleryData = require('../data/galleryData.json');
    
    const book = galleryData.books.find((book: any) => 
      generatePromocode(book.title) === promocode.toLowerCase()
    );

    if (book && !unlockedChapters.includes(book.id)) {
      setUnlockedChapters(prev => [...prev, book.id]);
      return { success: true, bookId: book.id, title: book.title };
    }

    return { success: false };
  };

  const isChapterUnlocked = (bookId: number): boolean => {
    return unlockedChapters.includes(bookId);
  };

  return (
    <PromoCodeContext.Provider value={{
      unlockedChapters,
      unlockChapter,
      isChapterUnlocked
    }}>
      {children}
    </PromoCodeContext.Provider>
  );
};