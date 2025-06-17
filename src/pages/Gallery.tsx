import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, Lock } from "lucide-react";
import { TwicImg } from '@twicpics/components/react';
import GalleryModal from "@/components/GalleryModal";
import PageLayout from "@/components/PageLayout";
import ChapterCard from "@/components/ChapterCard";
import LockedChapterModal from "@/components/LockedChapterModal";
import BookmarkIcon from "@/components/BookmarkIcon";
import { useAuth } from "@/contexts/AuthContext";
import galleryData from '../data/galleryData.json';

const Gallery = () => {
  const navigate = useNavigate();
  const { hasPromoAccess } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openedChapters, setOpenedChapters] = useState<number>(0);
  const [lockedModalOpen, setLockedModalOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [chaptersWithContent, setChaptersWithContent] = useState<Set<number>>(new Set());

  // Get unique categories for filter options and limit to 8
  const allCategories = Array.from(new Set(galleryData.books.map(item => item.category)));
  const categories = allCategories.slice(0, 8);

  // Filter items based on selected filter
  const filteredItems = selectedFilter === "All" 
    ? galleryData.books 
    : galleryData.books.filter(item => item.category === selectedFilter);

  // Calculate progress based on opened chapters and check which chapters have content
  useEffect(() => {
    let chaptersCount = 0;
    const chaptersWithContentSet = new Set<number>();
    
    galleryData.books.forEach(item => {
      const hasContent = localStorage.getItem(`canvas-${item.id}-partners`) || 
                        localStorage.getItem(`canvas-${item.id}-activities`) ||
                        localStorage.getItem(`canvas-${item.id}-resources`) ||
                        localStorage.getItem(`canvas-${item.id}-propositions`) ||
                        localStorage.getItem(`canvas-${item.id}-relationships`) ||
                        localStorage.getItem(`canvas-${item.id}-channels`) ||
                        localStorage.getItem(`canvas-${item.id}-segments`) ||
                        localStorage.getItem(`canvas-${item.id}-costs`) ||
                        localStorage.getItem(`canvas-${item.id}-revenue`);
      
      if (hasContent) {
        chaptersCount++;
        chaptersWithContentSet.add(item.id);
      }
    });
    
    setOpenedChapters(chaptersCount);
    setChaptersWithContent(chaptersWithContentSet);
  }, []);

  const progressPercentage = (openedChapters / galleryData.books.length) * 100;

  const handleCardClick = (id: number) => {
    // Check if user has promo access or if it's the first chapter
    if (hasPromoAccess || id === 1) {
      navigate(`/canvas?item=${id}`);
    } else {
      setSelectedChapter(id);
      setLockedModalOpen(true);
    }
  };

  const isChapterLocked = (id: number) => {
    return !hasPromoAccess && id !== 1;
  };

  // Create milestone markers for every 6 chapters - only lines without text
  const createMilestoneMarkers = () => {
    const milestones = [];
    for (let i = 6; i <= galleryData.books.length; i += 6) {
      const position = (i / galleryData.books.length) * 100;
      milestones.push(
        <div
          key={i}
          className="absolute top-0 w-px h-3 bg-amber-600"
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        />
      );
    }
    return milestones;
  };

  // Book SVG icon
  const BookIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-amber-700">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 7h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 11h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <PageLayout 
        id="0"
        title="48 Chapters" 
        subtitle="A PLAYBOOK TO SCALE BUSINESS GLOBALLY"
        activeItem="Email Templates"
        headerActions={
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="outline"
            className="border-gray-200 text-gray-600 hover:bg-gray-50"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(1px)'
            }}
          >
            <Table className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Canvas</span>
          </Button>
        }
        showLogoutInHeader={false}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Progress Bar with Milestones */}
          <div className="px-6 py-4 bg-white/80 border-b border-amber-200/30 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-amber-900">Chapter Progress</span>
              <span className="text-sm text-amber-700">{openedChapters} of {galleryData.books.length} chapters opened</span>
            </div>
            <div className="relative">
              <Progress value={progressPercentage} className="h-3" />
              {createMilestoneMarkers()}
            </div>
          </div>
          
          {/* Access Status Info */}
          {!hasPromoAccess && (
            <div className="px-6 py-3 bg-amber-50 border-b border-amber-200/30 flex-shrink-0">
              <div className="flex items-center gap-2 text-amber-800">
                <Lock className="w-4 h-4" />
                <span className="text-sm">
                  {galleryData.limitedAccessMessage}
                </span>
              </div>
            </div>
          )}
          
          {/* Filter Tags - Limited to 8 */}
          <div className="flex flex-wrap gap-2 px-6 py-4 border-b flex-shrink-0" style={{ borderColor: 'rgba(139, 125, 107, 0.15)' }}>
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedFilter === category ? "default" : "outline"}
                className={`cursor-pointer ${
                  selectedFilter === category 
                    ? "text-white hover:bg-blue-700" 
                    : "text-gray-600 hover:bg-gray-50"
                } border-gray-200`}
                style={{
                  background: selectedFilter === category ? '#3b82f6' : 'rgba(255, 255, 255, 0.9)'
                }}
                onClick={() => setSelectedFilter(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Gallery Grid - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={`relative cursor-pointer transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 group ${
                      isChapterLocked(item.id) ? 'opacity-75' : ''
                    }`}
                    onClick={() => handleCardClick(item.id)}
                    style={{ perspective: '1000px' }}
                  >
                    {/* Lock Icon for locked chapters */}
                    {isChapterLocked(item.id) && (
                      <div className="absolute top-2 right-2 md:top-4 md:right-4 z-10 w-6 h-6 md:w-8 md:h-8 bg-amber-600 rounded-full flex items-center justify-center shadow-lg">
                        <Lock className="w-3 h-3 md:w-4 md:h-4 text-white" />
                      </div>
                    )}

                    {/* Book container with 3D effect */}
                    <div className="relative book-container">
                      {/* Book spine/pages effect */}
                      <div className="absolute top-0 left-0 w-full h-full">
                        {/* Multiple page layers */}
                        <div className="absolute top-1 left-1 w-full h-full bg-gray-300 rounded-r-sm transform -rotate-1 opacity-40"></div>
                        <div className="absolute top-0.5 left-0.5 w-full h-full bg-gray-400 rounded-r-sm transform -rotate-0.5 opacity-60"></div>
                      </div>
                      
                      {/* Main book cover - fit content height */}
                      <div className="relative bg-gradient-to-br from-amber-50 to-amber-100 rounded-sm border border-amber-200 shadow-lg transform-gpu transition-transform duration-300 group-hover:rotateY-5">
                        {/* Bookmark for opened chapters */}
                        {chaptersWithContent.has(item.id) && (
                          <BookmarkIcon size="md" color="text-red-500" />
                        )}
                        
                        {/* Book content */}
                        <div className="p-3 md:p-6 flex flex-col">
                          <div className="flex justify-between items-start mb-2 md:mb-4">
                            <div className="flex gap-1 md:gap-2">
                              {item.tags.slice(0, 2).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs bg-amber-200 text-amber-800 border-amber-300">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex flex-col">
                            <div className="mb-2">
                              <BookIcon />
                            </div>
                            <div className="text-gray-700 text-xs md:text-sm font-bold mb-1 md:mb-2">Chapter {item.id}</div>
                            <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-2 md:mb-3 leading-tight">
                              {item.title}
                            </h3>
                            <p className="text-xs md:text-sm text-gray-700 leading-relaxed mb-3 md:mb-4">
                              {item.preview}
                            </p>
                            
                            <div className="flex justify-between items-end">
                              <div className="text-xs md:text-sm font-medium text-amber-700">
                                {item.emailCount.toLocaleString()} emails
                              </div>
                              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-amber-200 flex items-center justify-center overflow-hidden">
                                <TwicImg domain="bookgoglobal.twic.pics" src={`chapters/chapter-${item.id}.png`} alt="Chapter image" className="w-full h-full object-cover" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Empty State */}
              {filteredItems.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg">No items found for the selected filter.</p>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-16">
              <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">FS GoGlobal</h3>
                    <p className="text-sm text-gray-600">
                      Create beautiful email templates with our intuitive design tools.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Templates</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li><a href="https://greatleads.io" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700">Product Launch</a></li>
                      <li><a href="https://greatleads.io" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700">Newsletter</a></li>
                      <li><a href="https://greatleads.io" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700">Onboarding</a></li>
                      <li><a href="https://greatleads.io" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700">Promotional</a></li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Tools</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li><a href="https://greatleads.io" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700">Business Canvas</a></li>
                      <li><a href="https://greatleads.io" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700">Email Builder</a></li>
                      <li><a href="https://greatleads.io" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700">Analytics</a></li>
                      <li><a href="https://greatleads.io" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700">A/B Testing</a></li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Support</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li><a href="https://greatleads.io" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700">Documentation</a></li>
                      <li><a href="https://greatleads.io" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700">Help Center</a></li>
                      <li><a href="https://greatleads.io" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700">Contact Us</a></li>
                      <li><a href="https://greatleads.io" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700">Community</a></li>
                    </ul>
                  </div>
                </div>
                <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-500">
                  © 2024 FS GoGlobal. All rights reserved.
                </div>
              </div>
            </footer>
          </div>
        </div>
      </PageLayout>
      
      {/* Modal */}
      <GalleryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {/* Locked Chapter Modal */}
      <LockedChapterModal 
        isOpen={lockedModalOpen} 
        onClose={() => setLockedModalOpen(false)}
        chapterNumber={selectedChapter}
      />
    </div>
  );
};

export default Gallery;
