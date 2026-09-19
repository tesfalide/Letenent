// components/admin/AdminDashboard.tsx
// Core Letenent Platform Master Dashboard (/admin/dashboard)

import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Activity,
  Zap,
  Folder,
  Dumbbell,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  Megaphone,
  UserPlus,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Server,
  Database,
  Lock,
  HardDrive,
  Bell,
  Cpu,
} from 'lucide-react';
import { useTheme } from '@/src/context/ThemeContext';
import {
  PLATFORM_STATS,
  USER_GROWTH_DATA,
  RECENT_PLATFORM_ACTIVITIES,
  POPULAR_PROGRAMS,
  SYSTEM_HEALTH_SERVICES,
  RECENTLY_REGISTERED_USERS,
  DateRange,
  PlatformActivity,
  PopularProgram,
} from './AdminData';
import { AdminQuickActionModal, QuickActionType } from './AdminQuickActionModal';
import { AdminSectionKey } from './AdminPlaceholderView';

interface AdminDashboardProps {
  onNavigateSection: (section: AdminSectionKey) => void;
  onOpenQuickAction: (action: QuickActionType) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateSection,
  onOpenQuickAction,
}) => {
  const { isBright } = useTheme();

  // Date range for User Growth chart
  const [dateRange, setDateRange] = useState<DateRange>('6M');
  const [selectedSeries, setSelectedSeries] = useState<'ALL' | 'COACHES' | 'TRAINEES'>('ALL');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Filter/tab for Platform Activity
  const [activityFilter, setActivityFilter] = useState<'ALL' | 'COACH' | 'TRAINEE'>('ALL');

  // Refresh animation simulation
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState('Just now');

  const handleManualRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLastRefreshedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 600);
  };

  // Filtered growth series
  const growthData = USER_GROWTH_DATA[dateRange] || USER_GROWTH_DATA['6M'];
  const maxGrowthValue = Math.max(...growthData.map((d) => (selectedSeries === 'COACHES' ? d.coaches : selectedSeries === 'TRAINEES' ? d.trainees : d.total)));

  // Filtered activity items
  const filteredActivities = RECENT_PLATFORM_ACTIVITIES.filter((item) => {
    if (activityFilter === 'COACH') return item.actorRole === 'COACH';
    if (activityFilter === 'TRAINEE') return item.actorRole === 'TRAINEE';
    return true;
  });

  // User Distribution numbers
  const totalUsersCount = 1248;
  const coachesCount = 84;
  const traineesCount = 1164;
  const adminsCount = 1;

  // Donut chart math
  const coachAngle = (coachesCount / totalUsersCount) * 360;
  const traineeAngle = (traineesCount / totalUsersCount) * 360;
  const adminAngle = (adminsCount / totalUsersCount) * 360;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Header & Live Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
              <span>Good morning, Admin</span>
              <span className="inline-block animate-wave">👋</span>
            </h1>
          </div>
          <p className={`text-xs sm:text-sm mt-1 ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
            Here's what's happening across your Letenent platform.
          </p>
        </div>

        {/* Live status badge & manual refresh */}
        <div className="flex items-center gap-2.5">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
              isBright ? 'bg-white border-slate-200 text-slate-700 shadow-sm' : 'bg-zinc-900 border-zinc-800 text-zinc-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="text-[11px] font-mono">Live Telemetry</span>
            <span className="text-[10px] text-zinc-500">({lastRefreshedAt})</span>
          </div>

          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={refreshing}
            title="Refresh platform telemetry"
            className={`p-2 rounded-xl border transition-all ${
              isBright
                ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#1877F2]' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Platform Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {PLATFORM_STATS.map((stat) => {
          let Icon = Users;
          if (stat.iconName === 'shield') Icon = ShieldCheck;
          if (stat.iconName === 'activity') Icon = Activity;
          if (stat.iconName === 'zap') Icon = Zap;
          if (stat.iconName === 'folder') Icon = Folder;
          if (stat.iconName === 'dumbbell') Icon = Dumbbell;

          return (
            <div
              key={stat.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                isBright
                  ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  : 'bg-zinc-950 border-zinc-850 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-400">
                  {stat.label}
                </span>
                <div
                  className={`p-1.5 rounded-lg ${
                    stat.id === 'total_coaches'
                      ? 'bg-purple-500/10 text-purple-400'
                      : stat.id === 'total_trainees'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : stat.id === 'active_users'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-blue-500/10 text-[#1877F2]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="mt-2 space-y-0.5">
                <div className="text-xl sm:text-2xl font-black tracking-tight">{stat.value}</div>
                <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-500">
                  {stat.changeType === 'positive' && <ArrowUpRight className="w-3 h-3" />}
                  <span>{stat.subtext}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Quick Actions Toolbar */}
      <div
        className={`p-4 sm:p-5 rounded-3xl border shadow-sm space-y-3 ${
          isBright ? 'bg-white border-slate-200' : 'bg-zinc-950 border-zinc-800'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Quick Administrative Actions
            </h2>
          </div>
          <span className="text-[11px] text-zinc-500 hidden sm:inline">1-click provisioning</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          <button
            type="button"
            onClick={() => onOpenQuickAction('ADD_USER')}
            className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
              isBright
                ? 'bg-slate-50 hover:bg-blue-50/50 hover:border-blue-300 border-slate-200 text-slate-800'
                : 'bg-zinc-900/60 hover:bg-zinc-850 hover:border-zinc-700 border-zinc-800 text-zinc-200'
            }`}
          >
            <div className="w-7 h-7 rounded-xl bg-blue-500/10 text-[#1877F2] flex items-center justify-center shrink-0">
              <UserPlus className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="text-xs font-bold truncate">Add User</div>
              <div className="text-[10px] text-zinc-400 truncate">General account</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onOpenQuickAction('ADD_COACH')}
            className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
              isBright
                ? 'bg-slate-50 hover:bg-purple-50/50 hover:border-purple-300 border-slate-200 text-slate-800'
                : 'bg-zinc-900/60 hover:bg-zinc-850 hover:border-zinc-700 border-zinc-800 text-zinc-200'
            }`}
          >
            <div className="w-7 h-7 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="text-xs font-bold truncate">Add Coach</div>
              <div className="text-[10px] text-zinc-400 truncate">Verified roster</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onOpenQuickAction('ADD_TRAINEE')}
            className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
              isBright
                ? 'bg-slate-50 hover:bg-emerald-50/50 hover:border-emerald-300 border-slate-200 text-slate-800'
                : 'bg-zinc-900/60 hover:bg-zinc-850 hover:border-zinc-700 border-zinc-800 text-zinc-200'
            }`}
          >
            <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Plus className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="text-xs font-bold truncate">Add Trainee</div>
              <div className="text-[10px] text-zinc-400 truncate">Athlete invite</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onOpenQuickAction('ADD_EXERCISE')}
            className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
              isBright
                ? 'bg-slate-50 hover:bg-amber-50/50 hover:border-amber-300 border-slate-200 text-slate-800'
                : 'bg-zinc-900/60 hover:bg-zinc-850 hover:border-zinc-700 border-zinc-800 text-zinc-200'
            }`}
          >
            <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="text-xs font-bold truncate">Add Exercise</div>
              <div className="text-[10px] text-zinc-400 truncate">Global catalog</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onOpenQuickAction('CREATE_ANNOUNCEMENT')}
            className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 col-span-2 sm:col-span-1 ${
              isBright
                ? 'bg-slate-50 hover:bg-rose-50/50 hover:border-rose-300 border-slate-200 text-slate-800'
                : 'bg-zinc-900/60 hover:bg-zinc-850 hover:border-zinc-700 border-zinc-800 text-zinc-200'
            }`}
          >
            <div className="w-7 h-7 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
              <Megaphone className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="text-xs font-bold truncate">Announcement</div>
              <div className="text-[10px] text-zinc-400 truncate">System alert</div>
            </div>
          </button>
        </div>
      </div>

      {/* 4. Main Analytics Row: User Growth Chart & User Distribution Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth Chart (2 Cols) */}
        <div
          className={`lg:col-span-2 p-5 sm:p-6 rounded-3xl border shadow-sm flex flex-col justify-between space-y-4 ${
            isBright ? 'bg-white border-slate-200' : 'bg-zinc-950 border-zinc-800'
          }`}
        >
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#1877F2]" />
                <h2 className="text-base font-bold tracking-tight">User Growth</h2>
              </div>
              <p className={`text-xs ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                New verified accounts registered across time
              </p>
            </div>

            {/* Date Range Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              {(['7D', '30D', '90D', '6M', '1Y'] as DateRange[]).map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setDateRange(range)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    dateRange === range
                      ? 'bg-[#1877F2] text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Series Toggle: All / Coaches / Trainees */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] text-zinc-400 mr-1">Series:</span>
            <button
              type="button"
              onClick={() => setSelectedSeries('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                selectedSeries === 'ALL'
                  ? 'bg-zinc-800 text-white border-zinc-700'
                  : 'text-zinc-400 border-transparent hover:text-white'
              }`}
            >
              Combined Total
            </button>
            <button
              type="button"
              onClick={() => setSelectedSeries('COACHES')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                selectedSeries === 'COACHES'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  : 'text-zinc-400 border-transparent hover:text-purple-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>Coaches</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedSeries('TRAINEES')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                selectedSeries === 'TRAINEES'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'text-zinc-400 border-transparent hover:text-emerald-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Trainees</span>
            </button>
          </div>

          {/* Responsive SVG Chart */}
          <div className="relative h-64 w-full pt-4">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 500 200"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="growthAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1877F2" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#1877F2" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="coachesAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A855F7" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#A855F7" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="traineesAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => (
                <line
                  key={idx}
                  x1="0"
                  y1={200 - ratio * 180}
                  x2="500"
                  y2={200 - ratio * 180}
                  stroke={isBright ? '#e2e8f0' : '#27272a'}
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
              ))}

              {/* Path calculation */}
              {(() => {
                const points = growthData.map((d, index) => {
                  const val =
                    selectedSeries === 'COACHES'
                      ? d.coaches
                      : selectedSeries === 'TRAINEES'
                      ? d.trainees
                      : d.total;
                  const x = (index / (growthData.length - 1)) * 500;
                  const y = 200 - (val / (maxGrowthValue || 1)) * 170 - 15;
                  return { x, y, val, label: d.label, data: d };
                });

                const lineCommand = points.reduce((acc, p, i) => {
                  return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
                }, '');

                const areaCommand = `${lineCommand} L 500 200 L 0 200 Z`;

                const strokeColor =
                  selectedSeries === 'COACHES'
                    ? '#A855F7'
                    : selectedSeries === 'TRAINEES'
                    ? '#10B981'
                    : '#1877F2';

                const gradientId =
                  selectedSeries === 'COACHES'
                    ? 'url(#coachesAreaGradient)'
                    : selectedSeries === 'TRAINEES'
                    ? 'url(#traineesAreaGradient)'
                    : 'url(#growthAreaGradient)';

                return (
                  <>
                    <path d={areaCommand} fill={gradientId} />
                    <path
                      d={lineCommand}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Data interactive points */}
                    {points.map((p, idx) => {
                      const isHovered = hoveredPointIndex === idx;
                      return (
                        <g key={idx} className="cursor-pointer">
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r={isHovered ? 6 : 4}
                            fill={strokeColor}
                            stroke={isBright ? '#ffffff' : '#09090b'}
                            strokeWidth="2"
                            onMouseEnter={() => setHoveredPointIndex(idx)}
                            onMouseLeave={() => setHoveredPointIndex(null)}
                          />
                        </g>
                      );
                    })}
                  </>
                );
              })()}
            </svg>

            {/* Bottom X-Axis labels */}
            <div className="flex justify-between mt-2 px-1 text-[10px] font-mono text-zinc-400">
              {growthData.map((d, i) => (
                <span key={i}>{d.label}</span>
              ))}
            </div>

            {/* Hover Tooltip Overlay if active */}
            {hoveredPointIndex !== null && growthData[hoveredPointIndex] && (
              <div
                className={`absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl border text-xs font-mono shadow-xl pointer-events-none z-10 ${
                  isBright ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-900 border-zinc-700 text-white'
                }`}
              >
                <div className="font-bold text-[11px] text-[#1877F2]">
                  {growthData[hoveredPointIndex].label}
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-[11px]">
                  <span>Total: <strong>{growthData[hoveredPointIndex].total}</strong></span>
                  <span className="text-purple-400">Coaches: <strong>{growthData[hoveredPointIndex].coaches}</strong></span>
                  <span className="text-emerald-400">Trainees: <strong>{growthData[hoveredPointIndex].trainees}</strong></span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User Distribution Donut Chart (1 Col) */}
        <div
          className={`p-5 sm:p-6 rounded-3xl border shadow-sm flex flex-col justify-between space-y-4 ${
            isBright ? 'bg-white border-slate-200' : 'bg-zinc-950 border-zinc-800'
          }`}
        >
          <div>
            <h2 className="text-base font-bold tracking-tight">User Distribution</h2>
            <p className={`text-xs ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
              Account classification across active roles
            </p>
          </div>

          {/* Donut graphic with center count */}
          <div className="relative flex items-center justify-center my-2">
            <svg className="w-48 h-48 -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke={isBright ? '#f1f5f9' : '#18181b'}
                strokeWidth="12"
              />

              {/* Trainees Segment (93.2%) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#10B981"
                strokeWidth="12"
                strokeDasharray={`${(traineesCount / totalUsersCount) * 251.2} 251.2`}
                strokeDashoffset="0"
                strokeLinecap="round"
              />

              {/* Coaches Segment (6.7%) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#A855F7"
                strokeWidth="12"
                strokeDasharray={`${(coachesCount / totalUsersCount) * 251.2} 251.2`}
                strokeDashoffset={`-${(traineesCount / totalUsersCount) * 251.2}`}
              />

              {/* Admins Segment (0.1%) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#1877F2"
                strokeWidth="12"
                strokeDasharray={`${(adminsCount / totalUsersCount) * 251.2} 251.2`}
                strokeDashoffset={`-${((traineesCount + coachesCount) / totalUsersCount) * 251.2}`}
              />
            </svg>

            {/* Donut Center Total Counter */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                Total Users
              </span>
              <span className="text-2xl font-black tracking-tight">{totalUsersCount.toLocaleString()}</span>
              <span className="text-[10px] text-emerald-500 font-bold">100% Verified</span>
            </div>
          </div>

          {/* Breakdown Legend */}
          <div className="space-y-2 pt-2 border-t border-zinc-800/60">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Athletes / Trainees</span>
              </div>
              <span className="font-mono font-bold">{traineesCount} (93.3%)</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span>Verified Coaches</span>
              </div>
              <span className="font-mono font-bold">{coachesCount} (6.7%)</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1877F2]" />
                <span>Platform Admins</span>
              </div>
              <span className="font-mono font-bold">{adminsCount} (0.1%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Platform Activity & System Health Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform Activity (2 Cols) */}
        <div
          className={`lg:col-span-2 p-5 sm:p-6 rounded-3xl border shadow-sm space-y-4 ${
            isBright ? 'bg-white border-slate-200' : 'bg-zinc-950 border-zinc-800'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <h2 className="text-base font-bold tracking-tight">Platform Activity</h2>
              </div>
              <p className={`text-xs ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                Real-time operational stream across coaches and trainees
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <button
                type="button"
                onClick={() => setActivityFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activityFilter === 'ALL'
                    ? 'bg-[#1877F2] text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                All Events
              </button>
              <button
                type="button"
                onClick={() => setActivityFilter('COACH')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activityFilter === 'COACH'
                    ? 'bg-[#1877F2] text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Coaches
              </button>
              <button
                type="button"
                onClick={() => setActivityFilter('TRAINEE')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activityFilter === 'TRAINEE'
                    ? 'bg-[#1877F2] text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Athletes
              </button>
            </div>
          </div>

          {/* Activity Event Stream */}
          <div className="divide-y divide-zinc-800/60">
            {filteredActivities.slice(0, 6).map((activity) => {
              const isCoach = activity.actorRole === 'COACH';
              const isAdmin = activity.actorRole === 'ADMIN';

              return (
                <div key={activity.id} className="py-3.5 flex items-start gap-3.5 group">
                  {/* Actor Avatar */}
                  {activity.actorAvatar ? (
                    <img
                      src={activity.actorAvatar}
                      alt={activity.actorName}
                      className="w-9 h-9 rounded-xl object-cover shrink-0 ring-1 ring-zinc-700"
                    />
                  ) : (
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isAdmin
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : isCoach
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {activity.actorName.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-1.5 text-xs">
                      <span className="font-bold">{activity.actorName}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                          isAdmin
                            ? 'bg-rose-500/15 text-rose-400'
                            : isCoach
                            ? 'bg-purple-500/15 text-purple-400'
                            : 'bg-emerald-500/15 text-emerald-400'
                        }`}
                      >
                        {activity.actorRole}
                      </span>
                      <span className={isBright ? 'text-slate-600' : 'text-zinc-400'}>
                        {activity.description}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-500">
                      <Clock className="w-3 h-3" />
                      <span>{activity.relativeTime}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between">
            <span className="text-xs text-zinc-500">Showing recent 6 events</span>
            <button
              type="button"
              onClick={() => onNavigateSection('audit_logs')}
              className="text-xs font-bold text-[#1877F2] hover:underline flex items-center gap-1"
            >
              <span>View all activity</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* System Health Section (1 Col) */}
        <div
          className={`p-5 sm:p-6 rounded-3xl border shadow-sm flex flex-col justify-between space-y-4 ${
            isBright ? 'bg-white border-slate-200' : 'bg-zinc-950 border-zinc-800'
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-blue-400" />
                <h2 className="text-base font-bold tracking-tight">System Health</h2>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-mono font-bold border border-emerald-500/30">
                All Operational
              </span>
            </div>
            <p className={`text-xs mt-1 ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
              Component status ready for live cluster telemetry
            </p>
          </div>

          <div className="space-y-3">
            {SYSTEM_HEALTH_SERVICES.map((srv) => {
              let Icon = Database;
              if (srv.id === 'srv_auth') Icon = Lock;
              if (srv.id === 'srv_storage') Icon = HardDrive;
              if (srv.id === 'srv_api') Icon = Cpu;
              if (srv.id === 'srv_notifications') Icon = Bell;

              return (
                <div
                  key={srv.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                    isBright ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/50 border-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <div className="font-bold truncate">{srv.service}</div>
                      <div className="text-[10px] text-zinc-500 truncate">{srv.details}</div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{srv.status}</span>
                    </span>
                    {srv.latencyMs && (
                      <div className="text-[10px] font-mono text-zinc-400">{srv.latencyMs}ms</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-[11px] text-zinc-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Connected to Cloud Run edge reverse proxy on port 3000.</span>
          </div>
        </div>
      </div>

      {/* 6. Popular / Active Programs Table */}
      <div
        className={`p-5 sm:p-6 rounded-3xl border shadow-sm space-y-4 ${
          isBright ? 'bg-white border-slate-200' : 'bg-zinc-950 border-zinc-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-[#1877F2]" />
              <h2 className="text-base font-bold tracking-tight">Popular / Active Programs</h2>
            </div>
            <p className={`text-xs ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
              High-enrollment training regimens & athlete completion metrics
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateSection('programs')}
            className="text-xs font-bold text-[#1877F2] hover:underline self-start sm:self-auto flex items-center gap-1"
          >
            <span>View all 327 programs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Responsive Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr
                className={`border-b ${
                  isBright ? 'border-slate-200 text-slate-500' : 'border-zinc-800 text-zinc-400'
                }`}
              >
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Program Name</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Assigned Coach</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Trainees</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Completion Rate</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Status</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {POPULAR_PROGRAMS.map((prog) => (
                <tr key={prog.id} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3.5 font-bold">
                    <div>{prog.name}</div>
                    <div className="text-[10px] font-normal text-zinc-400">
                      {prog.category} • {prog.durationWeeks} weeks
                    </div>
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      {prog.coachAvatar ? (
                        <img
                          src={prog.coachAvatar}
                          alt={prog.coachName}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 text-[10px] flex items-center justify-center font-bold">
                          {prog.coachName.slice(0, 1)}
                        </div>
                      )}
                      <span>{prog.coachName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 font-mono">{prog.traineesCount} athletes</td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${prog.completionRate}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-[11px]">{prog.completionRate}%</span>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px]">
                      {prog.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => onNavigateSection('programs')}
                      className="px-2.5 py-1 rounded-lg border text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-850 transition-colors border-zinc-800"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. Recently Registered Users */}
      <div
        className={`p-5 sm:p-6 rounded-3xl border shadow-sm space-y-4 ${
          isBright ? 'bg-white border-slate-200' : 'bg-zinc-950 border-zinc-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <h2 className="text-base font-bold tracking-tight">Recently Registered Users</h2>
            </div>
            <p className={`text-xs ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
              Newest athletes and coaches onboarding to Letenent
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateSection('users')}
            className="text-xs font-bold text-[#1877F2] hover:underline self-start sm:self-auto flex items-center gap-1"
          >
            <span>View all users</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {RECENTLY_REGISTERED_USERS.map((usr) => (
            <div
              key={usr.id}
              onClick={() => onNavigateSection('users')}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer hover:border-[#1877F2]/60 hover:bg-zinc-800/40 group ${
                isBright ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/50 border-zinc-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {usr.avatarUrl ? (
                  <img
                    src={usr.avatarUrl}
                    alt={usr.name}
                    className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-zinc-700"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-300 font-bold text-xs flex items-center justify-center shrink-0">
                    {usr.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="truncate">
                  <div className="font-bold text-xs truncate">{usr.name}</div>
                  <div className="text-[10px] text-zinc-500 truncate">{usr.email}</div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px]">
                <span
                  className={`px-1.5 py-0.5 rounded font-mono font-bold ${
                    usr.role === 'COACH'
                      ? 'bg-purple-500/15 text-purple-400'
                      : 'bg-emerald-500/15 text-emerald-400'
                  }`}
                >
                  {usr.role}
                </span>
                <span className="text-zinc-500">{usr.registrationDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
