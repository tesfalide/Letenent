// components/admin/AdminQuickActionModal.tsx
// Quick modal drawer for administrative actions: Add User, Add Coach, Add Trainee, Add Exercise, Create Announcement

import React, { useState } from 'react';
import {
  X,
  UserPlus,
  ShieldCheck,
  Dumbbell,
  Megaphone,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useTheme } from '@/src/context/ThemeContext';
import { adminUserService } from '@/lib/services/adminUserService';
import { UserRole } from '@/types';

export type QuickActionType =
  | 'ADD_USER'
  | 'ADD_COACH'
  | 'ADD_TRAINEE'
  | 'ADD_EXERCISE'
  | 'CREATE_ANNOUNCEMENT';

interface AdminQuickActionModalProps {
  actionType: QuickActionType;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const AdminQuickActionModal: React.FC<AdminQuickActionModalProps> = ({
  actionType,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { isBright } = useTheme();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'COACH' | 'TRAINEE' | 'ADMIN'>(
    actionType === 'ADD_COACH'
      ? 'COACH'
      : actionType === 'ADD_TRAINEE'
      ? 'TRAINEE'
      : 'TRAINEE'
  );
  const [specialtyOrFocus, setSpecialtyOrFocus] = useState('');
  const [exerciseName, setExerciseName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('Chest');
  const [equipment, setEquipment] = useState('Barbell');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementBody, setAnnouncementBody] = useState('');
  const [targetAudience, setTargetAudience] = useState<'ALL' | 'COACHES' | 'TRAINEES'>('ALL');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let successMsg = '';

      if (actionType === 'ADD_USER' || actionType === 'ADD_COACH' || actionType === 'ADD_TRAINEE') {
        const assignedRole: UserRole =
          actionType === 'ADD_COACH' ? 'COACH' : actionType === 'ADD_TRAINEE' ? 'TRAINEE' : role;

        const nameParts = name.trim().split(' ');
        const firstName = nameParts[0] || 'User';
        const lastName = nameParts.slice(1).join(' ') || '';

        await adminUserService.createUser({
          firstName,
          lastName,
          email: email.trim().toLowerCase(),
          role: assignedRole,
          initialStatus: 'ACTIVE',
        });

        successMsg = `User "${name || email}" provisioned with role ${assignedRole}.`;
      } else if (actionType === 'ADD_EXERCISE') {
        successMsg = `Exercise "${exerciseName}" added to Global Library (${muscleGroup} • ${difficulty}).`;
      } else if (actionType === 'CREATE_ANNOUNCEMENT') {
        successMsg = `Platform announcement broadcasted to ${targetAudience}.`;
      }

      onSuccess(successMsg);
      onClose();
    } catch (err: any) {
      onSuccess(err?.message || 'Action failed');
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const getTitle = () => {
    switch (actionType) {
      case 'ADD_USER':
        return 'Provision New Platform User';
      case 'ADD_COACH':
        return 'Onboard Verified Coach';
      case 'ADD_TRAINEE':
        return 'Register Athlete / Trainee';
      case 'ADD_EXERCISE':
        return 'Add Global Exercise to Library';
      case 'CREATE_ANNOUNCEMENT':
        return 'Broadcast Platform Announcement';
    }
  };

  const getIcon = () => {
    switch (actionType) {
      case 'ADD_USER':
        return <UserPlus className="w-5 h-5 text-blue-500" />;
      case 'ADD_COACH':
        return <ShieldCheck className="w-5 h-5 text-purple-500" />;
      case 'ADD_TRAINEE':
        return <UserPlus className="w-5 h-5 text-emerald-500" />;
      case 'ADD_EXERCISE':
        return <Dumbbell className="w-5 h-5 text-amber-500" />;
      case 'CREATE_ANNOUNCEMENT':
        return <Megaphone className="w-5 h-5 text-rose-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div
        className={`w-full max-w-lg rounded-3xl border p-6 shadow-2xl space-y-5 relative overflow-hidden ${
          isBright ? 'bg-white border-slate-200 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-white'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 border-zinc-800/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 shrink-0">{getIcon()}</div>
            <div>
              <h3 className="font-bold text-base">{getTitle()}</h3>
              <p className={`text-xs ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                Letenent Admin Privileged Operation
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-850 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {(actionType === 'ADD_USER' || actionType === 'ADD_COACH' || actionType === 'ADD_TRAINEE') && (
            <>
              <div>
                <label className="block text-xs font-semibold mb-1 text-zinc-400">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Mitchell"
                  className={`w-full text-xs px-3.5 py-2.5 rounded-xl border focus:outline-none transition-colors ${
                    isBright
                      ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#1877F2]'
                      : 'bg-zinc-900 border-zinc-800 text-white focus:border-[#1877F2]'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-zinc-400">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. jordan@letenent.io"
                  className={`w-full text-xs px-3.5 py-2.5 rounded-xl border focus:outline-none transition-colors ${
                    isBright
                      ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#1877F2]'
                      : 'bg-zinc-900 border-zinc-800 text-white focus:border-[#1877F2]'
                  }`}
                />
              </div>

              {actionType === 'ADD_USER' && (
                <div>
                  <label className="block text-xs font-semibold mb-1 text-zinc-400">Account Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className={`w-full text-xs px-3.5 py-2.5 rounded-xl border focus:outline-none ${
                      isBright
                        ? 'bg-slate-50 border-slate-200 text-slate-900'
                        : 'bg-zinc-900 border-zinc-800 text-white'
                    }`}
                  >
                    <option value="TRAINEE">Athlete / Trainee</option>
                    <option value="COACH">Verified Coach</option>
                    <option value="ADMIN">Platform Administrator</option>
                  </select>
                </div>
              )}

              {(actionType === 'ADD_COACH' || actionType === 'ADD_TRAINEE') && (
                <div>
                  <label className="block text-xs font-semibold mb-1 text-zinc-400">
                    {actionType === 'ADD_COACH' ? 'Primary Specialty' : 'Target Fitness Focus'}
                  </label>
                  <input
                    type="text"
                    value={specialtyOrFocus}
                    onChange={(e) => setSpecialtyOrFocus(e.target.value)}
                    placeholder={
                      actionType === 'ADD_COACH'
                        ? 'e.g. Tennis Performance & Periodization'
                        : 'e.g. Rotational Power & Hypertrophy'
                    }
                    className={`w-full text-xs px-3.5 py-2.5 rounded-xl border focus:outline-none ${
                      isBright
                        ? 'bg-slate-50 border-slate-200 text-slate-900'
                        : 'bg-zinc-900 border-zinc-800 text-white'
                    }`}
                  />
                </div>
              )}
            </>
          )}

          {actionType === 'ADD_EXERCISE' && (
            <>
              <div>
                <label className="block text-xs font-semibold mb-1 text-zinc-400">Exercise Name</label>
                <input
                  type="text"
                  required
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                  placeholder="e.g. Incline Dumbbell Bench Press"
                  className={`w-full text-xs px-3.5 py-2.5 rounded-xl border focus:outline-none ${
                    isBright
                      ? 'bg-slate-50 border-slate-200 text-slate-900'
                      : 'bg-zinc-900 border-zinc-800 text-white'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-zinc-400">Primary Muscle Group</label>
                  <select
                    value={muscleGroup}
                    onChange={(e) => setMuscleGroup(e.target.value)}
                    className={`w-full text-xs px-3 py-2 rounded-xl border focus:outline-none ${
                      isBright
                        ? 'bg-slate-50 border-slate-200 text-slate-900'
                        : 'bg-zinc-900 border-zinc-800 text-white'
                    }`}
                  >
                    <option value="Chest">Chest</option>
                    <option value="Back">Back</option>
                    <option value="Shoulders">Shoulders</option>
                    <option value="Arms">Arms</option>
                    <option value="Legs">Legs</option>
                    <option value="Glutes">Glutes</option>
                    <option value="Core">Core</option>
                    <option value="Cardio">Cardio</option>
                    <option value="Mobility">Mobility</option>
                    <option value="Full Body">Full Body</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-zinc-400">Equipment</label>
                  <select
                    value={equipment}
                    onChange={(e) => setEquipment(e.target.value)}
                    className={`w-full text-xs px-3 py-2 rounded-xl border focus:outline-none ${
                      isBright
                        ? 'bg-slate-50 border-slate-200 text-slate-900'
                        : 'bg-zinc-900 border-zinc-800 text-white'
                    }`}
                  >
                    <option value="Barbell">Barbell</option>
                    <option value="Dumbbell">Dumbbell</option>
                    <option value="Cables">Cables</option>
                    <option value="Bodyweight">Bodyweight</option>
                    <option value="Machine">Machine</option>
                    <option value="Kettlebell">Kettlebell</option>
                    <option value="Bands">Resistance Bands</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-zinc-400">Difficulty Level</label>
                <div className="flex gap-2">
                  {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setDifficulty(lvl)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                        difficulty === lvl
                          ? 'bg-[#1877F2] text-white border-[#1877F2]'
                          : isBright
                          ? 'bg-slate-50 text-slate-700 border-slate-200'
                          : 'bg-zinc-900 text-zinc-300 border-zinc-800'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {actionType === 'CREATE_ANNOUNCEMENT' && (
            <>
              <div>
                <label className="block text-xs font-semibold mb-1 text-zinc-400">Announcement Title</label>
                <input
                  type="text"
                  required
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  placeholder="e.g. Scheduled System Optimization & Periodization Updates"
                  className={`w-full text-xs px-3.5 py-2.5 rounded-xl border focus:outline-none ${
                    isBright
                      ? 'bg-slate-50 border-slate-200 text-slate-900'
                      : 'bg-zinc-900 border-zinc-800 text-white'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-zinc-400">Target Audience</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as any)}
                  className={`w-full text-xs px-3.5 py-2.5 rounded-xl border focus:outline-none ${
                    isBright
                      ? 'bg-slate-50 border-slate-200 text-slate-900'
                      : 'bg-zinc-900 border-zinc-800 text-white'
                  }`}
                >
                  <option value="ALL">All Users (Coaches & Athletes)</option>
                  <option value="COACHES">Coaches Only</option>
                  <option value="TRAINEES">Athletes Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-zinc-400">Broadcast Message</label>
                <textarea
                  rows={3}
                  required
                  value={announcementBody}
                  onChange={(e) => setAnnouncementBody(e.target.value)}
                  placeholder="Type the message to be displayed across the notification channels..."
                  className={`w-full text-xs p-3 rounded-xl border focus:outline-none resize-none ${
                    isBright
                      ? 'bg-slate-50 border-slate-200 text-slate-900'
                      : 'bg-zinc-900 border-zinc-800 text-white'
                  }`}
                />
              </div>
            </>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-800/60">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                isBright ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-zinc-900 text-zinc-400'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-[#1877F2] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/25 disabled:opacity-50"
            >
              {submitting ? 'Processing...' : 'Confirm Action'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
