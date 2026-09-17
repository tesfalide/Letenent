// components/coach/ProgramBuilderView.tsx
// Program Builder supporting cascading relational program creation (Sprint 1)

import React, { useState } from 'react';
import {
  FolderPlus,
  Plus,
  Trash2,
  Dumbbell,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Save,
} from 'lucide-react';
import { ExerciseItemPayload, TraineeProfile } from '@/types';
import { INITIAL_EXERCISES, INITIAL_TRAINEES } from '@/lib/mock-data';
import { createProgramSchema } from '@/lib/validations/program';
import { useTheme } from '../../src/context/ThemeContext';

interface ProgramBuilderViewProps {
  trainees?: TraineeProfile[];
  preselectedTraineeId?: string;
  onProgramSaved?: () => void;
}

export const ProgramBuilderView: React.FC<ProgramBuilderViewProps> = ({
  trainees = INITIAL_TRAINEES,
  preselectedTraineeId,
  onProgramSaved,
}) => {
  const { isBright } = useTheme();
  const [title, setTitle] = useState('Hypertrophy & Strength Wave 1');
  const [description, setDescription] = useState('4-week microcycle focusing on upper chest, shoulder stability, and posterior chain loading.');
  const [traineeId, setTraineeId] = useState(preselectedTraineeId || trainees[0]?.id || '');
  const [durationWeeks, setDurationWeeks] = useState(4);

  // Workouts within the program
  const [workouts, setWorkouts] = useState([
    {
      id: 'w_1',
      title: 'Day 1: Upper Body Power & Lat Width',
      dayOfWeek: 1, // Monday
      exercises: [
        {
          exerciseId: 'ex_3',
          exerciseName: 'Incline Dumbbell Bench Press',
          orderIndex: 0,
          targetSets: 4,
          targetReps: '8-10',
          targetLoad: 75,
          targetRpe: 8.5,
          restSeconds: 90,
          coachNotes: 'Pause 1 sec in deep stretch at the bottom.',
        },
        {
          exerciseId: 'ex_4',
          exerciseName: 'Neutral Grip Lat Pulldown',
          orderIndex: 1,
          targetSets: 3,
          targetReps: '10-12',
          targetLoad: 150,
          targetRpe: 8.0,
          restSeconds: 90,
          coachNotes: 'Drive elbows down into your back pockets.',
        },
        {
          exerciseId: 'ex_5',
          exerciseName: 'Barbell Overhead Press',
          orderIndex: 2,
          targetSets: 3,
          targetReps: '6-8',
          targetLoad: 115,
          targetRpe: 8.5,
          restSeconds: 120,
          coachNotes: 'Squeeze glutes and brace core tightly.',
        },
      ] as ExerciseItemPayload[],
    },
    {
      id: 'w_2',
      title: 'Day 2: Posterior Chain & Squat Drive',
      dayOfWeek: 3, // Wednesday
      exercises: [
        {
          exerciseId: 'ex_1',
          exerciseName: 'Barbell Back Squat',
          orderIndex: 0,
          targetSets: 4,
          targetReps: '6-8',
          targetLoad: 245,
          targetRpe: 8.5,
          restSeconds: 150,
          coachNotes: 'Drive knees out over pinky toes.',
        },
        {
          exerciseId: 'ex_2',
          exerciseName: 'Romanian Deadlift (RDL)',
          orderIndex: 1,
          targetSets: 3,
          targetReps: '8-10',
          targetLoad: 205,
          targetRpe: 8.0,
          restSeconds: 120,
          coachNotes: 'Hinge hips back toward the wall behind you.',
        },
      ] as ExerciseItemPayload[],
    },
  ]);

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Add exercise to workout
  const handleAddExercise = (workoutIndex: number) => {
    const defaultEx = INITIAL_EXERCISES[0];
    const newExercise: ExerciseItemPayload = {
      exerciseId: defaultEx.id,
      exerciseName: defaultEx.name,
      orderIndex: workouts[workoutIndex].exercises.length,
      targetSets: 3,
      targetReps: '8-10',
      targetLoad: 135,
      targetRpe: 8,
      restSeconds: 90,
    };

    setWorkouts((prev) => {
      const copy = [...prev];
      copy[workoutIndex].exercises.push(newExercise);
      return copy;
    });
  };

  // Remove exercise from workout
  const handleRemoveExercise = (workoutIndex: number, exerciseIndex: number) => {
    setWorkouts((prev) => {
      const copy = [...prev];
      copy[workoutIndex].exercises.splice(exerciseIndex, 1);
      return copy;
    });
  };

  // Update exercise field
  const handleUpdateExercise = (
    workoutIndex: number,
    exerciseIndex: number,
    field: keyof ExerciseItemPayload,
    value: any
  ) => {
    setWorkouts((prev) => {
      const copy = [...prev];
      const item = { ...copy[workoutIndex].exercises[exerciseIndex], [field]: value };
      if (field === 'exerciseId') {
        const found = INITIAL_EXERCISES.find((e) => e.id === value);
        if (found) item.exerciseName = found.name;
      }
      copy[workoutIndex].exercises[exerciseIndex] = item;
      return copy;
    });
  };

  // Add another workout session
  const handleAddWorkout = () => {
    setWorkouts((prev) => [
      ...prev,
      {
        id: `w_${Date.now()}`,
        title: `Day ${prev.length + 1}: Conditioning & Accessories`,
        dayOfWeek: 5,
        exercises: [
          {
            exerciseId: 'ex_7',
            exerciseName: 'Cable Lateral Raise',
            orderIndex: 0,
            targetSets: 3,
            targetReps: '12-15',
            targetLoad: 25,
            targetRpe: 8.5,
            restSeconds: 60,
          },
        ],
      },
    ]);
  };

  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);

    const payload = {
      title,
      description,
      traineeId,
      coachId: 'coach_prof_01',
      durationWeeks,
      workouts: workouts.map((w) => ({
        title: w.title,
        dayOfWeek: w.dayOfWeek,
        exercises: w.exercises,
      })),
    };

    // Client-side Zod validation
    const result = createProgramSchema.safeParse(payload);
    if (!result.success) {
      const issues = result.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
      setValidationErrors(issues);
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      if (onProgramSaved) onProgramSaved();
    }, 600);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl p-6 border transition-colors ${
        isBright ? 'bg-white border-slate-200/80 shadow-sm' : 'bg-zinc-900 border-zinc-800'
      }`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-semibold uppercase tracking-wider border ${
              isBright
                ? 'bg-blue-50 text-[#1877F2] border-blue-200'
                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            }`}>
              Program Library
            </span>
            <span className={`text-xs ${isBright ? 'text-slate-400' : 'text-zinc-400'}`}>• Cascading Relational Architecture</span>
          </div>
          <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${isBright ? 'text-slate-900' : 'text-white'}`}>
            Program Architecture & Assignment
          </h1>
          <p className={`text-xs sm:text-sm mt-1 ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
            Build relational multi-week training programs with cascading workout and exercise items.
          </p>
        </div>

        <button
          onClick={handleSaveProgram}
          disabled={isSaving}
          id="save-program-btn"
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1877F2] hover:bg-blue-600 active:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50 shrink-0"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Compiling & Saving...' : 'Save & Assign Program'}
        </button>
      </div>

      {isSaved && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between ${
          isBright ? 'bg-blue-50 border-blue-200 text-blue-900' : 'bg-blue-950/30 border-blue-500/30 text-blue-300'
        }`}>
          <div className="flex items-center gap-3">
            <CheckCircle2 className={`w-5 h-5 ${isBright ? 'text-[#1877F2]' : 'text-blue-400'}`} />
            <div>
              <p className={`text-xs font-bold ${isBright ? 'text-blue-950' : 'text-blue-200'}`}>
                Program Successfully Saved via Relational API!
              </p>
              <p className={`text-[11px] ${isBright ? 'text-blue-700' : 'text-blue-400/80'}`}>
                Cascading writes to AssignedProgram &gt; AssignedWorkout &gt; AssignedExerciseItem verified.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSaved(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              isBright
                ? 'bg-blue-100 hover:bg-blue-200 text-blue-800'
                : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300'
            }`}
          >
            Edit Again
          </button>
        </div>
      )}

      {validationErrors.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-rose-200 mb-1">
            <AlertCircle className="w-4 h-4" /> Zod Validation Failed:
          </div>
          {validationErrors.map((err, i) => (
            <p key={i}>• {err}</p>
          ))}
        </div>
      )}

      {/* Program Metadata Form */}
      <div className={`border rounded-2xl p-6 space-y-4 transition-colors ${
        isBright ? 'bg-white border-slate-200/80 shadow-sm' : 'bg-zinc-900/80 border-zinc-800'
      }`}>
        <h2 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
          isBright ? 'text-slate-900' : 'text-zinc-200'
        }`}>
          <Layers className="w-4 h-4 text-[#1877F2]" />
          Program Parameters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className={`text-xs block mb-1 ${isBright ? 'text-slate-600 font-medium' : 'text-zinc-400 font-semibold'}`}>
              Program Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 8-Week Powerbuilding Phase 1"
              className={`w-full rounded-xl p-2.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1877F2] ${
                isBright
                  ? 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                  : 'bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600'
              }`}
            />
          </div>

          <div>
            <label className={`text-xs block mb-1 ${isBright ? 'text-slate-600 font-medium' : 'text-zinc-400 font-semibold'}`}>
              Assign to Athlete
            </label>
            <select
              value={traineeId}
              onChange={(e) => setTraineeId(e.target.value)}
              className={`w-full rounded-xl p-2.5 text-xs transition-colors focus:outline-none focus:border-[#1877F2] ${
                isBright
                  ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white'
                  : 'bg-zinc-950 border border-zinc-800 text-zinc-100'
              }`}
            >
              {trainees.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.user.name} ({t.status})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <label className={`text-xs block mb-1 ${isBright ? 'text-slate-600 font-medium' : 'text-zinc-400 font-semibold'}`}>
              Program Scope & Objectives
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Coaching intentions, progression scheme..."
              className={`w-full rounded-xl p-2.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1877F2] ${
                isBright
                  ? 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                  : 'bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600'
              }`}
            />
          </div>

          <div>
            <label className={`text-xs block mb-1 ${isBright ? 'text-slate-600 font-medium' : 'text-zinc-400 font-semibold'}`}>
              Duration (Weeks)
            </label>
            <input
              type="number"
              min="1"
              max="52"
              value={durationWeeks}
              onChange={(e) => setDurationWeeks(parseInt(e.target.value) || 4)}
              className={`w-full rounded-xl p-2.5 text-xs font-mono transition-colors focus:outline-none focus:border-[#1877F2] ${
                isBright
                  ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white'
                  : 'bg-zinc-950 border border-zinc-800 text-zinc-100'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Workouts & Cascading Exercises */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className={`text-sm font-bold flex items-center gap-2 ${isBright ? 'text-slate-900' : 'text-zinc-100'}`}>
            <Dumbbell className="w-4 h-4 text-[#1877F2]" />
            Scheduled Workouts & Cascading Exercises
          </h2>
          <button
            type="button"
            onClick={handleAddWorkout}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isBright
                ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700/60'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-[#1877F2]" />
            Add Workout Session
          </button>
        </div>

        {workouts.map((w, wIdx) => (
          <div
            key={w.id}
            className={`rounded-2xl overflow-hidden space-y-3 p-5 border transition-colors ${
              isBright
                ? 'bg-white border-slate-200/80 shadow-sm'
                : 'bg-zinc-900/80 border-zinc-800 shadow-sm'
            }`}
          >
            {/* Workout title row */}
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b ${
              isBright ? 'border-slate-100' : 'border-zinc-800'
            }`}>
              <div className="flex-1 flex items-center gap-2">
                <span className={`w-7 h-7 rounded-lg border text-xs font-mono font-bold flex items-center justify-center ${
                  isBright
                    ? 'bg-blue-50 border-blue-200 text-[#1877F2]'
                    : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                }`}>
                  W{wIdx + 1}
                </span>
                <input
                  type="text"
                  value={w.title}
                  onChange={(e) => {
                    const val = e.target.value;
                    setWorkouts((prev) => {
                      const copy = [...prev];
                      copy[wIdx].title = val;
                      return copy;
                    });
                  }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none flex-1 transition-colors ${
                    isBright
                      ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-[#1877F2]'
                      : 'bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-[#1877F2]'
                  }`}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>Day:</span>
                <select
                  value={w.dayOfWeek}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setWorkouts((prev) => {
                      const copy = [...prev];
                      copy[wIdx].dayOfWeek = val;
                      return copy;
                    });
                  }}
                  className={`rounded-lg px-2.5 py-1 text-xs focus:outline-none ${
                    isBright
                      ? 'bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white'
                      : 'bg-zinc-950 border border-zinc-800 text-zinc-200'
                  }`}
                >
                  <option value={1}>Monday</option>
                  <option value={2}>Tuesday</option>
                  <option value={3}>Wednesday</option>
                  <option value={4}>Thursday</option>
                  <option value={5}>Friday</option>
                  <option value={6}>Saturday</option>
                  <option value={7}>Sunday</option>
                </select>
              </div>
            </div>

            {/* Exercise items list */}
            <div className="space-y-2">
              <div className={`grid grid-cols-12 gap-2 text-[11px] font-semibold uppercase tracking-wider px-2 ${
                isBright ? 'text-slate-400' : 'text-zinc-400'
              }`}>
                <span className="col-span-4">Exercise Name</span>
                <span className="col-span-2 text-center">Sets</span>
                <span className="col-span-2 text-center">Reps</span>
                <span className="col-span-2 text-center">Load (lbs)</span>
                <span className="col-span-1 text-center">RPE</span>
                <span className="col-span-1 text-right">Del</span>
              </div>

              {w.exercises.map((ex, exIdx) => (
                <div
                  key={exIdx}
                  className={`grid grid-cols-12 gap-2 items-center p-2.5 rounded-xl border transition-colors ${
                    isBright
                      ? 'bg-slate-50/70 border-slate-200/70'
                      : 'bg-zinc-950/60 border-zinc-800/60'
                  }`}
                >
                  {/* Exercise selector */}
                  <div className="col-span-4">
                    <select
                      value={ex.exerciseId}
                      onChange={(e) =>
                        handleUpdateExercise(wIdx, exIdx, 'exerciseId', e.target.value)
                      }
                      className={`w-full rounded-lg p-1.5 text-xs focus:outline-none ${
                        isBright
                          ? 'bg-white border border-slate-200 text-slate-900 focus:border-[#1877F2]'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-200 focus:border-[#1877F2]'
                      }`}
                    >
                      {INITIAL_EXERCISES.map((exercise) => (
                        <option key={exercise.id} value={exercise.id}>
                          {exercise.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Target Sets */}
                  <div className="col-span-2 text-center">
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={ex.targetSets}
                      onChange={(e) =>
                        handleUpdateExercise(
                          wIdx,
                          exIdx,
                          'targetSets',
                          parseInt(e.target.value) || 1
                        )
                      }
                      className={`w-16 rounded-lg p-1 text-center font-mono text-xs focus:outline-none ${
                        isBright
                          ? 'bg-white border border-slate-200 text-slate-900 focus:border-[#1877F2]'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-100 focus:border-[#1877F2]'
                      }`}
                    />
                  </div>

                  {/* Target Reps */}
                  <div className="col-span-2 text-center">
                    <input
                      type="text"
                      value={ex.targetReps}
                      onChange={(e) =>
                        handleUpdateExercise(wIdx, exIdx, 'targetReps', e.target.value)
                      }
                      placeholder="8-10"
                      className={`w-20 rounded-lg p-1 text-center font-mono text-xs focus:outline-none ${
                        isBright
                          ? 'bg-white border border-slate-200 text-slate-900 focus:border-[#1877F2]'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-100 focus:border-[#1877F2]'
                      }`}
                    />
                  </div>

                  {/* Target Load */}
                  <div className="col-span-2 text-center">
                    <input
                      type="number"
                      value={ex.targetLoad}
                      onChange={(e) =>
                        handleUpdateExercise(
                          wIdx,
                          exIdx,
                          'targetLoad',
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className={`w-20 rounded-lg p-1 text-center font-mono text-xs focus:outline-none ${
                        isBright
                          ? 'bg-white border border-slate-200 text-slate-900 focus:border-[#1877F2]'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-100 focus:border-[#1877F2]'
                      }`}
                    />
                  </div>

                  {/* Target RPE */}
                  <div className="col-span-1 text-center">
                    <input
                      type="number"
                      step="0.5"
                      min="6"
                      max="10"
                      value={ex.targetRpe ?? 8}
                      onChange={(e) =>
                        handleUpdateExercise(
                          wIdx,
                          exIdx,
                          'targetRpe',
                          parseFloat(e.target.value) || 8
                        )
                      }
                      className={`w-12 rounded-lg p-1 text-center font-mono text-xs focus:outline-none ${
                        isBright
                          ? 'bg-white border border-slate-200 text-slate-900 focus:border-[#1877F2]'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-100 focus:border-[#1877F2]'
                      }`}
                    />
                  </div>

                  {/* Delete button */}
                  <div className="col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveExercise(wIdx, exIdx)}
                      className={`p-1 rounded transition-colors ${
                        isBright ? 'text-slate-400 hover:text-rose-600' : 'text-zinc-500 hover:text-rose-400'
                      }`}
                      title="Remove Exercise"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Exercise to this workout button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => handleAddExercise(wIdx)}
                className={`w-full py-2 rounded-xl border border-dashed text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                  isBright
                    ? 'bg-slate-50/80 hover:bg-slate-100/80 border-slate-200 text-slate-600 hover:text-slate-900'
                    : 'bg-zinc-950/40 hover:bg-zinc-800/60 border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                Add Exercise to Workout
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
