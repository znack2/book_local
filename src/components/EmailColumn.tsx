
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
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
import chapterData21 from '../data/chapterData21.json';
import chapterData22 from '../data/chapterData22.json';
import chapterData23 from '../data/chapterData23.json';
import chapterData24 from '../data/chapterData24.json';
import chapterData25 from '../data/chapterData25.json';
import chapterData26 from '../data/chapterData26.json';
import chapterData27 from '../data/chapterData27.json';
import chapterData28 from '../data/chapterData28.json';
import chapterData29 from '../data/chapterData29.json';
import chapterData30 from '../data/chapterData30.json';
import chapterData31 from '../data/chapterData31.json';
import chapterData32 from '../data/chapterData32.json';
import chapterData33 from '../data/chapterData33.json';
import chapterData34 from '../data/chapterData34.json';
import chapterData35 from '../data/chapterData35.json';
import chapterData36 from '../data/chapterData36.json';
import chapterData37 from '../data/chapterData37.json';
import chapterData38 from '../data/chapterData38.json';
import chapterData39 from '../data/chapterData39.json';
import chapterData40 from '../data/chapterData40.json';
import chapterData41 from '../data/chapterData41.json';
import chapterData42 from '../data/chapterData42.json';
import chapterData43 from '../data/chapterData43.json';
import chapterData44 from '../data/chapterData44.json';
import chapterData45 from '../data/chapterData45.json';
import chapterData46 from '../data/chapterData46.json';
import chapterData47 from '../data/chapterData47.json';
import chapterData48 from '../data/chapterData48.json';

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
      '21': chapterData21,
      '22': chapterData22,
      '23': chapterData23,
      '24': chapterData24,
      '25': chapterData25,
      '26': chapterData26,
      '27': chapterData27,
      '28': chapterData28,
      '29': chapterData29,
      '30': chapterData30,
      '31': chapterData31,
      '32': chapterData32,
      '33': chapterData33,
      '34': chapterData34,
      '35': chapterData35,
      '36': chapterData36,
      '37': chapterData37,
      '38': chapterData38,
      '39': chapterData39,
      '40': chapterData40,
      '41': chapterData41,
      '42': chapterData42,
      '43': chapterData43,
      '44': chapterData44,
      '45': chapterData45,
      '46': chapterData46,
      '47': chapterData47,
      '48': chapterData48
    };
    
    return chapterMap[chapterId];
  };

  const chapterData = getChapterData();

  function formatBoldText(text) {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }

  const EmailStructured = (email, chapterId ) => {

    return (
      <div className="overflow-hidden shadow-sm mb-4">
        {/* Email Body */}
        <div className="p-4">
          <div className="text-sm text-gray-800 space-y-3">
                     <div className="flex items-center gap-3 mb-3">
                      <Avatar className="w-8 h-8">
                        <img 
                          src={`https://raw.githubusercontent.com/znack2/book_local/main/docs/chapters/${email.title}.png`}
                          className="aspect-square h-full w-full rounded-full object-cover"
                        />
            {/*            <AvatarFallback className="text-xs bg-amber-200 text-amber-800">
                          {email.sender.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>*/}
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium text-black-900 text-sm">{email.subject}</h4>
                     {/*     <span className="text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded">
                            {email.meta}
                          </span>*/}
                        </div>
                        <div className="text-xs text-black-600">
                          {/*<span>{email.sender}</span>*/}
                          <span className="ml-2">{email.date}</span>
                        </div>
                      </div>
                    </div>
                                {/* Greeting */}
            {email.greeting && (
              <p className="text-black-800">{email.greeting}</p>
            )}
                      {/* Body paragraphs */}
                      <div 
                        className="text-xs text-black-800 leading-relaxed whitespace-pre-line"
                        dangerouslySetInnerHTML={{ __html: formatBoldText(email.body) }}
                      />
                      {/* Call to action */}
{/*                      {email.cta && (
                        <div className="p-3 my-4">
                          <a href={email.cta.link} className="font-medium text-center">
                            {email.cta.message}
                          </a>
                        </div>
                      )}*/}

                    <div className="text-xs text-black-700 italic" style={{
                      textAlign: 'end'
                    }}>
                      Best regards,<br/>
                      {email.signature.name}<br/>
                      {email.signature.title}<br/>
                      {email.signature.company}
                    </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex flex-col h-full overflow-hidden transition-all duration-300 ${isVisible ? 'w-full opacity-100' : 'w-0 opacity-0'}`}>
      {isVisible && (
        <>
          <div className="p-3 bg-white/50 border-b border-amber-200/30 flex justify-between items-center flex-shrink-0" style={{
            height: '60px',
            backgroundColor: 'rgb(239 232 214)',
            borderBottom: '1px solid white'
          }}>
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
              <div className="p-4 mb-4">
                <h4 className="text-black-900 font-semibold text-sm mb-2">
                  {chapterData.emailColumn.authorInfo.title}
                </h4>
                <p className="text-black-800 leading-relaxed" style={{
                  margin: '10px',
                  fontStyle: ' italic'
                }}>
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
                  {email && EmailStructured(email, chapterId)}
                    {email.highlight && (
                      <div className="mt-2 p-4 bg-amber-50 rounded text-xs">
                        <div className="font-medium text-black-900">{email.highlight.title}</div>
                        <div className="text-black-800">{email.highlight.description}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Key Takeaways Section */}
              <div className="p-4 mb-4">
                <h4 className="text-black-900 font-semibold text-sm mb-2">
                  {chapterData.emailColumn.keyTakeaways.title}
                </h4>
                <p className="text-black-800 text-xs leading-relaxed">
                  {chapterData.emailColumn.keyTakeaways.description}
                </p>
              </div>

              {/* Materials Used Section */}
              <div className="p-4 mb-4">
                <h4 className="text-black-900 font-semibold text-sm mb-3">Materials Used</h4>
                <ul className="space-y-2">
                  {chapterData.emailColumn.materialsUsed.map((material, index) => (
                    <li key={index} className="text-black-800 text-xs leading-relaxed">
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
