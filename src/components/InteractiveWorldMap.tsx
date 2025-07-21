import React, { useState, useRef, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { MapPin, Globe } from "lucide-react";

const InteractiveWorldMap = ({ filteredItems, selectedFilter, tagEmojiMap, getTagEmoji }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedPin, setSelectedPin] = useState(null);
  const mapRef = useRef(null);

  // Country coordinates for chapter pins (updated for accurate map)
  const countryCoordinates = {
    'USA': { x: 200, y: 220, lat: 39.8283, lng: -98.5795 },
    'UK': { x: 440, y: 140, lat: 55.3781, lng: -3.4360 },
    'India': { x: 675, y: 260, lat: 20.5937, lng: 78.9629 },
    'Kazakhstan': { x: 650, y: 160, lat: 48.0196, lng: 66.9237 },
    'Brasil': { x: 310, y: 380, lat: -14.2350, lng: -51.9253 }
  };

  // Filter chapters by location based on tags
  const getChaptersByLocation = () => {
    const locationChapters = {};
    
    filteredItems.forEach(item => {
      item.tags.forEach(tag => {
        if (countryCoordinates[tag]) {
          if (!locationChapters[tag]) {
            locationChapters[tag] = [];
          }
          locationChapters[tag].push(item);
        }
      });
    });
    
    return locationChapters;
  };

  const chaptersByLocation = getChaptersByLocation();

  const handleMouseDown = (e) => {
    if (e.target.closest('.map-pin')) return; // Don't drag when clicking pins
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Limit panning boundaries
    const maxX = 200;
    const maxY = 100;
    const minX = -200;
    const minY = -100;
    
    setPosition({
      x: Math.max(minX, Math.min(maxX, newX)),
      y: Math.max(minY, Math.min(maxY, newY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(0.5, Math.min(3, scale + delta));
    setScale(newScale);
  };

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handlePinClick = (location, chapters) => {
    setSelectedPin(selectedPin === location ? null : location);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e) => handleMouseMove(e);
    const handleGlobalMouseUp = () => handleMouseUp();

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragStart, position]);

  return (
    <div className="bg-white border-b border-gray-200 flex-shrink-0">
      {/* Map Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">Global Chapter Map</h3>
            <Badge variant="outline" className="text-xs">
              {Object.keys(chaptersByLocation).length} locations
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetView}
              className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Reset View
            </button>
            <div className="text-xs text-gray-500">
              Zoom: {Math.round(scale * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-96 overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
        <div
          ref={mapRef}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onWheel={handleWheel}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.2s ease-out'
          }}
        >
          {/* World Map SVG - Realistic continent shapes */}
          <svg
            width="1000"
            height="500"
            viewBox="0 0 1000 500"
            className="absolute inset-0 w-full h-full"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
          >
            {/* Ocean background */}
            <rect width="1000" height="500" fill="#bfdbfe" />
            
            {/* Greenland */}
            <path
              d="M380 40 C390 35 405 38 415 45 C420 55 418 65 410 75 C400 80 385 78 378 70 C375 60 377 50 380 40 Z"
              fill="#10b981"
              stroke="#059669"
              strokeWidth="0.5"
            />
            
            {/* North America */}
            <path
              d="M50 80 C60 75 80 78 100 85 C120 90 140 95 160 100 C180 105 200 110 220 115 C240 118 260 120 280 125 C300 130 320 135 340 140 C350 145 355 155 350 165 C345 175 335 180 325 185 C315 190 305 195 295 200 C285 205 275 210 265 215 C255 220 245 225 235 230 C225 235 215 240 205 245 C195 250 185 255 175 260 C165 265 155 270 145 275 C135 280 125 285 115 290 C105 295 95 300 85 305 C75 310 65 315 55 320 C50 315 48 305 50 295 C52 285 55 275 58 265 C60 255 62 245 64 235 C66 225 68 215 70 205 C72 195 74 185 76 175 C78 165 80 155 82 145 C84 135 86 125 88 115 C90 105 92 95 94 85 C96 80 98 75 100 70 C95 65 85 60 75 65 C65 70 55 75 50 80 Z"
              fill="#10b981"
              stroke="#059669"
              strokeWidth="0.5"
            />
            
            {/* Canada - Northern extension */}
            <path
              d="M80 60 C120 55 160 58 200 65 C240 70 280 75 320 80 C340 82 360 85 380 90 C385 95 380 105 375 110 C370 115 360 118 350 120 C340 122 330 120 320 118 C280 115 240 110 200 105 C160 100 120 95 80 90 C75 85 75 75 80 60 Z"
              fill="#10b981"
              stroke="#059669"
              strokeWidth="0.5"
            />
            
            {/* Mexico */}
            <path
              d="M180 220 C200 218 220 220 240 225 C260 230 280 235 300 240 C305 245 300 255 295 260 C290 265 280 268 270 270 C260 272 250 270 240 268 C220 265 200 260 180 255 C175 250 175 240 180 220 Z"
              fill="#10b981"
              stroke="#059669"
              strokeWidth="0.5"
            />
            
            {/* South America */}
            <path
              d="M280 280 C290 278 300 280 310 285 C320 290 330 295 340 300 C350 305 360 310 365 320 C370 330 368 340 365 350 C362 360 358 370 354 380 C350 390 346 400 342 410 C338 420 334 430 330 440 C326 450 322 460 318 470 C314 475 308 478 302 475 C296 472 292 465 290 458 C288 450 288 442 288 434 C288 426 288 418 288 410 C288 402 288 394 288 386 C288 378 288 370 288 362 C288 354 288 346 288 338 C288 330 288 322 288 314 C288 306 288 298 288 290 C285 285 282 282 280 280 Z"
              fill="#10b981"
              stroke="#059669"
              strokeWidth="0.5"
            />
            
            {/* Europe */}
            <path
              d="M450 100 C460 98 470 100 480 105 C490 110 500 115 510 120 C520 125 530 130 540 135 C545 140 542 150 538 155 C534 160 528 163 522 165 C516 167 510 165 504 163 C494 160 484 155 474 150 C464 145 454 140 450 130 C448 120 448 110 450 100 Z"
              fill="#10b981"
              stroke="#059669"
              strokeWidth="0.5"
            />
            
            {/* Scandinavia */}
            <path
              d="M480 60 C490 58 500 62 508 68 C516 74 522 82 525 90 C528 98 528 106 525 114 C522 120 516 124 510 126 C504 128 498 126 493 123 C488 120 484 115 482 110 C480 105 480 100 480 95 C480 90 480 85 480 80 C480 75 480 70 480 65 C480 62 480 60 480 60 Z"
              fill="#10b981"
              stroke="#059669"
              strokeWidth="0.5"
            />
            
            {/* Africa */}
            <path
              d="M480 180 C490 178 500 180 510 185 C520 190 530 195 540 200 C550 205 560 210 570 215 C580 220 590 225 595 235 C600 245 598 255 595 265 C592 275 588 285 584 295 C580 305 576 315 572 325 C568 335 564 345 560 355 C556 365 552 375 548 385 C544 395 540 405 536 415 C532 420 526 422 520 420 C514 418 510 412 508 406 C506 400 506 394 506 388 C506 382 506 376 506 370 C506 364 506 358 506 352 C506 346 506 340 506 334 C506 328 506 322 506 316 C506 310 506 304 506 298 C506 292 506 286 506 280 C506 274 506 268 506 262 C506 256 506 250 506 244 C506 238 506 232 506 226 C506 220 506 214 506 208 C506 202 506 196 506 190 C503 185 488 182 480 180 Z"
              fill="#10b981"
              stroke="#059669"
              strokeWidth="0.5"
            />
            
            {/* Asia - Western Part */}
            <path
              d="M540 120 C560 118 580 122 600 128 C620 134 640 140 660 146 C680 152 700 158 720 164 C740 170 760 176 780 182 C790 185 795 195 790 205 C785 215 775 220 765 225 C755 230 745 235 735 240 C725 245 715 250 705 255 C695 260 685 265 675 270 C665 275 655 280 645 285 C635 290 625 295 615 300 C605 305 595 310 585 315 C575 320 565 325 555 330 C550 325 548 315 548 305 C548 295 548 285 548 275 C548 265 548 255 548 245 C548 235 548 225 548 215 C548 205 548 195 548 185 C548 175 548 165 548 155 C548 145 548 135 548 125 C545 122 542 120 540 120 Z"
              fill="#10b981"
              stroke="#059669"
              strokeWidth="0.5"
            />
            
            {/* Asia - Eastern Part (China, Japan area) */}
            <path
              d="M720 140 C740 138 760 142 780 148 C800 154 820 160 840 166 C860 172 880 178 900 184 C910 187 915 197 910 207 C905 217 895 222 885 227 C875 232 865 237 855 242 C845 247 835 252 825 257 C815 262 805 267 795 272 C785 277 775 282 765 287 C755 292 745 297 735 302 C730 297 728 287 728 277 C728 267 728 257 728 247 C728 237 728 227 728 217 C728 207 728 197 728 187 C728 177 728 167 728 157 C728 147 725 142 720 140 Z"
              fill="#10b981"
              stroke="#059669"
              strokeWidth="0.5"
            />
            
            {/* India subcontinent */}
            <path
              d="M640 220 C650 218 660 222 668 228 C676 234 682 242 685 250 C688 258 688 266 685 274 C682 282 676 288 668 292 C660 296 650 296 642 294 C634 292 628 286 625 278 C622 270 622 262 625 254 C628 246 634 240 640 220 Z"
              fill="#10b981"
              stroke="#059669"
              strokeWidth="0.5"
            />
            
            {/* Australia */}
            <path
              d="M720 340 C740 338 760 342 780 348 C800 354 820 360 835 368 C850 376 862 386 870 398 C875 405 872 415 866 420 C860 425 852 427 844 426 C836 425 828 422 820 418 C812 414 804 409 796 404 C788 399 780 394 772 389 C764 384 756 379 748 374 C740 369 732 364 725 358 C720 352 718 346 720 340 Z"
              fill="#10b981"
              stroke="#059669"
              strokeWidth="0.5"
            />
            
            {/* New Zealand */}
            <path
              d="M860 380 C865 378 870 380 873 385 C876 390 876 396 873 401 C870 406 865 408 860 408 C855 408 850 406 847 401 C844 396 844 390 847 385 C850 380 855 378 860 380 Z"
              fill="#10b981"
              stroke="#059669"
              strokeWidth="0.5"
            />
            
            <path
              d="M855 420 C860 418 865 420 868 425 C871 430 871 436 868 441 C865 446 860 448 855 448 C850 448 845 446 842 441 C839 436 839 430 842 425 C845 420 850 418 855 420 Z"
              fill="#10b981"
              stroke="#059669"
              strokeWidth="0.5"
            />
            
            {/* Madagascar */}
            <path
              d="M570 320 C575 318 580 322 582 327 C584 332 582 337 578 340 C574 343 569 342 566 338 C563 334 564 329 567 325 C569 322 571 320 570 320 Z"
              fill="#10b981"
              stroke="#059669"
              strokeWidth="0.5"
            />
            
            {/* UK and Ireland */}
            <path
              d="M445 120 C450 118 455 122 457 127 C459 132 457 137 453 140 C449 143 444 142 441 138 C438 134 439 129 442 125 C444 122 446 120 445 120 Z"
              fill="#10b981"
              stroke="#059669"
              strokeWidth="0.5"
            />
            
            {/* Japan */}
            <path
              d="M850 180 C855 178 860 182 862 187 C864 192 862 197 858 200 C854 203 849 202 846 198 C843 194 844 189 847 185 C849 182 851 180 850 180 Z"
              fill="#10b981"
              stroke="#059669"
              strokeWidth="0.5"
            />
            
            <path
              d="M845 200 C850 198 855 202 857 207 C859 212 857 217 853 220 C849 223 844 222 841 218 C838 214 839 209 842 205 C844 202 846 200 845 200 Z"
              fill="#10b981"
              stroke="#059669"
              strokeWidth="0.5"
            />
            
            {/* Philippines */}
            <path
              d="M780 260 C783 258 786 260 787 263 C788 266 786 269 783 270 C780 271 777 269 776 266 C775 263 777 261 780 260 Z"
              fill="#10b981"
              stroke="#059669"
              strokeWidth="0.5"
            />
            
            {/* Indonesia */}
            <path
              d="M720 280 C730 278 740 282 748 288 C756 294 762 302 765 310 C768 318 768 326 765 334 C762 340 756 344 748 346 C740 348 730 346 722 342 C714 338 708 332 705 324 C702 316 702 308 705 300 C708 294 714 290 720 280 Z"
              fill="#10b981"
              stroke="#059669"
              strokeWidth="0.5"
            />
          </svg>

          {/* Chapter Pins */}
          {Object.entries(chaptersByLocation).map(([location, chapters]) => {
            const coords = countryCoordinates[location];
            if (!coords) return null;

            return (
              <div key={location} className="absolute">
                <div
                  className="map-pin relative cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: coords.x,
                    top: coords.y
                  }}
                  onClick={() => handlePinClick(location, chapters)}
                >
                  {/* Pin with country flag */}
                  <div className="relative">
                    <div className="w-8 h-8 bg-white rounded-full shadow-lg border-2 border-blue-500 flex items-center justify-center hover:scale-110 transition-transform duration-200">
                      <span className="text-lg">{getTagEmoji(location)}</span>
                    </div>
                    
                    {/* Chapter count badge */}
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {chapters.length}
                    </div>
                    
                    {/* Pin stem */}
                    <div className="absolute top-6 left-1/2 w-0.5 h-4 bg-blue-500 transform -translate-x-1/2"></div>
                  </div>

                  {/* Chapter tooltip */}
                  {selectedPin === location && (
                    <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-3 min-w-48 max-w-64">
                        {/* Arrow pointing up */}
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45"></div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">{getTagEmoji(location)}</span>
                            <h4 className="font-semibold text-gray-900">{location}</h4>
                          </div>
                          
                          <div className="space-y-1">
                            {chapters.slice(0, 3).map((chapter) => (
                              <div key={chapter.id} className="flex items-center gap-2 text-sm">
                                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                  <img 
                                    src={`https://raw.githubusercontent.com/znack2/book_local/main/docs/chapters/${chapter.title}.png`} 
                                    alt={`Chapter ${chapter.id}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span className="text-gray-700 truncate">
                                  Ch.{chapter.id}: {chapter.title}
                                </span>
                              </div>
                            ))}
                            
                            {chapters.length > 3 && (
                              <div className="text-xs text-gray-500 pl-8">
                                +{chapters.length - 3} more chapters
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Map Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <button
            onClick={() => setScale(Math.min(3, scale + 0.2))}
            className="w-8 h-8 bg-white hover:bg-gray-50 rounded-md shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
            title="Zoom In"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <button
            onClick={() => setScale(Math.max(0.5, scale - 0.2))}
            className="w-8 h-8 bg-white hover:bg-gray-50 rounded-md shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
            title="Zoom Out"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
            </svg>
          </button>
        </div>

        {/* Navigation hint */}
        {scale === 1 && position.x === 0 && position.y === 0 && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-gray-600 shadow-sm">
            💡 Drag to pan • Scroll to zoom • Click pins to explore
          </div>
        )}
      </div>

      {/* Map Statistics */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Active Filter: <span className="font-medium text-gray-900">{selectedFilter}</span>
            </span>
            <span className="text-gray-600">
              Showing: <span className="font-medium text-gray-900">{filteredItems.length} chapters</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {Object.entries(chaptersByLocation).map(([location, chapters]) => (
              <div key={location} className="flex items-center gap-1">
                <span>{getTagEmoji(location)}</span>
                <span className="text-xs text-gray-600">{chapters.length}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveWorldMap;