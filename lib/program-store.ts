// lib/program-store.ts
// Client-side persistent store for coach assignments, invitations, and workout routines

export interface ProgramExercise {
  exerciseId: string;
  exerciseName: string;
  orderIndex: number;
  targetSets: number;
  targetReps: string;
  targetLoad: number;
  targetRpe?: number;
  restSeconds: number;
  coachNotes?: string;
}

export interface ProgramWorkout {
  id: string;
  title: string;
  dayOfWeek: number;
  estimatedDurationMins?: number;
  exercises: ProgramExercise[];
}

export interface AssignedProgram {
  id: string;
  title: string;
  description: string;
  coachName: string;
  coachAvatar: string;
  traineeId: string;
  durationWeeks: number;
  currentWeek: number;
  assignedDate: string;
  status: 'ACTIVE' | 'INVITED' | 'COMPLETED';
  invitationMessage?: string;
  workouts: ProgramWorkout[];
}

const DEFAULT_ASSIGNED_PROGRAMS: Record<string, AssignedProgram> = {
  trainee_kaiya: {
    id: 'prog_kaiya_01',
    title: '12-Week Hypertrophy & Strength Block',
    description: 'Cascading volume progression targeting push strength, chest fiber recruitment, and overhead stability.',
    coachName: 'Roger Bothman',
    coachAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    traineeId: 'trainee_kaiya',
    durationWeeks: 12,
    currentWeek: 6,
    assignedDate: 'March 12, 2026',
    status: 'ACTIVE',
    invitationMessage: 'Welcome to Wave 2! We are pushing your incline DB bench press to 75 lbs and dialing in strict overhead pressing mechanics.',
    workouts: [
      {
        id: 'w_1',
        title: 'Push Strength & Upper Body Volume',
        dayOfWeek: 1,
        estimatedDurationMins: 55,
        exercises: [
          {
            exerciseId: 'ex_3',
            exerciseName: 'Incline Dumbbell Bench Press',
            orderIndex: 0,
            targetSets: 3,
            targetReps: '8-10',
            targetLoad: 70,
            targetRpe: 8.5,
            restSeconds: 90,
            coachNotes: 'Control eccentric down to 3 seconds. Slight arch in thoracic spine.',
          },
          {
            exerciseId: 'ex_5',
            exerciseName: 'Barbell Overhead Press',
            orderIndex: 1,
            targetSets: 3,
            targetReps: '6-8',
            targetLoad: 125,
            targetRpe: 8.5,
            restSeconds: 120,
            coachNotes: 'Squeeze glutes and brace core. Do not over-extend lumbar.',
          },
          {
            exerciseId: 'ex_7',
            exerciseName: 'Cable Lateral Raise',
            orderIndex: 2,
            targetSets: 3,
            targetReps: '12-15',
            targetLoad: 25,
            targetRpe: 9.0,
            restSeconds: 60,
            coachNotes: 'Lead with elbows, pause for 0.5s at peak contraction.',
          },
          {
            exerciseId: 'ex_4',
            exerciseName: 'Neutral Grip Lat Pulldown',
            orderIndex: 3,
            targetSets: 3,
            targetReps: '8-10',
            targetLoad: 145,
            targetRpe: 8.0,
            restSeconds: 90,
            coachNotes: 'Full stretch at the top, drive elbows downward into ribcage.',
          },
        ],
      },
      {
        id: 'w_2',
        title: 'Lower Body Posterior & Quad Load',
        dayOfWeek: 3,
        estimatedDurationMins: 60,
        exercises: [
          {
            exerciseId: 'ex_1',
            exerciseName: 'Barbell Back Squat',
            orderIndex: 0,
            targetSets: 4,
            targetReps: '5-6',
            targetLoad: 235,
            targetRpe: 8.5,
            restSeconds: 150,
            coachNotes: 'Hit clean parallel depth, stay balanced over mid-foot.',
          },
          {
            exerciseId: 'ex_2',
            exerciseName: 'Romanian Deadlift (RDL)',
            orderIndex: 1,
            targetSets: 3,
            targetReps: '8-10',
            targetLoad: 245,
            targetRpe: 8.0,
            restSeconds: 120,
            coachNotes: 'Hinge hips backwards, feel the stretch in hamstrings.',
          },
        ],
      },
      {
        id: 'w_3',
        title: 'Upper Hypertrophy & Arms',
        dayOfWeek: 5,
        estimatedDurationMins: 50,
        exercises: [
          {
            exerciseId: 'ex_8',
            exerciseName: 'Chest-Supported Row',
            orderIndex: 0,
            targetSets: 4,
            targetReps: '10-12',
            targetLoad: 60,
            targetRpe: 8.5,
            restSeconds: 90,
          },
          {
            exerciseId: 'ex_9',
            exerciseName: 'Incline Hammer Curl',
            orderIndex: 1,
            targetSets: 3,
            targetReps: '12-15',
            targetLoad: 30,
            targetRpe: 9.0,
            restSeconds: 60,
          },
        ],
      },
    ],
  },
};

const STORAGE_KEY = 'letenent_assigned_programs_v1';

export function getAssignedProgramForTrainee(traineeId: string): AssignedProgram {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed[traineeId]) {
        return parsed[traineeId];
      }
    }
  } catch {
    // fallback
  }

  // Check fallback default or return Kaiya's default adapted for this trainee
  if (DEFAULT_ASSIGNED_PROGRAMS[traineeId]) {
    return DEFAULT_ASSIGNED_PROGRAMS[traineeId];
  }

  return {
    ...DEFAULT_ASSIGNED_PROGRAMS.trainee_kaiya,
    traineeId,
  };
}

export function saveAssignedProgram(program: AssignedProgram): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const existing = raw ? JSON.parse(raw) : { ...DEFAULT_ASSIGNED_PROGRAMS };
    existing[program.traineeId] = program;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    window.dispatchEvent(new CustomEvent('letenent_program_updated', { detail: program }));
  } catch (err) {
    console.error('Error saving assigned program:', err);
  }
}
