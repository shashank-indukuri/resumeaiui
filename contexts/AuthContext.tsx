'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/superbase'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  hasAccess: boolean
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  hasAccess: false,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const updateOrCreateUser = async (session: Session) => {
    try {
      // First try to get the existing user
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select()
        .eq('id', session.user.id)
        .maybeSingle()

      if (fetchError) {
        console.error('Error fetching user:', fetchError)
        return null
      }

      if (!existingUser) {
        // User doesn't exist, create new user
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .upsert([
            {
              id: session.user.id,
              has_access: false,
              created_at: new Date().toISOString(),
            }
          ])
          .select()
          .maybeSingle()

        if (insertError) {
          console.error('Error creating user:', insertError)
          return null
        }

        return newUser
      }

      return existingUser
    } catch (error) {
      console.error('Error in updateOrCreateUser:', error)
      return null
    }
  }

  useEffect(() => {
    let isMounted = true;
    // Helper to safely set state only if mounted
    const safeSetUser = (user: User | null) => {
      if (isMounted) {
        setUser(user);
      }
    };
    const safeSetLoading = (loading: boolean) => {
      if (isMounted) {
        setLoading(loading);
      }
    };

    // Add a timeout to catch hanging getSession and fallback to localStorage session parse
    let sessionTimeout = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const supaKey = Object.keys(window.localStorage).find(k => k.includes('auth-token'));
        if (supaKey) {
          try {
            const sessionObj = JSON.parse(window.localStorage.getItem(supaKey) || '{}');
            if (sessionObj && sessionObj.user) {
              // Check if the user matches the last signed-in user (by id or email)
              const lastUserId = sessionStorage.getItem('lastUserId');
              const lastUserEmail = sessionStorage.getItem('lastUserEmail');
              const currentUserId = sessionObj.user.id;
              const currentUserEmail = sessionObj.user.email;
              if (
                (!lastUserId && !lastUserEmail) ||
                (lastUserId === currentUserId) ||
                (lastUserEmail && lastUserEmail === currentUserEmail)
              ) {
                sessionStorage.setItem('lastUserId', currentUserId);
                sessionStorage.setItem('lastUserEmail', currentUserEmail);
                safeSetUser({
                  ...sessionObj.user,
                  user_metadata: {
                    ...sessionObj.user.user_metadata,
                    hasAccess: true,
                  },
                });
                safeSetLoading(false);
                return;
              } else {
                // User mismatch, clear fallback
                window.localStorage.removeItem(supaKey);
                sessionStorage.removeItem('lastUserId');
                sessionStorage.removeItem('lastUserEmail');
              }
            }
          } catch (e) {
            console.error('[Auth] Error parsing localStorage session:', e);
          }
        }
      }
      safeSetUser(null);
      safeSetLoading(false);
    }, 2000);

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      clearTimeout(sessionTimeout);
      if (session) {
        const userData = await updateOrCreateUser(session);
        if (userData) {
          safeSetUser({
            ...session.user,
            user_metadata: {
              ...session.user.user_metadata,
              hasAccess: userData?.has_access || false,
            },
          });
        } else {
          safeSetUser(null);
        }
      } else {
        safeSetUser(null);
      }
      safeSetLoading(false);
    }).catch((err) => {
      clearTimeout(sessionTimeout);
      console.error('[Auth] getSession error:', err)
      safeSetUser(null);
      safeSetLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const userData = await updateOrCreateUser(session);
        if (userData) {
          safeSetUser({
            ...session.user,
            user_metadata: {
              ...session.user.user_metadata,
              hasAccess: userData?.has_access || false,
            },
          });
        } else {
          safeSetUser(null);
        }
      } else {
        safeSetUser(null);
      }
      safeSetLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      clearTimeout(sessionTimeout);
      console.log('[Auth] Cleanup: unsubscribed and unmounted')
    };
  }, []);

  // Determine if user has access
  const hasAccess = user?.user_metadata?.hasAccess || false

  // Get the current origin, ensuring it works in both dev and production
  const getRedirectURL = () => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      // Ensure we're not using localhost in production
      if (origin.includes('localhost') && process.env.NODE_ENV === 'production') {
        // This shouldn't happen, but fallback to current URL
        return `${window.location.protocol}//${window.location.host}/dashboard`;
      }
      return `${origin}/dashboard`;
    }
    return '/dashboard'; // fallback for SSR, though usually not needed
  };

  const value = {
    user,
    loading,
    signInWithGoogle: async () => {
      try {
        const redirectTo = getRedirectURL();
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo,
            queryParams: {
              prompt: 'select_account'
            }
          },
        });
        if (error) throw error;
      } catch (error) {
        console.error('Error signing in with Google:', error);
      }
    },
    signOut: async () => {
      try {
        // First clear the user state
        setUser(null)
        // Then sign out from Supabase
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        // Finally redirect to home page
        router.push('/')
      } catch (error) {
        console.error('Error signing out:', error)
        // Even if there's an error, still try to redirect
        router.push('/')
      }
    },
    hasAccess,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
