import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, BookOpen, Users, Target, Building, Globe, AlertTriangle, CheckCircle, X, User, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Separate Questionnaire Page Component
const QuestionnairePage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    position: '',
    industry: '',
    markets: '',
    globalStatus: '',
    challenges: [],
    readingReasons: []
  });

  // Chapter mapping - Update these with your actual chapters
  const chapters = [
    { id: 1, title: "Market Research & Target Audience Analysis", keywords: ['market', 'research', 'audience', 'understanding'], description: "Learn how to identify and understand your target market in new regions" },
    { id: 2, title: "Building and Managing Local Teams", keywords: ['team', 'hiring', 'management', 'local'], description: "Strategies for recruiting, hiring, and managing teams in international markets" },
    { id: 3, title: "Legal Entity Setup & Compliance", keywords: ['legal', 'entity', 'compliance', 'registration'], description: "Navigate the legal requirements and regulatory frameworks in new markets" },
    { id: 4, title: "International Marketing Strategies", keywords: ['marketing', 'digital', 'strategy', 'brand'], description: "Develop effective marketing campaigns that resonate across different cultures" },
    { id: 5, title: "Sales Processes & Customer Acquisition", keywords: ['sales', 'strategy', 'conversion', 'customer'], description: "Build sales funnels and acquisition strategies for international markets" },
    { id: 6, title: "Cultural Adaptation & Localization", keywords: ['culture', 'localization', 'adaptation', 'communication'], description: "Adapt your business model and communication to local cultures" },
    { id: 7, title: "Financial Planning & Currency Management", keywords: ['finance', 'budget', 'planning', 'money'], description: "Handle international finances, budgeting, and currency considerations" },
    { id: 8, title: "Technology Infrastructure Setup", keywords: ['technology', 'infrastructure', 'systems', 'tech'], description: "Set up technology stack and infrastructure for global operations" },
    { id: 9, title: "Partnership Development & Local Networks", keywords: ['partnership', 'collaboration', 'network', 'relationships'], description: "Build strategic partnerships and professional networks in new markets" },
    { id: 10, title: "Risk Management & Mitigation", keywords: ['risk', 'management', 'mitigation', 'protection'], description: "Identify and mitigate risks associated with international expansion" },
    { id: 11, title: "Customer Service & Support Systems", keywords: ['customer', 'service', 'support', 'satisfaction'], description: "Establish customer service frameworks for international customers" },
    { id: 12, title: "Scaling Operations Globally", keywords: ['scaling', 'operations', 'expansion', 'growth'], description: "Scale your business operations efficiently across multiple markets" }
  ];

  const challengeOptions = [
    'Building and managing local teams',
    'Understanding target audience and market research', 
    'Legal entity setup and regulatory compliance',
    'Marketing and brand awareness in new markets',
    'Sales processes and customer acquisition',
    'Not sure yet - still exploring options'
  ];

  const readingReasonOptions = [
    'Develop comprehensive market entry strategy',
    'Build and manage international teams effectively',
    'Navigate legal and compliance requirements',
    'Create localized marketing campaigns',
    'Optimize sales processes for global markets',
    'Understand cultural differences and adaptation',
    'Plan finances and manage currency risks',
    'Set up technology infrastructure globally',
    'Build partnerships and professional networks',
    'Implement risk management strategies',
    'Establish customer service frameworks',
    'Scale operations across multiple countries',
    'Conduct competitive analysis in new markets',
    'Develop product localization strategies',
    'Optimize supply chain for international markets',
    'Create pricing strategies for different regions',
    'Develop crisis management protocols',
    'Implement performance measurement systems',
    'Plan exit strategies for underperforming markets',
    'Learn from successful global expansion case studies'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const getRecommendations = () => {
    const recommendations = [];
    const allKeywords = [];

    // Add keywords based on challenges
    formData.challenges.forEach(challenge => {
      if (challenge.includes('team')) allKeywords.push('team', 'management', 'hiring');
      if (challenge.includes('audience') || challenge.includes('market research')) allKeywords.push('market', 'research', 'audience');
      if (challenge.includes('legal')) allKeywords.push('legal', 'compliance', 'entity');
      if (challenge.includes('marketing')) allKeywords.push('marketing', 'brand', 'strategy');
      if (challenge.includes('sales')) allKeywords.push('sales', 'customer', 'conversion');
    });

    // Add keywords based on reading reasons
    formData.readingReasons.forEach(reason => {
      const lowerReason = reason.toLowerCase();
      if (lowerReason.includes('team')) allKeywords.push('team', 'management');
      if (lowerReason.includes('market')) allKeywords.push('market', 'research');
      if (lowerReason.includes('legal') || lowerReason.includes('compliance')) allKeywords.push('legal', 'compliance');
      if (lowerReason.includes('marketing')) allKeywords.push('marketing', 'strategy');
      if (lowerReason.includes('sales')) allKeywords.push('sales', 'customer');
      if (lowerReason.includes('cultural') || lowerReason.includes('localization')) allKeywords.push('culture', 'localization');
      if (lowerReason.includes('financial') || lowerReason.includes('finance')) allKeywords.push('finance', 'budget');
      if (lowerReason.includes('technology') || lowerReason.includes('infrastructure')) allKeywords.push('technology', 'infrastructure');
      if (lowerReason.includes('partnership') || lowerReason.includes('network')) allKeywords.push('partnership', 'network');
      if (lowerReason.includes('risk')) allKeywords.push('risk', 'management');
      if (lowerReason.includes('scaling') || lowerReason.includes('operations')) allKeywords.push('scaling', 'operations');
    });

    // Score chapters based on keyword matches
    const chapterScores = chapters.map(chapter => {
      const score = chapter.keywords.reduce((acc, keyword) => {
        return acc + allKeywords.filter(k => k.includes(keyword) || keyword.includes(k)).length;
      }, 0);
      return { ...chapter, score };
    });

    // Sort by score and take top 3, but ensure we have at least 2 recommendations
    const sortedChapters = chapterScores
      .filter(chapter => chapter.score > 0)
      .sort((a, b) => b.score - a.score);

    if (sortedChapters.length >= 2) {
      recommendations.push(...sortedChapters.slice(0, 3));
    } else {
      // Fallback recommendations based on common needs
      if (formData.challenges.length > 0 || formData.readingReasons.length > 0) {
        recommendations.push(
          chapters.find(ch => ch.id === 1),
          chapters.find(ch => ch.id === 4),
          chapters.find(ch => ch.id === 5)
        );
      }
    }

    return recommendations.filter(Boolean);
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      const recommendations = getRecommendations();
      setShowRecommendations(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    const recommendations = getRecommendations();
    
    // Save to localStorage for the banner on gallery page
    localStorage.setItem('chapterRecommendations', JSON.stringify(recommendations));
    localStorage.setItem('userQuestionnaireData', JSON.stringify(formData));
    
    // Navigate to gallery/book page
    navigate('/');
  };

  const handleSkip = () => {
    // Navigate to gallery without saving recommendations
    navigate('/');
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() && formData.companyName.trim() && formData.position.trim();
      case 2:
        return formData.challenges.length > 0;
      case 3:
        return formData.readingReasons.length > 0;
      default:
        return false;
    }
  };

  if (showRecommendations) {
    const recommendations = getRecommendations();
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ 
      background: 'linear-gradient(135deg, #f5f2e8 0%, #e8dcc0 100%)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
        <div className="bg-white rounded-lg max-w-2xl w-full shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <h2 className="text-2xl font-bold text-gray-900">Your Personalized Reading Path</h2>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Based on your answers, we recommend starting with these chapters:
              </p>

              <div className="space-y-4">
                {recommendations.map((chapter, index) => (
                  <div
                    key={chapter.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                        {chapter.id}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{chapter.title}</h3>
                        <p className="text-gray-600 text-sm">{chapter.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tips Based on Your Profile:</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                {formData.challenges.includes('Understanding target audience and market research') && (
                  <li>• Start with market research before making any major business decisions</li>
                )}
                {formData.challenges.includes('Building and managing local teams') && (
                  <li>• Consider hiring local talent to bridge cultural gaps</li>
                )}
                {formData.challenges.includes('Legal entity setup and regulatory compliance') && (
                  <li>• Consult with local legal experts to avoid compliance issues</li>
                )}
                {formData.globalStatus.includes('exploring') && (
                  <li>• Take time to thoroughly research before committing to expansion</li>
                )}
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleComplete}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Start Reading
              </button>
              <button
                onClick={handleSkip}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Browse All Chapters
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ 
      background: 'linear-gradient(135deg, #f5f2e8 0%, #e8dcc0 100%)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <div className="bg-white rounded-lg max-w-2xl w-full shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome! Let's Personalize Your Experience</h1>
                <p className="text-gray-600">Get chapter recommendations tailored to your business needs</p>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-700">Step {currentStep} of 3</span>
              <span className="text-sm text-gray-500">• 2-3 minutes</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Benefits Bar */}
  {/*        {currentStep === 1 && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">🎯 What you'll get:</h4>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• Personalized chapter recommendations based on your specific challenges</li>
                <li>• A custom roadmap prioritizing the most relevant content for your situation</li>
                <li>• Pro tips for avoiding common mistakes in your industry and target markets</li>
              </ul>
            </div>
          )}*/}

          {/* Step 1: Company Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <User className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Tell us about your business</h3>
                <p className="text-gray-600">This helps us recommend the most relevant chapters</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position *
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., CEO, Marketing Director"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., SaaS, E-commerce, Fintech"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Markets
                  </label>
                  <input
                    type="text"
                    value={formData.markets}
                    onChange={(e) => handleInputChange('markets', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., US, EU, Brazil, Asia"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Global Expansion Status
                  </label>
                  <select
                    value={formData.globalStatus}
                    onChange={(e) => handleInputChange('globalStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select status</option>
                    <option value="exploring">Just exploring options</option>
                    <option value="planning">Actively planning expansion</option>
                    <option value="started">Already started in 1-2 markets</option>
                    <option value="expanding">Expanding to more markets</option>
                    <option value="established">Established in multiple markets</option>
                  </select>
                </div>
              </div>

              {/* Example Company */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  <strong>Example:</strong> Sarah Johnson, TechFlow Solutions, Chief Marketing Officer, 
                  SaaS Platform, targeting EU and Latin America, actively planning expansion.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Challenges */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <AlertTriangle className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">What are your main challenges?</h3>
                <p className="text-gray-600">Select all that apply to get targeted recommendations</p>
              </div>

              <div className="space-y-3">
                {challengeOptions.map((challenge) => (
                  <label
                    key={challenge}
                    className={`flex items-start gap-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.challenges.includes(challenge)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.challenges.includes(challenge)}
                      onChange={() => handleMultiSelect('challenges', challenge)}
                      className="mt-1 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">{challenge}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Reading Reasons */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Target className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">What are your main goals?</h3>
                <p className="text-gray-600">Choose what you want to achieve (select multiple)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                {readingReasonOptions.map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.readingReasons.includes(reason)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.readingReasons.includes(reason)}
                      onChange={() => handleMultiSelect('readingReasons', reason)}
                      className="mt-1 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-900">{reason}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <div className="flex gap-3">
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Skip and browse all chapters
              </button>
            </div>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-colors ${
                canProceed()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {currentStep === 3 ? 'Get Recommendations' : 'Next'}
              {currentStep < 3 && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionnairePage;