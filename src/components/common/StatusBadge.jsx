import React from 'react';

/**
 * Enhanced StatusBadge supporting all client PDF fleet & operational statuses:
 * - Available: Green
 * - Rented: Blue
 * - Reserved: Purple
 * - Maintenance: Orange
 * - Unavailable: Red
 * - Sold / Retired: Grey
 */
export const getBadgeColors = (status) => {
  const s = String(status || '').toLowerCase().trim();

  switch (s) {
    case 'available':
    case 'active':
    case 'paid':
    case 'completed':
    case 'good':
    case 'verified':
    case 'approved':
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500'
      };

    case 'rented':
    case 'in progress':
    case 'pending':
    case 'pending review':
    case 'processing':
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500'
      };

    case 'reserved':
      return {
        bg: 'bg-purple-50 text-purple-700 border-purple-200',
        dot: 'bg-purple-500'
      };

    case 'maintenance':
    case 'scheduled':
    case 'in shop':
    case 'warning':
    case 'draft':
    case 'due soon':
    case 'expiring soon':
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500'
      };

    case 'unavailable':
    case 'inactive':
    case 'danger':
    case 'rejected':
    case 'unpaid':
    case 'overdue':
    case 'cancelled':
    case 'expired':
      return {
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500'
      };

    case 'sold':
    case 'retired':
    case 'archived':
    case 'not started':
    default:
      return {
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
        dot: 'bg-slate-400'
      };
  }
};

export default function StatusBadge({ status, className = '' }) {
  const { bg, dot } = getBadgeColors(status);
  const isLive = ['active', 'in progress', 'available', 'rented'].includes(
    String(status || '').toLowerCase().trim()
  );

  return (
    <span
      className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap w-fit shrink-0 transition-all duration-200 ${bg} ${className}`}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        {isLive && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dot}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dot}`} />
      </span>
      <span>{status || 'Unknown'}</span>
    </span>
  );
}
