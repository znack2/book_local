
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { TwicImg } from '@twicpics/components/react';

interface ChapterCardProps {
  id: number;
  title: string;
  preview: string;
  logo: string;
  image?: string;
  tags: string[];
  emailCount?: number;
  isActive?: boolean;
  onClick?: () => void;
}

const ChapterCard: React.FC<ChapterCardProps> = ({
  id,
  title,
  preview,
  logo,
  image,
  tags,
  emailCount,
  isActive = false,
  onClick
}) => {
  return (
    <div 
      className={`relative bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 border-2 border-amber-200 shadow-md ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="absolute top-2 right-2 w-4 h-6 bg-amber-600 transform rotate-12 rounded-sm"></div>
      <div className="flex gap-2 mb-3">
        {tags.slice(0, 2).map((tag, index) => (
          <Badge key={index} variant="outline" className="text-xs bg-amber-200 text-amber-800 border-amber-300">
            {tag}
          </Badge>
        ))}
      </div>
      <div className="mb-2">
        <div className="mb-2">
          <TwicImg domain="bookgoglobal.twic.pics" src={`logos/logo-${id}.png`} alt="Chapter logo" className="w-8 h-8 rounded object-cover" />
        </div>
        <div className="text-gray-700 text-sm font-bold mb-1">Chapter {id}</div>
        <h3 className="text-sm font-bold text-gray-900 mb-2 leading-tight">
          {title}
        </h3>
        <p className="text-xs text-gray-700 leading-relaxed">
          {preview}
        </p>
      </div>
      <div className="flex justify-between items-end">
        <div className="text-xs text-amber-700">
          {isActive ? 'Active' : emailCount ? `${emailCount.toLocaleString()} emails` : 'Available'}
        </div>
        {image && (
          <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center overflow-hidden">
            <TwicImg domain="bookgoglobal.twic.pics" src={`chapters/chapter-${id}.png`} alt="Chapter image" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterCard;
