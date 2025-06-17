
import React from 'react';

interface HighlightCard {
  id: string;
  title: string;
  description: string;
  author: string;
}

const highlightData: HighlightCard[] = [
  {
    id: "1",
    title: "Welcome Series Excellence",
    description: "Expert onboarding flow with comprehensive resource links and 24/7 support commitment for new users",
    author: "John Smith"
  },
  {
    id: "2", 
    title: "Security Best Practices",
    description: "Advanced password security guidelines with 12+ character requirements and special security protocols",
    author: "Sarah Johnson"
  },
  {
    id: "3",
    title: "Product Innovation Update", 
    description: "40% performance boost, new integrations with popular tools, and AI-powered analytics coming soon",
    author: "Mike Chen"
  }
];

interface EmailHighlightsProps {
  isVisible: boolean;
}

const EmailHighlights: React.FC<EmailHighlightsProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-3 bg-white/50 border-b border-amber-200/30 flex justify-between items-center flex-shrink-0">
        <h3 className="text-amber-900 text-sm font-semibold">Email Highlights</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5">
        {highlightData.map((highlight) => (
          <div
            key={highlight.id}
            className="bg-white/80 rounded-xl p-3 mb-3 border border-amber-200/30 transition-all duration-300 border-l-4 border-l-amber-300 cursor-pointer hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:bg-white/95"
          >
            <div className="text-amber-900 font-semibold text-xs mb-1.5">{highlight.title}</div>
            <div className="text-amber-700 text-[10px] leading-relaxed">{highlight.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmailHighlights;
