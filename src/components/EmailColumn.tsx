import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  isMobile?: boolean;
  chapterId?: string;
}

const EmailColumn: React.FC<EmailColumnProps> = ({ 
  showEmailToggle = false, 
  onEmailToggle,
  isVisible = true,
  isMobile = true,
  animateEmails = false,
  chapterId = '1'
}) => {
  const [loadedEmails, setLoadedEmails] = useState<Set<number>>(new Set([0])); // First email is loaded by default
  const [currentlyLoadingEmail, setCurrentlyLoadingEmail] = useState<number | null>(null); // Track which single email is loading
  const [justLoadedEmails, setJustLoadedEmails] = useState<Set<number>>(new Set()); // Track recently loaded emails for highlighting
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const emailRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

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

  // Reset when chapter changes
  useEffect(() => {
    setLoadedEmails(new Set([0])); // Only first email loaded
    setCurrentlyLoadingEmail(null);
    setJustLoadedEmails(new Set());
  }, [chapterId]);

  // Set up intersection observer for scroll detection
  useEffect(() => {
    if (!chapterData?.emails) return;

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const emailIndex = parseInt(entry.target.getAttribute('data-email-index') || '0');
            
            // Only allow loading the next sequential email
            const nextExpectedEmail = Math.max(...Array.from(loadedEmails)) + 1;
            
            // If this is the next email, not loaded, and nothing is currently loading
            if (emailIndex === nextExpectedEmail && 
                !loadedEmails.has(emailIndex) && 
                currentlyLoadingEmail === null) {
              
              // Start loading this specific email
              setCurrentlyLoadingEmail(emailIndex);
              
              // After 1.5 seconds, finish loading and show email
              setTimeout(() => {
                setCurrentlyLoadingEmail(null);
                setLoadedEmails(prev => new Set([...prev, emailIndex]));
                
                // Add to just loaded emails for highlighting
                setJustLoadedEmails(prev => new Set([...prev, emailIndex]));
                
                // Remove highlight after 2 seconds
                setTimeout(() => {
                  setJustLoadedEmails(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(emailIndex);
                    return newSet;
                  });
                }, 2000);
              }, 1500);
            }
          }
        });
      },
      {
        root: scrollContainerRef.current,
        rootMargin: '100px 0px', // Trigger 100px before the element comes into view
        threshold: 0.1
      }
    );

    // Observe all email placeholder elements
    Object.values(emailRefs.current).forEach((ref, index) => {
      if (ref && index > 0) { // Skip first email (index 0)
        observerRef.current?.observe(ref);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [chapterData?.emails, loadedEmails, currentlyLoadingEmail]);

  function formatLinksAndBoldText(text) {
    if (!text) return text;
    
    // First, handle bold text formatting
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // URL regex pattern that matches http, https, www, and plain domains
    const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`[\]]+|www\.[^\s<>"{}|\\^`[\]]+|(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?:\/[^\s<>"{}|\\^`[\]]*)?)/gi;
    
    // Replace URLs with anchor tags
    formattedText = formattedText.replace(urlRegex, (url) => {
      // Ensure the URL has a protocol for the href attribute
      let href = url;
      if (!url.match(/^https?:\/\//)) {
        href = 'https://' + url;
      }
      
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color: #d97706; text-decoration: underline;">${url}</a>`;
    });
    
    return formattedText;
  }

  // SVG Loading Animation component
  const EmailLoadingAnimation = () => (
    <div className="flex justify-center items-center py-16 mb-8">
      <div className="relative flex items-center justify-center w-32 h-32">
        {/* Circular ripple background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border border-slate-400 opacity-20 animate-ping" style={{ animationDuration: '2s' }}></div>
          <div className="absolute w-24 h-24 rounded-full border border-slate-400 opacity-30 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }}></div>
          <div className="absolute w-16 h-16 rounded-full border border-slate-400 opacity-40 animate-ping" style={{ animationDuration: '2s', animationDelay: '1s' }}></div>
        </div>
        
        {/* Simple envelope icon */}
        <div className="relative z-10 flex items-center justify-center">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            className="text-slate-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {/* Envelope base */}
            <rect
              x="8"
              y="12"
              width="32"
              height="24"
              rx="2"
              fill="none"
              stroke="currentColor"
            />
            
            {/* Envelope flap */}
            <path
              d="M8 14 L24 24 L40 14"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
      </div>
    </div>
  );

  const EmailStructured = (email, chapterId, isJustLoaded = false) => {
    return (
      <div className={`overflow-hidden shadow-sm mb-4 transform transition-all duration-700 ease-out opacity-100 translate-y-0 scale-100 rounded-lg ${
        isJustLoaded ? 'border-2 border-white shadow-lg to-amber-100' : ''
      }`}>
        {/* Email Body */}
        <div className="p-4">
          <div className="text-sm text-gray-800 space-y-3">
            <div className="flex items-center gap-3 mb-3">

               <div className="flex-1">
                <div className="mb-1" style={{
                  margin: '40px 40px 40px 10px',
                   textAlign: 'center'
                }}>
                  <h1 className="font-medium text-black-900 text-lg w-full" style={{
  fontWeight: 900,
  lineHeight: '5rem',
  margin: '-10px',
  textTransform: 'uppercase',
  background: 'linear-gradient(45deg, #3B82F6, #21293a)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
  fontSize: 'clamp(2rem, 15vw, 6rem)',
  letterSpacing: '-0.02em',
  fontStretch: 'condensed',
  fontFamily: 'system-ui, -apple-system, sans-serif'
}}>
                    {email.subject.split(':')[0]}
                  </h1>
                  {email.subject.includes(':') && (
                    <p className="font-medium text-black-900 text-sm mt-1" style={{
                  margin: '50px 10px 5px',
                }}>
                      {email.subject.split(':')[1].trim()}
                    </p>
                  )}
                  <div className="text-xs text-black-600" style={{
                  textAlign: 'center'
                }}>
                    <span className="ml-2">{email.date}</span>
                  </div>
                </div>

              </div>
            </div>
            
            {/* Greeting */}
            {email.greeting && (
              <p className="text-black-800">{email.greeting}</p>
            )}
            
            {/* Body paragraphs */}
<div 
              className="text-xs text-black-800 leading-relaxed whitespace-pre-line mb-4"
              dangerouslySetInnerHTML={{ __html: formatLinksAndBoldText(email.body) }}
            />
            
            {/* Email Signature Section */}
            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-200">

                          {/* Avatar - Right Side */}
              <div className="flex">
                <Avatar className="w-12 h-12">
                  <img 
                    src={`https://raw.githubusercontent.com/znack2/book_local/main/docs/chapters/${email.avatar}.png`}
                    className="aspect-square h-full w-full rounded-full object-cover"
                    alt={`${email.signature.name} avatar`}
                  />
                </Avatar>
              </div>
              {/* Signature Text - Left Side */}
              <div className="flex" style={{
                width: '500px'
              }}>
                <div className="text-xs text-black-700">
                  <div className="italic mb-1">Best regards,</div>
                  <div className="font-medium text-black-900">{email.signature.name}</div>
                  <div className="text-black-600">{email.signature.title}</div>
                  <div className="text-black-600">{email.signature.company}</div>
                </div>
              </div>

                         {email.highlight && (
                          <div className="flex">
                            <div className="mt-2 p-4 bg-gradient-to-r from-yellow-100 to-amber-100 border-l-4 border-amber-400 rounded-r-lg shadow-sm relative">
                              <div className="absolute top-2 right-2 text-amber-600 opacity-60">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              </div>
                              <div className="font-semibold text-amber-900 text-sm leading-relaxed mb-1">
                                {email.highlight.title}
                              </div>
                              <div className="text-amber-800 text-xs leading-relaxed italic">
                                "{email.highlight.description}"
                              </div>
                              <div className="absolute bottom-1 right-2 text-amber-500 text-xs font-medium opacity-75">
                                highlight
                              </div>
                            </div>
                          </div>
                        )}
              

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
          
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto"
            style={{ scrollBehavior: 'smooth' }}
          >
            <div className="p-4">
              {/* Author Info Section */}
              <div className="p-4 mb-4">
                <h4 className="text-black-900 font-semibold text-sm mb-2">
                  {chapterData.emailColumn.authorInfo.title}
                </h4>
                <p className="text-black-800 leading-relaxed" style={{
                  margin: '10px',
                  fontStyle: 'italic'
                }}>
                  <div 
                    className="leading-relaxed whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: formatLinksAndBoldText(chapterData.emailColumn.authorInfo.description) }}
                  />
                </p>
              </div>

              {/* Email Templates */}
              <div className="space-y-3 mb-4">
                {chapterData.emails.map((email, index) => (
                  <div 
                    key={index}
                    ref={el => emailRefs.current[index] = el}
                    data-email-index={index}
                    className="min-h-[100px]" // Ensure space for intersection observer
                  >
                    {/* First email is always shown, others show based on loaded state */}
                    {(index === 0 || loadedEmails.has(index)) ? (
                      <>
                        {email && EmailStructured(email, chapterId, justLoadedEmails.has(index))}
                        

                        
                        <div className="flex justify-center my-4">
                          <span className="text-amber-700 text-sm font-medium mr-3 italic">
                            now fill the canvas
                          </span>
                          <svg 
                            className="w-20 h-8 text-amber-600" 
                            viewBox="0 0 80 32" 
                            fill="none" 
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path 
                              d="M8 16 Q20 12, 32 16 T56 16 L68 16" 
                              strokeWidth="2.5"
                              className="animate-pulse"
                            />
                            <path 
                              d="M62 11 Q68 15, 72 16 Q68 17, 62 21" 
                              strokeWidth="2.5"
                              fill="none"
                            />
                            <path 
                              d="M12 20 Q16 18, 20 20" 
                              strokeWidth="1.5"
                              opacity="0.7"
                            />
                            <path 
                              d="M40 12 Q44 14, 48 12" 
                              strokeWidth="1.5"
                              opacity="0.7"
                            />
                          </svg>
                        </div>
                      </>
                    ) : currentlyLoadingEmail === index ? (
                      // Show loading animation only for the specific email that's loading
                      <EmailLoadingAnimation />
                    ) : (
                      // Show placeholder for emails that haven't been reached yet
                      <div className="py-12 mb-8 border-2 border-dashed border-amber-200 rounded-lg">
                        <div className="flex justify-center items-center text-amber-600 opacity-50">
                          <svg width="50" height="37" viewBox="0 0 50 37" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="8" width="44" height="24" rx="3" />
                            <path d="M3 10 L25 22 L47 10" />
                          </svg>
                          <span className="ml-3 text-base">Scroll down to load email {index + 1}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Show final sections only after all emails are visible */}
              {loadedEmails.size >= chapterData.emails.length && (
                <>
                  {/* Key Takeaways Section */}
                  <div className="p-4 mb-4 transform transition-all duration-500 opacity-100 translate-y-0">
                    <h4 className="text-black-900 font-semibold text-sm mb-2">
                      {chapterData.emailColumn.keyTakeaways.title}
                    </h4>
                    <p className="text-black-800 text-xs leading-relaxed">
                      {chapterData.emailColumn.keyTakeaways.description}
                    </p>
                  </div>

                  {/* Materials Used Section */}
                  <div className="p-4 mb-4 transform transition-all duration-500 opacity-100 translate-y-0">
                    <h4 className="text-black-900 font-semibold text-sm mb-3">Materials Used</h4>
                    <ul className="space-y-2">
                      {chapterData.emailColumn.materialsUsed.map((material, index) => (
                        <li key={index} className="text-black-800 text-xs leading-relaxed">
                          • {material}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EmailColumn;