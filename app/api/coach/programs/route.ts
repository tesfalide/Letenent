// app/api/coach/programs/route.ts
// POST /api/coach/programs — Cascading relational program assignment with Zod validation

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createProgramSchema } from '@/lib/validations/program';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();

    // 1. Zod Validation
    const parseResult = createProgramSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          issues: parseResult.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const { title, description, traineeId, coachId, durationWeeks, workouts } = parseResult.data;

    // 2. Multi-tenant ownership verification: Coach must exist and trainee must be assigned to this coach
    const traineeProfile = await db.traineeProfile.findUnique({
      where: { id: traineeId },
      select: { id: true, coachId: true, status: true },
    });

    if (!traineeProfile) {
      return NextResponse.json({ error: 'Trainee profile not found' }, { status: 404 });
    }

    if (traineeProfile.coachId !== coachId) {
      return NextResponse.json(
        { error: 'Unauthorized: You can only assign programs to your own rostered clients.' },
        { status: 403 }
      );
    }

    // 3. Cascading relational insertion via Prisma nested write
    const createdProgram = await db.assignedProgram.create({
      data: {
        title,
        description,
        coachId,
        traineeId,
        durationWeeks,
        isActive: true,
        workouts: {
          create: workouts.map((workout) => ({
            title: workout.title,
            dayOfWeek: workout.dayOfWeek,
            exercises: {
              create: workout.exercises.map((ex, idx) => ({
                exerciseId: ex.exerciseId,
                orderIndex: ex.orderIndex ?? idx,
                targetSets: ex.targetSets,
                targetReps: ex.targetReps,
                targetLoad: ex.targetLoad,
                targetRpe: ex.targetRpe ?? 8.0,
                restSeconds: ex.restSeconds ?? 90,
                coachNotes: ex.coachNotes,
              })),
            },
          })),
        },
      },
      include: {
        workouts: {
          include: {
            exercises: {
              include: {
                exercise: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Program successfully created and assigned to trainee.',
        program: createdProgram,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating relational program:', error);
    return NextResponse.json(
      { error: 'Internal Server Error while creating program.' },
      { status: 500 }
    );
  }
}
