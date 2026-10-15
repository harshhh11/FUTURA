import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INVESTMENT_CATEGORIES } from '../../data/investmentsData';
import { InvestmentCategoryId } from '../../types/finance';
import { calculateAdvancedProjection, formatINR } from '../../utils/calculations';
import { sound } from '../../utils/sound';
import { 
  PieChart, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Sparkles, 
  Info,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Layers,
  Sliders,
  DollarSign,
  BarChart3,
  Percent,
  Check
} from 'lucide-react';

const CATEGORY_COLORS: Record<InvestmentCategoryId, string> = {
  index_funds: '#D5B477', // Champagne Gold
  fd: '#8BC6A1',          // Muted Sage Green
  gold: '#E5C68A',        // Warm Amber Gold
  savings: '#A9B8C8',     // Cool Silver
  bonds: '#6F8FAF',       // Steel Blue
  mutual_funds: '#E27D78', // Muted Coral
  equities: '#C490D1',    // Lavender Orchid
};

const ALLOCATION_PRESETS: Array<{
  name: string;
  tagline: string;
  allocations: Record<InvestmentCategoryId, number>;
}> = [
  {
    name: 'Balanced Student Wealth (Recommended)',
    tagline: '50% Nifty 50 Index + 30% 1-Yr FD + 20% Gold ETF buffer',
    allocations: {
      index_funds: 50,
      fd: 30,
      gold: 20,
      savings: 0,
      bonds: 0,
      mutual_funds: 0,
      equities: 0,
    }
  },
  {
    name: 'Capital Preservation (Low Volatility)',
    tagline: '50% Bank FD + 30% G-Sec Bonds + 20% Emergency Savings',
    allocations: {
      index_funds: 0,
      fd: 50,
      gold: 0,
      savings: 20,
      bonds: 30,
      mutual_funds: 0,
      equities: 0,
    }
  },
  {
    name: 'Long-Term Aggressive Growth',
    tagline: '70% Index Funds + 15% Active/Direct Equities + 15% Gold ETF',
    allocations: {
      index_funds: 70,
      fd: 0,
      gold: 15,
      savings: 0,
      bonds: 0,
      mutual_funds: 15,
      equities: 0,
    }
  }
];

export const PortfolioBuilderView: React.FC = () => {
  const { 
    allocations, 
    updateAllocation, 
    resetAllocations, 
    autoBalanceAllocations, 
    userProfile, 
    addActivity,
    navigateTo
  } = useApp();

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [horizonYears, setHorizonYears] = useState<number>(5);
  const [selectedScenario, setSelectedScenario] = useState<'adverse' | 'moderate' | 'favourable'>('moderate');

  const monthlyBudget = userProfile.comfortableMonthlyContribution;

  // Total percentage check
  const totalPercentage = allocations.reduce((sum, item) => sum + item.percentage, 0);
  const isValid100 = totalPercentage === 100;

  // Calculate weighted return rate based on current scenario
  const weightedReturnRate = allocations.reduce((sum, item) => {
    const cat = INVESTMENT_CATEGORIES.find(c => c.id === item.categoryId);
    if (!cat) return sum;

    let rate = cat.illustrativeReturnRate;
    if (cat.scenarios) {
      if (selectedScenario === 'adverse') rate = cat.scenarios.conservative.rate;
      if (selectedScenario === 'moderate') rate = cat.scenarios.middle.rate;
      if (selectedScenario === 'favourable') rate = cat.scenarios.strong.rate;
    }
    return sum + (rate * (item.percentage / 100));
  }, 0);

  // Asset class breakdown
  const equityShare = (allocations.find(a => a.categoryId === 'index_funds')?.percentage || 0) +
                      (allocations.find(a => a.categoryId === 'mutual_funds')?.percentage || 0) +
                      (allocations.find(a => a.categoryId === 'equities')?.percentage || 0);

  const debtFixedShare = (allocations.find(a => a.categoryId === 'fd')?.percentage || 0) +
                         (allocations.find(a => a.categoryId === 'bonds')?.percentage || 0) +
                         (allocations.find(a => a.categoryId === 'savings')?.percentage || 0);

  const goldShare = allocations.find(a => a.categoryId === 'gold')?.percentage || 0;

  // True Diversification Assessment
  let diversificationTitle = 'Well-Diversified Multi-Asset Mix';
  let diversificationNote = 'Your portfolio balances growth equities with contractual fixed debt and crisis gold.';
  let isTrueDiversified = true;

  if (equityShare >= 80) {
    diversificationTitle = 'High Equity Concentration (Volatile)';
    diversificationNote = 'Over 80% is in market-linked equities. Holding multiple equity funds does not provide true diversification because they all decline together during stock market crashes.';
    isTrueDiversified = false;
  } else if (debtFixedShare >= 80) {
    diversificationTitle = 'Heavy Fixed-Income Concentration (Inflation Risk)';
    diversificationNote = 'Over 80% is in fixed deposits and cash. Capital is safe from market crashes, but vulnerable to purchasing power erosion from inflation.';
    isTrueDiversified = false;
  } else if (goldShare >= 40) {
    diversificationTitle = 'Heavy Gold Concentration';
    diversificationNote = 'High gold allocation buffers against currency crisis, but generates zero ongoing corporate dividends or interest coupons.';
    isTrueDiversified = false;
  }

  // Calculate portfolio forward projection
  const portfolioProjection = calculateAdvancedProjection({
    initialLumpSum: userProfile.currentSavings,
    monthlyContribution: monthlyBudget,
    annualRate: weightedReturnRate,
    years: horizonYears,
    annualInflation: 0.06,
  });

  // SVG Donut calculation
  const radius = 68;
  const strokeWidth = 22;
  const circumference = 2 * Math.PI * radius;
  let accumulatedAngle = 0;

  const donutSlices = allocations
    .filter(a => a.percentage > 0)
    .map(a => {
      const sliceFraction = a.percentage / 100;
      const strokeDashoffset = circumference * (1 - sliceFraction);
      const rotationAngle = (accumulatedAngle / 100) * 360;
      accumulatedAngle += a.percentage;

      return {
        ...a,
        strokeDashoffset,
        rotationAngle,
        color: CATEGORY_COLORS[a.categoryId] || '#A9B8C8',
      };
    });

  const handleApplyPreset = (preset: typeof ALLOCATION_PRESETS[0]) => {
    sound.playClick();
    Object.entries(preset.allocations).forEach(([catId, pct]) => {
      updateAllocation(catId as InvestmentCategoryId, pct);
    });
  };

  const handleSaveScenario = () => {
    if (!isValid100) return;
    sound.playChime();
    setSavedSuccess(true);
    addActivity({
      title: 'Custom Portfolio Allocation Saved',
      type: 'scenario',
      amount: monthlyBudget,
      details: `Saved ${diversificationTitle}: ${allocations.filter(a => a.percentage > 0).map(a => `${a.percentage}% ${a.categoryId}`).join(', ')}.`,
      badge: 'Portfolio Ready',
    });
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn pb-14 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#A2A5AC] uppercase tracking-wider mb-1">
            <PieChart className="w-3.5 h-3.5 text-[#D5B477]" />
            <span>HYPOTHETICAL ASSET MIX</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F4F1EA] tracking-tight">
            Portfolio Builder & Scenario Engine
          </h1>
          <p className="text-xs text-[#A2A5AC] mt-0.5">
            Divide your {formatINR(monthlyBudget)} monthly contribution across categories. Must total exactly 100%.
          </p>
        </div>

        {/* Rebalance & Reset Controls */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={() => {
              sound.playClick();
              autoBalanceAllocations();
            }}
            className="px-3 py-2 rounded-xl text-xs font-medium bg-[#171A20] hover:bg-[#20242B] border border-[#30343B] text-[#D5B477] transition-colors flex items-center space-x-1.5"
            title="Automatically distribute to 100%"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-Balance</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              resetAllocations();
            }}
            className="px-3 py-2 rounded-xl text-xs font-medium bg-[#171A20] hover:bg-[#20242B] border border-[#30343B] text-[#A2A5AC] hover:text-[#F4F1EA] transition-colors flex items-center space-x-1.5"
            title="Reset to default starter mix"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Mix</span>
          </button>
        </div>
      </div>

      {/* VALIDATION ALERT BAR */}
      {!isValid100 && (
        <div className="p-4 rounded-2xl bg-[#E27D78]/15 border border-[#E27D78] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#E27D78]">
          <div className="flex items-center space-x-2.5">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold">Total Allocation is {totalPercentage}% (Must equal 100%)</p>
              <p className="text-[11px] text-[#A2A5AC]">
                {totalPercentage < 100 
                  ? `You have ${100 - totalPercentage}% remaining unallocated.` 
                  : `You have over-allocated by ${totalPercentage - 100}%.`}
              </p>
            </div>
          </div>
          <button
            onClick={autoBalanceAllocations}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg bg-[#E27D78] text-[#090A0C] font-bold text-xs hover:bg-[#E27D78]/90 transition-colors"
          >
            Auto-Fix to 100%
          </button>
        </div>
      )}

      {/* PRESET STRATEGY CARDS */}
      <div className="space-y-2.5">
        <span className="text-[11px] font-mono uppercase text-[#A2A5AC] flex items-center space-x-1.5">
          <Layers className="w-3.5 h-3.5 text-[#D5B477]" />
          <span>Quick Strategy Presets</span>
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ALLOCATION_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(preset)}
              className="p-3.5 rounded-2xl bg-[#171A20] border border-[#30343B] hover:border-[#D5B477]/40 text-left transition-all group space-y-1"
            >
              <span className="font-bold text-xs text-[#F4F1EA] group-hover:text-[#D5B477] transition-colors">
                {preset.name}
              </span>
              <p className="text-[11px] text-[#A2A5AC] line-clamp-2">
                {preset.tagline}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* TOP SECTION: DONUT CHART & DIVERSIFICATION CARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {/* Animated Donut Chart */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-[#20242B] to-[#171A20] border border-[#30343B] flex flex-col items-center justify-center text-center shadow-card-depth relative">
          <div className="relative w-44 h-44 flex items-center justify-center my-2">
            <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke="#101216"
                strokeWidth={strokeWidth}
                fill="transparent"
              />

              {donutSlices.map((slice) => (
                <circle
                  key={slice.categoryId}
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke={slice.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={slice.strokeDashoffset}
                  strokeLinecap="butt"
                  fill="transparent"
                  transform={`rotate(${slice.rotationAngle} 100 100)`}
                  className="transition-all duration-500 ease-out"
                />
              ))}
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className={`text-2xl font-mono font-bold ${isValid100 ? 'text-[#F4F1EA]' : 'text-[#E27D78]'}`}>
                {totalPercentage}%
              </span>
              <span className="text-[10px] text-[#A2A5AC] font-mono">
                {isValid100 ? '100% Balanced' : 'Invalid'}
              </span>
            </div>
          </div>

          <div className="pt-2 text-xs font-mono text-[#A2A5AC]">
            Monthly Deposit: <strong className="text-[#D5B477]">{formatINR(monthlyBudget)}</strong>
          </div>
        </div>

        {/* Mix Assessment & Trade-off Commentary */}
        <div className="md:col-span-2 p-5 sm:p-6 rounded-3xl bg-[#171A20] border border-[#30343B] flex flex-col justify-between space-y-4 shadow-card-depth">
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#A2A5AC]">
                PORTFOLIO STRATEGY PROFILE
              </span>
              <span className="text-xs font-mono font-bold text-[#8BC6A1] bg-[#8BC6A1]/10 px-2.5 py-0.5 rounded-full border border-[#8BC6A1]/30 self-start sm:self-auto">
                ~{(weightedReturnRate * 100).toFixed(1)}% p.a. Projected
              </span>
            </div>

            <h3 className="font-display text-xl font-bold text-[#F4F1EA]">
              {diversificationTitle}
            </h3>

            <p className="text-xs text-[#A2A5AC] leading-relaxed">
              {diversificationNote}
            </p>

            {/* Asset Class Pillar Breakdown */}
            <div className="p-4 rounded-2xl bg-[#101216] border border-[#30343B] grid grid-cols-3 gap-3 text-xs">
              <div>
                <p className="text-[#A2A5AC] text-[10px] font-mono uppercase">Equity Growth</p>
                <p className="font-mono font-bold text-[#D5B477] text-sm mt-0.5">{equityShare}%</p>
                <p className="text-[9px] text-[#A2A5AC]">Index / Direct / Active</p>
              </div>
              <div>
                <p className="text-[#A2A5AC] text-[10px] font-mono uppercase">Fixed & Safety</p>
                <p className="font-mono font-bold text-[#8BC6A1] text-sm mt-0.5">{debtFixedShare}%</p>
                <p className="text-[9px] text-[#A2A5AC]">FD / Bonds / Cash</p>
              </div>
              <div>
                <p className="text-[#A2A5AC] text-[10px] font-mono uppercase">Gold Buffer</p>
                <p className="font-mono font-bold text-[#E5C68A] text-sm mt-0.5">{goldShare}%</p>
                <p className="text-[9px] text-[#A2A5AC]">Crisis hedge</p>
              </div>
            </div>
          </div>

          {/* Action to Save & Rehearse */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
            <button
              onClick={handleSaveScenario}
              disabled={!isValid100}
              className={`w-full sm:flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                isValid100
                  ? 'bg-gradient-to-r from-[#D5B477] to-[#E5C68A] text-[#090A0C] hover:shadow-subtle-glow'
                  : 'bg-[#20242B] text-[#A2A5AC] cursor-not-allowed opacity-50'
              }`}
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#090A0C]" />
                  <span>Allocation Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Allocation Mix</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                sound.playClick();
                navigateTo('bad_year');
              }}
              className="w-full sm:w-auto px-4 py-3 rounded-xl text-xs font-semibold bg-[#20242B] hover:bg-[#2A2F3B] text-[#F4F1EA] border border-[#30343B] flex items-center justify-center space-x-1.5 transition-colors"
            >
              <ShieldAlert className="w-4 h-4 text-[#E27D78]" />
              <span>Test Bad-Year Shock</span>
            </button>
          </div>
        </div>
      </div>

      {/* PORTFOLIO GROWTH PROJECTION & SCENARIOS */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#171A20] border border-[#30343B] space-y-5 shadow-card-depth">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#30343B]/60 pb-4">
          <div>
            <h3 className="font-display text-base font-bold text-[#F4F1EA] flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-[#D5B477]" />
              <span>Estimated Portfolio Growth Across Future Scenarios</span>
            </h3>
            <p className="text-xs text-[#A2A5AC]">
              Growth projection combining your current savings ({formatINR(userProfile.currentSavings)}) and monthly deposit.
            </p>
          </div>

          {/* Scenario Selector (Adverse, Moderate, Favourable) */}
          <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-[#101216] border border-[#30343B] self-start sm:self-auto">
            {(['adverse', 'moderate', 'favourable'] as const).map((sc) => (
              <button
                key={sc}
                onClick={() => {
                  sound.playClick();
                  setSelectedScenario(sc);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-mono capitalize transition-all ${
                  selectedScenario === sc
                    ? 'bg-[#20242B] text-[#D5B477] border border-[#D5B477]/40 shadow-sm font-bold'
                    : 'text-[#A2A5AC] hover:text-[#F4F1EA]'
                }`}
              >
                {sc}
              </button>
            ))}
          </div>
        </div>

        {/* Projection Metric Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#101216] border border-[#30343B] space-y-1">
            <span className="text-[10px] font-mono text-[#A2A5AC] uppercase">Total Invested</span>
            <p className="font-mono font-bold text-sm sm:text-base text-[#F4F1EA]">
              {formatINR(portfolioProjection.totalContributed)}
            </p>
            <p className="text-[9px] text-[#A2A5AC]">Over {horizonYears} years</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#101216] border border-[#8BC6A1]/40 space-y-1">
            <span className="text-[10px] font-mono text-[#8BC6A1] uppercase">Nominal Portfolio FV</span>
            <p className="font-mono font-bold text-sm sm:text-base text-[#8BC6A1]">
              {formatINR(portfolioProjection.nominalValue)}
            </p>
            <p className="text-[9px] text-[#8BC6A1]/80">+{formatINR(portfolioProjection.wealthGain)} gain</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#101216] border border-[#D5B477]/40 space-y-1">
            <span className="text-[10px] font-mono text-[#D5B477] uppercase">Real Purchasing Power</span>
            <p className="font-mono font-bold text-sm sm:text-base text-[#D5B477]">
              {formatINR(portfolioProjection.realPurchasingPower)}
            </p>
            <p className="text-[9px] text-[#A2A5AC]">After 6% annual inflation</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#101216] border border-[#30343B] space-y-1">
            <span className="text-[10px] font-mono text-[#A2A5AC] uppercase">Compounding Multiple</span>
            <p className="font-mono font-bold text-sm sm:text-base text-[#F4F1EA]">
              {portfolioProjection.compoundingMultiple}x
            </p>
            <p className="text-[9px] text-[#A2A5AC]">Total wealth multiplier</p>
          </div>
        </div>

        {/* Horizon Selector */}
        <div className="flex items-center space-x-2 pt-1">
          <span className="text-xs font-mono text-[#A2A5AC]">Test Horizon:</span>
          {[1, 3, 5, 10, 15, 20].map((y) => (
            <button
              key={y}
              onClick={() => {
                sound.playClick();
                setHorizonYears(y);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                horizonYears === y
                  ? 'bg-[#D5B477] text-[#090A0C]'
                  : 'bg-[#101216] text-[#A2A5AC] hover:text-[#F4F1EA] border border-[#30343B]'
              }`}
            >
              {y}y
            </button>
          ))}
        </div>
      </div>

      {/* ADJUSTABLE PERCENTAGE SLIDERS */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#171A20] border border-[#30343B] space-y-5 shadow-card-depth">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-[#F4F1EA]">
            Adjust Allocation Percentages per Asset
          </h3>
          <span className="text-xs font-mono text-[#A2A5AC]">
            Current Total: <strong className={isValid100 ? 'text-[#8BC6A1]' : 'text-[#E27D78]'}>{totalPercentage}%</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allocations.map((alloc) => {
            const cat = INVESTMENT_CATEGORIES.find(c => c.id === alloc.categoryId);
            if (!cat) return null;
            const rupeeValue = Math.round((alloc.percentage / 100) * monthlyBudget);

            return (
              <div 
                key={alloc.categoryId} 
                className="p-4 rounded-2xl bg-[#101216] border border-[#30343B] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 min-w-0">
                    <div 
                      className="w-3 h-3 rounded-full shrink-0" 
                      style={{ backgroundColor: CATEGORY_COLORS[alloc.categoryId] || '#A9B8C8' }} 
                    />
                    <span className="font-semibold text-xs text-[#F4F1EA] truncate">{cat.name}</span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-xs text-[#F4F1EA]">{alloc.percentage}%</span>
                    <span className="font-mono text-[11px] text-[#D5B477] ml-1.5">({formatINR(rupeeValue)})</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={alloc.percentage}
                  onChange={(e) => updateAllocation(alloc.categoryId, Number(e.target.value))}
                  className="w-full accent-[#D5B477] bg-[#20242B] rounded-lg h-2 cursor-pointer"
                />

                <div className="flex justify-between text-[10px] text-[#A2A5AC] font-mono">
                  <span>Rate: ~{(cat.illustrativeReturnRate * 100).toFixed(1)}% p.a.</span>
                  <span>{cat.riskLevel} Risk</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Educational Notice */}
      <div className="p-4 rounded-2xl bg-[#101216] border border-[#30343B] flex items-start space-x-3 text-xs text-[#A2A5AC]">
        <Info className="w-4 h-4 text-[#D5B477] shrink-0 mt-0.5" />
        <p>
          <strong className="text-[#F4F1EA]">Simulation Notice: </strong> 
          Projections are calculated deterministically from the chosen mathematical assumptions. Market returns will vary year-to-year and are not guaranteed. Always maintain a 3-6 month emergency fund before allocating to volatile market instruments.
        </p>
      </div>
    </div>
  );
};
