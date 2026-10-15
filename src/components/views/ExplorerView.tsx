import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INVESTMENT_CATEGORIES } from '../../data/investmentsData';
import { InvestmentCategory } from '../../types/finance';
import { sound } from '../../utils/sound';
import { 
  Compass, 
  Scale, 
  Sparkles, 
  Clock, 
  ShieldAlert, 
  TrendingUp, 
  ArrowRight, 
  Filter,
  CheckCircle2,
  Info
} from 'lucide-react';

export const ExplorerView: React.FC = () => {
  const { 
    setSelectedCategoryForDetail, 
    comparedCategoryIds, 
    toggleCompareCategory, 
    navigateTo 
  } = useApp();

  const [riskFilter, setRiskFilter] = useState<'All' | 'Low' | 'Moderate' | 'High'>('All');
  const [horizonFilter, setHorizonFilter] = useState<'All' | 'Short' | 'Medium' | 'Long'>('All');

  const filteredCategories = INVESTMENT_CATEGORIES.filter((cat) => {
    if (riskFilter !== 'All') {
      if (riskFilter === 'Low' && !(cat.riskLevel === 'Very Low' || cat.riskLevel === 'Low')) return false;
      if (riskFilter === 'Moderate' && cat.riskLevel !== 'Moderate') return false;
      if (riskFilter === 'High' && cat.riskLevel !== 'High') return false;
    }
    if (horizonFilter !== 'All') {
      if (horizonFilter === 'Short' && !cat.planningHorizon.toLowerCase().includes('short') && !cat.planningHorizon.toLowerCase().includes('immediate')) return false;
      if (horizonFilter === 'Medium' && !cat.planningHorizon.toLowerCase().includes('medium')) return false;
      if (horizonFilter === 'Long' && !cat.planningHorizon.toLowerCase().includes('long')) return false;
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#A2A5AC] uppercase tracking-wider mb-1">
            <Compass className="w-3.5 h-3.5 text-[#D5B477]" />
            <span>FINANCIAL INSTRUMENTS</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F4F1EA]">
            Investment Explorer
          </h1>
          <p className="text-xs text-[#A2A5AC] mt-0.5">
            Six foundational categories explained in plain student language without Wall Street jargon.
          </p>
        </div>

        {/* Compare CTA bar */}
        <button
          onClick={() => navigateTo('comparison')}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#20242B] hover:bg-[#2A2F3B] border border-[#A9B8C8]/30 text-[#F4F1EA] transition-all flex items-center space-x-2"
        >
          <Scale className="w-4 h-4 text-[#D5B477]" />
          <span>Compare Selected ({comparedCategoryIds.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* MANDATORY EDUCATIONAL BANNER: SIP is a method, not an asset class */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#20242B] to-[#171A20] border border-[#D5B477]/40 flex items-start space-x-3.5 shadow-card-depth">
        <div className="p-2 rounded-xl bg-[#D5B477]/15 border border-[#D5B477]/40 text-[#D5B477] shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xs font-bold text-[#F4F1EA] flex items-center space-x-2">
            <span>Essential Rule for Beginners: A SIP is a Method, Not an Asset</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#D5B477] text-[#090A0C]">
              CORE CONCEPT
            </span>
          </h3>
          <p className="text-xs text-[#A2A5AC] leading-relaxed">
            Many first-timers ask: <em>"Should I invest in FDs, Index Funds, or a SIP?"</em> Remember: a <strong>Systematic Investment Plan (SIP)</strong> is merely an automatic monthly payment schedule. The actual thing you buy with that money is an asset class below (such as an Index Fund or Gold ETF).
          </p>
        </div>
      </div>

      {/* FILTERS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#171A20] border border-[#30343B]">
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-[#A2A5AC]" />
          <span className="text-xs font-mono text-[#A2A5AC]">Risk:</span>
          {(['All', 'Low', 'Moderate', 'High'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                sound.playClick();
                setRiskFilter(lvl);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                riskFilter === lvl
                  ? 'bg-[#20242B] text-[#F4F1EA] border border-[#A9B8C8]/40 shadow-sm'
                  : 'text-[#A2A5AC] hover:text-[#F4F1EA]'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <Clock className="w-3.5 h-3.5 text-[#A2A5AC]" />
          <span className="text-xs font-mono text-[#A2A5AC]">Horizon:</span>
          {(['All', 'Short', 'Medium', 'Long'] as const).map((h) => (
            <button
              key={h}
              onClick={() => {
                sound.playClick();
                setHorizonFilter(h);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                horizonFilter === h
                  ? 'bg-[#20242B] text-[#F4F1EA] border border-[#A9B8C8]/40 shadow-sm'
                  : 'text-[#A2A5AC] hover:text-[#F4F1EA]'
              }`}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      {/* SIX PLAIN-LANGUAGE CARDS GRID (Mandated by Section 10) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCategories.map((category) => {
          const isSelected = comparedCategoryIds.includes(category.id);

          return (
            <div
              key={category.id}
              className="p-5 rounded-3xl bg-gradient-to-b from-[#171A20] to-[#101216] border border-[#30343B] hover:border-[#D5B477]/40 transition-all flex flex-col justify-between shadow-card-depth group relative overflow-hidden"
            >
              <div className="space-y-3">
                {/* Header badge & compare checkbox */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    category.riskLevel === 'Very Low' || category.riskLevel === 'Low'
                      ? 'bg-[#8BC6A1]/10 text-[#8BC6A1] border-[#8BC6A1]/30'
                      : category.riskLevel === 'Moderate'
                      ? 'bg-[#D5B477]/10 text-[#D5B477] border-[#D5B477]/30'
                      : 'bg-[#E27D78]/10 text-[#E27D78] border-[#E27D78]/30'
                  }`}>
                    {category.riskLevel} Risk
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCompareCategory(category.id);
                    }}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-lg border transition-colors flex items-center space-x-1 ${
                      isSelected
                        ? 'bg-[#D5B477]/20 border-[#D5B477] text-[#D5B477]'
                        : 'border-[#30343B] text-[#A2A5AC] hover:text-[#F4F1EA]'
                    }`}
                  >
                    <span>{isSelected ? '✓ In Compare' : '+ Compare'}</span>
                  </button>
                </div>

                {/* Title & Tagline */}
                <div>
                  <h3 className="font-display text-lg font-bold text-[#F4F1EA] group-hover:text-[#D5B477] transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-[11px] text-[#A2A5AC] mt-0.5 line-clamp-2">
                    {category.tagline}
                  </p>
                </div>

                {/* What it is */}
                <p className="text-xs text-[#A2A5AC] leading-relaxed line-clamp-3">
                  {category.description}
                </p>

                {/* Return & Risk Snapshot */}
                <div className="pt-2 border-t border-[#30343B]/60 space-y-2 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#A2A5AC]">Illustrative Rate:</span>
                    <span className="font-mono font-bold text-[#8BC6A1]">
                      ~{(category.illustrativeReturnRate * 100).toFixed(1)}% p.a.
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#A2A5AC]">Access to Money:</span>
                    <span className="font-mono text-[#F4F1EA] truncate max-w-[130px]">
                      {category.liquidity.split(' ')[0]}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#A2A5AC]">Horizon:</span>
                    <span className="font-mono text-[#A9B8C8] truncate max-w-[140px]">
                      {category.planningHorizon.split('(')[0]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 mt-4 border-t border-[#30343B]/60 flex items-center justify-between">
                <button
                  onClick={() => setSelectedCategoryForDetail(category)}
                  className="text-xs font-semibold text-[#D5B477] hover:text-[#E5C68A] flex items-center space-x-1 transition-colors"
                >
                  <span>Learn Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <span className="text-[10px] text-[#A2A5AC]/60 font-mono">
                  Illustrative
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
