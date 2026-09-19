// components/admin/users/UserRoleBadge.tsx
// Consistent Role Badges for Letenent Admin Portal

import React from 'react';
import { Shield, ShieldCheck, Activity } from 'lucide-react';
import { UserRole } from '@/types';

interface UserRoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md';
}

export const UserRoleBadge: React.FC<UserRoleBadgeProps> = ({ role, size = 'sm' }) => {
  const isSm = size === 'sm';

  switch (role) {
    case 'ADMIN':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-md font-mono font-semibold uppercase tracking-wider ${
            isSm ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
          } bg-rose-500/15 text-rose-400 border border-rose-500/30`}
          title="Platform Administrator"
        >
          <Shield className={isSm ? 'w-3 h-3 text-rose-400' : 'w-3.5 h-3.5 text-rose-400'} />
          <span>Admin</span>
        </span>
      );

    case 'COACH':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-md font-mono font-semibold uppercase tracking-wider ${
            isSm ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
          } bg-[#1877F2]/15 text-[#1877F2] border border-[#1877F2]/30`}
          title="Fitness Coach"
        >
          <ShieldCheck className={isSm ? 'w-3 h-3 text-[#1877F2]' : 'w-3.5 h-3.5 text-[#1877F2]'} />
          <span>Coach</span>
        </span>
      );

    case 'TRAINEE':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-md font-mono font-semibold uppercase tracking-wider ${
            isSm ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
          } bg-emerald-500/15 text-emerald-400 border border-emerald-500/30`}
          title="Trainee Athlete"
        >
          <Activity className={isSm ? 'w-3 h-3 text-emerald-400' : 'w-3.5 h-3.5 text-emerald-400'} />
          <span>Trainee</span>
        </span>
      );
  }
};
