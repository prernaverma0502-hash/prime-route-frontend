import React, { useState } from 'react';
import {
  RotateCcw,
  AlertTriangle,
  FileX,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Lock
} from 'lucide-react';
import Modal from '../../../components/common/Modal';
import { FormInput, FormTextarea } from '../../../components/forms/FormInputs';
import { formatCurrency, formatDate } from '../../../utils/formatters';

export default function ReverseTransactionModal({
  isOpen,
  onClose,
  transaction,
  onConfirmReversal
}) {
  const [reason, setReason] = useState('');
  const [reversalDate, setReversalDate] = useState(new Date().toISOString().split('T')[0]);
  const [authorizedBy, setAuthorizedBy] = useState('John Doe (Finance Admin)');
  const [error, setError] = useState('');

  if (!isOpen || !transaction) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('A valid business reason is mandatory to reverse or correct a posted transaction.');
      return;
    }

    const linkedCorrection = {
      id: `REV-${transaction.id}`,
      originalTxId: transaction.id,
      date: reversalDate,
      type: 'Reversal / Linked Correction',
      entity: transaction.driver || transaction.customer || transaction.vendor || 'Authorized Entity',
      description: `Reversal of ${transaction.id}: ${reason.trim()}`,
      amount: -Math.abs(Number(transaction.amount || transaction.total || 0)),
      reason: reason.trim(),
      authorizedBy: authorizedBy,
      status: 'Reversed & Offset',
      syncStatus: 'Pending Sync to QBO'
    };

    onConfirmReversal(transaction, linkedCorrection);
    setReason('');
    setError('');
    onClose();
  };

  const amountVal = Math.abs(Number(transaction.amount || transaction.total || 0));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Reverse / Correct Transaction: ${transaction.id}`}
      subtitle="Audit Compliance: Posted ledger records cannot be deleted. Create an offsetting linked correction."
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Accounting Rule Notice */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-900 text-xs">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Permanent Ledger Immutability Enforced</p>
            <p className="text-amber-800 leading-relaxed">
              Standard accounting practices prohibit deleting posted records. Submitting this form will flag <strong>{transaction.id}</strong> as <em>Reversed</em> and automatically generate linked entry <strong>REV-{transaction.id}</strong> ({formatCurrency(-amountVal)}) to maintain an audit trail.
            </p>
          </div>
        </div>

        {/* Transaction Summary Box */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-500 pb-1 border-b border-slate-200/80">
            <span className="font-bold uppercase tracking-wider text-[11px]">Original Transaction</span>
            <span className="font-mono font-bold text-[#075EE8]">{transaction.id}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-slate-700">
            <div>
              <span className="text-slate-400 block text-[10px]">Date</span>
              <span className="font-semibold">{formatDate(transaction.date || transaction.dueDate)}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Entity / Driver</span>
              <span className="font-semibold truncate block">
                {transaction.driver || transaction.customer || transaction.vendor || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Original Amount</span>
              <span className="font-extrabold text-[#0A1E42]">{formatCurrency(amountVal)}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Current Status</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-[#075EE8]">
                {transaction.status || 'Posted'}
              </span>
            </div>
          </div>
        </div>

        {/* Reversal Form Fields */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormInput
              label="Reversal Effective Date"
              type="date"
              value={reversalDate}
              onChange={(e) => setReversalDate(e.target.value)}
              required
            />
            <FormInput
              label="Authorized Finance Officer"
              value={authorizedBy}
              onChange={(e) => setAuthorizedBy(e.target.value)}
              required
            />
          </div>

          <FormTextarea
            label="Mandatory Reason for Reversal / Correction"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g. Duplicate charge entered by dispatch; customer rate renegotiated; bank chargeback adjustment..."
            rows={3}
            required
            error={error}
          />
        </div>

        {/* Linked Entry Preview */}
        <div className="p-3 bg-slate-100/80 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-rose-500" />
            <span className="text-slate-600">Generated Linked Offset:</span>
            <span className="font-mono font-bold text-rose-600">REV-{transaction.id}</span>
          </div>
          <span className="font-extrabold text-rose-600 font-mono">
            -{formatCurrency(amountVal)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-md shadow-rose-600/25 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Post Reversal &amp; Correction
          </button>
        </div>
      </form>
    </Modal>
  );
}

