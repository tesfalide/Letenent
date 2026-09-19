// components/admin/AdminData.ts
// Platform seed data and telemetry models for Letenent Admin Control Center

export interface AdminStat {
  id: string;
  label: string;
  value: string;
  numericValue: number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  subtext: string;
  iconName: 'users' | 'shield' | 'activity' | 'zap' | 'folder' | 'dumbbell';
}

export interface UserGrowthPoint {
  label: string;
  coaches: number;
  trainees: number;
  total: number;
}

export type DateRange = '7D' | '30D' | '90D' | '6M' | '1Y';

export interface PlatformActivity {
  id: string;
  type:
    | 'COACH_REGISTERED'
    | 'TRAINEE_REGISTERED'
    | 'PROGRAM_CREATED'
    | 'WORKOUT_COMPLETED'
    | 'PROGRAM_UPDATED'
    | 'EXERCISE_ADDED'
    | 'ACCOUNT_SUSPENDED';
  actorName: string;
  actorRole: 'COACH' | 'TRAINEE' | 'ADMIN' | 'SYSTEM';
  actorAvatar?: string;
  description: string;
  timestamp: string;
  relativeTime: string;
  badgeColor?: string;
}

export interface PopularProgram {
  id: string;
  name: string;
  coachName: string;
  coachAvatar?: string;
  traineesCount: number;
  completionRate: number; // percentage
  status: 'ACTIVE' | 'DRAFT' | 'COMPLETED' | 'ARCHIVED';
  durationWeeks: number;
  category: string;
}

export interface SystemServiceHealth {
  id: string;
  service: string;
  status: 'Operational' | 'Warning' | 'Unavailable';
  latencyMs?: number;
  uptimePercent: number;
  details: string;
  lastChecked: string;
}

export interface RecentUser {
  id: string;
  name: string;
  email: string;
  role: 'COACH' | 'TRAINEE' | 'ADMIN';
  avatarUrl?: string;
  registrationDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  coachName?: string;
}

// Platform Statistics
export const PLATFORM_STATS: AdminStat[] = [
  {
    id: 'total_users',
    label: 'TOTAL USERS',
    value: '1,248',
    numericValue: 1248,
    change: '+12.5%',
    changeType: 'positive',
    subtext: '+12.5% this month',
    iconName: 'users',
  },
  {
    id: 'total_coaches',
    label: 'TOTAL COACHES',
    value: '84',
    numericValue: 84,
    change: '+8',
    changeType: 'positive',
    subtext: '+8 this month',
    iconName: 'shield',
  },
  {
    id: 'total_trainees',
    label: 'TOTAL TRAINEES',
    value: '1,164',
    numericValue: 1164,
    change: '+96',
    changeType: 'positive',
    subtext: '+96 this month',
    iconName: 'activity',
  },
  {
    id: 'active_users',
    label: 'ACTIVE USERS',
    value: '923',
    numericValue: 923,
    change: '74%',
    changeType: 'neutral',
    subtext: '74% of total users',
    iconName: 'zap',
  },
  {
    id: 'active_programs',
    label: 'ACTIVE PROGRAMS',
    value: '327',
    numericValue: 327,
    change: '+18',
    changeType: 'positive',
    subtext: '+18 this month',
    iconName: 'folder',
  },
  {
    id: 'workouts_completed',
    label: 'WORKOUTS COMPLETED',
    value: '8,492',
    numericValue: 8492,
    change: 'This month',
    changeType: 'neutral',
    subtext: 'This month',
    iconName: 'dumbbell',
  },
];

// Growth data for time ranges
export const USER_GROWTH_DATA: Record<DateRange, UserGrowthPoint[]> = {
  '7D': [
    { label: 'Mon', coaches: 1, trainees: 14, total: 15 },
    { label: 'Tue', coaches: 2, trainees: 19, total: 21 },
    { label: 'Wed', coaches: 1, trainees: 16, total: 17 },
    { label: 'Thu', coaches: 3, trainees: 22, total: 25 },
    { label: 'Fri', coaches: 2, trainees: 28, total: 30 },
    { label: 'Sat', coaches: 1, trainees: 12, total: 13 },
    { label: 'Sun', coaches: 2, trainees: 18, total: 20 },
  ],
  '30D': [
    { label: 'Week 1', coaches: 6, trainees: 68, total: 74 },
    { label: 'Week 2', coaches: 8, trainees: 85, total: 93 },
    { label: 'Week 3', coaches: 9, trainees: 104, total: 113 },
    { label: 'Week 4', coaches: 12, trainees: 128, total: 140 },
  ],
  '90D': [
    { label: 'Jan', coaches: 18, trainees: 240, total: 258 },
    { label: 'Feb', coaches: 24, trainees: 310, total: 334 },
    { label: 'Mar', coaches: 32, trainees: 380, total: 412 },
  ],
  '6M': [
    { label: 'Oct', coaches: 38, trainees: 490, total: 528 },
    { label: 'Nov', coaches: 48, trainees: 620, total: 668 },
    { label: 'Dec', coaches: 56, trainees: 760, total: 816 },
    { label: 'Jan', coaches: 64, trainees: 890, total: 954 },
    { label: 'Feb', coaches: 74, trainees: 1020, total: 1094 },
    { label: 'Mar', coaches: 84, trainees: 1164, total: 1248 },
  ],
  '1Y': [
    { label: 'Q1 2025', coaches: 22, trainees: 280, total: 302 },
    { label: 'Q2 2025', coaches: 41, trainees: 510, total: 551 },
    { label: 'Q3 2025', coaches: 63, trainees: 820, total: 883 },
    { label: 'Q4 2025', coaches: 78, trainees: 1050, total: 1128 },
    { label: 'Q1 2026', coaches: 84, trainees: 1164, total: 1248 },
  ],
};

// Platform Activity Stream
export const RECENT_PLATFORM_ACTIVITIES: PlatformActivity[] = [
  {
    id: 'act_1',
    type: 'WORKOUT_COMPLETED',
    actorName: 'Sarah Johnson',
    actorRole: 'TRAINEE',
    actorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    description: 'completed a workout: Upper Hypertrophy Block A',
    timestamp: '2026-09-18T22:50:00Z',
    relativeTime: '2 minutes ago',
  },
  {
    id: 'act_2',
    type: 'COACH_REGISTERED',
    actorName: 'Marcus Vance',
    actorRole: 'COACH',
    actorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    description: 'created a coach account & verified credentials',
    timestamp: '2026-09-18T22:35:00Z',
    relativeTime: '15 minutes ago',
  },
  {
    id: 'act_3',
    type: 'PROGRAM_CREATED',
    actorName: 'Elena Rostova',
    actorRole: 'COACH',
    actorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    description: 'created a new program: Agility & Core Periodization 8-Week',
    timestamp: '2026-09-18T21:40:00Z',
    relativeTime: '1 hour ago',
  },
  {
    id: 'act_4',
    type: 'TRAINEE_REGISTERED',
    actorName: 'Daniel Brooks',
    actorRole: 'TRAINEE',
    description: 'registered as a new athlete under Coach John Smith',
    timestamp: '2026-09-18T20:15:00Z',
    relativeTime: '3 hours ago',
  },
  {
    id: 'act_5',
    type: 'PROGRAM_UPDATED',
    actorName: 'John Smith',
    actorRole: 'COACH',
    actorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    description: 'updated workout parameters in Strength Foundations',
    timestamp: '2026-09-18T18:00:00Z',
    relativeTime: '5 hours ago',
  },
  {
    id: 'act_6',
    type: 'EXERCISE_ADDED',
    actorName: 'Letenent Administrator',
    actorRole: 'ADMIN',
    description: 'added new global exercise: Barbell Romanian Deadlift (Tempo 3-1-1)',
    timestamp: '2026-09-18T15:20:00Z',
    relativeTime: '7 hours ago',
  },
  {
    id: 'act_7',
    type: 'ACCOUNT_SUSPENDED',
    actorName: 'Letenent Administrator',
    actorRole: 'ADMIN',
    description: 'suspended user account usr_test_bot (Spam registration flagged)',
    timestamp: '2026-09-18T12:00:00Z',
    relativeTime: '10 hours ago',
  },
];

// Popular / Active Programs
export const POPULAR_PROGRAMS: PopularProgram[] = [
  {
    id: 'prog_1',
    name: 'Strength Foundations',
    coachName: 'John Smith',
    coachAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    traineesCount: 42,
    completionRate: 78,
    status: 'ACTIVE',
    durationWeeks: 12,
    category: 'Hypertrophy & Strength',
  },
  {
    id: 'prog_2',
    name: 'High Performance Tennis Hypertrophy',
    coachName: 'Elena Rostova',
    coachAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    traineesCount: 38,
    completionRate: 84,
    status: 'ACTIVE',
    durationWeeks: 8,
    category: 'Athletic Conditioning',
  },
  {
    id: 'prog_3',
    name: 'Agility & Core Periodization',
    coachName: 'Marcus Vance',
    coachAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    traineesCount: 29,
    completionRate: 91,
    status: 'ACTIVE',
    durationWeeks: 6,
    category: 'Speed & Mobility',
  },
  {
    id: 'prog_4',
    name: 'Speed & Power 12-Week Phase',
    coachName: 'David Miller',
    traineesCount: 24,
    completionRate: 72,
    status: 'ACTIVE',
    durationWeeks: 12,
    category: 'Powerlifting / Explosive',
  },
  {
    id: 'prog_5',
    name: 'Rehab & Joint Longevity',
    coachName: 'Sophia Laurent',
    traineesCount: 19,
    completionRate: 88,
    status: 'ACTIVE',
    durationWeeks: 4,
    category: 'Corrective Exercise',
  },
];

// System Health Checks
export const SYSTEM_HEALTH_SERVICES: SystemServiceHealth[] = [
  {
    id: 'srv_db',
    service: 'Database',
    status: 'Operational',
    latencyMs: 14,
    uptimePercent: 99.99,
    details: 'Primary replica healthy • 0 active lock contentions',
    lastChecked: 'Just now',
  },
  {
    id: 'srv_auth',
    service: 'Authentication',
    status: 'Operational',
    latencyMs: 8,
    uptimePercent: 100.0,
    details: 'JWT session tokens & RBAC verification active',
    lastChecked: 'Just now',
  },
  {
    id: 'srv_storage',
    service: 'Storage',
    status: 'Operational',
    latencyMs: 28,
    uptimePercent: 99.95,
    details: 'Media CDN & avatar uploads running smoothly',
    lastChecked: '1 min ago',
  },
  {
    id: 'srv_api',
    service: 'API',
    status: 'Operational',
    latencyMs: 19,
    uptimePercent: 99.98,
    details: 'Cloud Run edge routing on port 3000',
    lastChecked: 'Just now',
  },
  {
    id: 'srv_notifications',
    service: 'Notifications',
    status: 'Operational',
    latencyMs: 32,
    uptimePercent: 99.92,
    details: 'Email dispatch queue clear (0 backlog)',
    lastChecked: '2 mins ago',
  },
];

// Recently Registered Users
export const RECENTLY_REGISTERED_USERS: RecentUser[] = [
  {
    id: 'usr_r1',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'COACH',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    registrationDate: 'Today',
    status: 'ACTIVE',
  },
  {
    id: 'usr_r2',
    name: 'Maria Johnson',
    email: 'maria@example.com',
    role: 'TRAINEE',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    registrationDate: 'Yesterday',
    status: 'ACTIVE',
    coachName: 'John Smith',
  },
  {
    id: 'usr_r3',
    name: 'Alex Wong',
    email: 'alex.wong@gmail.com',
    role: 'TRAINEE',
    registrationDate: '2 days ago',
    status: 'ACTIVE',
    coachName: 'Elena Rostova',
  },
  {
    id: 'usr_r4',
    name: 'Sophia Laurent',
    email: 'sophia@tenniscoach.eu',
    role: 'COACH',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    registrationDate: '3 days ago',
    status: 'ACTIVE',
  },
  {
    id: 'usr_r5',
    name: 'Marcus Vance',
    email: 'marcus@peakstrength.io',
    role: 'COACH',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    registrationDate: '4 days ago',
    status: 'ACTIVE',
  },
];
