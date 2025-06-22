import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  hasPromoAccess: boolean;
  signUp: (email: string, password: string, fullName?: string, promocode?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
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
  
  const VALID_PROMOCODE = "UNLOCK2024"; // This would normally come from your backend

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check if user has promo access
        if (session?.user) {
          const userPromocode = session.user.user_metadata?.promocode;
          // User has promo access if they have the valid promocode
          setHasPromoAccess(userPromocode === VALID_PROMOCODE);
        } else {
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
        setHasPromoAccess(userPromocode === VALID_PROMOCODE);
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
    
    // Only add promocode to metadata if it's provided
    if (promocode && promocode.trim() !== '') {
      userData.promocode = promocode.trim();
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

  const value = {
    user,
    session,
    loading,
    hasPromoAccess,
    signUp,
    signIn,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};