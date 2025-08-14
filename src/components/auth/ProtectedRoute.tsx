
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Lock, LogIn } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, fallback }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Card className="w-full max-w-md mx-auto mt-16">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle>Authentication Required</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            You need to sign in to access this feature.
          </p>
          <Button onClick={() => navigate('/auth')} className="w-full">
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
