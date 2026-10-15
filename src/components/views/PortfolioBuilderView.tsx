import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INVESTMENT_CATEGORIES } from '../../data/investmentsData';
import { InvestmentCategoryId } from '../../types/finance';
import { formatINR } from '../../utils/calculations';
import { sound } from '../../utils/sound';
import { 
  PieChart, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Sparkles, 
  Info 
} from 'lucide-react';

const CATEGORY_COLORS: Record<InvestmentCategoryId, string> = {
  index_funds: '#D5B477', // Champagne Gold
  fd: '#8BC6A1',          // Muted Sage Green
  gold: '#E5C68A',        // Warm Amber Gold
  savings: '#A9B8C8',     // Cool Silver
  bonds: '#6F8FAF',       // Steel Blue
  mutual_funds: '#E27D78', // Muted Coral
};

export const PortfolioBuilderView: React.FC = () => {
  const { 
    allocations, 
    updateAllocation, 
    resetAllocations, 
    autoBalanceAllocations, 
    userProfile, 
    addActivity 
  } = useApp();

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const monthlyBudget = userProfile.comfortableMonthlyContribution;

  const totalPercentage = allocations.reduce((sum, item) => sum + item.percentage, 0);
  const isValid100 = totalPercentage === 100;

  const weightedReturnRate = allocations.reduce((sum, item) => {
    const cat = INVESTMENT_CATEGORIES.find(c => c.id === item.categoryId);
    const rate = cat ? cat.illustrativeReturnRate : 0.08;
    return sum + (rate * (item.percentage / 100));
  }, 0);

  const equityShare = (allocations.find(a => a.categoryId === 'index_funds')?.percentage || 0) +
                      (allocations.find(a => a.categoryId === 'mutual_funds')?.percentage || 0);

  let mixRating = 'Balanced Growth';
  let mixAdvice = 'Moderate equity engine buffered by cash and gold reserves.';
  if (equityShare >= 70) {
    mixRating = 'Aggressive Growth';
    mixAdvice = 'High equity concentration: maximum long-term upside, but expect steep swings in bad years.';
  } else if (equityShare <= 25) {
    mixRating = 'Conservative Capital Preservation';
    mixAdvice = 'Heavy in fixed deposits and cash. High safety, but vulnerable to inflation drag.';
  }

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

  const handleSaveScenario = () => {
    if (!isValid100) return;
    sound.playChime();
    setSavedSuccess(true);
    addActivity({
      title: 'Hypothetical Portfolio Saved',
      type: 'scenario',
      amount: monthlyBudget,
      details: `Saved ${mixRating} allocation: ${allocations.filter(a => a.percentage > 0).map(a => `${a.percentage}% ${a.categoryId}`).join(', ')}.`,
      badge: 'Portfolio Ready',
    });
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn pb-12 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#A2A5AC] uppercase tracking-wider mb-1">
            <PieChart className="w-3.5 h-3.5 text-[#D5B477]" />
            <span>HYPOTHETICAL ASSET MIX</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F4F1EA] tracking-tight">
            Portfolio Builder
          </h1>
          <p className="text-xs text-[#A2A5AC] mt-0.5">
            Divide your {formatINR(monthlyBudget)} monthly contribution across categories. Must total exactly 100%.
          </p>
        </div>

        {/* Rebalance & Reset Controls */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={autoBalanceAllocations}
            className="px-3 py-2 rounded-xl text-xs font-medium bg-[#171A20] hover:bg-[#20242B] border border-[#30343B] text-[#D5B477] transition-colors flex items-center space-x-1.5"
            title="Automatically distribute to 100%"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-Balance</span>
          </button>

          <button
            onClick={resetAllocations}
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
            className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-[#E27D78] text-[#090A0C] font-bold text-xs hover:bg-[#E27D78]/90 transition-colors"
          >
            Auto-Fix to 100%
          </button>
        </div>
      )}

      {/* TOP SECTION: DONUT CHART & RISK TRADE-OFF CARD */}
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
                {isValid100 ? 'Balanced' : 'Invalid'}
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
              {mixRating}
            </h3>

            <p className="text-xs text-[#A2A5AC] leading-relaxed">
              {mixAdvice}
            </p>

            <div className="p-4 rounded-2xl bg-[#101216] border border-[#30343B] grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <p className="text-[#A2A5AC] text-[10px] font-mono uppercase">Equity Growth</p>
                <p className="font-mono font-bold text-[#D5B477] text-sm mt-0.5">{equityShare}%</p>
              </div>
              <div>
                <p className="text-[#A2A5AC] text-[10px] font-mono uppercase">Defensive</p>
                <p className="font-mono font-bold text-[#8BC6A1] text-sm mt-0.5">{100 - equityShare}%</p>
              </div>
              <div>
                <p className="text-[#A2A5AC] text-[10px] font-mono uppercase">Gold Buffer</p>
                <p className="font-mono font-bold text-[#A9B8C8] text-sm mt-0.5">
                  {allocations.find(a => a.categoryId === 'gold')?.percentage || 0}%
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveScenario}
            disabled={!isValid100}
            className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              isValid100
                ? 'bg-gradient-to-r from-[#D5B477] to-[#E5C68A] text-[#090A0C] hover:shadow-subtle-glow'
                : 'bg-[#20242B] text-[#A2A5AC] cursor-not-allowed opacity-50'
            }`}
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#090A0C]" />
                <span>Allocation Saved for Rehearsal!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Allocation & Stress-Test in Bad Year</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ADJUSTABLE PERCENTAGE SLIDERS */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#171A20] border border-[#30343B] space-y-5 shadow-card-depth">
        <h3 className="font-display text-base font-bold text-[#F4F1EA]">
          Adjust Allocation Percentages
        </h3>

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
                      style={{ backgroundColor: CATEGORY_COLORS[alloc.categoryId] }} 
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

                <p className="text-[10px] text-[#A2A5AC] truncate">
                  {cat.tagline}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 rounded-2xl bg-[#101216] border border-[#30343B] flex items-center space-x-3 text-xs text-[#A2A5AC]">
        <Info className="w-4 h-4 text-[#D5B477] shrink-0" />
        <p>
          <strong className="text-[#F4F1EA]">Simulation Notice:</strong> This portfolio builder creates hypothetical modeling scenarios. No real money or actual investment trades have occurred.
        </p>
      </div>
    </div>
  );
};
