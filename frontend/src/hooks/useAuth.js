import { useSession } from '../contexts/AuthContext';

/**
 * useAuth hook - Convenience hook for accessing auth data
 * Similar to NextAuth's useSession but with additional helpers
 */
export function useAuth() {
  const { data, status, loading, signIn, signOut } = useSession();

  return {
    session: data?.session,
    user: data?.user,
    status,
    loading,
    isAuthenticated: status === 'authenticated',
    isUnauthenticated: status === 'unauthenticated',
    isLoading: loading || status === 'loading',
    signIn,
    signOut,
  };
}

export default useAuth;
