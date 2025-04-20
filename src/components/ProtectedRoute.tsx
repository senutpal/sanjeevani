import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { hasFeatureAccess } from '@/integrations/supabase/database.types';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  feature?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, feature }) => {
  const { user, profile, isLoading } = useAuth();

  // Show a loading indicator with a timeout to prevent infinite loading
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading Sanjeevani...</p>
        </div>
      </div>
    );
  }

  // Redirect to login page if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If a specific feature is required, check if the user has access
  if (feature && profile) {
    const hasAccess = hasFeatureAccess(profile.role, feature as any);
    
    // If user doesn't have access to this feature, redirect to dashboard
    if (!hasAccess) {
      // If user is a patient, redirect to doctor visit page
      if (profile.role === 'patient') {
        return <Navigate to="/doctor-visit" replace />;
      }
      
      // Otherwise redirect to dashboard
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
