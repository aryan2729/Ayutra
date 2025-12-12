import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from '../contexts/AuthContext';

/**
 * ProtectedRoute component - Similar to NextAuth's middleware
 * Protects routes that require authentication
 */
export function ProtectedRoute({ children, requiredRole = null }) {
  const { data, status } = useSession();
  const location = useLocation();

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2e5e31]"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (status === 'unauthenticated' || !data?.session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role if required
  if (requiredRole && data?.user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

/**
 * withAuth HOC - Alternative way to protect components
 */
export function withAuth(Component, requiredRole = null) {
  return function AuthenticatedComponent(props) {
    return (
      <ProtectedRoute requiredRole={requiredRole}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

export default ProtectedRoute;
