import React from 'react';
import { X, Lightbulb, Users, Target, DollarSign, Layers, Zap } from 'lucide-react';
import BusinessCanvas from './BusinessCanvas';

interface BusinessCanvasTutorialProps {
  onClose: () => void;
  onComplete: () => void;
}

const BusinessCanvasTutorial: React.FC<BusinessCanvasTutorialProps> = ({ onClose, onComplete }) => {
  const handleComplete = () => {
    onComplete();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Business Canvas - Your Learning Companion</h2>
            <p className="text-gray-600 mt-1">Transform reading into actionable business insights</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-md hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Introduction */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-4">
              <Lightbulb className="w-5 h-5" />
              <span className="font-medium">Why Use the Business Canvas?</span>
            </div>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              While reading each chapter, use this canvas to capture and organize the business insights, strategies, and ideas you discover. Transform abstract concepts into concrete business plans.
            </p>
          </div>

          {/* Canvas Container with Annotations */}
          <div className="relative mb-8">
            <div className="min-h-[600px] relative">
              <BusinessCanvas 
                isEditable={false} 
                canvasId="tutorial" 
                hideButtons={true}
              />
            </div>

            {/* Floating Annotation Tips */}
            <div className="absolute -top-4 left-12 bg-yellow-400 text-yellow-900 px-3 py-2 rounded-full text-sm font-medium shadow-lg transform -rotate-2 z-10">
              💡 Note partnerships mentioned by founders!
            </div>

            <div className="absolute top-20 -right-6 bg-green-400 text-green-900 px-3 py-2 rounded-full text-sm font-medium shadow-lg transform rotate-1 z-10">
              🎯 Who are they targeting?
            </div>

            <div className="absolute top-1/2 -left-8 bg-blue-400 text-blue-900 px-3 py-2 rounded-full text-sm font-medium shadow-lg transform -rotate-1 z-10">
              ⭐ What makes them unique?
            </div>

            <div className="absolute bottom-24 left-1/4 bg-purple-400 text-purple-900 px-3 py-2 rounded-full text-sm font-medium shadow-lg transform rotate-2 z-10">
              💰 How do they make money?
            </div>

            <div className="absolute bottom-24 right-1/4 bg-red-400 text-red-900 px-3 py-2 rounded-full text-sm font-medium shadow-lg transform -rotate-1 z-10">
              📊 What are their main costs?
            </div>

            <div className="absolute top-32 left-1/3 bg-orange-400 text-orange-900 px-3 py-2 rounded-full text-sm font-medium shadow-lg transform rotate-1 z-10">
              🔧 Key activities from the chapter?
            </div>
          </div>

          {/* Learning Tips Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-6 h-6 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Learn from Founders</h3>
              </div>
              <p className="text-blue-800 text-sm">
                As you read, extract the specific business models, strategies, and decisions that successful entrepreneurs made. Map their journey onto your canvas.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <Target className="w-6 h-6 text-green-600" />
                <h3 className="font-semibold text-green-900">Capture Key Insights</h3>
              </div>
              <p className="text-green-800 text-sm">
                Don't just read passively. When you encounter customer segments, revenue models, or partnerships in the text, immediately note them in the relevant canvas section.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-6 h-6 text-purple-600" />
                <h3 className="font-semibold text-purple-900">Your Own Ideas</h3>
              </div>
              <p className="text-purple-800 text-sm">
                Use the canvas to brainstorm your own business concepts inspired by what you're reading. How could you apply these strategies to your own ventures?
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Transform Your Reading?</h3>
            <p className="text-gray-700 mb-4">
              Your business canvas will be automatically saved as you work. Return to it anytime during your reading journey to build upon your insights.
            </p>
            <button
              onClick={handleComplete}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Reading & Building My Canvas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCanvasTutorial;