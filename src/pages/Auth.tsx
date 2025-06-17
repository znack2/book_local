import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [promocode, setPromocode] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (isSignUp) {
        if (!promocode.trim()) {
          toast({
            title: "Promocode Required",
            description: "Please enter a promocode to access all chapters.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
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
          toast({
            title: "Success",
            description: "Account created successfully! You can now sign in.",
          });
          setIsSignUp(false);
        } else {
          toast({
            title: "Success", 
            description: "Signed in successfully!",
          });
          navigate('/');
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ 
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

      <Card className="w-full max-w-md relative z-10">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg overflow-hidden border-2" style={{ borderColor: 'rgba(139, 125, 107, 0.2)' }}>
              <img src="logo/studio-icon.png" className="w-full h-full object-cover" />
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
                  placeholder="Promocode (required to unlock all chapters)"
                  value={promocode}
                  onChange={(e) => setPromocode(e.target.value)}
                  required={isSignUp}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter your promocode to access all chapters. Without it, only the first chapter will be available.
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
  );
};

export default Auth;
