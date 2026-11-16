import React from 'react';
import Modal from '../../components/common/Modal';
import { Lock, ShieldAlert, AlertTriangle, Key } from 'lucide-react';

export default function RestrictedAccessModal({
  isOpen,
  onClose,
  document: doc,
  currentRole
}) {
  if (!doc) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Restricted Document – Access Locked"
      subtitle="Confidential Security Clearance Required"
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-center py-2">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <h4 className="text-sm font-extrabold text-[#0A1E42]">
            Access Denied for Role: <span className="text-amber-700 font-mono">{currentRole?.name || 'Standard Staff'}</span>
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed px-4">
            The document <strong className="text-slate-800">"{doc.name}"</strong> is flagged as confidential (payroll, corporate tax, legal settlement, or private driver PII). Under PrimeRoute data governance policies, only authorized <strong>Owner / Primary Admin</strong> and <strong>Finance</strong> administrators can view or download this file.
          </p>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-1 mx-2">
          <div className="flex justify-between">
            <span className="text-slate-400">Document ID:</span>
            <span className="font-mono font-bold text-slate-800">{doc.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Classification:</span>
            <span className="font-bold text-amber-700">Restricted / Executive Clearance</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Required Roles:</span>
            <span className="font-semibold text-slate-700">Owner, Secondary Admin, Finance</span>
          </div>
        </div>

        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </Modal>
  );
}

