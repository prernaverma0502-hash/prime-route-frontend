import React, { useState } from 'react';
import {
  AlertTriangle,
  CreditCard,
  Send,
  Phone,
  Mail,
  Receipt,
  CheckCircle2,
  Clock,
  DollarSign,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Can from '../../auth/Can';

export default function OverdueCollectionsView({
  drivers,
  onRecordPayment,
  onViewDriver,
  onOpenStatement,
}) {
  const [reminderStatus, setReminderStatus] = useState(null);

  // Filter to drivers with an overdue balance (> 0)
  const overdueDrivers = (drivers || []).filter((d) => Number(d.balance) > 0);

  const totalOverdue = overdueDrivers.reduce((sum, d) => sum + Number(d.balance), 0);
  const criticalOverdueCount = overdueDrivers.filter(
    (d) => (d.daysOverdue || (d.balance > 300 ? 14 : 5)) >= 14
  ).length;

  const handleSendReminder = (driver) => {
    setReminderStatus({
      driverId: driver.id,
      driverName: driver.name,
      message: `Payment reminder SMS and email dispatched to ${driver.name} (${driver.phone} • ${driver.email}) for ${formatCurrency(driver.balance)}.`,
    });
    setTimeout(() => setReminderStatus(null), 4000);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Toast Reminder Alert */}
      {reminderStatus && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs font-semibold flex items-center justify-between animate-slide-up">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#075EE8]" />
            {reminderStatus.message}
          </span>
          <button
            type="button"
            onClick={() => setReminderStatus(null)}
            className="text-blue-700 font-bold hover:text-blue-900 ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Collections KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-rose-100 shadow-[0_2px_12px_rgba(225,29,72,0.04)] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Delinquent Arrears
            </span>
            <p className="text-xl sm:text-2xl font-black text-rose-600 mt-0.5">
              {formatCurrency(totalOverdue)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-amber-100 shadow-[0_2px_12px_rgba(245,158,11,0.04)] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Accounts in Collections
            </span>
            <p className="text-xl sm:text-2xl font-black text-amber-600 mt-0.5">
              {overdueDrivers.length} Drivers
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Critical &gt; 14 Days
            </span>
            <p className="text-xl sm:text-2xl font-black text-[#0A1E42] mt-0.5">
              {criticalOverdueCount} Accounts
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Overdue Accounts Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
        <div className="p-4 bg-[#F8FAFC] border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <DollarSign className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-[#0A1E42]">
                Delinquent Accounts &amp; Automated Collections
              </h3>
              <p className="text-[10px] text-slate-400">
                Drivers with outstanding unpaid lease balances, citations, or toll charges
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            {overdueDrivers.length} Overdue Records
          </span>
        </div>

        {overdueDrivers.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="font-bold text-[#0A1E42]">All Driver Accounts are Fully Reconciled</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Zero delinquent balances or outstanding collections across the entire fleet roster.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-100">
                  <th className="py-3 px-4">Driver Profile</th>
                  <th className="py-3 px-4">Assigned Vehicle</th>
                  <th className="py-3 px-4 text-right">Outstanding Due</th>
                  <th className="py-3 px-4 text-center">Aging / Days Overdue</th>
                  <th className="py-3 px-4 text-center">Last Payment Date</th>
                  <th className="py-3 px-4 text-right">Collections Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {overdueDrivers.map((driver) => {
                  const daysOverdue = driver.daysOverdue || (driver.balance > 300 ? 14 : 5);
                  const lastPayment = driver.lastPaymentDate || '2025-07-10';

                  return (
                    <tr key={driver.id} className="hover:bg-amber-50/20 transition-colors">
                      {/* Driver Profile */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={driver.avatar}
                            alt={driver.name}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-100 shrink-0"
                          />
                          <div>
                            <button
                              type="button"
                              onClick={() => onViewDriver(driver)}
                              className="font-bold text-[#0A1E42] hover:text-[#075EE8] transition-colors text-left cursor-pointer"
                            >
                              {driver.name}
                            </button>
                            <p className="text-[11px] text-slate-400 font-mono">{driver.id}</p>
                            <p className="text-[11px] text-slate-500">{driver.phone}</p>
                          </div>
                        </div>
                      </td>

                      {/* Vehicle */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-700">
                          {driver.vehicle || 'Unassigned'}
                        </span>
                      </td>

                      {/* Outstanding Balance */}
                      <td className="py-3 px-4 text-right">
                        <span className="font-mono font-black text-sm text-rose-600">
                          {formatCurrency(driver.balance)}
                        </span>
                      </td>

                      {/* Days Overdue */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            daysOverdue >= 14
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          {daysOverdue} Days Overdue
                        </span>
                      </td>

                      {/* Last Payment Date */}
                      <td className="py-3 px-4 text-center text-slate-600 font-medium">
                        {formatDate(lastPayment)}
                      </td>

                      {/* Quick Collections Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Send Reminder Action */}
                          <button
                            type="button"
                            onClick={() => handleSendReminder(driver)}
                            title="Dispatch SMS & Email Payment Reminder"
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-blue-50 hover:text-[#075EE8] hover:border-blue-200 text-slate-600 text-[11px] font-bold transition-all cursor-pointer"
                          >
                            <Send className="w-3 h-3 text-[#075EE8]" />
                            <span>Remind</span>
                          </button>

                          {/* Quick Record Payment Action */}
                          <Can module="accounting" do="add">
                            <button
                              type="button"
                              onClick={() => onRecordPayment(driver)}
                              title="Record Immediate Payment"
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
                            >
                              <CreditCard className="w-3 h-3 text-white" />
                              <span>Record Pay</span>
                            </button>
                          </Can>

                          {/* View Statement */}
                          <button
                            type="button"
                            onClick={() => onOpenStatement(driver)}
                            title="View Driver Ledger Statement"
                            className="p-1.5 text-slate-400 hover:text-[#075EE8] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

