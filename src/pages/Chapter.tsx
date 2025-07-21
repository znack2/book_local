import React, { useState, useEffect, useCallback } from 'react';
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
import TextSelectionModal from '@/components/TextSelectionModal';

import { useTutorialState } from '@/hooks/useTutorialState';

import galleryData from '../data/galleryData.json';
import canvasDataImport from '../data/canvasData.json';

const Chapter: React.FC = () => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [showFullTutorial, setShowFullTutorial] = useState(false);
  const [showEmails, setShowEmails] = useState(true);
  const [showCanvas, setShowCanvas] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileView, setMobileView] = useState<'emails' | 'canvas'>('emails');
  const [isLoading, setIsLoading] = useState(true);
  const [showEmailAnimations, setShowEmailAnimations] = useState(false);
  const [canvasFields, setCanvasFields] = useState([]);
  const [canvasRefreshKey, setCanvasRefreshKey] = useState(0);
  // Get canvas ID from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const canvasId = urlParams.get('item') || '1';
  
  // Get book data based on canvas ID
  const currentBook = galleryData.books.find(book => book.id === parseInt(canvasId)) || galleryData.books[0];

  // Check tutorial completion status and show tutorial if needed
  useEffect(() => {
    const checkTutorialStatus = () => {
      try {
        const tutorialCompleted = localStorage.getItem('canvas_tutorial_completed');
        if (tutorialCompleted !== 'true') {
          setShowTutorial(true);
        }
      } catch (error) {
        console.error('Error checking tutorial status:', error);
        // If localStorage is not available, don't show tutorial to avoid errors
      }
    };

    checkTutorialStatus();
  }, []);

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Add this useEffect to process canvas data for the modal
  useEffect(() => {
    if (canvasDataImport?.sections) {
      const transformedFields = canvasDataImport.sections.map((section) => ({
        key: section.id,
        label: section.title,
        placeholder: section.subtitle || `Enter ${section.title.toLowerCase()} information`,
        originalSection: section
      }));
      setCanvasFields(transformedFields);
    }
  }, []);

  // Add callback function to refresh canvas
  const handleCanvasUpdate = useCallback(() => {
    console.log('Canvas update triggered from modal');
    setCanvasRefreshKey(prev => prev + 1);
  }, []);

  const handleFirstSave = useCallback(() => {
    console.log('First save completed - showing canvas');
    setShowCanvas(true); // Show canvas after first save
  }, []);

  // Handle loading completion
  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Start email animations after a short delay
    setTimeout(() => {
      setShowEmailAnimations(true);
    }, 300);
  };

  const handleTutorialShow = () => {
    console.log('Tutorial show clicked'); // Debug log
    setShowFullTutorial(true);
  };

  const handleTutorialSkip = () => {
    console.log('Tutorial skip clicked'); // Debug log
    setShowTutorial(false);
    try {
      localStorage.setItem('canvas_tutorial_completed', 'true');
    } catch (error) {
      console.error('Error saving tutorial completion status:', error);
    }
  };

  const handleTutorialClose = () => {
    console.log('Tutorial close clicked'); // Debug log
    setShowTutorial(false);
    setShowFullTutorial(false);
    try {
      localStorage.setItem('canvas_tutorial_completed', 'true');
    } catch (error) {
      console.error('Error saving tutorial completion status:', error);
    }
  };

  const handleTutorialComplete = () => {
    console.log('Tutorial complete clicked'); // Debug log
    setShowTutorial(false);
    setShowFullTutorial(false);
    try {
      localStorage.setItem('canvas_tutorial_completed', 'true');
    } catch (error) {
      console.error('Error saving tutorial completion status:', error);
    }
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
        isMobile={isMobile}
        showSidebarCard={true}
        showLogoutInHeader={false}
      >
        <div className={`flex-1 flex flex-col overflow-hidden h-full relative ${showTutorial ? 'blur-sm' : ''}`} style={{ zIndex: 1 }}>
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
                      isMobile={isMobile}
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
                          isVisible={showCanvas} 
                          canvasId={canvasId}
                          isHalfWidth={showEmails}
                          showCanvasToggle={false}
                          key={`canvas-${canvasId}-${canvasRefreshKey}`} // This forces re-render
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
                          refreshTrigger={canvasRefreshKey}
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


      {/*Or only when emails are visible:*/}
      {/*  {showEmails && (
        <TextSelectionModal 
          canvasId={canvasId}
          canvasFields={canvasFields}
        />
      )}*/}


      {/* Tutorial Overlay with Blur Effect */}
      {showTutorial && !showFullTutorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-4 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Grid3X3 size={32} className="text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Business Canvas Tutorial</h2>
              <p className="text-gray-600">
                Would you like to learn how to use the Business Canvas? This interactive tutorial will guide you through all the features and help you get started.
              </p>
            </div>
            
            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleTutorialShow}
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Show Tutorial
              </Button>
              <Button
                onClick={handleTutorialSkip}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Skip
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Full Tutorial Modal - Only show when explicitly requested */}
      {showFullTutorial && (
        <BusinessCanvasTutorial
          onClose={handleTutorialClose}
          onComplete={handleTutorialComplete}
        />
      )}

      {<TextSelectionModal 
          canvasId={canvasId}
          canvasFields={canvasFields}
          onCanvasUpdate={handleCanvasUpdate}
          onFirstSave={handleFirstSave}
        />}
      
    </div>
  );
};

export default Chapter;