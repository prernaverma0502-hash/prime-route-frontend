import React, { useState } from 'react';
import {
  Plus,
  RotateCcw,
  Download,
  Search,
  CheckCircle2,
  Tag,
  DollarSign
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { exportToCsv } from '../../../utils/exportCsv';
import Modal from '../../../components/common/Modal';
import { FormInput, FormSelect, FormTextarea } from '../../../components/forms/FormInputs';

export default function CreditsAdjustmentsTable({
  credits = [],
  onAddCredit,
  onOpenReverseModal,
  drivers = []
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);

  const [newCredit, setNewCredit] = useState({
    driver: '',
    rental: 'RNT-2024-089',
    type: 'Goodwill Discount',
    amount: '',
    reason: '',
    approvedBy: 'Primary Admin'
  });

  const filteredCredits = credits.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      (c.id && c.id.toLowerCase().includes(q)) ||
      (c.driver && c.driver.toLowerCase().includes(q)) ||
      (c.reason && c.reason.toLowerCase().includes(q)) ||
      (c.type && c.type.toLowerCase().includes(q))
    );
  });

  const handleCreateCredit = (e) => {
    e.preventDefault();
    if (!newCredit.driver || !newCredit.amount) return;

    const record = {
      id: `CR-${Math.floor(100 + Math.random() * 900)}`,
      driver: newCredit.driver,
      rental: newCredit.rental,
      date: new Date().toISOString().split('T')[0],
      type: newCredit.type,
      amount: Number(newCredit.amount),
      reason: newCredit.reason,
      approvedBy: newCredit.approvedBy,
      status: 'Applied'
    };

    onAddCredit(record);
    setIsCreditModalOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden space-y-4">
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#F8FAFC]">
        <div>
          <h3 className="font-bold text-[#0A1E42] text-sm flex items-center gap-2">
            <span>Credits &amp; Adjustments Ledger</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
              {filteredCredits.length} Adjustments
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            Credit memos, rate adjustments, customer goodwill waivers, and billing corrections
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToCsv('PrimeRoute_Credits_Adjustments', filteredCredits)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" /> Export CSV
          </button>
          <button
            onClick={() => setIsCreditModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" /> Issue Credit / Adjustment
          </button>
        </div>
      </div>

      <div className="px-4 flex items-center justify-between">
        <div className="w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search credit ID, driver, reason..."
            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8]"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[880px]">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Credit ID</th>
              <th className="py-3 px-4">Driver / Client</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Adjustment Type</th>
              <th className="py-3 px-4 text-right">Credit Amount</th>
              <th className="py-3 px-4">Reason &amp; Justification</th>
              <th className="py-3 px-4">Approved By</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredCredits.map((c) => (
              <tr key={c.id} className="hover:bg-blue-50/20 group">
                <td className="py-3.5 px-4 font-mono font-bold text-[#075EE8]">
                  {c.id}
                </td>
                <td className="py-3.5 px-4 font-bold text-[#0A1E42]">
                  {c.driver}
                </td>
                <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                  {formatDate(c.date)}
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                    {c.type}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right font-extrabold text-emerald-600 font-mono">
                  +{formatCurrency(c.amount)}
                </td>
                <td className="py-3.5 px-4 text-slate-600 max-w-[240px] truncate" title={c.reason}>
                  {c.reason}
                </td>
                <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                  {c.approvedBy}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <StatusBadge status={c.status} />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => onOpenReverseModal(c)}
                    disabled={c.status === 'Reversed' || c.status === 'Reversed & Offset'}
                    title="Reverse / Correct Credit Memo"
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

      {/* Create Credit Modal */}
      <Modal
        isOpen={isCreditModalOpen}
        onClose={() => setIsCreditModalOpen(false)}
        title="Issue Credit Memo / Balance Adjustment"
        subtitle="Apply credit deduction to driver ledger or resolve billing dispute"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreateCredit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Driver</label>
              <select
                value={newCredit.driver}
                onChange={(e) => setNewCredit({ ...newCredit, driver: e.target.value })}
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
              label="Adjustment Type"
              value={newCredit.type}
              onChange={(e) => setNewCredit({ ...newCredit, type: e.target.value })}
              options={['Goodwill Discount', 'Credit Memo', 'Disputed Toll Waiver', 'Billing Correction', 'Rate Adjustment']}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label="Credit Amount ($)"
              type="number"
              step="0.01"
              value={newCredit.amount}
              onChange={(e) => setNewCredit({ ...newCredit, amount: e.target.value })}
              placeholder="e.g. 50.00"
              required
            />
            <FormInput
              label="Approved By"
              value={newCredit.approvedBy}
              onChange={(e) => setNewCredit({ ...newCredit, approvedBy: e.target.value })}
              required
            />
          </div>

          <FormTextarea
            label="Reason & Justification"
            value={newCredit.reason}
            onChange={(e) => setNewCredit({ ...newCredit, reason: e.target.value })}
            placeholder="e.g. Courtesy credit approved due to depot delayed inspection..."
            rows={2}
            required
          />

          <div className="flex justify-end gap-3 pt-3 border-t">
            <button
              type="button"
              onClick={() => setIsCreditModalOpen(false)}
              className="px-4 py-2 border rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#075EE8] text-white rounded-xl text-xs font-bold shadow-md"
            >
              Apply Credit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

