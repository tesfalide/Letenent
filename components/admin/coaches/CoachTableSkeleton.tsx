// components/admin/coaches/CoachTableSkeleton.tsx
// High-fidelity loading skeleton for Coaches directory

import React from 'react';

export const CoachTableSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Top Stats Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <div className="h-3 w-20 bg-zinc-800 rounded" />
            <div className="h-7 w-12 bg-zinc-700 rounded" />
          </div>
        ))}
      </div>

      {/* Search & Filter bar skeleton */}
      <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex flex-col sm:flex-row gap-3">
        <div className="h-10 flex-1 bg-zinc-800 rounded-xl" />
        <div className="h-10 w-32 bg-zinc-800 rounded-xl" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 overflow-hidden">
        <div className="h-12 bg-zinc-950/60 border-b border-zinc-800 px-4 flex items-center justify-between">
          <div className="h-3 w-24 bg-zinc-800 rounded" />
          <div className="h-3 w-32 bg-zinc-800 rounded" />
          <div className="h-3 w-20 bg-zinc-800 rounded" />
        </div>
        <div className="divide-y divide-zinc-800/60">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800 shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-32 bg-zinc-700 rounded" />
                  <div className="h-2.5 w-24 bg-zinc-800 rounded" />
                </div>
              </div>
              <div className="h-3 w-40 bg-zinc-800 rounded hidden md:block" />
              <div className="h-3 w-16 bg-zinc-800 rounded" />
              <div className="h-3 w-16 bg-zinc-800 rounded hidden sm:block" />
              <div className="h-6 w-20 bg-zinc-800 rounded-full" />
              <div className="w-6 h-6 rounded bg-zinc-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
