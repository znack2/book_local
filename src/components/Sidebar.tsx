import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut, HelpCircle, ExternalLink, BookOpen, Video, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import HelpModal from "./HelpModal";
import BookmarkIcon from "./BookmarkIcon";
import galleryData from '../data/galleryData.json';


interface SidebarProps {
  currentChapterId: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeItem?: string;
  showCard?: boolean;
  currentChapterId?: string;
}

const Sidebar = ({ 
  currentChapterId,
  collapsed, 
  onToggleCollapse, 
  activeItem = "Email Templates", 
  showCard = false
}: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [openedChapters, setOpenedChapters] = useState<number>(0);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const navigationItems = [
    { 
      icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22,6 12,13 2,6", 
      text: "Playbook", 
      active: location.pathname === '/' || activeItem === "Email Templates",
      onClick: () => navigate('/')
    },
    { 
      icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14,2 14,8 20,8", 
      text: "Articles", 
      active: location.pathname === '/articles' || activeItem === "Articles",
      onClick: () => navigate('/articles')
    },
    { 
      icon: "M23 7l-7 5 7 5V7z M16 4H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0-2-2z", 
      text: "Videos", 
      active: location.pathname === '/videos' || activeItem === "Videos",
      onClick: () => navigate('/videos')
    }
  ];

  // Function to update progress
  const updateProgress = () => {
    let chaptersCount = 0;
    
    galleryData.books.forEach(item => {
      // Check if chapter has been visited/opened
      const hasContent = localStorage.getItem(`canvas-${item.id}-partners`) || 
                        localStorage.getItem(`canvas-${item.id}-activities`) ||
                        localStorage.getItem(`canvas-${item.id}-resources`) ||
                        localStorage.getItem(`canvas-${item.id}-propositions`) ||
                        localStorage.getItem(`canvas-${item.id}-relationships`) ||
                        localStorage.getItem(`canvas-${item.id}-channels`) ||
                        localStorage.getItem(`canvas-${item.id}-segments`) ||
                        localStorage.getItem(`canvas-${item.id}-costs`) ||
                        localStorage.getItem(`canvas-${item.id}-revenue`) ||
                        localStorage.getItem(`chapter-${item.id}-visited`); // Additional check for visited chapters
      
      if (hasContent) {
        chaptersCount++;
      }
    });
    
    // Debug logging
    console.log('Sidebar - Chapters with content:', chaptersCount, 'out of', galleryData.books.length);
    
    setOpenedChapters(chaptersCount);
  };

  // Calculate opened chapters progress with event listeners
  useEffect(() => {
    updateProgress();
    
    // Listen for storage changes to update progress when returning from canvas
    const handleStorageChange = () => {
      updateProgress();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', updateProgress);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', updateProgress);
    };
  }, []);

  console.log('currentChapterId:', currentChapterId);

  // Get the first book from gallery data for the card
  const currentBook = currentChapterId 
    ? galleryData.books.find(book => book.id === parseInt(currentChapterId)) || galleryData.books[0]
    : galleryData.books[0];

  // Check if first book has been opened (has content in localStorage)
  const hasCurrentBookContent = localStorage.getItem(`canvas-${currentBook.id}-partners`) || 
                               localStorage.getItem(`canvas-${currentBook.id}-activities`) ||
                               localStorage.getItem(`canvas-${currentBook.id}-resources`) ||
                               localStorage.getItem(`canvas-${currentBook.id}-propositions`) ||
                               localStorage.getItem(`canvas-${currentBook.id}-relationships`) ||
                               localStorage.getItem(`canvas-${currentBook.id}-channels`) ||
                               localStorage.getItem(`canvas-${currentBook.id}-segments`) ||
                               localStorage.getItem(`canvas-${currentBook.id}-costs`) ||
                               localStorage.getItem(`canvas-${currentBook.id}-revenue`) ||
                               localStorage.getItem(`chapter-${currentBook.id}-visited`);

  const handleCardClick = () => {
    // Mark chapter as visited when opening from sidebar
    localStorage.setItem(`chapter-${currentBook.id}-visited`, 'true');
    localStorage.setItem('lastOpenedChapter', currentBook.id.toString());
    navigate(`/canvas?item=${currentBook.id}`);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleAboutClick = () => {
    window.open('https://greatleads.io', '_blank');
  };

  const progressPercentage = (openedChapters / galleryData.books.length) * 100;

  return (
    <>
      <div className={`${collapsed && isMobile ? 'w-[60px]' : collapsed ? 'w-[70px]' : 'w-[240px]'} transition-all duration-300 ease-in-out relative`} style={{
        background: '#22293a',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {/* SVG Pattern Background */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="flex flex-col h-full p-[15px_0] relative z-10">
          {/* Sidebar Header */}
          <div className={`${collapsed ? 'px-3 justify-center' : 'px-4 justify-between'} pb-6 border-b border-white/10 mb-4 flex items-center`}>
            {!collapsed && (
              <h2 className="text-white text-xl font-semibold">
                FS GoGlobal
              </h2>
            )}
            <button 
              onClick={onToggleCollapse}
              className={`p-1 rounded-md transition-all duration-300 text-white/70 hover:text-white hover:bg-white/10 ${collapsed ? 'rotate-180' : ''}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
          </div>

          {/* Book Card Section - Only show if showCard is true and not collapsed and not mobile */}
          {showCard && !collapsed && !isMobile && (
            <div className="px-4 mb-6">
              <div 
                className="relative cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                onClick={handleCardClick}
              >
                {/* Book container with 3D effect */}
                <div className="relative">
                  {/* Book spine/pages effect */}
                  <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-1 left-1 w-full h-full bg-gray-300 rounded-r-sm transform -rotate-1 opacity-40"></div>
                    <div className="absolute top-0.5 left-0.5 w-full h-full bg-gray-400 rounded-r-sm transform -rotate-0.5 opacity-60"></div>
                  </div>
                  
                  {/* Main book cover with bookmark */}
                  <div className="relative bg-gradient-to-br from-amber-50 to-amber-100 rounded-sm border border-amber-200 min-h-[300px] shadow-lg">
                    {/* Bookmark for opened chapters */}
                    {hasCurrentBookContent && (
                      <BookmarkIcon size="md" color="text-red-500" />
                    )}
                    
                    {/* Book content */}
                    <div className="p-4 h-full flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex gap-2">
                          {currentBook.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-amber-200 text-amber-800 border-amber-300">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex-1 flex flex-col">
                        <div className="mb-2">
                        <img src={currentBook.logo} alt="Chapter logo" className="w-8 h-8 rounded object-cover" />
                        </div>
                        <div className="text-gray-700 text-xs font-bold mb-1">Chapter {currentBook.id}</div>
                        <h3 className="text-sm font-bold text-gray-900 mb-2 leading-tight">
                          {currentBook.title}
                        </h3>
                        <p className="text-xs text-gray-700 leading-relaxed flex-1">
                          {currentBook.preview}
                        </p>
                        
                        <div className="flex justify-between items-end mt-3">
                          <div className="text-xs font-medium text-amber-700">
                            {hasCurrentBookContent ? 'In Progress' : 'Available'}
                          </div>
                          <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center overflow-hidden">
                            <img src={`https://raw.githubusercontent.com/znack2/book_local/main/docs/logos/${currentBook.title}.svg`} alt="Chapter logo" className="w-full h-full object-cover" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Progress Section */}
          {!collapsed && !isMobile && (
            <div className="px-4 pb-5 mb-4 border-b border-white/10">
              <div className="text-white/70 text-xs font-medium mb-2">
                Chapter Progress
              </div>
              <div className="w-full h-[6px] rounded-[3px] overflow-hidden mb-2 bg-white/20">
                <div className="h-full rounded-[3px] transition-all duration-300 bg-white/60" style={{ 
                  width: `${progressPercentage}%`
                }}></div>
              </div>
              <div className="text-white/50 text-xs text-center">
                {openedChapters} of {galleryData.books.length} completed
              </div>
            </div>
          )}
          
          {/* Navigation */}
          <div className="flex-1 px-2">
            {navigationItems.map((item, index) => (
              <div 
                key={index} 
                className={`flex items-center p-[10px_12px] m-[3px_0] rounded-[10px] cursor-pointer transition-all duration-300 font-medium text-sm ${
                  item.active 
                    ? 'text-white bg-white/20 shadow-lg' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                onClick={item.onClick}
              >
                <svg className={`min-w-[20px] ${collapsed ? 'mr-0' : 'mr-[10px]'} transition-all duration-300`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d={item.icon}/>
                </svg>
                {!collapsed && (
                  <span className="whitespace-nowrap transition-opacity duration-300">
                    {item.text}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="px-2 space-y-1">
            {/* About Me Button */}
            <div 
              className="flex items-center p-[10px_12px] rounded-[10px] cursor-pointer transition-all duration-300 font-medium text-sm text-white/70 hover:text-white hover:bg-white/10"
              onClick={handleAboutClick}
            >
              <ExternalLink className={`min-w-[20px] ${collapsed ? 'mr-0' : 'mr-[10px]'} transition-all duration-300`} width="20" height="20" />
              {!collapsed && (
                <span className="whitespace-nowrap transition-opacity duration-300">
                  About Me
                </span>
              )}
            </div>

            {/* Help Button */}
            <div 
              className="flex items-center p-[10px_12px] rounded-[10px] cursor-pointer transition-all duration-300 font-medium text-sm text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => setHelpModalOpen(true)}
            >
              <HelpCircle className={`min-w-[20px] ${collapsed ? 'mr-0' : 'mr-[10px]'} transition-all duration-300`} width="20" height="20" />
              {!collapsed && (
                <span className="whitespace-nowrap transition-opacity duration-300">
                  Help
                </span>
              )}
            </div>

            {/* Logout Button */}
            <div 
              className="flex items-center p-[10px_12px] rounded-[10px] cursor-pointer transition-all duration-300 font-medium text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10"
              onClick={handleSignOut}
            >
              <LogOut className={`min-w-[20px] ${collapsed ? 'mr-0' : 'mr-[10px]'} transition-all duration-300`} width="20" height="20" />
              {!collapsed && (
                <span className="whitespace-nowrap transition-opacity duration-300">
                  Logout
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      <HelpModal isOpen={helpModalOpen} onClose={() => setHelpModalOpen(false)} />
    </>
  );
};

export default Sidebar;