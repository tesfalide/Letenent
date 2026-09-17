// app/actions/client.ts
// Next.js Server Actions for Coach Client Management & Token Generation

'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

export interface InviteClientInput {
  coachId: string;
  name: string;
  email: string;
  targetFocus: string;
}

/**
 * Generates a unique secure onboarding token and creates user + trainee profile
 */
export async function inviteClientAction(input: InviteClientInput) {
  try {
    const onboardingToken = 'ltnt_' + crypto.randomBytes(16).toString('hex');

    // Create user and traineeProfile in a transaction
    const newTrainee = await db.user.create({
      data: {
        email: input.email.toLowerCase().trim(),
        name: input.name.trim(),
        role: 'TRAINEE',
        traineeProfile: {
          create: {
            coachId: input.coachId,
            status: 'INVITED',
            onboardingToken,
            targetFocus: input.targetFocus || 'General Hypertrophy & Strength',
          },
        },
      },
      include: {
        traineeProfile: true,
      },
    });

    revalidatePath('/clients');
    return {
      success: true,
      onboardingToken,
      trainee: newTrainee,
    };
  } catch (error: any) {
    console.error('Failed to invite client:', error);
    if (error?.code === 'P2002') {
      return { success: false, error: 'A user with this email address already exists.' };
    }
    return { success: false, error: 'Could not generate client invitation.' };
  }
}

/**
 * Computes trainee 14-day workout compliance: completed / assigned * 100
 */
export async function getTrainee14DayCompliance(traineeId: string) {
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  const assignedCount = await db.assignedWorkout.count({
    where: {
      program: {
        traineeId,
        isActive: true,
      },
      scheduledFor: {
        gte: fourteenDaysAgo,
      },
    },
  });

  const completedCount = await db.workoutLog.count({
    where: {
      traineeId,
      status: 'COMPLETED',
      completedAt: {
        gte: fourteenDaysAgo,
      },
    },
  });

  const complianceRate = assignedCount > 0 ? Math.round((completedCount / assignedCount) * 100) : 100;

  return {
    assignedCount,
    completedCount,
    complianceRate,
  };
}
