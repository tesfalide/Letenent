// components/admin/coaches/ProgramPreviewModal.tsx
// Administrative preview modal for coach programs

import React from 'react';
import { CoachProgramItem } from '@/types';
import { Folder, X, Calendar, Users, CheckCircle2, Dumbbell } from 'lucide-react';

interface ProgramPreviewModalProps {
  isOpen: boolean;
  program: CoachProgramItem | null;
  onClose: () => void;
}

export const ProgramPreviewModal: React.FC<ProgramPreviewModalProps> = ({
  isOpen,
  program,
  onClose,
}) => {
  if (!isOpen || !program) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-program-title"
    >
      <div className="w-full max-w-lg rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <h3 id="preview-program-title" className="text-base font-bold text-white">
                {program.title}
              </h3>
              <p className="text-xs text-zinc-400">Program Blueprint Overview</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-300">
          {program.description || 'No detailed description provided for this training block.'}
        </div>

        {/* Metric Overview Grid */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
            <div className="flex items-center justify-center gap-1 text-[11px] text-zinc-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>Duration</span>
            </div>
            <p className="text-sm font-bold text-white">{program.durationWeeks} Weeks</p>
          </div>
          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
            <div className="flex items-center justify-center gap-1 text-[11px] text-zinc-400">
              <Users className="w-3.5 h-3.5" />
              <span>Enrolled</span>
            </div>
            <p className="text-sm font-bold text-white">{program.traineesCount} Trainees</p>
          </div>
          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
            <div className="flex items-center justify-center gap-1 text-[11px] text-zinc-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Completion</span>
            </div>
            <p className="text-sm font-bold text-emerald-400">{program.completionRate}%</p>
          </div>
        </div>

        {/* Sample Workout Architecture */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Assigned Workout Split
          </h4>
          <div className="divide-y divide-zinc-800 rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden text-xs">
            <div className="p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-200">
                <Dumbbell className="w-3.5 h-3.5 text-[#1877F2]" />
                <span className="font-medium">Day 1: Primary Compound & Hypertrophy</span>
              </div>
              <span className="text-[11px] text-zinc-500">60 mins • 4 sets</span>
            </div>
            <div className="p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-200">
                <Dumbbell className="w-3.5 h-3.5 text-[#1877F2]" />
                <span className="font-medium">Day 3: Posterior Chain & Velocity Hinge</span>
              </div>
              <span className="text-[11px] text-zinc-500">55 mins • 4 sets</span>
            </div>
            <div className="p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-200">
                <Dumbbell className="w-3.5 h-3.5 text-[#1877F2]" />
                <span className="font-medium">Day 5: Auxiliary Arms & Metabolic Finisher</span>
              </div>
              <span className="text-[11px] text-zinc-500">50 mins • 3 sets</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
