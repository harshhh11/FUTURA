import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/calculations';
import { sound } from '../../utils/sound';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Lock, 
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { 
    isOnboardingOpen, 
    setIsOnboardingOpen, 
    userProfile, 
    updateUserProfile,
    navigateTo,
    addActivity,
    setHasCompletedOnboarding
  } = useApp();

  const [step, setStep] = useState<number>(1);
  const [goal, setGoal] = useState<string>(userProfile.goalName);
  const [customGoalText, setCustomGoalText] = useState<string>('');
  const [monthlyIncome, setMonthlyIncome] = useState<number>(userProfile.monthlyIncome);
  const [essentialExpenses, setEssentialExpenses] = useState<number>(userProfile.essentialExpenses);
  const [otherSpending, setOtherSpending] = useState<number>(userProfile.otherSpending);
  const [currentSavings, setCurrentSavings] = useState<number>(userProfile.currentSavings);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(userProfile.comfortableMonthlyContribution);
  const [riskTolerance, setRiskTolerance] = useState<'stability' | 'moderate' | 'growth'>(userProfile.riskTolerance);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOnboardingOpen) return null;

  const goalOptions = [
    { title: 'Build long-term wealth', desc: 'Patient compounding over 10-20 years into a million-rupee corpus.' },
    { title: 'Save for a major purchase', desc: 'Targeting a high-spec laptop, camera, or higher studies equipment in 1-3 years.' },
    { title: 'Education & Upskilling', desc: 'Certifications, study abroad buffer, or entrance prep courses.' },
    { title: 'Financial Independence', desc: 'Building passive reserves so you can take creative career risks without fear.' },
    { title: 'Custom Goal', desc: 'Define your own personal milestone and target.' }
  ];

  const calculatedAvailable = Math.max(0, monthlyIncome - essentialExpenses - otherSpending);
  const isOverAllocated = monthlyContribution > calculatedAvailable;

  const handleNext = () => {
    sound.playClick();
    setErrorMsg(null);

    if (step === 1) {
      if (goal === 'Custom Goal' && !customGoalText.trim()) {
        setErrorMsg('Please specify your custom goal name.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (monthlyIncome <= 0) {
        setErrorMsg('Monthly income must be greater than zero.');
        return;
      }
      if (isOverAllocated) {
        setErrorMsg(`Planned contribution (${formatINR(monthlyContribution)}) exceeds your available surplus (${formatINR(calculatedAvailable)}). Please adjust.`);
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handleBack = () => {
    sound.playClick();
    setErrorMsg(null);
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleFinish = () => {
    sound.playChime();
    const finalGoalName = goal === 'Custom Goal' ? customGoalText : goal;
    
    updateUserProfile({
      goalName: finalGoalName,
      monthlyIncome,
      essentialExpenses,
      otherSpending,
      currentSavings,
      comfortableMonthlyContribution: monthlyContribution,
      riskTolerance,
    });

    addActivity({
      title: `Plan Created: ${finalGoalName}`,
      type: 'goal_update',
      amount: monthlyContribution,
      details: `Initialized student budget: ${formatINR(monthlyIncome)} income, ${formatINR(monthlyContribution)}/month planned savings.`,
      badge: 'New Plan',
    });

    localStorage.setItem('futura_has_onboarded', 'true');
    setHasCompletedOnboarding(true);
    setIsOnboardingOpen(false);
    navigateTo('dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl bg-gradient-to-b from-[#1C2028] via-[#14171E] to-[#0D0F13] border border-[#30343B] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#30343B]/60 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-lg bg-[#D5B477]/15 border border-[#D5B477]/40 flex items-center justify-center text-xs font-bold text-[#D5B477]">
              {step}
            </span>
            <span className="text-xs font-mono tracking-wider text-[#A2A5AC] uppercase">
              Step {step} of 4 · First-Time Plan Builder
            </span>
          </div>
          <button 
            onClick={() => setIsOnboardingOpen(false)}
            className="p-1.5 rounded-lg text-[#A2A5AC] hover:text-[#F4F1EA] hover:bg-[#20242B] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-[#101216]">
          <div 
            className="h-full bg-gradient-to-r from-[#D5B477] to-[#E5C68A] transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-[#E27D78]/10 border border-[#E27D78]/40 flex items-start space-x-2 text-xs text-[#E27D78]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: CHOOSE A GOAL */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-display text-xl font-bold text-[#F4F1EA]">
                  What is your primary goal?
                </h3>
                <p className="text-xs text-[#A2A5AC] mt-1">
                  Every disciplined financial journey starts with a tangible reason to save.
                </p>
              </div>

              <div className="space-y-2.5">
                {goalOptions.map((opt) => (
                  <div
                    key={opt.title}
                    onClick={() => {
                      sound.playClick();
                      setGoal(opt.title);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                      goal === opt.title
                        ? 'bg-[#20242B] border-[#D5B477] shadow-sm'
                        : 'bg-[#171A20] border-[#30343B] hover:border-[#A9B8C8]/40'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                      goal === opt.title ? 'border-[#D5B477] bg-[#D5B477]' : 'border-[#A2A5AC]'
                    }`}>
                      {goal === opt.title && <div className="w-1.5 h-1.5 rounded-full bg-[#090A0C]" />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#F4F1EA]">{opt.title}</p>
                      <p className="text-[11px] text-[#A2A5AC] mt-0.5">{opt.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {goal === 'Custom Goal' && (
                <div className="mt-3">
                  <label className="text-[11px] text-[#A2A5AC] font-mono">Custom Goal Name</label>
                  <input
                    type="text"
                    value={customGoalText}
                    onChange={(e) => setCustomGoalText(e.target.value)}
                    placeholder="e.g. Build ₹5 Lakhs by Graduation"
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-[#101216] border border-[#30343B] text-xs text-[#F4F1EA] focus:border-[#D5B477] outline-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 2: ENTER YOUR STARTING POINT */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-display text-xl font-bold text-[#F4F1EA]">
                  Enter your starting point
                </h3>
                <p className="text-xs text-[#A2A5AC] mt-1">
                  Pre-filled with Aarav’s student numbers (₹8,000/mo) as an example. Edit to reflect your real cash flow.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-[#A2A5AC]">Monthly Income (Stipend / Pocket)</label>
                  <div className="mt-1 relative">
                    <span className="absolute left-3 top-2.5 text-[#A2A5AC]">₹</span>
                    <input
                      type="number"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(Math.max(0, Number(e.target.value)))}
                      className="w-full pl-7 pr-3 py-2 rounded-xl bg-[#101216] border border-[#30343B] text-xs text-[#F4F1EA] font-mono focus:border-[#D5B477] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-[#A2A5AC]">Essential Expenses (Canteen, Commute)</label>
                  <div className="mt-1 relative">
                    <span className="absolute left-3 top-2.5 text-[#A2A5AC]">₹</span>
                    <input
                      type="number"
                      value={essentialExpenses}
                      onChange={(e) => setEssentialExpenses(Math.max(0, Number(e.target.value)))}
                      className="w-full pl-7 pr-3 py-2 rounded-xl bg-[#101216] border border-[#30343B] text-xs text-[#F4F1EA] font-mono focus:border-[#D5B477] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-[#A2A5AC]">Other Planned Spending (Weekend Fun)</label>
                  <div className="mt-1 relative">
                    <span className="absolute left-3 top-2.5 text-[#A2A5AC]">₹</span>
                    <input
                      type="number"
                      value={otherSpending}
                      onChange={(e) => setOtherSpending(Math.max(0, Number(e.target.value)))}
                      className="w-full pl-7 pr-3 py-2 rounded-xl bg-[#101216] border border-[#30343B] text-xs text-[#F4F1EA] font-mono focus:border-[#D5B477] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-[#A2A5AC]">Current Savings (Bank Balance)</label>
                  <div className="mt-1 relative">
                    <span className="absolute left-3 top-2.5 text-[#A2A5AC]">₹</span>
                    <input
                      type="number"
                      value={currentSavings}
                      onChange={(e) => setCurrentSavings(Math.max(0, Number(e.target.value)))}
                      className="w-full pl-7 pr-3 py-2 rounded-xl bg-[#101216] border border-[#30343B] text-xs text-[#F4F1EA] font-mono focus:border-[#D5B477] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Calculated Available Callout */}
              <div className="p-3.5 rounded-2xl bg-[#101216] border border-[#30343B] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#A2A5AC]">Monthly Available Surplus:</span>
                  <p className="text-[10px] text-[#A2A5AC]/70">Income minus essentials & spending</p>
                </div>
                <span className="font-mono text-sm font-bold text-[#8BC6A1]">
                  {formatINR(calculatedAvailable)}
                </span>
              </div>

              {/* Monthly Contribution Input */}
              <div className="pt-1">
                <label className="text-[11px] text-[#D5B477] font-semibold">
                  Comfortable Monthly Contribution (Planned Savings)
                </label>
                <div className="mt-1 relative">
                  <span className="absolute left-3 top-2.5 text-[#D5B477]">₹</span>
                  <input
                    type="number"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-[#20242B] border border-[#D5B477]/50 text-xs text-[#F4F1EA] font-mono focus:border-[#D5B477] outline-none"
                  />
                </div>
                <p className="text-[10px] text-[#A2A5AC] mt-1">
                  Tip: Leave a cushion! Don't commit 100% of your surplus so unexpected costs won't break your plan.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: COMFORT WITH UNCERTAINTY */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-display text-xl font-bold text-[#F4F1EA]">
                  Comfort with uncertainty
                </h3>
                <p className="text-xs text-[#A2A5AC] mt-1">
                  How would you react if your investments temporarily drop 15% due to an economic slowdown?
                </p>
              </div>

              <div className="space-y-3">
                <div
                  onClick={() => {
                    sound.playClick();
                    setRiskTolerance('stability');
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    riskTolerance === 'stability'
                      ? 'bg-[#20242B] border-[#8BC6A1] shadow-sm'
                      : 'bg-[#171A20] border-[#30343B] hover:border-[#A9B8C8]/40'
                  }`}
                >
                  <div className="flex items-center space-x-2 text-[#8BC6A1] mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-xs font-semibold">Prefer Stability</span>
                  </div>
                  <p className="text-xs text-[#F4F1EA]">
                    I want guaranteed returns like FDs and government bonds. I get anxious when balances fluctuate.
                  </p>
                  <p className="text-[10px] text-[#A2A5AC] mt-1 font-mono">
                    Typical illustrative return: ~6.5% · Zero market swings
                  </p>
                </div>

                <div
                  onClick={() => {
                    sound.playClick();
                    setRiskTolerance('moderate');
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    riskTolerance === 'moderate'
                      ? 'bg-[#20242B] border-[#D5B477] shadow-sm'
                      : 'bg-[#171A20] border-[#30343B] hover:border-[#A9B8C8]/40'
                  }`}
                >
                  <div className="flex items-center space-x-2 text-[#D5B477] mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-semibold">Comfortable with some fluctuations</span>
                  </div>
                  <p className="text-xs text-[#F4F1EA]">
                    A balanced blend: some safe FDs and gold, paired with low-cost index funds for long-term growth.
                  </p>
                  <p className="text-[10px] text-[#A2A5AC] mt-1 font-mono">
                    Typical illustrative return: ~9.5% – 10.5% · Moderate volatility
                  </p>
                </div>

                <div
                  onClick={() => {
                    sound.playClick();
                    setRiskTolerance('growth');
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    riskTolerance === 'growth'
                      ? 'bg-[#20242B] border-[#A9B8C8] shadow-sm'
                      : 'bg-[#171A20] border-[#30343B] hover:border-[#A9B8C8]/40'
                  }`}
                >
                  <div className="flex items-center space-x-2 text-[#A9B8C8] mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-semibold">Understand that investments can fall significantly</span>
                  </div>
                  <p className="text-xs text-[#F4F1EA]">
                    I have a 10+ year student horizon. I embrace temporary market drops to achieve highest compounding.
                  </p>
                  <p className="text-[10px] text-[#A2A5AC] mt-1 font-mono">
                    Typical illustrative return: ~12% – 13% · High volatility
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & CREATE MY PLAN */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-display text-xl font-bold text-[#F4F1EA]">
                  Plan Summary & Review
                </h3>
                <p className="text-xs text-[#A2A5AC] mt-1">
                  Verify your baseline parameters before launching your personalized dashboard.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#101216] border border-[#30343B] space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#30343B]/60">
                  <span className="text-[#A2A5AC]">Primary Milestone:</span>
                  <span className="font-semibold text-[#F4F1EA]">{goal === 'Custom Goal' ? customGoalText : goal}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-[#30343B]/60">
                  <span className="text-[#A2A5AC]">Monthly Income:</span>
                  <span className="font-mono text-[#F4F1EA]">{formatINR(monthlyIncome)}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-[#30343B]/60">
                  <span className="text-[#A2A5AC]">Living Costs (Essentials + Fun):</span>
                  <span className="font-mono text-[#F4F1EA]">{formatINR(essentialExpenses + otherSpending)}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-[#30343B]/60">
                  <span className="text-[#A2A5AC]">Available Cash Surplus:</span>
                  <span className="font-mono text-[#8BC6A1]">{formatINR(calculatedAvailable)}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-[#30343B]/60">
                  <span className="text-[#D5B477] font-semibold">Proposed Monthly Contribution:</span>
                  <span className="font-mono font-bold text-[#D5B477]">{formatINR(monthlyContribution)}/mo</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#A2A5AC]">Remaining Cushion:</span>
                  <span className="font-mono text-[#A9B8C8]">{formatINR(calculatedAvailable - monthlyContribution)}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#20242B]/70 border border-[#30343B] flex items-start space-x-2 text-[11px] text-[#A2A5AC]">
                <HelpCircle className="w-4 h-4 text-[#D5B477] shrink-0 mt-0.5" />
                <span>
                  You can edit any of these values anytime inside MoneyFlow or Profile Settings. All projections are educational simulations.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-[#101216] border-t border-[#30343B]/60 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#A2A5AC] hover:text-[#F4F1EA] hover:bg-[#171A20] transition-colors flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#20242B] hover:bg-[#2A2F3B] text-[#F4F1EA] border border-[#A9B8C8]/30 transition-all flex items-center space-x-1.5"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#D5B477] to-[#E5C68A] text-[#090A0C] hover:shadow-subtle-glow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create My Plan</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
