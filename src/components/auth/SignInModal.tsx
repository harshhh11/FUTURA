import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { sound } from '../../utils/sound';
import { 
  X, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ArrowRight, 
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

export const SignInModal: React.FC = () => {
  const { 
    isSignInOpen, 
    setIsSignInOpen, 
    setIsOnboardingOpen, 
    signInUser, 
    navigateTo 
  } = useApp();

  const [email, setEmail] = useState<string>('aarav.sharma@campus.edu');
  const [password, setPassword] = useState<string>('••••••••');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isSignInOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    setErrorMessage(null);

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 4) {
      setErrorMessage('Password must be at least 4 characters.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      sound.playChime();
      signInUser(email, password);
      setIsSignInOpen(false);
      navigateTo('dashboard');
    }, 400);
  };

  const handleDemoSignIn = () => {
    sound.playChime();
    setIsLoading(true);
    setEmail('aarav.sharma@campus.edu');
    setPassword('futura2026');
    setTimeout(() => {
      setIsLoading(false);
      signInUser('aarav.sharma@campus.edu', 'futura2026');
      setIsSignInOpen(false);
      navigateTo('dashboard');
    }, 300);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signin-modal-title"
    >
      <div 
        className="w-full max-w-md bg-[#0F1116] border border-[#2D313B] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col relative text-[#F4F1EA]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#D5B477]/10 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D5B477]/50 to-transparent" />

        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-[#252830] bg-[#12141A]/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#20242B] to-[#12141A] border border-[#D5B477]/40 flex items-center justify-center shadow-inner">
              <span className="font-display font-bold text-xs text-[#D5B477]">F</span>
            </div>
            <div>
              <h2 id="signin-modal-title" className="font-display font-bold text-base text-[#F4F1EA] leading-tight">
                Sign in to FUTURA
              </h2>
              <p className="text-[11px] text-[#8E929C]">
                Restore your personal financial plan
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setIsSignInOpen(false);
            }}
            className="w-8 h-8 rounded-full bg-[#1C1F26] hover:bg-[#252932] border border-[#30343B] flex items-center justify-center text-[#A2A5AC] hover:text-[#F4F1EA] transition-colors cursor-pointer"
            aria-label="Close sign in dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-[#E27D78]/10 border border-[#E27D78]/30 flex items-start space-x-2 text-xs text-[#E27D78]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-[#CAD2DC] flex items-center justify-between">
              <span>Email Address</span>
              <span className="text-[10px] text-[#8E929C] font-mono">Demo active</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-[#8E929C]">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#14161C] border border-[#2D313B] text-xs text-[#F4F1EA] focus:border-[#D5B477] outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-[#CAD2DC] flex items-center justify-between">
              <span>Password</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-[#8E929C]">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#14161C] border border-[#2D313B] text-xs text-[#F4F1EA] focus:border-[#D5B477] outline-none transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-[#8E929C] hover:text-[#F4F1EA] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* One-Click Demo Fast Sign In */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleDemoSignIn}
              className="w-full py-2.5 px-3 rounded-xl bg-[#171A21] hover:bg-[#1E222B] border border-[#D5B477]/40 text-xs font-semibold text-[#D5B477] flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm group"
            >
              <Sparkles className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span>One-Click Sign In as Aarav (Demo)</span>
            </button>
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-[#D5B477] to-[#E5C68A] text-[#090A0C] hover:shadow-subtle-glow hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-md disabled:opacity-50"
          >
            <span>{isLoading ? 'Verifying...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Security Notice */}
          <div className="flex items-center space-x-2 text-[10px] text-[#8E929C] justify-center pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8BC6A1]" />
            <span>Simulated Auth Prototype · Ready for Supabase OAuth</span>
          </div>

          {/* Switch to Onboarding */}
          <div className="pt-3 border-t border-[#252830] text-center text-xs text-[#8E929C]">
            <span>Don't have a financial plan yet? </span>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setIsSignInOpen(false);
                setIsOnboardingOpen(true);
              }}
              className="text-[#D5B477] hover:underline font-semibold cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
