import React from 'react';
import {
  ShieldCheck,
  FileText,
  AlertTriangle,
  Clock,
  Car,
  User,
  KeyRound,
  FileCheck,
  Calendar,
  RefreshCw
} from 'lucide-react';
import EmptyState from '../../../components/common/EmptyState';
import { formatDate } from '../../../utils/formatters';

export default function ComplianceTable({
  items,
  onRenewItem,
  onResetFilters
}) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
        <EmptyState
          title="No compliance records found"
          description="No regulatory items match your current filter criteria."
          actionText="Reset All Filters"
          onAction={onResetFilters}
        />
      </div>
    );
  }

  const renderBadge = (days) => {
    if (days <= 7) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          Critical ({days} {days === 1 ? 'day' : 'days'})
        </span>
      );
    }
    if (days <= 14) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          Due Soon ({days} days)
        </span>
      );
    }
    if (days <= 30) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-blue-50 text-[#075EE8] border border-blue-200">
          <Calendar className="w-3.5 h-3.5 text-[#075EE8]" />
          Upcoming ({days} days)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        Compliant ({days} days)
      </span>
    );
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Vehicle Registration':
        return <Car className="w-3.5 h-3.5 text-blue-600" />;
      case 'Driver License':
        return <User className="w-3.5 h-3.5 text-purple-600" />;
      case 'Rental Contract':
        return <KeyRound className="w-3.5 h-3.5 text-amber-600" />;
      case 'Required Document':
      default:
        return <FileText className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">Compliance Item & Document #</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Entity Subject</th>
              <th className="py-3.5 px-4">Regulatory Authority</th>
              <th className="py-3.5 px-4">Expiration Date</th>
              <th className="py-3.5 px-4">30/14/7-Day Expiry Countdown</th>
              <th className="py-3.5 px-4">Verified File</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-blue-50/25 transition-colors group">
                <td className="py-3.5 px-4">
                  <p className="font-bold text-[#0A1E42] flex items-center gap-1.5">
                    {item.title}
                  </p>
                  <span className="font-mono text-[10px] text-slate-400 mt-0.5 block">
                    {item.identifier || item.id}
                  </span>
                </td>

                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-700">
                    {getCategoryIcon(item.category)}
                    {item.category}
                  </span>
                </td>

                <td className="py-3.5 px-4">
                  <p className="font-semibold text-slate-800">{item.entityName}</p>
                  <p className="text-[10px] text-slate-400">{item.entityType}</p>
                </td>

                <td className="py-3.5 px-4 text-slate-600 font-medium">
                  {item.authority}
                </td>

                <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                  {formatDate(item.expiryDate)}
                </td>

                <td className="py-3.5 px-4">
                  {renderBadge(item.daysRemaining)}
                </td>

                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200 transition-colors cursor-pointer">
                    <FileCheck className="w-3 h-3 text-blue-600 shrink-0" />
                    <span className="max-w-[120px] truncate">{item.documentFile}</span>
                  </span>
                </td>

                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => onRenewItem(item)}
                    className="px-3 py-1.5 text-xs font-bold text-[#075EE8] bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-all inline-flex items-center gap-1 cursor-pointer active:scale-95"
                    title="Renew Compliance Record"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Renew
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

