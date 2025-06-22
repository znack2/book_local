import React, { useState, useEffect } from 'react';
import { ArrowLeft, HelpCircle, Eye, EyeOff, Grid3X3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/PageLayout';
import EmailColumn from '@/components/EmailColumn';
import EmailHighlights from '@/components/EmailHighlights';
import CanvasColumn from '@/components/CanvasColumn';
import CanvasHelpModal from '@/components/CanvasHelpModal';
import LoadingScreen from '@/components/LoadingScreen';
import BusinessCanvasTutorial from '@/components/BusinessCanvasTutorial';
import { useTutorialState } from '@/hooks/useTutorialState';
import galleryData from '../data/galleryData.json';

const Chapter: React.FC = () => {
  const {showTutorial, setShowTutorial, markTutorialComplete, showTutorialIfNeeded} = useTutorialState();
  const [showEmails, setShowEmails] = useState(true);
  const [showCanvas, setShowCanvas] = useState(true);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileView, setMobileView] = useState<'emails' | 'canvas'>('emails');
  const [isLoading, setIsLoading] = useState(true);
  const [showEmailAnimations, setShowEmailAnimations] = useState(false);
  
  // Get canvas ID from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const canvasId = urlParams.get('item') || '1';
  
  // Get book data based on canvas ID
  const currentBook = galleryData.books.find(book => book.id === parseInt(canvasId)) || galleryData.books[0];

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    showTutorialIfNeeded();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [showTutorialIfNeeded]);

  // Handle loading completion
  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Start email animations after a short delay
    setTimeout(() => {
      setShowEmailAnimations(true);
    }, 300);
  };

  const handleTutorialClose = () => {
    console.log('Tutorial close clicked'); // Debug log
    markTutorialComplete();
  };

  const handleTutorialComplete = () => {
    console.log('Tutorial complete clicked'); // Debug log
    markTutorialComplete();
  };

  const handleCanvasToggle = () => {
    if (isMobile) {
      setMobileView(mobileView === 'emails' ? 'canvas' : 'emails');
    } else {
      setShowCanvas(!showCanvas);
    }
  };

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="w-full h-screen overflow-auto">
      <PageLayout
        currentChapterId={currentBook.id}
        title={currentBook.title}
        subtitle=""
        activeItem="Business Canvas"
        showBackButton={true}
        showSidebarCard={true}
        showLogoutInHeader={false}
      >
        <div className="flex-1 flex flex-col overflow-hidden h-full relative" style={{ zIndex: 1 }}>
          {/* Desktop Hide Canvas Button - Fixed under header, always visible */}
          {!isMobile && (
            <div className="absolute top-3 right-3 z-30">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCanvasToggle}
                className="transition-all duration-300 bg-gradient-to-r from-amber-200 to-amber-300 text-amber-900 shadow-md"
              >
                {showCanvas ? <EyeOff size={16} className="mr-1" /> : <Grid3X3 size={16} className="mr-2" />}
                <span className="text-xs">
                  {showCanvas ? 'Hide Canvas' : 'Show Canvas'}
                </span>
              </Button>
            </div>
          )}

          {/* Desktop Hide Emails Button - Fixed under header, always visible */}
          {!isMobile && (
            <div className="absolute top-3 left-3 z-30">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEmails(!showEmails)}
                className="transition-all duration-300 bg-gradient-to-r from-amber-200 to-amber-300 text-amber-900 shadow-md"
              >
                {showEmails ? <EyeOff size={16} className="mr-1" /> : <Eye size={16} className="mr-2" />}
                <span className="text-xs">
                  {showEmails ? 'Hide Emails' : 'Show Emails'}
                </span>
              </Button>
            </div>
          )}

          {/* Mobile Controls - Single toggle button */}
          {isMobile && (
            <div className="p-3 bg-white/50 border-b border-amber-200/30 flex justify-center flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMobileView(mobileView === 'emails' ? 'canvas' : 'emails')}
                className="transition-all duration-300 bg-gradient-to-r from-amber-200 to-amber-300 text-amber-900 shadow-md"
              >
                {mobileView === 'emails' ? <Grid3X3 size={16} /> : <Eye size={16} />}
                <span className="ml-1 text-xs">
                  {mobileView === 'emails' ? 'Canvas' : 'Emails'}
                </span>
              </Button>
            </div>
          )}

          <div className="flex-1 flex overflow-hidden relative">
            {/* Mobile View - Single view toggle */}
            {isMobile ? (
              <>
                {mobileView === 'emails' ? (
                  <div className="flex-1 overflow-hidden">
                    <EmailColumn 
                      showEmailToggle={false}
                      isVisible={true}
                      animateEmails={showEmailAnimations}
                      chapterId={canvasId}
                    />
                  </div>
                ) : (
                  <div className="w-full flex flex-col max-h-screen">
                    <div className="flex-1" style={{ background: 'linear-gradient(135deg, #f5f2e8 0%, #e8dcc0 100%)' }}>
                      <div className="bg-white rounded-lg shadow-lg h-full">
                        <CanvasColumn 
                          isVisible={true} 
                          canvasId={canvasId}
                          isHalfWidth={false}
                          showCanvasToggle={false}
                        />
                      </div>
                    </div>
                    
                    {/* Help Section */}
                    <div className="p-4 bg-white/50 border-t border-amber-200/30 flex-shrink-0">
                      <div className="flex items-center justify-between">
                        <span className="text-amber-700 text-sm">Need help with the canvas?</span>
                        <Button
                          onClick={() => setIsHelpModalOpen(true)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 text-amber-700 border-amber-300 hover:bg-amber-100"
                        >
                          <HelpCircle size={16} />
                          Learn How
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Desktop View - Side by Side
              <>
                {/* Left Panel - Emails */}
  {showEmails && (
    <div 
      className={`
        ${showCanvas ? 'flex-1' : 'flex-1 flex justify-center'} 
        overflow-hidden relative transition-all duration-300
      `} 
      style={{ background: 'linear-gradient(135deg, #f5f2e8 0%, #e8dcc0 100%)' }}
    >
      <div className={`${showCanvas ? 'w-full' : 'w-full max-w-4xl'} h-full`}>
        <EmailColumn 
          showEmailToggle={false}
          isVisible={showEmails}
          animateEmails={showEmailAnimations}
          chapterId={canvasId}
        />
      </div>
    </div>
  )}

                {/* Right Panel - Canvas Column - Expand when emails are hidden */}
  {showCanvas && (
    <div 
      className={`
        ${showEmails ? 'flex-1' : 'flex-1 flex justify-center'} 
        overflow-hidden relative transition-all duration-300
      `} 
      style={{ background: 'linear-gradient(135deg, #f5f2e8 0%, #e8dcc0 100%)' }}
    >
      <div className={`${showEmails ? 'w-full' : 'w-full max-w-4xl'} h-full`}>
        <div className="bg-white shadow-lg flex flex-col h-full">
          <CanvasColumn 
            isVisible={showCanvas} 
            canvasId={canvasId}
            isHalfWidth={showEmails}
            showCanvasToggle={false}
          />
          
          {/* Help Section with matching background */}
          <div className="p-4 bg-white/50 border-t border-amber-200/30 flex-shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-amber-700 text-sm">Need help with the canvas?</span>
              <Button
                onClick={() => setIsHelpModalOpen(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-amber-700 border-amber-300 hover:bg-amber-100"
              >
                <HelpCircle size={16} />
                Learn How
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}
              </>
            )}
          </div>
        </div>
      </PageLayout>
      
      <CanvasHelpModal 
        isOpen={isHelpModalOpen} 
        onClose={() => setIsHelpModalOpen(false)} 
      />
      {/* Tutorial Modal */}
      {showTutorial && (
        <BusinessCanvasTutorial
          onClose={handleTutorialClose}
          onComplete={handleTutorialComplete}
        />
      )}
    </div>
  );
};

export default Chapter;
