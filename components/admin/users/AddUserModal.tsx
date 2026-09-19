// components/admin/users/AddUserModal.tsx
// Add user / invite modal for administrators

import React, { useState } from 'react';
import { UserPlus, X, Check } from 'lucide-react';
import { UserRole, UserAccountStatus } from '@/types';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: {
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    phone?: string;
    avatarUrl?: string;
    initialStatus?: UserAccountStatus;
  }) => Promise<void>;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('TRAINEE');
  const [phone, setPhone] = useState('');
  const [initialStatus, setInitialStatus] = useState<UserAccountStatus>('ACTIVE');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedFirst) {
      setError('First name is required.');
      return;
    }
    if (!trimmedLast) {
      setError('Last name is required.');
      return;
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('A valid email address is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onCreate({
        firstName: trimmedFirst,
        lastName: trimmedLast,
        email: trimmedEmail,
        role,
        phone: phone.trim() || undefined,
        initialStatus,
      });
      // reset form
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setRole('TRAINEE');
      setInitialStatus('ACTIVE');
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to create user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-user-title"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl p-6 text-zinc-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#1877F2]/10 text-[#1877F2] border border-[#1877F2]/20">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 id="add-user-title" className="text-lg font-bold text-white tracking-tight">
                Add New User
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Provision a new trainee, coach, or platform administrator
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
          {/* Role selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Account Role <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['TRAINEE', 'COACH', 'ADMIN'] as UserRole[]).map((r) => {
                const isSelected = role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
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

          {/* Name fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                First Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Marcus"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Last Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Vance"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] transition-colors"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Email Address <span className="text-rose-400">*</span>
            </label>
            <input
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] transition-colors"
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] transition-colors"
            />
          </div>

          {/* Status radio */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Account Activation Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setInitialStatus('ACTIVE')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                  initialStatus === 'ACTIVE'
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                    : 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <span>Active Immediate</span>
                {initialStatus === 'ACTIVE' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
              <button
                type="button"
                onClick={() => setInitialStatus('INVITED')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                  initialStatus === 'INVITED'
                    ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
                    : 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <span>Send Invitation</span>
                {initialStatus === 'INVITED' && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            </div>
          </div>

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
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#1877F2] hover:bg-[#1877F2]/90 transition-colors disabled:opacity-50 shadow-sm"
            >
              {isSubmitting ? 'Creating User...' : '+ Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
