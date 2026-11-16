import React, { useState, useEffect } from 'react';
import Modal from '../../../components/common/Modal';
import { FileCheck, Calendar, ShieldCheck, UploadCloud, AlertCircle } from 'lucide-react';

export default function RenewComplianceModal({
  isOpen,
  onClose,
  onSave,
  item = null
}) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Vehicle Registration',
    entityName: '',
    identifier: '',
    authority: '',
    expiryDate: '',
    documentFile: '',
    notes: ''
  });

  useEffect(() => {
    if (item) {
      setFormData({
        ...item,
        expiryDate: item.expiryDate || new Date().toISOString().split('T')[0],
        documentFile: item.documentFile || 'renewed_document_voucher.pdf'
      });
    }
  }, [item, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!item) return;

    // Calculate days remaining
    const today = new Date();
    const expiry = new Date(formData.expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let status = 'Compliant (>30 days)';
    if (diffDays <= 7) {
      status = 'Critical (≤7 days)';
    } else if (diffDays <= 14) {
      status = 'Expiring Soon (≤14 days)';
    } else if (diffDays <= 30) {
      status = 'Upcoming (≤30 days)';
    }

    onSave({
      ...item,
      ...formData,
      daysRemaining: Math.max(0, diffDays),
      status
    });
    onClose();
  };

  if (!item) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Renew Compliance Document – ${item.title}`}
      subtitle={`Extend regulatory validity for ${item.entityName} (${item.identifier || item.category})`}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
        <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(85vh-140px)]">
          <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-2xl flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#0A1E42]">{item.title}</p>
              <p className="text-[11px] text-slate-500">
                Entity: <strong>{item.entityName}</strong> • Authority: <strong>{item.authority}</strong>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                New Regulatory Expiry Date *
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData((p) => ({ ...p, expiryDate: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Issuing Regulatory Authority
              </label>
              <input
                type="text"
                value={formData.authority}
                onChange={(e) => setFormData((p) => ({ ...p, authority: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Certificate / Decal / Permit Identifier #
            </label>
            <input
              type="text"
              value={formData.identifier}
              onChange={(e) => setFormData((p) => ({ ...p, identifier: e.target.value }))}
              placeholder="e.g. REG-NY-991204"
              className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl bg-white"
            />
          </div>

          {/* Document Upload Simulation */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Renewed Document / Decal Voucher File
            </label>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 truncate">
                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-mono text-slate-700 truncate">{formData.documentFile}</span>
              </div>
              <input
                type="text"
                value={formData.documentFile}
                onChange={(e) => setFormData((p) => ({ ...p, documentFile: e.target.value }))}
                placeholder="filename.pdf"
                className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-white w-48 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Renewal Verification Notes
            </label>
            <textarea
              rows="2"
              value={formData.notes}
              onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
              placeholder="e.g. Paid online via DMV portal; official sticker verified on windshield."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#F8FAFC] border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            Confirm Document Renewal
          </button>
        </div>
      </form>
    </Modal>
  );
}

