// components/admin/AdminPlaceholderView.tsx
// Polished placeholder view for upcoming Admin milestones with roadmap previews

import React from 'react';
import {
  Clock,
  Sparkles,
  ArrowLeft,
  Users,
  ShieldCheck,
  Folder,
  Dumbbell,
  BarChart3,
  FileText,
  Terminal,
  Settings,
  User as UserIcon,
} from 'lucide-react';
import { useTheme } from '@/src/context/ThemeContext';

export type AdminSectionKey =
  | 'users'
  | 'coaches'
  | 'trainees'
  | 'programs'
  | 'exercises'
  | 'analytics'
  | 'reports'
  | 'audit_logs'
  | 'settings'
  | 'profile';

interface AdminPlaceholderViewProps {
  sectionKey: AdminSectionKey;
  onNavigateToDashboard: () => void;
}

interface SectionMeta {
  title: string;
  route: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
  plannedFeatures: string[];
}

const SECTION_METADATA: Record<AdminSectionKey, SectionMeta> = {
  users: {
    title: 'User Directory & Account Governance',
    route: '/admin/users',
    description: 'Master directory of all registered coaches, athletes, and platform administrators.',
    icon: Users,
    badge: 'Milestone 2',
    plannedFeatures: [
      'Comprehensive search & role-based filtering (Admin / Coach / Trainee)',
      'Account status toggling (Active / Inactive / Suspended)',
      'Strict role modification with double-confirmation modal',
      'Data footprint audits and credential reset links',
    ],
  },
  coaches: {
    title: 'Coach Roster & Performance Management',
    route: '/admin/coaches',
    description: 'Oversight of verified fitness coaches, their active rosters, and client compliance.',
    icon: ShieldCheck,
    badge: 'Milestone 2',
    plannedFeatures: [
      'Active trainee count & client retention metrics per coach',
      'Coach detail dossier (/admin/coaches/:id) with workout activity breakdown',
      'Specialty tag management and periodization program reviews',
      'Coach suspension and verification workflows',
    ],
  },
  trainees: {
    title: 'Athlete & Trainee Governance',
    route: '/admin/trainees',
    description: 'Platform athlete directory, coach pairings, compliance monitoring, and adherence alerts.',
    icon: Users,
    badge: 'Milestone 2',
    plannedFeatures: [
      'Trainee profile deep-dive (/admin/trainees/:id)',
      'Assigned coach and current active program inspection',
      '14-day workout compliance scorecards and check-in history',
      'Read-only safety guard preventing accidental coaching data alteration',
    ],
  },
  programs: {
    title: 'Global Program Catalog',
    route: '/admin/programs',
    description: 'Platform-wide training programs, periodization blocks, and completion benchmarks.',
    icon: Folder,
    badge: 'Milestone 3',
    plannedFeatures: [
      'Program status filters (Active / Draft / Completed / Archived)',
      'Coach attribution and athlete enrollment counts',
      'Average completion percentage benchmarks',
      'Soft-delete / archive behavior to protect active trainee assignments',
    ],
  },
  exercises: {
    title: 'Exercise Library Architecture',
    route: '/admin/exercises',
    description: 'Centralized repository of movement patterns, video guides, and anatomical classifications.',
    icon: Dumbbell,
    badge: 'Milestone 3',
    plannedFeatures: [
      '10 muscle group categories (Chest, Back, Shoulders, Legs, Glutes, Core, etc.)',
      'Equipment & difficulty tagging (Beginner, Intermediate, Advanced)',
      'Technique instruction notes, safety guidelines, and video URL attachments',
      'Usage metrics tracking which programs reference each movement',
    ],
  },
  analytics: {
    title: 'Platform Intelligence & Growth Analytics',
    route: '/admin/analytics',
    description: 'Aggregated analytics covering cohort retention, workout volume, and coach expansion.',
    icon: BarChart3,
    badge: 'Milestone 3',
    plannedFeatures: [
      'Interactive date-range slicing (7D, 30D, 90D, 6M, 1Y)',
      'Coach vs. athlete growth rates and activation velocity',
      'Workout completion cohorts and session RPE trends',
      'Interactive vector charts with real-time export triggers',
    ],
  },
  reports: {
    title: 'Platform Reports & Exports',
    route: '/admin/reports',
    description: 'Scheduled and on-demand report generation for business and operational oversight.',
    icon: FileText,
    badge: 'Milestone 4',
    plannedFeatures: [
      'User Growth and Onboarding Velocity reports',
      'Coach Activity and Roster Utilization summaries',
      'Trainee Compliance & Check-in Adherence audits',
      'CSV / PDF data export pipelines',
    ],
  },
  audit_logs: {
    title: 'Security Audit Logs & Telemetry',
    route: '/admin/audit-logs',
    description: 'Immutable, tamper-evident audit trail for every sensitive administrative operation.',
    icon: Terminal,
    badge: 'Milestone 4',
    plannedFeatures: [
      'Chronological tracking of role changes, suspensions, and logins',
      'IP address, user-agent, and target entity logging',
      'Advanced search by admin actor, action category, and date window',
      'Compliance-ready log retention policies',
    ],
  },
  settings: {
    title: 'Platform Configuration & Security Policies',
    route: '/admin/settings',
    description: 'Global system parameters, authentication rules, email templates, and environment health.',
    icon: Settings,
    badge: 'Milestone 4',
    plannedFeatures: [
      'Platform identity, branding, timezone, and locale settings',
      'Session lifetime controls and password complexity enforcement',
      'System-wide notification broadcast toggles',
      'Isolated environment configuration shielding production secrets',
    ],
  },
  profile: {
    title: 'Administrator Profile & Security Keys',
    route: '/admin/profile',
    description: 'Root administrative identity, session credentials, and privilege safeguards.',
    icon: UserIcon,
    badge: 'Milestone 4',
    plannedFeatures: [
      'Admin identity details and designated credential management',
      'Master password rotation with multi-step confirmation',
      'Session revocation controls across active devices',
      'Safeguards preventing accidental self-revocation of root admin rights',
    ],
  },
};

export const AdminPlaceholderView: React.FC<AdminPlaceholderViewProps> = ({
  sectionKey,
  onNavigateToDashboard,
}) => {
  const { isBright } = useTheme();
  const meta = SECTION_METADATA[sectionKey];
  const Icon = meta.icon;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Breadcrumb & Status */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onNavigateToDashboard}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
            isBright
              ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
              : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-850'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Admin Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-[#1877F2] border border-blue-500/20 font-bold">
            {meta.route}
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold">
            {meta.badge}
          </span>
        </div>
      </div>

      {/* Main Feature Announcement Card */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-sm relative overflow-hidden space-y-6 ${
          isBright ? 'bg-white border-slate-200' : 'bg-zinc-950 border-zinc-800'
        }`}
      >
        {/* Soft Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#1877F2]/10 to-transparent rounded-bl-full pointer-events-none" />

        <div className="flex items-start gap-4 relative">
          <div className="w-12 h-12 rounded-2xl bg-[#1877F2]/10 text-[#1877F2] border border-blue-500/20 flex items-center justify-center shrink-0 shadow-md shadow-blue-500/10">
            <Icon className="w-6 h-6" />
          </div>
          <div className="space-y-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">{meta.title}</h1>
            <p className={`text-xs sm:text-sm ${isBright ? 'text-slate-600' : 'text-zinc-400'}`}>
              {meta.description}
            </p>
          </div>
        </div>

        {/* Notice Box */}
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
            isBright
              ? 'bg-blue-50/70 border-blue-200 text-blue-950'
              : 'bg-blue-950/20 border-blue-900/40 text-blue-200'
          }`}
        >
          <Clock className="w-5 h-5 text-[#1877F2] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-bold">
              This section will be implemented in the next Admin milestone.
            </p>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              In accordance with the Letenent Admin Phase 1 roadmap, Milestone 1 establishes the core Admin Application
              Shell and Master Dashboard. The planned functional specifications for this module are architected below.
            </p>
          </div>
        </div>

        {/* Feature Roadmap Specs */}
        <div className="space-y-3 pt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#1877F2]" />
            <span>Planned Functional Architecture ({meta.badge})</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {meta.plannedFeatures.map((feat, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 transition-all ${
                  isBright
                    ? 'bg-slate-50 border-slate-200 text-slate-800'
                    : 'bg-zinc-900/50 border-zinc-800 text-zinc-300'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ✓
                </div>
                <span className="leading-snug">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onNavigateToDashboard}
            className="px-5 py-2.5 rounded-xl bg-[#1877F2] hover:bg-blue-600 text-white font-bold text-xs transition-all shadow-md shadow-blue-500/20"
          >
            Return to Master Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
