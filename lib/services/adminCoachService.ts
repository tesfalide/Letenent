// lib/services/adminCoachService.ts
// Enterprise Coach Management Service Layer for Letenent Admin Control Center
// Interacts with the shared users repository, programs catalog, coach-trainee rosters, and audit logs.

import {
  CoachRecord,
  CoachStatistics,
  CoachQueryParams,
  CoachTraineeItem,
  CoachProgramItem,
  CoachActivityEvent,
  CoachPerformanceMetrics,
  CoachChartDataPoint,
  User,
  AdminUserRecord,
  AuditLogRecord,
} from '@/types';
import { adminUserService } from './adminUserService';

const USERS_STORAGE_KEY = 'letenent_admin_users_db';
const AUDIT_STORAGE_KEY = 'letenent_admin_audit_logs';
const COACH_PROGRAMS_STORAGE_KEY = 'letenent_admin_coach_programs';

// Helper to access current stored users from the unified platform user repository
function getStoredUsers(): AdminUserRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to read users from storage:', err);
  }
  return [];
}

function saveUsersToStorage(users: AdminUserRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users to storage:', err);
  }
}

function recordAuditEvent(event: Omit<AuditLogRecord, 'id' | 'timestamp'>): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    const logs: AuditLogRecord[] = raw ? JSON.parse(raw) : [];
    const newLog: AuditLogRecord = {
      ...event,
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(newLog);
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs.slice(0, 500)));
  } catch (err) {
    console.error('Failed to record audit event:', err);
  }
}

// Initial program blueprints per coach
const INITIAL_COACH_PROGRAMS: Record<string, CoachProgramItem[]> = {
  usr_coach_01: [
    {
      id: 'cp_prog_01',
      title: '12-Week Hypertrophy & Strength Block',
      description: 'Cascading volume progression targeting push strength, chest fiber recruitment, and overhead stability.',
      traineesCount: 14,
      durationWeeks: 12,
      completionRate: 94,
      status: 'ACTIVE',
      createdAt: '2024-03-01T00:00:00Z',
    },
    {
      id: 'cp_prog_02',
      title: 'Lower Body Posterior & Quad Focus',
      description: 'RDLs, back squat mechanics, and unilateral split-squat progressive overload.',
      traineesCount: 8,
      durationWeeks: 8,
      completionRate: 91,
      status: 'ACTIVE',
      createdAt: '2024-04-10T00:00:00Z',
    },
    {
      id: 'cp_prog_03',
      title: 'Upper Body Power & Speed Split',
      description: 'Dynamic effort bench pressing, weighted pull-ups, and rotational core reinforcement.',
      traineesCount: 2,
      durationWeeks: 6,
      completionRate: 88,
      status: 'ACTIVE',
      createdAt: '2024-05-15T00:00:00Z',
    },
    {
      id: 'cp_prog_04',
      title: 'Post-Meet Deload & Functional Rebuild',
      description: 'Joint recovery cycle emphasizing tempo work and scapular stability.',
      traineesCount: 0,
      durationWeeks: 4,
      completionRate: 100,
      status: 'COMPLETED',
      createdAt: '2024-02-01T00:00:00Z',
    },
    {
      id: 'cp_prog_05',
      title: 'Introductory Barbell Foundations',
      description: 'Technical mastery for novice competitive lifters.',
      traineesCount: 0,
      durationWeeks: 8,
      completionRate: 75,
      status: 'ARCHIVED',
      createdAt: '2024-01-10T00:00:00Z',
    },
  ],
  usr_coach_02: [
    {
      id: 'cp_prog_06',
      title: 'Tennis Rotational Power & Agility Protocol',
      description: 'Multi-planar medicine ball throws, kinetic chain acceleration, and lateral sprint agility.',
      traineesCount: 22,
      durationWeeks: 10,
      completionRate: 93,
      status: 'ACTIVE',
      createdAt: '2024-02-15T00:00:00Z',
    },
    {
      id: 'cp_prog_07',
      title: 'High-Performance Serve Power Program',
      description: 'Scapular health, thoracic extension, and posterior rotator cuff capacity.',
      traineesCount: 16,
      durationWeeks: 8,
      completionRate: 89,
      status: 'ACTIVE',
      createdAt: '2024-03-20T00:00:00Z',
    },
  ],
  usr_coach_03: [
    {
      id: 'cp_prog_08',
      title: 'Peak Strength & Peaking Phase',
      description: 'RPE 8-9.5 squat, bench, and deadlift taper for sanctioned meets.',
      traineesCount: 18,
      durationWeeks: 12,
      completionRate: 87,
      status: 'ACTIVE',
      createdAt: '2024-02-10T00:00:00Z',
    },
    {
      id: 'cp_prog_09',
      title: 'Deadlift Peaking & Grip Strength',
      description: 'Hook grip mechanics, paused deficit pulls, and eccentric hamstring hypertrophy.',
      traineesCount: 11,
      durationWeeks: 6,
      completionRate: 92,
      status: 'ACTIVE',
      createdAt: '2024-04-01T00:00:00Z',
    },
  ],
};

function getStoredCoachPrograms(coachId: string): CoachProgramItem[] {
  if (typeof window === 'undefined') return INITIAL_COACH_PROGRAMS[coachId] || [];
  try {
    const raw = localStorage.getItem(`${COACH_PROGRAMS_STORAGE_KEY}_${coachId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to parse coach programs from storage:', err);
  }
  return INITIAL_COACH_PROGRAMS[coachId] || [
    {
      id: `cp_prog_def_${coachId}`,
      title: 'General Physical Preparedness (GPP)',
      description: 'Foundational aerobic and resistance conditioning program.',
      traineesCount: 4,
      durationWeeks: 6,
      completionRate: 85,
      status: 'ACTIVE',
      createdAt: '2024-02-01T00:00:00Z',
    },
  ];
}

function saveStoredCoachPrograms(coachId: string, programs: CoachProgramItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${COACH_PROGRAMS_STORAGE_KEY}_${coachId}`, JSON.stringify(programs));
  } catch (err) {
    console.error('Failed to save coach programs:', err);
  }
}

export const adminCoachService = {
  /**
   * Retrieves platform-wide aggregated coach statistics
   */
  async getCoachStats(): Promise<CoachStatistics> {
    // Ensure underlying users database is loaded
    await adminUserService.getUsers({ page: 1, pageSize: 1 });
    const allUsers = getStoredUsers();
    const coaches = allUsers.filter((u) => u.role === 'COACH') as CoachRecord[];

    const totalCoaches = coaches.length;
    const activeCoaches = coaches.filter((c) => c.status === 'ACTIVE').length;
    const inactiveCoaches = coaches.filter((c) => c.status === 'INACTIVE' || c.status === 'SUSPENDED').length;

    // Calculate actual trainees count: either from traineesCount property or assigned relationships
    const totalTrainees = coaches.reduce((acc, c) => acc + (c.traineesCount || 0), 0);
    const activePrograms = coaches.reduce((acc, c) => acc + (c.activeProgramsCount || 0), 0);
    const avgTraineesPerCoach = totalCoaches > 0 ? Math.round(totalTrainees / totalCoaches) : 0;

    return {
      totalCoaches,
      activeCoaches,
      inactiveCoaches,
      totalTrainees,
      activePrograms,
      avgTraineesPerCoach,
    };
  },

  /**
   * Queries coaches with comprehensive multi-criteria filtering, search, sorting, and pagination
   */
  async getCoaches(params: CoachQueryParams): Promise<{
    coaches: CoachRecord[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    // Ensure repository initialization
    await adminUserService.getUsers({ page: 1, pageSize: 1 });
    let list = getStoredUsers().filter((u) => u.role === 'COACH') as CoachRecord[];

    // 1. Search Query (First name, Last name, Full name, Email)
    if (params.searchQuery && params.searchQuery.trim()) {
      const q = params.searchQuery.trim().toLowerCase();
      list = list.filter((c) => {
        const fn = (c.firstName || '').toLowerCase();
        const ln = (c.lastName || '').toLowerCase();
        const name = (c.name || '').toLowerCase();
        const email = (c.email || '').toLowerCase();
        const title = (c.professionalTitle || '').toLowerCase();
        return (
          fn.includes(q) ||
          ln.includes(q) ||
          name.includes(q) ||
          email.includes(q) ||
          title.includes(q)
        );
      });
    }

    // 2. Status Filter
    if (params.statusFilter && params.statusFilter !== 'ALL') {
      list = list.filter((c) => c.status === params.statusFilter);
    }

    // 3. Activity Recency Filter
    if (params.activityFilter && params.activityFilter !== 'ALL') {
      const now = Date.now();
      const ms24h = 24 * 3600 * 1000;
      const ms7d = 7 * ms24h;
      const ms30d = 30 * ms24h;

      list = list.filter((c) => {
        const lastActiveTime = new Date(c.lastActiveAt).getTime();
        const diff = now - lastActiveTime;

        if (params.activityFilter === 'RECENT') {
          return diff <= ms24h;
        }
        if (params.activityFilter === '7D') {
          return diff >= ms7d;
        }
        if (params.activityFilter === '30D') {
          return diff >= ms30d;
        }
        return true;
      });
    }

    // 4. Trainee Count Filter
    if (params.traineeCountFilter && params.traineeCountFilter !== 'ALL') {
      list = list.filter((c) => {
        const count = c.traineesCount || 0;
        if (params.traineeCountFilter === 'ZERO') return count === 0;
        if (params.traineeCountFilter === '1_10') return count >= 1 && count <= 10;
        if (params.traineeCountFilter === '11_25') return count >= 11 && count <= 25;
        if (params.traineeCountFilter === '26_PLUS') return count >= 26;
        return true;
      });
    }

    // 5. Program Filter
    if (params.programFilter && params.programFilter !== 'ALL') {
      list = list.filter((c) => {
        const count = c.activeProgramsCount || 0;
        if (params.programFilter === 'NO_PROGRAMS') return count === 0;
        if (params.programFilter === 'HAS_ACTIVE') return count > 0;
        return true;
      });
    }

    // 6. Joined Date Filter
    if (params.joinedFilter && params.joinedFilter !== 'ALL') {
      const now = Date.now();
      const ms24h = 24 * 3600 * 1000;

      list = list.filter((c) => {
        const joinedTime = new Date(c.createdAt).getTime();
        const diff = now - joinedTime;

        if (params.joinedFilter === 'TODAY') {
          return diff <= ms24h;
        }
        if (params.joinedFilter === '7D') {
          return diff <= 7 * ms24h;
        }
        if (params.joinedFilter === '30D') {
          return diff <= 30 * ms24h;
        }
        if (params.joinedFilter === 'CUSTOM') {
          if (params.customDateStart) {
            const start = new Date(params.customDateStart).getTime();
            if (joinedTime < start) return false;
          }
          if (params.customDateEnd) {
            const end = new Date(params.customDateEnd).getTime() + ms24h;
            if (joinedTime > end) return false;
          }
          return true;
        }
        return true;
      });
    }

    // 7. Sorting
    const sortBy = params.sortBy || 'name';
    const sortDir = params.sortDirection === 'desc' ? -1 : 1;

    list.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '');
          break;
        case 'email':
          comparison = (a.email || '').localeCompare(b.email || '');
          break;
        case 'trainees':
          comparison = (a.traineesCount || 0) - (b.traineesCount || 0);
          break;
        case 'programs':
          comparison = (a.activeProgramsCount || 0) - (b.activeProgramsCount || 0);
          break;
        case 'lastActive':
          comparison = new Date(a.lastActiveAt).getTime() - new Date(b.lastActiveAt).getTime();
          break;
        case 'joined':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'status':
          comparison = (a.status || '').localeCompare(b.status || '');
          break;
        default:
          comparison = (a.name || '').localeCompare(b.name || '');
      }
      return comparison * sortDir;
    });

    const totalCount = list.length;
    const page = Math.max(1, params.page || 1);
    const pageSize = params.pageSize || 25;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const coaches = list.slice(startIndex, startIndex + pageSize);

    return {
      coaches,
      totalCount,
      page,
      pageSize,
      totalPages,
    };
  },

  /**
   * Retrieves single Coach profile by ID
   */
  async getCoachById(id: string): Promise<CoachRecord | null> {
    await adminUserService.getUsers({ page: 1, pageSize: 1 });
    const users = getStoredUsers();
    const coach = users.find((u) => u.id === id && u.role === 'COACH') as CoachRecord | undefined;
    return coach || null;
  },

  /**
   * Retrieves trainees assigned to this Coach
   */
  async getCoachTrainees(coachId: string): Promise<CoachTraineeItem[]> {
    await adminUserService.getUsers({ page: 1, pageSize: 1 });
    const allUsers = getStoredUsers();

    // Find trainees with assignedCoachId matching coachId
    const assignedTrainees = allUsers.filter(
      (u) => u.role === 'TRAINEE' && u.assignedCoachId === coachId
    );

    if (assignedTrainees.length > 0) {
      return assignedTrainees.map((t) => ({
        id: t.id,
        name: t.name,
        email: t.email,
        avatarUrl: t.avatarUrl,
        currentProgramTitle: t.currentProgramTitle || 'General Strength & Conditioning',
        workoutCompliance: t.compliance14Days !== undefined ? t.compliance14Days : 88,
        lastActivity: t.lastActiveAt,
        status: t.status === 'SUSPENDED' ? 'PAUSED' : t.status === 'INVITED' ? 'INVITED' : 'ACTIVE',
        joinedDate: t.createdAt,
      }));
    }

    // If specific coach has no assigned trainees recorded, return fallback matching coach stats
    const coach = allUsers.find((u) => u.id === coachId);
    if (!coach || (coach.traineesCount || 0) === 0) {
      return [];
    }

    // Default populated roster for coach demo consistency
    return [
      {
        id: `tr_${coachId}_01`,
        name: 'Marcus Chen',
        email: 'marcus.chen@example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        currentProgramTitle: '12-Week Hypertrophy & Strength Block',
        workoutCompliance: 94,
        lastActivity: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        status: 'ACTIVE',
        joinedDate: '2024-02-01T00:00:00Z',
      },
      {
        id: `tr_${coachId}_02`,
        name: 'Sarah Jenkins',
        email: 's.jenkins@example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
        currentProgramTitle: 'Functional Hypertrophy & Athletic Endurance',
        workoutCompliance: 86,
        lastActivity: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
        status: 'ACTIVE',
        joinedDate: '2024-03-15T00:00:00Z',
      },
      {
        id: `tr_${coachId}_03`,
        name: 'Liam Brooks',
        email: 'liam.brooks@example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        currentProgramTitle: 'Powerlifting Prep (Squat & Deadlift Peak)',
        workoutCompliance: 96,
        lastActivity: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
        status: 'ACTIVE',
        joinedDate: '2024-04-10T00:00:00Z',
      },
      {
        id: `tr_${coachId}_04`,
        name: 'Sophia Torres',
        email: 'sophia.t@example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        currentProgramTitle: 'Speed-Strength & Rotational Power',
        workoutCompliance: 88,
        lastActivity: new Date(Date.now() - 1 * 86400 * 1000).toISOString(),
        status: 'ACTIVE',
        joinedDate: '2024-05-20T00:00:00Z',
      },
      {
        id: `tr_${coachId}_05`,
        name: 'Jordan Lee',
        email: 'jordan.lee@domain.com',
        avatarUrl: undefined,
        currentProgramTitle: 'Hypertrophy Foundations',
        workoutCompliance: 40,
        lastActivity: new Date(Date.now() - 18 * 86400 * 1000).toISOString(),
        status: 'PAUSED',
        joinedDate: '2024-03-01T00:00:00Z',
      },
    ];
  },

  /**
   * Retrieves programs managed by this Coach
   */
  async getCoachPrograms(coachId: string): Promise<CoachProgramItem[]> {
    return getStoredCoachPrograms(coachId);
  },

  /**
   * Archives a program for a coach
   */
  async archiveCoachProgram(coachId: string, programId: string, adminUser: User): Promise<void> {
    if (adminUser.role !== 'ADMIN') {
      throw new Error('Unauthorized: Only administrators can archive programs.');
    }
    const programs = getStoredCoachPrograms(coachId);
    const target = programs.find((p) => p.id === programId);
    if (!target) {
      throw new Error('Program not found.');
    }
    target.status = 'ARCHIVED';
    saveStoredCoachPrograms(coachId, programs);

    recordAuditEvent({
      adminId: adminUser.id,
      adminName: adminUser.name,
      action: 'PROGRAM_ARCHIVED',
      targetUserId: coachId,
      targetUserName: `Program: ${target.title}`,
      details: `Administrator archived program "${target.title}" for coach ${coachId}`,
      result: 'SUCCESS',
    });
  },

  /**
   * Retrieves recent chronological events for this Coach
   */
  async getCoachActivity(coachId: string): Promise<CoachActivityEvent[]> {
    const coach = await this.getCoachById(coachId);
    if (!coach) return [];

    // Realistic chronological events
    return [
      {
        id: `ev_${coachId}_1`,
        coachId,
        type: 'PROGRAM_CREATED',
        title: 'Created new training program',
        description: 'Published "12-Week Hypertrophy & Strength Block (Wave 3)" with 6 workout templates.',
        timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      },
      {
        id: `ev_${coachId}_2`,
        coachId,
        type: 'REVIEW_COMPLETED',
        title: 'Completed weekly client check-in review',
        description: 'Reviewed check-in for Marcus Chen (adherence: 96%, weight +0.4 lbs). Provided feedback video.',
        timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
      },
      {
        id: `ev_${coachId}_3`,
        coachId,
        type: 'WORKOUT_UPDATED',
        title: 'Adjusted workout parameters',
        description: 'Increased target load on Incline DB Bench Press to 75 lbs for Sarah Jenkins.',
        timestamp: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
      },
      {
        id: `ev_${coachId}_4`,
        coachId,
        type: 'TRAINEE_ADDED',
        title: 'Onboarded new athlete',
        description: 'Successfully onboarded athlete Liam Brooks to competitive roster.',
        timestamp: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
      },
      {
        id: `ev_${coachId}_5`,
        coachId,
        type: 'MESSAGE_SENT',
        title: 'Broadcasted team message',
        description: 'Sent recovery protocol notes regarding hydration during deload week.',
        timestamp: new Date(Date.now() - 3 * 86400 * 1000).toISOString(),
      },
      {
        id: `ev_${coachId}_6`,
        coachId,
        type: 'PROFILE_UPDATED',
        title: 'Updated professional credentials',
        description: 'Updated bio and certified coaching specialties in coach profile.',
        timestamp: new Date(Date.now() - 5 * 86400 * 1000).toISOString(),
      },
      {
        id: `ev_${coachId}_7`,
        coachId,
        type: 'LOGIN',
        title: 'Coach authenticated into platform',
        description: 'Logged in from desktop browser session.',
        timestamp: new Date(Date.now() - 6 * 86400 * 1000).toISOString(),
      },
    ];
  },

  /**
   * Performance metrics for administrative analysis (strictly non-evaluative/non-ranking)
   */
  async getCoachPerformanceMetrics(coachId: string): Promise<CoachPerformanceMetrics> {
    const coach = await this.getCoachById(coachId);
    return {
      traineeRetentionRate: coach?.retentionRate || 92,
      workoutCompletionRate: coach?.complianceRate || 91,
      programCompletionRate: 88,
      activeTraineePercentage: 86,
      activityScore: 142,
    };
  },

  /**
   * Coaching activity trend over time (7D, 30D, 90D, 6M)
   */
  async getCoachActivityChartData(
    coachId: string,
    range: '7D' | '30D' | '90D' | '6M'
  ): Promise<CoachChartDataPoint[]> {
    const now = new Date();
    const points: CoachChartDataPoint[] = [];

    const numPoints = range === '7D' ? 7 : range === '30D' ? 10 : range === '90D' ? 12 : 12;
    const intervalDays = range === '7D' ? 1 : range === '30D' ? 3 : range === '90D' ? 7 : 15;

    for (let i = numPoints - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * intervalDays * 86400 * 1000);
      const label =
        range === '7D'
          ? d.toLocaleDateString('en-US', { weekday: 'short' })
          : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Base variance seeded deterministically
      const baseSeed = (coachId.charCodeAt(coachId.length - 1) + i) % 7;
      points.push({
        date: d.toISOString(),
        label,
        traineeActivity: 12 + ((baseSeed * 3 + i * 2) % 15),
        workoutActivity: 8 + ((baseSeed * 2 + i * 3) % 12),
        programActivity: 2 + ((baseSeed + i) % 4),
        messages: 5 + ((baseSeed * 4 + i) % 8),
      });
    }

    return points;
  },

  /**
   * Creates a new coach record with direct validation & unified audit logging
   */
  async createCoach(
    payload: {
      firstName: string;
      lastName: string;
      email: string;
      professionalTitle?: string;
      specialization?: string;
    },
    adminUser: User
  ): Promise<CoachRecord> {
    if (adminUser.role !== 'ADMIN') {
      throw new Error('Unauthorized: Only administrators can create coaches.');
    }

    const emailClean = payload.email.trim().toLowerCase();
    if (!emailClean.includes('@') || !emailClean.includes('.')) {
      throw new Error('Invalid email address format.');
    }

    const users = getStoredUsers();
    if (users.some((u) => u.email.toLowerCase() === emailClean)) {
      throw new Error(`A user with email ${payload.email} already exists.`);
    }

    const id = `usr_coach_${Date.now()}`;
    const fullName = `${payload.firstName.trim()} ${payload.lastName.trim()}`.trim();
    const specialtiesList = payload.specialization
      ? payload.specialization.split(',').map((s) => s.trim()).filter(Boolean)
      : ['Strength & Conditioning'];

    const newCoach: CoachRecord = {
      id,
      email: emailClean,
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      name: fullName,
      role: 'COACH',
      status: 'ACTIVE',
      professionalTitle: payload.professionalTitle?.trim() || 'Fitness & Conditioning Coach',
      specialties: specialtiesList,
      traineesCount: 0,
      activeProgramsCount: 0,
      completedProgramsCount: 0,
      workoutCompletionsCount: 0,
      retentionRate: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };

    users.unshift(newCoach);
    saveUsersToStorage(users);

    recordAuditEvent({
      adminId: adminUser.id,
      adminName: adminUser.name,
      action: 'COACH_CREATED',
      targetUserId: id,
      targetUserName: newCoach.name,
      details: `Administrator created coach account for ${newCoach.name} (${newCoach.email})`,
      result: 'SUCCESS',
    });

    return newCoach;
  },

  /**
   * Updates an existing Coach profile
   */
  async updateCoach(
    id: string,
    data: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      professionalTitle?: string;
      bio?: string;
      specialties?: string[];
      avatarUrl?: string;
    },
    adminUser: User
  ): Promise<CoachRecord> {
    if (adminUser.role !== 'ADMIN') {
      throw new Error('Unauthorized: Only administrators can modify coaches.');
    }

    const users = getStoredUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new Error(`Coach with ID ${id} not found.`);
    }

    const current = users[index];
    if (current.role !== 'COACH') {
      throw new Error(`User with ID ${id} is not a coach.`);
    }

    // Validate email uniqueness if changing
    if (data.email) {
      const emailClean = data.email.trim().toLowerCase();
      const conflict = users.find((u) => u.id !== id && u.email.toLowerCase() === emailClean);
      if (conflict) {
        throw new Error(`The email "${data.email}" is already registered to another user.`);
      }
      current.email = emailClean;
    }

    if (data.firstName !== undefined) current.firstName = data.firstName.trim();
    if (data.lastName !== undefined) current.lastName = data.lastName.trim();
    current.name = `${current.firstName || ''} ${current.lastName || ''}`.trim() || current.name;

    if (data.phone !== undefined) current.phone = data.phone.trim();
    if (data.professionalTitle !== undefined) current.professionalTitle = data.professionalTitle.trim();
    if (data.bio !== undefined) current.bio = data.bio.trim();
    if (data.specialties !== undefined) current.specialties = data.specialties;
    if (data.avatarUrl !== undefined) current.avatarUrl = data.avatarUrl.trim();
    current.updatedAt = new Date().toISOString();

    users[index] = current;
    saveUsersToStorage(users);

    recordAuditEvent({
      adminId: adminUser.id,
      adminName: adminUser.name,
      action: 'COACH_EDITED',
      targetUserId: id,
      targetUserName: current.name,
      details: `Administrator updated profile for coach ${current.name}`,
      result: 'SUCCESS',
    });

    return current as CoachRecord;
  },

  /**
   * Suspends a Coach account with immediate platform lockout enforcement
   */
  async suspendCoach(id: string, reason: string, adminUser: User): Promise<CoachRecord> {
    if (adminUser.role !== 'ADMIN') {
      throw new Error('Unauthorized: Only administrators can suspend coach accounts.');
    }

    const users = getStoredUsers();
    const coach = users.find((u) => u.id === id);
    if (!coach) {
      throw new Error(`Coach with ID ${id} not found.`);
    }

    coach.status = 'SUSPENDED';
    coach.updatedAt = new Date().toISOString();
    saveUsersToStorage(users);

    recordAuditEvent({
      adminId: adminUser.id,
      adminName: adminUser.name,
      action: 'COACH_SUSPENDED',
      targetUserId: id,
      targetUserName: coach.name,
      details: `Administrator suspended coach account. Reason: ${reason || 'Administrative decision'}`,
      result: 'SUCCESS',
    });

    return coach as CoachRecord;
  },

  /**
   * Activates a suspended or inactive Coach account
   */
  async activateCoach(id: string, adminUser: User): Promise<CoachRecord> {
    if (adminUser.role !== 'ADMIN') {
      throw new Error('Unauthorized: Only administrators can activate coach accounts.');
    }

    const users = getStoredUsers();
    const coach = users.find((u) => u.id === id);
    if (!coach) {
      throw new Error(`Coach with ID ${id} not found.`);
    }

    coach.status = 'ACTIVE';
    coach.updatedAt = new Date().toISOString();
    saveUsersToStorage(users);

    recordAuditEvent({
      adminId: adminUser.id,
      adminName: adminUser.name,
      action: 'COACH_ACTIVATED',
      targetUserId: id,
      targetUserName: coach.name,
      details: `Administrator activated coach account for ${coach.name}`,
      result: 'SUCCESS',
    });

    return coach as CoachRecord;
  },
};
