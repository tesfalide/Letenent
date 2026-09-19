export type UserRole = 'COACH' | 'TRAINEE' | 'ADMIN';

export type UserAccountStatus = 'ACTIVE' | 'SUSPENDED' | 'INVITED' | 'INACTIVE';

export type ClientStatus = 'ACTIVE' | 'INVITED' | 'PAUSED';

export type WorkoutStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'MISSED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status?: UserAccountStatus;
  avatarUrl?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  lastActiveAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserRecord {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  role: UserRole;
  status: UserAccountStatus;
  avatarUrl?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  lastActiveAt: string;
  // Coach specific relationship fields
  professionalTitle?: string;
  traineesCount?: number;
  activeProgramsCount?: number;
  completedProgramsCount?: number;
  workoutCompletionsCount?: number;
  retentionRate?: number;
  complianceRate?: number;
  specialties?: string[];
  bio?: string;
  // Trainee specific relationship fields
  assignedCoachId?: string;
  assignedCoachName?: string;
  currentProgramTitle?: string;
  targetFocus?: string;
  compliance14Days?: number;
  // Invitation specific fields
  invitationSentAt?: string;
  invitationStatus?: 'PENDING' | 'ACCEPTED' | 'EXPIRED';
}

export interface CoachRecord extends AdminUserRecord {
  role: 'COACH';
}

export interface CoachStatistics {
  totalCoaches: number;
  activeCoaches: number;
  inactiveCoaches: number;
  totalTrainees: number;
  activePrograms: number;
  avgTraineesPerCoach: number;
}

export interface CoachQueryParams {
  page: number;
  pageSize: number;
  searchQuery?: string;
  statusFilter?: 'ALL' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  activityFilter?: 'ALL' | 'RECENT' | '7D' | '30D';
  traineeCountFilter?: 'ALL' | 'ZERO' | '1_10' | '11_25' | '26_PLUS';
  programFilter?: 'ALL' | 'NO_PROGRAMS' | 'HAS_ACTIVE';
  joinedFilter?: 'ALL' | 'TODAY' | '7D' | '30D' | 'CUSTOM';
  customDateStart?: string;
  customDateEnd?: string;
  sortBy?: 'name' | 'email' | 'trainees' | 'programs' | 'lastActive' | 'joined' | 'status';
  sortDirection?: 'asc' | 'desc';
}

export interface CoachTraineeItem {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  currentProgramTitle: string;
  workoutCompliance: number;
  lastActivity: string;
  status: 'ACTIVE' | 'INVITED' | 'PAUSED';
  joinedDate: string;
  assignedWorkoutId?: string;
}

export interface CoachProgramItem {
  id: string;
  title: string;
  description?: string;
  traineesCount: number;
  durationWeeks: number;
  completionRate: number;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  createdAt: string;
}

export interface CoachActivityEvent {
  id: string;
  coachId: string;
  type:
    | 'PROGRAM_CREATED'
    | 'TRAINEE_ADDED'
    | 'WORKOUT_UPDATED'
    | 'REVIEW_COMPLETED'
    | 'MESSAGE_SENT'
    | 'PROFILE_UPDATED'
    | 'LOGIN';
  title: string;
  description: string;
  timestamp: string;
}

export interface CoachPerformanceMetrics {
  traineeRetentionRate: number; // e.g. 94%
  workoutCompletionRate: number; // e.g. 91%
  programCompletionRate: number; // e.g. 88%
  activeTraineePercentage: number; // e.g. 85%
  activityScore: number; // Monthly activities logged
}

export interface CoachChartDataPoint {
  date: string;
  label: string;
  traineeActivity: number;
  workoutActivity: number;
  programActivity: number;
  messages: number;
}

export interface UserActivityRecord {
  id: string;
  userId: string;
  activity: string;
  category: 'LOGIN' | 'WORKOUT' | 'PROGRAM' | 'PROFILE' | 'INVITATION' | 'SECURITY' | 'STATUS_CHANGE';
  timestamp: string;
  details?: string;
}

export interface AuditLogRecord {
  id: string;
  adminId: string;
  adminName: string;
  action:
    | 'USER_CREATED'
    | 'USER_EDITED'
    | 'ROLE_CHANGED'
    | 'USER_SUSPENDED'
    | 'USER_ACTIVATED'
    | 'INVITATION_RESENT'
    | 'INVITATION_CANCELLED'
    | 'COACH_CREATED'
    | 'COACH_EDITED'
    | 'COACH_SUSPENDED'
    | 'COACH_ACTIVATED'
    | 'COACH_INVITED'
    | 'PROGRAM_ARCHIVED';
  targetUserId: string;
  targetUserName: string;
  details: string;
  timestamp: string;
  result: 'SUCCESS' | 'FAILURE';
}

export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  coaches: number;
  trainees: number;
  suspendedUsers: number;
  invitedUsers?: number;
}

export interface UserQueryParams {
  page: number;
  pageSize: number;
  searchQuery?: string;
  roleFilter?: 'ALL' | 'ADMIN' | 'COACH' | 'TRAINEE';
  statusFilter?: 'ALL' | 'ACTIVE' | 'SUSPENDED' | 'INVITED';
  registrationDateFilter?: 'ALL' | 'TODAY' | '7D' | '30D' | 'CUSTOM';
  customDateStart?: string;
  customDateEnd?: string;
  lastActiveFilter?: 'ANY' | 'TODAY' | '7D' | '30D' | 'INACTIVE';
  sortBy?: 'name' | 'email' | 'role' | 'status' | 'joined' | 'lastActive';
  sortDirection?: 'asc' | 'desc';
}

export interface CoachProfile {
  id: string;
  userId: string;
  bio?: string;
  businessName?: string;
  specialties: string[];
}

export interface TraineeProfile {
  id: string;
  userId: string;
  coachId: string;
  status: ClientStatus;
  onboardingToken?: string;
  joinedAt: string;
  targetFocus: string;
  compliance14Days: number; // Percentage 0 - 100
  workoutsAssigned14Days: number;
  workoutsCompleted14Days: number;
  user: User;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
  videoUrl?: string;
  notes?: string;
}

export interface ExerciseItemPayload {
  id?: string;
  exerciseId: string;
  exerciseName: string;
  orderIndex: number;
  targetSets: number;
  targetReps: string; // e.g. "8-10" or "12"
  targetLoad: number; // lbs / kg
  targetRpe?: number; // 1-10
  restSeconds: number;
  coachNotes?: string;
}

export interface WorkoutTemplate {
  id: string;
  coachId: string;
  title: string;
  dayOfWeek?: number; // 1-7
  description?: string;
  exercises: ExerciseItemPayload[];
}

export interface ProgramPayload {
  title: string;
  description?: string;
  traineeId: string;
  coachId: string;
  durationWeeks: number;
  workouts: {
    title: string;
    dayOfWeek: number;
    exercises: ExerciseItemPayload[];
  }[];
}

export interface SetLogItem {
  id: string;
  workoutLogId: string;
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  targetReps: string;
  targetLoad: number;
  actualReps: number;
  actualLoad: number;
  rpe?: number;
  completed: boolean;
  completedAt?: string;
}

export interface WorkoutLog {
  id: string;
  traineeId: string;
  assignedWorkoutId: string;
  workoutTitle: string;
  startedAt: string;
  completedAt?: string;
  status: WorkoutStatus;
  sessionRpe?: number;
  sessionNotes?: string;
  sets: SetLogItem[];
}

export interface CheckIn {
  id: string;
  traineeId: string;
  traineeName: string;
  submittedAt: string;
  morningWeightLbs: number;
  energyScore: number; // 1-10
  stressScore: number; // 1-10
  sleepScore: number; // 1-10
  dietAdherenceScore: number; // 1-10
  wins: string;
  struggles: string;
  status: 'PENDING_REVIEW' | 'REVIEWED';
  coachFeedback?: string;
  reviewedAt?: string;
  // Attached 14-day context
  complianceStats?: {
    workoutsCompleted: number;
    workoutsAssigned: number;
    compliancePercent: number;
  };
}

export type ActivityType =
  | 'WORKOUT_COMPLETED'
  | 'CHECK_IN_SUBMITTED'
  | 'PR_LOGGED'
  | 'PROGRAM_ASSIGNED'
  | 'ADHERENCE_ALERT';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  traineeId: string;
  traineeName: string;
  traineeAvatar?: string;
  avatarInitials?: string;
  title: string;
  description: string;
  timestamp: string;
  metrics?: { label: string; value: string }[];
  coachNote?: string;
  workoutDuration?: string;
  workoutName?: string;
  weightLiftedKg?: number;
  setsCount?: number;
  exercisesList?: string[];
  measurementText?: string;
  isInvitationAccepted?: boolean;
}
