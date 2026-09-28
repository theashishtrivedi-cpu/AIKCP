import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export type Profile = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  phone_verified: boolean;
  restriction_until: string | null;
  bio: string | null;
  language_code: string;
  created_at: string;
  updated_at: string;
  role: 'user' | 'editor' | 'moderator' | 'admin';
  status: 'restricted' | 'active' | 'suspended';
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function loadProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Failed to load profile:', error);
    return null;
  }

  return data as Profile;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const applySession = async (nextSession: Session | null) => {
      if (!mounted) return;

      setSession(nextSession);

      if (!nextSession?.user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      /*
       * Load the profile outside the auth-state callback.
       * This avoids Supabase auth callback locking/deadlock issues.
       */
      const nextProfile = await loadProfile(nextSession.user.id);

      if (!mounted) return;

      setProfile(nextProfile);
      setLoading(false);
    };

    const initialise = async () => {
      try {
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('Failed to get session:', error);

          if (mounted) {
            setSession(null);
            setProfile(null);
            setLoading(false);
          }

          return;
        }

        await applySession(currentSession);
      } catch (error) {
        console.error('Auth initialisation failed:', error);

        if (mounted) {
          setSession(null);
          setProfile(null);
          setLoading(false);
        }
      }
    };

    initialise();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;

      /*
       * Do NOT call Supabase database/auth APIs directly inside
       * the auth-state callback.
       *
       * Defer the profile load until after the callback returns.
       */
      setSession(nextSession);

      if (!nextSession?.user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setTimeout(async () => {
        if (!mounted) return;

        const nextProfile = await loadProfile(nextSession.user.id);

        if (!mounted) return;

        setProfile(nextProfile);
        setLoading(false);
      }, 0);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return {
      error: error?.message ?? null,
    };
  };

  const signUp = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName.trim(),
        },
      },
    });

    return {
      error: error?.message ?? null,
    };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    return {
      error: error?.message ?? null,
    };
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}