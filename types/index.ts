export type UserRole = 'COACH' | 'TRAINEE' | 'ADMIN';

export type ClientStatus = 'ACTIVE' | 'INVITED' | 'PAUSED';

export type WorkoutStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'MISSED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
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
