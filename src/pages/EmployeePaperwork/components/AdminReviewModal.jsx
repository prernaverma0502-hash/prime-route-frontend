import React from 'react';
import Modal from '../../../components/common/Modal';

export default function AdminReviewModal({
  isOpen,
  action,
  adminNotes,
  onAdminNotesChange,
  onClose,
  onConfirmApprove,
  onConfirmReject,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={action === 'Approve' ? 'Approve Employee Paperwork' : 'Request Paperwork Revisions'}
      subtitle="Simulate compliance officer review decision"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <p className="text-xs text-slate-600">
          {action === 'Approve'
            ? 'Approving this paperwork will set the employee status to Approved and certify their credentials for active fleet operations.'
            : 'Rejecting this paperwork will notify the employee with the feedback provided below.'}
        </p>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Reviewer Notes / Feedback:
          </label>
          <textarea
            rows={3}
            value={adminNotes}
            onChange={(e) => onAdminNotesChange(e.target.value)}
            className="w-full p-3 rounded-xl text-xs border border-slate-200 focus:border-[#075EE8] focus:outline-hidden"
            placeholder="Enter feedback notes for the employee..."
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={action === 'Approve' ? onConfirmApprove : onConfirmReject}
            className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs cursor-pointer ${
              action === 'Approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
            }`}
          >
            Confirm {action}
          </button>
        </div>
      </div>
    </Modal>
  );
}

