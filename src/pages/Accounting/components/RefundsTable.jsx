import React, { useState } from 'react';
import {
  RotateCcw,
  Download,
  Plus,
  Search,
  CheckCircle2,
  Receipt,
  CornerUpLeft
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { exportToCsv } from '../../../utils/exportCsv';
import Modal from '../../../components/common/Modal';
import { FormInput, FormSelect, FormTextarea } from '../../../components/forms/FormInputs';

export default function RefundsTable({
  refunds = [],
  onAddRefund,
  onOpenReverseModal,
  drivers = []
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  const [newRefund, setNewRefund] = useState({
    driver: '',
    category: 'Security Deposit Refund',
    amount: '',
    method: 'Direct ACH Refund',
    reason: 'Vehicle lease concluded; deposit refunded.',
    date: new Date().toISOString().split('T')[0]
  });

  const filteredRefunds = refunds.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      (r.id && r.id.toLowerCase().includes(q)) ||
      (r.driver && r.driver.toLowerCase().includes(q)) ||
      (r.reason && r.reason.toLowerCase().includes(q)) ||
      (r.category && r.category.toLowerCase().includes(q))
    );
  });

  const handleCreateRefund = (e) => {
    e.preventDefault();
    if (!newRefund.driver || !newRefund.amount) return;

    const record = {
      id: `REF-${Math.floor(100 + Math.random() * 900)}`,
      driver: newRefund.driver,
      date: newRefund.date,
      category: newRefund.category,
      amount: Number(newRefund.amount),
      method: newRefund.method,
      reason: newRefund.reason,
      status: 'Processed',
      refNumber: `ACH-REF-${Math.floor(10000 + Math.random() * 90000)}`
    };

    onAddRefund(record);
    setIsIssueModalOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden space-y-4">
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#F8FAFC]">
        <div>
          <h3 className="font-bold text-[#0A1E42] text-sm flex items-center gap-2">
            <span>Customer &amp; Escrow Refunds Ledger</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-[#075EE8]">
              {filteredRefunds.length} Disbursements
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            Outward remittances for completed lease deposits, overpayment adjustments, and approved toll reimbursements
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToCsv('PrimeRoute_Refunds_Ledger', filteredRefunds)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" /> Export CSV
          </button>
          <button
            onClick={() => setIsIssueModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" /> Issue Refund
          </button>
        </div>
      </div>

      <div className="px-4 flex items-center justify-between">
        <div className="w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search refund ID, driver, reason..."
            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8]"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[880px]">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Refund ID</th>
              <th className="py-3 px-4">Driver / Recipient</th>
              <th className="py-3 px-4">Disbursement Date</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Method &amp; Ref #</th>
              <th className="py-3 px-4 text-right">Amount Refunded</th>
              <th className="py-3 px-4">Reason / Justification</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredRefunds.map((ref) => (
              <tr key={ref.id} className="hover:bg-blue-50/20 group">
                <td className="py-3.5 px-4 font-mono font-bold text-[#075EE8]">
                  {ref.id}
                </td>
                <td className="py-3.5 px-4 font-bold text-[#0A1E42]">
                  {ref.driver}
                </td>
                <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                  {formatDate(ref.date)}
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                    {ref.category}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <p className="font-semibold text-slate-800">{ref.method}</p>
                  <p className="font-mono text-[10px] text-slate-400">{ref.refNumber || 'N/A'}</p>
                </td>
                <td className="py-3.5 px-4 text-right font-extrabold text-rose-600 font-mono">
                  -{formatCurrency(ref.amount)}
                </td>
                <td className="py-3.5 px-4 text-slate-600 max-w-[220px] truncate" title={ref.reason}>
                  {ref.reason}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <StatusBadge status={ref.status} />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => onOpenReverseModal(ref)}
                    disabled={ref.status === 'Reversed' || ref.status === 'Reversed & Offset'}
                    title="Reverse / Correct Refund"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-600 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 transition-all cursor-pointer disabled:opacity-40"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reverse / Correct
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Issue Refund Modal */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        title="Disburse Customer / Driver Refund"
        subtitle="Issue return of escrow deposit or goodwill credit"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreateRefund} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Driver</label>
              <select
                value={newRefund.driver}
                onChange={(e) => setNewRefund({ ...newRefund, driver: e.target.value })}
                required
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
              >
                <option value="">-- Select driver --</option>
                {drivers.map((d) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
            <FormSelect
              label="Refund Category"
              value={newRefund.category}
              onChange={(e) => setNewRefund({ ...newRefund, category: e.target.value })}
              options={['Security Deposit Refund', 'Overpayment Return', 'Rental Rate Adjustment', 'Disputed Toll Refund']}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label="Refund Amount ($)"
              type="number"
              step="0.01"
              value={newRefund.amount}
              onChange={(e) => setNewRefund({ ...newRefund, amount: e.target.value })}
              placeholder="e.g. 500"
              required
            />
            <FormSelect
              label="Disbursement Method"
              value={newRefund.method}
              onChange={(e) => setNewRefund({ ...newRefund, method: e.target.value })}
              options={['Direct ACH Refund', 'Original Payment Method', 'Paper Check Issued']}
            />
          </div>

          <FormTextarea
            label="Reason & Justification"
            value={newRefund.reason}
            onChange={(e) => setNewRefund({ ...newRefund, reason: e.target.value })}
            placeholder="e.g. Lease finished, vehicle inspection passed without damage..."
            rows={2}
            required
          />

          <div className="flex justify-end gap-3 pt-3 border-t">
            <button
              type="button"
              onClick={() => setIsIssueModalOpen(false)}
              className="px-4 py-2 border rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md"
            >
              Issue Refund
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

