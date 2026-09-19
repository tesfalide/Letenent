// components/admin/users/CancelInvitationModal.tsx
// Cancel pending invitation confirmation dialog

import React, { useState } from 'react';
import { MailX, X } from 'lucide-react';
import { AdminUserRecord } from '@/types';

interface CancelInvitationModalProps {
  isOpen: boolean;
  user: AdminUserRecord | null;
  onClose: () => void;
  onConfirm: (targetUserId: string) => Promise<void>;
}

export const CancelInvitationModal: React.FC<CancelInvitationModalProps> = ({
  isOpen,
  user,
  onClose,
  onConfirm,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const handleCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      await onConfirm(user.id);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to cancel invitation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-invite-title"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl p-6 text-zinc-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <MailX className="w-5 h-5" />
            </div>
            <div>
              <h3 id="cancel-invite-title" className="text-lg font-bold text-white tracking-tight">
                Cancel Invitation?
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">Revoke onboarding access</p>
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

        <form onSubmit={handleCancel} className="space-y-4">
          <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex items-center gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-zinc-400 truncate">{user.email}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
            Cancelling this invitation will immediately invalidate any token link sent to <span className="font-semibold text-white">{user.email}</span> and remove this pending onboarding record.
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 bg-zinc-800 hover:bg-zinc-700/80 transition-colors disabled:opacity-50"
            >
              Keep Invitation
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 transition-colors disabled:opacity-50 shadow-sm"
            >
              {isSubmitting ? 'Cancelling...' : 'Cancel Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
