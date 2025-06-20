
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock, Calendar } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import articlesData from '../data/articlesData.json';

const Articles = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  // Get unique categories for filter options
  const categories = ["All", ...Array.from(new Set(articlesData.articles.map(item => item.category)))];

  // Filter items based on selected filter
  const filteredItems = selectedFilter === "All" 
    ? articlesData.articles 
    : articlesData.articles.filter(item => item.category === selectedFilter);

  const handleArticleClick = (link: string) => {
    window.open(link, '_blank');
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <PageLayout 
      currentChapterId="0"
        title="Articles" 
        subtitle="Read our latest articles and insights"
        activeItem="Articles"
        showBackButton={true}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2 px-6 py-4 border-b flex-shrink-0" style={{ borderColor: 'rgba(34, 41, 58, 0.15)' }}>
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedFilter === category ? "default" : "outline"}
                className={`cursor-pointer ${
                  selectedFilter === category 
                    ? "text-white hover:opacity-90" 
                    : "text-gray-600 hover:bg-gray-50"
                } border-gray-200`}
                style={{
                  background: selectedFilter === category ? '#22293a' : 'rgba(255, 255, 255, 0.9)'
                }}
                onClick={() => setSelectedFilter(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Articles Grid - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((article) => (
                  <div
                    key={article.id}
                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => handleArticleClick(article.link)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant="outline" className="text-xs" style={{ color: '#22293a', borderColor: '#22293a' }}>
                        {article.category}
                      </Badge>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                    
                    <h3 className="text-lg font-bold mb-2" style={{ color: '#22293a' }}>
                      {article.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {article.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(article.publishDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {article.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Empty State */}
              {filteredItems.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg">No articles found for the selected filter.</p>
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
                      <li>Product Launch</li>
                      <li>Newsletter</li>
                      <li>Onboarding</li>
                      <li>Promotional</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Tools</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>Business Canvas</li>
                      <li>Email Builder</li>
                      <li>Analytics</li>
                      <li>A/B Testing</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Support</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>Documentation</li>
                      <li>Help Center</li>
                      <li>Contact Us</li>
                      <li>Community</li>
                    </ul>
                  </div>
                </div>
                <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-500">
                  © 2024 FS GoGlobal. All rights reserved.
                </div>
              </div>
            </footer>
          </div>
        </div>
      </PageLayout>
    </div>
  );
};

export default Articles;
