import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActivityItem } from '../../types/finance';
import { formatINR } from '../../utils/calculations';
import { sound } from '../../utils/sound';
import { 
  Clock, 
  Search, 
  Filter, 
  CheckCircle2, 
  ShieldAlert, 
  BookOpen, 
  Layers, 
  Target, 
  X,
  FileText,
  Sparkles,
  Info
} from 'lucide-react';

export const TransactionsView: React.FC = () => {
  const { activities, addActivity } = useApp();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'contribution' | 'scenario' | 'goal_update' | 'learning'>('all');
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);

  // Filter activities
  const filteredActivities = activities.filter((act) => {
    if (selectedFilter !== 'all' && act.type !== selectedFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        act.title.toLowerCase().includes(q) ||
        act.details.toLowerCase().includes(q) ||
        act.badge.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'contribution': return <Layers className="w-4 h-4 text-[#D5B477]" />;
      case 'scenario': return <ShieldAlert className="w-4 h-4 text-[#E27D78]" />;
      case 'goal_update': return <Target className="w-4 h-4 text-[#8BC6A1]" />;
      case 'learning': return <BookOpen className="w-4 h-4 text-[#A9B8C8]" />;
    }
  };

  const handleSimulateNewSIP = () => {
    sound.playChime();
    addActivity({
      title: 'Manual Simulation: Extra SIP Added',
      type: 'contribution',
      amount: 1000,
      details: 'Simulated disciplined deposit of ₹1,000 distributed according to current portfolio builder weights.',
      badge: 'Manual Sim',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#A2A5AC] uppercase tracking-wider mb-1">
            <Clock className="w-3.5 h-3.5 text-[#D5B477]" />
            <span>SIMULATION LEDGER</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F4F1EA]">
            Transactions & Activity
          </h1>
          <p className="text-xs text-[#A2A5AC] mt-0.5">
            Audit history of your simulated contributions, rehearsals, goal edits, and completed modules.
          </p>
        </div>

        <button
          onClick={handleSimulateNewSIP}
          className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-semibold bg-[#20242B] hover:bg-[#2A2F3B] border border-[#D5B477]/40 text-[#D5B477] transition-all flex items-center space-x-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>+ Log Simulated Deposit</span>
        </button>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="p-4 rounded-2xl bg-[#171A20] border border-[#30343B] space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#A2A5AC] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search simulated activity, keywords, or tags..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#101216] border border-[#30343B] text-xs text-[#F4F1EA] placeholder-[#A2A5AC]/60 focus:border-[#D5B477] outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {[
            { id: 'all', label: 'All Activities' },
            { id: 'contribution', label: 'Simulated SIPs' },
            { id: 'scenario', label: 'Bad-Year Rehearsals' },
            { id: 'goal_update', label: 'Goal Changes' },
            { id: 'learning', label: 'Learning Completed' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setSelectedFilter(tab.id as any);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedFilter === tab.id
                  ? 'bg-[#20242B] text-[#F4F1EA] border border-[#A9B8C8]/40 shadow-sm font-semibold'
                  : 'text-[#A2A5AC] hover:text-[#F4F1EA] bg-[#101216]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ACTIVITIES LIST */}
      <div className="rounded-3xl border border-[#30343B] bg-[#171A20] shadow-card-depth overflow-hidden divide-y divide-[#30343B]/60">
        {filteredActivities.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#A2A5AC] space-y-2">
            <Clock className="w-8 h-8 text-[#A2A5AC]/40 mx-auto" />
            <p>No simulated activities found matching your criteria.</p>
          </div>
        ) : (
          filteredActivities.map((act) => (
            <div
              key={act.id}
              onClick={() => {
                sound.playClick();
                setSelectedActivity(act);
              }}
              className="p-4 sm:p-5 hover:bg-[#20242B]/60 transition-colors cursor-pointer flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#101216] border border-[#30343B] flex items-center justify-center shrink-0 group-hover:border-[#D5B477]/40 transition-colors">
                  {getIcon(act.type)}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-xs text-[#F4F1EA] group-hover:text-[#D5B477] transition-colors">
                      {act.title}
                    </h3>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#090A0C] text-[#A2A5AC] border border-[#30343B]">
                      SIMULATED
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A2A5AC] mt-0.5 line-clamp-1">
                    {act.details}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                {act.amount !== undefined && (
                  <p className="font-mono font-bold text-xs text-[#F4F1EA]">
                    {formatINR(act.amount)}
                  </p>
                )}
                <span className="text-[10px] font-mono text-[#A2A5AC]/70">
                  {act.timestamp}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DETAIL MODAL / DRAWER (Mandated by Section 15) */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#171A20] border border-[#30343B] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#30343B]/60 pb-3">
              <div className="flex items-center space-x-2">
                {getIcon(selectedActivity.type)}
                <h3 className="font-display font-bold text-base text-[#F4F1EA]">
                  Activity Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedActivity(null)}
                className="text-[#A2A5AC] hover:text-[#F4F1EA] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-[#101216] border border-[#30343B] space-y-1">
                <span className="text-[10px] font-mono text-[#A2A5AC] uppercase">Title</span>
                <p className="font-bold text-sm text-[#F4F1EA]">{selectedActivity.title}</p>
                <span className="inline-block text-[9px] font-mono px-2 py-0.5 rounded bg-[#D5B477]/15 text-[#D5B477] border border-[#D5B477]/30 mt-1">
                  {selectedActivity.badge}
                </span>
              </div>

              {selectedActivity.amount !== undefined && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#101216] border border-[#30343B]">
                  <span className="text-[#A2A5AC]">Simulated Amount</span>
                  <span className="font-mono font-bold text-sm text-[#8BC6A1]">
                    {formatINR(selectedActivity.amount)}
                  </span>
                </div>
              )}

              <div>
                <span className="text-[10px] font-mono text-[#A2A5AC] uppercase">Description & Context</span>
                <p className="text-[#F4F1EA] mt-1 leading-relaxed">{selectedActivity.details}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-[#A2A5AC] pt-2 border-t border-[#30343B]/60">
                <span>Timestamp</span>
                <span>{selectedActivity.timestamp}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedActivity(null)}
              className="w-full py-2.5 rounded-xl bg-[#20242B] hover:bg-[#2A2F3B] border border-[#30343B] text-xs font-semibold text-[#F4F1EA] transition-colors"
            >
              Close Record
            </button>
          </div>
        </div>
      )}

      {/* Mandatory Disclaimer */}
      <div className="p-4 rounded-2xl bg-[#101216] border border-[#30343B] flex items-center space-x-3 text-xs text-[#A2A5AC]">
        <Info className="w-4 h-4 text-[#D5B477] shrink-0" />
        <p>
          <strong className="text-[#F4F1EA]">Illustrative Activity Log:</strong> Every entry in this ledger represents a simulation or learning event inside the FUTURA prototype. No actual bank transfers, demat account debits, or payments are processed.
        </p>
      </div>
    </div>
  );
};
