// app/actions/workout.ts
// Next.js Server Actions for Trainee Gym-Floor Execution

'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export interface LogSetInput {
  workoutLogId: string;
  exerciseId: string;
  setNumber: number;
  targetReps: string;
  targetLoad: number;
  actualReps: number;
  actualLoad: number;
  rpe?: number;
  completed: boolean;
}

export interface FinishWorkoutInput {
  workoutLogId: string;
  traineeId: string;
  sessionRpe: number;
  sessionNotes: string;
}

/**
 * Persists an individual set execution log in real-time as the trainee works out.
 */
export async function logSetAction(input: LogSetInput) {
  try {
    if (!input.workoutLogId || !input.exerciseId) {
      return { success: false, error: 'workoutLogId and exerciseId are required' };
    }

    const setLog = await db.setLog.create({
      data: {
        workoutLogId: input.workoutLogId,
        exerciseId: input.exerciseId,
        setNumber: input.setNumber,
        targetReps: input.targetReps,
        targetLoad: input.targetLoad,
        actualReps: input.actualReps,
        actualLoad: input.actualLoad,
        rpe: input.rpe,
        completed: input.completed,
        completedAt: input.completed ? new Date() : null,
      },
    });

    revalidatePath('/today');
    return { success: true, setLog };
  } catch (error) {
    console.error('Failed to persist set log:', error);
    return { success: false, error: 'Database transaction failed while logging set' };
  }
}

/**
 * Finalizes the workout session, records session RPE, notes, and sets status to COMPLETED.
 */
export async function finishWorkoutAction(input: FinishWorkoutInput) {
  try {
    const updatedLog = await db.workoutLog.update({
      where: { id: input.workoutLogId },
      data: {
        status: 'COMPLETED',
        sessionRpe: input.sessionRpe,
        sessionNotes: input.sessionNotes,
        completedAt: new Date(),
      },
      include: {
        sets: true,
      },
    });

    revalidatePath('/today');
    revalidatePath('/clients');
    return { success: true, workoutLog: updatedLog };
  } catch (error) {
    console.error('Failed to finish workout session:', error);
    return { success: false, error: 'Could not complete workout session' };
  }
}
