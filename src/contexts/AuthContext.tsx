import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import promocodesData from '../data/promocodes.json';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  hasPromoAccess: boolean;
  unlockedChapters: number[];
  signUp: (email: string, password: string, fullName?: string, promocode?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  getAccessibleChapters: () => number[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPromoAccess, setHasPromoAccess] = useState(false);
  const [unlockedChapters, setUnlockedChapters] = useState<number[]>([1]); // Chapter 1 is always unlocked

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

  // Helper function to get total number of chapters
  const getTotalChapters = (): number => {
    return Object.keys(promocodesData.chapterCodes).length;
  };

  // Helper function to determine accessible chapters
  const calculateAccessibleChapters = (userPromocode?: string): number[] => {
    if (!userPromocode || userPromocode.trim() === '') {
      return [1]; // Only first chapter without promocode
    }

    const validation = validatePromocode(userPromocode);
    
    if (validation.type === 'master') {
      // Master code unlocks all chapters
      const totalChapters = getTotalChapters();
      return Array.from({ length: totalChapters }, (_, i) => i + 1);
    } else if (validation.type === 'chapter' && validation.chapterId) {
      // Individual chapter code unlocks only that chapter + chapter 1
      return [1, validation.chapterId];
    }
    
    return [1]; // Default to only chapter 1
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Calculate access based on user's promocode
        if (session?.user) {
          const userPromocode = session.user.user_metadata?.promocode;
          const accessibleChapters = calculateAccessibleChapters(userPromocode);
          
          setUnlockedChapters(accessibleChapters);
          
          // Set hasPromoAccess based on whether user has more than just chapter 1
          setHasPromoAccess(accessibleChapters.length > 1);
        } else {
          setUnlockedChapters([1]);
          setHasPromoAccess(false);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const userPromocode = session.user.user_metadata?.promocode;
        const accessibleChapters = calculateAccessibleChapters(userPromocode);
        
        setUnlockedChapters(accessibleChapters);
        setHasPromoAccess(accessibleChapters.length > 1);
      } else {
        setUnlockedChapters([1]);
        setHasPromoAccess(false);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string, promocode?: string) => {
    const redirectUrl = `/questionnaire`;

    // Build the user metadata object
    const userData: { full_name?: string; promocode?: string } = {};
    
    if (fullName) {
      userData.full_name = fullName;
    }
    
    // Only add promocode to metadata if it's provided and valid
    if (promocode && promocode.trim() !== '') {
      const validation = validatePromocode(promocode.trim());
      if (validation.isValid) {
        userData.promocode = promocode.trim();
      }
      // Note: We don't throw an error here for invalid promocodes during signup
      // The user will just get access to chapter 1 only
    }
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: userData
      }
    });
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const getAccessibleChapters = (): number[] => {
    return unlockedChapters;
  };

  const value = {
    user,
    session,
    loading,
    hasPromoAccess,
    unlockedChapters,
    signUp,
    signIn,
    signOut,
    getAccessibleChapters
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};