import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INVESTMENT_CATEGORIES } from '../../data/investmentsData';
import { InvestmentCategory, InvestmentCategoryId } from '../../types/finance';
import { calculateAdvancedProjection, formatINR } from '../../utils/calculations';
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
  Info,
  BarChart3,
  Layers,
  HelpCircle,
  AlertTriangle,
  Zap,
  BookOpen,
  DollarSign
} from 'lucide-react';

import { Futura3DMap } from '../map/Futura3DMap';

export const ExplorerView: React.FC = () => {
  const { 
    setSelectedCategoryForDetail, 
    comparedCategoryIds, 
    toggleCompareCategory, 
    navigateTo,
    userProfile 
  } = useApp();

  const [desktopViewMode, setDesktopViewMode] = useState<'3d_map' | 'categories'>('3d_map');
  const [activeSection, setActiveSection] = useState<'cards' | 'risk_return' | 'wealth_growth' | 'learning'>('cards');
  const [riskFilter, setRiskFilter] = useState<'All' | 'Low' | 'Moderate' | 'High'>('All');
  const [horizonFilter, setHorizonFilter] = useState<'All' | 'Short' | 'Medium' | 'Long'>('All');

  // Interactive growth simulator controls
  const [simMonthly, setSimMonthly] = useState<number>(userProfile.comfortableMonthlyContribution || 1000);
  const [simYears, setSimYears] = useState<number>(5);
  const [simInflation, setSimInflation] = useState<number>(0.06);

  const filteredCategories = INVESTMENT_CATEGORIES.filter((cat) => {
    if (riskFilter !== 'All') {
      if (riskFilter === 'Low' && !(cat.riskLevel === 'Very Low' || cat.riskLevel === 'Low')) return false;
      if (riskFilter === 'Moderate' && cat.riskLevel !== 'Moderate') return false;
      if (riskFilter === 'High' && !(cat.riskLevel === 'High' || cat.riskLevel === 'Very High')) return false;
    }
    if (horizonFilter !== 'All') {
      if (horizonFilter === 'Short' && !cat.planningHorizon.toLowerCase().includes('short') && !cat.planningHorizon.toLowerCase().includes('immediate')) return false;
      if (horizonFilter === 'Medium' && !cat.planningHorizon.toLowerCase().includes('medium')) return false;
      if (horizonFilter === 'Long' && !cat.planningHorizon.toLowerCase().includes('long')) return false;
    }
    return true;
  });

  const renderCategoriesContent = () => (
    <div className="max-w-5xl mx-auto space-y-7 sm:space-y-8 animate-fadeIn pb-14 w-full">
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
          onClick={() => {
            sound.playClick();
            navigateTo('comparison');
          }}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#20242B] hover:bg-[#2A2F3B] border border-[#A9B8C8]/30 text-[#F4F1EA] transition-all flex items-center space-x-2"
        >
          <Scale className="w-4 h-4 text-[#D5B477]" />
          <span>Compare Selected ({comparedCategoryIds.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* MANDATORY EDUCATIONAL BANNER: SIP is a method, not an asset class */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#20242B] to-[#171A20] border border-[#D5B477]/40 flex items-start space-x-3.5 shadow-card-depth">
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

      {/* VIEW SECTION NAVIGATION */}
      <div className="flex items-center space-x-2 border-b border-[#30343B]/60 pb-1 overflow-x-auto scrollbar-none">
        {[
          { id: 'cards', label: 'Investment Instruments', icon: Layers },
          { id: 'risk_return', label: 'Risk vs Return Spectrum', icon: TrendingUp },
          { id: 'wealth_growth', label: 'Simulated Wealth & Inflation', icon: BarChart3 },
          { id: 'learning', label: 'First-Time Investor Rules', icon: BookOpen },
        ].map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => {
                sound.playClick();
                setActiveSection(sec.id as any);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-2 ${
                isActive
                  ? 'bg-[#20242B] text-[#D5B477] border border-[#D5B477]/30 shadow-sm'
                  : 'text-[#A2A5AC] hover:text-[#F4F1EA] hover:bg-[#171A20]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D5B477]' : 'text-[#A2A5AC]'}`} />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: INVESTMENT CARDS GRID */}
      {activeSection === 'cards' && (
        <div className="space-y-6">
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

          {/* CARDS GRID */}
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
                      <div className="flex items-center space-x-1.5">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                          category.riskLevel === 'Very Low' || category.riskLevel === 'Low'
                            ? 'bg-[#8BC6A1]/10 text-[#8BC6A1] border-[#8BC6A1]/30'
                            : category.riskLevel === 'Moderate'
                            ? 'bg-[#D5B477]/10 text-[#D5B477] border-[#D5B477]/30'
                            : 'bg-[#E27D78]/10 text-[#E27D78] border-[#E27D78]/30'
                        }`}>
                          {category.riskLevel} Risk
                        </span>

                        {category.mainRiskTag && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#20242B] text-[#A2A5AC] border border-[#30343B]">
                            {category.mainRiskTag}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCompareCategory(category.id);
                        }}
                        className={`text-[10px] font-mono px-2.5 py-0.5 rounded-lg border transition-colors flex items-center space-x-1 ${
                          isSelected
                            ? 'bg-[#D5B477]/20 border-[#D5B477] text-[#D5B477]'
                            : 'border-[#30343B] text-[#A2A5AC] hover:text-[#F4F1EA] hover:bg-[#20242B]'
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
                          {category.returnRange || `~${(category.illustrativeReturnRate * 100).toFixed(1)}% p.a.`}
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

                      {category.costsAndFees && category.costsAndFees[0] && (
                        <div className="flex items-center justify-between">
                          <span className="text-[#A2A5AC]">Typical Cost:</span>
                          <span className="font-mono text-[10px] text-[#D5B477] truncate max-w-[150px]">
                            {category.costsAndFees[0].typicalAmount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="pt-4 mt-4 border-t border-[#30343B]/60 flex items-center justify-between">
                    <button
                      onClick={() => {
                        sound.playClick();
                        setSelectedCategoryForDetail(category);
                      }}
                      className="text-xs font-semibold text-[#D5B477] hover:text-[#E5C68A] flex items-center space-x-1.5 transition-colors"
                    >
                      <span>Explore Returns & Risks</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <span className="text-[10px] text-[#A2A5AC]/60 font-mono">
                      {category.isMarketLinked ? 'Market-Linked' : 'Contractual'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: RISK VS RETURN SPECTRUM */}
      {activeSection === 'risk_return' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#171A20] border border-[#30343B] space-y-2">
            <h3 className="font-display text-base font-bold text-[#F4F1EA] flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-[#D5B477]" />
              <span>Risk vs. Potential Return Spectrum</span>
            </h3>
            <p className="text-xs text-[#A2A5AC] leading-relaxed">
              In finance, risk and return are inextricably connected. Higher potential returns exist only to compensate investors for absorbing the risk of volatility, market crashes, or illiquidity. <strong>Crucial rule: Higher risk does NOT automatically guarantee higher returns.</strong>
            </p>
          </div>

          {/* Visual Spectrum Bars */}
          <div className="space-y-3">
            {INVESTMENT_CATEGORIES.map((cat) => (
              <div 
                key={cat.id}
                onClick={() => setSelectedCategoryForDetail(cat)}
                className="p-4 rounded-2xl bg-[#101216] border border-[#30343B] hover:border-[#D5B477]/40 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1 sm:max-w-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-[#F4F1EA] group-hover:text-[#D5B477] transition-colors">
                      {cat.name}
                    </span>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                      cat.riskLevel === 'Very Low' || cat.riskLevel === 'Low'
                        ? 'bg-[#8BC6A1]/10 text-[#8BC6A1] border-[#8BC6A1]/30'
                        : cat.riskLevel === 'Moderate'
                        ? 'bg-[#D5B477]/10 text-[#D5B477] border-[#D5B477]/30'
                        : 'bg-[#E27D78]/10 text-[#E27D78] border-[#E27D78]/30'
                    }`}>
                      {cat.riskLevel}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A2A5AC] line-clamp-1">{cat.tagline}</p>
                </div>

                {/* Return Bar Visual */}
                <div className="flex-1 sm:max-w-md space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-[#A2A5AC]">
                    <span>Return Range</span>
                    <span className="font-bold text-[#8BC6A1]">{cat.returnRange || `~${(cat.illustrativeReturnRate * 100).toFixed(1)}% p.a.`}</span>
                  </div>
                  <div className="w-full bg-[#20242B] rounded-full h-2.5 overflow-hidden flex">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        cat.riskLevel === 'Very Low' ? 'bg-[#8BC6A1] w-[25%]' :
                        cat.riskLevel === 'Low' ? 'bg-[#6F8FAF] w-[45%]' :
                        cat.riskLevel === 'Moderate' ? 'bg-[#D5B477] w-[70%]' :
                        'bg-[#E27D78] w-[95%]'
                      }`}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-[#A2A5AC]/60 font-mono">
                    <span>Key Trade-off: {cat.mainRiskTag || 'Market Risk'}</span>
                    <span>Horizon: {cat.planningHorizon.split('(')[0]}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCompareCategory(cat.id);
                    }}
                    className={`text-[10px] font-mono px-2.5 py-1 rounded-lg border transition-colors ${
                      comparedCategoryIds.includes(cat.id)
                        ? 'bg-[#D5B477]/20 border-[#D5B477] text-[#D5B477]'
                        : 'border-[#30343B] text-[#A2A5AC] hover:text-[#F4F1EA]'
                    }`}
                  >
                    {comparedCategoryIds.includes(cat.id) ? '✓ Compared' : '+ Compare'}
                  </button>
                  <ArrowRight className="w-4 h-4 text-[#A2A5AC] group-hover:text-[#D5B477] transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: WEALTH GROWTH SIMULATOR & INFLATION */}
      {activeSection === 'wealth_growth' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Controls */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#171A20] border border-[#30343B] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#30343B]/60 pb-3">
              <div>
                <h3 className="font-display text-sm font-bold text-[#F4F1EA]">
                  Multi-Instrument Wealth Growth Engine
                </h3>
                <p className="text-xs text-[#A2A5AC]">
                  See how ₹{simMonthly}/month compounds across categories, and how inflation affects real purchasing power.
                </p>
              </div>

              <div className="flex items-center space-x-1.5 self-start sm:self-auto">
                {[1, 3, 5, 10, 15].map((y) => (
                  <button
                    key={y}
                    onClick={() => {
                      sound.playClick();
                      setSimYears(y);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                      simYears === y
                        ? 'bg-[#D5B477] text-[#090A0C]'
                        : 'bg-[#101216] text-[#A2A5AC] hover:text-[#F4F1EA] border border-[#30343B]'
                    }`}
                  >
                    {y}y
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#A2A5AC]">Monthly Contribution</span>
                  <span className="text-[#D5B477] font-bold">{formatINR(simMonthly)}/mo</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="250"
                  value={simMonthly}
                  onChange={(e) => setSimMonthly(Number(e.target.value))}
                  className="w-full accent-[#D5B477] bg-[#20242B] rounded-lg h-2 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#A2A5AC]">Inflation Benchmark</span>
                  <span className="text-[#E27D78] font-bold">{(simInflation * 100).toFixed(1)}% p.a.</span>
                </div>
                <input
                  type="range"
                  min="0.04"
                  max="0.08"
                  step="0.005"
                  value={simInflation}
                  onChange={(e) => setSimInflation(Number(e.target.value))}
                  className="w-full accent-[#E27D78] bg-[#20242B] rounded-lg h-2 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Comparative Simulation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INVESTMENT_CATEGORIES.map((cat) => {
              const res = calculateAdvancedProjection({
                initialLumpSum: 0,
                monthlyContribution: simMonthly,
                annualRate: cat.illustrativeReturnRate,
                years: simYears,
                annualInflation: simInflation,
              });

              const beatsInflation = res.realPurchasingPower > res.totalContributed;

              return (
                <div 
                  key={cat.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#101216] border border-[#30343B] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-[#F4F1EA]">{cat.name}</h4>
                      <p className="text-[10px] text-[#A2A5AC]">{cat.returnRange || `~${(cat.illustrativeReturnRate * 100).toFixed(1)}% p.a.`}</p>
                    </div>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      beatsInflation 
                        ? 'bg-[#8BC6A1]/10 text-[#8BC6A1] border-[#8BC6A1]/30' 
                        : 'bg-[#E27D78]/10 text-[#E27D78] border-[#E27D78]/30'
                    }`}>
                      {beatsInflation ? '✓ Beats Inflation' : '✕ Inflation Drag'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#171A20] text-center font-mono">
                    <div>
                      <p className="text-[9px] text-[#A2A5AC] uppercase">Invested</p>
                      <p className="text-xs font-bold text-[#F4F1EA] mt-0.5">{formatINR(res.totalContributed)}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-[#8BC6A1] uppercase">Nominal FV</p>
                      <p className="text-xs font-bold text-[#8BC6A1] mt-0.5">{formatINR(res.nominalValue)}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-[#D5B477] uppercase">Real Value</p>
                      <p className="text-xs font-bold text-[#D5B477] mt-0.5">{formatINR(res.realPurchasingPower)}</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#A2A5AC] leading-relaxed">
                    {beatsInflation
                      ? `In ${simYears} years, ₹${simMonthly}/mo grows your actual purchasing power by +${formatINR(res.realPurchasingPower - res.totalContributed)} in today's money.`
                      : `In ${simYears} years, despite earning nominal interest, your real purchasing power shrinks by -${formatINR(res.totalContributed - res.realPurchasingPower)} due to inflation.`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 4: FIRST-TIME INVESTOR RULES */}
      {activeSection === 'learning' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#171A20] border border-[#30343B] space-y-2">
            <h3 className="font-display text-base font-bold text-[#F4F1EA] flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-[#D5B477]" />
              <span>Foundational Rules for First-Time Investors</span>
            </h3>
            <p className="text-xs text-[#A2A5AC] leading-relaxed">
              Curated from SEBI Investor Education & AMFI guidelines for college students and young professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: '1. SIP is a Method, Not an Asset Class',
                summary: 'A Systematic Investment Plan is simply an automated monthly debit. The underlying asset (index fund, gold ETF, debt fund) determines your return and risk, not the SIP schedule itself.',
              },
              {
                title: '2. Nominal Return vs. Real Inflation-Adjusted Return',
                summary: 'If an FD earns 6.8% and inflation is 6.0%, your real wealth growth is only ~0.8% per year. After income tax deductions, you may actually lose real purchasing power.',
              },
              {
                title: '3. Volatility is the Price of Long-Term Wealth',
                summary: 'Index funds drop 15% to 30% in bad years. If you need money within 2 years, never invest in stocks. If you have 7+ years, market drops represent buying opportunities.',
              },
              {
                title: '4. Expense Ratios Silently Compound Against You',
                summary: 'A 1.5% active fund fee might look small, but over 20 years it can eat up to 25% of your final wealth. Low-cost index funds keep more money in your pocket.',
              },
              {
                title: '5. Diversification vs. Concentration',
                summary: 'Buying 5 different mid-cap tech stocks is not diversification; they all crash together in a tech downturn. True diversification combines stocks, bonds, and gold.',
              },
              {
                title: '6. Never Invest Emergency Funds in Equities',
                summary: 'Keep 3 to 6 months of living expenses in an instant savings account or liquid fund. Emergency cash ensures you never have to sell stocks at a loss during a market crash.',
              },
            ].map((rule, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#101216] border border-[#30343B] space-y-2">
                <h4 className="font-bold text-xs text-[#D5B477]">{rule.title}</h4>
                <p className="text-xs text-[#A2A5AC] leading-relaxed">{rule.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );

  return (
    <div className="w-full h-full relative">
      {/* 1. DESKTOP 3D SATELLITE MAP (Matching Reference Screenshot) */}
      <div className={`hidden md:block w-full h-[calc(100vh-64px)] relative ${desktopViewMode === '3d_map' ? 'block' : '!hidden'}`}>
        <Futura3DMap className="w-full h-full" />

        {/* View Switcher Pill at top-left to switch to Asset Classes view if desired */}
        <div className="absolute top-4 sm:top-5 left-4 sm:left-6 z-30">
          <div className="p-1 rounded-2xl bg-[#0E1015]/85 border border-white/10 backdrop-blur-xl shadow-lg flex items-center space-x-1">
            <button
              onClick={() => {
                sound.playClick();
                setDesktopViewMode('3d_map');
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#E6C17D] text-[#08090B] shadow-md cursor-pointer transition-all"
            >
              3D Map Explorer
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setDesktopViewMode('categories');
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-[#A6AFBD] hover:text-white hover:bg-white/5 cursor-pointer transition-all"
            >
              Asset Classes
            </button>
          </div>
        </div>
      </div>

      {/* 2. ASSET CLASSES VIEW ON DESKTOP (When switched by user) */}
      {desktopViewMode === 'categories' && (
        <div className="hidden md:block px-4 py-6">
          <div className="max-w-5xl mx-auto mb-4 flex items-center justify-between">
            <button
              onClick={() => {
                sound.playClick();
                setDesktopViewMode('3d_map');
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#1C1F26] border border-white/10 hover:border-[#E6C17D]/50 text-[#F5F3EF] flex items-center space-x-1.5 cursor-pointer"
            >
              <span>← Back to 3D Location Map</span>
            </button>
            <span className="text-xs font-mono text-[#D5B477]">
              Financial Instruments Reference
            </span>
          </div>
          {renderCategoriesContent()}
        </div>
      )}

      {/* 3. MOBILE VIEW: MUST REMAIN COMPLETELY UNCHANGED */}
      <div className="block md:hidden px-4 py-3">
        {renderCategoriesContent()}
      </div>
    </div>
  );
};
