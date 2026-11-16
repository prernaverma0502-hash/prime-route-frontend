import React, { useState } from 'react';
import {
  DollarSign,
  Download,
  Search,
  ExternalLink,
  CreditCard,
  History,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import { formatCurrency } from '../../../utils/formatters';
import { exportToCsv } from '../../../utils/exportCsv';

export default function BalancesTable({
  driverBalances = [],
  onRecordPaymentForDriver,
  onTraceDriver
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBalances = driverBalances.filter((b) => {
    const q = searchQuery.toLowerCase();
    return (
      (b.driver && b.driver.toLowerCase().includes(q)) ||
      (b.vehicle && b.vehicle.toLowerCase().includes(q))
    );
  });

  const totalOutstanding = driverBalances
    .filter((b) => b.netBalance > 0)
    .reduce((sum, b) => sum + b.netBalance, 0);

  const handleExport = () => {
    exportToCsv('PrimeRoute_Driver_Balances', filteredBalances);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden space-y-4">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#F8FAFC]">
        <div>
          <h3 className="font-bold text-[#0A1E42] text-sm flex items-center gap-2">
            <span>Driver Account Balances &amp; Statement Aging</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-[#075EE8]">
              {filteredBalances.length} Accounts
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            Real-time balance calculations: Total Charges minus Payments and Credits. Click any net balance to trace source transactions.
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
              placeholder="Search driver, vehicle..."
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8]"
            />
          </div>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="px-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
            Total Outstanding Receivables
          </span>
          <span className="text-base font-extrabold text-[#0A1E42] font-mono">
            {formatCurrency(totalOutstanding)}
          </span>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
            Overdue Driver Accounts
          </span>
          <span className="text-base font-extrabold text-rose-600 font-mono">
            {driverBalances.filter((b) => b.netBalance > 0 && b.status.includes('Overdue')).length} Drivers
          </span>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
            Total Escrow Deposits Held
          </span>
          <span className="text-base font-extrabold text-amber-800 font-mono">
            {formatCurrency(driverBalances.reduce((sum, b) => sum + (b.deposit || 0), 0))} (Liability)
          </span>
        </div>
      </div>

      {/* Balances Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[920px]">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Driver Account</th>
              <th className="py-3 px-4">Assigned Vehicle</th>
              <th className="py-3 px-4 text-right">Charges MTD</th>
              <th className="py-3 px-4 text-right">Payments MTD</th>
              <th className="py-3 px-4 text-right">Credits Applied</th>
              <th className="py-3 px-4 text-right">Deposit in Escrow</th>
              <th className="py-3 px-4 text-right">Net Current Balance</th>
              <th className="py-3 px-4 text-center">Aging Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredBalances.map((b, idx) => (
              <tr key={idx} className="hover:bg-blue-50/20 group">
                <td className="py-3.5 px-4">
                  <p className="font-bold text-[#0A1E42]">{b.driver}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{b.driverId || 'DRV-ID'}</p>
                </td>
                <td className="py-3.5 px-4 font-semibold text-slate-700">
                  {b.vehicle}
                </td>
                <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                  {formatCurrency(b.charges)}
                </td>
                <td className="py-3.5 px-4 text-right font-bold text-emerald-600">
                  {formatCurrency(b.payments)}
                </td>
                <td className="py-3.5 px-4 text-right font-medium text-purple-600">
                  {b.credits > 0 ? `-${formatCurrency(b.credits)}` : '$0.00'}
                </td>
                <td className="py-3.5 px-4 text-right text-slate-500 font-mono">
                  {formatCurrency(b.deposit)}
                </td>
                {/* Traceable Net Current Balance */}
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => onTraceDriver(b)}
                    title="Click to trace source transactions for this driver balance"
                    className={`font-mono font-black text-sm px-2 py-0.5 rounded-lg border transition-all cursor-pointer hover:underline ${
                      b.netBalance > 0
                        ? 'text-rose-700 bg-rose-50 border-rose-200 hover:bg-rose-100'
                        : b.netBalance < 0
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                        : 'text-slate-700 bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {b.netBalance < 0
                      ? `(${formatCurrency(Math.abs(b.netBalance))}) Cr`
                      : formatCurrency(b.netBalance)}
                  </button>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      b.netBalance > 500
                        ? 'bg-rose-100 text-rose-800'
                        : b.netBalance > 0
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onRecordPaymentForDriver(b.driver)}
                      className="px-2.5 py-1 bg-[#075EE8] hover:bg-[#0650C7] text-white rounded-lg text-[10px] font-bold transition-all shadow-2xs cursor-pointer"
                    >
                      Receive Payment
                    </button>
                    <button
                      onClick={() => onTraceDriver(b)}
                      title="Audit Driver Transaction History"
                      className="p-1.5 text-slate-500 hover:text-[#075EE8] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <History className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

