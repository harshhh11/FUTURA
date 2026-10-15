import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INVESTMENT_CATEGORIES } from '../../data/investmentsData';
import { InvestmentCategory } from '../../types/finance';
import { sound } from '../../utils/sound';
import { 
  Scale, 
  HelpCircle, 
  ArrowRight
} from 'lucide-react';

interface TradeOffExplainModal {
  title: string;
  explanation: string;
  studentImplication: string;
}

export const ComparisonView: React.FC = () => {
  const { comparedCategoryIds, toggleCompareCategory, navigateTo } = useApp();
  const [activeExplainer, setActiveExplainer] = useState<TradeOffExplainModal | null>(null);

  const comparedList = INVESTMENT_CATEGORIES.filter(c => comparedCategoryIds.includes(c.id));

  const explainers: Record<string, TradeOffExplainModal> = {
    'how_it_works': {
      title: 'How It Works & Underlying Structure',
      explanation: 'Defines whether you are lending money to an institution for interest (debt/FD) or buying actual fractional ownership of cash-generating companies (equity/index).',
      studentImplication: 'Lending provides predictable returns. Ownership provides potential to beat inflation over decades.',
    },
    'value_drivers': {
      title: 'What Can Change Its Value',
      explanation: 'The economic forces that push the price up or down: interest rates, corporate profit growth, inflation, or market sentiment.',
      studentImplication: 'Bank interest is fixed by contract. Index fund values fluctuate second-by-second based on company earnings.',
    },
    'possible_risks': {
      title: 'Possible Risks & Downside Scenarios',
      explanation: 'Risk is not just losing money in a crash; inflation silently reducing your purchasing power is also a major risk.',
      studentImplication: 'FDs risk losing real purchasing power to inflation. Equities risk short-term emotional panic during temporary crashes.',
    },
    'access_to_money': {
      title: 'Access to Money (Liquidity)',
      explanation: 'How quickly you can convert this asset back into spendable rupees in your bank account when an emergency arrives.',
      studentImplication: 'Savings accounts are instant UPI. FDs take breakage penalties. Index funds take 1 to 3 business days.',
    },
    'fees_and_costs': {
      title: 'Fees, Expense Ratios & Penalties',
      explanation: 'Ongoing management fees and exit penalties that eat into your compounded profits over the years.',
      studentImplication: 'Keep fees under 0.2% where possible. A 1.5% fee on active funds eats up over ₹1.5 Lakhs over a 20-year student horizon.',
    },
    'return_uncertainty': {
      title: 'Return Uncertainty & Volatility',
      explanation: 'The degree of predictability in what your money will be worth when your planned target year arrives.',
      studentImplication: 'Never put money needed for next month’s college fee into uncertain assets.',
    },
    'time_horizon': {
      title: 'Recommended Time Horizon',
      explanation: 'The minimum number of years you should hold the asset to comfortably absorb market cycles and let compounding work.',
      studentImplication: 'Give equities at least 5 to 7 years so temporary bad years have plenty of time to fully recover.',
    }
  };

  const rows = [
    {
      key: 'how_it_works',
      label: 'How It Works',
      getValue: (c: InvestmentCategory) => c.description,
    },
    {
      key: 'value_drivers',
      label: 'Value Drivers',
      getValue: (c: InvestmentCategory) => c.returnMechanism,
    },
    {
      key: 'possible_risks',
      label: 'Possible Risks',
      getValue: (c: InvestmentCategory) => (
        <ul className="space-y-1 text-[11px] text-[#A2A5AC]">
          {c.cons.map((con, idx) => (
            <li key={idx} className="flex items-start space-x-1.5">
              <span className="text-[#E27D78] shrink-0">•</span>
              <span>{con}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      key: 'access_to_money',
      label: 'Access to Money',
      getValue: (c: InvestmentCategory) => (
        <div>
          <p className="font-semibold text-[#F4F1EA]">{c.liquidity}</p>
          <p className="text-[10px] text-[#A2A5AC] mt-0.5">{c.withdrawalRestrictions}</p>
        </div>
      ),
    },
    {
      key: 'fees_and_costs',
      label: 'Fees & Costs',
      getValue: (c: InvestmentCategory) => (
        <ul className="text-[11px] text-[#A2A5AC] space-y-0.5">
          {c.costsToCheck.map((cost, idx) => (
            <li key={idx}>• {cost}</li>
          ))}
        </ul>
      ),
    },
    {
      key: 'return_uncertainty',
      label: 'Return Uncertainty',
      getValue: (c: InvestmentCategory) => (
        <div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
            c.riskLevel === 'Very Low' || c.riskLevel === 'Low'
              ? 'bg-[#8BC6A1]/10 text-[#8BC6A1] border-[#8BC6A1]/30'
              : c.riskLevel === 'Moderate'
              ? 'bg-[#D5B477]/10 text-[#D5B477] border-[#D5B477]/30'
              : 'bg-[#E27D78]/10 text-[#E27D78] border-[#E27D78]/30'
          }`}>
            {c.riskLevel} Volatility
          </span>
          <p className="text-[10px] text-[#A2A5AC] mt-1.5">
            Illustrative: ~{(c.illustrativeReturnRate * 100).toFixed(1)}% p.a.
          </p>
        </div>
      ),
    },
    {
      key: 'time_horizon',
      label: 'Planning Horizon',
      getValue: (c: InvestmentCategory) => (
        <div className="font-mono text-xs text-[#F4F1EA]">
          {c.planningHorizon}
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn pb-12 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#A2A5AC] uppercase tracking-wider mb-1">
            <Scale className="w-3.5 h-3.5 text-[#D5B477]" />
            <span>TRADE-OFF MATRIX</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F4F1EA] tracking-tight">
            Side-by-Side Investment Comparison
          </h1>
          <p className="text-xs text-[#A2A5AC] mt-0.5">
            Compare risk, fees, liquidity, and value mechanics across {comparedList.length} categories.
          </p>
        </div>

        {/* Category Picker pills with wrapping */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-[#171A20] border border-[#30343B] self-start sm:self-auto">
          {INVESTMENT_CATEGORIES.map((cat) => {
            const isSelected = comparedCategoryIds.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggleCompareCategory(cat.id)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all flex items-center space-x-1 ${
                  isSelected
                    ? 'bg-[#20242B] text-[#D5B477] border border-[#D5B477]/40 shadow-sm font-semibold'
                    : 'text-[#A2A5AC] hover:text-[#F4F1EA]'
                }`}
              >
                <span>{cat.name.split(' ')[0]}</span>
                {isSelected && <span className="text-[10px]">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

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
                <p className="font-mono text-[#D5B477] text-[10px] uppercase font-bold">What This Means For Aarav</p>
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
          <h4 className="text-sm font-bold text-[#F4F1EA]">Ready to design your asset mix?</h4>
          <p className="text-xs text-[#A2A5AC]">Build an allocation slider totaling 100% based on your ₹1,000 monthly plan.</p>
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
