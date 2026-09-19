// components/admin/coaches/CoachManagementView.tsx
// Administrative Coach Management Module for Letenent Admin Control Center
// Supports multi-criteria filtering, search, sorting, statistics, and individual coach management.

import React, { useState, useEffect, useRef } from 'react';
import {
  CoachRecord,
  CoachStatistics,
  CoachQueryParams,
  User,
} from '@/types';
import { adminCoachService } from '@/lib/services/adminCoachService';
import { CoachStatusBadge } from './CoachStatusBadge';
import { CoachTableSkeleton } from './CoachTableSkeleton';
import { CoachDetailsView } from './CoachDetailsView';
import { AddCoachModal } from './AddCoachModal';
import { EditCoachModal } from './EditCoachModal';
import { SuspendCoachModal } from './SuspendCoachModal';
import { ActivateCoachModal } from './ActivateCoachModal';
import {
  Users,
  UserPlus,
  Search,
  X,
  Filter,
  Download,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Folder,
  Activity,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Eye,
  Edit2,
} from 'lucide-react';

interface CoachManagementViewProps {
  currentUser: User;
  onNavigateToUser?: (userId: string) => void;
  initialSelectedCoachId?: string | null;
}

export const CoachManagementView: React.FC<CoachManagementViewProps> = ({
  currentUser,
  onNavigateToUser,
  initialSelectedCoachId,
}) => {
  // Navigation / Selection State
  const [selectedCoachId, setSelectedCoachId] = useState<string | null>(initialSelectedCoachId || null);

  // Data & Query States
  const [coaches, setCoaches] = useState<CoachRecord[]>([]);
  const [stats, setStats] = useState<CoachStatistics | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'>('ALL');
  const [activityFilter, setActivityFilter] = useState<'ALL' | 'RECENT' | '7D' | '30D'>('ALL');
  const [traineeCountFilter, setTraineeCountFilter] = useState<'ALL' | 'ZERO' | '1_10' | '11_25' | '26_PLUS'>('ALL');
  const [programFilter, setProgramFilter] = useState<'ALL' | 'NO_PROGRAMS' | 'HAS_ACTIVE'>('ALL');
  const [joinedFilter, setJoinedFilter] = useState<'ALL' | 'TODAY' | '7D' | '30D' | 'CUSTOM'>('ALL');
  const [customDateStart, setCustomDateStart] = useState('');
  const [customDateEnd, setCustomDateEnd] = useState('');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Sort & Pagination states
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'trainees' | 'programs' | 'lastActive' | 'joined' | 'status'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [coachToEdit, setCoachToEdit] = useState<CoachRecord | null>(null);
  const [coachToSuspend, setCoachToSuspend] = useState<CoachRecord | null>(null);
  const [coachToActivate, setCoachToActivate] = useState<CoachRecord | null>(null);

  // Action Menu Dropdown tracking
  const [openMenuCoachId, setOpenMenuCoachId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuCoachId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Fetch coaches and platform stats
  const fetchCoachesData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams: CoachQueryParams = {
        searchQuery,
        statusFilter,
        activityFilter,
        traineeCountFilter,
        programFilter,
        joinedFilter,
        customDateStart: joinedFilter === 'CUSTOM' ? customDateStart : undefined,
        customDateEnd: joinedFilter === 'CUSTOM' ? customDateEnd : undefined,
        sortBy,
        sortDirection,
        page,
        pageSize,
      };

      const [coachesRes, statsRes] = await Promise.all([
        adminCoachService.getCoaches(queryParams),
        adminCoachService.getCoachStats(),
      ]);

      setCoaches(coachesRes.coaches);
      setTotalCount(coachesRes.totalCount);
      setTotalPages(coachesRes.totalPages);
      setStats(statsRes);
    } catch (err: any) {
      console.error('Failed to query coaches:', err);
      setError(err?.message || 'Failed to retrieve coach records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoachesData();
  }, [
    searchQuery,
    statusFilter,
    activityFilter,
    traineeCountFilter,
    programFilter,
    joinedFilter,
    customDateStart,
    customDateEnd,
    sortBy,
    sortDirection,
    page,
    pageSize,
  ]);

  // Reset page to 1 when filters change
  const handleFilterChange = (setter: (val: any) => void, value: any) => {
    setter(value);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setActivityFilter('ALL');
    setTraineeCountFilter('ALL');
    setProgramFilter('ALL');
    setJoinedFilter('ALL');
    setCustomDateStart('');
    setCustomDateEnd('');
    setPage(1);
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'ALL' ||
    activityFilter !== 'ALL' ||
    traineeCountFilter !== 'ALL' ||
    programFilter !== 'ALL' ||
    joinedFilter !== 'ALL';

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
    setPage(1);
  };

  // Export handlers
  const handleExportCSV = () => {
    if (coaches.length === 0) return;
    const headers = [
      'ID',
      'Name',
      'Email',
      'Phone',
      'Title',
      'Status',
      'Trainees',
      'Active Programs',
      'Joined Date',
      'Last Active',
    ];
    const rows = coaches.map((c) => [
      c.id,
      `"${c.name}"`,
      c.email,
      c.phone || '',
      `"${c.professionalTitle || ''}"`,
      c.status,
      c.traineesCount || 0,
      c.activeProgramsCount || 0,
      c.createdAt,
      c.lastActiveAt,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `letenent_coaches_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Mutations
  const handleCreateCoach = async (payload: any) => {
    const created = await adminCoachService.createCoach(payload, currentUser);
    await fetchCoachesData();
    return created;
  };

  const handleUpdateCoach = async (id: string, data: any) => {
    await adminCoachService.updateCoach(id, data, currentUser);
    await fetchCoachesData();
  };

  const handleSuspendCoach = async (id: string, reason: string) => {
    await adminCoachService.suspendCoach(id, reason, currentUser);
    await fetchCoachesData();
  };

  const handleActivateCoach = async (id: string) => {
    await adminCoachService.activateCoach(id, currentUser);
    await fetchCoachesData();
  };

  // If a coach is selected, render the dedicated Coach Details view
  if (selectedCoachId) {
    return (
      <CoachDetailsView
        coachId={selectedCoachId}
        currentUser={currentUser}
        onBack={() => {
          setSelectedCoachId(null);
          fetchCoachesData();
        }}
        onViewTrainee={onNavigateToUser}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Section per Section 6 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Coaches</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage coaches and monitor their activity across the Letenent platform.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            title="Export CSV"
            className="px-3 py-2 rounded-xl text-xs font-semibold text-zinc-300 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-colors inline-flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#1877F2] hover:bg-[#1877F2]/90 transition-colors inline-flex items-center gap-1.5 shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Add Coach</span>
          </button>
        </div>
      </div>

      {/* 2. Top Statistics Cards per Section 7 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-medium uppercase tracking-wider">Total Coaches</span>
            <Users className="w-4 h-4 text-[#1877F2]" />
          </div>
          <p className="text-2xl font-bold text-white">{stats ? stats.totalCoaches : '—'}</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-medium uppercase tracking-wider">Active</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400">{stats ? stats.activeCoaches : '—'}</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-medium uppercase tracking-wider">Inactive</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400">
            {stats ? stats.inactiveCoaches : '—'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-medium uppercase tracking-wider">Total Trainees</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats ? stats.totalTrainees : '—'}</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-medium uppercase tracking-wider">Active Programs</span>
            <Folder className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats ? stats.activePrograms : '—'}</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-medium uppercase tracking-wider">Avg Trainees</span>
            <Activity className="w-4 h-4 text-[#1877F2]" />
          </div>
          <p className="text-2xl font-bold text-white">
            {stats ? stats.avgTraineesPerCoach : '—'}
          </p>
        </div>
      </div>

      {/* 3. Search and Quick Filters Bar per Section 8 & 9 */}
      <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search coaches by name or email..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#1877F2]"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Drawer Toggle & Quick Status Chips */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            {/* Status Pills */}
            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
              {(['ALL', 'ACTIVE', 'INACTIVE', 'SUSPENDED'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => handleFilterChange(setStatusFilter, s)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                    statusFilter === s
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            {/* Advanced Filters Button */}
            <button
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors inline-flex items-center gap-1.5 ${
                isFilterDrawerOpen || hasActiveFilters
                  ? 'bg-[#1877F2]/10 border-[#1877F2]/40 text-[#1877F2]'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#1877F2] animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* Expandable Advanced Filters per Section 9 */}
        {isFilterDrawerOpen && (
          <div className="pt-3 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in">
            {/* Coach Activity Recency */}
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Coach Activity
              </label>
              <select
                value={activityFilter}
                onChange={(e) => handleFilterChange(setActivityFilter, e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#1877F2]"
              >
                <option value="ALL">All Activity</option>
                <option value="RECENT">Active Recently (&lt; 24h)</option>
                <option value="7D">Inactive 7+ Days</option>
                <option value="30D">Inactive 30+ Days</option>
              </select>
            </div>

            {/* Trainee Count */}
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Trainee Count
              </label>
              <select
                value={traineeCountFilter}
                onChange={(e) => handleFilterChange(setTraineeCountFilter, e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#1877F2]"
              >
                <option value="ALL">All Counts</option>
                <option value="ZERO">No Trainees (0)</option>
                <option value="1_10">1 – 10 Trainees</option>
                <option value="11_25">11 – 25 Trainees</option>
                <option value="26_PLUS">26+ Trainees</option>
              </select>
            </div>

            {/* Program Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Programs Managed
              </label>
              <select
                value={programFilter}
                onChange={(e) => handleFilterChange(setProgramFilter, e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#1877F2]"
              >
                <option value="ALL">All Programs</option>
                <option value="NO_PROGRAMS">No Programs</option>
                <option value="HAS_ACTIVE">Has Active Programs</option>
              </select>
            </div>

            {/* Joined Date Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Joined Date
              </label>
              <select
                value={joinedFilter}
                onChange={(e) => handleFilterChange(setJoinedFilter, e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#1877F2]"
              >
                <option value="ALL">All Time</option>
                <option value="TODAY">Today</option>
                <option value="7D">Last 7 Days</option>
                <option value="30D">Last 30 Days</option>
                <option value="CUSTOM">Custom Date Range</option>
              </select>
            </div>

            {/* Custom Date Range if selected */}
            {joinedFilter === 'CUSTOM' && (
              <div className="sm:col-span-2 lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={customDateStart}
                    onChange={(e) => {
                      setCustomDateStart(e.target.value);
                      setPage(1);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#1877F2]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={customDateEnd}
                    onChange={(e) => {
                      setCustomDateEnd(e.target.value);
                      setPage(1);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#1877F2]"
                  />
                </div>
              </div>
            )}

            {/* Clear Filters Action */}
            {hasActiveFilters && (
              <div className="sm:col-span-2 lg:col-span-4 flex justify-end pt-1">
                <button
                  onClick={handleClearFilters}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-800 transition-colors inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Table / Content Section */}
      {isLoading ? (
        <CoachTableSkeleton />
      ) : error ? (
        <div className="p-8 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
          <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
          <h3 className="text-sm font-bold text-white">Error Loading Coaches</h3>
          <p className="text-xs text-zinc-400">{error}</p>
          <button
            onClick={fetchCoachesData}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#1877F2] hover:bg-[#1877F2]/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : coaches.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
          <Users className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Coaches Found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            {hasActiveFilters
              ? 'No coaches match your search criteria or active filter settings.'
              : 'There are currently no coach accounts registered on the platform.'}
          </p>
          {hasActiveFilters ? (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
            >
              Clear Filters
            </button>
          ) : (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#1877F2] hover:bg-[#1877F2]/90 transition-colors"
            >
              Add First Coach
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Responsive Desktop Table per Section 12 */}
          <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-950/80 border-b border-zinc-800 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider select-none">
                    {/* Coach Name Column */}
                    <th
                      onClick={() => handleSort('name')}
                      className="py-3 px-4 cursor-pointer hover:text-white"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Coach</span>
                        <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                      </div>
                    </th>

                    {/* Email Column */}
                    <th
                      onClick={() => handleSort('email')}
                      className="py-3 px-4 cursor-pointer hover:text-white hidden md:table-cell"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Email</span>
                        <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                      </div>
                    </th>

                    {/* Trainees Count Column */}
                    <th
                      onClick={() => handleSort('trainees')}
                      className="py-3 px-4 cursor-pointer hover:text-white"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Trainees</span>
                        <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                      </div>
                    </th>

                    {/* Active Programs Column */}
                    <th
                      onClick={() => handleSort('programs')}
                      className="py-3 px-4 cursor-pointer hover:text-white hidden sm:table-cell"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Programs</span>
                        <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                      </div>
                    </th>

                    {/* Last Active Column */}
                    <th
                      onClick={() => handleSort('lastActive')}
                      className="py-3 px-4 cursor-pointer hover:text-white hidden lg:table-cell"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Last Active</span>
                        <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                      </div>
                    </th>

                    {/* Status Column */}
                    <th
                      onClick={() => handleSort('status')}
                      className="py-3 px-4 cursor-pointer hover:text-white"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Status</span>
                        <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                      </div>
                    </th>

                    {/* Joined Column */}
                    <th
                      onClick={() => handleSort('joined')}
                      className="py-3 px-4 cursor-pointer hover:text-white hidden xl:table-cell"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Joined</span>
                        <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                      </div>
                    </th>

                    {/* Actions Column */}
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-800/60">
                  {coaches.map((coach) => (
                    <tr
                      key={coach.id}
                      className="hover:bg-zinc-800/30 transition-colors group cursor-pointer"
                      onClick={() => setSelectedCoachId(coach.id)}
                    >
                      {/* Coach Name + Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {coach.avatarUrl ? (
                            <img
                              src={coach.avatarUrl}
                              alt={coach.name}
                              className="w-9 h-9 rounded-xl object-cover border border-zinc-700 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-zinc-300 text-xs shrink-0">
                              {(coach.firstName?.[0] || '') + (coach.lastName?.[0] || '')}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-white group-hover:text-[#1877F2] transition-colors">
                              {coach.name}
                            </div>
                            <div className="text-[11px] text-zinc-400">
                              {coach.professionalTitle || 'Coaching Specialist'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 text-zinc-400 hidden md:table-cell">
                        {coach.email}
                      </td>

                      {/* Trainees */}
                      <td className="py-3.5 px-4 font-semibold text-zinc-200">
                        <span className="px-2 py-0.5 rounded-lg bg-zinc-800 border border-zinc-700">
                          {coach.traineesCount || 0}
                        </span>
                      </td>

                      {/* Active Programs */}
                      <td className="py-3.5 px-4 text-zinc-400 hidden sm:table-cell">
                        <span className="px-2 py-0.5 rounded-lg bg-zinc-800 border border-zinc-700">
                          {coach.activeProgramsCount || 0}
                        </span>
                      </td>

                      {/* Last Active */}
                      <td className="py-3.5 px-4 text-zinc-400 hidden lg:table-cell">
                        {new Date(coach.lastActiveAt).toLocaleDateString()}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <CoachStatusBadge status={coach.status} />
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 text-zinc-400 hidden xl:table-cell">
                        {new Date(coach.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions Menu */}
                      <td
                        className="py-3.5 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="relative inline-block text-left" ref={menuRef}>
                          <button
                            onClick={() =>
                              setOpenMenuCoachId(
                                openMenuCoachId === coach.id ? null : coach.id
                              )
                            }
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                            aria-label="Coach actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Dropdown Menu per Section 13 */}
                          {openMenuCoachId === coach.id && (
                            <div className="absolute right-0 mt-1 w-48 rounded-xl bg-zinc-950 border border-zinc-800 shadow-2xl z-30 py-1.5 animate-in fade-in">
                              <button
                                onClick={() => {
                                  setSelectedCoachId(coach.id);
                                  setOpenMenuCoachId(null);
                                }}
                                className="w-full px-3.5 py-1.5 text-left text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 flex items-center gap-2"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View Coach</span>
                              </button>

                              <button
                                onClick={() => {
                                  setCoachToEdit(coach);
                                  setOpenMenuCoachId(null);
                                }}
                                className="w-full px-3.5 py-1.5 text-left text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 flex items-center gap-2"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                <span>Edit Coach</span>
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedCoachId(coach.id);
                                  setOpenMenuCoachId(null);
                                }}
                                className="w-full px-3.5 py-1.5 text-left text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 flex items-center gap-2"
                              >
                                <Users className="w-3.5 h-3.5" />
                                <span>View Trainees</span>
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedCoachId(coach.id);
                                  setOpenMenuCoachId(null);
                                }}
                                className="w-full px-3.5 py-1.5 text-left text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 flex items-center gap-2"
                              >
                                <Folder className="w-3.5 h-3.5" />
                                <span>View Programs</span>
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedCoachId(coach.id);
                                  setOpenMenuCoachId(null);
                                }}
                                className="w-full px-3.5 py-1.5 text-left text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 flex items-center gap-2"
                              >
                                <Activity className="w-3.5 h-3.5" />
                                <span>View Activity</span>
                              </button>

                              <div className="border-t border-zinc-800/80 my-1" />

                              {coach.status === 'SUSPENDED' ? (
                                <button
                                  onClick={() => {
                                    setCoachToActivate(coach);
                                    setOpenMenuCoachId(null);
                                  }}
                                  className="w-full px-3.5 py-1.5 text-left text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-2"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Activate Coach</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setCoachToSuspend(coach);
                                    setOpenMenuCoachId(null);
                                  }}
                                  className="w-full px-3.5 py-1.5 text-left text-xs font-medium text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                                >
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  <span>Suspend Coach</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. Pagination Controls per Section 12 */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-zinc-400">
              Showing{' '}
              <span className="font-semibold text-white">
                {totalCount > 0 ? (page - 1) * pageSize + 1 : 0}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-white">
                {Math.min(page * pageSize, totalCount)}
              </span>{' '}
              of <span className="font-semibold text-white">{totalCount}</span> coaches
            </div>

            <div className="flex items-center gap-4">
              {/* Page Size Picker */}
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <span>Rows:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#1877F2]"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              {/* Page Nav Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-40 disabled:hover:text-zinc-400 transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="px-2.5 text-xs font-semibold text-zinc-300">
                  {page} / {totalPages}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-40 disabled:hover:text-zinc-400 transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Modals */}
      <AddCoachModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCreate={handleCreateCoach}
      />

      <EditCoachModal
        isOpen={!!coachToEdit}
        coach={coachToEdit}
        onClose={() => setCoachToEdit(null)}
        onSave={handleUpdateCoach}
      />

      <SuspendCoachModal
        isOpen={!!coachToSuspend}
        coach={coachToSuspend}
        onClose={() => setCoachToSuspend(null)}
        onConfirm={handleSuspendCoach}
      />

      <ActivateCoachModal
        isOpen={!!coachToActivate}
        coach={coachToActivate}
        onClose={() => setCoachToActivate(null)}
        onConfirm={handleActivateCoach}
      />
    </div>
  );
};
