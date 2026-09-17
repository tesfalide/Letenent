// types/next-shims.d.ts
// Ambient type definitions for Next.js and Prisma Client in development & standalone build

declare module 'next/cache' {
  export function revalidatePath(path: string, type?: 'page' | 'layout'): void;
  export function revalidateTag(tag: string): void;
}

declare module 'next/server' {
  export class NextRequest extends Request {
    readonly nextUrl: URL;
  }
  export class NextResponse extends Response {
    static json<T = any>(body: T, init?: ResponseInit): NextResponse;
    static redirect(url: string | URL, status?: number): NextResponse;
    static next(): NextResponse;
  }
}

declare module '@prisma/client' {
  export class PrismaClient {
    constructor(options?: any);
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    $transaction<T>(fn: (prisma: any) => Promise<T>): Promise<T>;
    user: any;
    coachProfile: any;
    traineeProfile: any;
    assignedProgram: any;
    assignedWorkout: any;
    assignedExerciseItem: any;
    workoutLog: any;
    setLog: any;
    checkIn: any;
    exercise: any;
    workoutTemplate: any;
  }
}
