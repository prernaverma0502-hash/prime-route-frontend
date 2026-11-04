import React from 'react';
import { getStatusColor } from '../../utils/formatters';

export default function StatusBadge({ status, className = '' }) {
  const { bg, dot } = getStatusColor(status);
  const isLive = ['active', 'in progress', 'available'].includes(status?.toLowerCase());

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all duration-200 ${bg} ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {isLive && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dot}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dot}`} />
      </span>
      {status}
    </span>
  );
}
