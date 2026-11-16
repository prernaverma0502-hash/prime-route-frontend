import React, { useState } from 'react';
import {
  Plus,
  Printer,
  RotateCcw,
  Download,
  Search,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  CreditCard
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { exportToCsv } from '../../../utils/exportCsv';

export default function PaymentsTable({
  payments = [],
  onOpenPaymentModal,
  onOpenReceiptModal,
  onOpenReverseModal
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredPayments = payments.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (p.id && p.id.toLowerCase().includes(q)) ||
      (p.driver && p.driver.toLowerCase().includes(q)) ||
      (p.refNumber && p.refNumber.toLowerCase().includes(q)) ||
      (p.referenceNumber && p.referenceNumber.toLowerCase().includes(q)) ||
      (p.method && p.method.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    exportToCsv('PrimeRoute_Payments_Ledger', filteredPayments);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden space-y-4">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#F8FAFC]">
        <div>
          <h3 className="font-bold text-[#0A1E42] text-sm flex items-center gap-2">
            <span>Payments &amp; Remittances Ledger</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {filteredPayments.length} Remittances
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            Recorded receipts with bank ACH confirmation, reference numbers, and printable payment receipts
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" /> Export CSV
          </button>
          <button
            onClick={onOpenPaymentModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" /> Record Payment
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Paid', 'Partial', 'Overdue'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                statusFilter === tab
                  ? 'bg-[#075EE8] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search payment ID, driver, reference #..."
            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8]"
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[920px]">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Payment ID</th>
              <th className="py-3 px-4">Driver / Remitter</th>
              <th className="py-3 px-4">Rental Ref</th>
              <th className="py-3 px-4">Payment Date</th>
              <th className="py-3 px-4">Method &amp; Ref #</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4 text-right">Amount Paid</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Receipt</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredPayments.map((pmt) => (
              <tr key={pmt.id} className="hover:bg-blue-50/20 group">
                <td className="py-3.5 px-4 font-mono font-bold text-[#075EE8]">
                  {pmt.id}
                </td>
                <td className="py-3.5 px-4 font-bold text-[#0A1E42]">
                  {pmt.driver || pmt.customer}
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-600">
                  {pmt.rentalId || pmt.rental || 'RNT-2024-089'}
                </td>
                <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                  {formatDate(pmt.date)}
                </td>
                <td className="py-3.5 px-4">
                  <p className="font-semibold text-slate-800">{pmt.method || pmt.paymentMethod}</p>
                  <p className="font-mono text-[10px] text-slate-400">
                    {pmt.refNumber || pmt.referenceNumber || 'REF-N/A'}
                  </p>
                </td>
                <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                  {formatDate(pmt.dueDate || pmt.date)}
                </td>
                <td className="py-3.5 px-4 text-right font-extrabold text-emerald-600">
                  {pmt.amount < 0 ? (
                    <span className="text-rose-600">-{formatCurrency(Math.abs(pmt.amount))}</span>
                  ) : (
                    `+${formatCurrency(pmt.amount)}`
                  )}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <button
                    onClick={() => onOpenReceiptModal(pmt)}
                    title="View & Print Official Payment Receipt"
                    className="p-1.5 text-slate-600 hover:text-[#075EE8] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center active:scale-95"
                  >
                    <Receipt className="w-4 h-4 text-[#075EE8]" />
                  </button>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => onOpenReverseModal(pmt)}
                    disabled={pmt.status === 'Reversed' || pmt.status === 'Reversed & Offset'}
                    title="Posted transactions cannot be deleted. Click to Reverse / Correct with linked entry."
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-600 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reverse / Correct
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

