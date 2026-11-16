import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import Modal from '../../../components/common/Modal';

export default function SubmissionSuccessModal({
  isOpen,
  onClose,
  paperworkData,
  formData,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Paperwork Submitted Successfully"
      subtitle="Your onboarding paperwork has been securely transmitted for review"
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-center py-2">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div>
          <h3 className="text-lg font-black text-[#0A1E42]">Paperwork Received!</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Submission ID: <strong className="font-mono text-slate-800">{paperworkData.submissionId}</strong>
          </p>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Your personal information, employment records, tax forms, and digital signature have been recorded. Status has been updated to <strong>Pending Review</strong>.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-left text-xs space-y-1.5 text-slate-600">
          <div className="flex justify-between">
            <span className="text-slate-400">Employee:</span>
            <strong className="text-slate-700">{formData.personal.firstName} {formData.personal.lastName}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Position:</span>
            <span className="font-medium">{formData.employment.position}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Submitted At:</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#075EE8] hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          Done
        </button>
      </div>
    </Modal>
  );
}

