// components/admin/users/UserManagementView.tsx
// Core Enterprise User Management module for Letenent Admin Center

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Filter,
  UserPlus,
  Download,
  MoreVertical,
  Eye,
  Edit3,
  Shield,
  Ban,
  RotateCcw,
  Send,
  MailX,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Users,
  Activity,
  UserCheck,
  UserX,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ChevronDown,
} from 'lucide-react';
import {
  AdminUserRecord,
  User,
  UserRole,
  UserAccountStatus,
  UserQueryParams,
  UserStatistics,
} from '@/types';
import { adminUserService } from '@/lib/services/adminUserService';
import { UserRoleBadge } from './UserRoleBadge';
import { UserStatusBadge } from './UserStatusBadge';
import { UserTableSkeleton } from './UserTableSkeleton';
import { EditUserModal } from './EditUserModal';
import { ChangeRoleModal } from './ChangeRoleModal';
import { SuspendUserModal } from './SuspendUserModal';
import { ActivateUserModal } from './ActivateUserModal';
import { AddUserModal } from './AddUserModal';
import { CancelInvitationModal } from './CancelInvitationModal';
import { UserDetailsView } from './UserDetailsView';

interface UserManagementViewProps {
  currentAdmin: User;
  initialSelectedUserId?: string | null;
  onNavigateToUser?: (userId: string | null) => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  currentAdmin,
  initialSelectedUserId,
  onNavigateToUser,
}) => {
  // Detail navigation state
  const [selectedUserId, setSelectedUserId] = useState<string | null>(initialSelectedUserId || null);

  // Data states
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'COACH' | 'TRAINEE'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED' | 'INVITED'>('ALL');
  const [registrationDateFilter, setRegistrationDateFilter] = useState<'ALL' | 'TODAY' | '7D' | '30D' | 'CUSTOM'>('ALL');
  const [customDateStart, setCustomDateStart] = useState('');
  const [customDateEnd, setCustomDateEnd] = useState('');
  const [lastActiveFilter, setLastActiveFilter] = useState<'ANY' | 'TODAY' | '7D' | '30D' | 'INACTIVE'>('ANY');

  // Pagination & Sorting state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'role' | 'status' | 'joined' | 'lastActive'>('joined');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // UI interaction states
  const [activeMenuUserId, setActiveMenuUserId] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal dialog targets
  const [editingUser, setEditingUser] = useState<AdminUserRecord | null>(null);
  const [changingRoleUser, setChangingRoleUser] = useState<AdminUserRecord | null>(null);
  const [suspendingUser, setSuspendingUser] = useState<AdminUserRecord | null>(null);
  const [activatingUser, setActivatingUser] = useState<AdminUserRecord | null>(null);
  const [cancellingInviteUser, setCancellingInviteUser] = useState<AdminUserRecord | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // Close menus on outside click
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuUserId(null);
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync prop changes
  useEffect(() => {
    if (initialSelectedUserId !== undefined) {
      setSelectedUserId(initialSelectedUserId);
    }
  }, [initialSelectedUserId]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Load Data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const params: UserQueryParams = {
        page: currentPage,
        pageSize,
        searchQuery: searchQuery.trim(),
        roleFilter,
        statusFilter,
        registrationDateFilter,
        customDateStart: registrationDateFilter === 'CUSTOM' ? customDateStart : undefined,
        customDateEnd: registrationDateFilter === 'CUSTOM' ? customDateEnd : undefined,
        lastActiveFilter,
        sortBy,
        sortDirection,
      };

      const [resUsers, stats] = await Promise.all([
        adminUserService.getUsers(params),
        adminUserService.getUserStatistics(),
      ]);

      setUsers(resUsers.users);
      setTotalCount(resUsers.total);
      setTotalPages(resUsers.totalPages);
      setStatistics(stats);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to fetch platform users');
    } finally {
      setIsLoading(false);
    }
  };

  // Reload when query params change
  useEffect(() => {
    if (!selectedUserId) {
      fetchData();
    }
  }, [
    currentPage,
    pageSize,
    searchQuery,
    roleFilter,
    statusFilter,
    registrationDateFilter,
    customDateStart,
    customDateEnd,
    lastActiveFilter,
    sortBy,
    sortDirection,
    selectedUserId,
  ]);

  // Reset page to 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setRoleFilter('ALL');
    setStatusFilter('ALL');
    setRegistrationDateFilter('ALL');
    setCustomDateStart('');
    setCustomDateEnd('');
    setLastActiveFilter('ANY');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    roleFilter !== 'ALL' ||
    statusFilter !== 'ALL' ||
    registrationDateFilter !== 'ALL' ||
    lastActiveFilter !== 'ANY';

  // Sorting helper
  const handleSort = (column: 'name' | 'email' | 'role' | 'status' | 'joined' | 'lastActive') => {
    if (sortBy === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="w-3 h-3 text-zinc-500 opacity-60" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-[#1877F2]" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#1877F2]" />
    );
  };

  // Action Handlers
  const handleViewUser = (user: AdminUserRecord) => {
    setActiveMenuUserId(null);
    setSelectedUserId(user.id);
    if (onNavigateToUser) {
      onNavigateToUser(user.id);
    }
  };

  const handleBackToDirectory = () => {
    setSelectedUserId(null);
    if (onNavigateToUser) {
      onNavigateToUser(null);
    }
    fetchData();
  };

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      setShowExportMenu(false);
      const data = await adminUserService.exportUsers(format);
      const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `letenent_users_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(`Exported users as ${format.toUpperCase()}`);
    } catch {
      showToast('Export failed', 'error');
    }
  };

  const handleSaveProfile = async (
    targetUserId: string,
    updates: { firstName: string; lastName: string; email: string; phone?: string; avatarUrl?: string }
  ) => {
    await adminUserService.updateUser(targetUserId, updates, currentAdmin);
    showToast('User profile updated successfully.');
    fetchData();
  };

  const handleChangeRole = async (targetUserId: string, newRole: UserRole) => {
    await adminUserService.changeUserRole(targetUserId, newRole, currentAdmin);
    showToast(`User role successfully changed to ${newRole}.`);
    fetchData();
  };

  const handleSuspend = async (targetUserId: string, reason?: string) => {
    await adminUserService.suspendUser(targetUserId, reason, currentAdmin);
    showToast('User suspended successfully.');
    fetchData();
  };

  const handleActivate = async (targetUserId: string) => {
    await adminUserService.activateUser(targetUserId, currentAdmin);
    showToast('User activated successfully.');
    fetchData();
  };

  const handleResendInvite = async (user: AdminUserRecord) => {
    setActiveMenuUserId(null);
    try {
      await adminUserService.resendInvitation(user.id, currentAdmin);
      showToast(`Invitation resent to ${user.email}`);
      fetchData();
    } catch (err: any) {
      showToast(err?.message || 'Failed to resend invite', 'error');
    }
  };

  const handleCancelInvite = async (targetUserId: string) => {
    await adminUserService.cancelInvitation(targetUserId, currentAdmin);
    showToast('Invitation cancelled.');
    fetchData();
  };

  const handleCreateUser = async (payload: {
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    phone?: string;
    avatarUrl?: string;
    initialStatus?: UserAccountStatus;
  }) => {
    await adminUserService.createUser(payload, currentAdmin);
    showToast(`Created account for ${payload.firstName} ${payload.lastName}.`);
    fetchData();
  };

  const formatRelativeTime = (dateStr: string) => {
    try {
      const ms = Date.now() - new Date(dateStr).getTime();
      const minutes = Math.floor(ms / (60 * 1000));
      if (minutes < 1) return 'Just now';
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    } catch {
      return 'Recently';
    }
  };

  // If viewing single user detail
  if (selectedUserId) {
    return (
      <UserDetailsView
        userId={selectedUserId}
        currentAdmin={currentAdmin}
        onBack={handleBackToDirectory}
        onUserUpdated={fetchData}
      />
    );
  }

  // Calculate slice indicators
  const startUserIndex = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endUserIndex = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-zinc-100" ref={menuRef}>
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-50 p-4 rounded-xl shadow-2xl border flex items-center gap-3 transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/90 border-rose-500/40 text-rose-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Users</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage all coaches, trainees, and administrators across the Letenent platform.
          </p>
        </div>

        {/* Top-Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-300 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-all flex items-center gap-1.5 shadow-sm"
              title="Export platform user registry"
            >
              <Download className="w-3.5 h-3.5 text-zinc-400" />
              <span>Export</span>
              <ChevronDown className="w-3 h-3 text-zinc-500" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl py-1.5 z-40 text-xs text-zinc-300">
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full text-left px-3.5 py-2 hover:bg-zinc-800 hover:text-white flex items-center justify-between"
                >
                  <span>Export as CSV</span>
                  <span className="text-[10px] font-mono text-zinc-500">.csv</span>
                </button>
                <button
                  onClick={() => handleExport('json')}
                  className="w-full text-left px-3.5 py-2 hover:bg-zinc-800 hover:text-white flex items-center justify-between"
                >
                  <span>Export as JSON</span>
                  <span className="text-[10px] font-mono text-zinc-500">.json</span>
                </button>
              </div>
            )}
          </div>

          {/* Add User Primary Action */}
          <button
            onClick={() => setIsAddUserOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#1877F2] hover:bg-[#1877F2]/90 transition-all flex items-center gap-2 shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add User</span>
          </button>
        </div>
      </div>

      {/* User Statistics Compact Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Total Users */}
        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Total Users</span>
            <Users className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-white tracking-tight">
              {statistics ? statistics.totalUsers.toLocaleString() : '—'}
            </span>
            <span className="text-[10px] text-zinc-500 block mt-0.5">Platform Registry</span>
          </div>
        </div>

        {/* Active Users */}
        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-medium">Active</span>
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-emerald-400 tracking-tight">
              {statistics ? statistics.activeUsers.toLocaleString() : '—'}
            </span>
            <span className="text-[10px] text-zinc-500 block mt-0.5">Permitted Access</span>
          </div>
        </div>

        {/* Coaches */}
        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#1877F2]">
            <span className="text-xs font-medium">Coaches</span>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-[#1877F2] tracking-tight">
              {statistics ? statistics.coaches.toLocaleString() : '—'}
            </span>
            <span className="text-[10px] text-zinc-500 block mt-0.5">Active Mentors</span>
          </div>
        </div>

        {/* Trainees */}
        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-teal-400">
            <span className="text-xs font-medium">Trainees</span>
            <Activity className="w-4 h-4" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-teal-400 tracking-tight">
              {statistics ? statistics.trainees.toLocaleString() : '—'}
            </span>
            <span className="text-[10px] text-zinc-500 block mt-0.5">Athletes & Lifters</span>
          </div>
        </div>

        {/* Suspended Users */}
        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 shadow-sm flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-rose-400">
            <span className="text-xs font-medium">Suspended</span>
            <UserX className="w-4 h-4" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-rose-400 tracking-tight">
              {statistics ? statistics.suspendedUsers.toLocaleString() : '—'}
            </span>
            <span className="text-[10px] text-zinc-500 block mt-0.5">Access Blocked</span>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Global User Search Field */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleFilterChange();
              }}
              placeholder="Search users by name or email..."
              className="w-full pl-9 pr-9 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  handleFilterChange();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-zinc-400 hover:text-white"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Desktop Filter Selectors */}
          <div className="hidden lg:flex items-center gap-2.5 flex-wrap">
            {/* Role Filter */}
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <span>Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value as any);
                  handleFilterChange();
                }}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-[#1877F2]"
              >
                <option value="ALL">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="COACH">Coach</option>
                <option value="TRAINEE">Trainee</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as any);
                  handleFilterChange();
                }}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-[#1877F2]"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="INVITED">Invited</option>
              </select>
            </div>

            {/* Registration Date Filter */}
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <span>Joined:</span>
              <select
                value={registrationDateFilter}
                onChange={(e) => {
                  setRegistrationDateFilter(e.target.value as any);
                  handleFilterChange();
                }}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-[#1877F2]"
              >
                <option value="ALL">All Time</option>
                <option value="TODAY">Today</option>
                <option value="7D">Last 7 Days</option>
                <option value="30D">Last 30 Days</option>
                <option value="CUSTOM">Custom Range</option>
              </select>
            </div>

            {/* Last Active Filter */}
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <span>Active:</span>
              <select
                value={lastActiveFilter}
                onChange={(e) => {
                  setLastActiveFilter(e.target.value as any);
                  handleFilterChange();
                }}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-[#1877F2]"
              >
                <option value="ANY">Any Time</option>
                <option value="TODAY">Today</option>
                <option value="7D">Last 7 Days</option>
                <option value="30D">Last 30 Days</option>
                <option value="INACTIVE">Inactive (&gt;30d)</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden w-full flex items-center justify-between">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-300 bg-zinc-800 flex items-center gap-2"
            >
              <Filter className="w-3.5 h-3.5 text-zinc-400" />
              <span>Filters {hasActiveFilters && '(Active)'}</span>
            </button>
            {hasActiveFilters && (
              <button onClick={clearAllFilters} className="text-xs text-rose-400">
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Custom date range picker if CUSTOM selected */}
        {registrationDateFilter === 'CUSTOM' && (
          <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500">From:</span>
              <input
                type="date"
                value={customDateStart}
                onChange={(e) => {
                  setCustomDateStart(e.target.value);
                  handleFilterChange();
                }}
                className="px-2 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500">To:</span>
              <input
                type="date"
                value={customDateEnd}
                onChange={(e) => {
                  setCustomDateEnd(e.target.value);
                  handleFilterChange();
                }}
                className="px-2 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs"
              />
            </div>
          </div>
        )}

        {/* Mobile Filter Drawer / Expansion */}
        {showMobileFilters && (
          <div className="lg:hidden pt-3 border-t border-zinc-800/80 grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] text-zinc-500 mb-1">Role</label>
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value as any);
                  handleFilterChange();
                }}
                className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200"
              >
                <option value="ALL">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="COACH">Coach</option>
                <option value="TRAINEE">Trainee</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-zinc-500 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as any);
                  handleFilterChange();
                }}
                className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="INVITED">Invited</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-zinc-500 mb-1">Joined</label>
              <select
                value={registrationDateFilter}
                onChange={(e) => {
                  setRegistrationDateFilter(e.target.value as any);
                  handleFilterChange();
                }}
                className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200"
              >
                <option value="ALL">All Time</option>
                <option value="TODAY">Today</option>
                <option value="7D">Last 7 Days</option>
                <option value="30D">Last 30 Days</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-zinc-500 mb-1">Last Active</label>
              <select
                value={lastActiveFilter}
                onChange={(e) => {
                  setLastActiveFilter(e.target.value as any);
                  handleFilterChange();
                }}
                className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200"
              >
                <option value="ANY">Any Time</option>
                <option value="TODAY">Today</option>
                <option value="7D">Last 7 Days</option>
                <option value="30D">Last 30 Days</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <UserTableSkeleton />
      ) : errorMessage ? (
        /* Error State with Retry */
        <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center space-y-3 max-w-lg mx-auto">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Error Loading Users</h3>
          <p className="text-xs text-rose-200">{errorMessage}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      ) : users.length === 0 ? (
        /* Empty State */
        <div className="p-12 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
            <Users className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-base font-bold text-white">
              {hasActiveFilters ? 'No users match these filters' : 'No users yet'}
            </h3>
            <p className="text-xs text-zinc-400">
              {hasActiveFilters
                ? 'Try adjusting or clearing your search term and filter criteria.'
                : 'Users will appear here once accounts are created or invitations are issued.'}
            </p>
          </div>
          {hasActiveFilters ? (
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 transition-colors inline-flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear All Filters</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAddUserOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#1877F2] hover:bg-[#1877F2]/90 transition-colors inline-flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add First User</span>
            </button>
          )}
        </div>
      ) : (
        /* User Table (Desktop) & Cards (Mobile) */
        <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 shadow-xl overflow-hidden backdrop-blur-sm">
          {/* Desktop Table View (Hidden on mobile < md) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/60 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  <th
                    className="py-3 px-4 cursor-pointer select-none hover:text-white transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>User</span>
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th
                    className="py-3 px-4 cursor-pointer select-none hover:text-white transition-colors"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Email</span>
                      {getSortIcon('email')}
                    </div>
                  </th>
                  <th
                    className="py-3 px-4 cursor-pointer select-none hover:text-white transition-colors"
                    onClick={() => handleSort('role')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Role</span>
                      {getSortIcon('role')}
                    </div>
                  </th>
                  <th
                    className="py-3 px-4 cursor-pointer select-none hover:text-white transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Status</span>
                      {getSortIcon('status')}
                    </div>
                  </th>
                  <th
                    className="py-3 px-4 cursor-pointer select-none hover:text-white transition-colors"
                    onClick={() => handleSort('joined')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Joined</span>
                      {getSortIcon('joined')}
                    </div>
                  </th>
                  <th
                    className="py-3 px-4 cursor-pointer select-none hover:text-white transition-colors"
                    onClick={() => handleSort('lastActive')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Last Active</span>
                      {getSortIcon('lastActive')}
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-xs">
                {users.map((u) => {
                  const isSelf = u.id === currentAdmin.id;
                  const isMenuOpen = activeMenuUserId === u.id;

                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-zinc-800/40 transition-colors group"
                    >
                      {/* User (Avatar + Name) */}
                      <td className="py-3 px-4">
                        <div
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => handleViewUser(u)}
                        >
                          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden text-zinc-300">
                            {u.avatarUrl ? (
                              <img
                                src={u.avatarUrl}
                                alt={u.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <span>{u.firstName ? u.firstName[0] : u.name[0]}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="font-semibold text-white group-hover:text-[#1877F2] transition-colors truncate block">
                              {u.name}
                            </span>
                            {isSelf && (
                              <span className="text-[10px] text-purple-400 font-mono">
                                (You)
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3 px-4 text-zinc-400">
                        <span className="truncate block font-mono text-[11px] text-zinc-300">
                          {u.email}
                        </span>
                      </td>

                      {/* Role */}
                      <td className="py-3 px-4">
                        <UserRoleBadge role={u.role} size="sm" />
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <UserStatusBadge status={u.status} size="sm" />
                      </td>

                      {/* Joined Date */}
                      <td className="py-3 px-4 text-zinc-400 whitespace-nowrap">
                        {new Date(u.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Last Active */}
                      <td className="py-3 px-4 text-zinc-400 whitespace-nowrap">
                        <span title={new Date(u.lastActiveAt).toLocaleString()}>
                          {formatRelativeTime(u.lastActiveAt)}
                        </span>
                      </td>

                      {/* Action Menu (⋮) */}
                      <td className="py-3 px-4 text-right relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuUserId(isMenuOpen ? null : u.id);
                          }}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                          aria-label={`Actions for ${u.name}`}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                          <div className="absolute right-4 top-10 w-48 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl py-1.5 z-30 text-xs text-zinc-200">
                            <button
                              onClick={() => handleViewUser(u)}
                              className="w-full text-left px-3.5 py-2 hover:bg-zinc-800 hover:text-white flex items-center gap-2"
                            >
                              <Eye className="w-3.5 h-3.5 text-zinc-400" />
                              <span>View User</span>
                            </button>

                            <button
                              onClick={() => {
                                setActiveMenuUserId(null);
                                setEditingUser(u);
                              }}
                              className="w-full text-left px-3.5 py-2 hover:bg-zinc-800 hover:text-white flex items-center gap-2"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-zinc-400" />
                              <span>Edit User</span>
                            </button>

                            <button
                              onClick={() => {
                                setActiveMenuUserId(null);
                                setChangingRoleUser(u);
                              }}
                              className="w-full text-left px-3.5 py-2 hover:bg-zinc-800 hover:text-white flex items-center gap-2"
                            >
                              <Shield className="w-3.5 h-3.5 text-[#1877F2]" />
                              <span>Change Role</span>
                            </button>

                            {/* Status actions */}
                            {u.status === 'INVITED' ? (
                              <>
                                <button
                                  onClick={() => handleResendInvite(u)}
                                  className="w-full text-left px-3.5 py-2 hover:bg-zinc-800 text-amber-400 hover:text-amber-300 flex items-center gap-2"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                  <span>Resend Invite</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveMenuUserId(null);
                                    setCancellingInviteUser(u);
                                  }}
                                  className="w-full text-left px-3.5 py-2 hover:bg-zinc-800 text-rose-400 hover:text-rose-300 flex items-center gap-2 border-t border-zinc-800"
                                >
                                  <MailX className="w-3.5 h-3.5" />
                                  <span>Cancel Invite</span>
                                </button>
                              </>
                            ) : u.status === 'ACTIVE' ? (
                              <button
                                onClick={() => {
                                  setActiveMenuUserId(null);
                                  if (!isSelf) {
                                    setSuspendingUser(u);
                                  } else {
                                    showToast('You cannot suspend your own account', 'error');
                                  }
                                }}
                                disabled={isSelf}
                                className="w-full text-left px-3.5 py-2 hover:bg-zinc-800 text-rose-400 hover:text-rose-300 flex items-center gap-2 border-t border-zinc-800 disabled:opacity-40"
                              >
                                <Ban className="w-3.5 h-3.5" />
                                <span>Suspend User</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setActiveMenuUserId(null);
                                  setActivatingUser(u);
                                }}
                                className="w-full text-left px-3.5 py-2 hover:bg-zinc-800 text-emerald-400 hover:text-emerald-300 flex items-center gap-2 border-t border-zinc-800"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Activate User</span>
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View (< md) */}
          <div className="md:hidden divide-y divide-zinc-800/80">
            {users.map((u) => {
              const isSelf = u.id === currentAdmin.id;
              return (
                <div key={u.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => handleViewUser(u)}
                    >
                      <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden text-zinc-300">
                        {u.avatarUrl ? (
                          <img
                            src={u.avatarUrl}
                            alt={u.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span>{u.firstName ? u.firstName[0] : u.name[0]}</span>
                        )}
                      </div>
                      <div>
                        <span className="font-semibold text-white block text-sm">{u.name}</span>
                        <span className="font-mono text-xs text-zinc-400 truncate block">{u.email}</span>
                      </div>
                    </div>
                    <UserStatusBadge status={u.status} size="sm" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                    <UserRoleBadge role={u.role} size="sm" />
                    <span>Active {formatRelativeTime(u.lastActiveAt)}</span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800/60">
                    <button
                      onClick={() => handleViewUser(u)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700"
                    >
                      View
                    </button>
                    <button
                      onClick={() => setEditingUser(u)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setChangingRoleUser(u)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium text-[#1877F2] bg-[#1877F2]/10 hover:bg-[#1877F2]/20"
                    >
                      Role
                    </button>
                    {u.status === 'ACTIVE' && (
                      <button
                        onClick={() => {
                          if (!isSelf) setSuspendingUser(u);
                          else showToast('You cannot suspend your own account', 'error');
                        }}
                        disabled={isSelf}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 disabled:opacity-40"
                      >
                        Suspend
                      </button>
                    )}
                    {u.status === 'SUSPENDED' && (
                      <button
                        onClick={() => setActivatingUser(u)}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"
                      >
                        Activate
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <div className="p-4 border-t border-zinc-800 bg-zinc-950/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
            {/* Range summary & Page size selector */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <span>
                Showing <strong className="text-zinc-200">{startUserIndex}</strong>–
                <strong className="text-zinc-200">{endUserIndex}</strong> of{' '}
                <strong className="text-zinc-200">{totalCount}</strong> users
              </span>

              <div className="flex items-center gap-1.5">
                <span className="text-zinc-500 hidden sm:inline">Per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            {/* Pagination buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Number Chips */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .map((p, idx, arr) => {
                    const prev = arr[idx - 1];
                    return (
                      <React.Fragment key={p}>
                        {prev && p - prev > 1 && <span className="px-1 text-zinc-600">...</span>}
                        <button
                          onClick={() => setCurrentPage(p)}
                          className={`min-w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                            currentPage === p
                              ? 'bg-[#1877F2] text-white shadow-sm'
                              : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                          }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    );
                  })}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals Container */}
      <EditUserModal
        isOpen={!!editingUser}
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleSaveProfile}
      />

      <ChangeRoleModal
        isOpen={!!changingRoleUser}
        user={changingRoleUser}
        currentAdminId={currentAdmin.id}
        onClose={() => setChangingRoleUser(null)}
        onConfirm={handleChangeRole}
      />

      <SuspendUserModal
        isOpen={!!suspendingUser}
        user={suspendingUser}
        currentAdminId={currentAdmin.id}
        onClose={() => setSuspendingUser(null)}
        onConfirm={handleSuspend}
      />

      <ActivateUserModal
        isOpen={!!activatingUser}
        user={activatingUser}
        onClose={() => setActivatingUser(null)}
        onConfirm={handleActivate}
      />

      <CancelInvitationModal
        isOpen={!!cancellingInviteUser}
        user={cancellingInviteUser}
        onClose={() => setCancellingInviteUser(null)}
        onConfirm={handleCancelInvite}
      />

      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onCreate={handleCreateUser}
      />
    </div>
  );
};
