// components/auth/SignInView.tsx
import React, { useState } from 'react';
import {
  Dumbbell,
  Shield,
  User,
  Users,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Mail,
  Sun,
  Moon,
  Info,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { useTheme } from '@/src/context/ThemeContext';
import { CURRENT_COACH, INITIAL_TRAINEES } from '@/lib/mock-data';

export const SignInView: React.FC = () => {
  const { signInAsCoach, signInAsTrainee, signInAsAdmin } = useAuth();
  const { theme, toggleTheme, isBright } = useTheme();

  const [activeRole, setActiveRole] = useState<'COACH' | 'TRAINEE'>('COACH');
  const [email, setEmail] = useState('roger@letenent.io');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // When switching role, set convenient default emails
  const handleRoleChange = (role: 'COACH' | 'TRAINEE') => {
    setActiveRole(role);
    setErrorMessage(null);
    if (role === 'COACH') {
      setEmail(CURRENT_COACH.email);
    } else {
      setEmail(INITIAL_TRAINEES[0].user.email); // kaiya@example.com
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      setErrorMessage('Please enter your email address');
      return;
    }

    if (!trimmedPassword) {
      setErrorMessage('Please enter your password');
      return;
    }

    // Special Administrator Access Check:
    // Email: 'Letenent admin' (or 'letenent admin' / 'admin@letenent.io')
    // Password: 'letenent'
    const normalizedEmail = trimmedEmail.toLowerCase();
    const isAdminIdentifier =
      normalizedEmail === 'letenent admin' ||
      normalizedEmail === 'letenentadmin' ||
      normalizedEmail === 'admin@letenent.io';

    if (isAdminIdentifier) {
      if (trimmedPassword === 'letenent') {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          signInAsAdmin('Letenent admin', 'letenent');
        }, 450);
        return;
      } else {
        setErrorMessage('Invalid password for administrator access.');
        return;
      }
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      let res;
      if (activeRole === 'COACH') {
        res = signInAsCoach(email, password);
      } else {
        res = signInAsTrainee(email, password);
      }
      if (res && !res.success) {
        setErrorMessage(res.error || 'Authentication failed. Please check credentials.');
      }
    }, 450);
  };

  const handleQuickCoachSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      signInAsCoach(CURRENT_COACH.email);
    }, 250);
  };

  const handleQuickTraineeSignIn = (traineeId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      signInAsTrainee(traineeId);
    }, 250);
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setResetSent(true);
    setTimeout(() => {
      setResetModalOpen(false);
      setResetSent(false);
      setResetEmail('');
    }, 2000);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 flex flex-col justify-between relative selection:bg-[#1877F2] selection:text-white ${
      isBright ? 'bg-slate-100/80 text-slate-900' : 'bg-black text-zinc-100'
    }`}>
      {/* Top Bar with Theme Toggle */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1877F2] flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20">
            <Dumbbell className="w-5 h-5 -rotate-45" />
          </div>
          <div>
            <span
              data-brand="letenent"
              className={`font-black tracking-tight text-xl lowercase font-sans ${
                isBright ? 'text-slate-950 font-black' : 'text-white'
              }`}
            >
              letenent
            </span>
            <span className={`hidden sm:inline-block ml-2.5 text-xs font-mono px-2 py-0.5 rounded-full border ${
              isBright ? 'bg-white border-slate-300 text-slate-600' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
            }`}>
              OS 2.4
            </span>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          type="button"
          aria-label="Toggle theme"
          className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 text-xs font-medium ${
            isBright
              ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm'
              : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white shadow-sm'
          }`}
        >
          {isBright ? (
            <>
              <Sun className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">Bright Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">Black Mode</span>
            </>
          )}
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 relative z-10">
        <div className="w-full max-w-md mx-auto">
          {/* Main Card */}
          <div className={`rounded-2xl border p-6 sm:p-8 backdrop-blur-xl shadow-2xl transition-all ${
            isBright
              ? 'bg-white border-slate-200/90 shadow-slate-200/80'
              : 'bg-zinc-950/90 border-zinc-800/90 shadow-black/80'
          }`}>
            {/* Header copy */}
            <div className="text-center mb-6">
              <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${
                isBright ? 'text-slate-950' : 'text-white'
              }`}>
                Sign In
              </h1>
              <p className={`text-xs sm:text-sm mt-1.5 ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                Access your coaching workspace or personal athlete portal
              </p>
            </div>

            {/* Role Tabs Switcher */}
            <div className={`grid grid-cols-2 p-1 rounded-xl mb-6 border ${
              isBright ? 'bg-slate-100 border-slate-200' : 'bg-zinc-900 border-zinc-800'
            }`}>
              <button
                type="button"
                onClick={() => handleRoleChange('COACH')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  activeRole === 'COACH'
                    ? 'bg-[#1877F2] text-white shadow-sm'
                    : isBright
                    ? 'text-slate-600 hover:text-slate-950'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Coach</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('TRAINEE')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  activeRole === 'TRAINEE'
                    ? 'bg-[#1877F2] text-white shadow-sm'
                    : isBright
                    ? 'text-slate-600 hover:text-slate-950'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Athlete / Trainee</span>
              </button>
            </div>

            {/* Role Context Tag */}
            <div className={`p-3 rounded-xl mb-5 text-xs flex items-start gap-2.5 border ${
              isBright
                ? 'bg-blue-50/70 border-blue-100 text-blue-900'
                : 'bg-blue-950/20 border-blue-900/40 text-blue-200'
            }`}>
              <Info className="w-4 h-4 text-[#1877F2] shrink-0 mt-0.5" />
              <div>
                {activeRole === 'COACH' ? (
                  <span>
                    Logging in as <strong>Coach</strong> grants full access to client rosters, periodized program building, exercise library, and weekly check-in accountability reviews.
                  </span>
                ) : (
                  <span>
                    Logging in as <strong>Athlete</strong> grants access to today's assigned workouts, set tracking, 14-day compliance score, weekly check-in submissions, and coach messaging.
                  </span>
                )}
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl text-xs bg-rose-500/10 border border-rose-500/30 text-rose-500 font-medium">
                {errorMessage}
              </div>
            )}

            {/* Credentials Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email / Identifier field */}
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${
                  isBright ? 'text-slate-700' : 'text-zinc-300'
                }`}>
                  Email Address / Identifier
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={activeRole === 'COACH' ? 'coach@letenent.io or Letenent admin' : 'athlete@example.com'}
                    className={`w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border focus:outline-none transition-colors ${
                      isBright
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#1877F2]'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-[#1877F2]'
                    }`}
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`block text-xs font-semibold ${
                    isBright ? 'text-slate-700' : 'text-zinc-300'
                  }`}>
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setResetModalOpen(true)}
                    className="text-[11px] font-medium text-[#1877F2] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={`w-full text-xs pl-10 pr-10 py-2.5 rounded-xl border focus:outline-none transition-colors ${
                      isBright
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#1877F2]'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-[#1877F2]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#1877F2] focus:ring-[#1877F2] border-zinc-700 bg-zinc-900"
                  />
                  <span className={`text-xs ${isBright ? 'text-slate-600' : 'text-zinc-400'}`}>
                    Remember this device
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 h-10 rounded-xl bg-[#1877F2] hover:bg-blue-600 active:bg-blue-700 disabled:opacity-60 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-600/20"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In as {activeRole === 'COACH' ? 'Coach' : 'Athlete'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

              {/* Quick Demo Access Divider */}
            <div className="relative my-6 text-center">
              <div className={`absolute inset-0 flex items-center ${isBright ? 'text-slate-200' : 'text-zinc-800'}`}>
                <div className="w-full border-t border-current" />
              </div>
              <span className={`relative px-3 text-[11px] font-mono uppercase tracking-wider ${
                isBright ? 'bg-white text-slate-400' : 'bg-zinc-950 text-zinc-500'
              }`}>
                Quick Demo 1-Click Access
              </span>
            </div>

            {/* 1-Click Fast Access Buttons */}
            {activeRole === 'COACH' ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleQuickCoachSignIn}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between group ${
                    isBright
                      ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                      : 'bg-zinc-900/80 hover:bg-zinc-900 border-zinc-800 text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={CURRENT_COACH.avatarUrl}
                      alt={CURRENT_COACH.name}
                      className="w-8 h-8 rounded-full object-cover border border-[#1877F2]"
                    />
                    <div>
                      <p className="text-xs font-bold leading-tight flex items-center gap-1.5">
                        <span>{CURRENT_COACH.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#1877F2]/10 text-[#1877F2] font-semibold">
                          Head Coach
                        </span>
                      </p>
                      <p className={`text-[11px] font-mono ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                        {CURRENT_COACH.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#1877F2] font-semibold group-hover:translate-x-0.5 transition-transform">
                    <span>Enter</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {INITIAL_TRAINEES.slice(0, 4).map((trainee) => (
                    <button
                      key={trainee.id}
                      type="button"
                      onClick={() => handleQuickTraineeSignIn(trainee.id)}
                      className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 group ${
                        isBright
                          ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                          : 'bg-zinc-900/80 hover:bg-zinc-900 border-zinc-800 text-zinc-200'
                      }`}
                    >
                      {trainee.user.avatarUrl ? (
                        <img
                          src={trainee.user.avatarUrl}
                          alt={trainee.user.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-zinc-800 text-xs flex items-center justify-center font-bold">
                          {trainee.user.name.slice(0, 2)}
                        </div>
                      )}
                      <div className="truncate min-w-0">
                        <p className="text-xs font-bold truncate leading-tight">
                          {trainee.user.name}
                        </p>
                        <p className="text-[10px] text-emerald-500 font-mono">
                          {trainee.compliance14Days}% adherence
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Direct Admin Access Helper Hint */}
            <div className={`mt-3 p-2.5 rounded-xl border text-[11px] flex items-center justify-between ${
              isBright
                ? 'bg-rose-50/60 border-rose-200 text-rose-900'
                : 'bg-rose-950/20 border-rose-900/40 text-rose-300'
            }`}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>
                  Admin Login: <strong>Letenent admin</strong> • <strong>letenent</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEmail('Letenent admin');
                  setPassword('letenent');
                }}
                className="text-[10px] font-bold text-rose-500 hover:underline px-1.5 py-0.5 rounded border border-rose-500/30"
              >
                Auto-fill
              </button>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center mt-6 text-xs text-zinc-500">
            <span>Powered by </span>
            <strong className={isBright ? 'text-slate-800' : 'text-zinc-400'}>letenent Coaching OS</strong>
            <span className="mx-2">•</span>
            <span>Enterprise Multi-Tenant Athlete Engine</span>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className={`w-full max-w-sm rounded-2xl border p-6 shadow-2xl ${
            isBright ? 'bg-white border-slate-200 text-slate-900' : 'bg-zinc-900 border-zinc-800 text-zinc-100'
          }`}>
            <h3 className="text-base font-bold mb-1">Reset Password</h3>
            <p className={`text-xs mb-4 ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
              Enter your email address and we'll send a secure password reset link.
            </p>

            {resetSent ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Reset email sent! Please check your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className={`w-full text-xs px-3 py-2 rounded-xl border focus:outline-none ${
                    isBright
                      ? 'bg-slate-50 border-slate-200 text-slate-900'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                  }`}
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setResetModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-zinc-800 text-zinc-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#1877F2] text-white hover:bg-blue-600"
                  >
                    Send Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
