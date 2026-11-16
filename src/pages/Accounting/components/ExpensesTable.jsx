import React, { useState } from 'react';
import {
  Download,
  Plus,
  Search,
  Filter,
  FileText,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Eye,
  AlertTriangle,
  Receipt,
  Building2,
  Clock,
  ExternalLink
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { exportToCsv } from '../../../utils/exportCsv';
import Can from '../../../auth/Can';
import Modal from '../../../components/common/Modal';
import { EXPENSE_CATEGORIES } from './ExpenseModal';

export default function ExpensesTable({
  expenses = [],
  onOpenExpenseModal,
  onOpenApprovalModal,
  onOpenCorrectionModal,
  currentUser = { name: 'Sarah Jenkins (Finance)' }
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewingReceipt, setViewingReceipt] = useState(null);

  const filteredExpenses = expenses.filter((exp) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (exp.id && exp.id.toLowerCase().includes(q)) ||
      (exp.vendor && exp.vendor.toLowerCase().includes(q)) ||
      (exp.description && exp.description.toLowerCase().includes(q)) ||
      (exp.vehicle && exp.vehicle.toLowerCase().includes(q)) ||
      (exp.invoiceNumber && exp.invoiceNumber.toLowerCase().includes(q)) ||
      (exp.category && exp.category.toLowerCase().includes(q));

    const matchesCategory = categoryFilter === 'All' || exp.category === categoryFilter;
    const matchesStatus =
      statusFilter === 'All' ||
      exp.status === statusFilter ||
      (statusFilter === 'Pending' && (exp.status === 'Pending' || exp.status === 'Pending Approval'));

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalFilteredAmount = filteredExpenses.reduce(
    (sum, exp) => sum + Number(exp.amount || 0),
    0
  );

  const pendingApprovalCount = expenses.filter(
    (e) => e.status === 'Pending' || e.status === 'Pending Approval'
  ).length;

  const handleExport = () => {
    exportToCsv('PrimeRoute_Operating_Expenses', filteredExpenses);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden space-y-4">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F8FAFC]">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-[#0A1E42] text-sm">Fleet Operating Expenses &amp; Ledger</h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700">
              {filteredExpenses.length} Records
            </span>
            {pendingApprovalCount > 0 && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 animate-pulse">
                ⚡ {pendingApprovalCount} Awaiting Approval
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            16 Controlled categories, duplicate invoice prevention, manager approval workflow, and immutable correction logs
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" /> Export CSV
          </button>
          <Can module="accounting" do="add">
            <button
              onClick={onOpenExpenseModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" /> Log Operating Expense
            </button>
          </Can>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="px-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-rose-50/70 rounded-xl border border-rose-200 text-xs">
          <span className="text-rose-800 font-bold uppercase tracking-wider text-[10px] block">
            Total Filtered Expenses
          </span>
          <span className="text-lg font-black text-rose-950 font-mono block mt-1">
            {formatCurrency(totalFilteredAmount)}
          </span>
          <span className="text-[10px] text-rose-700 font-medium">Sum of visible expense line items</span>
        </div>

        <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200 text-xs">
          <span className="text-amber-800 font-bold uppercase tracking-wider text-[10px] block">
            Pending Manager Review
          </span>
          <span className="text-lg font-black text-amber-950 font-mono block mt-1">
            {formatCurrency(
              expenses
                .filter((e) => e.status === 'Pending' || e.status === 'Pending Approval')
                .reduce((sum, e) => sum + Number(e.amount || 0), 0)
            )}
          </span>
          <span className="text-[10px] text-amber-700 font-medium">{pendingApprovalCount} vouchers awaiting sign-off</span>
        </div>

        <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs">
          <span className="text-emerald-800 font-bold uppercase tracking-wider text-[10px] block">
            Authorized &amp; Paid MTD
          </span>
          <span className="text-lg font-black text-emerald-950 font-mono block mt-1">
            {formatCurrency(
              expenses
                .filter((e) => e.status === 'Approved' || e.status === 'Paid')
                .reduce((sum, e) => sum + Number(e.amount || 0), 0)
            )}
          </span>
          <span className="text-[10px] text-emerald-700 font-medium">Reconciled to general ledger</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="px-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Status Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {['All', 'Approved', 'Pending', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                statusFilter === status
                  ? 'bg-rose-600 text-white shadow-2xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Category Dropdown and Search Input */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="w-full sm:w-48">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium text-slate-700"
            >
              <option value="All">All Categories (16)</option>
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label.split(' (')[0]}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-60">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vendor, ID, invoice..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[960px]">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Expense ID</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Scope / Vehicle</th>
              <th className="py-3 px-4">Vendor &amp; Invoice #</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4 text-center">Receipt</th>
              <th className="py-3 px-4">Status &amp; Sign-off</th>
              <th className="py-3 px-4 text-right">Manager Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan="10" className="py-12 text-center text-slate-400">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold">No expenses match the current filters.</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Try adjusting the search query or category filters.
                  </p>
                </td>
              </tr>
            ) : (
              filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-rose-50/20 transition-colors group">
                  {/* Expense ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-rose-600">
                    {exp.id}
                    {exp.isCorrected && (
                      <span
                        title={`Corrected on ${exp.correctedAt ? formatDate(exp.correctedAt) : 'recently'}: ${exp.correctionReason}`}
                        className="ml-1.5 px-1.5 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-800 rounded inline-block cursor-help"
                      >
                        Corrected
                      </span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                    {formatDate(exp.date)}
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 uppercase tracking-wider inline-block">
                      {exp.displayCategory || exp.category}
                    </span>
                  </td>

                  {/* Scope / Vehicle */}
                  <td className="py-3.5 px-4 text-slate-700">
                    <span className="font-semibold block">{exp.vehicle || 'Fleet Wide'}</span>
                    {exp.relatedDriver && exp.relatedDriver !== 'None / Fleet Wide' && (
                      <span className="text-[10px] text-slate-400 block">Driver: {exp.relatedDriver}</span>
                    )}
                  </td>

                  {/* Vendor & Invoice # */}
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#0A1E42] block">{exp.vendor}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {exp.invoiceNumber ? `Inv: ${exp.invoiceNumber}` : 'Direct Receipt'}
                    </span>
                  </td>

                  {/* Description */}
                  <td className="py-3.5 px-4 text-slate-600 max-w-[200px] truncate" title={exp.description}>
                    <span>{exp.description}</span>
                    {exp.paymentMethod && (
                      <span className="text-[10px] text-slate-400 block font-medium">
                        Via {exp.paymentMethod}
                      </span>
                    )}
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 text-right font-extrabold text-rose-600 font-mono">
                    -{formatCurrency(exp.amount)}
                  </td>

                  {/* Receipt Voucher */}
                  <td className="py-3.5 px-4 text-center">
                    {exp.invoiceReceiptUrl ? (
                      <button
                        onClick={() => setViewingReceipt(exp)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 text-[#075EE8] rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                        title="View uploaded voucher"
                      >
                        <Receipt className="w-3 h-3" />
                        <span>View</span>
                      </button>
                    ) : (
                      <span className="text-slate-300 text-[10px]">—</span>
                    )}
                  </td>

                  {/* Status & Approver */}
                  <td className="py-3.5 px-4">
                    <StatusBadge status={exp.status} />
                    {exp.approvedBy && (
                      <span className="block text-[10px] text-slate-400 mt-0.5 truncate max-w-[130px]" title={exp.approvedBy}>
                        By: {exp.approvedBy}
                      </span>
                    )}
                    {exp.approvalComment && (
                      <span className="block text-[9px] text-slate-400 italic truncate max-w-[130px]" title={exp.approvalComment}>
                        "{exp.approvalComment}"
                      </span>
                    )}
                  </td>

                  {/* Manager Action */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Approval Workflow Buttons (Requirement 3: Protected by <Can module="accounting" do="approve">) */}
                      {exp.status === 'Pending' || exp.status === 'Pending Approval' ? (
                        <Can
                          module="accounting"
                          do="approve"
                          showApprovalNotice={true}
                          fallback={
                            <span className="text-[11px] text-slate-400 font-medium">Pending Review</span>
                          }
                        >
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onOpenApprovalModal && onOpenApprovalModal(exp, 'approve')}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg shadow-2xs transition-all cursor-pointer flex items-center gap-1"
                              title="Authorize this expense"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => onOpenApprovalModal && onOpenApprovalModal(exp, 'reject')}
                              className="px-2 py-1 bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-600 font-bold text-[10px] rounded-lg transition-all cursor-pointer"
                              title="Reject with comment"
                            >
                              <XCircle className="w-3 h-3" />
                            </button>
                          </div>
                        </Can>
                      ) : null}

                      {/* Requirement 5: "Correct" Action (Never silent edit or delete) */}
                      <button
                        onClick={() => onOpenCorrectionModal && onOpenCorrectionModal(exp)}
                        className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                        title="Correct this expense with documented reason (Financial Audit Compliance)"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Receipt Voucher Viewer Modal */}
      {viewingReceipt && (
        <Modal
          isOpen={!!viewingReceipt}
          onClose={() => setViewingReceipt(null)}
          title={`Expense Voucher Receipt: ${viewingReceipt.id}`}
          subtitle={`Uploaded document for ${viewingReceipt.vendor} (${formatCurrency(viewingReceipt.amount)})`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-[#075EE8] shadow-sm">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-[#0A1E42] text-sm">
                  {viewingReceipt.invoiceReceiptUrl || 'receipt_scanned.pdf'}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Attached to invoice {viewingReceipt.invoiceNumber || 'Direct Payment'}
                </p>
              </div>

              <div className="w-full bg-white p-3 rounded-xl border border-slate-200 text-left text-xs space-y-1.5">
                <div className="flex justify-between text-slate-500">
                  <span>Vendor:</span>
                  <span className="font-bold text-slate-800">{viewingReceipt.vendor}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Expense Amount:</span>
                  <span className="font-extrabold text-rose-600 font-mono">
                    {formatCurrency(viewingReceipt.amount)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Category:</span>
                  <span className="font-medium text-slate-800">
                    {viewingReceipt.displayCategory || viewingReceipt.category}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Authorized By:</span>
                  <span className="font-medium text-slate-800">
                    {viewingReceipt.approvedBy || 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setViewingReceipt(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Close Voucher
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
