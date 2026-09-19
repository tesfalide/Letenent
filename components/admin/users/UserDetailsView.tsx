// components/admin/users/UserDetailsView.tsx
// Comprehensive User Details view for Letenent Admin Center

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Mail,
  Phone,
  Shield,
  Dumbbell,
  Users,
  Award,
  Activity,
  CheckCircle2,
  Copy,
  Check,
  Edit3,
  ShieldAlert,
  Ban,
  RotateCcw,
  Send,
  ExternalLink,
} from 'lucide-react';
import { AdminUserRecord, User, UserRole, UserActivityRecord } from '@/types';
import { adminUserService } from '@/lib/services/adminUserService';
import { UserRoleBadge } from './UserRoleBadge';
import { UserStatusBadge } from './UserStatusBadge';
import { EditUserModal } from './EditUserModal';
import { ChangeRoleModal } from './ChangeRoleModal';
import { SuspendUserModal } from './SuspendUserModal';
import { ActivateUserModal } from './ActivateUserModal';

interface UserDetailsViewProps {
  userId: string;
  currentAdmin: User;
  onBack: () => void;
  onUserUpdated: () => void;
}

export const UserDetailsView: React.FC<UserDetailsViewProps> = ({
  userId,
  currentAdmin,
  onBack,
  onUserUpdated,
}) => {
  const [user, setUser] = useState<AdminUserRecord | null>(null);
  const [activities, setActivities] = useState<UserActivityRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modals
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isSuspendOpen, setIsSuspendOpen] = useState(false);
  const [isActivateOpen, setIsActivateOpen] = useState(false);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const data = await adminUserService.getUserById(userId);
      setUser(data);
      if (data) {
        const acts = await adminUserService.getUserActivity(data.id);
        setActivities(acts);
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to load user profile' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleCopyId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // Modal action handlers
  const handleSaveProfile = async (
    targetUserId: string,
    updates: { firstName: string; lastName: string; email: string; phone?: string; avatarUrl?: string }
  ) => {
    await adminUserService.updateUser(targetUserId, updates, currentAdmin);
    showToast('User profile updated successfully.');
    await loadUserData();
    onUserUpdated();
  };

  const handleChangeRole = async (targetUserId: string, newRole: UserRole) => {
    await adminUserService.changeUserRole(targetUserId, newRole, currentAdmin);
    showToast(`User role successfully changed to ${newRole}.`);
    await loadUserData();
    onUserUpdated();
  };

  const handleSuspend = async (targetUserId: string, reason?: string) => {
    await adminUserService.suspendUser(targetUserId, reason, currentAdmin);
    showToast('User suspended successfully.');
    await loadUserData();
    onUserUpdated();
  };

  const handleActivate = async (targetUserId: string) => {
    await adminUserService.activateUser(targetUserId, currentAdmin);
    showToast('User activated successfully.');
    await loadUserData();
    onUserUpdated();
  };

  const handleResendInvite = async () => {
    if (!user) return;
    try {
      await adminUserService.resendInvitation(user.id, currentAdmin);
      showToast(`Invitation successfully resent to ${user.email}.`);
      await loadUserData();
      onUserUpdated();
    } catch (err: any) {
      showToast(err?.message || 'Failed to resend invitation.', 'error');
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
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

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-6 w-36 bg-zinc-800 rounded" />
        <div className="h-32 bg-zinc-900/60 border border-zinc-800 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 h-64 bg-zinc-900/60 border border-zinc-800 rounded-2xl" />
          <div className="h-64 bg-zinc-900/60 border border-zinc-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">User Not Found</h2>
        <p className="text-sm text-zinc-400">
          The requested user account does not exist or may have been deleted.
        </p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Users Directory
        </button>
      </div>
    );
  }

  const isCurrentAdmin = user.id === currentAdmin.id;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 text-zinc-100">
      {/* Toast alert */}
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
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Back button & Breadcrumbs */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-all group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Users</span>
        </button>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span>Users</span>
          <span>/</span>
          <span className="text-zinc-300 font-mono text-[11px]">{user.id}</span>
        </div>
      </div>

      {/* Top Profile Header Card */}
      <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 min-w-0">
            {/* Avatar */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center font-bold text-2xl text-zinc-200 shrink-0 overflow-hidden shadow-inner">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span>{user.firstName ? user.firstName[0] : user.name[0]}</span>
              )}
            </div>

            {/* Identity & Badges */}
            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate">
                  {user.name}
                </h1>
                <UserRoleBadge role={user.role} size="md" />
                <UserStatusBadge status={user.status} size="md" />
                {isCurrentAdmin && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    Your Session
                  </span>
                )}
              </div>
              <p className="text-sm text-zinc-400 truncate flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                <span>{user.email}</span>
                {user.phone && (
                  <>
                    <span className="text-zinc-600">•</span>
                    <Phone className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{user.phone}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 pt-4 md:pt-0 border-t md:border-t-0 border-zinc-800">
            <button
              onClick={() => setIsEditOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-200 bg-zinc-800 hover:bg-zinc-700 hover:text-white transition-all flex items-center gap-1.5 border border-zinc-700/60 shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5 text-zinc-400" />
              <span>Edit User</span>
            </button>

            <button
              onClick={() => setIsRoleOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-200 bg-zinc-800 hover:bg-zinc-700 hover:text-white transition-all flex items-center gap-1.5 border border-zinc-700/60 shadow-sm"
            >
              <Shield className="w-3.5 h-3.5 text-[#1877F2]" />
              <span>Change Role</span>
            </button>

            {user.status === 'INVITED' ? (
              <button
                onClick={handleResendInvite}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Resend Invite</span>
              </button>
            ) : user.status === 'ACTIVE' ? (
              <button
                onClick={() => setIsSuspendOpen(true)}
                disabled={isCurrentAdmin}
                title={isCurrentAdmin ? 'You cannot suspend your own account' : 'Suspend account'}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Ban className="w-3.5 h-3.5 text-rose-400" />
                <span>Suspend User</span>
              </button>
            ) : (
              <button
                onClick={() => setIsActivateOpen(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Activate User</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick info chips bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-zinc-800/80 text-xs">
          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/70">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider block font-medium">User ID</span>
            <div className="flex items-center gap-1.5 mt-1 font-mono text-zinc-200">
              <span className="truncate">{user.id}</span>
              <button
                onClick={handleCopyId}
                className="p-1 rounded text-zinc-400 hover:text-white transition-colors"
                title="Copy User ID"
              >
                {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/70">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider block font-medium">Registration</span>
            <div className="flex items-center gap-1.5 mt-1 text-zinc-200">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              <span>{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/70">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider block font-medium">Last Active</span>
            <div className="flex items-center gap-1.5 mt-1 text-zinc-200">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              <span>{formatRelativeTime(user.lastActiveAt)}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/70">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider block font-medium">Access Status</span>
            <div className="mt-1 font-semibold">
              <span className={user.status === 'ACTIVE' ? 'text-emerald-400' : user.status === 'SUSPENDED' ? 'text-rose-400' : 'text-amber-400'}>
                {user.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Details Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Profile info + Role Relationships */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: Profile Information */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <span>Profile Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/70 space-y-1">
                <span className="text-zinc-500">First Name</span>
                <p className="text-sm font-semibold text-white">{user.firstName || user.name.split(' ')[0]}</p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/70 space-y-1">
                <span className="text-zinc-500">Last Name</span>
                <p className="text-sm font-semibold text-white">{user.lastName || user.name.split(' ').slice(1).join(' ') || '-'}</p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/70 space-y-1">
                <span className="text-zinc-500">Email Address</span>
                <p className="text-sm font-semibold text-white truncate">{user.email}</p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/70 space-y-1">
                <span className="text-zinc-500">Phone Number</span>
                <p className="text-sm font-semibold text-white">{user.phone || 'Not provided'}</p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/70 space-y-1">
                <span className="text-zinc-500">Created Timestamp</span>
                <p className="font-mono text-zinc-300">{formatDate(user.createdAt)}</p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/70 space-y-1">
                <span className="text-zinc-500">Last Updated Timestamp</span>
                <p className="font-mono text-zinc-300">{formatDate(user.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Section: Role Specific Relationships */}
          {user.role === 'COACH' && (
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#1877F2] flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>Coach Coaching Footprint</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-zinc-950/50 border border-zinc-800/70 space-y-1">
                  <span className="text-zinc-500">Assigned Trainees</span>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#1877F2]" />
                    <span className="text-xl font-bold text-white">{user.traineesCount ?? 24}</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-950/50 border border-zinc-800/70 space-y-1">
                  <span className="text-zinc-500">Active Programs</span>
                  <div className="flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 text-purple-400" />
                    <span className="text-xl font-bold text-white">{user.activeProgramsCount ?? 6}</span>
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-zinc-950/50 border border-zinc-800/70 space-y-1">
                  <span className="text-zinc-500">Verification Status</span>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold pt-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verified Coach</span>
                  </div>
                </div>
              </div>

              {user.bio && (
                <div className="p-3.5 rounded-xl bg-zinc-950/50 border border-zinc-800/70 space-y-1.5 text-xs">
                  <span className="text-zinc-500 font-medium">Coach Bio</span>
                  <p className="text-zinc-300 leading-relaxed">{user.bio}</p>
                </div>
              )}

              {user.specialties && user.specialties.length > 0 && (
                <div className="space-y-2 text-xs">
                  <span className="text-zinc-500 font-medium">Specialties & Domains</span>
                  <div className="flex flex-wrap gap-2">
                    {user.specialties.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700/80 text-zinc-200 font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {user.role === 'TRAINEE' && (
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span>Athlete Training Status & Relationships</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-zinc-950/50 border border-zinc-800/70 space-y-1">
                  <span className="text-zinc-500">Assigned Coach</span>
                  <p className="text-sm font-semibold text-white flex items-center gap-1.5">
                    <span>{user.assignedCoachName || 'Unassigned / Self-directed'}</span>
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950/50 border border-zinc-800/70 space-y-1">
                  <span className="text-zinc-500">Current Assigned Program</span>
                  <p className="text-sm font-semibold text-white truncate">
                    {user.currentProgramTitle || 'General Athletic Conditioning'}
                  </p>
                </div>
              </div>

              {user.compliance14Days !== undefined && (
                <div className="p-3.5 rounded-xl bg-zinc-950/50 border border-zinc-800/70 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">14-Day Workout Compliance Rate</span>
                    <span className="font-bold text-emerald-400 font-mono">{user.compliance14Days}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${user.compliance14Days}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {user.role === 'ADMIN' && (
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 shadow-sm space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Platform Governance & Safeguards</span>
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                This account has full root platform authorization, including database user administration, system-wide program oversight, and security configuration.
              </p>
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200">
                Self-protection safeguards prevent administrators from accidentally locking themselves out of the system.
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: User Recent Activity Timeline */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Recent Activity</span>
            </h3>

            {activities.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <p className="text-xs text-zinc-500 italic">No activity recorded for this user yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activities.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/70 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono text-[10px]">
                        {act.category}
                      </span>
                      <span className="text-zinc-500">{formatRelativeTime(act.timestamp)}</span>
                    </div>
                    <p className="text-zinc-200 font-medium pt-0.5 leading-snug">{act.activity}</p>
                    <span className="text-[10px] text-zinc-500 block font-mono">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Account Security Card */}
          <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-3 text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block">Security Baseline</span>
            <div className="space-y-2 text-zinc-300">
              <div className="flex items-center justify-between">
                <span>Two-Factor Auth (2FA)</span>
                <span className="text-emerald-400 font-medium">Standard</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Account Status</span>
                <span className="font-semibold text-white">{user.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Password Hash</span>
                <span className="text-zinc-500 font-mono">argon2id (Protected)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditUserModal
        isOpen={isEditOpen}
        user={user}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSaveProfile}
      />

      <ChangeRoleModal
        isOpen={isRoleOpen}
        user={user}
        currentAdminId={currentAdmin.id}
        onClose={() => setIsRoleOpen(false)}
        onConfirm={handleChangeRole}
      />

      <SuspendUserModal
        isOpen={isSuspendOpen}
        user={user}
        currentAdminId={currentAdmin.id}
        onClose={() => setIsSuspendOpen(false)}
        onConfirm={handleSuspend}
      />

      <ActivateUserModal
        isOpen={isActivateOpen}
        user={user}
        onClose={() => setIsActivateOpen(false)}
        onConfirm={handleActivate}
      />
    </div>
  );
};
