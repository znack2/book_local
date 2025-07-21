import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Users } from 'lucide-react';
import BusinessCanvas from '@/components/BusinessCanvas';
import { Avatar } from '@/components/ui/avatar';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [promocode, setPromocode] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showUserMessage, setShowUserMessage] = useState(false);
  const [showClaudeMessage, setShowClaudeMessage] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const { user, signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const slides = [
    {
      id: 0,
      type: "features-grid",
      question: "Claude, what can I do with this playbook?",
      response: "Here are the key chapters to learn stories of global companies."
    },
    {
      id: 1,
      type: "email",
      question: "Claude, show me how founders communicate in each chapter.",
      response: "Here's an example email you can check and learn important insights."
    },
    {
      id: 2,
      type: "canvas",
      question: "Claude, help me create my global expansion plan.",
      response: "Here's your interactive canvas to map it out."
    }
  ];

  const sampleEmail = {
    "subject": "From Europe to Dubai - Our First International Leap",
    "date": "Oct 15, 2023",
    "greeting": "Hey!",
    "body": "Our international expansion journey started in **2016**, not through complex research but thanks to strong client relationships. We were an agency in 🇷🇺 Russia offering **e-commerce design and automation services**.\n\nThe big shift came when our key client, LG, relocated a manager to 🇦🇪 Dubai. They said, '**Your work outperforms anything here. Let's continue.**' That introduction opened doors to the MENA region.\n\nThroughout **2016-2017**, we operated in 'fly-in, deliver, fly-out' mode—handling **content, design, and website support for LG.com in Dubai**. The UAE market lagged behind Russia's e-commerce scene, so we expanded cautiously.\n\nThis taught us a key lesson: **remote work gets you started, but local presence drives real growth.** Once we built local teams, our business truly scaled.",
    "signature": {
      "name": "Yury Shishkin",
      "title": "CEO",
      "company": "24TTL.net"
    }
  };

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Animation sequence
  useEffect(() => {
    setShowUserMessage(false);
    setShowClaudeMessage(false);
    setShowContent(false);

    const timer1 = setTimeout(() => setShowUserMessage(true), 300);
    const timer2 = setTimeout(() => setShowClaudeMessage(true), 1200);
    const timer3 = setTimeout(() => setShowContent(true), 2100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [currentSlide]);

  // Redirect if authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (isSignUp) {
        result = await signUp(email, password, fullName, promocode);
      } else {
        result = await signIn(email, password);
      }

      if (result.error) {
        toast({
          title: "Error",
          description: result.error.message,
          variant: "destructive",
        });
      } else {
        if (isSignUp) {
          const hasPromocode = promocode.trim() !== '';
          toast({
            title: "Success",
            description: hasPromocode 
              ? "Account created successfully! You have access to all chapters." 
              : "Account created successfully! You have access to the first chapter. Enter a promocode later to unlock all chapters.",
          });
          setIsSignUp(false);
          navigate('/questionnaire');
        } else {
          toast({
            title: "Success", 
            description: "Signed in successfully!",
          });
          navigate('/');
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  function formatLinksAndBoldText(text) {
    if (!text) return text;
    
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`[\]]+|www\.[^\s<>"{}|\\^`[\]]+|(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?:\/[^\s<>"{}|\\^`[\]]*)?)/gi;
    
    formattedText = formattedText.replace(urlRegex, (url) => {
      let href = url;
      if (!url.match(/^https?:\/\//)) {
        href = 'https://' + url;
      }
      
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color: #d97706; text-decoration: underline;">${url}</a>`;
    });
    
    return formattedText;
  }

  const EmailStructured = (email) => {
    if (!email || !email.signature) {
      return <div>Email data not available</div>;
    }

    return (
      <div className="overflow-hidden shadow-sm mb-4 transform transition-all duration-700 ease-out opacity-100 translate-y-0 scale-100 rounded-lg border-2 border-white bg-white shadow-lg">
        <div className="p-4 rounded-lg border-2 border-gray-200">
          <div className="text-sm text-gray-800 space-y-3">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-8 h-8">
                <div className="aspect-square h-full w-full rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                  {email.signature.name.split(' ').map(n => n[0]).join('')}
                </div>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-gray-900 text-sm">{email.subject}</h4>
                </div>
                <div className="text-xs text-gray-600">
                  <span className="ml-2">{email.date}</span>
                </div>
              </div>
            </div>
            
            {email.greeting && (
              <p className="text-gray-800">{email.greeting}</p>
            )}
            
            <div 
              className="text-xs text-gray-800 leading-relaxed whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: formatLinksAndBoldText(email.body) }}
            />
            <div className="text-xs text-gray-700 italic text-right">
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

  const renderCanvas = () => (
    <div className="w-full max-w-md mx-auto h-96 flex items-center justify-center">
      <div className="transform scale-75 origin-center" style={{ width: '500px' }}>
        <BusinessCanvas 
          isEditable={false}
          isMinimal={true}
          canvasId="demo"
          hideButtons={true}
        />
      </div>
    </div>
  );

  const renderFeaturesGrid = () => {
    const features = [
      {
        title: "InDrive",
        description: "Second largest ridesharing app globally with peer-to-peer pricing model, operating in 888 cities across 48 countries"
      },
      {
        title: "Yango",
        description: "International ride-hailing service operating in 600+ cities across 17 countries with food delivery and e-grocery services"
      },
      {
        title: "Borzo",
        description: "Global same-day delivery service operating in 10+ countries with 2M+ users and 2.5M couriers handling 3M orders monthly"
      },
      {
        title: "EBAC",
        description: "Brazilian educational institution offering online courses and postgraduate programs in creative and technological fields"
      },
      {
        title: "Getcourse",
        description: "All-in-one e-learning platform for creating, marketing, and selling online courses with CRM and automation tools."
      },
      {
        title: "Skyeng",
        description: "Largest EdTech company in Eastern Europe specializing in online English teaching with 8,500 teachers and 84,600 students"
      }
    ];

    return (
      <div className="w-full h-96 flex items-center justify-center p-4">
        <div className="grid grid-cols-3 gap-4 max-w-lg">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg p-4 border-2 border-gray-200 shadow-sm hover:shadow-md transition-all duration-500 ease-out transform ${
                showContent ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
              }`}
              style={{
                animationDelay: showContent ? `${index * 100}ms` : '0ms',
                transition: `all 0.5s ease-out ${showContent ? index * 100 : 0}ms`
              }}
            >
              <div className="text-center">
                <img 
                  src={`https://raw.githubusercontent.com/znack2/book_local/main/docs/logos/${feature.title}.svg`} 
                  alt="Chapter image" 
                  className="w-full h-full object-cover" 
                  style={{ margin: '12px 0' }}
                />
                <p className="text-xs text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEmailStructured = () => {
    return (
      <div className="w-full max-w-md mx-auto h-96 flex items-center justify-center">
        <div className="transform scale-75 origin-center">
          {EmailStructured(sampleEmail)}
        </div>
      </div>
    );
  };

  const renderSlideContent = () => {
    const slide = slides[currentSlide];
    switch (slide.type) {
      case 'features-grid':
        return renderFeaturesGrid();
      case 'canvas':
        return renderCanvas();
      case 'email':
        return renderEmailStructured();
      default:
        return <div className="h-96 flex items-center justify-center">Unknown slide type</div>;
    }
  };

  return (
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(135deg, #f5f2e8 0%, #e8dcc0 100%)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* Line pattern background */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="lines" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#8b7d6b" strokeWidth="1"/>
              <path d="M 30 0 L 30 60" fill="none" stroke="#8b7d6b" strokeWidth="0.5"/>
              <path d="M 0 30 L 60 30" fill="none" stroke="#8b7d6b" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lines)" />
        </svg>
      </div>

      <div className="w-full relative z-10">
        {/* Mobile Layout */}
        <div className="block md:hidden">
          <div className="bg-white flex items-center justify-center p-4 min-h-screen">
            <Card className="w-full max-w-sm shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg overflow-hidden">
                    <img src="favicon.svg" className="w-full h-full object-cover" />
                  </div>
                  <h1 className="text-lg font-semibold" style={{ color: '#5a4f3f' }}>First Step GoGlobal Playbook</h1>
                </div>
                <div className="mb-3">
                  <a 
                    href="https://book.greatleads.io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-amber-700 hover:text-amber-800 underline transition-colors"
                  >
                    book.greatleads.io
                  </a>
                </div>
                <CardTitle className="text-xl">
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
                </CardTitle>
                <CardDescription className="text-sm">
                  {isSignUp 
                    ? 'Sign up to access the Email Gallery' 
                    : 'Sign in to your account'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignUp && (
                    <div>
                      <Input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required={isSignUp}
                        className="text-sm"
                      />
                    </div>
                  )}
                  <div>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="text-sm"
                    />
                  </div>
                  {isSignUp && (
                    <div>
                      <Input
                        type="text"
                        placeholder="Promocode (optional - unlock all chapters)"
                        value={promocode}
                        onChange={(e) => setPromocode(e.target.value)}
                        className="text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter your promocode to access all chapters. Without it, you'll have access to the first chapter only.
                      </p>
                    </div>
                  )}
                  <Button 
                    type="submit" 
                    className="w-full text-sm" 
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(135deg, #d4c4a8 0%, #c4b59b 100%)',
                      color: '#5a4f3f'
                    }}
                  >
                    {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                  </Button>
                </form>
                
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-sm text-gray-600 hover:text-gray-800 underline"
                  >
                    {isSignUp 
                      ? 'Already have an account? Sign in' 
                      : "Don't have an account? Sign up"
                    }
                  </button>
                </div>

                {/* Mobile Content Slider */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="w-full">
                    <div className="rounded-lg overflow-hidden mb-4">
                      <div className="border-b pb-3 mb-3">
                        <div className="flex items-start space-x-2">
                          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                            <Users className="w-3 h-3 text-gray-600" />
                          </div>
                          <div className={`bg-gray-200 rounded-2xl rounded-tl-sm px-3 py-2 max-w-xs transition-all duration-700 ease-out ${
                            showUserMessage ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
                          }`}>
                            <p className="text-gray-800 text-xs">{slides[currentSlide].question}</p>
                          </div>
                        </div>
                      </div>

                      <div className="">
                        <div className="flex items-start space-x-2 mb-3">
                          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">C</span>
                          </div>
                          <div className={`bg-gray-100 rounded-2xl rounded-tl-sm px-3 py-2 transition-all duration-700 ease-out ${
                            showClaudeMessage ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
                          }`}>
                            <p className="text-gray-800 text-xs">{slides[currentSlide].response}</p>
                          </div>
                        </div>
                        
                        <div className="relative overflow-hidden">
                          <div 
                            className="flex transition-transform duration-700 ease-in-out"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                          >
                            {slides.map((slide, index) => (
                              <div key={slide.id} className="w-full flex-shrink-0">
                                <div className={`transition-all duration-700 ease-out ${
                                  showContent && index === currentSlide ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'
                                }`}>
                                  <div className="transform scale-50 origin-center">
                                    {renderSlideContent()}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center space-x-2">
                      {slides.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToSlide(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            currentSlide === index ? 'bg-orange-500 scale-125' : 'bg-gray-400 hover:bg-gray-500'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-2 gap-0 h-screen">
          {/* Auth Form - Left Half */}
          <div className="bg-white flex items-center justify-center p-8">
            <Card className="w-full max-w-md h-fit shadow-lg">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg overflow-hidden">
                    <img src="favicon.svg" className="w-full h-full object-cover" />
                  </div>
                  <h1 className="text-xl font-semibold" style={{ color: '#5a4f3f' }}>First Step GoGlobal Playbook</h1>
                </div>
                <div className="mb-4">
                  <a 
                    href="https://book.greatleads.io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-amber-700 hover:text-amber-800 underline transition-colors"
                  >
                    book.greatleads.io
                  </a>
                </div>
                <CardTitle className="text-xl">
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
                </CardTitle>
                <CardDescription>
                  {isSignUp 
                    ? 'Sign up to access the Email Gallery' 
                    : 'Sign in to your account'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignUp && (
                    <div>
                      <Input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required={isSignUp}
                      />
                    </div>
                  )}
                  <div>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  {isSignUp && (
                    <div>
                      <Input
                        type="text"
                        placeholder="Promocode (optional - unlock all chapters)"
                        value={promocode}
                        onChange={(e) => setPromocode(e.target.value)}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter your promocode to access all chapters. Without it, you'll have access to the first chapter only.
                      </p>
                    </div>
                  )}
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(135deg, #d4c4a8 0%, #c4b59b 100%)',
                      color: '#5a4f3f'
                    }}
                  >
                    {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                  </Button>
                </form>
                
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-sm text-gray-600 hover:text-gray-800 underline"
                  >
                    {isSignUp 
                      ? 'Already have an account? Sign in' 
                      : "Don't have an account? Sign up"
                    }
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Slider - Right Half */}
          <div className="flex items-center justify-center p-8">
            <div className="w-full max-w-xl">
              <div className="rounded-lg overflow-hidden mb-6">
                <div className="border-b">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className={`bg-gray-200 rounded-2xl rounded-tl-sm px-4 py-2 max-w-md transition-all duration-700 ease-out ${
                      showUserMessage ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
                    }`}>
                      <p className="text-gray-800 text-sm">{slides[currentSlide].question}</p>
                    </div>
                  </div>
                </div>

                <div className="">
                  <div className="flex items-start space-x-3 m-4">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">C</span>
                    </div>
                    <div className={`bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-2 transition-all duration-700 ease-out ${
                      showClaudeMessage ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
                    }`}>
                      <p className="text-gray-800 text-sm">{slides[currentSlide].response}</p>
                    </div>
                  </div>
                  
                  <div className="relative overflow-hidden">
                    <div 
                      className="flex transition-transform duration-700 ease-in-out"
                      style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                      {slides.map((slide, index) => (
                        <div key={slide.id} className="w-full flex-shrink-0 px-2">
                          <div className={`transition-all duration-700 ease-out ${
                            showContent && index === currentSlide ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'
                          }`}>
                            {renderSlideContent()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-3">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentSlide === index ? 'bg-orange-500 scale-125' : 'bg-gray-400 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;