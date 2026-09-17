// lib/validations/program.ts
// Zod validation schemas for Letenent Coaching OS Program Builder & cascading items

import { z } from 'zod';

export const assignedExerciseItemSchema = z.object({
  id: z.string().optional(),
  exerciseId: z.string().min(1, 'Exercise selection is required'),
  exerciseName: z.string().min(1, 'Exercise name is required'),
  orderIndex: z.number().int().min(0).default(0),
  targetSets: z.number().int().min(1, 'Must have at least 1 set').max(20, 'Max 20 sets'),
  targetReps: z.string().min(1, 'Target reps required (e.g., "8-10", "12", "AMRAP")'),
  targetLoad: z.number().min(0, 'Load cannot be negative'),
  targetRpe: z.number().min(1).max(10).optional().default(8),
  restSeconds: z.number().int().min(15).max(600).default(90),
  coachNotes: z.string().max(500, 'Coach notes must be under 500 characters').optional(),
});

export const assignedWorkoutSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, 'Workout title must be at least 2 characters').max(100),
  dayOfWeek: z.number().int().min(1).max(7),
  exercises: z.array(assignedExerciseItemSchema).min(1, 'A workout requires at least 1 exercise'),
});

export const createProgramSchema = z.object({
  title: z.string().min(3, 'Program title must be at least 3 characters').max(120),
  description: z.string().max(1000).optional(),
  traineeId: z.string().min(1, 'Trainee ID is required'),
  coachId: z.string().min(1, 'Coach ID is required'),
  durationWeeks: z.number().int().min(1).max(52).default(4),
  workouts: z.array(assignedWorkoutSchema).min(1, 'Program must contain at least 1 workout schedule'),
});

export type AssignedExerciseItemInput = z.infer<typeof assignedExerciseItemSchema>;
export type AssignedWorkoutInput = z.infer<typeof assignedWorkoutSchema>;
export type CreateProgramInput = z.infer<typeof createProgramSchema>;
