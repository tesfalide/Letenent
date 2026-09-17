// components/coach/ClientRosterView.tsx
// Coach Client Management Roster (Sprint 3)

import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Activity,
  Calendar,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Clock,
  Sparkles,
  FileSpreadsheet,
} from 'lucide-react';
import { TraineeProfile, ClientStatus } from '@/types';
import { InviteClientModal } from './InviteClientModal';
import { useTheme } from '@/src/context/ThemeContext';

interface ClientRosterViewProps {
  trainees: TraineeProfile[];
  onSelectTraineeForReview?: (trainee: TraineeProfile) => void;
  onSelectTraineeForProgram?: (trainee: TraineeProfile) => void;
  onTraineesUpdated?: (updated: TraineeProfile[]) => void;
}

export const ClientRosterView: React.FC<ClientRosterViewProps> = ({
  trainees: initialTrainees,
  onSelectTraineeForReview,
  onSelectTraineeForProgram,
  onTraineesUpdated,
}) => {
  const { isBright } = useTheme();
  const [trainees, setTrainees] = useState<TraineeProfile[]>(initialTrainees);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | ClientStatus>('ALL');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Filter trainees based on query and status
  const filteredTrainees = trainees.filter((t) => {
    const matchesSearch =
      t.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.targetFocus.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatusFilter === 'ALL' || t.status === selectedStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleClientInvited = (newTrainee: TraineeProfile) => {
    const updated = [newTrainee, ...trainees];
    setTrainees(updated);
    if (onTraineesUpdated) onTraineesUpdated(updated);
  };

  const getStatusBadge = (status: ClientStatus) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
            isBright
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            ACTIVE
          </span>
        );
      case 'INVITED':
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
            isBright
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            INVITED
          </span>
        );
      case 'PAUSED':
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
            isBright
              ? 'bg-slate-100 text-slate-600 border-slate-200'
              : 'bg-zinc-800 text-zinc-400 border-zinc-700'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isBright ? 'bg-slate-400' : 'bg-zinc-500'}`} />
            PAUSED
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Top Header & Actions */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl p-6 border transition-colors ${
        isBright
          ? 'bg-white border-slate-200 shadow-sm'
          : 'bg-zinc-900/90 border-zinc-800/80 shadow-lg'
      }`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-semibold uppercase tracking-wider border ${
              isBright
                ? 'bg-blue-50 text-[#1877F2] border-blue-200'
                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            }`}>
              Coaching OS
            </span>
            <span className={`text-xs ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>• Sprint 3 Roster Engine</span>
          </div>
          <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${isBright ? 'text-slate-900' : 'text-white'}`}>
            Client Management Roster
          </h1>
          <p className={`text-xs sm:text-sm mt-1 ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
            Real-time compliance tracking, 14-day training adherence, and onboarding controls.
          </p>
        </div>

        <button
          id="invite-client-trigger"
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1877F2] hover:bg-blue-600 text-white text-xs font-bold shadow-sm transition-all active:scale-95 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          Invite Client
        </button>
      </div>

      {/* Roster Metrics Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className={`border rounded-2xl p-4 transition-colors ${
          isBright ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-900/70 border-zinc-800/80'
        }`}>
          <span className={`text-xs flex items-center gap-1.5 mb-1 ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
            <Users className="w-3.5 h-3.5" /> Total Roster
          </span>
          <span className={`text-2xl font-bold font-mono ${isBright ? 'text-slate-900' : 'text-white'}`}>{trainees.length}</span>
          <span className={`text-[11px] block mt-0.5 ${isBright ? 'text-slate-400' : 'text-zinc-500'}`}>Assigned Athletes</span>
        </div>

        <div className={`border rounded-2xl p-4 transition-colors ${
          isBright ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-900/70 border-zinc-800/80'
        }`}>
          <span className={`text-xs flex items-center gap-1.5 mb-1 ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
            <Activity className="w-3.5 h-3.5 text-emerald-500" /> Active Clients
          </span>
          <span className="text-2xl font-bold font-mono text-emerald-500">
            {trainees.filter((t) => t.status === 'ACTIVE').length}
          </span>
          <span className={`text-[11px] block mt-0.5 ${isBright ? 'text-slate-400' : 'text-zinc-500'}`}>Logging Workouts</span>
        </div>

        <div className={`border rounded-2xl p-4 transition-colors ${
          isBright ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-900/70 border-zinc-800/80'
        }`}>
          <span className={`text-xs flex items-center gap-1.5 mb-1 ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
            <TrendingUp className="w-3.5 h-3.5 text-[#1877F2]" /> 14-Day Roster Adherence
          </span>
          <span className="text-2xl font-bold font-mono text-[#1877F2]">
            {Math.round(
              trainees
                .filter((t) => t.status === 'ACTIVE')
                .reduce((acc, curr) => acc + curr.compliance14Days, 0) /
                (trainees.filter((t) => t.status === 'ACTIVE').length || 1)
            )}
            %
          </span>
          <span className={`text-[11px] block mt-0.5 ${isBright ? 'text-slate-400' : 'text-zinc-500'}`}>Target &gt; 80%</span>
        </div>

        <div className={`border rounded-2xl p-4 transition-colors ${
          isBright ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-900/70 border-zinc-800/80'
        }`}>
          <span className={`text-xs flex items-center gap-1.5 mb-1 ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
            <Clock className="w-3.5 h-3.5 text-amber-500" /> Pending Onboarding
          </span>
          <span className="text-2xl font-bold font-mono text-amber-500">
            {trainees.filter((t) => t.status === 'INVITED').length}
          </span>
          <span className={`text-[11px] block mt-0.5 ${isBright ? 'text-slate-400' : 'text-zinc-500'}`}>Tokens Generated</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl p-3 border transition-colors ${
        isBright ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-900/60 border-zinc-800/80'
      }`}>
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isBright ? 'text-slate-400' : 'text-zinc-500'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or goal..."
            className={`w-full rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors border ${
              isBright
                ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                : 'bg-zinc-950 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-blue-500'
            }`}
          />
        </div>

        {/* Status Filter Tabs */}
        <div className={`flex items-center gap-1 p-1 rounded-lg border text-xs w-full sm:w-auto overflow-x-auto ${
          isBright ? 'bg-slate-100 border-slate-200' : 'bg-zinc-950 border-zinc-800'
        }`}>
          {(['ALL', 'ACTIVE', 'INVITED', 'PAUSED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatusFilter(st)}
              className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all ${
                selectedStatusFilter === st
                  ? isBright
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'bg-zinc-800 text-white shadow-sm font-bold'
                  : isBright
                  ? 'text-slate-500 hover:text-slate-900'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Trainee Roster Table */}
      <div className={`rounded-2xl overflow-hidden border transition-colors ${
        isBright ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-900/80 border-zinc-800 shadow-xl'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[11px] uppercase tracking-wider font-semibold ${
                isBright
                  ? 'bg-slate-50/80 border-slate-200 text-slate-500'
                  : 'bg-zinc-950/70 border-zinc-800 text-zinc-400'
              }`}>
                <th className="py-3 px-4">Trainee Athlete</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">14-Day Compliance Meter</th>
                <th className="py-3 px-4">Target Focus</th>
                <th className="py-3 px-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs ${isBright ? 'divide-slate-200' : 'divide-zinc-800/60'}`}>
              {filteredTrainees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center">
                    <p className={`text-sm font-medium ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                      No athletes found matching your search.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTrainees.map((trainee) => {
                  const isInvited = trainee.status === 'INVITED';
                  return (
                    <tr
                      key={trainee.id}
                      className={`transition-colors group ${
                        isBright ? 'hover:bg-slate-50/80' : 'hover:bg-zinc-800/40'
                      }`}
                    >
                      {/* Athlete Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {trainee.user.avatarUrl && trainee.user.avatarUrl.trim() ? (
                            <img
                              src={trainee.user.avatarUrl}
                              alt={trainee.user.name}
                              className={`w-9 h-9 rounded-xl object-cover border ${
                                isBright ? 'border-slate-200' : 'border-zinc-700/80'
                              }`}
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div
                              className={`w-9 h-9 rounded-xl border font-bold text-xs flex items-center justify-center shrink-0 ${
                                isBright
                                  ? 'bg-slate-100 border-slate-200 text-slate-700'
                                  : 'bg-zinc-800 border-zinc-700 text-zinc-200'
                              }`}
                            >
                              {trainee.user.name === 'Benjamin' ? 'BK' : trainee.user.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className={`font-semibold transition-colors ${
                              isBright ? 'text-slate-900 group-hover:text-blue-600' : 'text-zinc-100 group-hover:text-blue-400'
                            }`}>
                              {trainee.user.name}
                            </div>
                            <div className={`text-[11px] ${isBright ? 'text-slate-400' : 'text-zinc-500'}`}>
                              {trainee.user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">{getStatusBadge(trainee.status)}</td>

                      {/* 14-Day Compliance Percentage Meter */}
                      <td className="py-3.5 px-4">
                        {isInvited ? (
                          <div className={`text-[11px] flex items-center gap-1.5 ${isBright ? 'text-slate-400' : 'text-zinc-500'}`}>
                            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                            <span>Awaiting onboarding link activation</span>
                          </div>
                        ) : (
                          <div className="w-56 space-y-1.5">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className={`font-medium ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                                {trainee.workoutsCompleted14Days} / {trainee.workoutsAssigned14Days} completed
                              </span>
                              <span
                                className={`font-mono font-bold ${
                                  trainee.compliance14Days >= 85
                                    ? isBright ? 'text-emerald-600' : 'text-emerald-400'
                                    : trainee.compliance14Days >= 70
                                    ? isBright ? 'text-amber-600' : 'text-amber-400'
                                    : isBright ? 'text-rose-600' : 'text-rose-400'
                                }`}
                              >
                                {trainee.compliance14Days}%
                              </span>
                            </div>
                            {/* Visual progress meter */}
                            <div className={`w-full h-2 rounded-full overflow-hidden ${isBright ? 'bg-slate-100' : 'bg-zinc-800'}`}>
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  trainee.compliance14Days >= 85
                                    ? 'bg-emerald-500'
                                    : trainee.compliance14Days >= 70
                                    ? 'bg-amber-500'
                                    : 'bg-rose-500'
                                }`}
                                style={{ width: `${trainee.compliance14Days}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Target Focus */}
                      <td className="py-3.5 px-4">
                        <span className={`text-[11px] line-clamp-1 max-w-[180px] ${isBright ? 'text-slate-600' : 'text-zinc-300'}`}>
                          {trainee.targetFocus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onSelectTraineeForReview && onSelectTraineeForReview(trainee)}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-colors ${
                              isBright
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700/60'
                            }`}
                          >
                            Check-Ins
                          </button>
                          <button
                            onClick={() => onSelectTraineeForProgram && onSelectTraineeForProgram(trainee)}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-colors ${
                              isBright
                                ? 'bg-blue-50 hover:bg-blue-100 text-[#1877F2] border-blue-200'
                                : 'bg-[#1877F2]/20 hover:bg-[#1877F2]/30 text-blue-300 border-blue-500/30'
                            }`}
                          >
                            Assign Program
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Client Modal */}
      <InviteClientModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onClientInvited={handleClientInvited}
      />
    </div>
  );
};

