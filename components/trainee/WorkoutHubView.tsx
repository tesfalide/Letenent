// components/trainee/WorkoutHubView.tsx
// Workout Hub matching user-provided design reference with live coach program synchronization

import React, { useState, useEffect } from 'react';
import {
  Plus,
  FileText,
  Search,
  ArrowRight,
  ChevronDown,
  Shield,
  Dumbbell,
  Clock,
  Flame,
  CheckCircle2,
  Calendar,
  Sparkles,
  Award,
  Play,
  Check,
  RotateCcw,
  X,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';
import { TraineeProfile } from '@/types';
import { useTheme } from '@/src/context/ThemeContext';
import {
  AssignedProgram,
  getAssignedProgramForTrainee,
  saveAssignedProgram,
} from '@/lib/program-store';
import { INITIAL_EXERCISES } from '@/lib/mock-data';

interface WorkoutHubViewProps {
  trainee: TraineeProfile;
  onWorkoutCompleted?: (summary: { workoutTitle: string; volume: string; time: string }) => void;
}

interface ActiveExerciseSet {
  setNumber: number;
  weight: number;
  reps: number;
  rpe: number;
  completed: boolean;
}

interface ActiveExercise {
  id: string;
  name: string;
  muscle: string;
  coachNotes?: string;
  sets: ActiveExerciseSet[];
}

export const WorkoutHubView: React.FC<WorkoutHubViewProps> = ({
  trainee,
  onWorkoutCompleted,
}) => {
  const { isBright } = useTheme();

  // Load coach assigned program (live synced from coach platform)
  const [assignedProgram, setAssignedProgram] = useState<AssignedProgram>(() =>
    getAssignedProgramForTrainee(trainee.id)
  );

  // Listen for real-time coach program updates
  useEffect(() => {
    const handleProgramUpdate = () => {
      setAssignedProgram(getAssignedProgramForTrainee(trainee.id));
    };

    window.addEventListener('letenent_program_updated', handleProgramUpdate);
    window.addEventListener('storage', handleProgramUpdate);

    return () => {
      window.removeEventListener('letenent_program_updated', handleProgramUpdate);
      window.removeEventListener('storage', handleProgramUpdate);
    };
  }, [trainee.id]);

  // Dropdown selector state
  const [workoutViewMode, setWorkoutViewMode] = useState<'workout' | 'routines' | 'history'>('workout');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Modal states
  const [howToStartOpen, setHowToStartOpen] = useState(false);
  const [newRoutineOpen, setNewRoutineOpen] = useState(false);
  const [exploreRoutinesOpen, setExploreRoutinesOpen] = useState(false);
  const [customRoutineName, setCustomRoutineName] = useState('');

  // Active Workout Session Logger state
  const [isLoggingWorkout, setIsLoggingWorkout] = useState(false);
  const [activeWorkoutTitle, setActiveWorkoutTitle] = useState('');
  const [workoutElapsedSeconds, setWorkoutElapsedSeconds] = useState(0);
  const [activeExercises, setActiveExercises] = useState<ActiveExercise[]>([]);
  const [workoutFinishedCelebration, setWorkoutFinishedCelebration] = useState(false);

  // Timer for active workout
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isLoggingWorkout) {
      interval = setInterval(() => {
        setWorkoutElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoggingWorkout]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start an Empty Workout (matching top action from screenshot)
  const handleStartEmptyWorkout = () => {
    setActiveWorkoutTitle('Freestyle Workout');
    setActiveExercises([
      {
        id: 'ex_cust_1',
        name: 'Barbell Back Squat',
        muscle: 'Quads & Glutes',
        sets: [
          { setNumber: 1, weight: 185, reps: 8, rpe: 8, completed: false },
          { setNumber: 2, weight: 195, reps: 8, rpe: 8.5, completed: false },
          { setNumber: 3, weight: 205, reps: 6, rpe: 9, completed: false },
        ],
      },
      {
        id: 'ex_cust_2',
        name: 'Incline Dumbbell Bench Press',
        muscle: 'Chest & Delts',
        sets: [
          { setNumber: 1, weight: 60, reps: 10, rpe: 8, completed: false },
          { setNumber: 2, weight: 65, reps: 8, rpe: 8.5, completed: false },
        ],
      },
    ]);
    setWorkoutElapsedSeconds(0);
    setIsLoggingWorkout(true);
  };

  // Start Coach Assigned Workout
  const handleStartAssignedWorkout = (workoutIndex: number = 0) => {
    const selectedWorkout = assignedProgram.workouts[workoutIndex] || assignedProgram.workouts[0];
    if (!selectedWorkout) return;

    setActiveWorkoutTitle(selectedWorkout.title);
    const convertedExercises: ActiveExercise[] = selectedWorkout.exercises.map((e, idx) => ({
      id: `act_${e.exerciseId}_${idx}`,
      name: e.exerciseName,
      muscle: 'Targeted Group',
      coachNotes: e.coachNotes,
      sets: Array.from({ length: e.targetSets || 3 }, (_, sIdx) => ({
        setNumber: sIdx + 1,
        weight: e.targetLoad || 60,
        reps: parseInt(e.targetReps) || 8,
        rpe: e.targetRpe || 8,
        completed: false,
      })),
    }));

    setActiveExercises(convertedExercises);
    setWorkoutElapsedSeconds(0);
    setIsLoggingWorkout(true);
  };

  // Toggle set completion
  const handleToggleSet = (exerciseId: string, setNumber: number) => {
    setActiveExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s) => (s.setNumber === setNumber ? { ...s, completed: !s.completed } : s)),
        };
      })
    );
  };

  // Update set weight / reps
  const handleUpdateSet = (
    exerciseId: string,
    setNumber: number,
    field: 'weight' | 'reps' | 'rpe',
    value: number
  ) => {
    setActiveExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s) => (s.setNumber === setNumber ? { ...s, [field]: value } : s)),
        };
      })
    );
  };

  // Finish Workout
  const handleFinishWorkout = () => {
    let totalVol = 0;
    activeExercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        if (s.completed) totalVol += s.weight * s.reps;
      });
    });

    const summary = {
      workoutTitle: activeWorkoutTitle,
      volume: `${totalVol.toLocaleString()} lbs`,
      time: formatTimer(workoutElapsedSeconds),
    };

    if (onWorkoutCompleted) {
      onWorkoutCompleted(summary);
    }

    setWorkoutFinishedCelebration(true);
  };

  // Simulate Coach Roger Assigning a New Program (so user can test in 1 click!)
  const handleSimulateCoachAssignment = () => {
    const newProg: AssignedProgram = {
      id: `prog_sim_${Date.now()}`,
      title: '10-Week Powerbuilding & Peaking Cycle',
      description: 'High-intensity microcycles dialed for maximum hypertrophy, explosive bar speed, and PR attempts.',
      coachName: 'Roger Bothman',
      coachAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      traineeId: trainee.id,
      durationWeeks: 10,
      currentWeek: 1,
      assignedDate: 'Today',
      status: 'ACTIVE',
      invitationMessage: 'Roger has updated your program to the Powerbuilding Peaking Cycle! Check Day 1 below.',
      workouts: [
        {
          id: 'w_sim_1',
          title: 'Day 1: Heavy Bench & Lateral Delts',
          dayOfWeek: 1,
          estimatedDurationMins: 50,
          exercises: [
            {
              exerciseId: 'ex_3',
              exerciseName: 'Incline Dumbbell Bench Press',
              orderIndex: 0,
              targetSets: 4,
              targetReps: '6-8',
              targetLoad: 75,
              targetRpe: 8.5,
              restSeconds: 120,
              coachNotes: 'Pause on bottom stretch, push hard through chest.',
            },
            {
              exerciseId: 'ex_7',
              exerciseName: 'Cable Lateral Raise',
              orderIndex: 1,
              targetSets: 4,
              targetReps: '12-15',
              targetLoad: 30,
              targetRpe: 9.0,
              restSeconds: 60,
              coachNotes: 'Strict form, no torso momentum.',
            },
          ],
        },
        {
          id: 'w_sim_2',
          title: 'Day 2: Deadlift & Back Thickness',
          dayOfWeek: 3,
          estimatedDurationMins: 55,
          exercises: [
            {
              exerciseId: 'ex_2',
              exerciseName: 'Romanian Deadlift (RDL)',
              orderIndex: 0,
              targetSets: 4,
              targetReps: '6-8',
              targetLoad: 265,
              targetRpe: 8.5,
              restSeconds: 150,
              coachNotes: 'Keep lats packed tight against your ribcage.',
            },
          ],
        },
      ],
    };

    saveAssignedProgram(newProg);
    setAssignedProgram(newProg);
  };

  // If in active workout mode, render active tracker
  if (isLoggingWorkout) {
    const totalSets = activeExercises.reduce((acc, e) => acc + e.sets.length, 0);
    const completedSets = activeExercises.reduce(
      (acc, e) => acc + e.sets.filter((s) => s.completed).length,
      0
    );
    const progressPercent = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Active Session Header Bar */}
        <div
          className={`p-3 sm:p-4 rounded-2xl border flex items-center justify-between gap-2 sticky top-16 z-20 backdrop-blur-md ${
            isBright ? 'bg-white/95 border-slate-200 shadow-md' : 'bg-zinc-950/95 border-zinc-900 shadow-2xl'
          }`}
        >
          <div className="min-w-0 flex-1 mr-1 sm:mr-3">
            <span className="text-[9px] sm:text-[10px] font-mono text-[#1877F2] font-bold uppercase tracking-wider block truncate">
              ● Active Workout
            </span>
            <h2 className="text-xs sm:text-base font-bold truncate">{activeWorkoutTitle}</h2>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <div className="flex items-center gap-1 sm:gap-1.5 font-mono text-xs sm:text-sm font-bold bg-zinc-900 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-zinc-800 text-white shrink-0 whitespace-nowrap shadow-sm">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#1877F2] animate-pulse shrink-0" />
              <span className="tabular-nums tracking-tight">{formatTimer(workoutElapsedSeconds)}</span>
            </div>

            <button
              type="button"
              onClick={handleFinishWorkout}
              className="px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 shadow-sm shadow-emerald-600/30 transition-all shrink-0"
            >
              Finish
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm('Discard this workout session?')) {
                  setIsLoggingWorkout(false);
                }
              }}
              className="p-1 sm:p-1.5 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 shrink-0"
              aria-label="Discard workout"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono text-zinc-400 px-1">
            <span>Progress</span>
            <span>
              {completedSets} of {totalSets} sets ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Exercises List with Set Tracker */}
        <div className="space-y-4">
          {activeExercises.map((exercise) => (
            <div
              key={exercise.id}
              className={`p-4 rounded-2xl border space-y-3 ${
                isBright ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-950 border-zinc-900'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm leading-snug">{exercise.name}</h3>
                  <span className={`text-[11px] ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                    {exercise.muscle}
                  </span>
                </div>
                {exercise.coachNotes && (
                  <span className="text-[10px] font-mono text-[#1877F2] bg-[#1877F2]/10 px-2 py-0.5 rounded-lg border border-[#1877F2]/20 max-w-[200px] truncate">
                    Cue: {exercise.coachNotes}
                  </span>
                )}
              </div>

              {/* Sets Table Header */}
              <div className="grid grid-cols-12 text-[10px] font-mono uppercase text-zinc-500 px-2">
                <span className="col-span-2">Set</span>
                <span className="col-span-3">Lbs</span>
                <span className="col-span-3">Reps</span>
                <span className="col-span-2">RPE</span>
                <span className="col-span-2 text-right">Done</span>
              </div>

              {/* Set Rows */}
              <div className="space-y-1.5">
                {exercise.sets.map((set) => (
                  <div
                    key={set.setNumber}
                    className={`grid grid-cols-12 items-center px-2 py-1.5 rounded-xl border transition-colors ${
                      set.completed
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : isBright
                        ? 'bg-slate-50 border-slate-200'
                        : 'bg-zinc-900/60 border-zinc-800'
                    }`}
                  >
                    <span className="col-span-2 font-mono font-bold text-xs">{set.setNumber}</span>

                    <div className="col-span-3 pr-2">
                      <input
                        type="number"
                        value={set.weight}
                        onChange={(e) =>
                          handleUpdateSet(exercise.id, set.setNumber, 'weight', Number(e.target.value))
                        }
                        className="w-full text-xs font-mono font-bold bg-transparent border-b border-zinc-700 focus:border-[#1877F2] outline-none text-center"
                      />
                    </div>

                    <div className="col-span-3 pr-2">
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) =>
                          handleUpdateSet(exercise.id, set.setNumber, 'reps', Number(e.target.value))
                        }
                        className="w-full text-xs font-mono font-bold bg-transparent border-b border-zinc-700 focus:border-[#1877F2] outline-none text-center"
                      />
                    </div>

                    <div className="col-span-2 pr-2">
                      <input
                        type="number"
                        step="0.5"
                        value={set.rpe}
                        onChange={(e) =>
                          handleUpdateSet(exercise.id, set.setNumber, 'rpe', Number(e.target.value))
                        }
                        className="w-full text-xs font-mono bg-transparent border-b border-zinc-700 focus:border-[#1877F2] outline-none text-center"
                      />
                    </div>

                    <div className="col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleToggleSet(exercise.id, set.setNumber)}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                          set.completed
                            ? 'bg-emerald-500 text-black shadow-sm'
                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400'
                        }`}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Workout Finished Celebration Modal */}
        {workoutFinishedCelebration && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-sm w-full rounded-3xl p-6 bg-zinc-950 border border-zinc-800 text-center space-y-4 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Workout Logged! 🎉</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Outstanding effort on {activeWorkoutTitle}. All sets and volume have been saved to your
                  profile and shared with your coach!
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setWorkoutFinishedCelebration(false);
                  setIsLoggingWorkout(false);
                }}
                className="w-full py-2.5 rounded-xl bg-[#1877F2] text-white text-xs font-bold hover:bg-blue-600"
              >
                Back to Workout Hub
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Normal Workout Hub Screen (Exact Inspiration from image.png)
  return (
    <div className="space-y-5 pb-8">
      {/* ==================== 1. WORKOUT DROPDOWN HEADER ==================== */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-1.5 text-2xl font-bold tracking-tight focus:outline-none"
        >
          <span>Workout</span>
          <ChevronDown
            className={`w-5 h-5 text-zinc-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {dropdownOpen && (
          <div
            className={`absolute left-0 top-10 z-30 w-52 rounded-2xl border p-1.5 shadow-xl ${
              isBright ? 'bg-white border-slate-200' : 'bg-zinc-950 border-zinc-800'
            }`}
          >
            <button
              type="button"
              onClick={() => {
                setWorkoutViewMode('workout');
                setDropdownOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-zinc-900/50 flex items-center justify-between"
            >
              <span>Current Workout & Routines</span>
              {workoutViewMode === 'workout' && <Check className="w-3.5 h-3.5 text-[#1877F2]" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setWorkoutViewMode('routines');
                setDropdownOpen(false);
                setExploreRoutinesOpen(true);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-zinc-900/50 flex items-center justify-between"
            >
              <span>Explore Routines</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setWorkoutViewMode('history');
                setDropdownOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-zinc-900/50 flex items-center justify-between"
            >
              <span>Workout History</span>
            </button>
          </div>
        )}
      </div>

      {/* ==================== 2. START EMPTY WORKOUT (EXACT REPLICA FROM IMAGE.PNG) ==================== */}
      <button
        type="button"
        id="btn-start-empty-workout"
        onClick={handleStartEmptyWorkout}
        className={`w-full p-4 rounded-2xl border flex items-center gap-3 text-sm font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] ${
          isBright
            ? 'bg-slate-900 text-white border-slate-800 shadow-md hover:bg-slate-850'
            : 'bg-zinc-900/90 text-white border-zinc-800 shadow-lg hover:bg-zinc-850'
        }`}
      >
        <Plus className="w-5 h-5 text-white stroke-[2.5]" />
        <span>Start Empty Workout</span>
      </button>

      {/* ==================== 3. ROUTINES SECTION (EXACT REPLICA FROM IMAGE.PNG) ==================== */}
      <div className="space-y-3">
        <h2 className={`text-base font-bold ${isBright ? 'text-slate-900' : 'text-white'}`}>Routines</h2>

        <div className="grid grid-cols-2 gap-3">
          {/* New Routine */}
          <button
            type="button"
            id="btn-new-routine"
            onClick={() => setNewRoutineOpen(true)}
            className={`aspect-square p-5 rounded-2xl border flex flex-col items-center justify-center text-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] ${
              isBright
                ? 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
                : 'bg-zinc-900/70 border-zinc-800 hover:bg-zinc-850 text-white'
            }`}
          >
            <FileText className="w-7 h-7 text-zinc-300 stroke-[1.5]" />
            <span className="text-xs font-semibold">New Routine</span>
          </button>

          {/* Explore Routines */}
          <button
            type="button"
            id="btn-explore-routines"
            onClick={() => setExploreRoutinesOpen(true)}
            className={`aspect-square p-5 rounded-2xl border flex flex-col items-center justify-center text-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] ${
              isBright
                ? 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
                : 'bg-zinc-900/70 border-zinc-800 hover:bg-zinc-850 text-white'
            }`}
          >
            <Search className="w-7 h-7 text-zinc-300 stroke-[1.5]" />
            <span className="text-xs font-semibold">Explore Routines</span>
          </button>
        </div>
      </div>

      {/* ==================== 4. COACH ASSIGNED PROGRAM SECTION (KEY USER REQUIREMENT!) ==================== */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#1877F2]" />
            <h3 className={`text-xs font-bold uppercase tracking-wider ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
              Assigned by Coach {assignedProgram.coachName}
            </h3>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-[#1877F2] font-bold border border-blue-500/20">
              Week {assignedProgram.currentWeek} of {assignedProgram.durationWeeks}
            </span>
          </div>
        </div>

        {/* Coach Program Card */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border transition-all ${
            isBright
              ? 'bg-gradient-to-b from-blue-50/50 to-white border-blue-100 shadow-sm'
              : 'bg-gradient-to-b from-blue-950/20 to-zinc-950 border-zinc-900'
          }`}
        >
          {/* Coach Banner */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/40">
            <div className="flex items-center gap-2.5">
              <img
                src={assignedProgram.coachAvatar}
                alt={assignedProgram.coachName}
                className="w-8 h-8 rounded-full object-cover border border-[#1877F2]"
              />
              <div>
                <h4 className="text-xs font-bold leading-tight">{assignedProgram.title}</h4>
                <p className={`text-[10px] ${isBright ? 'text-slate-400' : 'text-zinc-400'}`}>
                  Assigned: {assignedProgram.assignedDate}
                </p>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ACTIVE
            </span>
          </div>

          {/* Invitation / Coach Notes */}
          {assignedProgram.invitationMessage && (
            <p className={`text-xs my-3 italic ${isBright ? 'text-slate-600' : 'text-zinc-300'}`}>
              "{assignedProgram.invitationMessage}"
            </p>
          )}

          {/* Workouts in this Block */}
          <div className="space-y-2.5 mt-3">
            <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
              Assigned Sessions ({assignedProgram.workouts.length})
            </span>

            {assignedProgram.workouts.map((workout, wIdx) => (
              <div
                key={workout.id}
                className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isBright ? 'bg-white border-slate-200' : 'bg-zinc-900/60 border-zinc-800/80'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1877F2]" />
                    <h5 className="text-xs font-bold leading-snug">{workout.title}</h5>
                  </div>
                  <p className={`text-[11px] ${isBright ? 'text-slate-400' : 'text-zinc-400'}`}>
                    {workout.exercises.length} exercises • ~{workout.estimatedDurationMins || 50} min • Day{' '}
                    {workout.dayOfWeek}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {workout.exercises.map((ex, eIdx) => (
                      <span
                        key={eIdx}
                        className={`text-[10px] px-2 py-0.5 rounded-md border font-medium ${
                          isBright
                            ? 'bg-slate-50 border-slate-200 text-slate-700'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                        }`}
                      >
                        {ex.exerciseName}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleStartAssignedWorkout(wIdx)}
                  className="px-4 py-2 rounded-xl bg-[#1877F2] text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-blue-600 shadow-sm shadow-blue-600/20 shrink-0 transition-colors"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Start Workout</span>
                </button>
              </div>
            ))}
          </div>

          {/* Quick simulation helper for user testing */}
          <div className="mt-4 pt-3 border-t border-zinc-800/40 flex items-center justify-between">
            <span className="text-[11px] text-zinc-500">Sync with coach platform:</span>
            <button
              type="button"
              onClick={handleSimulateCoachAssignment}
              className="text-[11px] font-semibold text-[#1877F2] hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Simulate Coach Program Update</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================== 5. HOW TO GET STARTED BANNER (EXACT REPLICA FROM IMAGE.PNG) ==================== */}
      <button
        type="button"
        id="btn-how-to-get-started"
        onClick={() => setHowToStartOpen(true)}
        className={`w-full p-4 rounded-2xl border flex items-center justify-between text-xs font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] ${
          isBright
            ? 'bg-slate-900 text-white border-slate-800 shadow-md'
            : 'bg-slate-900/90 text-slate-200 border-slate-800 hover:bg-slate-850'
        }`}
      >
        <span className="text-sm font-medium">How to get started</span>
        <ArrowRight className="w-4 h-4 text-slate-300" />
      </button>

      {/* ==================== MODAL: HOW TO GET STARTED ==================== */}
      {howToStartOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className={`max-w-md w-full rounded-3xl border p-6 space-y-4 shadow-2xl relative ${
              isBright ? 'bg-white border-slate-200 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-white'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Info className="w-4 h-4 text-[#1877F2]" />
                <span>How to Get Started</span>
              </h3>
              <button
                type="button"
                onClick={() => setHowToStartOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#1877F2]/20 text-[#1877F2] font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold">Coach-Assigned Programming</h4>
                  <p className="text-zinc-400 mt-0.5 leading-relaxed">
                    Whenever your coach assigns or invites you to a new block on the coach platform, it
                    syncs automatically right here with exact sets, reps, load targets, and coaching cues.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#1877F2]/20 text-[#1877F2] font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold">Track Sets & RPE Live</h4>
                  <p className="text-zinc-400 mt-0.5 leading-relaxed">
                    Click "Start Workout" or "Start Empty Workout" to log every set with one tap. Check off
                    completed sets as you rest.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#1877F2]/20 text-[#1877F2] font-bold flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold">Create Custom Routines</h4>
                  <p className="text-zinc-400 mt-0.5 leading-relaxed">
                    Build your own routine templates for auxiliary sessions, arm days, or mobility work
                    using the "New Routine" tile.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setHowToStartOpen(false)}
              className="w-full mt-2 py-2.5 rounded-xl bg-[#1877F2] text-white text-xs font-bold hover:bg-blue-600"
            >
              Got it, let's lift!
            </button>
          </div>
        </div>
      )}

      {/* ==================== MODAL: NEW ROUTINE ==================== */}
      {newRoutineOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`max-w-md w-full rounded-3xl border p-6 space-y-4 shadow-2xl relative ${
              isBright ? 'bg-white border-slate-200 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-white'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
              <h3 className="font-bold text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#1877F2]" />
                <span>Create New Routine</span>
              </h3>
              <button
                type="button"
                onClick={() => setNewRoutineOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Routine Name</label>
                <input
                  type="text"
                  placeholder="e.g. Arms & Core Finisher"
                  value={customRoutineName}
                  onChange={(e) => setCustomRoutineName(e.target.value)}
                  className={`w-full text-xs px-3 py-2 rounded-xl border focus:outline-none ${
                    isBright ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900 border-zinc-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Select Exercises</label>
                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                  {INITIAL_EXERCISES.slice(0, 5).map((ex) => (
                    <div
                      key={ex.id}
                      className="flex items-center justify-between p-2 rounded-xl border border-zinc-800 text-xs"
                    >
                      <span>{ex.name}</span>
                      <span className="text-[10px] text-zinc-400">{ex.muscleGroup}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setNewRoutineOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Routine "${customRoutineName || 'Custom Routine'}" created!`);
                  setNewRoutineOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-[#1877F2] text-white text-xs font-bold"
              >
                Save Routine
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: EXPLORE ROUTINES ==================== */}
      {exploreRoutinesOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`max-w-md w-full rounded-3xl border p-6 space-y-4 shadow-2xl relative ${
              isBright ? 'bg-white border-slate-200 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-white'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Search className="w-4 h-4 text-[#1877F2]" />
                <span>Explore Popular Routines</span>
              </h3>
              <button
                type="button"
                onClick={() => setExploreRoutinesOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              {[
                { title: 'Push Day Hypertrophy', exercises: 5, level: 'Intermediate' },
                { title: 'Pull Day Posterior Chain', exercises: 5, level: 'Intermediate' },
                { title: 'Legs & Core Power', exercises: 4, level: 'Advanced' },
                { title: 'Upper Body Pump & Conditioning', exercises: 6, level: 'All Levels' },
              ].map((r, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl border border-zinc-800 flex items-center justify-between hover:bg-zinc-900/50 cursor-pointer"
                  onClick={() => {
                    handleStartEmptyWorkout();
                    setExploreRoutinesOpen(false);
                  }}
                >
                  <div>
                    <h4 className="text-xs font-bold">{r.title}</h4>
                    <p className="text-[10px] text-zinc-400">
                      {r.exercises} exercises • {r.level}
                    </p>
                  </div>
                  <button className="text-xs text-[#1877F2] font-semibold flex items-center gap-1">
                    <span>Start</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
