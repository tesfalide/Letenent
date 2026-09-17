// components/coach/SettingsView.tsx
// Coach & Platform Settings View

import React, { useState } from 'react';
import { Settings, User, Bell, Shield, Sliders, Moon, Sun, Check } from 'lucide-react';
import { CURRENT_COACH } from '@/lib/mock-data';
import { useTheme } from '../../src/context/ThemeContext';

export const SettingsView: React.FC = () => {
  const { isBright, toggleTheme, setTheme } = useTheme();
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [activityAlerts, setActivityAlerts] = useState(true);

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn pb-12">
      <div>
        <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5 ${isBright ? 'text-slate-900' : 'text-white'}`}>
          <Settings className="w-7 h-7 text-[#1877F2]" />
          <span>Settings</span>
        </h1>
        <p className={`text-sm mt-1 ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
          Manage your coach preferences, notification alerts, and application configuration.
        </p>
      </div>

      <div className="space-y-4">
        {/* Profile Section */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-sm space-y-4">
          <div className={`flex items-center gap-2 font-bold text-base ${isBright ? 'text-slate-900' : 'text-white'}`}>
            <User className="w-4 h-4 text-blue-600" />
            <span>Coach Profile</span>
          </div>

          <div className="flex items-center gap-4">
            {CURRENT_COACH.avatarUrl && CURRENT_COACH.avatarUrl.trim() ? (
              <img
                src={CURRENT_COACH.avatarUrl}
                alt={CURRENT_COACH.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-500/30"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 font-bold text-lg flex items-center justify-center ring-2 ring-blue-500/30 shrink-0">
                {CURRENT_COACH.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {CURRENT_COACH.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-zinc-400">{CURRENT_COACH.email}</p>
              <span className="inline-block mt-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                Head Performance Coach • Active Roster
              </span>
            </div>
          </div>
        </div>

        {/* Display & Preferences */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-sm space-y-4">
          <div className={`flex items-center gap-2 font-bold text-base ${isBright ? 'text-slate-900' : 'text-white'}`}>
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>Preferences</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-zinc-800">
            {/* Preferred Unit */}
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
                  Weight Unit Preference
                </p>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Default display unit for athlete sets and body metrics
                </p>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl">
                <button
                  onClick={() => setWeightUnit('kg')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    weightUnit === 'kg'
                      ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-zinc-400'
                  }`}
                >
                  KG
                </button>
                <button
                  onClick={() => setWeightUnit('lbs')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    weightUnit === 'lbs'
                      ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-zinc-400'
                  }`}
                >
                  LBS
                </button>
              </div>
            </div>

            {/* Theme Mode */}
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
                  Theme Appearance
                </p>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Toggle between Bright Light Theme and Dark Black Theme
                </p>
              </div>
              <div className="flex items-center bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl border border-slate-200 dark:border-zinc-700">
                <button
                  type="button"
                  onClick={() => setTheme('bright')}
                  aria-label="Bright theme"
                  title="Bright theme"
                  className={`p-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                    isBright
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Sun className={`w-4 h-4 ${isBright ? 'text-amber-500' : 'text-slate-400'}`} />
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('black')}
                  aria-label="Black theme"
                  title="Black theme"
                  className={`p-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                    !isBright
                      ? 'bg-zinc-900 dark:bg-zinc-700 text-white shadow-sm border border-zinc-600/60'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Moon className={`w-4 h-4 ${!isBright ? 'text-blue-400' : 'text-slate-400'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-sm space-y-4">
          <div className={`flex items-center gap-2 font-bold text-base ${isBright ? 'text-slate-900' : 'text-white'}`}>
            <Bell className="w-4 h-4 text-blue-600" />
            <span>Notifications</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-zinc-800">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
                  Instant Workout Alerts
                </p>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Receive live activity updates when athletes log workouts or PRs
                </p>
              </div>
              <input
                type="checkbox"
                checked={activityAlerts}
                onChange={(e) => setActivityAlerts(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
              />
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
                  Weekly Client Summaries
                </p>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Automated email digests summarizing weekly compliance and check-ins
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
