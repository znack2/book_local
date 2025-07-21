import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Lock, CheckCircle, BookOpen } from "lucide-react";

const BookIndexView = ({ 
  filteredItems, 
  chaptersWithContent, 
  lastOpenedChapter,
  getChapterProgress,
  getLastCanvasContent,
  isChapterLocked,
  handleCardClick,
  handleChartClick,
  getTagEmoji 
}) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Index Header */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Table of Contents</h2>
        </div>

        {/* Index Table */}
        <div className="divide-y divide-gray-200">
          {filteredItems.map((item, index) => {
            const chapterProgress = getChapterProgress(item.id);
            const isOpened = chaptersWithContent.has(item.id);
            const isLastOpened = lastOpenedChapter === item.id;
            
            return (
              <div
                key={item.id}
                className={`relative flex items-center p-6 cursor-pointer transition-all duration-300 ${
                  isChapterLocked(item.id) ? 'opacity-60' : ''
                } ${
                  isOpened ? 'bg-gradient-to-r from-green-50 via-emerald-25 to-green-50 hover:from-green-100 hover:to-green-100 border-l-4 border-green-400' : 'hover:bg-gray-50'
                } ${
                  isLastOpened ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500' : ''
                }`}
                onClick={() => handleCardClick(item.id)}
              >

                {/* Chapter Number - Full Width Left */}
                <div className="w-16 flex items-center justify-center flex-shrink-0">
                  <div className="relative">
                    <div 
                      className={`handwritten-number font-bold text-2xl transition-colors ${
                        isOpened ? 'text-green-600' : 'text-gray-400'
                      } ${
                        isLastOpened ? 'text-blue-600' : ''
                      }`}
                      style={{
                        fontFamily: 'Brush Script MT, cursive, fantasy',
                        letterSpacing: '-1px',
                        fontSize: '70px'
                      }}
                    >
                      {item.id}
                    </div>
                    {/* Enhanced visual indicator for opened chapters */}
                    {isOpened && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Lock Icon for locked chapters */}
                {isChapterLocked(item.id) && (
                  <div className="absolute top-4 left-4 z-10 w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center shadow-sm">
                    <Lock className="w-3 h-3 text-white" />
                  </div>
                )}

                {/* Chapter Content */}
                <div className="flex-1 min-w-0 ml-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-6">
                      {/* Title and Tags Row */}
                      <div className="flex items-center gap-3 mb-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        
                        {/* Chapter logo with same height as tags */}
                        <div className={`h-6 w-12 rounded-md overflow-hidden flex items-center justify-center border transition-all ${
                          isOpened ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
                        }`}>
                          <img 
                            src={`https://raw.githubusercontent.com/znack2/book_local/main/docs/logos/${item.title}.svg`} 
                            alt="Chapter logo" 
                            className="max-w-full max-h-full object-contain mix-blend-multiply opacity-80"
                          />
                        </div>
                        
                        {/* Tags */}
                        <div className="flex items-center gap-1">
                          {item.tags.slice(0, 4).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className={`text-xs h-6 transition-colors ${
                              isOpened ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'
                            }`}>
                              <span className="w-3 h-3 rounded-full bg-gray-200 flex items-center justify-center text-[10px] mr-1">
                                {getTagEmoji(tag)}
                              </span>
                              {tag}
                            </Badge>
                          ))}
                        </div>

                      </div>

                      {/* Words count and Chart button row */}
                      <div className="flex items-center justify-between mb-3" style={{
                        marginTop: '-35px'
                      }}>
                        <div></div> {/* Empty space for alignment */}
                        <div className="flex items-center gap-3">
                          {/* Words count on the right */}
                          <span className="text-xs text-gray-500">{item.words ? item.words.toLocaleString() : '0'} words</span>
                          
                          {/* Chart button that looks like a button */}
                          <button
                            onClick={(e) => handleChartClick(e, item.title)}
                            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors shadow-sm text-xs font-medium"
                            title="View Analytics"
                          >
                            📈 Chart
                          </button>
                          
                          {/* Enhanced Status indicators */}
                          <div className="flex items-center gap-2">
                            {isOpened && (
                              <div className="flex items-center gap-1 text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-xs font-medium">Opened</span>
                              </div>
                            )}
                            {isLastOpened && (
                              <div className="flex items-center gap-1 text-blue-600">
                                <BookOpen className="w-4 h-4" />
                                <span className="text-xs font-medium">Current</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Progress Bar */}
                      <div className="mb-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              isOpened 
                                ? 'bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 shadow-sm' 
                                : 'bg-gradient-to-r from-gray-300 to-gray-400'
                            }`}
                            style={{ width: `${chapterProgress}%` }}
                          ></div>
                        </div>
                        {chapterProgress > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            {Math.round(chapterProgress)}% complete
                          </div>
                        )}
                      </div>

                      {/* Preview Text */}
                      <p className={`text-sm line-clamp-2 mb-3 transition-colors ${
                        isOpened ? 'text-gray-700 font-medium' : 'text-gray-600'
                      }`}>
                        {item.preview}
                      </p>
                      
                      {/* Enhanced Canvas Content Preview */}
                      {(() => {
                        const lastContent = getLastCanvasContent(item.id);
                        if (lastContent) {
                          const displayContent = lastContent.length > 60 ? 
                            `${lastContent.substring(0, 60)}...` : 
                            lastContent;
                          
                          return (
                            <div className="mt-2">
                              <div className={`rounded-lg px-3 py-2 relative transition-all ${
                                isOpened 
                                  ? 'bg-green-50 border border-green-200' 
                                  : 'bg-blue-50 border border-blue-200'
                              }`}>
                                <div className={`text-xs leading-relaxed ${
                                  isOpened ? 'text-green-700' : 'text-blue-700'
                                }`}>
                                  💬 {displayContent}
                                </div>
                                <div className={`absolute -top-1 left-4 w-2 h-2 transform rotate-45 ${
                                  isOpened 
                                    ? 'bg-green-50 border-l border-t border-green-200' 
                                    : 'bg-blue-50 border-l border-t border-blue-200'
                                }`}></div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}
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
            <p className="text-gray-500 text-lg">No chapters found for the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookIndexView;