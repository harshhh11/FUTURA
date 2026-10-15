import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, setIsOnboardingOpen } = useApp();

  return (
    <footer className="w-full bg-[#08090B] border-t border-[#30343C]/60 text-[#A6AFBD] py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand & Mission */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-[#20232A] border border-[#E6C17D]/40 flex items-center justify-center font-display font-bold text-xs text-[#E6C17D]">
              F
            </div>
            <span className="font-display font-extrabold tracking-widest text-base text-[#F5F3EF]">
              FUTURA
            </span>
          </div>
          <p className="text-xs text-[#A6AFBD] leading-relaxed max-w-md">
            Product Promise: <span className="text-[#F5F3EF]">Understand your money. Prepare for uncertainty. Plan your future with confidence.</span>
          </p>
          <p className="text-[11px] text-[#A6AFBD]/80 leading-relaxed max-w-md">
            Designed for 19-year-old student Aarav and first-time investors learning to navigate real-world money, compounding, and unavoidable market cycles without fear.
          </p>
        </div>

        {/* Navigation Quick Links */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#F5F3EF]">
            Navigation
          </h4>
          <ul className="space-y-1.5 text-xs">
            <li>
              <button onClick={() => navigateTo('dashboard')} className="hover:text-[#E6C17D] transition-colors cursor-pointer">
                Overview Dashboard
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('moneyflow')} className="hover:text-[#E6C17D] transition-colors cursor-pointer">
                Smart MoneyFlow
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('simulator')} className="hover:text-[#E6C17D] transition-colors cursor-pointer">
                Goal Simulator
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('explorer')} className="hover:text-[#E6C17D] transition-colors cursor-pointer">
                Investment Explorer
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('bad_year')} className="hover:text-[#E27D78] transition-colors cursor-pointer">
                Bad-Year Rehearsal
              </button>
            </li>
          </ul>
        </div>

        {/* Actions & Prototype Info */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#F5F3EF]">
            Prototype & QA
          </h4>
          <ul className="space-y-1.5 text-xs">
            <li>
              <button onClick={() => setIsOnboardingOpen(true)} className="hover:text-[#E6C17D] transition-colors flex items-center space-x-1 cursor-pointer">
                <Sparkles className="w-3 h-3 text-[#E6C17D]" />
                <span>Rerun Onboarding</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('learning')} className="hover:text-[#80C9A0] transition-colors flex items-center space-x-1 cursor-pointer">
                <HelpCircle className="w-3 h-3 text-[#80C9A0]" />
                <span>Financial Learning Hub</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('settings')} className="hover:text-[#A9B8C8] transition-colors cursor-pointer">
                Settings & Accessibility
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Mandatory Regulatory / Educational Disclaimer */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-[#30343C]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[10px] text-[#A6AFBD]/70">
        <div className="flex items-start space-x-2">
          <ShieldCheck className="w-4 h-4 text-[#E6C17D] flex-shrink-0 mt-0.5" />
          <p className="max-w-3xl leading-relaxed">
            <strong className="text-[#F5F3EF]">Educational Prototype Notice:</strong> FUTURA is a financial education and planning prototype, not a registered investment advisor, broker, or financial depository. All projections, calculations, portfolio allocations, and simulated declines are strictly illustrative mathematical models based on user inputs. Past market performance or hypothetical rates do not guarantee future returns.
          </p>
        </div>
        <p className="font-mono text-[9px] text-[#A6AFBD]/50 flex-shrink-0">
          UI/UX COMPETITION BUILD · 2026
        </p>
      </div>
    </footer>
  );
};
