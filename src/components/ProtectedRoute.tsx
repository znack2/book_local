import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, hasPromoAccess } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    if (!loading && user && !hasPromoAccess) {
      // Check if user is trying to access any canvas route
      const isCanvasRoute = location.pathname === '/canvas';
      
      if (isCanvasRoute) {
        // Extract item ID from query parameters
        const searchParams = new URLSearchParams(location.search);
        const itemId = searchParams.get('item');
        const itemNumber = itemId ? parseInt(itemId) : null;
        
        // Only allow access to item 1 (first canvas)
        if (itemNumber !== 1) {
          navigate('/'); // Redirect to first canvas
          toast({
            title: "Promocode Required",
            description: "Please enter a promocode to access all chapters.",
            variant: "destructive",
          });
          return;
        }
        
        // If no item parameter, redirect to first canvas
        if (!itemId) {
          navigate('/canvas?item=1');
          return;
        }
      }
    }
  }, [user, loading, hasPromoAccess, navigate, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ 
        background: 'linear-gradient(135deg, #f5f2e8 0%, #e8dcc0 100%)'
      }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;