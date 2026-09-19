// components/admin/AccessDeniedView.tsx
// 403 Forbidden / Unauthorized Access Guard for Letenent Admin Routes

import React from 'react';
import { ShieldAlert, ArrowLeft, LogOut, Lock } from 'lucide-react';
import { UserRole } from '@/types';
import { useTheme } from '@/src/context/ThemeContext';

interface AccessDeniedViewProps {
  userRole?: UserRole;
  attemptedPath?: string;
  onReturnToDashboard: () => void;
  onSignOut: () => void;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({
  userRole = 'TRAINEE',
  attemptedPath = '/admin/dashboard',
  onReturnToDashboard,
  onSignOut,
}) => {
  const { isBright } = useTheme();

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors ${
        isBright ? 'bg-slate-100 text-slate-900' : 'bg-black text-white'
      }`}
    >
      <div
        className={`w-full max-w-md p-6 sm:p-8 rounded-3xl border shadow-2xl text-center space-y-6 ${
          isBright ? 'bg-white border-slate-200' : 'bg-zinc-950 border-zinc-800'
        }`}
      >
        {/* Warning Badge */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shadow-lg shadow-rose-500/10">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 font-mono text-xs font-bold">
            <Lock className="w-3 h-3" />
            <span>403 FORBIDDEN</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">Access Denied</h1>
          <p className={`text-xs sm:text-sm leading-relaxed ${isBright ? 'text-slate-600' : 'text-zinc-400'}`}>
            Admin privileges are strictly restricted to verified platform administrators. Your authenticated account (role:{' '}
            <span className="font-mono font-bold text-rose-500">{userRole}</span>) does not have authorization to access{' '}
            <code className="px-1.5 py-0.5 rounded bg-zinc-800/40 text-xs font-mono">{attemptedPath}</code>.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            type="button"
            onClick={onReturnToDashboard}
            className="w-full py-3 px-4 rounded-xl bg-[#1877F2] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/25"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to {userRole === 'COACH' ? 'Coach Workspace' : 'Athlete Portal'}</span>
          </button>

          <button
            type="button"
            onClick={onSignOut}
            className={`w-full py-2.5 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              isBright
                ? 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-700'
                : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300'
            }`}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out & Switch Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
