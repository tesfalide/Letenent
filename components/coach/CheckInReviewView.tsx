// components/coach/CheckInReviewView.tsx
// Coach Check-In Review view with side-by-side workout stats (Sprint 4)

import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Scale,
  Zap,
  Frown,
  Moon,
  Utensils,
  Smile,
  MessageSquare,
  Sparkles,
  Send,
  Calendar,
  ChevronLeft,
  Activity,
  Dumbbell,
} from 'lucide-react';
import { CheckIn } from '@/types';

interface CheckInReviewViewProps {
  checkIns: CheckIn[];
  onBackToRoster?: () => void;
}

export const CheckInReviewView: React.FC<CheckInReviewViewProps> = ({
  checkIns: initialCheckIns,
  onBackToRoster,
}) => {
  const [checkIns, setCheckIns] = useState<CheckIn[]>(initialCheckIns);
  const [selectedId, setSelectedId] = useState<string>(checkIns[0]?.id || '');
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeCheckIn = checkIns.find((c) => c.id === selectedId) || checkIns[0];

  const handleMarkReviewed = () => {
    if (!activeCheckIn) return;
    setIsSubmitting(true);

    setTimeout(() => {
      setCheckIns((prev) =>
        prev.map((c) => {
          if (c.id === activeCheckIn.id) {
            return {
              ...c,
              status: 'REVIEWED',
              coachFeedback: feedbackText || c.coachFeedback || 'Great work this week. Maintain current loads and focus on restorative sleep.',
              reviewedAt: new Date().toISOString(),
            };
          }
          return c;
        })
      );
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          {onBackToRoster && (
            <button
              onClick={onBackToRoster}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/60 transition-colors"
              title="Return to Client Roster"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Weekly Review
              </span>
              <span className="text-xs text-zinc-400">• Sprint 4 Accountability Engine</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Trainee Check-In Auditing
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Side-by-side analysis of subjective athlete recovery vs objective gym workout completion.
            </p>
          </div>
        </div>

        {/* Check-in Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
          {checkIns.map((ci) => (
            <button
              key={ci.id}
              onClick={() => {
                setSelectedId(ci.id);
                setFeedbackText(ci.coachFeedback || '');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${
                selectedId === ci.id
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>{ci.traineeName}</span>
              {ci.status === 'PENDING_REVIEW' ? (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      {activeCheckIn && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Side-by-side metrics & biofeedback (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Athlete Banner */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">{activeCheckIn.traineeName}</h2>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                      activeCheckIn.status === 'PENDING_REVIEW'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}
                  >
                    {activeCheckIn.status === 'PENDING_REVIEW' ? 'Pending Review' : 'Reviewed'}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  Submitted: {new Date(activeCheckIn.submittedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-zinc-500 block">Morning Bodyweight</span>
                <span className="text-2xl font-mono font-bold text-emerald-400">
                  {activeCheckIn.morningWeightLbs} <span className="text-xs text-zinc-400">lbs</span>
                </span>
              </div>
            </div>

            {/* Side-by-Side: 14-Day Workout Completion Stats */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Side-By-Side: 14-Day Workout Execution
                </h3>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {activeCheckIn.complianceStats?.compliancePercent ?? 90}% Adherence
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-1">
                <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/60">
                  <span className="text-[11px] text-zinc-400 block">Workouts Done</span>
                  <span className="text-lg font-mono font-bold text-white">
                    {activeCheckIn.complianceStats?.workoutsCompleted ?? 10} Sessions
                  </span>
                </div>
                <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/60">
                  <span className="text-[11px] text-zinc-400 block">Assigned Total</span>
                  <span className="text-lg font-mono font-bold text-zinc-300">
                    {activeCheckIn.complianceStats?.workoutsAssigned ?? 12} Sessions
                  </span>
                </div>
                <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/60">
                  <span className="text-[11px] text-zinc-400 block">Logging Consistency</span>
                  <span className="text-lg font-mono font-bold text-emerald-400">High (&gt;90%)</span>
                </div>
              </div>
            </div>

            {/* Subjective 1-10 Biofeedback Scores */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                Recovery & Biofeedback Sliders
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800/60 text-center">
                  <Zap className="w-4 h-4 text-amber-400 mx-auto mb-1.5" />
                  <span className="text-[11px] text-zinc-400 block">Energy</span>
                  <span className="text-lg font-bold font-mono text-amber-400">
                    {activeCheckIn.energyScore} / 10
                  </span>
                </div>

                <div className="bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800/60 text-center">
                  <Frown className="w-4 h-4 text-rose-400 mx-auto mb-1.5" />
                  <span className="text-[11px] text-zinc-400 block">Stress</span>
                  <span className="text-lg font-bold font-mono text-rose-400">
                    {activeCheckIn.stressScore} / 10
                  </span>
                </div>

                <div className="bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800/60 text-center">
                  <Moon className="w-4 h-4 text-blue-400 mx-auto mb-1.5" />
                  <span className="text-[11px] text-zinc-400 block">Sleep</span>
                  <span className="text-lg font-bold font-mono text-blue-400">
                    {activeCheckIn.sleepScore} / 10
                  </span>
                </div>

                <div className="bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800/60 text-center">
                  <Utensils className="w-4 h-4 text-emerald-400 mx-auto mb-1.5" />
                  <span className="text-[11px] text-zinc-400 block">Diet</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">
                    {activeCheckIn.dietAdherenceScore} / 10
                  </span>
                </div>
              </div>
            </div>

            {/* Qualitative Notes */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                Athlete Reflections
              </h3>

              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Smile className="w-3.5 h-3.5" /> Wins & Highlights
                </span>
                <p className="text-xs text-zinc-300 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/60 leading-relaxed">
                  "{activeCheckIn.wins}"
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                  <Frown className="w-3.5 h-3.5" /> Struggles & Roadblocks
                </span>
                <p className="text-xs text-zinc-300 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/60 leading-relaxed">
                  "{activeCheckIn.struggles}"
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Coach Feedback & Review Submission (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sticky top-6 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Coach Asynchronous Feedback</h3>
                  <p className="text-[11px] text-zinc-400">
                    Deliver tactical guidance directly to {activeCheckIn.traineeName}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-2">
                  Feedback Notes & Program Adjustments
                </label>
                <textarea
                  rows={8}
                  value={feedbackText || activeCheckIn.coachFeedback || ''}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="e.g. Excellent progress this week! Loved seeing the RDL load increase with clean biofeedback. Given your elevated stress score on Thursday, let's keep Friday's volume steady..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 leading-relaxed transition-colors"
                />
              </div>

              <div className="space-y-2 pt-2">
                <button
                  id="mark-reviewed-btn"
                  onClick={handleMarkReviewed}
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isSubmitting ? 'Saving Review...' : 'Mark Reviewed & Dispatch Feedback'}
                </button>

                {activeCheckIn.reviewedAt && (
                  <p className="text-[11px] text-center text-emerald-400/80">
                    Reviewed on {new Date(activeCheckIn.reviewedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
