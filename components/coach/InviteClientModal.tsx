// components/coach/InviteClientModal.tsx
// Modal generating unique trainee onboarding tokens for Coach Vance

import React, { useState } from 'react';
import { UserPlus, X, Copy, Check, Sparkles, Mail, User, Target } from 'lucide-react';
import { TraineeProfile } from '@/types';
import { useTheme } from '@/src/context/ThemeContext';

interface InviteClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientInvited: (newTrainee: TraineeProfile) => void;
}

export const InviteClientModal: React.FC<InviteClientModalProps> = ({
  isOpen,
  onClose,
  onClientInvited,
}) => {
  const { isBright } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [targetFocus, setTargetFocus] = useState('Hypertrophy & Strength');
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [hasCopied, setHasCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleGenerateInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);

    setTimeout(() => {
      // Generate unique secure token
      const randomHex = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
      const token = `ltnt_${randomHex}`;
      setGeneratedToken(token);

      const newTrainee: TraineeProfile = {
        id: `trainee_${Date.now()}`,
        userId: `usr_${Date.now()}`,
        coachId: 'coach_prof_01',
        status: 'INVITED',
        onboardingToken: token,
        targetFocus,
        joinedAt: new Date().toISOString(),
        compliance14Days: 0,
        workoutsAssigned14Days: 0,
        workoutsCompleted14Days: 0,
        user: {
          id: `usr_${Date.now()}`,
          name,
          email,
          role: 'TRAINEE',
          avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };

      onClientInvited(newTrainee);
      setIsSubmitting(false);
    }, 400);
  };

  const handleCopyLink = () => {
    if (!generatedToken) return;
    const inviteUrl = `https://letenent.io/onboard?token=${generatedToken}`;
    navigator.clipboard.writeText(inviteUrl);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleResetAndClose = () => {
    setName('');
    setEmail('');
    setGeneratedToken(null);
    setHasCopied(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl relative text-left border transition-colors ${
        isBright
          ? 'bg-white border-slate-200 text-slate-900'
          : 'bg-zinc-900 border-zinc-800 text-white'
      }`}>
        <button
          id="close-invite-modal"
          onClick={handleResetAndClose}
          className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors ${
            isBright
              ? 'text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200'
              : 'text-zinc-400 hover:text-zinc-100 bg-zinc-800/60 hover:bg-zinc-800'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-[#1877F2]">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h2 className={`text-base font-bold ${isBright ? 'text-slate-900' : 'text-white'}`}>
              Invite Trainee Client
            </h2>
            <p className={`text-xs ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
              Generate secure onboarding access token
            </p>
          </div>
        </div>

        {!generatedToken ? (
          <form onSubmit={handleGenerateInvite} className="space-y-4">
            <div>
              <label className={`text-xs font-semibold flex items-center gap-1.5 mb-1.5 ${isBright ? 'text-slate-700' : 'text-zinc-300'}`}>
                <User className={`w-3.5 h-3.5 ${isBright ? 'text-slate-400' : 'text-zinc-400'}`} />
                Client Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jordan Hayes"
                className={`w-full rounded-xl p-3 text-sm focus:outline-none transition-colors border ${
                  isBright
                    ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-blue-500'
                }`}
              />
            </div>

            <div>
              <label className={`text-xs font-semibold flex items-center gap-1.5 mb-1.5 ${isBright ? 'text-slate-700' : 'text-zinc-300'}`}>
                <Mail className={`w-3.5 h-3.5 ${isBright ? 'text-slate-400' : 'text-zinc-400'}`} />
                Client Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. jordan.hayes@gmail.com"
                className={`w-full rounded-xl p-3 text-sm focus:outline-none transition-colors border ${
                  isBright
                    ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-blue-500'
                }`}
              />
            </div>

            <div>
              <label className={`text-xs font-semibold flex items-center gap-1.5 mb-1.5 ${isBright ? 'text-slate-700' : 'text-zinc-300'}`}>
                <Target className={`w-3.5 h-3.5 ${isBright ? 'text-slate-400' : 'text-zinc-400'}`} />
                Primary Goal / Focus Block
              </label>
              <select
                value={targetFocus}
                onChange={(e) => setTargetFocus(e.target.value)}
                className={`w-full rounded-xl p-3 text-sm focus:outline-none transition-colors border ${
                  isBright
                    ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-blue-500'
                }`}
              >
                <option value="Hypertrophy & Strength">Hypertrophy & Strength</option>
                <option value="Olympic Weightlifting & Power">Olympic Weightlifting & Power</option>
                <option value="Athletic Conditioning & Mobility">Athletic Conditioning & Mobility</option>
                <option value="Post-Rehab / Structural Rebuilding">Post-Rehab / Structural Rebuilding</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                id="generate-token-submit"
                className="w-full py-3 px-4 rounded-xl bg-[#1877F2] hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                {isSubmitting ? 'Generating Onboarding Token...' : 'Generate Onboarding Token'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className={`p-4 rounded-xl border text-xs ${
              isBright
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : 'bg-blue-950/30 border-blue-500/30 text-blue-300'
            }`}>
              <p className="font-semibold mb-1">Client Profile Provisioned!</p>
              <p className={isBright ? 'text-blue-700' : 'text-blue-400/90'}>
                Share this unique onboarding link with {name}. The token will automatically bind their account to your coaching roster.
              </p>
            </div>

            <div>
              <label className={`text-xs font-semibold block mb-1.5 ${isBright ? 'text-slate-600' : 'text-zinc-400'}`}>
                Unique Onboarding Token
              </label>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={generatedToken}
                  className={`w-full rounded-xl p-3 font-mono text-xs focus:outline-none border ${
                    isBright
                      ? 'bg-slate-50 border-slate-200 text-blue-600 font-bold'
                      : 'bg-zinc-950 border-zinc-800 text-emerald-400'
                  }`}
                />
                <button
                  onClick={handleCopyLink}
                  id="copy-token-btn"
                  className="px-4 py-3 rounded-xl bg-[#1877F2] hover:bg-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
                >
                  {hasCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {hasCopied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className={`w-full py-2.5 px-4 rounded-xl border text-xs font-semibold transition-colors ${
                isBright
                  ? 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-800'
                  : 'border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
              }`}
            >
              Done & Return to Roster
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
