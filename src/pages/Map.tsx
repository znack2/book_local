import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import InteractiveWorldMap from '@/components/InteractiveWorldMap';
import { Globe } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useToast } from "@/hooks/use-toast";
import galleryData from '../data/galleryData.json';

const Map = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [showMap, setShowMap] = useState(false);

  return (
    <div>
        {/* Map Toggle Button */}
        <div className="px-6 py-3 border-b border-gray-100 bg-white flex-shrink-0">
          <button
            onClick={() => setShowMap(!showMap)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium">
              {showMap ? 'Hide' : 'Show'} Global Map
            </span>
          </button>
        </div>

        {/* Interactive World Map */}
        {showMap && (
          <InteractiveWorldMap 
            filteredItems={filteredItems}
            selectedFilter={selectedFilter}
            tagEmojiMap={tagEmojiMap}
            getTagEmoji={getTagEmoji}
          />
        )}
      </div>
  );
};