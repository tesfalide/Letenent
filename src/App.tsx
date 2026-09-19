/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// src/App.tsx — letenent High-Performance Coaching OS Controller

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Layers,
  Menu,
  X,
  Activity,
  CheckCircle2,
  ShieldCheck,
  Sun,
  Moon,
  LogOut,
  Folder,
  Dumbbell,
  Search,
  Settings,
} from 'lucide-react';
import { TraineeProfile, CheckIn, ActivityItem } from '@/types';
import {
  CURRENT_COACH,
  INITIAL_TRAINEES,
  INITIAL_CHECK_INS,
  INITIAL_ACTIVITIES,
} from '@/lib/mock-data';
import { TraineesDashboardView } from '@/components/coach/TraineesDashboardView';
import { ClientRosterView } from '@/components/coach/ClientRosterView';
import { ProgramBuilderView } from '@/components/coach/ProgramBuilderView';
import { CheckInReviewView } from '@/components/coach/CheckInReviewView';
import { ExerciseLibraryView } from '@/components/coach/ExerciseLibraryView';
import { SettingsView } from '@/components/coach/SettingsView';
import { FloatingFooterDock } from '@/components/coach/FloatingFooterDock';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SignInView } from '@/components/auth/SignInView';
import { TraineePortalView } from '@/components/trainee/TraineePortalView';
import { AdminDashboardView } from '@/components/admin/AdminDashboardView';
import { AccessDeniedView } from '@/components/admin/AccessDeniedView';

type ActiveTab =
  | 'trainees_dashboard'
  | 'coach_roster'
  | 'coach_program_builder'
  | 'exercise_library'
  | 'settings'
  | 'check_in_engine';

function AppContent() {
  const { currentUser, currentTrainee, signOut, signInAsCoach, signInAsTrainee } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('trainees_dashboard');
  const [trainees, setTrainees] = useState<TraineeProfile[]>(INITIAL_TRAINEES);
  const [checkIns, setCheckIns] = useState<CheckIn[]>(INITIAL_CHECK_INS);
  const [activities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [selectedTraineeForProgram, setSelectedTraineeForProgram] = useState<string | undefined>();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { theme, setTheme, toggleTheme, isBright } = useTheme();

  // Current browser pathname state for route protection
  const [currentPath, setCurrentPath] = useState(() =>
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  React.useEffect(() => {
    const handlePop = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  // If not authenticated, display the Sign In page for coaches, trainees, and administrators
  if (!currentUser) {
    return <SignInView />;
  }

  // Strict Access Control Guard:
  // If non-admin user attempts to access any /admin/* route, show 403 Forbidden screen
  if (currentUser.role !== 'ADMIN' && currentPath.startsWith('/admin')) {
    return (
      <AccessDeniedView
        userRole={currentUser.role}
        attemptedPath={currentPath}
        onReturnToDashboard={() => {
          window.history.pushState({}, '', '/');
          setCurrentPath('/');
        }}
        onSignOut={signOut}
      />
    );
  }

  // If authenticated user is an administrator, render the Admin Control Center
  if (currentUser.role === 'ADMIN') {
    return (
      <AdminDashboardView
        adminUser={currentUser}
        onSignOut={signOut}
        onSwitchToCoach={() => signInAsCoach(CURRENT_COACH.email)}
        onSwitchToTrainee={() => signInAsTrainee('trainee_kaiya')}
      />
    );
  }

  // If authenticated user is an athlete / trainee, render the dedicated Trainee Portal
  if (currentUser.role === 'TRAINEE') {
    return (
      <TraineePortalView
        trainee={currentTrainee || INITIAL_TRAINEES[0]}
        onSignOut={signOut}
        onSwitchToCoach={() => signInAsCoach(CURRENT_COACH.email)}
      />
    );
  }

  // Quick navigation handlers from dashboard & roster
  const handleSelectTraineeForReview = (_trainee: TraineeProfile) => {
    setActiveTab('check_in_engine');
  };

  const handleSelectTraineeForProgram = (trainee: TraineeProfile) => {
    setSelectedTraineeForProgram(trainee.id);
    setActiveTab('coach_program_builder');
  };

  const navItems = [
    {
      id: 'trainees_dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'coach_roster' as ActiveTab,
      label: 'Clients',
      icon: Users,
    },
    {
      id: 'coach_program_builder' as ActiveTab,
      label: 'Program Library',
      icon: Folder,
    },
    {
      id: 'exercise_library' as ActiveTab,
      label: 'Exercise Library',
      icon: Dumbbell,
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Settings',
      icon: Settings,
    },
  ];

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full justify-between bg-zinc-950 text-white select-none sidebar-black">
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1877F2] flex items-center justify-center text-white font-black text-lg shadow-sm">
              <Dumbbell className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <span
                data-brand="letenent"
                className="font-black tracking-tight text-xl lowercase font-sans text-white"
              >
                letenent
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar Search */}
        <div className="p-3 border-b border-transparent">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search clients"
              onClick={() => {
                setActiveTab('coach_roster');
                setMobileSidebarOpen(false);
              }}
              readOnly
              className="w-full rounded-xl pl-8 pr-3 py-1.5 text-xs cursor-pointer transition-colors bg-zinc-900 hover:bg-zinc-850 text-zinc-200 placeholder-zinc-500 border border-transparent focus:outline-none"
            />
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="p-3 space-y-1">
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all border border-transparent ${
                    isActive
                      ? 'bg-zinc-900 text-white font-bold shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#1877F2]' : 'text-zinc-400'}`} />
                    <span className="text-sm truncate">
                      {item.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar Footer Coach Profile & Logout */}
      <div id="sidebar-footer" className="p-3 border-t border-zinc-800/80 bg-zinc-950 sidebar-black">
        <div className="flex items-center justify-between p-1.5 rounded-xl">
          <div className="flex items-center gap-2.5 min-w-0">
            {CURRENT_COACH.avatarUrl && CURRENT_COACH.avatarUrl.trim() ? (
              <img
                src={CURRENT_COACH.avatarUrl}
                alt={CURRENT_COACH.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-700"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-zinc-800 text-white font-bold text-xs flex items-center justify-center ring-1 ring-zinc-700 shrink-0">
                {CURRENT_COACH.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="truncate">
              <p className="text-xs font-bold truncate text-white">
                {CURRENT_COACH.name}
              </p>
              <p className="text-[10px] truncate text-zinc-400">
                {CURRENT_COACH.email}
              </p>
            </div>
          </div>

          <button
            onClick={signOut}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-900 transition-colors"
            title="Log out"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors ${isBright ? 'bg-slate-50 text-slate-900' : 'bg-black text-white'} flex flex-col md:flex-row selection:bg-emerald-400 selection:text-black`}>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex md:w-64 lg:w-72 md:flex-col md:fixed md:inset-y-0 z-30 bg-zinc-950 border-r border-zinc-800/80 shadow-2xl sidebar-black">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Top Header */}
      <header className={`md:hidden sticky top-0 z-40 ${isBright ? 'bg-white/95 border-slate-200 shadow-sm' : 'bg-black/95 border-zinc-800/90'} backdrop-blur-2xl border-b px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2.5">
          <button
            id="mobile-sidebar-toggle"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className={`p-2 rounded-xl border transition-colors ${
              isBright ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200' : 'bg-zinc-900 border-zinc-700 text-zinc-200 hover:text-white hover:bg-zinc-800'
            }`}
            aria-label="Toggle navigation menu"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#1877F2] flex items-center justify-center text-white font-black text-xs shadow-md">
              <Dumbbell className="w-4 h-4 -rotate-45" />
            </div>
            <span
              data-brand="letenent"
              className={`font-black tracking-tight text-base lowercase font-sans transition-colors ${
                isBright ? 'text-slate-950 font-black' : 'text-white'
              }`}
            >
              letenent
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Theme Toggle Button */}
          <button
            id="mobile-theme-toggle-btn"
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-all flex items-center justify-center shadow-sm ${
              isBright
                ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                : 'bg-zinc-900 border-zinc-700 text-zinc-200 hover:text-white'
            }`}
            aria-label="Toggle theme"
            title={`Active theme: ${isBright ? 'Bright' : 'Black'}`}
          >
            {isBright ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-blue-400" />
            )}
          </button>

          <span className={`text-[11px] font-bold flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border ${
            isBright ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-zinc-900 border-zinc-800 text-zinc-200'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
            <span className="hidden sm:inline">{CURRENT_COACH.name}</span>
          </span>

          {/* Mobile Sign Out Button */}
          <button
            onClick={signOut}
            className={`p-2 rounded-xl border transition-colors ${
              isBright ? 'bg-slate-100 border-slate-300 text-rose-500 hover:bg-rose-50' : 'bg-zinc-900 border-zinc-700 text-rose-400 hover:bg-zinc-800'
            }`}
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Backdrop & Flyout Menu */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-zinc-950 border-r border-zinc-800 shadow-2xl z-50 sidebar-black sidebar-drawer-black">
            <div className="absolute top-3 right-3 z-10">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderSidebarContent()}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className={`flex-1 md:pl-64 lg:pl-72 flex flex-col min-h-screen min-w-0 transition-colors ${isBright ? 'bg-slate-50' : 'bg-black'}`}>
        {/* Desktop Top Header Bar with Theme Toggle (No Directory Indicator) */}
        <header className={`hidden md:flex sticky top-0 z-20 ${isBright ? 'bg-white/90 border-slate-200 shadow-sm' : 'bg-black/90 border-zinc-800/90'} backdrop-blur-xl border-b px-6 py-3 items-center justify-between`}>
          {/* Removed directory indicator as requested */}
          <div />

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              id="desktop-theme-toggle-btn"
              type="button"
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all shadow-sm flex items-center justify-center cursor-pointer select-none group ${
                isBright
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                  : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 hover:border-zinc-500 text-zinc-200 hover:text-white'
              }`}
              aria-label={`Active theme: ${isBright ? 'Bright' : 'Black'}. Click to switch theme.`}
              title={`Active theme: ${isBright ? 'Bright' : 'Black'} (Click to switch)`}
            >
              {isBright ? (
                <Sun className="w-4 h-4 text-amber-500 transition-transform group-hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-blue-400 transition-transform group-hover:-rotate-12" />
              )}
            </button>

            <div className={`h-4 w-px ${isBright ? 'bg-slate-200' : 'bg-zinc-800'}`} />

            <div className="flex items-center gap-2">
              {CURRENT_COACH.avatarUrl && CURRENT_COACH.avatarUrl.trim() ? (
                <img
                  src={CURRENT_COACH.avatarUrl}
                  alt={CURRENT_COACH.name}
                  className="w-7 h-7 rounded-lg object-cover border border-emerald-500/50"
                />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/50 shrink-0">
                  {CURRENT_COACH.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className={`text-xs font-bold ${isBright ? 'text-slate-800' : 'text-zinc-200'}`}>
                {CURRENT_COACH.name}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 pb-24 sm:pb-20">
          {/* Dashboard with Latest Activities */}
          {activeTab === 'trainees_dashboard' && (
            <div className="space-y-4 animate-fade-in">
              <TraineesDashboardView
                trainees={trainees}
                activities={activities}
                checkIns={checkIns}
                onSelectTraineeForReview={handleSelectTraineeForReview}
                onSelectTraineeForProgram={handleSelectTraineeForProgram}
                onNavigateToRoster={() => setActiveTab('coach_roster')}
                onNavigateToCheckIns={() => setActiveTab('check_in_engine')}
                onNavigateToProgramBuilder={() => setActiveTab('coach_program_builder')}
                onTraineesUpdated={(updated) => setTrainees(updated)}
              />
            </div>
          )}

          {/* Coach Client Management Roster */}
          {activeTab === 'coach_roster' && (
            <div className="space-y-4 animate-fade-in">
              <ClientRosterView
                trainees={trainees}
                onSelectTraineeForReview={handleSelectTraineeForReview}
                onSelectTraineeForProgram={handleSelectTraineeForProgram}
                onTraineesUpdated={(updated) => setTrainees(updated)}
              />
            </div>
          )}

          {/* Program Architecture & Builder */}
          {activeTab === 'coach_program_builder' && (
            <div className="space-y-4 animate-fade-in">
              <ProgramBuilderView
                trainees={trainees}
                preselectedTraineeId={selectedTraineeForProgram}
                onProgramSaved={() => {}}
              />
            </div>
          )}

          {/* Exercise Library */}
          {activeTab === 'exercise_library' && (
            <div className="space-y-4 animate-fade-in">
              <ExerciseLibraryView />
            </div>
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <div className="space-y-4 animate-fade-in">
              <SettingsView />
            </div>
          )}

          {/* Check-In Reviews Engine */}
          {activeTab === 'check_in_engine' && (
            <div className="space-y-6 animate-fade-in">
              <CheckInReviewView checkIns={checkIns} />
            </div>
          )}
        </main>

        {/* Application Footer */}
        <footer className={`border-t transition-colors ${
          isBright ? 'bg-white border-slate-200 text-slate-600' : 'bg-black border-zinc-800/90 text-zinc-400'
        } py-4 px-6 mb-14 text-center text-xs`}>
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className={`font-medium ${isBright ? 'text-slate-800' : 'text-zinc-300'}`}>
              <strong className={isBright ? 'text-slate-950 font-black' : 'text-white font-bold'}>letenent</strong>
            </span>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                title={`Active theme: ${isBright ? 'Bright' : 'Black'}`}
                className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${
                  isBright
                    ? 'hover:bg-slate-100 text-slate-700'
                    : 'hover:bg-zinc-850 text-zinc-400 hover:text-white'
                }`}
              >
                {isBright ? (
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-blue-400" />
                )}
              </button>
            </div>
          </div>
        </footer>

        {/* Floating Footer Dock with Client, Chat, and Profile */}
        <FloatingFooterDock
          trainees={trainees}
          onNavigateToRoster={() => setActiveTab('coach_roster')}
          onNavigateToProgram={(traineeId) => {
            setSelectedTraineeForProgram(traineeId);
            setActiveTab('coach_program_builder');
          }}
          onNavigateToSettings={() => setActiveTab('settings')}
          onSignOut={signOut}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
