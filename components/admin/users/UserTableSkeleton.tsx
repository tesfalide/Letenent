// components/admin/users/UserTableSkeleton.tsx
// Skeleton loading indicators for user statistics and table

import React from 'react';

export const UserTableSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Loading users">
      {/* 1. Statistics Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2.5"
          >
            <div className="h-3 w-20 bg-zinc-800 rounded" />
            <div className="h-7 w-16 bg-zinc-800 rounded" />
            <div className="h-2.5 w-24 bg-zinc-800/60 rounded" />
          </div>
        ))}
      </div>

      {/* 2. Search & Filter Bar Skeleton */}
      <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="h-10 w-full md:w-80 bg-zinc-800 rounded-xl" />
        <div className="flex gap-2 w-full md:w-auto">
          <div className="h-10 w-28 bg-zinc-800 rounded-xl" />
          <div className="h-10 w-28 bg-zinc-800 rounded-xl" />
          <div className="h-10 w-28 bg-zinc-800 rounded-xl" />
        </div>
      </div>

      {/* 3. Table Rows Skeleton */}
      <div className="rounded-2xl bg-zinc-900/30 border border-zinc-800/80 overflow-hidden">
        <div className="p-4 border-b border-zinc-800/80 bg-zinc-900/50">
          <div className="h-4 w-40 bg-zinc-800 rounded" />
        </div>
        <div className="divide-y divide-zinc-800/60">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
            <div key={row} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-zinc-800 shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-4 w-32 bg-zinc-800 rounded" />
                  <div className="h-3 w-44 bg-zinc-800/70 rounded" />
                </div>
              </div>
              <div className="hidden sm:block h-5 w-20 bg-zinc-800 rounded-md" />
              <div className="hidden md:block h-5 w-20 bg-zinc-800 rounded-full" />
              <div className="hidden lg:block h-4 w-24 bg-zinc-800/70 rounded" />
              <div className="hidden lg:block h-4 w-20 bg-zinc-800/70 rounded" />
              <div className="w-8 h-8 rounded-lg bg-zinc-800/80 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
