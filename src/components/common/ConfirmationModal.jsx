import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this action? This cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDanger = true
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center py-2">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
            isDanger ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
          }`}
        >
          {isDanger ? <Trash2 className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
        </div>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">{message}</p>
        <div className="flex items-center justify-end gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-sm ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-[#075EE8] hover:bg-[#0650C7]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

