/**
 * src/shared/components/StatusBadge.tsx
 *
 * [Shared Component]
 * ステータスバッジ
 */

'use client';

import { type FC } from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import type { KPIStatus } from '@/domain/kpi/types';

export interface StatusBadgeProps {
  status: KPIStatus;
}

const STATUS_CONFIG: Record<
  KPIStatus,
  { icon: React.ReactNode; className: string }
> = {
  critical: {
    icon: <XCircle className="w-3 h-3 mr-1" />,
    className: 'text-red-400 bg-red-950/30 border-red-900/50',
  },
  warning: {
    icon: <AlertTriangle className="w-3 h-3 mr-1" />,
    className: 'text-amber-400 bg-amber-950/30 border-amber-900/50',
  },
  healthy: {
    icon: <CheckCircle className="w-3 h-3 mr-1" />,
    className: 'text-emerald-400 bg-emerald-950/30 border-emerald-900/50',
  },
};

export const StatusBadge: FC<StatusBadgeProps> = ({ status }) => {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`flex items-center px-2 py-0.5 rounded text-xs border ${config.className}`}
    >
      {config.icon}
      {status.toUpperCase()}
    </span>
  );
};

export default StatusBadge;
