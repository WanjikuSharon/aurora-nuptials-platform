import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { selectIsAuthenticated, selectCurrentUser, selectAuthLoading } from '../../store/slices/authSlice';
import LoadingSkeleton from '../ui/LoadingSkeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'COUPLE' | 'VENDOR' | 'ADMIN';
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  redirectTo = '/login',
}) => {
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);
  const isLoading = useAppSelector(selectAuthLoading);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="card max-w-md w-full">
          <div className="text-center mb-6">
            <LoadingSkeleton variant="circular" width="60px" height="60px" className="mx-auto mb-4" />
            <LoadingSkeleton variant="text" height="24px" className="mb-2" />
            <LoadingSkeleton variant="text" height="16px" width="200px" className="mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect based on user role
    const roleRedirects = {
      COUPLE: '/couple/dashboard',
      VENDOR: '/vendor/dashboard',
      ADMIN: '/admin/dashboard',
    };
    
    const defaultRedirect = roleRedirects[user?.role as keyof typeof roleRedirects] || '/';
    return <Navigate to={defaultRedirect} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

// Higher-order component for role-based protection
export const withRoleProtection = (
  Component: React.ComponentType,
  requiredRole?: 'COUPLE' | 'VENDOR' | 'ADMIN'
) => {
  return (props: any) => (
    <ProtectedRoute requiredRole={requiredRole}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

// Specific role-based route components
export const CoupleRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole="COUPLE">{children}</ProtectedRoute>
);

export const VendorRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole="VENDOR">{children}</ProtectedRoute>
);

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole="ADMIN">{children}</ProtectedRoute>
);