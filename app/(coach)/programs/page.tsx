// app/(coach)/programs/page.tsx
// Coach Relational Program Builder
// Next.js 14+ App Router Page

'use client';

import React from 'react';
import { ProgramBuilderView } from '@/components/coach/ProgramBuilderView';
import { INITIAL_TRAINEES } from '@/lib/mock-data';

export default function ProgramsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-4 sm:p-8">
      <ProgramBuilderView trainees={INITIAL_TRAINEES} />
    </main>
  );
}
