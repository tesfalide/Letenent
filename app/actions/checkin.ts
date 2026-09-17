// app/actions/checkin.ts
// Next.js Server Actions for Weekly Accountability & Coach Review

'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export interface SubmitCheckInInput {
  traineeId: string;
  morningWeightLbs: number;
  energyScore: number;
  stressScore: number;
  sleepScore: number;
  dietAdherenceScore: number;
  wins: string;
  struggles: string;
}

export interface ReviewCheckInInput {
  checkInId: string;
  coachId: string;
  feedback: string;
}

/**
 * Trainee submits weekly check-in metrics and reflection
 */
export async function submitCheckInAction(input: SubmitCheckInInput) {
  try {
    const checkIn = await db.checkIn.create({
      data: {
        traineeId: input.traineeId,
        morningWeightLbs: input.morningWeightLbs,
        energyScore: input.energyScore,
        stressScore: input.stressScore,
        sleepScore: input.sleepScore,
        dietAdherenceScore: input.dietAdherenceScore,
        wins: input.wins,
        struggles: input.struggles,
        status: 'PENDING_REVIEW',
      },
    });

    revalidatePath('/check-in');
    revalidatePath('/clients');
    return { success: true, checkIn };
  } catch (error) {
    console.error('Failed to submit weekly check-in:', error);
    return { success: false, error: 'Database error creating check-in record' };
  }
}

/**
 * Coach reviews check-in, submits feedback, and marks as REVIEWED
 */
export async function reviewCheckInAction(input: ReviewCheckInInput) {
  try {
    const reviewed = await db.checkIn.update({
      where: { id: input.checkInId },
      data: {
        status: 'REVIEWED',
        coachFeedback: input.feedback,
        reviewedById: input.coachId,
        reviewedAt: new Date(),
      },
    });

    revalidatePath('/clients');
    return { success: true, checkIn: reviewed };
  } catch (error) {
    console.error('Failed to review check-in:', error);
    return { success: false, error: 'Failed to update check-in review' };
  }
}
