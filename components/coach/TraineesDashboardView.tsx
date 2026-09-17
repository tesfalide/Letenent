// components/coach/TraineesDashboardView.tsx
// Coach's Trainees Dashboard aligned with the Hevy Coach inspiration design
// Featuring greeting, 3 Roster Metric cards with stacked avatar clusters,
// Latest Activities feed matching exact workout, measurement & invitation styling,
// and the Weekly Active Clients Bar Chart.

import React, { useState } from 'react';
import {
  ChevronRight,
  Search,
  Plus,
  Dumbbell,
  MessageSquare,
  Send,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { TraineeProfile, ActivityItem, ActivityType, CheckIn } from '@/types';
import { InviteClientModal } from './InviteClientModal';
import { WeeklyActiveChart } from './WeeklyActiveChart';
import { useTheme } from '../../src/context/ThemeContext';

interface TraineesDashboardViewProps {
  trainees: TraineeProfile[];
  activities: ActivityItem[];
  checkIns: CheckIn[];
  onSelectTraineeForReview: (trainee: TraineeProfile) => void;
  onSelectTraineeForProgram: (trainee: TraineeProfile) => void;
  onNavigateToRoster: () => void;
  onNavigateToCheckIns: () => void;
  onNavigateToProgramBuilder: () => void;
  onTraineesUpdated?: (updated: TraineeProfile[]) => void;
}

export const TraineesDashboardView: React.FC<TraineesDashboardViewProps> = ({
  trainees,
  activities: initialActivities,
  checkIns,
  onSelectTraineeForReview,
  onSelectTraineeForProgram,
  onNavigateToRoster,
  onNavigateToCheckIns,
  onNavigateToProgramBuilder,
  onTraineesUpdated,
}) => {
  const { isBright } = useTheme();
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);
  const [activitySearch, setActivitySearch] = useState('');
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Compute roster KPIs
  const activeTrainees = trainees.filter((t) => t.status === 'ACTIVE');
  const inactiveTrainees = trainees.filter((t) => t.status === 'PAUSED' || t.status === 'INVITED');

  const totalClientsCount = trainees.length;
  const activeClientsCount = activeTrainees.length;
  const inactiveClientsCount = inactiveTrainees.length;

  // Filter activities based on search input
  const filteredActivities = activities.filter((act) => {
    if (!activitySearch.trim()) return true;
    const query = activitySearch.toLowerCase();
    return (
      act.traineeName.toLowerCase().includes(query) ||
      (act.workoutName && act.workoutName.toLowerCase().includes(query)) ||
      act.title.toLowerCase().includes(query) ||
      act.description.toLowerCase().includes(query)
    );
  });

  const displayedActivities = showAllActivities
    ? filteredActivities
    : filteredActivities.slice(0, 6);

  const handleSendCoachNote = (activityId: string) => {
    if (!replyText.trim()) return;
    setActivities((prev) =>
      prev.map((act) => (act.id === activityId ? { ...act, coachNote: replyText.trim() } : act))
    );
    setReplyText('');
    setActiveReplyId(null);
  };

  const handleClientInvited = (newTrainee: TraineeProfile) => {
    if (onTraineesUpdated) {
      onTraineesUpdated([newTrainee, ...trainees]);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* 1. TOP GREETING & ACTION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2 ${isBright ? 'text-slate-900' : 'text-white'}`}>
            <span>Hello, Roger</span>
            <span className="text-2xl">👋</span>
          </h1>
          <p className={`text-sm mt-1 font-normal ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
            Get an overview of your clients' progress.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search clients input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-400" />
            <input
              type="text"
              placeholder="Search clients"
              value={activitySearch}
              onChange={(e) => setActivitySearch(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>

          {/* Add client button */}
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1877F2] hover:bg-blue-600 active:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add client</span>
          </button>
        </div>
      </div>

      {/* 2. THREE KPI METRIC CARDS WITH AVATAR CLUSTERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {/* Card 1: Total Clients */}
        <div
          onClick={onNavigateToRoster}
          className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-600 dark:text-zinc-300 font-medium text-sm">
            <span>Total Clients</span>
            <ChevronRight className="w-4 h-4 text-slate-400 dark:text-zinc-500 group-hover:text-blue-600 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </div>

          <div className="flex items-end justify-between mt-4">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {totalClientsCount}
            </span>

            {/* Stacked Trainee Avatars + Pill Badge */}
            <div className="flex items-center -space-x-2 overflow-hidden py-1">
              {trainees.slice(0, 5).map((trainee, idx) => (
                <div
                  key={trainee.id}
                  className="inline-block relative ring-2 ring-white dark:ring-zinc-900 rounded-full"
                  title={trainee.user.name}
                >
                  {trainee.user.avatarUrl && trainee.user.avatarUrl.trim() ? (
                    <img
                      src={trainee.user.avatarUrl}
                      alt={trainee.user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-200 font-bold text-[11px] flex items-center justify-center">
                      {trainee.user.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
              ))}
              {totalClientsCount > 5 && (
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full ring-2 ring-white dark:ring-zinc-900 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 font-bold text-xs">
                  +{totalClientsCount - 5}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: Active clients last 7 days */}
        <div
          onClick={onNavigateToRoster}
          className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-600 dark:text-zinc-300 font-medium text-sm">
            <span>Active clients last 7 days</span>
            <ChevronRight className="w-4 h-4 text-slate-400 dark:text-zinc-500 group-hover:text-blue-600 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </div>

          <div className="flex items-end justify-between mt-4">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {activeClientsCount}
            </span>

            {/* Stacked Active Trainee Avatars + Pill Badge */}
            <div className="flex items-center -space-x-2 overflow-hidden py-1">
              {activeTrainees.slice(0, 5).map((trainee) => (
                <div
                  key={trainee.id}
                  className="inline-block relative ring-2 ring-white dark:ring-zinc-900 rounded-full"
                  title={trainee.user.name}
                >
                  {trainee.user.avatarUrl && trainee.user.avatarUrl.trim() ? (
                    <img
                      src={trainee.user.avatarUrl}
                      alt={trainee.user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-200 font-bold text-[11px] flex items-center justify-center">
                      {trainee.user.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
              ))}
              {activeClientsCount > 5 && (
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full ring-2 ring-white dark:ring-zinc-900 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 font-bold text-xs">
                  +{activeClientsCount - 5}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card 3: Inactive clients last 7 days */}
        <div
          onClick={onNavigateToRoster}
          className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-600 dark:text-zinc-300 font-medium text-sm">
            <span>Inactive clients last 7 days</span>
            <ChevronRight className="w-4 h-4 text-slate-400 dark:text-zinc-500 group-hover:text-blue-600 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </div>

          <div className="flex items-end justify-between mt-4">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {inactiveClientsCount}
            </span>

            {/* Inactive Avatars (e.g. Tom, Benjamin BK, Elena) */}
            <div className="flex items-center -space-x-2 overflow-hidden py-1">
              {inactiveTrainees.map((trainee) => (
                <div
                  key={trainee.id}
                  className="inline-block relative ring-2 ring-white dark:ring-zinc-900 rounded-full"
                  title={`${trainee.user.name} (${trainee.status})`}
                >
                  {trainee.user.avatarUrl && trainee.user.avatarUrl.trim() ? (
                    <img
                      src={trainee.user.avatarUrl}
                      alt={trainee.user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-zinc-700 text-slate-700 dark:text-zinc-200 font-bold text-[11px] flex items-center justify-center">
                      {trainee.user.name === 'Benjamin' ? 'BK' : trainee.user.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. TWO-COLUMN LAYOUT: LATEST ACTIVITIES & WEEKLY ACTIVE CLIENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Latest activities (approx 7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-sm">
          {/* Card Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
            <h2 className={`text-base sm:text-lg font-bold ${isBright ? 'text-slate-900' : 'text-white'}`}>
              Latest activities
            </h2>
            <button
              onClick={() => setShowAllActivities(!showAllActivities)}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              {showAllActivities ? 'Show less' : 'See all'}
            </button>
          </div>

          {/* Activities List */}
          <div className="divide-y divide-slate-100 dark:divide-zinc-800">
            {displayedActivities.length === 0 ? (
              <div className="py-12 text-center text-slate-400 dark:text-zinc-500 text-sm">
                No activity records match your search.
              </div>
            ) : (
              displayedActivities.map((act) => {
                const matchingTrainee = trainees.find(
                  (t) => t.id === act.traineeId || t.user.name.toLowerCase() === act.traineeName.toLowerCase()
                );
                const isReplying = activeReplyId === act.id;

                return (
                  <div key={act.id} className="py-4.5 sm:py-5 first:pt-4 last:pb-2 space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      {/* Avatar and Content */}
                      <div className="flex items-start gap-3.5 min-w-0">
                        {/* Avatar */}
                        <div
                          onClick={() => matchingTrainee && onSelectTraineeForReview(matchingTrainee)}
                          className="cursor-pointer shrink-0 mt-0.5"
                        >
                          {act.avatarInitials ? (
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 font-bold text-xs flex items-center justify-center">
                              {act.avatarInitials}
                            </div>
                          ) : act.traineeAvatar && act.traineeAvatar.trim() ? (
                            <img
                              src={act.traineeAvatar}
                              alt={act.traineeName}
                              className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200/80 dark:ring-zinc-700"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 font-bold text-xs flex items-center justify-center">
                              {act.traineeName.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>

                        {/* Text and details */}
                        <div className="space-y-1 min-w-0">
                          {/* Main Activity Sentence */}
                          <div className="text-sm text-slate-900 dark:text-zinc-200 leading-snug">
                            {act.isInvitationAccepted ? (
                              <span>
                                <span
                                  onClick={() => matchingTrainee && onSelectTraineeForReview(matchingTrainee)}
                                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                                >
                                  {act.traineeName}
                                </span>{' '}
                                has accepted your coaching invitation.
                              </span>
                            ) : act.measurementText ? (
                              <span>
                                A new{' '}
                                <span className="font-semibold text-blue-600 dark:text-blue-400">
                                  weight of 78 kg
                                </span>{' '}
                                has been added to the measurements of{' '}
                                <span
                                  onClick={() => matchingTrainee && onSelectTraineeForReview(matchingTrainee)}
                                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                                >
                                  {act.traineeName}
                                </span>
                                , which is 2 kg more than last time.
                              </span>
                            ) : (
                              <span>
                                <span
                                  onClick={() => matchingTrainee && onSelectTraineeForReview(matchingTrainee)}
                                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                                >
                                  {act.traineeName}
                                </span>{' '}
                                just completed a{' '}
                                {act.workoutDuration || '56-minute'}{' '}
                                <span
                                  onClick={() => matchingTrainee && onSelectTraineeForProgram(matchingTrainee)}
                                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                                >
                                  {act.workoutName || 'Push Day'} 🏋️
                                </span>{' '}
                                workout.
                              </span>
                            )}
                          </div>

                          {/* Subtitle description (e.g. She lifted 7,800 kg over 23 sets) */}
                          {!act.isInvitationAccepted && !act.measurementText && act.description && (
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                              {act.description}
                            </p>
                          )}

                          {/* Exercise List if available (e.g. Wilson's pull workout) */}
                          {act.exercisesList && act.exercisesList.length > 0 && (
                            <div className="pt-2 pl-1 space-y-1 text-xs text-slate-600 dark:text-zinc-400">
                              {act.exercisesList.map((exName, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <span className="text-sm">🏋️</span>
                                  <span className="font-medium text-slate-800 dark:text-zinc-300">
                                    {exName}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Coach Note / Feedback */}
                          {act.coachNote && (
                            <div className="mt-2 p-2.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-xs">
                              <span className="font-semibold text-blue-700 dark:text-blue-300">
                                Coach Note:{' '}
                              </span>
                              <span className="text-slate-700 dark:text-zinc-300 italic">
                                "{act.coachNote}"
                              </span>
                            </div>
                          )}

                          {/* Inline reply form */}
                          {isReplying && (
                            <div className="pt-2 flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="Add coach cue or message..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSendCoachNote(act.id);
                                }}
                                className="flex-1 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSendCoachNote(act.id)}
                                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                              >
                                Send
                              </button>
                              <button
                                onClick={() => {
                                  setActiveReplyId(null);
                                  setReplyText('');
                                }}
                                className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:text-zinc-400"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right side: Timestamp & quick action */}
                      <div className="flex flex-col items-end shrink-0 pl-2">
                        <span className="text-xs text-slate-400 dark:text-zinc-500 whitespace-nowrap">
                          {act.timestamp}
                        </span>

                        {!isReplying && (
                          <button
                            onClick={() => {
                              setActiveReplyId(act.id);
                              setReplyText(act.coachNote || '');
                            }}
                            className="text-[11px] font-medium text-slate-400 hover:text-blue-600 dark:text-zinc-500 dark:hover:text-blue-400 mt-1 transition-colors flex items-center gap-1"
                            title="Add coach feedback"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>Reply</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Weekly Active Clients (approx 5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between h-[380px]">
          {/* Card Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
            <h2 className={`text-base sm:text-lg font-bold ${isBright ? 'text-slate-900' : 'text-white'}`}>
              Weekly Active Clients
            </h2>
          </div>

          {/* Chart Component */}
          <div className="flex-1 pt-4 flex flex-col justify-center">
            <WeeklyActiveChart />
          </div>
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
