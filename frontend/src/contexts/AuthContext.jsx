import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { signIn, signOut, getSession, refreshSession } from '../lib/auth';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('unauthenticated'); // 'loading' | 'authenticated' | 'unauthenticated'

  // Initialize session on mount
  useEffect(() => {
    const initSession = async () => {
      try {
        const currentSession = getSession();
        if (currentSession) {
          setSession(currentSession);
          setStatus('authenticated');
        } else {
          setStatus('unauthenticated');
        }
      } catch (error) {
        console.error('Error initializing session:', error);
        setStatus('unauthenticated');
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // Check session periodically
    const interval = setInterval(() => {
      const currentSession = getSession();
      if (currentSession) {
        setSession(currentSession);
        setStatus('authenticated');
      } else {
        setSession(null);
        setStatus('unauthenticated');
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Refresh session when needed
  useEffect(() => {
    if (session) {
      const expires = new Date(session.expires);
      const now = new Date();
      const timeUntilExpiry = expires.getTime() - now.getTime();

      // Refresh if less than 5 minutes until expiry
      if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
        refreshSession().then((newSession) => {
          if (newSession) {
            setSession(newSession);
          }
        });
      }
    }
  }, [session]);

  const handleSignIn = useCallback(async (providerId, credentials = {}) => {
    try {
      setLoading(true);
      const newSession = await signIn(providerId, credentials);
      setSession(newSession);
      setStatus('authenticated');
      return { success: true, session: newSession };
    } catch (error) {
      setStatus('unauthenticated');
      return {
        success: false,
        error: error.message || 'Authentication failed',
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      setLoading(true);
      await signOut();
      setSession(null);
      setStatus('unauthenticated');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Sign out failed',
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    data: {
      session,
      user: session?.user || null,
    },
    status,
    loading,
    signIn: handleSignIn,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useSession hook - Similar to NextAuth's useSession
 */
export function useSession() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSession must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
