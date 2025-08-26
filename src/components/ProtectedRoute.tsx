import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '@/services/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // First check local storage
        if (!authService.isAuthenticated()) {
          setIsValid(false);
          setIsLoading(false);
          return;
        }

        // Verify token with backend
        const isValidToken = await authService.verifyToken();
        
        if (!isValidToken) {
          setIsValid(false);
          setIsLoading(false);
          return;
        }

        // Check admin role if required
        if (requireAdmin && !authService.isAdmin()) {
          setIsValid(false);
          setIsLoading(false);
          return;
        }

        setIsValid(true);
      } catch (error) {
        console.error('Auth verification error:', error);
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [requireAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

