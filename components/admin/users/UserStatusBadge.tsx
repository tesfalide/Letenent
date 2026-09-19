// components/admin/users/UserStatusBadge.tsx
// Consistent Account Status Badges for Letenent Admin Portal

import React from 'react';
import { CheckCircle2, Ban, Mail } from 'lucide-react';
import { UserAccountStatus } from '@/types';

interface UserStatusBadgeProps {
  status: UserAccountStatus;
  size?: 'sm' | 'md';
}

export const UserStatusBadge: React.FC<UserStatusBadgeProps> = ({ status, size = 'sm' }) => {
  const isSm = size === 'sm';

  switch (status) {
    case 'ACTIVE':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium ${
            isSm ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs'
          } bg-emerald-500/10 text-emerald-400 border border-emerald-500/25`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
          <span>Active</span>
        </span>
      );

    case 'SUSPENDED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium ${
            isSm ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs'
          } bg-rose-500/10 text-rose-400 border border-rose-500/25`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
          <Ban className="w-3 h-3 text-rose-500 shrink-0" />
          <span>Suspended</span>
        </span>
      );

    case 'INVITED':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium ${
            isSm ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs'
          } bg-amber-500/10 text-amber-400 border border-amber-500/25`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
          <Mail className="w-3 h-3 text-amber-500 shrink-0" />
          <span>Invited</span>
        </span>
      );
  }
};
