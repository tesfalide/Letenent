// lib/auth.ts
// Multi-Tenant Role Protection, Session Context & Row-Level Authorization Guards

import { UserRole } from '@/types';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  coachProfileId?: string;
  traineeProfileId?: string;
}

export class AuthorizationError extends Error {
  constructor(message: string = 'Access Forbidden: Insufficient permissions') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

/**
 * Server-side guard to assert user has COACH or ADMIN role.
 * Throws AuthorizationError if trainee attempts to enter coach views.
 */
export function requireCoachRole(user: SessionUser | null | undefined): asserts user is SessionUser {
  if (!user) {
    throw new AuthorizationError('Authentication required. Please log in.');
  }
  if (user.role !== 'COACH' && user.role !== 'ADMIN') {
    throw new AuthorizationError('Access Restricted: Only certified coaches may access this view or API.');
  }
}

/**
 * Server-side guard to assert user has TRAINEE role or belongs to self.
 */
export function requireTraineeAccess(user: SessionUser | null | undefined, targetTraineeId: string): void {
  if (!user) {
    throw new AuthorizationError('Authentication required.');
  }

  // Trainee can only view their own data
  if (user.role === 'TRAINEE' && user.traineeProfileId !== targetTraineeId) {
    throw new AuthorizationError('Tenant Violation: Trainees can only access their own workout logs and check-ins.');
  }
}

/**
 * Strict Row-Level Isolation: Verifies that a coach can only access and modify
 * trainees rostered directly under their CoachProfile ID.
 */
export function verifyCoachClientOwnership(coachId: string, clientCoachId: string): boolean {
  if (coachId !== clientCoachId) {
    throw new AuthorizationError('Tenant Isolation Violation: Coach cannot access clients from another coaching organization.');
  }
  return true;
}
