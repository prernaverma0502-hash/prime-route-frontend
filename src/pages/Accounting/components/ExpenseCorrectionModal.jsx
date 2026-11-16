import React, { useState, useEffect } from 'react';
import { RotateCcw, AlertTriangle, ShieldAlert, CheckCircle2, FileEdit } from 'lucide-react';
import Modal from '../../../components/common/Modal';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { EXPENSE_CATEGORIES } from './ExpenseModal';

export default function ExpenseCorrectionModal({
  isOpen,
  onClose,
  expense,
  onConfirmCorrection,
  currentUser = { name: 'John Doe (Admin)' }
}) {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    vendor: '',
    description: '',
    date: '',
    correctionReason: '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (expense && isOpen) {
      setFormData({
        amount: expense.amount || '',
        category: expense.category || 'repairs',
        vendor: expense.vendor || '',
        description: expense.description || '',
        date: expense.date || new Date().toISOString().split('T')[0],
        correctionReason: '',
      });
      setError('');
    }
  }, [expense, isOpen]);

  if (!expense) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.correctionReason.trim()) {
      setError('A specific reason for correction is mandatory to maintain general ledger compliance.');
      return;
    }

    const previousValues = {
      amount: expense.amount,
      category: expense.category,
      vendor: expense.vendor,
      description: expense.description,
      date: expense.date,
    };

    const selectedCat = EXPENSE_CATEGORIES.find((c) => c.id === formData.category);

    const updatedExpense = {
      ...expense,
      amount: Number(formData.amount),
      category: formData.category,
      displayCategory: selectedCat ? selectedCat.label.split(' (')[0] : formData.category,
      vendor: formData.vendor,
      description: formData.description,
      date: formData.date,
      isCorrected: true,
      correctedAt: new Date().toISOString(),
      correctedBy: currentUser?.name || 'Authorized Auditor',
      correctionReason: formData.correctionReason.trim(),
      previousValues,
      // If amount or critical info changed, place in pending review or update audit
      notes: `${expense.notes ? expense.notes + ' | ' : ''}Corrected on ${new Date().toLocaleDateString()} by ${currentUser?.name || 'Admin'}: "${formData.correctionReason.trim()}". Prior amount: ${formatCurrency(expense.amount)}.`
    };

    onConfirmCorrection(updatedExpense);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Correct Operating Expense Record"
      subtitle="Immutable accounting policy: Direct deletion or silent edits are prohibited. Corrections require documented rationale."
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Compliance Alert */}
        <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-3 text-xs text-amber-950">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-extrabold text-amber-900">
              Audited Correction Entry for {expense.id}
            </p>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Modifying financial records creates an indelible audit entry. The original submission values will be archived alongside your stated reason and user timestamp.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Current Record Info */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs grid grid-cols-3 gap-2">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Original Amount</span>
            <strong className="text-slate-800 font-mono">{formatCurrency(expense.amount)}</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Original Vendor</span>
            <strong className="text-slate-800">{expense.vendor}</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Original Date</span>
            <strong className="text-slate-800 font-mono">{formatDate(expense.date)}</strong>
          </div>
        </div>

        {/* Fields To Correct */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Corrected Amount ($ USD) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8] font-mono font-bold text-[#0A1E42]"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Corrected Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8]"
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Corrected Vendor Name
            </label>
            <input
              type="text"
              value={formData.vendor}
              onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8]"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Corrected Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8]"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Corrected Description
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8]"
            required
          />
        </div>

        {/* Mandatory Reason */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Mandatory Reason for Correction <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows="3"
            value={formData.correctionReason}
            onChange={(e) => setFormData({ ...formData, correctionReason: e.target.value })}
            placeholder="Explain why this expense is being modified (e.g. 'Vendor amended billing from $820 to $680 after warranty credit applied', 'Reclassified from repairs to routine oil change')"
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8]"
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-600/20 transition-all cursor-pointer active:scale-95 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Apply Audited Correction</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}

