import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LEARNING_LESSONS } from '../../data/learningLessons';
import { LearningLesson } from '../../types/finance';
import { sound } from '../../utils/sound';
import { 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  HelpCircle, 
  X,
  Layers,
  ShieldAlert,
  Target,
  Compass
} from 'lucide-react';

export const LearningHubView: React.FC = () => {
  const { 
    completedLessonIds, 
    markLessonCompleted, 
    navigateTo 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Fundamentals' | 'Investing' | 'Risk & Psychology'>('All');
  const [activeLesson, setActiveLesson] = useState<LearningLesson | null>(null);

  const filteredLessons = LEARNING_LESSONS.filter((lesson) => {
    if (selectedCategory !== 'All' && lesson.category !== selectedCategory) return false;
    return true;
  });

  const completionRate = Math.round((completedLessonIds.length / LEARNING_LESSONS.length) * 100);

  const handleOpenLesson = (lesson: LearningLesson) => {
    sound.playClick();
    setActiveLesson(lesson);
    markLessonCompleted(lesson.id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header & Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#A2A5AC] uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5 text-[#8BC6A1]" />
            <span>KNOWLEDGE CORNER</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F4F1EA]">
            Financial Learning Hub
          </h1>
          <p className="text-xs text-[#A2A5AC] mt-0.5">
            10 bite-sized modules built for 19-year-old student Aarav. No prerequisites required.
          </p>
        </div>

        {/* Progress pill */}
        <div className="p-3 rounded-2xl bg-[#171A20] border border-[#30343B] flex items-center space-x-3 text-xs">
          <div className="w-9 h-9 rounded-xl bg-[#8BC6A1]/15 border border-[#8BC6A1]/30 flex items-center justify-center font-mono font-bold text-xs text-[#8BC6A1]">
            {completedLessonIds.length}/10
          </div>
          <div>
            <span className="font-semibold text-[#F4F1EA]">{completionRate}% Completed</span>
            <p className="text-[10px] text-[#A2A5AC] font-mono">Self-paced reading</p>
          </div>
        </div>
      </div>

      {/* CATEGORY FILTER PILLS */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {(['All', 'Fundamentals', 'Investing', 'Risk & Psychology'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => {
              sound.playClick();
              setSelectedCategory(cat);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-[#20242B] text-[#F4F1EA] border border-[#A9B8C8]/40 shadow-sm font-semibold'
                : 'text-[#A2A5AC] hover:text-[#F4F1EA] bg-[#171A20]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 10 LESSON CARDS GRID (Mandated by Section 16) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLessons.map((lesson) => {
          const isDone = completedLessonIds.includes(lesson.id);

          return (
            <div
              key={lesson.id}
              onClick={() => handleOpenLesson(lesson)}
              className="p-5 rounded-3xl bg-gradient-to-b from-[#171A20] to-[#101216] border border-[#30343B] hover:border-[#8BC6A1]/40 transition-all cursor-pointer flex flex-col justify-between shadow-card-depth group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#8BC6A1] bg-[#8BC6A1]/10 px-2 py-0.5 rounded border border-[#8BC6A1]/30">
                    {lesson.category}
                  </span>
                  <div className="flex items-center space-x-1.5 text-[#A2A5AC]">
                    <Clock className="w-3 h-3" />
                    <span>{lesson.readTime}</span>
                  </div>
                </div>

                <h3 className="font-display text-base font-bold text-[#F4F1EA] group-hover:text-[#8BC6A1] transition-colors">
                  {lesson.title}
                </h3>

                <p className="text-xs text-[#A2A5AC] leading-relaxed line-clamp-2">
                  {lesson.summary}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#30343B]/60 flex items-center justify-between text-xs">
                <span className="font-semibold text-[#8BC6A1] flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>

                {isDone ? (
                  <span className="flex items-center space-x-1 text-[10px] font-mono text-[#8BC6A1]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Completed</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-[#A2A5AC]">
                    Unread
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* FULL LESSON READER MODAL (Mandated by Section 16) */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-gradient-to-b from-[#1C2028] via-[#14171E] to-[#0D0F13] border border-[#30343B] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#30343B]/60 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#8BC6A1] bg-[#8BC6A1]/10 px-2 py-0.5 rounded border border-[#8BC6A1]/30">
                  {activeLesson.category} · {activeLesson.readTime}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F4F1EA] mt-1.5">
                  {activeLesson.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveLesson(null)}
                className="text-[#A2A5AC] hover:text-[#F4F1EA] p-1.5 rounded-lg hover:bg-[#20242B] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#F4F1EA] leading-relaxed">
              {/* Main Explanations */}
              <div className="space-y-3">
                {activeLesson.content.map((para, idx) => (
                  <p key={idx} className="text-[#A2A5AC] leading-relaxed text-xs">
                    {para}
                  </p>
                ))}
              </div>

              {/* Aarav's Real-world student example */}
              <div className="p-4 rounded-2xl bg-[#101216] border border-[#D5B477]/40 space-y-1.5">
                <div className="flex items-center space-x-2 text-[#D5B477]">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-bold text-xs uppercase font-mono">Aarav's Real-World Example</span>
                </div>
                <p className="text-xs text-[#F4F1EA]">
                  {activeLesson.aaravExample}
                </p>
              </div>

              {/* Key Takeaway Summary */}
              <div className="p-4 rounded-2xl bg-[#20242B]/80 border border-[#8BC6A1]/40 space-y-1">
                <div className="flex items-center space-x-2 text-[#8BC6A1]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="font-bold text-xs uppercase font-mono">Key Takeaway</span>
                </div>
                <p className="text-xs text-[#F4F1EA]">
                  {activeLesson.keyTakeaway}
                </p>
              </div>
            </div>

            {/* Footer with DIRECT ACTION BUTTON inside FUTURA */}
            <div className="px-6 py-4 bg-[#101216] border-t border-[#30343B]/60 flex items-center justify-between">
              <button
                onClick={() => setActiveLesson(null)}
                className="text-xs text-[#A2A5AC] hover:text-[#F4F1EA]"
              >
                Close Guide
              </button>

              <button
                onClick={() => {
                  const route = activeLesson.actionRoute;
                  setActiveLesson(null);
                  navigateTo(route as any);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#D5B477] to-[#E5C68A] text-[#090A0C] hover:shadow-subtle-glow transition-all flex items-center space-x-1.5"
              >
                <span>{activeLesson.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
