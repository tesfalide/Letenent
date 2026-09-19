// components/admin/coaches/CoachDetailsSkeleton.tsx
// High-fidelity skeleton loader for Coach Detail view

import React from 'react';

export const CoachDetailsSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div className="h-4 w-32 bg-zinc-800 rounded" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800 shrink-0" />
            <div className="space-y-2">
              <div className="h-6 w-48 bg-zinc-700 rounded" />
              <div className="h-4 w-32 bg-zinc-800 rounded" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-24 bg-zinc-800 rounded-xl" />
            <div className="h-9 w-28 bg-zinc-800 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-2 border-b border-zinc-800 pb-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-8 w-24 bg-zinc-800 rounded-lg" />
        ))}
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-2">
            <div className="h-3 w-20 bg-zinc-800 rounded" />
            <div className="h-7 w-12 bg-zinc-700 rounded" />
          </div>
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className="h-72 rounded-2xl bg-zinc-900/50 border border-zinc-800" />
    </div>
  );
};
