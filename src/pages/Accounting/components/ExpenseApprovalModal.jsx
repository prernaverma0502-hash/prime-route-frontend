import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import Modal from '../../../components/common/Modal';
import { formatCurrency, formatDate } from '../../../utils/formatters';

export default function ExpenseApprovalModal({
  isOpen,
  onClose,
  expense,
  actionType = 'approve', // 'approve' | 'reject'
  onConfirm,
  currentUser = { name: 'Sarah Jenkins (Finance Controller)' }
}) {
  const [approverName, setApproverName] = useState(currentUser?.name || 'Sarah Jenkins (Finance Controller)');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setApproverName(currentUser?.name || 'Sarah Jenkins (Finance Controller)');
      setComment(
        actionType === 'approve'
          ? 'Approved after matching itemized vendor receipt and vehicle service record.'
          : ''
      );
      setError('');
    }
  }, [isOpen, actionType, currentUser]);

  if (!expense) return null;

  const isApprove = actionType === 'approve';

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!approverName.trim()) {
      setError('Approver name is required.');
      return;
    }
    if (!isApprove && !comment.trim()) {
      setError('A rejection reason / comment is required when rejecting an expense.');
      return;
    }

    onConfirm({
      id: expense.id,
      status: isApprove ? 'Approved' : 'Rejected',
      approvedBy: approverName.trim(),
      approvalComment: comment.trim(),
      approvalDate: new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isApprove ? 'Authorize Fleet Expense' : 'Reject Fleet Expense'}
      subtitle={
        isApprove
          ? 'Confirm managerial approval and log formal approver signature'
          : 'Document rejection justification for auditor review and originator notification'
      }
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleConfirm} className="space-y-4">
        {/* Expense Summary Box */}
        <div className={`p-4 rounded-xl border ${isApprove ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/60 border-rose-200'} text-xs space-y-2`}>
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-slate-800 text-sm">{expense.id}</span>
            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${isApprove ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
              Pending Decision
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1 border-t border-slate-200/60">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Vendor</span>
              <strong className="text-slate-800">{expense.vendor}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Amount</span>
              <strong className="text-slate-900 font-mono text-sm">{formatCurrency(expense.amount)}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Category</span>
              <span>{expense.displayCategory || expense.category}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Date</span>
              <span className="font-mono">{formatDate(expense.date)}</span>
            </div>
          </div>

          <div className="text-slate-600 pt-1 border-t border-slate-200/60">
            <span className="text-[10px] text-slate-400 block uppercase">Scope / Description</span>
            <span className="font-medium text-slate-800">{expense.description} ({expense.vehicle})</span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Approver Name */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Approver Name &amp; Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={approverName}
            onChange={(e) => setApproverName(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8] font-medium"
            required
          />
        </div>

        {/* Comment */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            {isApprove ? 'Approval Notes / Verification Remarks' : 'Rejection Reason (Required)'}{' '}
            {!isApprove && <span className="text-rose-500">*</span>}
          </label>
          <textarea
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={
              isApprove
                ? 'e.g. Receipt verified, work order matched, expense approved for disbursement'
                : 'e.g. Missing detailed receipt; duplicate labor charge; please resubmit with work order'
            }
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8]"
            required={!isApprove}
          />
        </div>

        {/* Modal Buttons */}
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
            className={`px-5 py-2.5 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer active:scale-95 flex items-center gap-2 ${
              isApprove
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
            }`}
          >
            {isApprove ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            <span>{isApprove ? 'Confirm Approval' : 'Confirm Rejection'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}

