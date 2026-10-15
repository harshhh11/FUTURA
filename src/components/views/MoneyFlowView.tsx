import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/calculations';
import { sound } from '../../utils/sound';
import { 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Shield, 
  Save 
} from 'lucide-react';

export const MoneyFlowView: React.FC = () => {
  const { 
    userProfile, 
    updateUserProfile, 
    moneyFlowScenario, 
    setMoneyFlowScenario, 
    addActivity 
  } = useApp();

  const [income, setIncome] = useState<number>(userProfile.monthlyIncome);
  const [essentials, setEssentials] = useState<number>(userProfile.essentialExpenses);
  const [otherSpending, setOtherSpending] = useState<number>(userProfile.otherSpending);
  const [contribution, setContribution] = useState<number>(userProfile.comfortableMonthlyContribution);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSelectScenario = (scenario: 'lower' | 'typical' | 'higher') => {
    sound.playClick();
    setMoneyFlowScenario(scenario);
    if (scenario === 'lower') {
      setIncome(6500);
      setEssentials(4000);
      setOtherSpending(1500);
      setContribution(500);
    } else if (scenario === 'typical') {
      setIncome(8000);
      setEssentials(4500);
      setOtherSpending(2500);
      setContribution(1000);
    } else if (scenario === 'higher') {
      setIncome(11500);
      setEssentials(4200);
      setOtherSpending(2500);
      setContribution(2000);
    }
  };

  const availableAmount = Math.max(0, income - essentials - otherSpending);
  const remainingAfterContribution = availableAmount - contribution;
  const isDeficit = remainingAfterContribution < 0;
  const isZeroCushion = remainingAfterContribution === 0;

  const essentialsPct = income > 0 ? (essentials / income) * 100 : 0;
  const otherPct = income > 0 ? (otherSpending / income) * 100 : 0;
  const contributionPct = income > 0 ? (contribution / income) * 100 : 0;
  const bufferPct = income > 0 ? Math.max(0, (remainingAfterContribution / income) * 100) : 0;

  const handleSavePlan = () => {
    sound.playChime();
    updateUserProfile({
      monthlyIncome: income,
      essentialExpenses: essentials,
      otherSpending: otherSpending,
      comfortableMonthlyContribution: contribution,
    });
    setSavedSuccess(true);
    addActivity({
      title: 'MoneyFlow Plan Updated',
      type: 'contribution',
      amount: contribution,
      details: `Saved monthly plan: ${formatINR(income)} income, ${formatINR(contribution)}/mo contribution, ${formatINR(remainingAfterContribution)} buffer.`,
      badge: 'Budget Updated',
    });
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn pb-12 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#A2A5AC] uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5 text-[#D5B477]" />
            <span>BUDGET ALLOCATION ENGINE</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F4F1EA] tracking-tight">
            Smart MoneyFlow
          </h1>
          <p className="text-xs text-[#A2A5AC] mt-0.5">
            Allocate money you can truly afford to set aside without squeezing your daily student life.
          </p>
        </div>

        {/* 3 Interactive Scenario Presets with wrap prevention */}
        <div className="flex flex-wrap items-center p-1 rounded-2xl bg-[#171A20] border border-[#30343B] gap-1 self-start sm:self-auto">
          <button
            onClick={() => handleSelectScenario('lower')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              moneyFlowScenario === 'lower'
                ? 'bg-[#20242B] text-[#F4F1EA] font-semibold border border-[#30343B]'
                : 'text-[#A2A5AC] hover:text-[#F4F1EA]'
            }`}
          >
            Lower (₹6.5k)
          </button>
          <button
            onClick={() => handleSelectScenario('typical')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              moneyFlowScenario === 'typical'
                ? 'bg-[#D5B477] text-[#090A0C] font-bold shadow-sm'
                : 'text-[#A2A5AC] hover:text-[#F4F1EA]'
            }`}
          >
            Typical (₹8k)
          </button>
          <button
            onClick={() => handleSelectScenario('higher')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              moneyFlowScenario === 'higher'
                ? 'bg-[#20242B] text-[#F4F1EA] font-semibold border border-[#30343B]'
                : 'text-[#A2A5AC] hover:text-[#F4F1EA]'
            }`}
          >
            Higher (₹11.5k)
          </button>
        </div>
      </div>

      {/* OVER-ALLOCATION WARNING (Section 8) */}
      {isDeficit && (
        <div className="p-4 rounded-2xl bg-[#E27D78]/15 border border-[#E27D78] flex items-start space-x-3 text-xs text-[#E27D78] shadow-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm">Planned Contribution Exceeds Available Surplus</h4>
            <p className="leading-relaxed">
              You planned to contribute <strong>{formatINR(contribution)}</strong>, but only have <strong>{formatINR(availableAmount)}</strong> left after expenses. This creates a monthly deficit of <strong>{formatINR(Math.abs(remainingAfterContribution))}</strong>.
            </p>
            <button
              onClick={() => {
                sound.playClick();
                setContribution(Math.max(0, availableAmount - 500));
              }}
              className="mt-2 px-3 py-1 rounded-lg bg-[#E27D78] text-[#090A0C] font-semibold text-[11px] hover:bg-[#E27D78]/90 transition-colors"
            >
              Adjust to Safe Contribution ({formatINR(Math.max(0, availableAmount - 500))})
            </button>
          </div>
        </div>
      )}

      {/* ZERO CUSHION ADVISORY */}
      {isZeroCushion && !isDeficit && (
        <div className="p-3.5 rounded-2xl bg-[#D5B477]/10 border border-[#D5B477]/40 flex items-start space-x-2.5 text-xs text-[#D5B477]">
          <Shield className="w-4 h-4 shrink-0 mt-0.5" />
          <p>
            <strong>Caution:</strong> You are investing 100% of your remaining surplus with zero cushion. We recommend leaving at least ₹500 uncommitted so unexpected costs won't derail you.
          </p>
        </div>
      )}

      {/* INTERACTIVE ALLOCATION VISUALIZATION BAR */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#20242B] to-[#171A20] border border-[#30343B] shadow-card-depth space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
          <span className="font-mono text-[#A2A5AC] uppercase">MONTHLY CASH FLOW DISTRIBUTION</span>
          <span className="font-mono font-bold text-[#F4F1EA]">{formatINR(income)} Total Income</span>
        </div>

        {/* Visual Multi-segment Flow Bar */}
        <div className="h-6 w-full rounded-xl bg-[#090A0C] p-1 border border-[#30343B] flex overflow-hidden">
          <div 
            style={{ width: `${Math.min(100, essentialsPct)}%` }}
            className="h-full bg-[#A9B8C8]/60 hover:bg-[#A9B8C8] transition-all rounded-l-md"
            title={`Essentials: ${formatINR(essentials)} (${essentialsPct.toFixed(0)}%)`}
          />
          <div 
            style={{ width: `${Math.min(100 - essentialsPct, otherPct)}%` }}
            className="h-full bg-[#A2A5AC]/40 hover:bg-[#A2A5AC] transition-all"
            title={`Other Spending: ${formatINR(otherSpending)} (${otherPct.toFixed(0)}%)`}
          />
          <div 
            style={{ width: `${Math.min(100 - essentialsPct - otherPct, contributionPct)}%` }}
            className={`h-full transition-all ${
              isDeficit ? 'bg-[#E27D78]' : 'bg-[#D5B477] hover:bg-[#E5C68A]'
            }`}
            title={`Planned Contribution: ${formatINR(contribution)} (${contributionPct.toFixed(0)}%)`}
          />
          <div 
            style={{ width: `${Math.max(0, bufferPct)}%` }}
            className="h-full bg-[#8BC6A1]/60 hover:bg-[#8BC6A1] transition-all rounded-r-md"
            title={`Remaining Buffer: ${formatINR(remainingAfterContribution)} (${bufferPct.toFixed(0)}%)`}
          />
        </div>

        {/* Legend with responsive grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-[11px] font-mono">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded bg-[#A9B8C8]/60 shrink-0" />
            <span className="text-[#A2A5AC] truncate">Essentials: {formatINR(essentials)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded bg-[#A2A5AC]/40 shrink-0" />
            <span className="text-[#A2A5AC] truncate">Discretionary: {formatINR(otherSpending)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2.5 h-2.5 rounded shrink-0 ${isDeficit ? 'bg-[#E27D78]' : 'bg-[#D5B477]'}`} />
            <span className={`truncate ${isDeficit ? 'text-[#E27D78] font-bold' : 'text-[#D5B477]'}`}>
              Invested: {formatINR(contribution)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded bg-[#8BC6A1]/60 shrink-0" />
            <span className="text-[#8BC6A1] truncate">Buffer: {formatINR(Math.max(0, remainingAfterContribution))}</span>
          </div>
        </div>
      </div>

      {/* EDITABLE INPUTS & SLIDERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* Income & Essentials Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#171A20] border border-[#30343B] space-y-4">
          <h3 className="font-display text-base font-bold text-[#F4F1EA]">
            Monthly Inflow & Essentials
          </h3>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <label className="text-[#A2A5AC]">Monthly Income</label>
              <span className="font-mono font-bold text-[#F4F1EA]">{formatINR(income)}</span>
            </div>
            <input
              type="range"
              min="3000"
              max="25000"
              step="500"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="w-full accent-[#D5B477] bg-[#101216] rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <label className="text-[#A2A5AC]">Essential Living Costs (Canteen, Commute)</label>
              <span className="font-mono font-bold text-[#A9B8C8]">{formatINR(essentials)}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="15000"
              step="200"
              value={essentials}
              onChange={(e) => setEssentials(Number(e.target.value))}
              className="w-full accent-[#A9B8C8] bg-[#101216] rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <label className="text-[#A2A5AC]">Other Planned Spending (Fun, Outings)</label>
              <span className="font-mono font-bold text-[#A2A5AC]">{formatINR(otherSpending)}</span>
            </div>
            <input
              type="range"
              min="500"
              max="10000"
              step="200"
              value={otherSpending}
              onChange={(e) => setOtherSpending(Number(e.target.value))}
              className="w-full accent-[#A2A5AC] bg-[#101216] rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>

        {/* Planned Contribution & Surplus Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#171A20] border border-[#30343B] space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-[#F4F1EA] mb-3">
              Surplus & Planned Contribution
            </h3>

            <div className="p-3.5 rounded-xl bg-[#101216] border border-[#30343B] mb-4 flex items-center justify-between text-xs">
              <div>
                <span className="text-[#A2A5AC]">Available Cash Surplus:</span>
                <p className="text-[10px] text-[#A2A5AC]/70">Income − Essentials − Other</p>
              </div>
              <span className="font-mono text-base font-bold text-[#8BC6A1]">
                {formatINR(availableAmount)}
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label className="text-[#D5B477] font-semibold">Planned Savings Contribution</label>
                <span className="font-mono font-bold text-[#D5B477]">{formatINR(contribution)}/mo</span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.max(5000, availableAmount * 1.5)}
                step="100"
                value={contribution}
                onChange={(e) => setContribution(Number(e.target.value))}
                className="w-full accent-[#D5B477] bg-[#101216] rounded-lg h-2 cursor-pointer"
              />
            </div>

            <div className="mt-4 pt-3 border-t border-[#30343B]/60 flex items-center justify-between text-xs">
              <span className="text-[#A2A5AC]">Remaining Monthly Cushion:</span>
              <span className={`font-mono font-bold ${isDeficit ? 'text-[#E27D78]' : 'text-[#8BC6A1]'}`}>
                {formatINR(remainingAfterContribution)}
              </span>
            </div>
          </div>

          <button
            onClick={handleSavePlan}
            disabled={isDeficit}
            className={`w-full py-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
              isDeficit
                ? 'bg-[#20242B] text-[#A2A5AC] cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-[#D5B477] to-[#E5C68A] text-[#090A0C] hover:shadow-subtle-glow font-bold'
            }`}
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#090A0C]" />
                <span>Baseline Plan Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save to Baseline Plan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
