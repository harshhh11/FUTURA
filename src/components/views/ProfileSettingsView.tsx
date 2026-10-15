import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/calculations';
import { sound } from '../../utils/sound';
import { 
  Settings, 
  User, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Target, 
  Layers,
  Save,
  Moon
} from 'lucide-react';

export const ProfileSettingsView: React.FC = () => {
  const { 
    userProfile, 
    updateUserProfile, 
    resetToDefaults, 
    soundEnabled, 
    setSoundEnabled, 
    reducedMotion, 
    setReducedMotion,
    highContrast,
    setHighContrast,
    compactMode,
    setCompactMode,
    addActivity 
  } = useApp();

  const [name, setName] = useState<string>(userProfile.name);
  const [goalName, setGoalName] = useState<string>(userProfile.goalName);
  const [targetAmount, setTargetAmount] = useState<number>(userProfile.goalTargetAmount);
  const [income, setIncome] = useState<number>(userProfile.monthlyIncome);
  const [essentials, setEssentials] = useState<number>(userProfile.essentialExpenses);
  const [otherSpending, setOtherSpending] = useState<number>(userProfile.otherSpending);
  const [contribution, setContribution] = useState<number>(userProfile.comfortableMonthlyContribution);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSaveProfile = () => {
    sound.playChime();
    updateUserProfile({
      name,
      goalName,
      goalTargetAmount: targetAmount,
      monthlyIncome: income,
      essentialExpenses: essentials,
      otherSpending,
      comfortableMonthlyContribution: contribution,
    });
    setSavedSuccess(true);
    addActivity({
      title: 'Profile & Parameters Updated',
      type: 'goal_update',
      details: 'Updated student profile baseline and financial limits in Settings.',
      badge: 'Settings Saved',
    });
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#A2A5AC] uppercase tracking-wider mb-1">
            <Settings className="w-3.5 h-3.5 text-[#D5B477]" />
            <span>CUSTOMIZATION & BASELINE PREFERENCES</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F4F1EA]">
            Profile & Settings
          </h1>
          <p className="text-xs text-[#A2A5AC] mt-0.5">
            Manage your student baseline, accessibility toggles, and reset to initial sample data anytime.
          </p>
        </div>

        {/* Reset to Aarav Defaults Button */}
        <button
          onClick={() => {
            if (confirm('Reset all financial numbers, saved allocations, and activities back to Aarav\'s defaults?')) {
              resetToDefaults();
            }
          }}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl text-xs font-medium bg-[#171A20] hover:bg-[#20242B] border border-[#E27D78]/40 text-[#E27D78] transition-colors flex items-center space-x-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Data</span>
        </button>
      </div>

      {/* STUDENT PROFILE & GOAL EDITOR */}
      <div className="p-6 rounded-3xl bg-[#171A20] border border-[#30343B] space-y-5 shadow-card-depth">
        <div className="flex items-center space-x-2 border-b border-[#30343B]/60 pb-3">
          <User className="w-4 h-4 text-[#D5B477]" />
          <h3 className="font-display font-bold text-base text-[#F4F1EA]">
            Student Profile & Goal Parameters
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-[#A2A5AC]">User / Student Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-[#101216] border border-[#30343B] text-xs text-[#F4F1EA] focus:border-[#D5B477] outline-none"
            />
          </div>

          <div>
            <label className="text-[#A2A5AC]">Primary Milestone Goal Name</label>
            <input
              type="text"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-[#101216] border border-[#30343B] text-xs text-[#F4F1EA] focus:border-[#D5B477] outline-none"
            />
          </div>

          <div>
            <label className="text-[#A2A5AC]">Target Goal Amount (₹)</label>
            <input
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(Number(e.target.value))}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-[#101216] border border-[#30343B] text-xs text-[#F4F1EA] font-mono focus:border-[#D5B477] outline-none"
            />
          </div>

          <div>
            <label className="text-[#D5B477] font-semibold">Planned Monthly Contribution (₹)</label>
            <input
              type="number"
              value={contribution}
              onChange={(e) => setContribution(Number(e.target.value))}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-[#20242B] border border-[#D5B477]/50 text-xs text-[#F4F1EA] font-mono focus:border-[#D5B477] outline-none"
            />
          </div>
        </div>

        {/* Income and Expenses */}
        <div className="pt-2 border-t border-[#30343B]/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-[#A2A5AC]">Monthly Income</label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-[#101216] border border-[#30343B] text-xs text-[#F4F1EA] font-mono focus:border-[#D5B477] outline-none"
            />
          </div>

          <div>
            <label className="text-[#A2A5AC]">Essential Expenses</label>
            <input
              type="number"
              value={essentials}
              onChange={(e) => setEssentials(Number(e.target.value))}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-[#101216] border border-[#30343B] text-xs text-[#F4F1EA] font-mono focus:border-[#D5B477] outline-none"
            />
          </div>

          <div>
            <label className="text-[#A2A5AC]">Discretionary Spending</label>
            <input
              type="number"
              value={otherSpending}
              onChange={(e) => setOtherSpending(Number(e.target.value))}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-[#101216] border border-[#30343B] text-xs text-[#F4F1EA] font-mono focus:border-[#D5B477] outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleSaveProfile}
          className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#D5B477] to-[#E5C68A] text-[#090A0C] hover:shadow-subtle-glow transition-all flex items-center space-x-1.5"
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-[#090A0C]" />
              <span>Saved Successfully!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Profile Updates</span>
            </>
          )}
        </button>
      </div>

      {/* ACCESSIBILITY & EXPERIENCE CONTROLS (Mandated by Section 17) */}
      <div className="p-6 rounded-3xl bg-[#171A20] border border-[#30343B] space-y-5 shadow-card-depth">
        <div className="flex items-center space-x-2 border-b border-[#30343B]/60 pb-3">
          <Eye className="w-4 h-4 text-[#8BC6A1]" />
          <h3 className="font-display font-bold text-base text-[#F4F1EA]">
            Accessibility & Visual Preferences
          </h3>
        </div>

        <div className="space-y-4 text-xs">
          {/* Reduced Motion Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#101216] border border-[#30343B]">
            <div>
              <p className="font-semibold text-[#F4F1EA]">Disable Nonessential Animations (Reduced Motion)</p>
              <p className="text-[11px] text-[#A2A5AC] mt-0.5">
                Stops floating 3D phone animations and smooth chart reveals for vestibular comfort.
              </p>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                setReducedMotion(!reducedMotion);
              }}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                reducedMotion ? 'bg-[#D5B477]' : 'bg-[#20242B]'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                reducedMotion ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Tactile Audio Feedback Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#101216] border border-[#30343B]">
            <div>
              <p className="font-semibold text-[#F4F1EA]">Tactile Web Audio Click Feedback</p>
              <p className="text-[11px] text-[#A2A5AC] mt-0.5">
                Subtle mechanical clicks and chimes when toggling scenarios and calculations.
              </p>
            </div>
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
              }}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                soundEnabled ? 'bg-[#D5B477]' : 'bg-[#20242B]'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                soundEnabled ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* High Contrast Border Mode */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#101216] border border-[#30343B]">
            <div>
              <p className="font-semibold text-[#F4F1EA]">High-Contrast Silver Borders</p>
              <p className="text-[11px] text-[#A2A5AC] mt-0.5">
                Sharpens all card outlines for maximum legibility on low-brightness screens.
              </p>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                setHighContrast(!highContrast);
              }}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                highContrast ? 'bg-[#A9B8C8]' : 'bg-[#20242B]'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                highContrast ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
