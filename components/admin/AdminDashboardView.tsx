// components/admin/AdminDashboardView.tsx
// High-Level Platform Administration Portal for Letenent Coaching OS
// Implements Milestone 1: Admin Application Shell + Admin Dashboard

import React, { useState, useEffect } from 'react';
import { User } from '@/types';
import { AdminShell } from './AdminShell';
import { AdminDashboard } from './AdminDashboard';
import { AdminPlaceholderView, AdminSectionKey } from './AdminPlaceholderView';
import { AdminQuickActionModal, QuickActionType } from './AdminQuickActionModal';
import { UserManagementView } from './users/UserManagementView';
import { CheckCircle2 } from 'lucide-react';

interface AdminDashboardViewProps {
  adminUser: User;
  onSignOut: () => void;
  onSwitchToCoach: () => void;
  onSwitchToTrainee: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  adminUser,
  onSignOut,
  onSwitchToCoach,
  onSwitchToTrainee,
}) => {
  // Parse section from URL or default to dashboard
  const getInitialSection = (): AdminSectionKey | 'dashboard' => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.includes('/admin/users')) return 'users';
      if (path.includes('/admin/coaches')) return 'coaches';
      if (path.includes('/admin/trainees')) return 'trainees';
      if (path.includes('/admin/programs')) return 'programs';
      if (path.includes('/admin/exercises')) return 'exercises';
      if (path.includes('/admin/analytics')) return 'analytics';
      if (path.includes('/admin/reports')) return 'reports';
      if (path.includes('/admin/audit-logs')) return 'audit_logs';
      if (path.includes('/admin/settings')) return 'settings';
      if (path.includes('/admin/profile')) return 'profile';
    }
    return 'dashboard';
  };

  const getInitialSelectedUserId = (): string | null => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/admin/users/')) {
        const parts = path.split('/admin/users/');
        if (parts[1] && parts[1].trim()) {
          return decodeURIComponent(parts[1].trim());
        }
      }
    }
    return null;
  };

  const [currentSection, setCurrentSection] = useState<AdminSectionKey | 'dashboard'>(getInitialSection);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(getInitialSelectedUserId);

  // Quick Action Modal state
  const [activeQuickAction, setActiveQuickAction] = useState<QuickActionType | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize browser URL with active section
  const handleSelectSection = (section: AdminSectionKey | 'dashboard') => {
    setCurrentSection(section);
    setSelectedUserId(null);
    if (typeof window !== 'undefined') {
      const pathMap: Record<AdminSectionKey | 'dashboard', string> = {
        dashboard: '/admin/dashboard',
        users: '/admin/users',
        coaches: '/admin/coaches',
        trainees: '/admin/trainees',
        programs: '/admin/programs',
        exercises: '/admin/exercises',
        analytics: '/admin/analytics',
        reports: '/admin/reports',
        audit_logs: '/admin/audit-logs',
        settings: '/admin/settings',
        profile: '/admin/profile',
      };
      const newPath = pathMap[section] || '/admin/dashboard';
      if (window.location.pathname !== newPath) {
        window.history.pushState({ section }, '', newPath);
      }
    }
  };

  const handleNavigateToUser = (userId: string | null) => {
    setSelectedUserId(userId);
    if (typeof window !== 'undefined') {
      if (userId) {
        const newPath = `/admin/users/${encodeURIComponent(userId)}`;
        if (window.location.pathname !== newPath) {
          window.history.pushState({ section: 'users', userId }, '', newPath);
        }
      } else {
        const newPath = '/admin/users';
        if (window.location.pathname !== newPath) {
          window.history.pushState({ section: 'users' }, '', newPath);
        }
      }
    }
  };

  // Handle browser back / forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentSection(getInitialSection());
      setSelectedUserId(getInitialSelectedUserId());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Ensure url is on /admin/dashboard on initial load if not already on an admin route
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!window.location.pathname.startsWith('/admin')) {
        window.history.replaceState({ section: 'dashboard' }, '', '/admin/dashboard');
      }
    }
  }, []);

  const handleQuickActionSuccess = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  return (
    <AdminShell
      adminUser={adminUser}
      currentSection={currentSection}
      onSelectSection={handleSelectSection}
      onSignOut={onSignOut}
      onSwitchToCoach={onSwitchToCoach}
      onSwitchToTrainee={onSwitchToTrainee}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-zinc-950 text-white border border-zinc-700 shadow-2xl animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main View Switcher */}
      {currentSection === 'dashboard' ? (
        <AdminDashboard
          onNavigateSection={handleSelectSection}
          onOpenQuickAction={(action) => setActiveQuickAction(action)}
        />
      ) : currentSection === 'users' ? (
        <UserManagementView
          currentAdmin={adminUser}
          initialSelectedUserId={selectedUserId}
          onNavigateToUser={handleNavigateToUser}
        />
      ) : (
        <AdminPlaceholderView
          sectionKey={currentSection}
          onNavigateToDashboard={() => handleSelectSection('dashboard')}
        />
      )}

      {/* Quick Action Modal Drawer */}
      {activeQuickAction && (
        <AdminQuickActionModal
          actionType={activeQuickAction}
          isOpen={!!activeQuickAction}
          onClose={() => setActiveQuickAction(null)}
          onSuccess={handleQuickActionSuccess}
        />
      )}
    </AdminShell>
  );
};
