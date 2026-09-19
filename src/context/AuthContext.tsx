// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, TraineeProfile } from '@/types';
import { CURRENT_COACH, INITIAL_TRAINEES } from '@/lib/mock-data';

export interface AuthSession {
  user: User;
  traineeProfile?: TraineeProfile;
}

interface AuthContextType {
  currentUser: User | null;
  currentTrainee: TraineeProfile | null;
  isAuthenticated: boolean;
  signInAsCoach: (email?: string, password?: string) => { success: boolean; error?: string };
  signInAsTrainee: (traineeIdOrEmail: string, password?: string) => { success: boolean; error?: string };
  signInAsAdmin: (email?: string, password?: string) => { success: boolean; error?: string };
  signOut: () => void;
  switchRole: (role: 'COACH' | 'TRAINEE' | 'ADMIN') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'letenent_auth_session';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Start with null so that the user sees the sign-in page first as requested
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.user?.id) {
          return parsed.user;
        }
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [currentTrainee, setCurrentTrainee] = useState<TraineeProfile | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.traineeProfile) {
          return parsed.traineeProfile;
        }
      }
    } catch {
      // ignore
    }
    return null;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ user: currentUser, traineeProfile: currentTrainee })
        );
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, [currentUser, currentTrainee]);

  const isUserSuspended = (emailOrId: string): boolean => {
    try {
      const raw = localStorage.getItem('letenent_admin_users_db');
      if (raw) {
        const users = JSON.parse(raw);
        const lower = emailOrId.trim().toLowerCase();
        const found = users.find(
          (u: any) =>
            (u.id && u.id.toLowerCase() === lower) ||
            (u.email && u.email.toLowerCase() === lower)
        );
        if (found && found.status === 'SUSPENDED') {
          return true;
        }
      }
    } catch {
      // ignore
    }
    return false;
  };

  const signInAsCoach = (email?: string, _password?: string) => {
    const targetEmail = email?.trim() || CURRENT_COACH.email;
    if (isUserSuspended(targetEmail) || isUserSuspended(CURRENT_COACH.id)) {
      return {
        success: false,
        error: 'This coach account has been suspended. Please contact platform administration.',
      };
    }
    const coachUser: User = {
      ...CURRENT_COACH,
      email: targetEmail,
      status: 'ACTIVE',
    };
    setCurrentUser(coachUser);
    setCurrentTrainee(null);
    return { success: true };
  };

  const signInAsTrainee = (traineeIdOrEmail: string, _password?: string) => {
    const trimmed = traineeIdOrEmail.trim().toLowerCase();
    if (isUserSuspended(trimmed)) {
      return {
        success: false,
        error: 'This athlete account has been suspended by an administrator.',
      };
    }

    // Try to find matching trainee in INITIAL_TRAINEES
    const matched = INITIAL_TRAINEES.find(
      (t) =>
        t.id.toLowerCase() === trimmed ||
        t.user.email.toLowerCase() === trimmed ||
        t.user.name.toLowerCase() === trimmed
    );

    if (matched) {
      if (isUserSuspended(matched.user.id) || isUserSuspended(matched.user.email)) {
        return {
          success: false,
          error: 'This athlete account has been suspended by an administrator.',
        };
      }
      setCurrentUser(matched.user);
      setCurrentTrainee(matched);
      return { success: true };
    }

    // Default to the first trainee (Kaiya) if custom email entered for athlete
    const fallbackTrainee = INITIAL_TRAINEES[0];
    const customTraineeUser: User = {
      ...fallbackTrainee.user,
      id: `usr_${Date.now()}`,
      email: trimmed.includes('@') ? trimmed : `${trimmed}@example.com`,
      name: trimmed.includes('@') ? trimmed.split('@')[0] : traineeIdOrEmail,
      status: 'ACTIVE',
    };
    const customProfile: TraineeProfile = {
      ...fallbackTrainee,
      user: customTraineeUser,
    };
    setCurrentUser(customTraineeUser);
    setCurrentTrainee(customProfile);
    return { success: true };
  };

  const signInAsAdmin = (email?: string, _password?: string) => {
    const adminEmail = email?.trim() || 'Letenent admin';
    if (isUserSuspended(adminEmail) || isUserSuspended('usr_admin_01')) {
      return {
        success: false,
        error: 'This administrator account has been suspended.',
      };
    }
    const adminUser: User = {
      id: 'usr_admin_01',
      name: 'Letenent Administrator',
      email: adminEmail,
      role: 'ADMIN',
      status: 'ACTIVE',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };
    setCurrentUser(adminUser);
    setCurrentTrainee(null);
    return { success: true };
  };

  const signOut = () => {
    setCurrentUser(null);
    setCurrentTrainee(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const switchRole = (role: 'COACH' | 'TRAINEE' | 'ADMIN') => {
    if (role === 'COACH') {
      signInAsCoach();
    } else if (role === 'ADMIN') {
      signInAsAdmin();
    } else {
      signInAsTrainee('trainee_kaiya');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentTrainee,
        isAuthenticated: !!currentUser,
        signInAsCoach,
        signInAsTrainee,
        signInAsAdmin,
        signOut,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
