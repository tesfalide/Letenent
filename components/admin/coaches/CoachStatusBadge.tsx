// components/admin/coaches/CoachStatusBadge.tsx
// High-visibility accessible status badge for coach accounts

import React from 'react';
import { UserAccountStatus } from '@/types';
import { CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';

interface CoachStatusBadgeProps {
  status: UserAccountStatus | string;
  size?: 'sm' | 'md';
}

export const CoachStatusBadge: React.FC<CoachStatusBadgeProps> = ({ status, size = 'sm' }) => {
  const normalized = (status || 'ACTIVE').toUpperCase();

  const isSmall = size === 'sm';
  const sizeClasses = isSmall ? 'px-2 py-0.5 text-[11px] gap-1' : 'px-2.5 py-1 text-xs gap-1.5';

  switch (normalized) {
    case 'ACTIVE':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 ${sizeClasses}`}
        >
          <CheckCircle2 className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>Active</span>
        </span>
      );
    case 'SUSPENDED':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/25 ${sizeClasses}`}
        >
          <XCircle className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>Suspended</span>
        </span>
      );
    case 'INACTIVE':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/25 ${sizeClasses}`}
        >
          <AlertTriangle className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>Inactive</span>
        </span>
      );
    case 'INVITED':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/25 ${sizeClasses}`}
        >
          <Clock className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>Invited</span>
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 ${sizeClasses}`}
        >
          <span>{status}</span>
        </span>
      );
  }
};
