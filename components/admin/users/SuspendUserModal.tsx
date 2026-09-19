// components/admin/users/SuspendUserModal.tsx
// Account suspension confirmation dialog

import React, { useState } from 'react';
import { Ban, AlertTriangle, X } from 'lucide-react';
import { AdminUserRecord } from '@/types';

interface SuspendUserModalProps {
  isOpen: boolean;
  user: AdminUserRecord | null;
  currentAdminId: string;
  onClose: () => void;
  onConfirm: (targetUserId: string, reason?: string) => Promise<void>;
}

export const SuspendUserModal: React.FC<SuspendUserModalProps> = ({
  isOpen,
  user,
  currentAdminId,
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState('Administrative review / compliance check');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const isSelf = user.id === currentAdminId;

  const handleSuspend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSelf) {
      setError('You cannot suspend your own administrator account.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onConfirm(user.id, reason.trim() || undefined);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to suspend account');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="suspend-title"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl p-6 text-zinc-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Ban className="w-5 h-5" />
            </div>
            <div>
              <h3 id="suspend-title" className="text-lg font-bold text-white tracking-tight">
                Suspend User?
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">Revoke platform access permissions</p>
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

        <form onSubmit={handleSuspend} className="space-y-4">
          {/* Target user banner */}
          <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span>{user.name[0]}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-zinc-400 truncate">{user.email}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200/90 leading-relaxed">
            Suspending this account will immediately prevent <span className="font-semibold text-white">{user.name}</span> from logging in and accessing any programs or coaching features across Letenent.
          </div>

          {/* Reason Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Reason for Suspension (Audit Log)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Terms violation, payment dispute, suspicious activity"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/60 transition-colors"
            />
          </div>

          {/* Self-suspension guard */}
          {isSelf && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>
                Safety protection: You cannot suspend your own administrator account.
              </span>
            </div>
          )}

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
              disabled={isSubmitting || isSelf}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isSubmitting ? 'Suspending...' : 'Suspend User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
