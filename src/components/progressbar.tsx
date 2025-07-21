import React from 'react';
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";

const ProgressBar = ({ openedChapters, totalChapters, progressPercentage }) => {
  const createMilestoneMarkers = () => {
    const milestones = [];
    for (let i = 6; i <= totalChapters; i += 6) {
      const position = (i / totalChapters) * 100;
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

  return (
    <div className="px-6 py-3 bg-white/80 border-b border-amber-200/30 flex-shrink-0">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-amber-900 leading-tight">Chapter Progress</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-700 leading-tight">{openedChapters} of {totalChapters} chapters opened</span>
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
  );
};

export default ProgressBar;