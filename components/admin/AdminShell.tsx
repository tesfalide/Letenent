// components/admin/AdminShell.tsx
// Responsive Application Shell for Letenent Admin Control Center

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Activity,
  Folder,
  Dumbbell,
  BarChart3,
  FileText,
  Terminal,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Shield,
  User as UserIcon,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { useTheme } from '@/src/context/ThemeContext';
import { User } from '@/types';
import { AdminSectionKey } from './AdminPlaceholderView';

interface AdminShellProps {
  adminUser: User;
  currentSection: AdminSectionKey | 'dashboard';
  onSelectSection: (section: AdminSectionKey | 'dashboard') => void;
  onSignOut: () => void;
  onSwitchToCoach: () => void;
  onSwitchToTrainee: () => void;
  children: React.ReactNode;
}

interface NavItem {
  id: AdminSectionKey | 'dashboard';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const AdminShell: React.FC<AdminShellProps> = ({
  adminUser,
  currentSection,
  onSelectSection,
  onSignOut,
  onSwitchToCoach,
  onSwitchToTrainee,
  children,
}) => {
  const { theme, toggleTheme, isBright } = useTheme();

  // Tablet collapsed sidebar toggle
  const [collapsed, setCollapsed] = useState(false);

  // Mobile drawer state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Top bar dropdowns
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'coaches', label: 'Coaches', icon: ShieldCheck },
    { id: 'trainees', label: 'Trainees', icon: Activity },
    { id: 'programs', label: 'Programs', icon: Folder },
    { id: 'exercises', label: 'Exercise Library', icon: Dumbbell },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'audit_logs', label: 'Audit Logs', icon: Terminal },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getPageTitle = () => {
    switch (currentSection) {
      case 'dashboard':
        return 'Dashboard';
      case 'users':
        return 'Users';
      case 'coaches':
        return 'Coaches';
      case 'trainees':
        return 'Trainees';
      case 'programs':
        return 'Programs';
      case 'exercises':
        return 'Exercise Library';
      case 'analytics':
        return 'Analytics';
      case 'reports':
        return 'Reports';
      case 'audit_logs':
        return 'Audit Logs';
      case 'settings':
        return 'Settings';
      case 'profile':
        return 'My Profile';
      default:
        return 'Admin';
    }
  };

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full justify-between bg-zinc-950 text-white select-none sidebar-black">
      <div>
        {/* Top: Letenent Logo + Admin Tag */}
        <div className={`p-4 border-b border-zinc-800/80 flex items-center justify-between ${collapsed ? 'px-3' : ''}`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#1877F2] flex items-center justify-center text-white font-black text-lg shadow-sm shrink-0">
              <Dumbbell className="w-5 h-5 -rotate-45" />
            </div>
            {!collapsed && (
              <div className="min-w-0 flex items-center gap-2">
                <span
                  data-brand="letenent"
                  className="font-black tracking-tight text-xl lowercase font-sans text-white"
                >
                  letenent
                </span>
                <span className="px-1.5 py-0.5 rounded-md bg-[#1877F2]/20 border border-blue-500/30 text-[#1877F2] text-[10px] font-mono font-black uppercase tracking-wider">
                  Admin
                </span>
              </div>
            )}
          </div>

          {/* Collapse button for tablet / desktop toggle */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Global Search in Sidebar when not collapsed */}
        {!collapsed && (
          <div className="p-3 border-b border-transparent">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search platform..."
                className="w-full rounded-xl pl-8 pr-3 py-1.5 text-xs transition-colors bg-zinc-900 hover:bg-zinc-850 text-zinc-200 placeholder-zinc-500 border border-transparent focus:border-zinc-700 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Main Navigation Items */}
        <div className={`p-3 space-y-1 ${collapsed ? 'px-2' : ''}`}>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;

              return (
                <button
                  key={item.id}
                  id={`admin-nav-${item.id}`}
                  onClick={() => {
                    onSelectSection(item.id);
                    setMobileDrawerOpen(false);
                  }}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center ${
                    collapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3.5 py-2'
                  } rounded-xl text-left transition-all border border-transparent ${
                    isActive
                      ? 'bg-zinc-900 text-white font-bold shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-[#1877F2]' : 'text-zinc-400'
                      }`}
                    />
                    {!collapsed && <span className="text-sm truncate">{item.label}</span>}
                  </div>

                  {!collapsed && item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom: Admin Profile, Administrator, Settings, Logout */}
      <div className={`p-3 border-t border-zinc-800/80 bg-zinc-950 sidebar-black ${collapsed ? 'px-2' : ''}`}>
        <div className={`flex items-center ${collapsed ? 'flex-col gap-2' : 'justify-between'} p-1.5 rounded-xl`}>
          <button
            type="button"
            onClick={() => onSelectSection('profile')}
            className="flex items-center gap-2.5 min-w-0 text-left group"
          >
            {adminUser.avatarUrl ? (
              <img
                src={adminUser.avatarUrl}
                alt={adminUser.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-700 shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-rose-600/20 text-rose-400 font-bold text-xs flex items-center justify-center ring-1 ring-rose-500/30 shrink-0">
                AD
              </div>
            )}
            {!collapsed && (
              <div className="truncate">
                <p className="text-xs font-bold truncate text-white group-hover:text-[#1877F2] transition-colors">
                  {adminUser.name}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                  <Shield className="w-3 h-3 text-rose-500" />
                  <span className="font-mono text-zinc-400">Administrator</span>
                </div>
              </div>
            )}
          </button>

          {!collapsed && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onSelectSection('settings')}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                title="Admin Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onSignOut}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-900 transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`min-h-screen transition-colors ${
        isBright ? 'bg-slate-100 text-slate-900' : 'bg-black text-white'
      } flex flex-col md:flex-row selection:bg-[#1877F2] selection:text-white`}
    >
      {/* 1. Desktop Persistent Left Sidebar */}
      <aside
        className={`hidden md:flex flex-col fixed inset-y-0 z-30 bg-zinc-950 border-r border-zinc-800/80 shadow-2xl transition-all duration-200 sidebar-black ${
          collapsed ? 'w-20' : 'w-64 lg:w-68'
        }`}
      >
        {renderSidebarContent()}
      </aside>

      {/* 2. Mobile Drawer Navigation */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] h-full bg-zinc-950 border-r border-zinc-800 z-10 shadow-2xl">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(false)}
              className="absolute top-4 right-3 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900"
            >
              <X className="w-5 h-5" />
            </button>
            {renderSidebarContent()}
          </div>
        </div>
      )}

      {/* 3. Main Workspace Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${
          collapsed ? 'md:pl-20' : 'md:pl-64 lg:pl-68'
        }`}
      >
        {/* Top Navigation Bar */}
        <header
          className={`sticky top-0 z-20 border-b backdrop-blur-xl px-4 sm:px-6 py-3 flex items-center justify-between transition-colors ${
            isBright ? 'bg-white/95 border-slate-200 shadow-sm' : 'bg-black/90 border-zinc-800/90'
          }`}
        >
          {/* Left: Mobile hamburger + Page Title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className={`md:hidden p-2 rounded-xl border transition-colors ${
                isBright
                  ? 'bg-slate-100 border-slate-200 text-slate-800'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-200'
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight">{getPageTitle()}</h1>
            </div>
          </div>

          {/* Right: Global search, Notifications, Admin avatar, Profile menu */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Global Search Input */}
            <div className="relative hidden sm:block w-48 md:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Global search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border focus:outline-none transition-colors ${
                  isBright
                    ? 'bg-slate-100 border-slate-200 text-slate-900 focus:bg-white focus:border-[#1877F2]'
                    : 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700'
                }`}
              />
            </div>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all ${
                isBright
                  ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
              }`}
              title={`Theme: ${isBright ? 'Bright' : 'Dark'}`}
            >
              {isBright ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-blue-400" />}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileMenuOpen(false);
                }}
                className={`p-2 rounded-xl border relative transition-all ${
                  isBright
                    ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5" />
              </button>

              {notificationsOpen && (
                <div
                  className={`absolute right-0 mt-2 w-80 rounded-2xl border p-4 shadow-2xl z-50 space-y-3 ${
                    isBright ? 'bg-white border-slate-200 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-white'
                  }`}
                >
                  <div className="flex items-center justify-between border-b pb-2 border-zinc-800/60">
                    <span className="text-xs font-bold">Platform Notifications</span>
                    <span className="text-[10px] font-mono text-zinc-400">2 New</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-2">
                      <Shield className="w-4 h-4 text-[#1877F2] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold">New Coach Onboarding</div>
                        <div className="text-[11px] text-zinc-400">Marcus Vance created coach profile.</div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold">System Health Check Passed</div>
                        <div className="text-[11px] text-zinc-400">PostgreSQL replica & API edge latency at 14ms.</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Avatar & Profile Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setProfileMenuOpen(!profileMenuOpen);
                  setNotificationsOpen(false);
                }}
                className={`flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border transition-all ${
                  isBright
                    ? 'bg-slate-100 border-slate-200 text-slate-900 hover:bg-slate-200'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:text-white'
                }`}
              >
                {adminUser.avatarUrl ? (
                  <img
                    src={adminUser.avatarUrl}
                    alt={adminUser.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-rose-600 text-white font-bold text-[10px] flex items-center justify-center">
                    AD
                  </div>
                )}
                <span className="hidden sm:inline text-xs font-bold">{adminUser.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {profileMenuOpen && (
                <div
                  className={`absolute right-0 mt-2 w-56 rounded-2xl border p-2 shadow-2xl z-50 space-y-1 text-xs ${
                    isBright ? 'bg-white border-slate-200 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-white'
                  }`}
                >
                  <div className="px-3 py-2 border-b border-zinc-800/60">
                    <p className="font-bold truncate">{adminUser.name}</p>
                    <p className="text-[11px] text-zinc-400 truncate">{adminUser.email}</p>
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-mono font-bold">
                      ADMINISTRATOR
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectSection('profile');
                      setProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-zinc-850 flex items-center gap-2"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-zinc-400" />
                    <span>My Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectSection('settings');
                      setProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-zinc-850 flex items-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Settings</span>
                  </button>

                  <div className="border-t border-zinc-800/60 my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onSwitchToCoach();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-zinc-850 flex items-center justify-between text-purple-400"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Switch to Coach View</span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-zinc-500" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onSwitchToTrainee();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-zinc-850 flex items-center justify-between text-emerald-400"
                  >
                    <div className="flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5" />
                      <span>Switch to Athlete View</span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-zinc-500" />
                  </button>

                  <div className="border-t border-zinc-800/60 my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onSignOut();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-500/10 text-rose-500 flex items-center gap-2 font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Workspace Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};
