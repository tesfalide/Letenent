// components/coach/ExerciseLibraryView.tsx
// Exercise Library view for letenent coaching OS

import React, { useState } from 'react';
import { Dumbbell, Search, Plus, Filter, Sparkles, Tag, ChevronRight } from 'lucide-react';
import { useTheme } from '../../src/context/ThemeContext';

interface ExerciseItem {
  id: string;
  name: string;
  category: 'Chest' | 'Back' | 'Shoulders' | 'Legs' | 'Arms' | 'Core';
  equipment: string;
  targetMuscles: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const DEFAULT_EXERCISES: ExerciseItem[] = [
  {
    id: 'ex_1',
    name: 'Bench Press (Barbell)',
    category: 'Chest',
    equipment: 'Barbell, Flat Bench',
    targetMuscles: 'Pectoralis Major, Anterior Deltoid, Triceps',
    difficulty: 'Intermediate',
  },
  {
    id: 'ex_2',
    name: 'Incline Dumbbell Press',
    category: 'Chest',
    equipment: 'Dumbbells, Incline Bench',
    targetMuscles: 'Clavicular Head Pectoralis, Anterior Deltoids',
    difficulty: 'Intermediate',
  },
  {
    id: 'ex_3',
    name: 'Bench Press (Machine)',
    category: 'Chest',
    equipment: 'Converging Chest Press Machine',
    targetMuscles: 'Pectoralis Major, Sternal Head',
    difficulty: 'Beginner',
  },
  {
    id: 'ex_4',
    name: 'Arnold Press (Dumbbell)',
    category: 'Shoulders',
    equipment: 'Dumbbells',
    targetMuscles: 'Anterior & Lateral Deltoid, Upper Trapezius',
    difficulty: 'Intermediate',
  },
  {
    id: 'ex_5',
    name: 'Barbell Overhead Press',
    category: 'Shoulders',
    equipment: 'Barbell',
    targetMuscles: 'Anterior Deltoid, Triceps, Core Stabilizers',
    difficulty: 'Advanced',
  },
  {
    id: 'ex_6',
    name: 'Cable Lateral Raise',
    category: 'Shoulders',
    equipment: 'Cable Tower, D-Handle',
    targetMuscles: 'Lateral Deltoid (Mid Delt Isolation)',
    difficulty: 'Beginner',
  },
  {
    id: 'ex_7',
    name: 'Neutral Grip Lat Pulldown',
    category: 'Back',
    equipment: 'Cable Tower, Neutral Grip Mag Attachment',
    targetMuscles: 'Latissimus Dorsi, Teres Major, Biceps',
    difficulty: 'Beginner',
  },
  {
    id: 'ex_8',
    name: 'Barbell Bent Over Row',
    category: 'Back',
    equipment: 'Barbell',
    targetMuscles: 'Latissimus Dorsi, Rhomboids, Mid Trapezius',
    difficulty: 'Intermediate',
  },
  {
    id: 'ex_9',
    name: 'Barbell Back Squat',
    category: 'Legs',
    equipment: 'Barbell, Squat Rack',
    targetMuscles: 'Quadriceps, Gluteus Maximus, Adductor Magnus',
    difficulty: 'Advanced',
  },
  {
    id: 'ex_10',
    name: 'Romanian Deadlift (Barbell)',
    category: 'Legs',
    equipment: 'Barbell',
    targetMuscles: 'Hamstrings, Gluteus Maximus, Erector Spinae',
    difficulty: 'Intermediate',
  },
  {
    id: 'ex_11',
    name: 'Bulgarian Split Squat',
    category: 'Legs',
    equipment: 'Dumbbells, Bench',
    targetMuscles: 'Quadriceps, Glutes, Hamstrings',
    difficulty: 'Intermediate',
  },
  {
    id: 'ex_12',
    name: 'Incline Dumbbell Bicep Curl',
    category: 'Arms',
    equipment: 'Dumbbells, Incline Bench',
    targetMuscles: 'Biceps Brachii (Long Head Stretch)',
    difficulty: 'Beginner',
  },
];

export const ExerciseLibraryView: React.FC = () => {
  const { isBright } = useTheme();
  const [exercises, setExercises] = useState<ExerciseItem[]>(DEFAULT_EXERCISES);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Chest', 'Back', 'Shoulders', 'Legs', 'Arms'];

  const filtered = exercises.filter((ex) => {
    const matchesCategory = selectedCategory === 'ALL' || ex.category === selectedCategory;
    const matchesSearch =
      ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.targetMuscles.toLowerCase().includes(search.toLowerCase()) ||
      ex.equipment.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5 ${isBright ? 'text-slate-900' : 'text-white'}`}>
            <Dumbbell className="w-7 h-7 text-[#1877F2]" />
            <span>Exercise Library</span>
          </h1>
          <p className={`text-sm mt-1 ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
            Browse and manage prescribed movements, target muscles, and equipment requirements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search movement or muscle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#1877F2] text-white shadow-sm'
                : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800'
            }`}
          >
            {cat} {cat === 'ALL' ? `(${exercises.length})` : ''}
          </button>
        ))}
      </div>

      {/* Exercise Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((ex) => (
          <div
            key={ex.id}
            className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all space-y-3 group cursor-pointer"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {ex.category}
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-blue-600 transition-colors">
                  {ex.name}
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300">
                {ex.difficulty}
              </span>
            </div>

            <div className="text-xs text-slate-500 dark:text-zinc-400 space-y-1">
              <p>
                <strong className="text-slate-700 dark:text-zinc-300">Equipment:</strong> {ex.equipment}
              </p>
              <p>
                <strong className="text-slate-700 dark:text-zinc-300">Target:</strong> {ex.targetMuscles}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
