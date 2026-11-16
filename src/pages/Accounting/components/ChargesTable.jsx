import React, { useState } from 'react';
import {
  Plus,
  RotateCcw,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Receipt
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { exportToCsv } from '../../../utils/exportCsv';
import Modal from '../../../components/common/Modal';
import { FormInput, FormSelect, FormTextarea } from '../../../components/forms/FormInputs';

export default function ChargesTable({
  charges = [],
  onAddCharge,
  onOpenReverseModal,
  drivers = [],
  rentals = []
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isAddChargeOpen, setIsAddChargeOpen] = useState(false);

  const [newCharge, setNewCharge] = useState({
    driver: '',
    rental: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Weekly Lease',
    description: '',
    amount: '',
    status: 'Posted'
  });

  const categories = ['All', 'Weekly Lease', 'Toll Charges', 'Toll & Fine Re-charge', 'Excess Mileage Fee', 'Cleaning Fee'];

  const filteredCharges = charges.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (c.id && c.id.toLowerCase().includes(q)) ||
      (c.driver && c.driver.toLowerCase().includes(q)) ||
      (c.description && c.description.toLowerCase().includes(q)) ||
      (c.category && c.category.toLowerCase().includes(q));

    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleExport = () => {
    exportToCsv('PrimeRoute_Charges_Ledger', filteredCharges);
  };

  const handleCreateCharge = (e) => {
    e.preventDefault();
    if (!newCharge.driver || !newCharge.amount) return;

    const record = {
      id: `CHG-${Math.floor(100 + Math.random() * 900)}`,
      driver: newCharge.driver,
      rental: newCharge.rental || 'RNT-2024-089',
      date: newCharge.date,
      category: newCharge.category,
      description: newCharge.description || `${newCharge.category} charge for ${newCharge.driver}`,
      amount: Number(newCharge.amount),
      status: 'Posted',
      qboRef: `QBO-CHG-${Math.floor(1000 + Math.random() * 9000)}`
    };

    onAddCharge(record);
    setIsAddChargeOpen(false);
    setNewCharge({
      driver: '',
      rental: '',
      date: new Date().toISOString().split('T')[0],
      category: 'Weekly Lease',
      description: '',
      amount: '',
      status: 'Posted'
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden space-y-4">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#F8FAFC]">
        <div>
          <h3 className="font-bold text-[#0A1E42] text-sm flex items-center gap-2">
            <span>Fleet Lease &amp; Operational Charges Ledger</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-[#075EE8]">
              {filteredCharges.length} Records
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            Separately itemized debit records for driver leases, excess mileage, toll reconciliations, and incidentals
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
            onClick={() => setIsAddChargeOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" /> Post New Charge
          </button>
        </div>
      </div>

      {/* Filter Chips & Search */}
      <div className="px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#075EE8] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search charge ID, driver, description..."
            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8]"
          />
        </div>
      </div>

      {/* Charges Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[880px]">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Charge ID</th>
              <th className="py-3 px-4">Driver / Debtor</th>
              <th className="py-3 px-4">Posting Date</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Accounting Sync</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredCharges.map((chg) => (
              <tr key={chg.id} className="hover:bg-blue-50/20 group">
                <td className="py-3.5 px-4 font-mono font-bold text-[#075EE8]">
                  {chg.id}
                </td>
                <td className="py-3.5 px-4 font-bold text-[#0A1E42]">
                  {chg.driver}
                </td>
                <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                  {formatDate(chg.date)}
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                    {chg.category}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-600 max-w-[260px] truncate" title={chg.description}>
                  {chg.description}
                </td>
                <td className="py-3.5 px-4 text-right font-extrabold text-[#0A1E42]">
                  {chg.amount < 0 ? (
                    <span className="text-rose-600">-{formatCurrency(Math.abs(chg.amount))}</span>
                  ) : (
                    formatCurrency(chg.amount)
                  )}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <StatusBadge status={chg.status} />
                </td>
                <td className="py-3.5 px-4 text-center text-[11px] font-mono text-slate-500">
                  {chg.qboRef || 'QBO-SYNC'}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => onOpenReverseModal(chg)}
                    disabled={chg.status === 'Reversed' || chg.status === 'Reversed & Offset'}
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

      {/* Add Charge Modal */}
      <Modal
        isOpen={isAddChargeOpen}
        onClose={() => setIsAddChargeOpen(false)}
        title="Post New Fleet Charge"
        subtitle="Itemize an operational debit to the driver or corporate account"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreateCharge} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Driver</label>
              <select
                value={newCharge.driver}
                onChange={(e) => setNewCharge({ ...newCharge, driver: e.target.value })}
                required
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
              >
                <option value="">-- Choose driver --</option>
                {drivers.map((d) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <FormSelect
              label="Charge Category"
              value={newCharge.category}
              onChange={(e) => setNewCharge({ ...newCharge, category: e.target.value })}
              options={['Weekly Lease', 'Toll Charges', 'Toll & Fine Re-charge', 'Excess Mileage Fee', 'Cleaning Fee']}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label="Charge Date"
              type="date"
              value={newCharge.date}
              onChange={(e) => setNewCharge({ ...newCharge, date: e.target.value })}
              required
            />
            <FormInput
              label="Amount ($)"
              type="number"
              step="0.01"
              value={newCharge.amount}
              onChange={(e) => setNewCharge({ ...newCharge, amount: e.target.value })}
              placeholder="e.g. 487.50"
              required
            />
          </div>

          <FormTextarea
            label="Line Item Description"
            value={newCharge.description}
            onChange={(e) => setNewCharge({ ...newCharge, description: e.target.value })}
            placeholder="e.g. Commercial weekly lease fee for unit PR-2024-TC..."
            rows={2}
          />

          <div className="flex justify-end gap-3 pt-3 border-t">
            <button
              type="button"
              onClick={() => setIsAddChargeOpen(false)}
              className="px-4 py-2 border rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#075EE8] text-white rounded-xl text-xs font-bold shadow-md"
            >
              Post Charge
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

