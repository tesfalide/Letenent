// app/(coach)/clients/[id]/check-ins/page.tsx
// Coach Check-in Review view with side-by-side metrics and workout stats
// Next.js 14+ App Router Page

'use client';

import React from 'react';
import { CheckInReviewView } from '@/components/coach/CheckInReviewView';
import { INITIAL_CHECK_INS } from '@/lib/mock-data';

export default function ClientCheckInsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-4 sm:p-8">
      <CheckInReviewView checkIns={INITIAL_CHECK_INS} />
    </main>
  );
}
