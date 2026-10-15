import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateAdvancedProjection, formatINR, estimateTimeToGoal } from '../../utils/calculations';
import { sound } from '../../utils/sound';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Lock, 
  DollarSign, 
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Calculator,
  Percent,
  Sliders,
  Scale,
  Sparkles,
  Info,
  Calendar,
  Flame,
  Award,
  BarChart3
} from 'lucide-react';

export const InvestmentDetailModal: React.FC = () => {
  const { 
    selectedCategoryForDetail, 
    setSelectedCategoryForDetail, 
    userProfile, 
    navigateTo, 
    toggleCompareCategory, 
    comparedCategoryIds 
  } = useApp();

  // Active tab inside modal
  const [activeTab, setActiveTab] = useState<'how_it_works' | 'returns' | 'risks' | 'costs' | 'suitability'>('how_it_works');

  // Calculator state
  const [monthlyContribution, setMonthlyContribution] = useState<number>(userProfile.comfortableMonthlyContribution || 1000);
  const [initialLumpSum, setInitialLumpSum] = useState<number>(0);
  const [durationYears, setDurationYears] = useState<number>(5);
  const [inflationRate, setInflationRate] = useState<number>(0.06); // 6% annual inflation
  const [stepUpPct, setStepUpPct] = useState<number>(0); // 0%, 5%, 10%
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<'conservative' | 'middle' | 'strong'>('middle');

  if (!selectedCategoryForDetail) return null;

  const item = selectedCategoryForDetail;
  const isCompared = comparedCategoryIds.includes(item.id);

  // Determine active rate from scenario or custom
  const currentScenario = item.scenarios ? item.scenarios[selectedScenarioKey] : null;
  const currentAnnualRate = currentScenario ? currentScenario.rate : item.illustrativeReturnRate;

  // Run calculation engine
  const projection = calculateAdvancedProjection({
    initialLumpSum,
    monthlyContribution,
    annualRate: currentAnnualRate,
    years: durationYears,
    annualInflation: inflationRate,
    annualStepUpPct: stepUpPct,
    annualFeePct: item.costsAndFees && item.costsAndFees[0] && item.id === 'mutual_funds' ? 0.012 : 0,
  });

  // Calculate goal completion estimate for Aarav's ₹10 Lakhs milestone
  const goalEstimate = estimateTimeToGoal(
    userProfile.goalTargetAmount || 1000000,
    initialLumpSum,
    monthlyContribution,
    currentAnnualRate
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl bg-gradient-to-b from-[#1C2028] via-[#14171E] to-[#0D0F13] border border-[#30343B] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-5 sm:px-7 py-4 sm:py-5 border-b border-[#30343B]/70 flex items-start justify-between bg-[#171A20]/60">
          <div className="space-y-1.5 pr-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-bold ${
                item.riskLevel === 'Very Low' || item.riskLevel === 'Low'
                  ? 'bg-[#8BC6A1]/10 text-[#8BC6A1] border-[#8BC6A1]/30'
                  : item.riskLevel === 'Moderate'
                  ? 'bg-[#D5B477]/10 text-[#D5B477] border-[#D5B477]/30'
                  : 'bg-[#E27D78]/10 text-[#E27D78] border-[#E27D78]/30'
              }`}>
                {item.riskLevel} Risk
              </span>

              {item.mainRiskTag && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#20242B] text-[#A2A5AC] border border-[#30343B]">
                  Key Risk: {item.mainRiskTag}
                </span>
              )}

              <span className="text-[10px] font-mono text-[#D5B477] bg-[#D5B477]/10 px-2 py-0.5 rounded-full border border-[#D5B477]/30">
                {item.returnRange || `~${(item.illustrativeReturnRate * 100).toFixed(1)}% p.a.`}
              </span>
            </div>

            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F4F1EA]">
              {item.name}
            </h3>
            <p className="text-xs text-[#A2A5AC] line-clamp-1">{item.tagline}</p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setSelectedCategoryForDetail(null);
            }}
            className="p-2 rounded-xl text-[#A2A5AC] hover:text-[#F4F1EA] hover:bg-[#20242B] border border-transparent hover:border-[#30343B] transition-colors shrink-0"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center px-4 sm:px-6 border-b border-[#30343B]/60 bg-[#121418] overflow-x-auto scrollbar-none gap-1 sm:gap-2 py-2">
          {[
            { id: 'how_it_works', label: 'How It Works', icon: HelpCircle },
            { id: 'returns', label: 'Returns & Simulator', icon: Calculator },
            { id: 'risks', label: 'Risks & Protection', icon: AlertTriangle },
            { id: 'costs', label: 'Costs & Taxes', icon: DollarSign },
            { id: 'suitability', label: 'When It Fits', icon: CheckCircle2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(tab.id as any);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-[#20242B] text-[#D5B477] border border-[#D5B477]/40 shadow-sm'
                    : 'text-[#A2A5AC] hover:text-[#F4F1EA] hover:bg-[#171A20]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D5B477]' : 'text-[#A2A5AC]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Area */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-xs text-[#F4F1EA] leading-relaxed">
          
          {/* TAB 1: HOW IT WORKS */}
          {activeTab === 'how_it_works' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Plain Language Definition */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#101216] border border-[#30343B] space-y-2.5">
                <div className="flex items-center space-x-2 text-[#D5B477]">
                  <Sparkles className="w-4 h-4" />
                  <h4 className="font-mono text-xs uppercase font-bold tracking-wider">
                    In Plain Student Language
                  </h4>
                </div>
                <p className="text-xs text-[#F4F1EA] leading-relaxed">
                  {item.description}
                </p>
                <div className="pt-2 border-t border-[#30343B]/60 flex items-center space-x-2 text-[11px] text-[#A2A5AC]">
                  <span className="font-semibold text-[#D5B477]">Return Mechanism:</span>
                  <span>{item.returnMechanism}</span>
                </div>
              </div>

              {/* Step-by-Step Flow */}
              {item.howItWorksSteps && (
                <div className="space-y-3">
                  <h4 className="font-mono text-[11px] uppercase tracking-wider text-[#A2A5AC]">
                    Step-by-Step Mechanics
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {item.howItWorksSteps.map((step, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-[#171A20] border border-[#30343B] flex items-start space-x-3">
                        <span className="w-5 h-5 rounded-full bg-[#D5B477]/15 border border-[#D5B477]/30 text-[#D5B477] font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs text-[#A2A5AC]">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Aarav's Student Real-World Example */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#20242B] to-[#171A20] border border-[#D5B477]/40 space-y-2.5">
                <div className="flex items-center space-x-2 text-[#D5B477]">
                  <HelpCircle className="w-4 h-4" />
                  <span className="font-bold text-xs">Aarav's Student Scenario (₹1,000/Month)</span>
                </div>
                <p className="text-xs text-[#F4F1EA] leading-relaxed">
                  {item.realWorldExample}
                </p>
                <div className="p-2.5 rounded-xl bg-[#101216]/80 border border-[#30343B]/60 text-[11px] text-[#A2A5AC] space-y-1">
                  <p className="font-semibold text-[#8BC6A1]">Historical Context & Foundation:</p>
                  <p>{item.historicalContext}</p>
                </div>
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#101216] border border-[#8BC6A1]/30 space-y-2.5">
                  <span className="text-[11px] font-mono font-bold text-[#8BC6A1] flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Key Advantages</span>
                  </span>
                  <ul className="space-y-2 text-[11px] text-[#A2A5AC]">
                    {item.pros.map((pro, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-[#8BC6A1] font-bold">•</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-[#101216] border border-[#E27D78]/30 space-y-2.5">
                  <span className="text-[11px] font-mono font-bold text-[#E27D78] flex items-center space-x-1.5">
                    <XCircle className="w-4 h-4" />
                    <span>Trade-Offs & Downsides</span>
                  </span>
                  <ul className="space-y-2 text-[11px] text-[#A2A5AC]">
                    {item.cons.map((con, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-[#E27D78] font-bold">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RETURNS & SCENARIO SIMULATOR */}
          {activeTab === 'returns' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Notice of illustrative rate */}
              <div className="p-3.5 rounded-xl bg-[#171A20] border border-[#30343B] flex items-start space-x-3 text-xs">
                <Info className="w-4 h-4 text-[#D5B477] shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-[#A2A5AC]">
                  <p className="font-semibold text-[#F4F1EA]">
                    {item.isMarketLinked ? 'Market-Linked Return Modeling' : 'Contractual Fixed-Yield Modeling'}
                  </p>
                  <p className="text-[11px]">
                    {item.isMarketLinked 
                      ? 'Stock market returns fluctuate continuously and are not guaranteed. Projections use transparent compound annual assumptions for long-term illustration.'
                      : 'Fixed deposit and savings interest rates are contractually fixed by the bank for the chosen tenure, subject to tax and inflation drag.'}
                  </p>
                </div>
              </div>

              {/* Scenario Switcher (Conservative, Middle, Strong) */}
              {item.scenarios && (
                <div className="space-y-2">
                  <label className="text-[11px] font-mono uppercase text-[#A2A5AC] flex items-center space-x-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-[#D5B477]" />
                    <span>Select Return Scenario</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {(['conservative', 'middle', 'strong'] as const).map((scKey) => {
                      const sc = item.scenarios![scKey];
                      const isSelected = selectedScenarioKey === scKey;

                      return (
                        <button
                          key={scKey}
                          onClick={() => {
                            sound.playClick();
                            setSelectedScenarioKey(scKey);
                          }}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'bg-[#20242B] border-[#D5B477] shadow-sm'
                              : 'bg-[#101216] border-[#30343B] hover:border-[#A2A5AC]/40'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-[#F4F1EA] capitalize">
                              {scKey}
                            </span>
                            <span className="font-mono font-bold text-xs text-[#8BC6A1]">
                              ~{(sc.rate * 100).toFixed(1)}% p.a.
                            </span>
                          </div>
                          <p className="text-[10px] text-[#A2A5AC] mt-1 line-clamp-2">
                            {sc.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Interactive Sliders Form */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#101216] border border-[#30343B] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Monthly Contribution Slider */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#A2A5AC] font-mono">Monthly Contribution</span>
                      <span className="font-mono font-bold text-[#D5B477]">{formatINR(monthlyContribution)}/mo</span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="20000"
                      step="250"
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                      className="w-full accent-[#D5B477] bg-[#20242B] rounded-lg h-2 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-[#A2A5AC]/60 font-mono">
                      <span>₹500</span>
                      <span>₹10,000</span>
                      <span>₹20,000</span>
                    </div>
                  </div>

                  {/* Initial Lump Sum */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#A2A5AC] font-mono">Initial Lump Sum</span>
                      <span className="font-mono font-bold text-[#F4F1EA]">{formatINR(initialLumpSum)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="1000"
                      value={initialLumpSum}
                      onChange={(e) => setInitialLumpSum(Number(e.target.value))}
                      className="w-full accent-[#D5B477] bg-[#20242B] rounded-lg h-2 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-[#A2A5AC]/60 font-mono">
                      <span>₹0</span>
                      <span>₹25,000</span>
                      <span>₹50,000</span>
                    </div>
                  </div>
                </div>

                {/* Duration Buttons & Inflation Slider */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#30343B]/60">
                  {/* Duration Presets */}
                  <div className="space-y-1.5">
                    <span className="text-[#A2A5AC] font-mono text-[11px]">Investment Horizon</span>
                    <div className="flex items-center space-x-1.5">
                      {[1, 3, 5, 10, 15, 20].map((y) => (
                        <button
                          key={y}
                          onClick={() => {
                            sound.playClick();
                            setDurationYears(y);
                          }}
                          className={`flex-1 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                            durationYears === y
                              ? 'bg-[#D5B477] text-[#090A0C]'
                              : 'bg-[#171A20] text-[#A2A5AC] hover:text-[#F4F1EA] border border-[#30343B]'
                          }`}
                        >
                          {y}y
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Inflation Assumption */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#A2A5AC] font-mono">Assumed Annual Inflation</span>
                      <span className="font-mono font-bold text-[#E27D78]">{(inflationRate * 100).toFixed(1)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.03"
                      max="0.09"
                      step="0.005"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(Number(e.target.value))}
                      className="w-full accent-[#E27D78] bg-[#20242B] rounded-lg h-2 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-[#A2A5AC]/60 font-mono">
                      <span>3.0% (Low)</span>
                      <span>6.0% (India Avg)</span>
                      <span>9.0% (High)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* PROJECTION RESULTS SUMMARY CARDS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#171A20] border border-[#30343B] space-y-1">
                  <span className="text-[10px] font-mono text-[#A2A5AC] uppercase">Total Contributed</span>
                  <p className="font-mono font-bold text-sm sm:text-base text-[#F4F1EA]">
                    {formatINR(projection.totalContributed)}
                  </p>
                  <p className="text-[9px] text-[#A2A5AC]">Across {durationYears} years</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#171A20] border border-[#8BC6A1]/40 space-y-1">
                  <span className="text-[10px] font-mono text-[#8BC6A1] uppercase">Future Value (FV)</span>
                  <p className="font-mono font-bold text-sm sm:text-base text-[#8BC6A1]">
                    {formatINR(projection.nominalValue)}
                  </p>
                  <p className="text-[9px] text-[#8BC6A1]/80">+{formatINR(projection.wealthGain)} gain</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#171A20] border border-[#D5B477]/40 space-y-1">
                  <span className="text-[10px] font-mono text-[#D5B477] uppercase">Real Purchasing Power</span>
                  <p className="font-mono font-bold text-sm sm:text-base text-[#D5B477]">
                    {formatINR(projection.realPurchasingPower)}
                  </p>
                  <p className="text-[9px] text-[#A2A5AC]">Inflation-adjusted in today's ₹</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#171A20] border border-[#30343B] space-y-1">
                  <span className="text-[10px] font-mono text-[#A2A5AC] uppercase">Compounding Factor</span>
                  <p className="font-mono font-bold text-sm sm:text-base text-[#F4F1EA]">
                    {projection.compoundingMultiple}x
                  </p>
                  <p className="text-[9px] text-[#A2A5AC]">Ratio of value to deposit</p>
                </div>
              </div>

              {/* Goal Timeline Connect */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#20242B] to-[#171A20] border border-[#D5B477]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#D5B477] font-bold flex items-center space-x-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>Progress Toward First Milestone ({formatINR(userProfile.goalTargetAmount)})</span>
                  </span>
                  <p className="text-xs text-[#F4F1EA]">
                    {goalEstimate.reachable 
                      ? `At this contribution and return, you would reach ₹10 Lakhs in approximately ${goalEstimate.years} years.`
                      : 'At ₹1,000/mo, ₹10 Lakhs requires longer horizons or stepping up contributions over time.'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedCategoryForDetail(null);
                    navigateTo('simulator');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#D5B477] text-[#090A0C] font-bold text-xs flex items-center space-x-1 shrink-0 self-start sm:self-auto hover:bg-[#E5C68A] transition-colors"
                >
                  <span>Explore in Simulator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Growth Breakdown Table */}
              <div className="overflow-x-auto rounded-2xl border border-[#30343B]">
                <table className="w-full text-left text-[11px] font-mono">
                  <thead className="bg-[#101216] text-[#A2A5AC] border-b border-[#30343B]">
                    <tr>
                      <th className="py-2.5 px-3">Horizon</th>
                      <th className="py-2.5 px-3">Contributed</th>
                      <th className="py-2.5 px-3">Nominal Value</th>
                      <th className="py-2.5 px-3">Real Purchasing Power</th>
                      <th className="py-2.5 px-3">Multiple</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#30343B]/60 bg-[#171A20]">
                    {projection.breakdown
                      .filter(pt => [1, 3, 5, 10, 15, 20].includes(pt.year) || pt.year === durationYears)
                      .map((pt) => (
                        <tr key={pt.year} className={pt.year === durationYears ? 'bg-[#D5B477]/10' : ''}>
                          <td className="py-2 px-3 font-bold text-[#F4F1EA]">{pt.year} Year{pt.year > 1 ? 's' : ''}</td>
                          <td className="py-2 px-3 text-[#A2A5AC]">{formatINR(pt.totalContributed)}</td>
                          <td className="py-2 px-3 font-bold text-[#8BC6A1]">{formatINR(pt.nominalValue)}</td>
                          <td className="py-2 px-3 text-[#D5B477]">{formatINR(pt.realPurchasingPower)}</td>
                          <td className="py-2 px-3 text-[#F4F1EA]">{pt.compoundingMultiple}x</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: RISKS & PROTECTION */}
          {activeTab === 'risks' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Capital Protection Badge */}
              <div className="p-4 rounded-2xl bg-[#101216] border border-[#30343B] space-y-2">
                <div className="flex items-center space-x-2 text-[#8BC6A1]">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="font-mono text-xs uppercase font-bold tracking-wider">
                    Capital Protection & Legal Guarantee
                  </span>
                </div>
                <p className="text-xs text-[#F4F1EA] leading-relaxed">
                  {item.capitalProtection || 'Market-linked assets carry no capital guarantees; value can drop in unfavorable conditions.'}
                </p>
              </div>

              {/* Applicable Risks Only */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-[11px] uppercase tracking-wider text-[#A2A5AC]">
                    Specific Applicable Risks (No Generic Blanket Tags)
                  </h4>
                  <span className="text-[10px] font-mono text-[#A2A5AC]">
                    Volatility Score: {item.volatilityRating} / 5
                  </span>
                </div>

                <div className="space-y-3">
                  {item.applicableRisks && item.applicableRisks.map((risk, idx) => (
                    <div 
                      key={idx} 
                      className={`p-4 rounded-2xl border space-y-2 ${
                        risk.level === 'Severe' || risk.level === 'High'
                          ? 'bg-[#E27D78]/10 border-[#E27D78]/30'
                          : 'bg-[#171A20] border-[#30343B]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#F4F1EA] flex items-center space-x-2">
                          <AlertTriangle className={`w-3.5 h-3.5 ${
                            risk.level === 'Severe' || risk.level === 'High' ? 'text-[#E27D78]' : 'text-[#D5B477]'
                          }`} />
                          <span>{risk.name}</span>
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                          risk.level === 'Severe'
                            ? 'bg-[#E27D78] text-[#090A0C]'
                            : risk.level === 'High'
                            ? 'bg-[#E27D78]/20 text-[#E27D78]'
                            : 'bg-[#D5B477]/20 text-[#D5B477]'
                        }`}>
                          {risk.level}
                        </span>
                      </div>

                      <p className="text-xs text-[#A2A5AC] leading-relaxed">
                        {risk.description}
                      </p>

                      <div className="p-2.5 rounded-xl bg-[#101216]/60 border border-[#30343B]/60 text-[11px] text-[#A2A5AC]">
                        <strong className="text-[#D5B477]">Why this matters for students: </strong>
                        <span>{risk.whyItMatters}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Liquidity & Withdrawal Rules */}
              <div className="p-4 rounded-2xl bg-[#171A20] border border-[#30343B] space-y-2">
                <div className="flex items-center space-x-2 text-[#A9B8C8]">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono text-xs uppercase font-bold tracking-wider">
                    Liquidity & Access to Cash
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-xs text-[#F4F1EA]">{item.liquidity}</span>
                  <span className="text-[#A2A5AC]">—</span>
                  <span className="text-xs text-[#A2A5AC]">{item.withdrawalRestrictions}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: COSTS & TAXES */}
          {activeTab === 'costs' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Fee Transparency */}
              <div className="space-y-3">
                <h4 className="font-mono text-[11px] uppercase tracking-wider text-[#A2A5AC]">
                  Applicable Expenses & Account Charges
                </h4>

                <div className="space-y-2.5">
                  {item.costsAndFees && item.costsAndFees.map((cost, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-[#171A20] border border-[#30343B] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-xs text-[#F4F1EA]">{cost.name}</span>
                        <p className="text-[11px] text-[#A2A5AC]">{cost.description}</p>
                      </div>
                      <span className="font-mono font-bold text-xs text-[#D5B477] bg-[#D5B477]/10 px-2.5 py-1 rounded-lg border border-[#D5B477]/20 self-start sm:self-auto shrink-0">
                        {cost.typicalAmount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tax Considerations */}
              {item.taxConsiderations && (
                <div className="p-4 sm:p-5 rounded-2xl bg-[#101216] border border-[#30343B] space-y-3">
                  <div className="flex items-center space-x-2 text-[#D5B477]">
                    <Percent className="w-4 h-4" />
                    <span className="font-mono text-xs uppercase font-bold tracking-wider">
                      Tax Treatment & Rules
                    </span>
                  </div>

                  <p className="font-semibold text-xs text-[#F4F1EA]">
                    {item.taxConsiderations.summary}
                  </p>

                  <p className="text-xs text-[#A2A5AC] leading-relaxed">
                    {item.taxConsiderations.details}
                  </p>

                  <div className="p-2.5 rounded-xl bg-[#171A20] border border-[#30343B]/60 text-[10px] text-[#A2A5AC]">
                    <span className="text-[#D5B477] font-semibold">Important Regulatory Note: </span>
                    {item.taxConsiderations.regulatoryNote} Tax rules depend on individual income brackets and current fiscal legislation.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SUITABILITY */}
          {activeTab === 'suitability' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-[#101216] border border-[#30343B] space-y-2">
                <span className="font-mono text-[10px] uppercase text-[#D5B477] font-bold">Recommended Planning Horizon</span>
                <p className="font-semibold text-sm text-[#F4F1EA]">{item.planningHorizon}</p>
                <p className="text-xs text-[#A2A5AC]">{item.suitability}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* When it fits */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#171A20] border border-[#8BC6A1]/40 space-y-3">
                  <div className="flex items-center space-x-2 text-[#8BC6A1]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-mono text-xs uppercase font-bold">When This Investment Fits</span>
                  </div>
                  <ul className="space-y-2 text-xs text-[#A2A5AC]">
                    {item.detailedSuitability?.whenItFits.map((fit, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-[#8BC6A1] font-bold mt-0.5">✓</span>
                        <span>{fit}</span>
                      </li>
                    )) || (
                      <li>Fits long-term goals aligned with recommended planning horizon.</li>
                    )}
                  </ul>
                </div>

                {/* When it does not fit */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#171A20] border border-[#E27D78]/40 space-y-3">
                  <div className="flex items-center space-x-2 text-[#E27D78]">
                    <XCircle className="w-4 h-4" />
                    <span className="font-mono text-xs uppercase font-bold">When It Does NOT Fit</span>
                  </div>
                  <ul className="space-y-2 text-xs text-[#A2A5AC]">
                    {item.detailedSuitability?.whenItDoesNotFit.map((notFit, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-[#E27D78] font-bold mt-0.5">✕</span>
                        <span>{notFit}</span>
                      </li>
                    )) || (
                      <li>Does not fit emergency money or horizons shorter than recommended.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 sm:px-7 py-3.5 bg-[#101216] border-t border-[#30343B]/70 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-[10px] text-[#A2A5AC] font-mono">
            <span>Source: {item.dataSourceNote || 'SEBI / RBI Regulatory Framework'}</span>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => {
                toggleCompareCategory(item.id);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors flex items-center space-x-1.5 ${
                isCompared
                  ? 'bg-[#D5B477]/15 text-[#D5B477] border-[#D5B477]/40'
                  : 'bg-[#171A20] text-[#A2A5AC] border-[#30343B] hover:text-[#F4F1EA]'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isCompared ? '✓ Added to Compare' : '+ Compare Category'}</span>
            </button>

            <button
              onClick={() => {
                setSelectedCategoryForDetail(null);
                navigateTo('comparison');
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#20242B] hover:bg-[#2A2F3B] text-[#F4F1EA] border border-[#A9B8C8]/30 flex items-center space-x-1.5 transition-colors"
            >
              <span>Side-by-Side Compare</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
