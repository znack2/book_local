import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, Lock, Filter, ChevronDown, ChevronUp, Check, BarChart3, Grid, List, Eye, CheckCircle, BookOpen } from "lucide-react";
import GalleryModal from "@/components/GalleryModal";
import PageLayout from "@/components/PageLayout";
import LockedChapterModal from "@/components/LockedChapterModal";
import BookmarkIcon from "@/components/BookmarkIcon";
import { useAuth } from "@/contexts/AuthContext";
import { usePromoCode } from "@/contexts/PromoCodeContext";
import { useToast } from "@/hooks/use-toast";
import galleryData from '../data/galleryData.json';
import canvasData from '../data/canvasData.json';
import BookIndexView from '@/components/BookIndexView';
import RecommendationBanner from '../components/RecommendationBanner';

const COUNT_STORAGE_KEY = 'openedChaptersCount';
const LIST_STORAGE_KEY = 'openedChaptersList';

const Gallery = () => {
  const navigate = useNavigate();
  const { hasPromoAccess } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openedChapters, setOpenedChapters] = useState<number>(0);
  const [lockedModalOpen, setLockedModalOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [chaptersWithContent, setChaptersWithContent] = useState<Set<number>>(new Set());
  const [lastOpenedChapter, setLastOpenedChapter] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showPromocode, setShowPromocode] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'index'>('cards'); // Default to cards for mobile
  const [chartModal, setChartModal] = useState<{isOpen: boolean, chapterId: number | null, position: {x: number, y: number}}>({
    isOpen: false,
    title: null,
    position: {x: 0, y: 0}
  });

  const { unlockChapter, openChapterId, setOpenChapter, isChapterUnlocked } = usePromoCode();
  const { toast } = useToast();
  const [promocodeInput, setPromocodeInput] = useState('');
  const [promocodeError, setPromocodeError] = useState('');

  // Tag to emoji mapping
  const tagEmojiMap = {
    'USA': '🇺🇸',
    'UK': '🇬🇧', 
    'India': '🇮🇳',
    'Kazakhstan': '🇰🇿',
    'Brasil': '🇧🇷'
  };

  // Function to get emoji for tag
  const getTagEmoji = (tag) => {
    return tagEmojiMap[tag] || '🌍';
  };

  const getRandomGradient = (id) => {
    const gradients = [
      'linear-gradient(45deg, #667eea, #764ba2, #667eea, #764ba2)',
      'linear-gradient(45deg, #f093fb, #f5576c, #f093fb, #f5576c)',
      'linear-gradient(45deg, #4facfe, #00f2fe, #4facfe, #00f2fe)',
      'linear-gradient(45deg, #43e97b, #38f9d7, #43e97b, #38f9d7)',
      'linear-gradient(45deg, #fa709a, #fee140, #fa709a, #fee140)',
      'linear-gradient(45deg, #a8edea, #fed6e3, #a8edea, #fed6e3)',
      'linear-gradient(45deg, #ff9a9e, #fecfef, #ff9a9e, #fecfef)',
      'linear-gradient(45deg, #ffecd2, #fcb69f, #ffecd2, #fcb69f)',
      'linear-gradient(45deg, #ff8a80, #ffb74d, #ff8a80, #ffb74d)',
      'linear-gradient(45deg, #81c784, #aed581, #81c784, #aed581)'
    ];
    return gradients[id % gradients.length];
  };

  // Function to get last canvas content from localStorage
  const getLastCanvasContent = (chapterId) => {
    const sectionIds = [
      'key-partners',
      'key-activities', 
      'key-resources',
      'value-proposition',
      'customer-relationships',
      'channels',
      'customer-segments',
      'cost-structure',
      'revenue-streams'
    ];
    
    let lastContent = null;
    let latestTimestamp = 0;
    
    sectionIds.forEach(sectionId => {
      const storageKey = `canvas-${chapterId}-${sectionId}`;
      const content = localStorage.getItem(storageKey);
      
      if (content && content.trim()) {
        const timestampKey = `canvas-${chapterId}-${sectionId}-timestamp`;
        const timestamp = localStorage.getItem(timestampKey) || Date.now().toString();
        const timestampNum = parseInt(timestamp);
        
        if (timestampNum > latestTimestamp) {
          latestTimestamp = timestampNum;
          lastContent = content.trim();
        }
      }
    });
    
    return lastContent;
  };

  // Update the handlePromocodeSubmit function
  const handlePromocodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromocodeError('');
    
    if (!promocodeInput.trim()) {
      setPromocodeError('Please enter a promocode');
      return;
    }
    
    const result = await unlockChapter(promocodeInput);
    
    if (result.success) {
      toast({
        title: "Success! 🎉",
        description: result.message || "Promocode applied successfully!",
      });
      setPromocodeInput('');
      setPromocodeError('');
    } else {
      setPromocodeError(result.message || 'Invalid promocode. Please try again.');
    }
  };

  // Get tags that appear more than once
  const tagCounts = galleryData.books
    .flatMap(item => item.tags)
    .reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});
  
  const repeatedTags = Object.keys(tagCounts)
    .filter(tag => tagCounts[tag] > 1)
    .sort();

  // Filter items based on selected filter and sort by id
  const filteredItems = selectedFilter === "All" 
    ? galleryData.books.sort((a, b) => a.id - b.id)
    : galleryData.books.filter(item => item.tags.includes(selectedFilter)).sort((a, b) => a.id - b.id);

  // Function to update progress
  const updateProgress = () => {
    let chaptersCount = 0;
    const chaptersWithContentSet = new Set<number>();
    const openedChaptersList = [];
    
    galleryData.books.forEach(item => {
      const hasContent = localStorage.getItem(`canvas-${item.id}-partners`) || 
                        localStorage.getItem(`canvas-${item.id}-activities`) ||
                        localStorage.getItem(`canvas-${item.id}-resources`) ||
                        localStorage.getItem(`canvas-${item.id}-propositions`) ||
                        localStorage.getItem(`canvas-${item.id}-relationships`) ||
                        localStorage.getItem(`canvas-${item.id}-channels`) ||
                        localStorage.getItem(`canvas-${item.id}-segments`) ||
                        localStorage.getItem(`canvas-${item.id}-costs`) ||
                        localStorage.getItem(`canvas-${item.id}-revenue`) ||
                        localStorage.getItem(`chapter-${item.id}-visited`);
      
      if (hasContent) {
        chaptersCount++;
        chaptersWithContentSet.add(item.id);
        openedChaptersList.push(item.id);
      }
    });
    
    localStorage.setItem(COUNT_STORAGE_KEY, chaptersCount.toString());
    localStorage.setItem(LIST_STORAGE_KEY, JSON.stringify(openedChaptersList));
    
    const savedLastChapter = localStorage.getItem('lastOpenedChapter');
    const calculatedLastChapter = openedChaptersList.length > 0 ? Math.max(...openedChaptersList) : null;
    const finalLastChapter = savedLastChapter ? parseInt(savedLastChapter) : calculatedLastChapter;
    
    setLastOpenedChapter(finalLastChapter);
    setOpenedChapters(chaptersCount);
    setChaptersWithContent(chaptersWithContentSet);
  };

  useEffect(() => {
    updateProgress();
    
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

  const progressPercentage = (openedChapters / galleryData.books.length) * 100;

  const handleCardClick = (id: number) => {
    if (isChapterUnlocked(id)) {
      localStorage.setItem(`chapter-${id}-visited`, 'true');
      setLastOpenedChapter(id);
      localStorage.setItem('lastOpenedChapter', id.toString());
      setOpenChapter(id);
      navigate(`/canvas?item=${id}`);
    } else {
      setSelectedChapter(id);
      setLockedModalOpen(true);
    }
  };

  const handleChartClick = (e: React.MouseEvent, title: string) => {
    e.stopPropagation(); // Prevent card click
    
    // Get the card element (traverse up to find the card container)
    let cardElement = e.currentTarget.closest('[data-card-id]') as HTMLElement;
    if (!cardElement) {
      // Fallback: find the card by traversing up the DOM
      cardElement = e.currentTarget.closest('.cursor-pointer') as HTMLElement;
    }
    
    if (cardElement) {
      const cardRect = cardElement.getBoundingClientRect();
      setChartModal({
        isOpen: true,
        title: title,
        position: {
          x: cardRect.left + cardRect.width / 2,
          y: cardRect.top + cardRect.height / 2
        }
      });
    } else {
      // Fallback to button position
      const rect = e.currentTarget.getBoundingClientRect();
      setChartModal({
        isOpen: true,
        title: title,
        position: {
          x: rect.left + rect.width / 2,
          y: rect.top
        }
      });
    }
  };

  const closeChartModal = () => {
    setChartModal({isOpen: false, title: null, position: {x: 0, y: 0}});
  };

  const isChapterLocked = (id: number) => {
    return !isChapterUnlocked(id);
  };

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

  // Function to get chapter progress percentage
  const getChapterProgress = (chapterId) => {
    const sectionIds = [
      'key-partners',
      'key-activities', 
      'key-resources',
      'value-proposition',
      'customer-relationships',
      'channels',
      'customer-segments',
      'cost-structure',
      'revenue-streams'
    ];
    
    let completedSections = 0;
    sectionIds.forEach(sectionId => {
      const storageKey = `canvas-${chapterId}-${sectionId}`;
      const content = localStorage.getItem(storageKey);
      if (content && content.trim()) {
        completedSections++;
      }
    });
    
    return (completedSections / sectionIds.length) * 100;
  };


  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <PageLayout 
        currentChapterId="0"
        title="A PLAYBOOK TO SCALE BUSINESS GLOBALLY" 
        subtitle=""
        activeItem="Email Templates"
        headerActions={
          <div className="flex items-center gap-2">
            {/* View Toggle - Hidden on mobile, only show on desktop */}
            <div className="hidden md:flex items-center border border-gray-200 rounded-lg bg-white/90 backdrop-blur-sm">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-2 rounded-l-lg transition-colors ${
                  viewMode === 'cards' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                title="Card View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('index')}
                className={`p-2 rounded-r-lg transition-colors ${
                  viewMode === 'index' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                title="Index View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="outline"
              className="border-gray-200 text-gray-600 hover:bg-gray-50 h-10"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(1px)'
              }}
            >
              <Table className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Canvas</span>
            </Button>
          </div>
        }
        showLogoutInHeader={false}
        hideMobileLogo={true}
        hideMobileHeaderImage={true}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Enhanced Progress Bar */}
          <div className="px-6 py-3 bg-white/80 border-b border-amber-200/30 flex-shrink-0">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-amber-900 leading-tight">Chapter Progress</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-amber-700 leading-tight">{openedChapters} of {galleryData.books.length} chapters opened</span>
                {openedChapters > 0 && (
                  <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    <CheckCircle className="w-3 h-3" />
                    {Math.round(progressPercentage)}%
                  </div>
                )}
              </div>
            </div>
            <div className="relative">
              <Progress value={progressPercentage} className="h-2" />
              {createMilestoneMarkers()}
            </div>
          </div>
          
          {/* Promocode & Filter Section */}
          {!hasPromoAccess && (
            <div className="bg-amber-50 border-b border-amber-200/30 flex-shrink-0">
              {/* Mobile Toggle Buttons */}
              <div className="px-6 py-3 md:hidden flex gap-3">
                <button
                  onClick={() => {
                    setShowFilters(!showFilters);
                    setShowPromocode(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    showFilters ? 'bg-blue-500 text-white' : 'bg-white text-amber-800 border border-amber-300'
                  }`}
                >
                  <Filter className="w-3 h-3" />
                  Filter
                </button>
                <button
                  onClick={() => {
                    setShowPromocode(!showPromocode);
                    setShowFilters(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    showPromocode ? 'bg-blue-500 text-white' : 'bg-white text-amber-800 border border-amber-300'
                  }`}
                >
                  <Lock className="w-3 h-3" />
                  Promocode
                </button>
              </div>
              
              {/* Desktop Layout */}
              <div className="hidden md:flex md:items-start md:gap-4 px-6 py-3">
                {/* Filter section - Left half */}
                <div className="flex-1 w-1/2">
                  <div className="flex items-center gap-2 text-amber-800 mb-2">
                    <Filter className="w-3 h-3" />
                    <span className="text-xs font-medium leading-tight">Filter by category:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Badge
                      variant={selectedFilter === "All" ? "default" : "outline"}
                      className={`cursor-pointer ${
                        selectedFilter === "All" 
                          ? "text-white hover:bg-blue-700" 
                          : "text-gray-600 hover:bg-gray-50"
                      } border-gray-200 text-[10px] leading-tight`}
                      style={{
                        background: selectedFilter === "All" ? '#3b82f6' : 'rgba(255, 255, 255, 0.9)'
                      }}
                      onClick={() => setSelectedFilter("All")}
                    >
                      All
                    </Badge>
                    {repeatedTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedFilter === tag ? "default" : "outline"}
                        className={`cursor-pointer ${
                          selectedFilter === tag 
                            ? "text-white hover:bg-blue-700" 
                            : "text-gray-600 hover:bg-gray-50"
                        } border-gray-200 text-[10px] leading-tight`}
                        style={{
                          background: selectedFilter === tag ? '#3b82f6' : 'rgba(255, 255, 255, 0.9)'
                        }}
                        onClick={() => setSelectedFilter(tag)}
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-white/20 flex items-center justify-center text-[8px] mr-0.5">
                          {getTagEmoji(tag)}
                        </span>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Promocode section - Right half */}
                <div className="flex-1 w-1/2">
                  <div className="flex items-center gap-2 text-amber-800 mb-2">
                    <Lock className="w-3 h-3" />
                    <span className="text-xs leading-tight">{galleryData.limitedAccessMessage}</span>
                  </div>
                  <form onSubmit={handlePromocodeSubmit} className="flex items-center gap-2">
                    <label className="text-xs font-medium text-amber-900 whitespace-nowrap leading-tight">
                      Code:
                    </label>
                    <input
                      type="text"
                      value={promocodeInput}
                      onChange={(e) => setPromocodeInput(e.target.value)}
                      placeholder="Enter your code"
                      className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs leading-tight"
                      maxLength={16}
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-xs leading-tight"
                    >
                      Apply
                    </button>
                  </form>
                  {promocodeError && (
                    <p className="text-red-500 text-xs mt-1 leading-tight">{promocodeError}</p>
                  )}
                </div>
              </div>
              
              {/* Mobile Filter Dropdown */}
             {showFilters && (
                <div className="px-6 pb-3 md:hidden">
                  <div className="flex flex-wrap gap-1">
                    <Badge
                      variant={selectedFilter === "All" ? "default" : "outline"}
                      className={`cursor-pointer ${
                        selectedFilter === "All" 
                          ? "text-white hover:bg-blue-700" 
                          : "text-gray-600 hover:bg-gray-50"
                      } border-gray-200 text-xs`}
                      style={{
                        background: selectedFilter === "All" ? '#3b82f6' : 'rgba(255, 255, 255, 0.9)'
                      }}
                      onClick={() => {
                        setSelectedFilter("All");
                        setShowFilters(false);
                      }}
                    >
                      All
                    </Badge>
                    {repeatedTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedFilter === tag ? "default" : "outline"}
                        className={`cursor-pointer ${
                          selectedFilter === tag 
                            ? "text-white hover:bg-blue-700" 
                            : "text-gray-600 hover:bg-gray-50"
                        } border-gray-200 text-xs`}
                        style={{
                          background: selectedFilter === tag ? '#3b82f6' : 'rgba(255, 255, 255, 0.9)'
                        }}
                        onClick={() => {
                          setSelectedFilter(tag);
                          setShowFilters(false);
                        }}
                      >
                        <span className="w-3 h-3 rounded-full bg-white/20 flex items-center justify-center text-[10px] mr-1">
                          {getTagEmoji(tag)}
                        </span>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Mobile Promocode Dropdown */}
              {showPromocode && (
                <div className="px-6 pb-3 md:hidden">
                  <div className="flex items-center gap-2 text-amber-800 mb-3">
                    <Lock className="w-4 h-4" />
                    <span className="text-xs">{galleryData.limitedAccessMessage}</span>
                  </div>
                  <form onSubmit={handlePromocodeSubmit} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={promocodeInput}
                      onChange={(e) => setPromocodeInput(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                      maxLength={16}
                    />
                    <button
                      type="submit"
                      className="px-2 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-xs"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </form>
                  {promocodeError && (
                    <p className="text-red-500 text-xs mt-2">{promocodeError}</p>
                  )}
                </div>
              )}
            </div>
          )}

          <RecommendationBanner />

          {/* Filter Section - Only for full access users */}
          {hasPromoAccess && (
            <div className="border-b flex-shrink-0" style={{ borderColor: 'rgba(139, 125, 107, 0.15)' }}>
              <div className="px-6 py-4 md:hidden">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center justify-between w-full text-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <span className="text-xs font-medium">
                      Filter: {selectedFilter}
                    </span>
                  </div>
                  {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
              
              <div className={`flex flex-wrap gap-2 px-6 py-4 ${showFilters ? 'block' : 'hidden'} md:block`}>
                <Badge
                  variant={selectedFilter === "All" ? "default" : "outline"}
                  className={`cursor-pointer ${
                    selectedFilter === "All" 
                      ? "text-white hover:bg-blue-700" 
                      : "text-gray-600 hover:bg-gray-50"
                  } border-gray-200`}
                  style={{
                    background: selectedFilter === "All" ? '#3b82f6' : 'rgba(255, 255, 255, 0.9)'
                  }}
                  onClick={() => setSelectedFilter("All")}
                >
                  All
                </Badge>
                {repeatedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedFilter === tag ? "default" : "outline"}
                    className={`cursor-pointer ${
                      selectedFilter === tag 
                        ? "text-white hover:bg-blue-700" 
                        : "text-gray-600 hover:bg-gray-50"
                    } border-gray-200`}
                    style={{
                      background: selectedFilter === tag ? '#3b82f6' : 'rgba(255, 255, 255, 0.9)'
                    }}
                    onClick={() => setSelectedFilter(tag)}
                  >
                    <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-xs mr-1">
                      {getTagEmoji(tag)}
                    </span>
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Main Content Area - Mobile shows only grid view, desktop shows both */}
          <div className="flex-1 overflow-y-auto">
            {viewMode === 'index' && (
              <div className="hidden md:block">
                <BookIndexView 
                  filteredItems={filteredItems}
                  chaptersWithContent={chaptersWithContent}
                  lastOpenedChapter={lastOpenedChapter}
                  getChapterProgress={getChapterProgress}
                  getLastCanvasContent={getLastCanvasContent}
                  isChapterLocked={isChapterLocked}
                  handleCardClick={handleCardClick}
                  handleChartClick={handleChartClick}
                  getTagEmoji={getTagEmoji}
                />
              </div>
            )}
            
            {/* Grid View - Always shown on mobile, conditionally on desktop */}
            {(viewMode === 'cards' || window.innerWidth < 768) && (
              <>
                {/* Enhanced Gallery Grid with uniform height on mobile */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
                    {filteredItems.map((item) => {
                      const isOpened = chaptersWithContent.has(item.id);
                      const isLastOpened = lastOpenedChapter === item.id;
                      
                      return (
                        <div
                          key={item.id}
                          data-card-id={item.id}
                          className={`relative cursor-pointer transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 group flex flex-col h-full md:h-auto ${
                            isChapterLocked(item.id) ? 'opacity-75' : ''
                          } ${
                            isOpened ? 'ring-2 ring-green-400 ring-opacity-60 shadow-lg shadow-green-200/50' : ''
                          } ${
                            isLastOpened ? 'ring-2 ring-blue-400 ring-opacity-60 shadow-lg shadow-blue-200/50' : ''
                          }`}
                          onClick={() => handleCardClick(item.id)}
                          style={{ 
                            perspective: '1000px',
                            minHeight: window.innerWidth < 768 ? '400px' : 'auto' // Fixed height on mobile
                          }}
                        >
                          {/* Enhanced Status Badges */}
                          <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
                            {isOpened && (
                              <div className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg animate-pulse">
                                <CheckCircle className="w-3 h-3" />
                                Opened
                              </div>
                            )}
                            {isLastOpened && (
                              <div className="flex items-center gap-1 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
                                <BookOpen className="w-3 h-3" />
                                Current
                              </div>
                            )}
                          </div>

                          {/* Lock Icon */}
                          {isChapterLocked(item.id) && (
                            <div className="absolute top-2 right-2 md:top-4 md:right-4 z-10 w-6 h-6 md:w-8 md:h-8 bg-amber-600 rounded-full flex items-center justify-center shadow-lg">
                              <Lock className="w-3 h-3 md:w-4 md:h-4 text-white" />
                            </div>
                          )}

                          {/* Book container with enhanced styling for opened chapters */}
                          <div className="relative book-container flex-1 flex flex-col">
                            <div className="absolute top-0 left-0 w-full h-full">
                              <div className={`absolute top-1 left-1 w-full h-full rounded-r-sm transform -rotate-1 opacity-40 ${
                                isOpened ? 'bg-green-300' : 'bg-gray-300'
                              }`}></div>
                              <div className={`absolute top-0.5 left-0.5 w-full h-full rounded-r-sm transform -rotate-0.5 opacity-60 ${
                                isOpened ? 'bg-green-400' : 'bg-gray-400'
                              }`}></div>
                            </div>
                            
                            {/* Main book cover with enhanced styling and flex layout */}
                            <div className={`relative bg-white rounded-sm border shadow-lg transform-gpu transition-transform duration-300 group-hover:rotateY-5 overflow-hidden flex-1 flex flex-col ${
                              isOpened ? 'border-green-300 bg-gradient-to-br from-green-50 to-white' : 'border-amber-200'
                            } ${
                              isLastOpened ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-white' : ''
                            }`}>
                              {/* Enhanced Bookmarks */}
                              {chaptersWithContent.has(item.id) && (
                                <div className="absolute top-0 right-8 z-10">
                                  <div className="w-6 h-8 bg-green-500 clip-bookmark shadow-lg flex items-center justify-center">
                                    <CheckCircle className="w-3 h-3 text-white" />
                                  </div>
                                </div>
                              )}
                              
                              {lastOpenedChapter === item.id && (
                                <div className="absolute top-0 right-16 z-10">
                                  <div className="w-6 h-8 bg-blue-500 clip-bookmark shadow-lg flex items-center justify-center">
                                    <BookOpen className="w-3 h-3 text-white" />
                                  </div>
                                </div>
                              )}
                              
                              {/* Upper half with enhanced gradient background */}
                              <div 
                                className={`p-2 md:p-6 relative overflow-hidden flex-shrink-0 ${
                                  isOpened ? 'opacity-90' : ''
                                }`}
                                style={{
                                  background: isOpened 
                                    ? 'linear-gradient(45deg, #10b981, #059669, #047857, #065f46)'
                                    : getRandomGradient(item.id),
                                  backgroundSize: '400% 400%',
                                  animation: 'gradientAnimation 8s ease infinite'
                                }}
                              >
                                {/* Add gradient animation keyframes */}
                                <style jsx>{`
                                  @keyframes gradientAnimation {
                                    0% { background-position: 0% 50%; }
                                    50% { background-position: 100% 50%; }
                                    100% { background-position: 0% 50%; }
                                  }
                                  .clip-bookmark {
                                    clip-path: polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%);
                                  }
                                `}</style>
                                
                                {/* Icon, Chapter Number, and Tags */}
                                <div className="flex items-center gap-1 md:gap-2 mb-1.5 md:mb-4 flex-wrap">
                                  <div className="flex items-center gap-1 whitespace-nowrap">
                                    <div className="flex-shrink-0">
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-amber-700 md:w-6 md:h-6">
                                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M8 7h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M8 11h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                    </div>
                                    <div className={`text-[10px] md:text-sm font-bold leading-tight ${
                                      isOpened ? 'text-white' : 'text-gray-700'
                                    }`}>Chapter {item.id}</div>
                                  </div>
                                  <div className="flex gap-1 md:gap-2">
                                    {item.tags.slice(0, 2).map((tag, index) => (
                                      <Badge key={index} variant="outline" className={`text-[10px] md:text-xs border-amber-300 leading-tight ${
                                        isOpened ? 'bg-white/20 text-white border-white/30' : 'bg-amber-200 text-amber-800'
                                      }`}>
                                        <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-white/40 flex items-center justify-center text-[8px] md:text-[10px] mr-0.5 md:mr-1">
                                          {getTagEmoji(tag)}
                                        </span>
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                {/* Image container */}
                                <div className={`w-full h-auto rounded-md overflow-hidden mb-1.5 md:mb-4 p-2 md:p-4 ${
                                  isOpened ? 'bg-white/20' : 'bg-white/10'
                                }`}>
                                  <img 
                                    src={`https://raw.githubusercontent.com/znack2/book_local/main/docs/logos/${item.title}.svg`} 
                                    alt="Chapter image" 
                                    className="w-full h-auto object-cover mix-blend-multiply opacity-80"
                                  />
                                </div>
                              </div>

                              {/* Preview text */}
                              <p className={`text-[10px] md:text-sm leading-tight md:leading-relaxed mb-1.5 md:mb-4 transition-colors flex-1 ${
                                isOpened ? 'text-gray-800 font-medium' : 'text-gray-700'
                              }`} style={{
                                padding: '20px 20px 0 20px'
                              }}>
                                {item.preview}
                              </p>
                            
                              {/* Lower half with enhanced styling - Fixed at bottom */}
                              <div className={`p-2 md:p-6 pt-0 transition-colors flex-shrink-0 mt-auto ${
                                isOpened ? 'bg-green-50' : 'bg-white'
                              } ${
                                isLastOpened ? 'bg-blue-50' : ''
                              }`}>
                                {/* Canvas Content Bubble, Chart button and avatar all on the same line */}
                                <div className="flex items-center justify-between gap-2">
                                  {/* Enhanced Canvas Content Bubble */}
                                  <div className="flex-1 min-w-0">
                                    {(() => {
                                      const lastContent = getLastCanvasContent(item.id);
                                      if (!lastContent) return (
                                        <div className="text-[10px] md:text-sm font-medium text-amber-700 leading-tight">
                                          {/*{item.emailCount.toLocaleString()} emails*/}
                                        </div>
                                      );
                                      
                                      const displayContent = lastContent.length > 30 ? 
                                        `${lastContent.substring(0, 30)}...` : 
                                        lastContent;
                                      
                                      return (
                                        <div className="relative">
                                          <div className={`rounded-lg px-2 py-1 relative transition-colors ${
                                            isOpened ? 'bg-green-100' : 'bg-gray-100'
                                          } ${
                                            isLastOpened ? 'bg-blue-100' : ''
                                          }`}>
                                            <div className={`text-[8px] md:text-xs leading-tight truncate ${
                                              isOpened ? 'text-green-700' : 'text-gray-600'
                                            } ${
                                              isLastOpened ? 'text-blue-700' : ''
                                            }`}>
                                              💬 {displayContent}
                                            </div>
                                            <div className={`absolute -top-1 left-2 w-2 h-2 transform rotate-45 ${
                                              isOpened ? 'bg-green-100' : 'bg-gray-100'
                                            } ${
                                              isLastOpened ? 'bg-blue-100' : ''
                                            }`}></div>
                                          </div>
                                        </div>
                                      );
                                    })()}
                                  </div>
                                  
                                  {/* Chart Button and Avatar */}
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    {/* Chart Button - Enhanced styling */}
                                    <button
                                      onClick={(e) => handleChartClick(e, item.title)}
                                      className={`px-2 py-1 rounded text-[8px] md:text-xs font-medium transition-colors shadow-sm border ${
                                        isOpened 
                                          ? 'bg-green-500 hover:bg-green-600 text-white border-green-600' 
                                          : 'bg-blue-500 hover:bg-blue-600 text-white border-blue-600'
                                      }`}
                                      title="View Analytics"
                                    >
                                      📈 Chart
                                    </button>
                                    
                                    {/* Enhanced Avatar with Progress */}
                                    <div className="relative w-8 h-8 md:w-10 md:h-10">
                                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                        <path
                                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                          fill="none"
                                          stroke="#e5e7eb"
                                          strokeWidth="3"
                                        />
                                        <path
                                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                          fill="none"
                                          stroke={isOpened ? "#10b981" : "#374151"}
                                          strokeWidth="3"
                                          strokeDasharray={`${(item.emailCount / 1000) * 100}, 100`}
                                          strokeLinecap="round"
                                        />
                                      </svg>
                                      <div className={`absolute inset-1 rounded-full flex items-center justify-center overflow-hidden transition-colors ${
                                        isOpened ? 'bg-green-200' : 'bg-amber-200'
                                      } ${
                                        isLastOpened ? 'bg-blue-200' : ''
                                      }`}>
                                        <img src={`https://raw.githubusercontent.com/znack2/book_local/main/docs/chapters/${item.title}.png`} alt="Chapter image" className="w-full h-full object-cover" />
                                      </div>
                                      {/* Progress indicator overlay */}
                                      {isOpened && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                          <CheckCircle className="w-3 h-3 text-white" />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
              </>
            )}
          </div>
        </div>
      </PageLayout>
      
      {/* Modals */}
      <GalleryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <LockedChapterModal 
        isOpen={lockedModalOpen} 
        onClose={() => setLockedModalOpen(false)}
        chapterNumber={selectedChapter}
      />
      
      {/* Chart Modal */}
      {chartModal.isOpen && chartModal.title && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeChartModal}
          />
          
          {/* Modal positioned at card center */}
          <div 
            className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-md w-80 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: Math.max(160, Math.min(chartModal.position.x, window.innerWidth - 160)),
              top: Math.max(120, Math.min(chartModal.position.y, window.innerHeight - 120)),
            }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">
                Chapter {chartModal.title} Analytics
              </h3>
              <button
                onClick={closeChartModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Chart Image */}
            <div className="w-full">
              <img 
                src={`/charts/${chartModal.title}.png`}
                alt={`Chapter ${chartModal.title} Chart`}
                className="w-full h-auto rounded-md border border-gray-200"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZCNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+Q2hhcnQgbm90IGF2YWlsYWJsZTwvdGV4dD4KPHN2Zz4=';
                }}
              />
            </div>
            
            {/* Optional: Chart info */}
            <div className="mt-3 text-xs text-gray-600">
              Performance metrics and analytics for this chapter
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Gallery;