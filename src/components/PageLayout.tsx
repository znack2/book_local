
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';

interface PageLayoutProps {
  currentChapterId: number;
  title: string;
  subtitle: string;
  activeItem?: string;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
  showBackButton?: boolean;
  showSidebarCard?: boolean;
  showHeader?: boolean;
  showSidebar?: boolean;
  showLogoutInHeader?: boolean;
}

const PageLayout = ({ 
  currentChapterId,
  title, 
  subtitle, 
  activeItem = "Email Templates", 
  headerActions, 
  children,
  showBackButton = false,
  showSidebarCard = false,
  showHeader = true,
  showSidebar = true,
  showLogoutInHeader = true
}: PageLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile view and handle sidebar behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // On mobile, always collapse sidebar initially
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen flex w-full h-screen overflow-hidden" style={{ 
      background: 'linear-gradient(135deg, #f5f2e8 0%, #e8dcc0 100%)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* Sidebar - Show/hide based on collapsed state, even on mobile */}
      {(!isMobile || !sidebarCollapsed) && showSidebar && (
        <Sidebar 
          currentChapterId={currentChapterId}
          collapsed={sidebarCollapsed} 
          onToggleCollapse={handleSidebarToggle}
          activeItem={activeItem}
          showCard={showSidebarCard}
        />
      )}
      
      {/* Mobile sidebar toggle button */}
      {isMobile && sidebarCollapsed && (
        <button
          onClick={handleSidebarToggle}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-lg"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {showHeader && (<Header 
          currentChapterId={currentChapterId}
          title={title} 
          subtitle={subtitle}
          showBackButton={showBackButton}
          isMobile={isMobile}
          showLogoutInHeader={showLogoutInHeader}
        >
          {headerActions}
        </Header>)}
        
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
