// app/(coach)/clients/page.tsx
// Coach Client Management Roster
// Next.js 14+ App Router Page

'use client';

import React from 'react';
import { ClientRosterView } from '@/components/coach/ClientRosterView';
import { INITIAL_TRAINEES } from '@/lib/mock-data';

export default function ClientsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-4 sm:p-8">
      <ClientRosterView trainees={INITIAL_TRAINEES} />
    </main>
  );
}
