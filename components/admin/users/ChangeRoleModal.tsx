// components/admin/users/ChangeRoleModal.tsx
// High-privilege role modification confirmation dialog

import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, X, Check } from 'lucide-react';
import { AdminUserRecord, UserRole } from '@/types';
import { UserRoleBadge } from './UserRoleBadge';

interface ChangeRoleModalProps {
  isOpen: boolean;
  user: AdminUserRecord | null;
  currentAdminId: string;
  onClose: () => void;
  onConfirm: (targetUserId: string, newRole: UserRole) => Promise<void>;
}

export const ChangeRoleModal: React.FC<ChangeRoleModalProps> = ({
  isOpen,
  user,
  currentAdminId,
  onClose,
  onConfirm,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(user?.role || 'TRAINEE');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync role when user changes
  React.useEffect(() => {
    if (user) {
      setSelectedRole(user.role);
      setError(null);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const isSelf = user.id === currentAdminId;
  const isDemotingSelf = isSelf && selectedRole !== 'ADMIN';
  const hasChanged = selectedRole !== user.role;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanged) {
      onClose();
      return;
    }

    if (isDemotingSelf) {
      setError('You cannot remove your own administrator access.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onConfirm(user.id, selectedRole);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to update user role');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-role-title"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl p-6 text-zinc-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 id="change-role-title" className="text-lg font-bold text-white tracking-tight">
                Change User Role?
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Privileged administrative security action
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Target user details */}
          <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
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
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <p className="text-xs text-zinc-400 truncate">{user.email}</p>
              </div>
            </div>
            <div className="shrink-0">
              <UserRoleBadge role={user.role} size="sm" />
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-zinc-300 leading-relaxed">
            You are changing <span className="font-semibold text-white">{user.name}</span> from{' '}
            <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-200">
              {user.role}
            </span>{' '}
            to{' '}
            <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-200">
              {selectedRole}
            </span>
            . This will change the platform permissions available to this account.
          </p>

          {/* Role selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Select New Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['TRAINEE', 'COACH', 'ADMIN'] as UserRole[]).map((r) => {
                const isSelected = selectedRole === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRole(r)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all ${
                      isSelected
                        ? 'border-[#1877F2] bg-[#1877F2]/10 text-white ring-1 ring-[#1877F2]'
                        : 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                    }`}
                  >
                    <span>{r === 'TRAINEE' ? 'Trainee' : r === 'COACH' ? 'Coach' : 'Admin'}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#1877F2]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Self demotion warning */}
          {isDemotingSelf && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>
                Safety protection: You are currently signed in as this administrator. You cannot remove your own admin role.
              </span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 bg-zinc-800 hover:bg-zinc-700/80 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isDemotingSelf || !hasChanged}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#1877F2] hover:bg-[#1877F2]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm"
            >
              {isSubmitting ? 'Updating Role...' : 'Change Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
