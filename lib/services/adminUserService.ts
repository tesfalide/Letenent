// lib/services/adminUserService.ts
// Enterprise User Management Service Layer for Letenent Admin Control Center
// Handles querying, multi-dimensional filtering, sorting, pagination, role mutations, status changes, and audit logging

import {
  AdminUserRecord,
  User,
  UserRole,
  UserAccountStatus,
  UserQueryParams,
  UserStatistics,
  UserActivityRecord,
  AuditLogRecord,
} from '@/types';
import { CURRENT_COACH, INITIAL_TRAINEES } from '@/lib/mock-data';

const USERS_STORAGE_KEY = 'letenent_admin_users_db';
const AUDIT_STORAGE_KEY = 'letenent_admin_audit_logs';
const ACTIVITY_STORAGE_KEY = 'letenent_admin_user_activities';

// Initial realistic seed dataset representing all 3 user roles and statuses
const INITIAL_ADMIN_USERS: AdminUserRecord[] = [
  // 1. Administrators
  {
    id: 'usr_admin_01',
    email: 'Letenent admin',
    firstName: 'Letenent',
    lastName: 'Administrator',
    name: 'Letenent Administrator',
    role: 'ADMIN',
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 019-2834',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    lastActiveAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 mins ago
  },
  {
    id: 'usr_admin_02',
    email: 'devops.admin@letenent.io',
    firstName: 'DevOps',
    lastName: 'Security',
    name: 'DevOps Security',
    role: 'ADMIN',
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 902-1144',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
    lastActiveAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(), // 4 hours ago
  },

  // 2. Coaches
  {
    id: CURRENT_COACH.id,
    email: CURRENT_COACH.email,
    firstName: 'Roger',
    lastName: 'Bothman',
    name: CURRENT_COACH.name,
    role: 'COACH',
    status: 'ACTIVE',
    professionalTitle: 'Head Strength & Conditioning Specialist',
    avatarUrl: CURRENT_COACH.avatarUrl,
    phone: '+1 (555) 234-5678',
    createdAt: CURRENT_COACH.createdAt,
    updatedAt: CURRENT_COACH.updatedAt,
    lastActiveAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    traineesCount: 24,
    activeProgramsCount: 6,
    completedProgramsCount: 14,
    workoutCompletionsCount: 1284,
    retentionRate: 95,
    specialties: ['Hypertrophy', 'Periodization', 'Biomechanics'],
    bio: 'Elite strength & conditioning specialist coaching competitive lifters and athletic clients.',
  },
  {
    id: 'usr_coach_02',
    email: 'elena@letenent.io',
    firstName: 'Elena',
    lastName: 'Rostova',
    name: 'Elena Rostova',
    role: 'COACH',
    status: 'ACTIVE',
    professionalTitle: 'Director of Athletic Preparation',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 345-6789',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
    lastActiveAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    traineesCount: 38,
    activeProgramsCount: 8,
    completedProgramsCount: 21,
    workoutCompletionsCount: 1840,
    retentionRate: 92,
    specialties: ['Athletic Performance', 'Tennis Conditioning', 'Mobility'],
    bio: 'Former collegiate tennis trainer specializing in rotational power and injury risk reduction.',
  },
  {
    id: 'usr_coach_03',
    email: 'marcus@peakstrength.io',
    firstName: 'Marcus',
    lastName: 'Vance',
    name: 'Marcus Vance',
    role: 'COACH',
    status: 'ACTIVE',
    professionalTitle: 'USAPL Senior Strength Coach',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 456-7890',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z',
    lastActiveAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    traineesCount: 29,
    activeProgramsCount: 5,
    completedProgramsCount: 12,
    workoutCompletionsCount: 960,
    retentionRate: 89,
    specialties: ['Powerlifting', 'Compound Movements', 'RPE Programming'],
    bio: 'USAPL certified coach working with intermediate-to-advanced strength lifters.',
  },
  {
    id: 'usr_coach_04',
    email: 'john.smith@coaching.com',
    firstName: 'John',
    lastName: 'Smith',
    name: 'John Smith',
    role: 'COACH',
    status: 'ACTIVE',
    professionalTitle: 'Master Physique & Hypertrophy Coach',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 567-8901',
    createdAt: '2024-02-10T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
    lastActiveAt: new Date(Date.now() - 1 * 86400 * 1000).toISOString(),
    traineesCount: 42,
    activeProgramsCount: 9,
    completedProgramsCount: 26,
    workoutCompletionsCount: 2150,
    retentionRate: 94,
    specialties: ['Bodybuilding', 'Nutrition Adherence', 'Hypertrophy'],
    bio: 'NPC judge and physique transformation specialist.',
  },
  {
    id: 'usr_coach_05',
    email: 'sophia@tenniscoach.eu',
    firstName: 'Sophia',
    lastName: 'Laurent',
    name: 'Sophia Laurent',
    role: 'COACH',
    status: 'ACTIVE',
    professionalTitle: 'Kinesiology & Biomechanics Coach',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    phone: '+33 6 12 34 56 78',
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2024-02-20T00:00:00Z',
    lastActiveAt: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
    traineesCount: 19,
    activeProgramsCount: 4,
    completedProgramsCount: 9,
    workoutCompletionsCount: 740,
    retentionRate: 96,
    specialties: ['Functional Movement', 'Rehabilitation', 'Kinesiology'],
    bio: 'MSc Exercise Science, European Athletics Physical Preparation coach.',
  },
  {
    id: 'usr_coach_06',
    email: 'david@powerflow.fit',
    firstName: 'David',
    lastName: 'Miller',
    name: 'David Miller',
    role: 'COACH',
    status: 'SUSPENDED',
    professionalTitle: 'Functional Fitness Coach',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 678-9012',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z',
    lastActiveAt: new Date(Date.now() - 25 * 86400 * 1000).toISOString(),
    traineesCount: 0,
    activeProgramsCount: 0,
    completedProgramsCount: 3,
    workoutCompletionsCount: 120,
    retentionRate: 40,
    specialties: ['Cross-Training', 'Metabolic Conditioning'],
    bio: 'Account under administrative review for policy non-compliance.',
  },
  {
    id: 'usr_coach_07',
    email: 'rachel@mobilitycore.com',
    firstName: 'Rachel',
    lastName: 'Adams',
    name: 'Rachel Adams',
    role: 'COACH',
    status: 'INACTIVE',
    professionalTitle: 'Mobility & Pilates Lead Coach',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 789-0987',
    createdAt: '2024-01-25T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z',
    lastActiveAt: new Date(Date.now() - 36 * 86400 * 1000).toISOString(),
    traineesCount: 6,
    activeProgramsCount: 1,
    completedProgramsCount: 5,
    workoutCompletionsCount: 310,
    retentionRate: 85,
    specialties: ['Pilates', 'Thoracic Mobility', 'Post-Rehab'],
    bio: 'PMA Certified Pilates Teacher specializing in spinal hygiene and athletic recovery.',
  },
  {
    id: 'usr_coach_08',
    email: 'chris@athleticedge.io',
    firstName: 'Chris',
    lastName: 'Gallagher',
    name: 'Chris Gallagher',
    role: 'COACH',
    status: 'ACTIVE',
    professionalTitle: 'Olympic Weightlifting & Velocity Specialist',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 890-9876',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
    lastActiveAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    traineesCount: 14,
    activeProgramsCount: 3,
    completedProgramsCount: 7,
    workoutCompletionsCount: 580,
    retentionRate: 91,
    specialties: ['Olympic Weightlifting', 'Barbell Velocity', 'Bar Path Analysis'],
    bio: 'USAW National Coach mentoring competitive youth and masters lifters.',
  },

  // 3. Trainees (Athletes)
  {
    id: INITIAL_TRAINEES[0].user.id,
    email: INITIAL_TRAINEES[0].user.email,
    firstName: 'Kaiya',
    lastName: 'Stone',
    name: 'Kaiya Stone',
    role: 'TRAINEE',
    status: 'ACTIVE',
    avatarUrl: INITIAL_TRAINEES[0].user.avatarUrl,
    phone: '+1 (555) 789-0123',
    createdAt: INITIAL_TRAINEES[0].user.createdAt,
    updatedAt: INITIAL_TRAINEES[0].user.updatedAt,
    lastActiveAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(), // 12 mins ago
    assignedCoachId: CURRENT_COACH.id,
    assignedCoachName: CURRENT_COACH.name,
    currentProgramTitle: 'Push Strength & Upper Body Hypertrophy',
    targetFocus: 'Push Strength & Upper Body Hypertrophy',
    compliance14Days: 96,
  },
  {
    id: INITIAL_TRAINEES[1].user.id,
    email: INITIAL_TRAINEES[1].user.email,
    firstName: 'Wilson',
    lastName: 'Pena',
    name: 'Wilson Pena',
    role: 'TRAINEE',
    status: 'ACTIVE',
    avatarUrl: INITIAL_TRAINEES[1].user.avatarUrl,
    phone: '+1 (555) 890-1234',
    createdAt: INITIAL_TRAINEES[1].user.createdAt,
    updatedAt: INITIAL_TRAINEES[1].user.updatedAt,
    lastActiveAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    assignedCoachId: CURRENT_COACH.id,
    assignedCoachName: CURRENT_COACH.name,
    currentProgramTitle: 'Pull Day & Posterior Chain Volume',
    targetFocus: 'Pull Day & Posterior Chain Volume',
    compliance14Days: 92,
  },
  {
    id: INITIAL_TRAINEES[2].user.id,
    email: INITIAL_TRAINEES[2].user.email,
    firstName: 'Olivia',
    lastName: 'Grant',
    name: 'Olivia Grant',
    role: 'TRAINEE',
    status: 'ACTIVE',
    avatarUrl: INITIAL_TRAINEES[2].user.avatarUrl,
    phone: '+1 (555) 901-2345',
    createdAt: INITIAL_TRAINEES[2].user.createdAt,
    updatedAt: INITIAL_TRAINEES[2].user.updatedAt,
    lastActiveAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    assignedCoachId: CURRENT_COACH.id,
    assignedCoachName: CURRENT_COACH.name,
    currentProgramTitle: 'Hypertrophy & Bench Volume',
    targetFocus: 'Hypertrophy & Bench Volume',
    compliance14Days: 91,
  },
  {
    id: 'usr_t_01',
    email: 'marcus.chen@example.com',
    firstName: 'Marcus',
    lastName: 'Chen',
    name: 'Marcus Chen',
    role: 'TRAINEE',
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 012-3456',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
    lastActiveAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    assignedCoachId: CURRENT_COACH.id,
    assignedCoachName: CURRENT_COACH.name,
    currentProgramTitle: 'Hypertrophy & Strength (Powerbuilding Block)',
    targetFocus: 'Powerbuilding Block',
    compliance14Days: 92,
  },
  {
    id: 'usr_t_02',
    email: 's.jenkins@example.com',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    name: 'Sarah Jenkins',
    role: 'TRAINEE',
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 123-4567',
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
    lastActiveAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    assignedCoachId: CURRENT_COACH.id,
    assignedCoachName: CURRENT_COACH.name,
    currentProgramTitle: 'Functional Hypertrophy & Athletic Endurance',
    targetFocus: 'Athletic Endurance',
    compliance14Days: 83,
  },
  {
    id: 'usr_t_05',
    email: 'liam.brooks@example.com',
    firstName: 'Liam',
    lastName: 'Brooks',
    name: 'Liam Brooks',
    role: 'TRAINEE',
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 234-9876',
    createdAt: '2024-04-10T00:00:00Z',
    updatedAt: '2024-04-10T00:00:00Z',
    lastActiveAt: new Date(Date.now() - 1 * 86400 * 1000).toISOString(),
    assignedCoachId: CURRENT_COACH.id,
    assignedCoachName: CURRENT_COACH.name,
    currentProgramTitle: 'Powerlifting Prep (Squat & Deadlift Peak)',
    targetFocus: 'Powerlifting Peak',
    compliance14Days: 95,
  },
  {
    id: 'usr_t_06',
    email: 'sophia.t@example.com',
    firstName: 'Sophia',
    lastName: 'Torres',
    name: 'Sophia Torres',
    role: 'TRAINEE',
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 345-8765',
    createdAt: '2024-05-20T00:00:00Z',
    updatedAt: '2024-05-20T00:00:00Z',
    lastActiveAt: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
    assignedCoachId: CURRENT_COACH.id,
    assignedCoachName: CURRENT_COACH.name,
    currentProgramTitle: 'Speed-Strength & Rotational Power',
    targetFocus: 'Rotational Power',
    compliance14Days: 88,
  },
  {
    id: 'usr_t_07',
    email: 'alex.wong@gmail.com',
    firstName: 'Alex',
    lastName: 'Wong',
    name: 'Alex Wong',
    role: 'TRAINEE',
    status: 'ACTIVE',
    phone: '+1 (555) 456-7654',
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
    lastActiveAt: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
    assignedCoachId: 'usr_coach_02',
    assignedCoachName: 'Elena Rostova',
    currentProgramTitle: 'High Performance Tennis Hypertrophy',
    compliance14Days: 90,
  },
  {
    id: 'usr_t_08',
    email: 'daniel.brooks@fitness.org',
    firstName: 'Daniel',
    lastName: 'Brooks',
    name: 'Daniel Brooks',
    role: 'TRAINEE',
    status: 'ACTIVE',
    phone: '+1 (555) 567-6543',
    createdAt: '2024-07-15T00:00:00Z',
    updatedAt: '2024-07-15T00:00:00Z',
    lastActiveAt: new Date(Date.now() - 3 * 86400 * 1000).toISOString(),
    assignedCoachId: 'usr_coach_04',
    assignedCoachName: 'John Smith',
    currentProgramTitle: 'Strength Foundations',
    compliance14Days: 78,
  },
  {
    id: 'usr_t_09',
    email: 'maria@example.com',
    firstName: 'Maria',
    lastName: 'Johnson',
    name: 'Maria Johnson',
    role: 'TRAINEE',
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    phone: '+1 (555) 678-5432',
    createdAt: '2024-08-01T00:00:00Z',
    updatedAt: '2024-08-01T00:00:00Z',
    lastActiveAt: new Date(Date.now() - 4 * 86400 * 1000).toISOString(),
    assignedCoachId: 'usr_coach_04',
    assignedCoachName: 'John Smith',
    currentProgramTitle: 'Strength Foundations',
    compliance14Days: 85,
  },
  {
    id: 'usr_t_10',
    email: 'jordan.lee@domain.com',
    firstName: 'Jordan',
    lastName: 'Lee',
    name: 'Jordan Lee',
    role: 'TRAINEE',
    status: 'SUSPENDED',
    phone: '+1 (555) 789-4321',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-05-10T00:00:00Z',
    lastActiveAt: new Date(Date.now() - 45 * 86400 * 1000).toISOString(),
    assignedCoachId: CURRENT_COACH.id,
    assignedCoachName: CURRENT_COACH.name,
    currentProgramTitle: 'Hypertrophy Foundations',
    compliance14Days: 20,
  },
  {
    id: 'usr_t_11',
    email: 'claire.monet@creative.io',
    firstName: 'Claire',
    lastName: 'Monet',
    name: 'Claire Monet',
    role: 'TRAINEE',
    status: 'INVITED',
    phone: '+1 (555) 890-3210',
    createdAt: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
    lastActiveAt: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
    assignedCoachId: CURRENT_COACH.id,
    assignedCoachName: CURRENT_COACH.name,
    invitationSentAt: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
    invitationStatus: 'PENDING',
  },
  {
    id: 'usr_t_12',
    email: 'harrison.ford@cinema.com',
    firstName: 'Harrison',
    lastName: 'Ford',
    name: 'Harrison Ford',
    role: 'TRAINEE',
    status: 'INVITED',
    phone: '+1 (555) 901-2109',
    createdAt: new Date(Date.now() - 5 * 86400 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400 * 1000).toISOString(),
    lastActiveAt: new Date(Date.now() - 5 * 86400 * 1000).toISOString(),
    assignedCoachId: 'usr_coach_03',
    assignedCoachName: 'Marcus Vance',
    invitationSentAt: new Date(Date.now() - 5 * 86400 * 1000).toISOString(),
    invitationStatus: 'PENDING',
  },
  {
    id: 'usr_t_13',
    email: 'maya.lin@architecture.org',
    firstName: 'Maya',
    lastName: 'Lin',
    name: 'Maya Lin',
    role: 'TRAINEE',
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    phone: '+1 (555) 012-1098',
    createdAt: '2024-04-18T00:00:00Z',
    updatedAt: '2024-04-18T00:00:00Z',
    lastActiveAt: new Date(Date.now() - 14 * 86400 * 1000).toISOString(),
    assignedCoachId: 'usr_coach_02',
    assignedCoachName: 'Elena Rostova',
    currentProgramTitle: 'Agility & Core Periodization',
    compliance14Days: 86,
  },
  {
    id: 'usr_t_14',
    email: 'kevin.bacon@actors.net',
    firstName: 'Kevin',
    lastName: 'Bacon',
    name: 'Kevin Bacon',
    role: 'TRAINEE',
    status: 'ACTIVE',
    phone: '+1 (555) 123-0987',
    createdAt: '2024-05-01T00:00:00Z',
    updatedAt: '2024-05-01T00:00:00Z',
    lastActiveAt: new Date(Date.now() - 20 * 86400 * 1000).toISOString(),
    assignedCoachId: 'usr_coach_05',
    assignedCoachName: 'Sophia Laurent',
    currentProgramTitle: 'Rehab & Joint Longevity',
    compliance14Days: 82,
  },
  {
    id: 'usr_t_15',
    email: 'test.bot@spamdomain.xyz',
    firstName: 'Test',
    lastName: 'Bot',
    name: 'Test Bot',
    role: 'TRAINEE',
    status: 'SUSPENDED',
    phone: '+1 (555) 000-0000',
    createdAt: '2024-06-10T00:00:00Z',
    updatedAt: '2024-06-11T00:00:00Z',
    lastActiveAt: new Date(Date.now() - 90 * 86400 * 1000).toISOString(),
  },
];

// Initial realistic audit log events
const INITIAL_AUDIT_LOGS: AuditLogRecord[] = [
  {
    id: 'audit_01',
    adminId: 'usr_admin_01',
    adminName: 'Letenent Administrator',
    action: 'USER_SUSPENDED',
    targetUserId: 'test.bot@spamdomain.xyz',
    targetUserName: 'Test Bot',
    details: 'Account suspended following automated spam detection alert.',
    timestamp: '2024-06-11T14:32:00Z',
    result: 'SUCCESS',
  },
  {
    id: 'audit_02',
    adminId: 'usr_admin_01',
    adminName: 'Letenent Administrator',
    action: 'ROLE_CHANGED',
    targetUserId: CURRENT_COACH.id,
    targetUserName: CURRENT_COACH.name,
    details: 'Verified credentials and assigned COACH role.',
    timestamp: '2024-01-10T10:00:00Z',
    result: 'SUCCESS',
  },
  {
    id: 'audit_03',
    adminId: 'usr_admin_01',
    adminName: 'Letenent Administrator',
    action: 'USER_CREATED',
    targetUserId: 'usr_coach_02',
    targetUserName: 'Elena Rostova',
    details: 'Created coach account with specialized tennis conditioning profile.',
    timestamp: '2024-01-15T09:15:00Z',
    result: 'SUCCESS',
  },
];

// Initial user activities
const INITIAL_USER_ACTIVITIES: Record<string, UserActivityRecord[]> = {
  [CURRENT_COACH.id]: [
    {
      id: 'act_c1',
      userId: CURRENT_COACH.id,
      activity: 'Logged in from desktop (Chrome / macOS)',
      category: 'LOGIN',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    {
      id: 'act_c2',
      userId: CURRENT_COACH.id,
      activity: 'Assigned new workout parameters to Kaiya Stone',
      category: 'PROGRAM',
      timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    },
    {
      id: 'act_c3',
      userId: CURRENT_COACH.id,
      activity: 'Reviewed weekly check-in for Wilson Pena',
      category: 'WORKOUT',
      timestamp: new Date(Date.now() - 1 * 86400 * 1000).toISOString(),
    },
    {
      id: 'act_c4',
      userId: CURRENT_COACH.id,
      activity: 'Updated coach profile specialties and bio',
      category: 'PROFILE',
      timestamp: new Date(Date.now() - 4 * 86400 * 1000).toISOString(),
    },
  ],
  [INITIAL_TRAINEES[0].user.id]: [
    {
      id: 'act_k1',
      userId: INITIAL_TRAINEES[0].user.id,
      activity: 'Logged in from mobile (iOS App)',
      category: 'LOGIN',
      timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    },
    {
      id: 'act_k2',
      userId: INITIAL_TRAINEES[0].user.id,
      activity: 'Completed workout: Push Hypertrophy Day 1 (12 sets)',
      category: 'WORKOUT',
      timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    },
    {
      id: 'act_k3',
      userId: INITIAL_TRAINEES[0].user.id,
      activity: 'Submitted weekly physical check-in (Bodyweight: 142.4 lbs)',
      category: 'WORKOUT',
      timestamp: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
    },
    {
      id: 'act_k4',
      userId: INITIAL_TRAINEES[0].user.id,
      activity: 'Accepted invitation & completed onboarding setup',
      category: 'INVITATION',
      timestamp: '2024-03-01T10:00:00Z',
    },
  ],
};

// Helper: load users from storage or initialize
function getStoredUsers(): AdminUserRecord[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading admin users from storage', err);
  }
  // Initialize with seed data
  saveUsersToStorage(INITIAL_ADMIN_USERS);
  return INITIAL_ADMIN_USERS;
}

function saveUsersToStorage(users: AdminUserRecord[]) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Error saving admin users to storage', err);
  }
}

function getStoredAuditLogs(): AuditLogRecord[] {
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading audit logs from storage', err);
  }
  return INITIAL_AUDIT_LOGS;
}

function saveAuditLogsToStorage(logs: AuditLogRecord[]) {
  try {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs));
  } catch (err) {
    console.error('Error saving audit logs', err);
  }
}

function recordAuditEvent(event: Omit<AuditLogRecord, 'id' | 'timestamp'>) {
  const logs = getStoredAuditLogs();
  const newEntry: AuditLogRecord = {
    ...event,
    id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
  };
  saveAuditLogsToStorage([newEntry, ...logs]);
}

function recordUserActivity(userId: string, activity: string, category: UserActivityRecord['category']) {
  try {
    const raw = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    const activityMap: Record<string, UserActivityRecord[]> = raw ? JSON.parse(raw) : { ...INITIAL_USER_ACTIVITIES };
    const userList = activityMap[userId] || [];
    const newRecord: UserActivityRecord = {
      id: `act_${Date.now()}`,
      userId,
      activity,
      category,
      timestamp: new Date().toISOString(),
    };
    activityMap[userId] = [newRecord, ...userList];
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activityMap));
  } catch (err) {
    console.error('Error saving user activity', err);
  }
}

// -------------------------------------------------------------
// Public Admin User Management Service API
// -------------------------------------------------------------

export const adminUserService = {
  /**
   * Retrieve platform users with full text search, multi-filter aggregation,
   * column sorting, and paginated response.
   */
  async getUsers(params: UserQueryParams): Promise<{
    users: AdminUserRecord[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    // Artificial small delay to allow smooth skeleton loading demonstration
    await new Promise((resolve) => setTimeout(resolve, 80));

    let users = getStoredUsers();

    // 1. Search Query filter (matches first name, last name, full name, email)
    if (params.searchQuery && params.searchQuery.trim().length > 0) {
      const q = params.searchQuery.trim().toLowerCase();
      users = users.filter((u) => {
        const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
        const displayName = (u.name || '').toLowerCase();
        const email = (u.email || '').toLowerCase();
        const phone = (u.phone || '').toLowerCase();
        return (
          fullName.includes(q) ||
          displayName.includes(q) ||
          email.includes(q) ||
          phone.includes(q) ||
          u.id.toLowerCase().includes(q)
        );
      });
    }

    // 2. Role filter
    if (params.roleFilter && params.roleFilter !== 'ALL') {
      users = users.filter((u) => u.role === params.roleFilter);
    }

    // 3. Status filter
    if (params.statusFilter && params.statusFilter !== 'ALL') {
      users = users.filter((u) => u.status === params.statusFilter);
    }

    // 4. Registration Date filter
    if (params.registrationDateFilter && params.registrationDateFilter !== 'ALL') {
      const now = Date.now();
      if (params.registrationDateFilter === 'TODAY') {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        users = users.filter((u) => new Date(u.createdAt).getTime() >= startOfDay.getTime());
      } else if (params.registrationDateFilter === '7D') {
        const cutoff = now - 7 * 86400 * 1000;
        users = users.filter((u) => new Date(u.createdAt).getTime() >= cutoff);
      } else if (params.registrationDateFilter === '30D') {
        const cutoff = now - 30 * 86400 * 1000;
        users = users.filter((u) => new Date(u.createdAt).getTime() >= cutoff);
      } else if (params.registrationDateFilter === 'CUSTOM') {
        if (params.customDateStart) {
          const start = new Date(params.customDateStart).getTime();
          users = users.filter((u) => new Date(u.createdAt).getTime() >= start);
        }
        if (params.customDateEnd) {
          const end = new Date(params.customDateEnd).getTime() + 86400 * 1000;
          users = users.filter((u) => new Date(u.createdAt).getTime() <= end);
        }
      }
    }

    // 5. Last Active filter
    if (params.lastActiveFilter && params.lastActiveFilter !== 'ANY') {
      const now = Date.now();
      if (params.lastActiveFilter === 'TODAY') {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        users = users.filter((u) => new Date(u.lastActiveAt).getTime() >= startOfDay.getTime());
      } else if (params.lastActiveFilter === '7D') {
        const cutoff = now - 7 * 86400 * 1000;
        users = users.filter((u) => new Date(u.lastActiveAt).getTime() >= cutoff);
      } else if (params.lastActiveFilter === '30D') {
        const cutoff = now - 30 * 86400 * 1000;
        users = users.filter((u) => new Date(u.lastActiveAt).getTime() >= cutoff);
      } else if (params.lastActiveFilter === 'INACTIVE') {
        const cutoff = now - 30 * 86400 * 1000;
        users = users.filter((u) => new Date(u.lastActiveAt).getTime() < cutoff);
      }
    }

    // 6. Sorting
    const sortBy = params.sortBy || 'joined';
    const sortDir = params.sortDirection || 'desc';

    users.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '');
          break;
        case 'email':
          comparison = (a.email || '').localeCompare(b.email || '');
          break;
        case 'role':
          comparison = (a.role || '').localeCompare(b.role || '');
          break;
        case 'status':
          comparison = (a.status || '').localeCompare(b.status || '');
          break;
        case 'joined':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'lastActive':
          comparison = new Date(a.lastActiveAt).getTime() - new Date(b.lastActiveAt).getTime();
          break;
        default:
          comparison = 0;
      }
      return sortDir === 'asc' ? comparison : -comparison;
    });

    const total = users.length;
    const pageSize = Math.max(1, params.pageSize || 25);
    const totalPages = Math.ceil(total / pageSize) || 1;
    const page = Math.min(Math.max(1, params.page || 1), totalPages);

    const startIndex = (page - 1) * pageSize;
    const paginatedUsers = users.slice(startIndex, startIndex + pageSize);

    return {
      users: paginatedUsers,
      total,
      page,
      pageSize,
      totalPages,
    };
  },

  /**
   * Retrieve single user details by ID
   */
  async getUserById(id: string): Promise<AdminUserRecord | null> {
    const users = getStoredUsers();
    return users.find((u) => u.id === id) || null;
  },

  /**
   * Get dynamically aggregated user statistics
   */
  async getUserStatistics(): Promise<UserStatistics> {
    const users = getStoredUsers();
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status === 'ACTIVE').length;
    const coaches = users.filter((u) => u.role === 'COACH').length;
    const trainees = users.filter((u) => u.role === 'TRAINEE').length;
    const suspendedUsers = users.filter((u) => u.status === 'SUSPENDED').length;
    const invitedUsers = users.filter((u) => u.status === 'INVITED').length;

    return {
      totalUsers,
      activeUsers,
      coaches,
      trainees,
      suspendedUsers,
      invitedUsers,
    };
  },

  /**
   * Update profile information
   */
  async updateUser(
    id: string,
    updates: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      avatarUrl?: string;
    },
    adminUser: User
  ): Promise<AdminUserRecord> {
    if (adminUser.role !== 'ADMIN') {
      throw new Error('Unauthorized: Only administrators can modify user records.');
    }

    const users = getStoredUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new Error(`User with ID ${id} not found.`);
    }

    const current = users[index];
    const newName = `${updates.firstName.trim()} ${updates.lastName.trim()}`.trim();

    const updatedUser: AdminUserRecord = {
      ...current,
      firstName: updates.firstName.trim(),
      lastName: updates.lastName.trim(),
      name: newName || current.name,
      email: updates.email.trim(),
      phone: updates.phone?.trim() || current.phone,
      avatarUrl: updates.avatarUrl?.trim() || current.avatarUrl,
      updatedAt: new Date().toISOString(),
    };

    users[index] = updatedUser;
    saveUsersToStorage(users);

    recordAuditEvent({
      adminId: adminUser.id,
      adminName: adminUser.name,
      action: 'USER_EDITED',
      targetUserId: id,
      targetUserName: updatedUser.name,
      details: `Updated user profile information (Name: ${updatedUser.name}, Email: ${updatedUser.email})`,
      result: 'SUCCESS',
    });

    recordUserActivity(id, `Profile details updated by administrator (${adminUser.name})`, 'PROFILE');

    return updatedUser;
  },

  /**
   * Change user role with strict administrative safeguards
   */
  async changeUserRole(id: string, newRole: UserRole, adminUser: User): Promise<AdminUserRecord> {
    if (adminUser.role !== 'ADMIN') {
      throw new Error('Unauthorized: Only administrators can change roles.');
    }

    const users = getStoredUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new Error(`User with ID ${id} not found.`);
    }

    const targetUser = users[index];

    // Administrative safeguard: protect current admin from demoting themselves
    if (adminUser.id === id && newRole !== 'ADMIN') {
      throw new Error('You cannot remove your own administrator access.');
    }

    const oldRole = targetUser.role;
    targetUser.role = newRole;
    targetUser.updatedAt = new Date().toISOString();

    users[index] = targetUser;
    saveUsersToStorage(users);

    recordAuditEvent({
      adminId: adminUser.id,
      adminName: adminUser.name,
      action: 'ROLE_CHANGED',
      targetUserId: id,
      targetUserName: targetUser.name,
      details: `Changed role from ${oldRole} to ${newRole}`,
      result: 'SUCCESS',
    });

    recordUserActivity(
      id,
      `Role changed from ${oldRole} to ${newRole} by administrator ${adminUser.name}`,
      'SECURITY'
    );

    return targetUser;
  },

  /**
   * Suspend a user account with safety checks
   */
  async suspendUser(id: string, reason: string | undefined, adminUser: User): Promise<AdminUserRecord> {
    if (adminUser.role !== 'ADMIN') {
      throw new Error('Unauthorized: Only administrators can suspend accounts.');
    }

    // Administrative safeguard: protect current admin from suspending themselves
    if (adminUser.id === id) {
      throw new Error('You cannot suspend your own administrator account.');
    }

    const users = getStoredUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new Error(`User with ID ${id} not found.`);
    }

    const targetUser = users[index];
    targetUser.status = 'SUSPENDED';
    targetUser.updatedAt = new Date().toISOString();

    users[index] = targetUser;
    saveUsersToStorage(users);

    recordAuditEvent({
      adminId: adminUser.id,
      adminName: adminUser.name,
      action: 'USER_SUSPENDED',
      targetUserId: id,
      targetUserName: targetUser.name,
      details: reason || 'Account suspended by administrator.',
      result: 'SUCCESS',
    });

    recordUserActivity(
      id,
      `Account suspended by administrator (${reason || 'Standard review'})`,
      'STATUS_CHANGE'
    );

    return targetUser;
  },

  /**
   * Reactivate a suspended user account
   */
  async activateUser(id: string, adminUser: User): Promise<AdminUserRecord> {
    if (adminUser.role !== 'ADMIN') {
      throw new Error('Unauthorized: Only administrators can activate accounts.');
    }

    const users = getStoredUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new Error(`User with ID ${id} not found.`);
    }

    const targetUser = users[index];
    targetUser.status = 'ACTIVE';
    targetUser.updatedAt = new Date().toISOString();

    users[index] = targetUser;
    saveUsersToStorage(users);

    recordAuditEvent({
      adminId: adminUser.id,
      adminName: adminUser.name,
      action: 'USER_ACTIVATED',
      targetUserId: id,
      targetUserName: targetUser.name,
      details: 'Account reactivated by administrator.',
      result: 'SUCCESS',
    });

    recordUserActivity(id, 'Account activated by administrator', 'STATUS_CHANGE');

    return targetUser;
  },

  /**
   * Resend onboarding invitation
   */
  async resendInvitation(id: string, adminUser: User): Promise<boolean> {
    if (adminUser.role !== 'ADMIN') {
      throw new Error('Unauthorized.');
    }
    const users = getStoredUsers();
    const user = users.find((u) => u.id === id);
    if (!user) throw new Error('User not found');

    user.invitationSentAt = new Date().toISOString();
    saveUsersToStorage(users);

    recordAuditEvent({
      adminId: adminUser.id,
      adminName: adminUser.name,
      action: 'INVITATION_RESENT',
      targetUserId: id,
      targetUserName: user.name,
      details: `Resent onboarding invitation to ${user.email}`,
      result: 'SUCCESS',
    });

    recordUserActivity(id, `Onboarding invitation re-dispatched to ${user.email}`, 'INVITATION');

    return true;
  },

  /**
   * Cancel onboarding invitation
   */
  async cancelInvitation(id: string, adminUser: User): Promise<boolean> {
    if (adminUser.role !== 'ADMIN') {
      throw new Error('Unauthorized.');
    }
    let users = getStoredUsers();
    const user = users.find((u) => u.id === id);
    if (!user) throw new Error('User not found');

    users = users.filter((u) => u.id !== id);
    saveUsersToStorage(users);

    recordAuditEvent({
      adminId: adminUser.id,
      adminName: adminUser.name,
      action: 'INVITATION_CANCELLED',
      targetUserId: id,
      targetUserName: user.name,
      details: `Cancelled pending invitation for ${user.email}`,
      result: 'SUCCESS',
    });

    return true;
  },

  /**
   * Create a new user account
   */
  async createUser(
    payload: {
      firstName: string;
      lastName: string;
      email: string;
      role: UserRole;
      phone?: string;
      avatarUrl?: string;
      initialStatus?: UserAccountStatus;
    },
    adminUser?: User
  ): Promise<AdminUserRecord> {
    if (adminUser && adminUser.role !== 'ADMIN') {
      throw new Error('Unauthorized: Only administrators can create users.');
    }

    const performer = adminUser || INITIAL_ADMIN_USERS[0];
    const users = getStoredUsers();

    // Check email uniqueness
    const exists = users.some((u) => u.email.toLowerCase() === payload.email.trim().toLowerCase());
    if (exists) {
      throw new Error(`A user with email ${payload.email} already exists.`);
    }

    const now = new Date().toISOString();
    const fullName = `${payload.firstName.trim()} ${payload.lastName.trim()}`.trim();
    const id = `usr_${payload.role.toLowerCase()}_${Date.now()}`;

    const newUser: AdminUserRecord = {
      id,
      email: payload.email.trim(),
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      name: fullName || payload.email.split('@')[0],
      role: payload.role,
      status: payload.initialStatus || 'ACTIVE',
      phone: payload.phone?.trim(),
      avatarUrl: payload.avatarUrl?.trim(),
      createdAt: now,
      updatedAt: now,
      lastActiveAt: now,
      traineesCount: payload.role === 'COACH' ? 0 : undefined,
      activeProgramsCount: payload.role === 'COACH' ? 0 : undefined,
    };

    users.unshift(newUser);
    saveUsersToStorage(users);

    recordAuditEvent({
      adminId: performer.id,
      adminName: performer.name,
      action: 'USER_CREATED',
      targetUserId: id,
      targetUserName: newUser.name,
      details: `Created new user ${newUser.name} with role ${newUser.role}`,
      result: 'SUCCESS',
    });

    recordUserActivity(id, `Account created by administrator (${performer.name})`, 'PROFILE');

    return newUser;
  },

  /**
   * Get activity logs for a specific user
   */
  async getUserActivity(userId: string): Promise<UserActivityRecord[]> {
    try {
      const raw = localStorage.getItem(ACTIVITY_STORAGE_KEY);
      const activityMap: Record<string, UserActivityRecord[]> = raw ? JSON.parse(raw) : { ...INITIAL_USER_ACTIVITIES };
      return activityMap[userId] || [];
    } catch {
      return [];
    }
  },

  /**
   * Get platform audit logs
   */
  async getAuditLogs(): Promise<AuditLogRecord[]> {
    return getStoredAuditLogs();
  },

  /**
   * Export users dataset to CSV or JSON
   */
  async exportUsers(format: 'csv' | 'json'): Promise<string> {
    const users = getStoredUsers();
    if (format === 'json') {
      return JSON.stringify(users, null, 2);
    }
    // CSV format
    const headers = ['ID', 'Name', 'First Name', 'Last Name', 'Email', 'Role', 'Status', 'Joined', 'Last Active'];
    const rows = users.map((u) => [
      `"${u.id}"`,
      `"${u.name.replace(/"/g, '""')}"`,
      `"${u.firstName.replace(/"/g, '""')}"`,
      `"${u.lastName.replace(/"/g, '""')}"`,
      `"${u.email}"`,
      `"${u.role}"`,
      `"${u.status}"`,
      `"${u.createdAt}"`,
      `"${u.lastActiveAt}"`,
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  },
};
