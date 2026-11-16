import React, { useState } from 'react';
import {
  ShieldAlert,
  Info,
  Download,
  Search,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  ArrowUpRight
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { exportToCsv } from '../../../utils/exportCsv';

export default function DepositsLiabilityTable({
  deposits = [],
  onReleaseDeposit,
  onOpenReverseModal
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  const filteredDeposits = deposits.filter((d) => {
    const q = searchQuery.toLowerCase();
    return (
      (d.id && d.id.toLowerCase().includes(q)) ||
      (d.driver && d.driver.toLowerCase().includes(q)) ||
      (d.vehicle && d.vehicle.toLowerCase().includes(q)) ||
      (d.contractId && d.contractId.toLowerCase().includes(q))
    );
  });

  const totalHeldLiability = deposits
    .filter((d) => d.status !== 'Refunded / Released')
    .reduce((sum, d) => sum + Number(d.balance || d.depositAmount || 0), 0);

  const handleExport = () => {
    exportToCsv('PrimeRoute_Deposits_Escrow_Liability', filteredDeposits);
  };

  return (
    <div className="space-y-4">
      {/* 1. Mandatory Escrow Liability Banner with Info Tooltip */}
      <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-200/60 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-extrabold text-amber-950">
                Balance Sheet Liability: Escrow Customer Security Deposits
              </h4>
              {/* Info Tooltip Icon */}
              <div className="relative inline-block">
                <button
                  type="button"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  onClick={() => setShowTooltip((prev) => !prev)}
                  className="p-1 rounded-full text-amber-700 hover:bg-amber-200/60 transition-colors cursor-pointer"
                  title="Accounting Rule Info"
                >
                  <Info className="w-4 h-4" />
                </button>

                {showTooltip && (
                  <div className="absolute left-0 sm:left-auto sm:right-0 top-7 w-80 p-3 bg-slate-900 text-white rounded-xl shadow-xl text-xs z-50 leading-relaxed border border-slate-700 animate-fade-in">
                    <p className="font-bold text-amber-300 mb-1">GAAP &amp; IFRS Escrow Rule:</p>
                    <p>
                      Refundable security deposits represent segregated customer funds held on trust (Account <strong>2100 - Customer Escrow Liability</strong>). They must <strong>NEVER</strong> be counted toward rental income or operating revenue totals.
                    </p>
                  </div>
                )}
              </div>
            </div>
            <p className="text-xs text-amber-800 mt-0.5">
              Fiduciary deposits held against vehicle return condition. Legally excluded from commercial rental revenue and retained as a current liability.
            </p>
          </div>
        </div>

        <div className="bg-white/80 px-4 py-2 rounded-xl border border-amber-300/80 shrink-0 text-right self-stretch sm:self-auto">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
            Total Escrow Liability Held
          </span>
          <span className="text-lg font-black text-amber-950 font-mono">
            {formatCurrency(totalHeldLiability)}
          </span>
        </div>
      </div>

      {/* 2. Table Container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden space-y-4">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#F8FAFC]">
          <div>
            <h3 className="font-bold text-[#0A1E42] text-sm flex items-center gap-2">
              <span>Customer Security Deposit Escrow Ledger</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {filteredDeposits.length} Accounts
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Track deposit inflow, toll/damage deductions, and formal release upon completed lease return
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" /> Export CSV
            </button>
            <div className="w-56">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search driver, contract, vehicle..."
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8]"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[880px]">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Deposit ID</th>
                <th className="py-3 px-4">Driver / Lessee</th>
                <th className="py-3 px-4">Contract Ref</th>
                <th className="py-3 px-4">Held Date</th>
                <th className="py-3 px-4 text-right">Initial Deposit</th>
                <th className="py-3 px-4 text-right">Deductions</th>
                <th className="py-3 px-4 text-right">Escrow Balance</th>
                <th className="py-3 px-4 text-center">Liability Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredDeposits.map((d) => (
                <tr key={d.id} className="hover:bg-amber-50/20 group">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#075EE8]">
                    {d.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-[#0A1E42]">{d.driver}</p>
                    <p className="text-[11px] text-slate-400">{d.vehicle}</p>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {d.contractId}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {formatDate(d.heldDate || d.date)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-800">
                    {formatCurrency(d.depositAmount || d.amount)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium text-rose-600">
                    {d.deductions > 0 ? `-${formatCurrency(d.deductions)}` : '$0.00'}
                  </td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-amber-900 font-mono">
                    {formatCurrency(d.balance)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        d.status === 'Refunded / Released'
                          ? 'bg-slate-100 text-slate-600'
                          : d.status === 'Partial Deduction'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {d.status !== 'Refunded / Released' && (
                        <button
                          onClick={() => onReleaseDeposit(d.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition-all shadow-2xs cursor-pointer"
                        >
                          Release / Refund
                        </button>
                      )}
                      <button
                        onClick={() => onOpenReverseModal(d)}
                        title="Reverse / Correct Escrow Entry"
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

