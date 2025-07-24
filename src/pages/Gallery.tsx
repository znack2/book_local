import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, Lock, Filter, ChevronDown, ChevronUp, Check, BarChart3, Grid, List, Eye, CheckCircle, BookOpen, Bookmark, Mail } from "lucide-react";
import GalleryModal from "@/components/GalleryModal";
import ChartModal from "@/components/ChartModal";
import PageLayout from "@/components/PageLayout";
import LockedChapterModal from "@/components/LockedChapterModal";
import BookmarkIcon from "@/components/BookmarkIcon";
import { useAuth } from "@/contexts/AuthContext";
import { usePromoCode } from "@/contexts/PromoCodeContext";
import { useToast } from "@/hooks/use-toast";
import galleryData from '../data/galleryData.json';
import canvasData from '../data/canvasData.json';
import RecommendationBanner from '@/components/RecommendationBanner';
import Footer from '@/components/Footer';

const COUNT_STORAGE_KEY = 'openedChaptersCount';
const LIST_STORAGE_KEY = 'openedChaptersList';

const Gallery = () => {
  const navigate = useNavigate();
  const { hasPromoAccess } = useAuth();
  const [bookmarkedCards, setBookmarkedCards] = useState(new Set());
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openedChapters, setOpenedChapters] = useState(0);
  const [lockedModalOpen, setLockedModalOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [chaptersWithContent, setChaptersWithContent] = useState(new Set());
  const [lastOpenedChapter, setLastOpenedChapter] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showPromocode, setShowPromocode] = useState(false);
  const [viewMode, setViewMode] = useState('cards');
  const [chartModal, setChartModal] = useState({
    isOpen: false,
    chapterId: null,
    position: {x: 0, y: 0}
  });

  const { unlockChapter, openChapterId, setOpenChapter, isChapterUnlocked } = usePromoCode();
  const { toast } = useToast();
  const [promocodeInput, setPromocodeInput] = useState('');
  const [promocodeError, setPromocodeError] = useState('');

  // Convert gallery data to card format
  const cardData = galleryData.books.map(item => ({
    id: item.id,
    title: item.title,
    description: item.preview || "Explore this business case study and learn valuable insights for global expansion.",
    tags: item.tags || [],
    emails: item.emailCount || Math.floor(Math.random() * 50) + 5,
    avatar: "📖",
    locked: !isChapterUnlocked(item.id),
    image: `https://raw.githubusercontent.com/znack2/book_local/main/docs/logos/${item.title}.svg`
  }));

  const toggleBookmark = (cardId) => {
    const newBookmarked = new Set(bookmarkedCards);
    if (newBookmarked.has(cardId)) {
      newBookmarked.delete(cardId);
    } else {
      newBookmarked.add(cardId);
    }
    setBookmarkedCards(newBookmarked);
  };

  // Tag to emoji mapping
  const tagEmojiMap = {
    'USA': '🇺🇸',
    'UK': '🇬🇧', 
    'India': '🇮🇳',
    'Kazakhstan': '🇰🇿',
    'Mexico': '🇰🇲',
    'Indonesia': '🇮🇩',
    'UAE': '🇦🇪',
    'China': '🇨🇳',
    'Brasil': '🇧🇷'
  };

  const getTagEmoji = (tag) => {
    return tagEmojiMap[tag] || '🌍';
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

  const filteredCardData = cardData.filter(card => 
    selectedFilter === "All" || card.tags.includes(selectedFilter)
  );

  // Desktop Card Component
  const DesktopCard = ({ card, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isOpened = chaptersWithContent.has(card.id);
    const isLastOpened = lastOpenedChapter === card.id;
    
    // Truncate description to 50 characters
    const truncatedDescription = card.description.length > 50 
      ? card.description.substring(0, 50) + "..." 
      : card.description;

    // Random gradient for background
    const getRandomGradient = (id) => {
      const gradients = [
        'linear-gradient(45deg, #667eea, #764ba2)',
        'linear-gradient(45deg, #f093fb, #f5576c)',
        'linear-gradient(45deg, #4facfe, #00f2fe)',
        'linear-gradient(45deg, #43e97b, #38f9d7)',
        'linear-gradient(45deg, #fa709a, #fee140)',
        'linear-gradient(45deg, #a8edea, #fed6e3)',
        'linear-gradient(45deg, #ff9a9e, #fecfef)',
        'linear-gradient(45deg, #ffecd2, #fcb69f)',
        'linear-gradient(45deg, #ff8a80, #ffb74d)',
        'linear-gradient(45deg, #81c784, #aed581)'
      ];
      return gradients[id % gradients.length];
    };

    const getChapterProgress = (chapterId) => {
      const sectionIds = [
        'key-partners', 'key-activities', 'key-resources', 'value-proposition',
        'customer-relationships', 'channels', 'customer-segments', 'cost-structure', 'revenue-streams'
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
      <div 
        className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group h-full flex flex-col relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Section with full width and gradient background */}
        <div 
          className="relative h-48 overflow-hidden flex-shrink-0"
          style={{ background: getRandomGradient(card.id) }}
        >
          <img 
            src={card.image} 
            alt={card.title}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
          {card.locked && (
            <div className="absolute top-3 left-3 bg-black bg-opacity-70 rounded-full p-2">
              <Lock className="w-4 h-4 text-white" />
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(card.id);
            }}
            className="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full p-2 hover:bg-opacity-100 transition-all duration-200"
          >
            <Bookmark 
              className={`w-4 h-4 ${bookmarkedCards.has(card.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} 
            />
          </button>
          
          {/* Hover Progress Circle - Only appears on hover */}
          {isHovered && (
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
            >
              <div className="relative w-28 h-28">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeDasharray={`${getChapterProgress(card.id)}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-2 rounded-full overflow-hidden bg-white">
                  <img 
                    src={`https://raw.githubusercontent.com/znack2/book_local/main/docs/chapters/${card.title}.png`} 
                    alt="Chapter"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center mb-3">
            <h3 className={`text-lg font-semibold flex-1 line-clamp-2 transition-all duration-300 ${
              isHovered 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent' 
                : 'text-gray-900'
            }`}>
              Chapter {card.id}: {card.title}
            </h3>
          </div>

          <p className="text-gray-600 text-sm mb-4 h-12 overflow-hidden">{truncatedDescription}</p>

          <div className="flex flex-wrap gap-2 mb-4 h-8 overflow-hidden">
            {card.tags.slice(0, 2).map((tag, tagIndex) => (
              <span 
                key={tagIndex}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium flex-shrink-0 flex items-center gap-1"
              >
                <span>{getTagEmoji(tag)}</span>
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center mb-4 text-gray-500">
            <Mail className="w-4 h-4 mr-2" />
            <span className="text-sm">{card.emails} emails</span>
          </div>

          {/* Progress bar on hover */}
          {isHovered && (
            <div className="mb-4 transition-all duration-300">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Progress</span>
                <span className="text-xs text-gray-600">{Math.round(getChapterProgress(card.id))}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getChapterProgress(card.id)}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Two Buttons */}
          <div className="flex gap-3 mt-auto">
            {/* Chart Modal Button */}
            <button 
              onClick={(e) => {
                console.log('button');
                e.stopPropagation();
                handleChartClick(e, card.id);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm">Chart</span>
            </button>
            
            {/* View More Button - Changes color based on status */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick(card.id);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                isLastOpened 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : isOpened
                    ? 'bg-gray-500 text-white hover:bg-gray-600'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm">More</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Mobile Stacked Cards Component
  const MobileStackedCards = ({ cards, blockIndex }) => {
    const [currentCard, setCurrentCard] = useState(0);
    const [hoveredCard, setHoveredCard] = useState(null);
    
    const blockTitles = [
      "Chapters 1-4",
      "Chapters 5-8", 
      "Chapters 9-12",
      "Chapters 13-16",
      "Chapters 17-20",
      "Chapters 21-24",
      "Chapters 25-28",
      "Chapters 29-32",
      "Chapters 33-36",
      "Chapters 37-40",
      "Chapters 41-44",
      "Chapters 45-48"
    ];
    
    return (
      <div className="relative mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {blockTitles[blockIndex] || `Block ${blockIndex + 1}`}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="relative" style={{ minHeight: '250vh' }}>
          <div className="flex-1 space-y-6">
            {cards.map((card, index) => {
              const topOffset = `calc(4rem + ${index * 0.8}rem)`;
              const rotation = index % 2 === 0 ? `${index * 1.5}deg` : `-${index * 1.2}deg`;
              const isHovered = hoveredCard === card.id;
              const isOpened = chaptersWithContent.has(card.id);
              const isLastOpened = lastOpenedChapter === card.id;
              
              return (
                <div
                  key={card.id}
                  className="sticky w-full max-w-sm mx-auto bg-white border rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-500 ease-out transform"
                  style={{ 
                    top: topOffset,
                    transform: `rotate(${rotation}) ${isHovered ? 'scale(1.05)' : 'scale(1)'}`,
                    boxShadow: isHovered 
                      ? '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(59, 130, 246, 0.1)' 
                      : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    zIndex: isHovered ? 50 : 'auto'
                  }}
                  onClick={() => handleCardClick(card.id)}
                  onMouseEnter={() => setHoveredCard(card.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Status Badges */}
                  <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
                    {isOpened && (
                      <div className="flex items-center gap-1 bg-green-500 text-white px-1 py-0.5 rounded-full text-xs font-medium">
                        <CheckCircle className="w-2 h-2" />
                        Opened
                      </div>
                    )}
                    {isLastOpened && (
                      <div className="flex items-center gap-1 bg-blue-500 text-white px-1 py-0.5 rounded-full text-xs font-medium">
                        <BookOpen className="w-2 h-2" />
                        Current
                      </div>
                    )}
                  </div>

                  {/* Hover Icon */}
                  <div 
                    className={`absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center transition-all duration-300 transform ${
                      isHovered ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                    }`}
                    style={{ zIndex: 10 }}
                  >
                    <span className="text-white text-sm font-bold">✨</span>
                  </div>
                  
                  <div className="relative h-32 overflow-hidden">
                    <img 
                      src={card.image} 
                      alt={card.title}
                      className={`w-full h-full object-cover transition-transform duration-500 ${
                        isHovered ? 'scale-110' : 'scale-100'
                      }`}
                    />
                    {card.locked && (
                      <div className="absolute top-2 right-2 bg-black bg-opacity-70 rounded-full p-1">
                        <Lock className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(card.id);
                      }}
                      className="absolute top-2 right-8 bg-white bg-opacity-90 rounded-full p-1 hover:bg-opacity-100 transition-all duration-200"
                    >
                      <Bookmark 
                        className={`w-3 h-3 ${bookmarkedCards.has(card.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} 
                      />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <div className="space-y-1 mb-3">
                      <h3 className="block text-lg font-bold leading-none text-gray-900">
                        {card.title}
                      </h3>
                    </div>
                    
                    <p className="text-gray-600 text-xs mb-3 line-clamp-3">
                      {card.description.length > 50 ? card.description.substring(0, 50) + "..." : card.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {card.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span 
                          key={tagIndex}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center gap-1"
                        >
                          <span>{getTagEmoji(tag)}</span>
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-gray-500">
                        <Mail className="w-3 h-3 mr-1" />
                        <span className="text-xs">{card.emails} emails</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChartClick(e, card.id);
                        }}
                        className={`flex-1 flex items-center justify-center gap-1 py-2 px-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-xs font-medium transition-all duration-300 ${
                        isHovered ? 'shadow-lg transform translate-y-0.5' : ''
                      }`}>
                        <div className="relative">
                          <svg className="w-4 h-4 transform -rotate-90" viewBox="0 0 36 36">
                            <path
                              className="text-white opacity-30"
                              stroke="currentColor"
                              strokeWidth="3"
                              fill="transparent"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className="text-white"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeDasharray="60, 100"
                              strokeLinecap="round"
                              fill="transparent"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <BarChart3 className="w-2 h-2" />
                          </div>
                        </div>
                        <span>Chart</span>
                      </button>
                      
                      <button className={`flex-1 flex items-center justify-center gap-1 py-2 px-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-medium transition-all duration-300 ${
                        isHovered ? 'shadow-lg transform translate-y-0.5' : ''
                      }`}>
                        <div className="relative">
                          <svg className="w-4 h-4 transform -rotate-90" viewBox="0 0 36 36">
                            <path
                              className="text-gray-300"
                              stroke="currentColor"
                              strokeWidth="3"
                              fill="transparent"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className="text-blue-500"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeDasharray="80, 100"
                              strokeLinecap="round"
                              fill="transparent"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <BookOpen className="w-2 h-2" />
                          </div>
                        </div>
                        <span>Canvas</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Function to update progress
  const updateProgress = () => {
    let chaptersCount = 0;
    const chaptersWithContentSet = new Set();
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

  const handlePromocodeSubmit = async (e) => {
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

  const handleCardClick = (id) => {
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

  const handleChartClick = (e, chapterId) => {
    console.log('handleChartClick');
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setChartModal({
      isOpen: true,
      chapterId: chapterId,
      position: { x: rect.left, y: rect.top }
    });
  };

  const isChapterLocked = (id) => {
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

  // Group cards into blocks of 4 for mobile
  const cardBlocks = [];
  for (let i = 0; i < filteredCardData.length; i += 4) {
    cardBlocks.push(filteredCardData.slice(i, i + 4));
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <PageLayout 
        currentChapterId="0"
        title="A PLAYBOOK TO SCALE BUSINESS GLOBALLY" 
        subtitle=""
        activeItem="Email Templates"
        headerActions={
          <div className="flex items-center gap-2">
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

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto">
            {/* Desktop Grid View */}
            <div className="hidden lg:block">
              <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-4 gap-6">
                  {filteredCardData.map((card, index) => (
                    <DesktopCard key={card.id} card={card} index={index} />
                  ))}
                </div>
                
                {filteredCardData.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-gray-500 text-lg">No chapters found for the selected filter.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tablet Grid View */}
            <div className="hidden md:block lg:hidden">
              <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-2 gap-6">
                  {filteredCardData.map((card, index) => (
                    <DesktopCard key={card.id} card={card} index={index} />
                  ))}
                </div>
                
                {filteredCardData.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-gray-500 text-lg">No chapters found for the selected filter.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Stacked View */}
            <div className="block md:hidden">
              {cardBlocks.length > 0 ? (
                cardBlocks.map((block, blockIndex) => (
                  <div className="relative mb-8" key={blockIndex}>
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {[      "Chapters 1-4",
                              "Chapters 5-8", 
                              "Chapters 9-12",
                              "Chapters 13-16",
                              "Chapters 17-20",
                              "Chapters 21-24",
                              "Chapters 25-28",
                              "Chapters 29-32",
                              "Chapters 33-36",
                              "Chapters 37-40",
                              "Chapters 41-44",
                              "Chapters 45-48"][blockIndex]}
                      </h2>
                      <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
                    </div>
                    
                    <div className="relative" style={{ minHeight: '200vh' }}>
                      <div className="flex-1 space-y-6">
                        {block.map((card, index) => {
                          const topOffset = `calc(4rem + ${index * 0.7}rem)`;
                          const rotation = index % 2 === 0 ? `${index * 1.5}deg` : `-${index * 1.2}deg`;
                          
                          return (
                            <div
                              key={card.id}
                              className="sticky w-full max-w-sm mx-auto transition-all duration-500 ease-out"
                              style={{ 
                                top: topOffset,
                                transform: `rotate(${rotation})`,
                                zIndex: 10 + index
                              }}
                            >
                              <DesktopCard card={card} index={index} />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-500">No chapters found for the selected filter.</p>
                </div>
              )}
            </div>

            {/* Footer - Only show on last section */}
            <Footer />
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
      {chartModal.isOpen && chartModal.chapterId && (
        <ChartModal
          isOpen={chartModal.isOpen}
          title={`Chapter ${chartModal.chapterId}`}
          chapterId={chartModal.chapterId}
          position={chartModal.position}
          onClose={() => setChartModal({ isOpen: false, chapterId: null, position: { x: 0, y: 0 } })}
        />
      )}
    </div>
  );
};

export default Gallery;