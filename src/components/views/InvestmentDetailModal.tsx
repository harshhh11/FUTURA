import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/calculations';
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
  HelpCircle
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

  if (!selectedCategoryForDetail) return null;

  const item = selectedCategoryForDetail;
  const isCompared = comparedCategoryIds.includes(item.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-gradient-to-b from-[#1C2028] via-[#14171E] to-[#0D0F13] border border-[#30343B] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#30343B]/60 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                item.riskLevel === 'Very Low' || item.riskLevel === 'Low'
                  ? 'bg-[#8BC6A1]/10 text-[#8BC6A1] border-[#8BC6A1]/30'
                  : item.riskLevel === 'Moderate'
                  ? 'bg-[#D5B477]/10 text-[#D5B477] border-[#D5B477]/30'
                  : 'bg-[#E27D78]/10 text-[#E27D78] border-[#E27D78]/30'
              }`}>
                {item.riskLevel} Risk
              </span>
              <span className="text-[10px] font-mono text-[#A2A5AC]">
                Horizon: {item.planningHorizon.split('(')[0]}
              </span>
            </div>
            <h3 className="font-display text-2xl font-bold text-[#F4F1EA]">
              {item.name}
            </h3>
            <p className="text-xs text-[#A2A5AC]">{item.tagline}</p>
          </div>

          <button
            onClick={() => setSelectedCategoryForDetail(null)}
            className="p-1.5 rounded-lg text-[#A2A5AC] hover:text-[#F4F1EA] hover:bg-[#20242B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#F4F1EA] leading-relaxed">
          {/* What it is */}
          <div className="p-4 rounded-2xl bg-[#101216] border border-[#30343B] space-y-2">
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-[#D5B477]">
              What It Is (Plain Language)
            </h4>
            <p className="text-xs text-[#A2A5AC] leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* How Returns Work & Mechanics */}
          <div className="space-y-2">
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-[#A2A5AC]">
              How Returns & Value Changes Work
            </h4>
            <div className="p-3.5 rounded-xl bg-[#171A20] border border-[#30343B] flex items-start space-x-3">
              <TrendingUp className="w-4 h-4 text-[#8BC6A1] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[#F4F1EA]">{item.returnMechanism}</p>
                <p className="text-[11px] text-[#A2A5AC] mt-1">
                  Illustrative historical planning rate: <strong className="text-[#8BC6A1]">~{(item.illustrativeReturnRate * 100).toFixed(1)}% p.a.</strong> (Not guaranteed)
                </p>
              </div>
            </div>
          </div>

          {/* Student Worked Example with Aarav's ₹1,000/mo */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#20242B] to-[#171A20] border border-[#D5B477]/30 space-y-2">
            <div className="flex items-center space-x-2 text-[#D5B477]">
              <HelpCircle className="w-4 h-4" />
              <span className="font-bold text-xs">Aarav's Student Example</span>
            </div>
            <p className="text-xs text-[#F4F1EA]">
              {item.realWorldExample}
            </p>
            <p className="text-[10px] font-mono text-[#A2A5AC] pt-1 border-t border-[#30343B]/60">
              Historical Context: {item.historicalContext}
            </p>
          </div>

          {/* Pros and Cons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#101216] border border-[#30343B] space-y-2">
              <span className="text-[11px] font-mono font-semibold text-[#8BC6A1] flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Advantages</span>
              </span>
              <ul className="space-y-1.5 text-[11px] text-[#A2A5AC]">
                {item.pros.map((pro, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="text-[#8BC6A1]">•</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[#101216] border border-[#30343B] space-y-2">
              <span className="text-[11px] font-mono font-semibold text-[#E27D78] flex items-center space-x-1">
                <XCircle className="w-3.5 h-3.5" />
                <span>Trade-offs & Risks</span>
              </span>
              <ul className="space-y-1.5 text-[11px] text-[#A2A5AC]">
                {item.cons.map((con, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="text-[#E27D78]">•</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Access, Restrictions & Costs to check */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-[#171A20] border border-[#30343B] space-y-1">
              <div className="flex items-center space-x-1.5 text-[#A9B8C8]">
                <Clock className="w-3.5 h-3.5" />
                <span className="font-mono text-[10px] uppercase font-semibold">Liquidity & Access</span>
              </div>
              <p className="font-semibold text-xs text-[#F4F1EA]">{item.liquidity}</p>
              <p className="text-[11px] text-[#A2A5AC]">{item.withdrawalRestrictions}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#171A20] border border-[#30343B] space-y-1">
              <div className="flex items-center space-x-1.5 text-[#E27D78]">
                <Lock className="w-3.5 h-3.5" />
                <span className="font-mono text-[10px] uppercase font-semibold">Costs to Check</span>
              </div>
              <ul className="text-[11px] text-[#A2A5AC] list-disc list-inside">
                {item.costsToCheck.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-[#101216] border-t border-[#30343B]/60 flex items-center justify-between">
          <button
            onClick={() => toggleCompareCategory(item.id)}
            className={`px-4 py-2 rounded-xl text-xs font-medium border transition-colors ${
              isCompared
                ? 'bg-[#D5B477]/15 text-[#D5B477] border-[#D5B477]/40'
                : 'bg-[#171A20] text-[#A2A5AC] border-[#30343B] hover:text-[#F4F1EA]'
            }`}
          >
            {isCompared ? '✓ Added to Comparison' : '+ Add to Comparison'}
          </button>

          <button
            onClick={() => {
              setSelectedCategoryForDetail(null);
              navigateTo('comparison');
            }}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#20242B] hover:bg-[#2A2F3B] text-[#F4F1EA] border border-[#A9B8C8]/30 flex items-center space-x-1.5 transition-colors"
          >
            <span>Compare Side-by-Side</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
