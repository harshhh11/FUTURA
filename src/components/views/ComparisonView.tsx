import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INVESTMENT_CATEGORIES } from '../../data/investmentsData';
import { InvestmentCategory, InvestmentCategoryId } from '../../types/finance';
import { calculateAdvancedProjection, formatINR } from '../../utils/calculations';
import { sound } from '../../utils/sound';
import { 
  Scale, 
  HelpCircle, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Percent,
  Clock,
  Lock,
  AlertTriangle,
  Flame,
  CheckCircle2,
  XCircle,
  Sliders,
  Sparkles,
  Info
} from 'lucide-react';

interface TradeOffExplainModal {
  title: string;
  explanation: string;
  studentImplication: string;
}

export const ComparisonView: React.FC = () => {
  const { comparedCategoryIds, toggleCompareCategory, navigateTo, userProfile } = useApp();
  const [activeExplainer, setActiveExplainer] = useState<TradeOffExplainModal | null>(null);

  // Shared comparison inputs
  const [sharedMonthly, setSharedMonthly] = useState<number>(userProfile.comfortableMonthlyContribution || 1000);
  const [sharedYears, setSharedYears] = useState<number>(5);
  const [sharedInflation, setSharedInflation] = useState<number>(0.06);

  // Filter selected categories
  const comparedList = INVESTMENT_CATEGORIES.filter(c => comparedCategoryIds.includes(c.id));

  const explainers: Record<string, TradeOffExplainModal> = {
    'potential_returns': {
      title: 'Potential Returns & Mechanism',
      explanation: 'Differentiates contractual fixed-yield interest (guaranteed by contract like FDs) from market-linked returns (driven by corporate earnings and stock market valuation).',
      studentImplication: 'Fixed rates provide certainty. Market-linked rates fluctuate continuously but historically outpace inflation over 5+ years.',
    },
    'capital_protection': {
      title: 'Capital Protection & Safety Guarantees',
      explanation: 'Specifies whether statutory deposit insurance (like DICGC up to ₹5L in India) or sovereign backing protects your principal.',
      studentImplication: 'Bank accounts and G-Sec bonds protect your nominal rupee amount. Stocks and Gold carry zero capital guarantees.',
    },
    'risk_level': {
      title: 'Risk Level & Price Volatility',
      explanation: 'The frequency and severity of price fluctuations. A volatility of 4 or 5 means your balance can drop 15% to 35% during market corrections.',
      studentImplication: 'If you need money in under 2 years, avoid high-volatility assets completely to avoid selling at a paper loss.',
    },
    'access_to_money': {
      title: 'Liquidity & Access to Cash',
      explanation: 'How quickly and without penalty you can convert the investment into spendable money in your bank account.',
      studentImplication: 'Savings accounts allow instant 24/7 UPI. FDs impose breakage penalties. Mutual funds take 1 to 3 business days.',
    },
    'investment_horizon': {
      title: 'Recommended Time Horizon',
      explanation: 'The minimum duration you should plan to hold the investment to allow compounding to work and to smooth out temporary market drawdowns.',
      studentImplication: 'Give equities at least 5 to 7 years. Use FDs or savings for goals under 3 years.',
    },
    'fees_and_expenses': {
      title: 'Fees, Expense Ratios & Penalties',
      explanation: 'Ongoing management fees, exit loads, and brokerage costs deducted from your assets.',
      studentImplication: 'Keep expense ratios under 0.25% where possible. Active 1.5% fees reduce long-term compounding by lakhs.',
    },
    'tax_considerations': {
      title: 'Taxation & Slab Treatment',
      explanation: 'How your earnings are taxed. Bank interest is taxed at income slabs, whereas equity capital gains enjoy favorable 12.5% LTCG rates.',
      studentImplication: 'Students earning under ₹3 Lakhs/year pay zero tax, making equity or FD gains effectively tax-free.',
    },
    'inflation_sensitivity': {
      title: 'Inflation Sensitivity & Real Purchasing Power',
      explanation: 'Whether the asset outpaces India\'s historical ~5.5%-6.0% inflation rate or suffers purchasing power erosion.',
      studentImplication: 'An investment balance can grow in nominal rupees while shrinking in terms of the actual goods it can buy.',
    },
    'possible_losses': {
      title: 'Downside Scenarios & Possible Losses',
      explanation: 'The maximum potential loss you could experience during an unfavorable economic crash or default.',
      studentImplication: 'In bad years, equities can drop 20-35% on paper. FDs never lose nominal value but lose real purchasing power.',
    },
    'goal_suitability': {
      title: 'Goal Suitability (Short vs. Long)',
      explanation: 'Matching the investment characteristics to your specific financial milestone timeline.',
      studentImplication: 'Short goals need capital safety. Long goals need inflation-beating growth.',
    }
  };

  // Structured evaluation rows
  const rows = [
    {
      key: 'potential_returns',
      label: 'Potential Returns',
      getValue: (c: InvestmentCategory) => (
        <div className="space-y-1">
          <p className="font-mono font-bold text-sm text-[#8BC6A1]">
            {c.returnRange || `~${(c.illustrativeReturnRate * 100).toFixed(1)}% p.a.`}
          </p>
          <p className="text-[11px] text-[#A2A5AC]">{c.returnMechanism}</p>
          <span className={`inline-block text-[9px] font-mono px-2 py-0.5 rounded-full ${
            c.isMarketLinked ? 'bg-[#D5B477]/10 text-[#D5B477] border border-[#D5B477]/20' : 'bg-[#8BC6A1]/10 text-[#8BC6A1] border border-[#8BC6A1]/20'
          }`}>
            {c.isMarketLinked ? 'Market-Linked' : 'Contractual Fixed'}
          </span>
        </div>
      ),
    },
    {
      key: 'capital_protection',
      label: 'Capital Protection',
      getValue: (c: InvestmentCategory) => (
        <div className="space-y-1">
          <p className="font-semibold text-xs text-[#F4F1EA]">
            {c.capitalProtection?.split('(')[0] || 'Market-Linked'}
          </p>
          <p className="text-[10px] text-[#A2A5AC]">
            {c.capitalProtection || 'Subject to market risk; no government capital guarantee.'}
          </p>
        </div>
      ),
    },
    {
      key: 'risk_level',
      label: 'Risk & Volatility',
      getValue: (c: InvestmentCategory) => (
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold ${
              c.riskLevel === 'Very Low' || c.riskLevel === 'Low'
                ? 'bg-[#8BC6A1]/10 text-[#8BC6A1] border-[#8BC6A1]/30'
                : c.riskLevel === 'Moderate'
                ? 'bg-[#D5B477]/10 text-[#D5B477] border-[#D5B477]/30'
                : 'bg-[#E27D78]/10 text-[#E27D78] border-[#E27D78]/30'
            }`}>
              {c.riskLevel} Risk
            </span>
            <span className="text-[10px] font-mono text-[#A2A5AC]">
              ({c.volatilityRating}/5 volatility)
            </span>
          </div>
          {c.mainRiskTag && (
            <p className="text-[11px] text-[#E27D78]">
              Main Risk: <strong>{c.mainRiskTag}</strong>
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'access_to_money',
      label: 'Liquidity & Access',
      getValue: (c: InvestmentCategory) => (
        <div className="space-y-1">
          <p className="font-semibold text-xs text-[#F4F1EA]">{c.liquidity}</p>
          <p className="text-[10px] text-[#A2A5AC]">{c.withdrawalRestrictions}</p>
        </div>
      ),
    },
    {
      key: 'investment_horizon',
      label: 'Planning Horizon',
      getValue: (c: InvestmentCategory) => (
        <div className="space-y-1">
          <p className="font-mono text-xs font-bold text-[#D5B477]">{c.planningHorizon.split('(')[0]}</p>
          <p className="text-[10px] text-[#A2A5AC]">{c.planningHorizon}</p>
        </div>
      ),
    },
    {
      key: 'fees_and_expenses',
      label: 'Fees & Costs',
      getValue: (c: InvestmentCategory) => (
        <div className="space-y-1">
          {c.costsAndFees && c.costsAndFees.length > 0 ? (
            <ul className="text-[11px] text-[#A2A5AC] space-y-1">
              {c.costsAndFees.slice(0, 2).map((fee, idx) => (
                <li key={idx} className="flex justify-between gap-1">
                  <span className="truncate">{fee.name}:</span>
                  <span className="font-mono text-[#D5B477] font-semibold shrink-0">{fee.typicalAmount}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[11px] text-[#A2A5AC]">Standard statutory charges.</p>
          )}
        </div>
      ),
    },
    {
      key: 'tax_considerations',
      label: 'Tax Considerations',
      getValue: (c: InvestmentCategory) => (
        <div className="space-y-1">
          <p className="font-semibold text-[11px] text-[#F4F1EA]">
            {c.taxConsiderations?.summary || 'Subject to capital gains tax'}
          </p>
          <p className="text-[10px] text-[#A2A5AC] line-clamp-2">
            {c.taxConsiderations?.details || 'Consult current income tax regulations.'}
          </p>
        </div>
      ),
    },
    {
      key: 'inflation_sensitivity',
      label: 'Inflation Sensitivity',
      getValue: (c: InvestmentCategory) => {
        const beats = c.illustrativeReturnRate > sharedInflation;
        return (
          <div className="space-y-1">
            <span className={`inline-flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded-full border ${
              beats ? 'bg-[#8BC6A1]/10 text-[#8BC6A1] border-[#8BC6A1]/30' : 'bg-[#E27D78]/10 text-[#E27D78] border-[#E27D78]/30'
            }`}>
              <span>{beats ? '✓ Outpaces Inflation' : '✕ Suffers Inflation Drag'}</span>
            </span>
            <p className="text-[10px] text-[#A2A5AC]">
              {beats 
                ? `Expected rate (~${(c.illustrativeReturnRate * 100).toFixed(1)}%) is higher than ${Math.round(sharedInflation * 100)}% inflation.`
                : `Expected rate (~${(c.illustrativeReturnRate * 100).toFixed(1)}%) falls below ${Math.round(sharedInflation * 100)}% inflation.`}
            </p>
          </div>
        );
      },
    },
    {
      key: 'possible_losses',
      label: 'Possible Downside',
      getValue: (c: InvestmentCategory) => (
        <div className="space-y-1 text-[11px] text-[#A2A5AC]">
          {c.cons.slice(0, 2).map((con, idx) => (
            <p key={idx} className="flex items-start space-x-1.5">
              <span className="text-[#E27D78] shrink-0 font-bold">•</span>
              <span>{con}</span>
            </p>
          ))}
        </div>
      ),
    },
    {
      key: 'goal_suitability',
      label: 'Best Suited Goals',
      getValue: (c: InvestmentCategory) => (
        <div className="space-y-1">
          <p className="text-[11px] text-[#F4F1EA] font-medium">{c.suitability}</p>
        </div>
      ),
    },
  ];

  // Concise Trade-off Generator
  const generateTradeoffAnalysis = () => {
    if (comparedList.length < 2) return null;

    const hasGuaranteed = comparedList.some(c => !c.isMarketLinked);
    const hasEquity = comparedList.some(c => c.id === 'index_funds' || c.id === 'mutual_funds' || c.id === 'equities');
    const hasGold = comparedList.some(c => c.id === 'gold');

    if (hasGuaranteed && hasEquity) {
      return (
        <p className="text-xs text-[#A2A5AC] leading-relaxed">
          <strong className="text-[#F4F1EA]">Core Trade-Off (Certainty vs. Growth): </strong>
          The contractual option guarantees your nominal capital and provides predictable payouts for known short-term expenses, but after taxes it barely preserves purchasing power against inflation. In contrast, the equity option carries short-term market volatility (-15% to -35% paper drops in bad years), but provides the corporate earnings growth required to multiply real wealth over 5+ years. 
          <em className="text-[#D5B477] block mt-1">Neither is universally superior — match fixed assets to short goals (&lt; 3 yrs) and equities to long goals (5+ yrs).</em>
        </p>
      );
    }

    if (hasEquity && hasGold) {
      return (
        <p className="text-xs text-[#A2A5AC] leading-relaxed">
          <strong className="text-[#F4F1EA]">Core Trade-Off (Compounding Engine vs. Crisis Hedge): </strong>
          Equities generate corporate profits and dividends, acting as the primary wealth builder over 10+ years. Gold generates zero internal cash flow or dividends, but serves as a crisis hedge during currency depreciation and market panic. Holding both creates a resilient, balanced portfolio.
        </p>
      );
    }

    return (
      <p className="text-xs text-[#A2A5AC] leading-relaxed">
        <strong className="text-[#F4F1EA]">Balanced Analysis: </strong>
        Each of these instruments addresses a distinct balance of liquidity, risk tolerance, and duration. For a disciplined student investor, diversifying across complementary asset classes produces greater stability than concentrating everything in a single instrument.
      </p>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn pb-14 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#A2A5AC] uppercase tracking-wider mb-1">
            <Scale className="w-3.5 h-3.5 text-[#D5B477]" />
            <span>SIDE-BY-SIDE EVALUATION</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F4F1EA] tracking-tight">
            Investment Comparison Matrix
          </h1>
          <p className="text-xs text-[#A2A5AC] mt-0.5">
            Compare risk, fees, capital guarantees, and growth potential under identical assumptions.
          </p>
        </div>

        {/* Quick Category Selector Chips */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-[#171A20] border border-[#30343B] self-start sm:self-auto">
          {INVESTMENT_CATEGORIES.map((cat) => {
            const isSelected = comparedCategoryIds.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => {
                  sound.playClick();
                  toggleCompareCategory(cat.id);
                }}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all flex items-center space-x-1 ${
                  isSelected
                    ? 'bg-[#20242B] text-[#D5B477] border border-[#D5B477]/40 shadow-sm font-semibold'
                    : 'text-[#A2A5AC] hover:text-[#F4F1EA]'
                }`}
              >
                <span>{cat.name.split(' ')[0]}</span>
                {isSelected && <span className="text-[10px] text-[#D5B477]">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* SHARED COMPARISON INPUTS BAR */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#171A20] border border-[#30343B] space-y-4 shadow-card-depth">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#30343B]/60 pb-3">
          <div className="flex items-center space-x-2 text-[#D5B477]">
            <Sliders className="w-4 h-4" />
            <span className="font-mono text-xs uppercase font-bold tracking-wider">
              Shared Simulation Parameters (Consistent Assumptions)
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#A2A5AC]">
            Comparing {comparedList.length} Selected Category{comparedList.length > 1 ? 'ies' : ''} (Max 3)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Monthly Contribution */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#A2A5AC]">Monthly Investment</span>
              <span className="font-bold text-[#D5B477]">{formatINR(sharedMonthly)}/mo</span>
            </div>
            <input
              type="range"
              min="500"
              max="10000"
              step="250"
              value={sharedMonthly}
              onChange={(e) => setSharedMonthly(Number(e.target.value))}
              className="w-full accent-[#D5B477] bg-[#20242B] rounded-lg h-2 cursor-pointer"
            />
          </div>

          {/* Time Horizon */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#A2A5AC]">Time Horizon</span>
              <span className="font-bold text-[#F4F1EA]">{sharedYears} Years</span>
            </div>
            <div className="flex items-center space-x-1.5 pt-0.5">
              {[1, 3, 5, 10, 15].map((y) => (
                <button
                  key={y}
                  onClick={() => {
                    sound.playClick();
                    setSharedYears(y);
                  }}
                  className={`flex-1 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                    sharedYears === y
                      ? 'bg-[#D5B477] text-[#090A0C]'
                      : 'bg-[#101216] text-[#A2A5AC] hover:text-[#F4F1EA] border border-[#30343B]'
                  }`}
                >
                  {y}y
                </button>
              ))}
            </div>
          </div>

          {/* Inflation Rate */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#A2A5AC]">Inflation Benchmark</span>
              <span className="font-bold text-[#E27D78]">{(sharedInflation * 100).toFixed(1)}% p.a.</span>
            </div>
            <input
              type="range"
              min="0.04"
              max="0.08"
              step="0.005"
              value={sharedInflation}
              onChange={(e) => setSharedInflation(Number(e.target.value))}
              className="w-full accent-[#E27D78] bg-[#20242B] rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>

        {/* COMPARATIVE OUTPUT PREVIEWS (SIDE BY SIDE HERO METRICS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-3 border-t border-[#30343B]/60">
          {comparedList.map((cat) => {
            const res = calculateAdvancedProjection({
              initialLumpSum: 0,
              monthlyContribution: sharedMonthly,
              annualRate: cat.illustrativeReturnRate,
              years: sharedYears,
              annualInflation: sharedInflation,
            });

            return (
              <div key={cat.id} className="p-3.5 rounded-2xl bg-[#101216] border border-[#30343B] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#F4F1EA] truncate">{cat.name}</span>
                  <span className="text-[10px] font-mono font-bold text-[#8BC6A1]">
                    ~{(cat.illustrativeReturnRate * 100).toFixed(1)}% p.a.
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-[9px] font-mono text-[#A2A5AC] uppercase">Nominal FV</span>
                    <p className="font-mono font-bold text-sm text-[#8BC6A1]">{formatINR(res.nominalValue)}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] font-mono text-[#D5B477] uppercase">Real Value</span>
                    <p className="font-mono font-bold text-sm text-[#D5B477]">{formatINR(res.realPurchasingPower)}</p>
                  </div>
                </div>

                <div className="text-[10px] text-[#A2A5AC] flex justify-between pt-1 border-t border-[#30343B]/60 font-mono">
                  <span>Invested: {formatINR(res.totalContributed)}</span>
                  <span className={res.realPurchasingPower > res.totalContributed ? 'text-[#8BC6A1]' : 'text-[#E27D78]'}>
                    {res.realPurchasingPower > res.totalContributed ? 'Beats Inflation' : 'Loses Purchasing Power'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DYNAMIC TRADE-OFF ANALYSIS EXPLANATION BOX */}
      {generateTradeoffAnalysis() && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#20242B] to-[#171A20] border border-[#D5B477]/40 space-y-2 shadow-card-depth">
          <div className="flex items-center space-x-2 text-[#D5B477]">
            <Sparkles className="w-4 h-4" />
            <h3 className="font-mono text-xs uppercase font-bold tracking-wider">
              Objective Trade-Off Analysis (No Universal Winner)
            </h3>
          </div>
          {generateTradeoffAnalysis()}
        </div>
      )}

      {/* DESKTOP COMPARISON TABLE */}
      <div className="hidden md:block overflow-x-auto rounded-3xl border border-[#30343B] bg-[#101216] shadow-card-depth">
        <table className="w-full min-w-[700px] text-left border-collapse">
          <thead>
            <tr className="border-b border-[#30343B] bg-[#171A20]">
              <th className="p-4 w-1/4 text-xs font-mono text-[#A2A5AC] uppercase tracking-wider">
                Evaluation Criteria
              </th>
              {comparedList.map((col) => (
                <th key={col.id} className="p-4 text-sm font-display font-bold text-[#F4F1EA] border-l border-[#30343B]">
                  <div className="flex items-center justify-between">
                    <span>{col.name}</span>
                    <span className="text-[10px] font-mono text-[#D5B477]">
                      ~{(col.illustrativeReturnRate * 100).toFixed(1)}%
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#30343B]/60 text-xs">
            {rows.map((row) => (
              <tr key={row.key} className="hover:bg-[#171A20]/40 transition-colors">
                <td className="p-4 align-top font-medium text-[#F4F1EA] bg-[#14171E]/60">
                  <div className="flex items-center justify-between">
                    <span>{row.label}</span>
                    <button
                      onClick={() => {
                        sound.playClick();
                        setActiveExplainer(explainers[row.key]);
                      }}
                      className="p-1 rounded text-[#A2A5AC] hover:text-[#D5B477] hover:bg-[#20242B] transition-colors"
                      title="What does this mean?"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>

                {comparedList.map((col) => (
                  <td key={col.id} className="p-4 align-top text-[#A2A5AC] border-l border-[#30343B]/60 leading-relaxed">
                    {row.getValue(col)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE STACKED CARDS VIEW */}
      <div className="md:hidden space-y-5">
        {comparedList.map((cat) => (
          <div key={cat.id} className="p-5 rounded-3xl bg-[#171A20] border border-[#30343B] space-y-4 shadow-card-depth">
            <div className="flex items-center justify-between border-b border-[#30343B]/60 pb-3">
              <h3 className="font-display font-bold text-lg text-[#F4F1EA]">{cat.name}</h3>
              <span className="text-xs font-mono font-bold text-[#8BC6A1]">
                ~{(cat.illustrativeReturnRate * 100).toFixed(1)}% p.a.
              </span>
            </div>

            {rows.map((row) => (
              <div key={row.key} className="space-y-1 text-xs">
                <div className="flex items-center justify-between text-[#A2A5AC] font-mono text-[11px]">
                  <span>{row.label}</span>
                  <button
                    onClick={() => setActiveExplainer(explainers[row.key])}
                    className="text-[#D5B477] hover:underline flex items-center space-x-0.5"
                  >
                    <span>Explain</span>
                    <HelpCircle className="w-3 h-3" />
                  </button>
                </div>
                <div className="text-[#F4F1EA] leading-relaxed pt-0.5">
                  {row.getValue(cat)}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* WHAT DOES THIS MEAN? EXPLAINER MODAL */}
      {activeExplainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#171A20] border border-[#30343B] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#30343B]/60 pb-3">
              <div className="flex items-center space-x-2 text-[#D5B477]">
                <HelpCircle className="w-5 h-5 shrink-0" />
                <h3 className="font-display font-bold text-base text-[#F4F1EA]">
                  {activeExplainer.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveExplainer(null)}
                className="text-[#A2A5AC] hover:text-[#F4F1EA] p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div>
                <p className="font-mono text-[#A2A5AC] text-[10px] uppercase">Concept Explanation</p>
                <p className="text-[#F4F1EA] mt-1">{activeExplainer.explanation}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#20242B] border border-[#D5B477]/30">
                <p className="font-mono text-[#D5B477] text-[10px] uppercase font-bold">What This Means For Students</p>
                <p className="text-[#F4F1EA] mt-1">{activeExplainer.studentImplication}</p>
              </div>
            </div>

            <button
              onClick={() => setActiveExplainer(null)}
              className="w-full py-2.5 rounded-xl bg-[#20242B] hover:bg-[#2A2F3B] border border-[#30343B] text-xs font-semibold text-[#F4F1EA] transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="p-5 rounded-2xl bg-[#171A20] border border-[#30343B] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-[#F4F1EA]">Combine these in a tailored asset mix?</h4>
          <p className="text-xs text-[#A2A5AC]">Construct your custom allocation slider totaling 100% in Portfolio Builder.</p>
        </div>
        <button
          onClick={() => navigateTo('portfolio')}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#D5B477] to-[#E5C68A] text-[#090A0C] hover:shadow-subtle-glow transition-all flex items-center justify-center space-x-1.5"
        >
          <span>Build Portfolio Allocation</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
