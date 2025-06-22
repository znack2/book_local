
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogOut } from 'lucide-react';
import BookmarkIcon from './BookmarkIcon';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  currentChapterId: number;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
  showBackButton?: boolean;
  showLogoutInHeader?: boolean;
}

const Header = ({ currentChapterId, title, subtitle, children, showBackButton = false, showLogoutInHeader = true }: HeaderProps) => {
  const location = useLocation();
  const isCanvasPage = location.pathname === '/canvas';
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex justify-between items-center p-[15px_25px] flex-shrink-0 relative" style={{
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(139, 125, 107, 0.2)'
    }}>
      {/* Add bookmark only on canvas/individual pages */}
      {isCanvasPage && <BookmarkIcon size="md" className="right-8" />}
      
      <div className="flex items-center gap-4 relative">
        {showBackButton && (
          <Link to="/">
            <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm flex items-center gap-2">
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back to Gallery</span>
            </Button>
          </Link>
        )}
        <div className="w-9 h-9 rounded-lg overflow-hidden border-2" style={{ borderColor: 'rgba(139, 125, 107, 0.2)' }}>
           <img src={currentChapterId == 0 ? 'favicon.svg' : `https://raw.githubusercontent.com/znack2/book_local/main/docs/chapters/${title}.png`} alt="Chapter image" className="w-full h-full object-cover" />
        </div>
        <div className="flex items-center gap-2">
          <div>
            <h1 style={{ 
              color: '#5a4f3f', 
              fontSize: window.innerWidth < 768 ? '18px' : '24px', 
              fontWeight: '600', 
              marginBottom: '2px' 
            }}>
              {currentChapterId == 0 ? title : `Chapter ${currentChapterId} - ${title}`}
            </h1>
            <span className="hidden md:inline" style={{ color: '#8b7d6b', fontSize: '13px' }}>
              {subtitle}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Children (like canvas button) go here on the right */}
        {children}
        {user && showLogoutInHeader && (
          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm flex items-center gap-2"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;
