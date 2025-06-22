import React, { useState, useEffect } from 'react';
import { BookOpen, X } from 'lucide-react';

const RECOMMENDATION_STORAGE_KEY = 'chapterRecommendations';

// Recommendation Banner Component for Gallery Page
const RecommendationBanner = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check for stored recommendations when component mounts
    const storedRecs = localStorage.getItem(RECOMMENDATION_STORAGE_KEY);
    if (storedRecs) {
      try {
        const parsedRecs = JSON.parse(storedRecs);
        if (parsedRecs && parsedRecs.length > 0) {
          setRecommendations(parsedRecs);
          setIsVisible(true);
        }
      } catch (error) {
        console.error('Error parsing recommendations:', error);
        localStorage.removeItem('chapterRecommendations'); // Clean up invalid data
      }
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // Optional: Remove from localStorage so banner doesn't show again
    localStorage.removeItem('chapterRecommendations');
  };

  const handleChapterClick = (chapterId) => {
    // Navigate to specific chapter
    const chapterElement = document.getElementById(`chapter-${chapterId}`);
    if (chapterElement) {
      chapterElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    
    // Optional: Close banner after navigation
    setIsVisible(false);
  };

  // Don't render if not visible or no recommendations
  if (!isVisible || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                📚 Your Recommended Chapters
              </h3>
              <div className="flex flex-wrap gap-2">
                {recommendations.slice(0, 3).map((rec, index) => (
                  <button
                    key={rec.id}
                    onClick={() => handleChapterClick(rec.id)}
                    className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors font-medium"
                    title={rec.description}
                  >
                    Ch.{rec.id}: {rec.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors ml-4 flex-shrink-0"
            title="Dismiss recommendations"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationBanner;