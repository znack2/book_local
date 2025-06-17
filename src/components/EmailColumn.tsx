
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { TwicImg } from '@twicpics/components/react';
import chapterData1 from '../data/chapterData1.json';
import chapterData2 from '../data/chapterData2.json';
import chapterData3 from '../data/chapterData3.json';
import chapterData4 from '../data/chapterData4.json';
import chapterData5 from '../data/chapterData5.json';
import chapterData6 from '../data/chapterData6.json';
import chapterData7 from '../data/chapterData7.json';
import chapterData8 from '../data/chapterData8.json';
import chapterData9 from '../data/chapterData9.json';
import chapterData10 from '../data/chapterData10.json';
import chapterData11 from '../data/chapterData11.json';
import chapterData12 from '../data/chapterData12.json';
import chapterData13 from '../data/chapterData13.json';
import chapterData14 from '../data/chapterData14.json';
import chapterData15 from '../data/chapterData15.json';
import chapterData16 from '../data/chapterData16.json';
import chapterData17 from '../data/chapterData17.json';
import chapterData18 from '../data/chapterData18.json';
import chapterData19 from '../data/chapterData19.json';
import chapterData20 from '../data/chapterData20.json';

interface EmailColumnProps {
  showEmailToggle?: boolean;
  onEmailToggle?: () => void;
  isVisible?: boolean;
  animateEmails?: boolean;
  chapterId?: string;
}

const EmailColumn: React.FC<EmailColumnProps> = ({ 
  showEmailToggle = false, 
  onEmailToggle,
  isVisible = true,
  animateEmails = false,
  chapterId = '1'
}) => {
  // Select chapter data based on chapterId
  const getChapterData = () => {
    const chapterMap: { [key: string]: any } = {
      '1': chapterData1,
      '2': chapterData2,
      '3': chapterData3,
      '4': chapterData4,
      '5': chapterData5,
      '6': chapterData6,
      '7': chapterData7,
      '8': chapterData8,
      '9': chapterData9,
      '10': chapterData10,
      '11': chapterData11,
      '12': chapterData12,
      '13': chapterData13,
      '14': chapterData14,
      '15': chapterData15,
      '16': chapterData16,
      '17': chapterData17,
      '18': chapterData18,
      '19': chapterData19,
      '20': chapterData20,
    };

    const chapterNum = parseInt(chapterId);
    let baseData = chapterMap[chapterId];
    
    if (!baseData) {
      // For chapters 21-48, cycle through existing data with modified titles and content
      const cycleIndex = ((chapterNum - 1) % 20) + 1;
      baseData = chapterMap[cycleIndex.toString()] || chapterData1;
      
      // Generate unique content for chapters 21-48
      const topics = [
        'Risk Management', 'Quality Assurance', 'Project Management', 'Leadership Development',
        'Change Management', 'Performance Optimization', 'Team Building', 'Process Improvement',
        'Competitive Analysis', 'Market Research', 'Brand Development', 'Product Strategy',
        'Operational Excellence', 'Crisis Management', 'Stakeholder Management', 'Agile Methodology',
        'Digital Marketing', 'Customer Analytics', 'Revenue Optimization', 'Strategic Planning',
        'Innovation Culture', 'Technology Integration', 'Vendor Management', 'Compliance Strategy',
        'Growth Hacking', 'Business Intelligence', 'Merger & Acquisition', 'International Expansion'
      ];
      
      const topicIndex = (chapterNum - 21) % topics.length;
      const topic = topics[topicIndex];
      
      // Generate avatar with Twicpics from local folder
      const avatarIndex = ((chapterNum - 21) % 10) + 1;
      const avatarUrl = `chapters/chapter-${avatarIndex}.png?twic=v1/resize=40x40/cover`;
      
      baseData = {
        ...baseData,
        emailColumn: {
          ...baseData.emailColumn,
          title: `Email Templates - Chapter ${chapterNum}`,
          authorInfo: {
            title: "About the Author",
            description: `Expert in ${topic.toLowerCase()} with extensive experience in strategic implementation and organizational transformation.`
          },
          keyTakeaways: {
            title: "Key Takeaways",
            description: `${topic} requires systematic approach and continuous improvement. Focus on best practices and measurable outcomes for sustained success.`
          }
        },
        emails: baseData.emails.map((email: any) => ({
          ...email,
          avatar: avatarUrl,
          subject: `${topic} Excellence: Strategic Implementation Guide`,
          preview: `Dear Professional, mastering ${topic.toLowerCase()} is crucial for organizational success. Learn proven strategies and frameworks...`,
          meta: `Template • ${topic}`,
          highlight: {
            title: `${topic} Framework`,
            description: `Comprehensive approach to ${topic.toLowerCase()} with implementation strategies and performance metrics`
          }
        }))
      };
    } else {
      // For chapters 1-20, update avatars to use Twicpics
      baseData = {
        ...baseData,
        emails: baseData.emails.map((email: any, index: number) => ({
          ...email,
          avatar: `chapters/chapter-${((parseInt(chapterId) - 1 + index) % 10) + 1}.png?twic=v1/resize=40x40/cover`
        }))
      };
    }

    return baseData;
  };

  const chapterData = getChapterData();

  return (
    <div className={`flex flex-col h-full overflow-hidden transition-all duration-300 ${isVisible ? 'w-full opacity-100' : 'w-0 opacity-0'}`}>
      {isVisible && (
        <>
          <div className="p-3 bg-white/50 border-b border-amber-200/30 flex justify-between items-center flex-shrink-0">
            <h3 className="text-amber-900 text-sm font-semibold">{chapterData.emailColumn.title}</h3>
            {showEmailToggle && onEmailToggle && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEmailToggle}
                className="transition-all duration-300 bg-gradient-to-r from-amber-200 to-amber-300 text-amber-900 shadow-md"
              >
                <span className="hidden md:inline text-xs">
                  {isVisible ? 'Hide Emails' : 'Show Emails'}
                </span>
                <span className="md:hidden">
                  {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                </span>
              </Button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              {/* Author Info Section */}
              <div className="mb-4">
                <h4 className="text-amber-900 font-semibold text-sm mb-2">
                  {chapterData.emailColumn.authorInfo.title}
                </h4>
                <p className="text-amber-800 text-xs leading-relaxed">
                  {chapterData.emailColumn.authorInfo.description}
                </p>
              </div>

              {/* Email Templates */}
              <div className="space-y-3 mb-4">
                {chapterData.emails.map((email, index) => (
                  <div 
                    key={index} 
                    className={`p-4 transition-all duration-500 ${
                      animateEmails 
                        ? `animate-fade-in opacity-100 translate-y-0` 
                        : 'opacity-0 translate-y-4'
                    }`}
                    style={{
                      animationDelay: animateEmails ? `${index * 200}ms` : '0ms'
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="w-8 h-8">
                        <TwicImg 
                          src={`/chapters/chapter-${((parseInt(chapterId) - 1 + index) % 10) + 1}.png`}
                          className="aspect-square h-full w-full rounded-full object-cover"
                        />
                        <AvatarFallback className="text-xs bg-amber-200 text-amber-800">
                          {email.sender.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium text-amber-900 text-sm">{email.subject}</h4>
                          <span className="text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded">
                            {email.meta}
                          </span>
                        </div>
                        <div className="text-xs text-amber-600">
                          <span>{email.sender}</span>
                          <span className="ml-2">{email.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-amber-800 mb-3 ml-11">{email.preview}</p>
                    <div className="ml-11 text-xs text-amber-700 italic">
                      Best regards,<br/>
                      {email.signature.name}<br/>
                      {email.signature.title}<br/>
                      {email.signature.company}
                    </div>
                    {email.highlight && (
                      <div className="ml-11 mt-2 p-2 bg-amber-50 rounded text-xs">
                        <div className="font-medium text-amber-900">{email.highlight.title}</div>
                        <div className="text-amber-800">{email.highlight.description}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Key Takeaways Section */}
              <div className="mb-4">
                <h4 className="text-amber-900 font-semibold text-sm mb-2">
                  {chapterData.emailColumn.keyTakeaways.title}
                </h4>
                <p className="text-amber-800 text-xs leading-relaxed">
                  {chapterData.emailColumn.keyTakeaways.description}
                </p>
              </div>

              {/* Materials Used Section */}
              <div>
                <h4 className="text-amber-900 font-semibold text-sm mb-3">Materials Used</h4>
                <ul className="space-y-2">
                  {chapterData.emailColumn.materialsUsed.map((material, index) => (
                    <li key={index} className="text-amber-800 text-xs leading-relaxed">
                      • {material}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EmailColumn;
