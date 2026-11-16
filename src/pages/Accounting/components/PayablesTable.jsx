import React, { useState, useMemo } from 'react';
import {
  Plus,
  RotateCcw,
  Download,
  Search,
  CheckCircle2,
  AlertTriangle,
  Building2,
  DollarSign,
  Receipt,
  FileSpreadsheet
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { exportToCsv } from '../../../utils/exportCsv';
import Modal from '../../../components/common/Modal';
import { FormInput, FormSelect, FormTextarea } from '../../../components/forms/FormInputs';
import ExpensesTable from './ExpensesTable';
import { EXPENSE_CATEGORIES } from './ExpenseModal';

export default function PayablesTable({
  payables = [],
  expenses = [],
  onAddPayable,
  onApprovePayable,
  onMarkPayablePaid,
  onOpenReverseModal,
  onTraceAP,
  onOpenExpenseModal,
  onOpenApprovalModal,
  onOpenCorrectionModal,
  vendors = [],
  currentUser = { name: 'Sarah Jenkins (Finance)' }
}) {
  const [subView, setSubView] = useState('expenses'); // 'expenses' | 'bills'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddBillOpen, setIsAddBillOpen] = useState(false);

  const [newBill, setNewBill] = useState({
    vendor: 'Shell Fleet Solutions',
    category: 'other',
    invoiceNumber: '',
    billDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    amount: '',
    term: 'Net 20',
    notes: 'Operational fleet expense invoice.'
  });

  const filteredPayables = payables.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (p.id && p.id.toLowerCase().includes(q)) ||
      (p.vendor && p.vendor.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOutstandingAP = payables
    .filter((p) => p.status !== 'Paid')
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  // Duplicate check for bill modal (Requirement 4)
  const duplicateBillWarning = useMemo(() => {
    if (!newBill.vendor || (!newBill.invoiceNumber && !newBill.amount)) return null;
    const vendorLower = newBill.vendor.trim().toLowerCase();
    const invLower = newBill.invoiceNumber.trim().toLowerCase();
    const amt = Number(newBill.amount);

    return payables.find((p) => {
      const pVendor = (p.vendor || '').trim().toLowerCase();
      if (pVendor !== vendorLower) return false;
      if (invLower && p.invoiceNumber && p.invoiceNumber.trim().toLowerCase() === invLower) return true;
      if (amt > 0 && Number(p.amount) === amt && (p.billDate === newBill.billDate || p.date === newBill.billDate)) return true;
      return false;
    });
  }, [newBill.vendor, newBill.invoiceNumber, newBill.amount, newBill.billDate, payables]);

  const handleExport = () => {
    exportToCsv('PrimeRoute_Accounts_Payable_AP', filteredPayables);
  };

  const handleCreateBill = (e) => {
    e.preventDefault();
    if (!newBill.vendor || !newBill.amount) return;

    const selectedCat = EXPENSE_CATEGORIES.find((c) => c.id === newBill.category);

    const record = {
      id: `AP-${Math.floor(100 + Math.random() * 900)}`,
      vendor: newBill.vendor,
      category: selectedCat ? selectedCat.label.split(' (')[0] : newBill.category,
      invoiceNumber: newBill.invoiceNumber || `INV-${Math.floor(10000 + Math.random() * 90000)}`,
      billDate: newBill.billDate,
      dueDate: newBill.dueDate,
      amount: Number(newBill.amount),
      status: 'Pending Approval',
      term: newBill.term,
      notes: newBill.notes
    };

    onAddPayable(record);
    setIsAddBillOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Sub-view Switcher: Operating Expenses vs Vendor Bills */}
      <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-slate-100 shadow-2xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSubView('expenses')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subView === 'expenses'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Fleet Operating Expenses ({expenses.length})</span>
          </button>

          <button
            onClick={() => setSubView('bills')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subView === 'bills'
                ? 'bg-[#075EE8] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Vendor Bills &amp; Payables (AP) ({payables.length})</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 pr-2 text-[11px] text-slate-400 font-medium">
          <span>GL 5000/6000 Subledger Integration</span>
        </div>
      </div>

      {/* Render sub-view 1: Operating Expenses (with complete 16 categories, approval workflow, and duplicate detection) */}
      {subView === 'expenses' && (
        <ExpensesTable
          expenses={expenses}
          onOpenExpenseModal={onOpenExpenseModal}
          onOpenApprovalModal={onOpenApprovalModal}
          onOpenCorrectionModal={onOpenCorrectionModal}
          currentUser={currentUser}
        />
      )}

      {/* Render sub-view 2: Accounts Payable Bills */}
      {subView === 'bills' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden space-y-4">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#F8FAFC]">
            <div>
              <h3 className="font-bold text-[#0A1E42] text-sm flex items-center gap-2">
                <span>Accounts Payable (AP) &amp; Vendor Bills</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-[#075EE8]">
                  {filteredPayables.length} Bills
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Vendor liabilities, commercial fuel statements, repair shop work orders, and insurance premiums
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
                onClick={() => setIsAddBillOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" /> Enter Vendor Bill
              </button>
            </div>
          </div>

          {/* AP Summary Cards */}
          <div className="px-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              onClick={() => onTraceAP && onTraceAP('Accounts Payable (AP)', totalOutstandingAP, payables)}
              className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 text-xs cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all group"
              title="Click to trace all source AP bills"
            >
              <div className="flex items-center justify-between">
                <span className="text-[#075EE8] font-bold uppercase tracking-wider text-[10px]">
                  Total Accounts Payable (AP) Due
                </span>
                <span className="text-[10px] text-[#075EE8] font-semibold group-hover:underline">
                  🔍 Trace Source
                </span>
              </div>
              <span className="text-lg font-black text-[#071D49] font-mono block mt-1">
                {formatCurrency(totalOutstandingAP)}
              </span>
            </div>

            <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 text-xs">
              <span className="text-amber-800 font-bold uppercase tracking-wider text-[10px] block">
                Due Within 14 Days
              </span>
              <span className="text-lg font-black text-amber-950 font-mono block mt-1">
                {formatCurrency(
                  payables.filter((p) => p.status !== 'Paid').reduce((sum, p) => sum + Number(p.amount || 0), 0)
                )}
              </span>
              <span className="text-[10px] text-amber-700">Scheduled for payment batch</span>
            </div>

            <div className="p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs">
              <span className="text-emerald-800 font-bold uppercase tracking-wider text-[10px] block">
                Settled / Paid MTD
              </span>
              <span className="text-lg font-black text-emerald-950 font-mono block mt-1">
                {formatCurrency(
                  payables.filter((p) => p.status === 'Paid').reduce((sum, p) => sum + Number(p.amount || 0), 0)
                )}
              </span>
              <span className="text-[10px] text-emerald-700">Auto-debit &amp; wire releases</span>
            </div>
          </div>

          {/* Filter Tabs & Search */}
          <div className="px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {['All', 'Approved for Payment', 'Pending Approval', 'Paid'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    statusFilter === tab
                      ? 'bg-[#075EE8] text-white shadow-2xs font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-64">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search vendor, bill ID, category..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8]"
                />
              </div>
            </div>
          </div>

          {/* AP Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[880px]">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Bill ID</th>
                  <th className="py-3 px-4">Vendor / Payee</th>
                  <th className="py-3 px-4">Expense Category</th>
                  <th className="py-3 px-4">Bill Date</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Bill Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredPayables.map((bill) => (
                  <tr key={bill.id} className="hover:bg-blue-50/20 group">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#075EE8]">
                      {bill.id}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#0A1E42]">
                      {bill.vendor}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {bill.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {formatDate(bill.billDate || bill.date)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {formatDate(bill.dueDate)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-[#0A1E42]">
                      {formatCurrency(bill.amount)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={bill.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {bill.status === 'Pending Approval' && (
                          <button
                            onClick={() => onApprovePayable(bill.id)}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold shadow-2xs cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                        {bill.status === 'Approved for Payment' && (
                          <button
                            onClick={() => onMarkPayablePaid(bill.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-2xs cursor-pointer"
                          >
                            Pay Bill
                          </button>
                        )}
                        <button
                          onClick={() => onOpenReverseModal(bill)}
                          disabled={bill.status === 'Reversed' || bill.status === 'Reversed & Offset'}
                          title="Reverse / Correct Vendor Bill"
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
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

          {/* Enter Bill Modal */}
          <Modal
            isOpen={isAddBillOpen}
            onClose={() => setIsAddBillOpen(false)}
            title="Enter Accounts Payable Vendor Bill"
            subtitle="Log vendor invoice for fuel, insurance, parts, or vehicle maintenance"
            maxWidth="max-w-xl"
          >
            <form onSubmit={handleCreateBill} className="space-y-4">
              {duplicateBillWarning && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-center gap-2 text-xs text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Warning: An existing bill ({duplicateBillWarning.id}) for {duplicateBillWarning.vendor} with matching details already exists.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  label="Vendor / Creditor Name"
                  value={newBill.vendor}
                  onChange={(e) => setNewBill({ ...newBill, vendor: e.target.value })}
                  required
                />
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Expense Category (Controlled List)
                  </label>
                  <select
                    value={newBill.category}
                    onChange={(e) => setNewBill({ ...newBill, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8]"
                  >
                    {EXPENSE_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label.split(' (')[0]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <FormInput
                  label="Bill Date"
                  type="date"
                  value={newBill.billDate}
                  onChange={(e) => setNewBill({ ...newBill, billDate: e.target.value })}
                  required
                />
                <FormInput
                  label="Due Date"
                  type="date"
                  value={newBill.dueDate}
                  onChange={(e) => setNewBill({ ...newBill, dueDate: e.target.value })}
                  required
                />
                <FormInput
                  label="Bill Amount ($)"
                  type="number"
                  step="0.01"
                  value={newBill.amount}
                  onChange={(e) => setNewBill({ ...newBill, amount: e.target.value })}
                  placeholder="e.g. 1450"
                  required
                />
              </div>

              <FormInput
                label="Invoice # / Reference"
                value={newBill.invoiceNumber}
                onChange={(e) => setNewBill({ ...newBill, invoiceNumber: e.target.value })}
                placeholder="e.g. INV-90281"
              />

              <FormTextarea
                label="Bill Memo / Invoice Reference"
                value={newBill.notes}
                onChange={(e) => setNewBill({ ...newBill, notes: e.target.value })}
                rows={2}
              />

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddBillOpen(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#075EE8] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Post Payable
                </button>
              </div>
            </form>
          </Modal>
        </div>
      )}
    </div>
  );
}
