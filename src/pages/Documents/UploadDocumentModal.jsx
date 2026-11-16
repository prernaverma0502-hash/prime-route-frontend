import React, { useState, useRef } from 'react';
import Modal from '../../components/common/Modal';
import {
  UploadCloud,
  Camera,
  CheckCircle2,
  Lock,
  Link2,
  FileText,
  Calendar,
  AlertCircle,
  X
} from 'lucide-react';
import {
  mockVehicles,
  mockDrivers,
  initialRentals,
  initialExpenses,
  initialAccidents
} from '../../data/mockData';
import { useRole } from '../../context/RoleContext';

const CONTROLLED_TYPES = [
  { value: 'title', label: 'Certificate of Title' },
  { value: 'registration', label: 'Vehicle Registration' },
  { value: 'license', label: 'Driver / Commercial License' },
  { value: 'contract', label: 'Rental / Lease Contract' },
  { value: 'inspection', label: 'Inspection Checklist / DOT' },
  { value: 'receipt', label: 'Expense / Fuel Receipt' },
  { value: 'invoice', label: 'Vendor / Repair Invoice' },
  { value: 'insurance', label: 'Insurance Policy / COI' },
  { value: 'accident record', label: 'Accident / Police Report' },
  { value: 'toll/ticket', label: 'Toll Citation / Violation' },
  { value: 'other', label: 'Other Regulatory / Legal' },
];

export default function UploadDocumentModal({
  isOpen,
  onClose,
  onSave
}) {
  const { activeRole } = useRole();
  const cameraInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'registration',
    recordCategory: 'Vehicle',
    selectedRecordId: mockVehicles[0]?.id || 'VEH-001',
    expiryDate: '2026-07-31',
    isPermanent: false,
    version: 'v1.0',
    notes: '',
    isRestricted: false,
    file: null,
    fileName: 'vehicle_registration_scan.pdf',
    fileSize: '1.8 MB',
    fileType: 'PDF'
  });

  const [isDragging, setIsDragging] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const extension = file.name.split('.').pop()?.toUpperCase() || 'PDF';
      setFormData((prev) => ({
        ...prev,
        file,
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        fileType: extension,
        name: prev.name || file.name.replace(/\.[^/.]+$/, '')
      }));
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const extension = file.name.split('.').pop()?.toUpperCase() || 'PDF';
      setFormData((prev) => ({
        ...prev,
        file,
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        fileType: extension,
        name: prev.name || file.name.replace(/\.[^/.]+$/, '')
      }));
    }
  };

  const handleCameraSnap = () => {
    // Simulated mobile camera shutter capture
    const mockSnapUrl = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80';
    setCapturedPhotoUrl(mockSnapUrl);
    setCameraActive(false);
    setFormData((prev) => ({
      ...prev,
      fileName: `mobile_cam_${Date.now()}.jpg`,
      fileSize: '2.4 MB',
      fileType: 'JPG',
      name: prev.name || 'Mobile Camera Capture'
    }));
  };

  const getLinkedRecordInfo = () => {
    const { recordCategory, selectedRecordId } = formData;
    if (recordCategory === 'Vehicle') {
      const v = mockVehicles.find((item) => item.id === selectedRecordId) || mockVehicles[0];
      return {
        type: 'vehicle',
        id: v?.id || 'VEH-001',
        name: `${v?.name || 'Vehicle'} (${v?.plate || ''})`,
        formatted: `Vehicle: ${v?.name || 'Vehicle'} (${v?.plate || ''})`
      };
    }
    if (recordCategory === 'Driver') {
      const d = mockDrivers.find((item) => item.id === selectedRecordId) || mockDrivers[0];
      return {
        type: 'driver',
        id: d?.id || 'DRV-101',
        name: d?.name || 'Driver',
        formatted: `Driver: ${d?.name || 'Driver'} (${d?.id || ''})`
      };
    }
    if (recordCategory === 'Contract') {
      const r = initialRentals.find((item) => item.id === selectedRecordId) || initialRentals[0];
      return {
        type: 'contract',
        id: r?.id || 'RNT-2025-001',
        name: `Contract ${r?.id} (${r?.customer || r?.driver || 'Customer'})`,
        formatted: `Contract: ${r?.id} (${r?.customer || r?.driver || 'Customer'})`
      };
    }
    if (recordCategory === 'Expense') {
      const exp = initialExpenses.find((item) => item.id === selectedRecordId) || initialExpenses[0];
      return {
        type: 'expense',
        id: exp?.id || 'EXP-001',
        name: `Expense ${exp?.id} (${exp?.vendor || 'Vendor'})`,
        formatted: `Expense: ${exp?.id || 'EXP'} – ${exp?.vendor || 'Vendor'}`
      };
    }
    if (recordCategory === 'Claim') {
      const acc = initialAccidents.find((item) => item.id === selectedRecordId) || initialAccidents[0];
      return {
        type: 'claim',
        id: acc?.claimNumber || acc?.id || 'CLM-001',
        name: `Claim ${acc?.claimNumber || acc?.id} (${acc?.vehicle || 'Vehicle'})`,
        formatted: `Claim: ${acc?.claimNumber || acc?.id} – ${acc?.vehicle || 'Vehicle'}`
      };
    }
    return {
      type: 'general',
      id: 'GEN-FLEET',
      name: 'General Fleet Operations',
      formatted: 'General Fleet Operations Hub'
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const linked = getLinkedRecordInfo();

    const newDoc = {
      id: `DOC-${Math.floor(100 + Math.random() * 900)}`,
      name: formData.name,
      type: formData.type,
      category: CONTROLLED_TYPES.find((t) => t.value === formData.type)?.label || 'General Document',
      linkedRecord: linked,
      relatedTo: linked.formatted,
      expiryDate: formData.isPermanent ? null : formData.expiryDate,
      uploadedBy: activeRole?.name || 'Marcus Brody (Owner)',
      uploadedDate: new Date().toISOString().split('T')[0],
      version: formData.version || 'v1.0',
      fileSize: formData.fileSize || '2.1 MB',
      fileType: formData.fileType || 'PDF',
      status: formData.isPermanent ? 'Valid' : 'Valid',
      isRestricted: formData.isRestricted,
      versionHistory: [
        {
          version: formData.version || 'v1.0',
          uploadedDate: new Date().toISOString().split('T')[0],
          uploadedBy: activeRole?.name || 'Marcus Brody (Owner)',
          notes: formData.notes || 'Initial document upload',
          fileSize: formData.fileSize || '2.1 MB'
        }
      ]
    };

    onSave(newDoc);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Fleet Document"
      subtitle="Store official titles, registrations, CDLs, lease contracts, inspection vouchers, or insurance policies"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
        <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(85vh-140px)]">
          {/* Drag and Drop Zone & Camera Capture (Requirement 2) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Document File Upload (Drag &amp; Drop or Mobile Camera Capture) *
            </label>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/60 scale-[1.01]'
                  : formData.file || capturedPhotoUrl
                  ? 'border-emerald-400 bg-emerald-50/40'
                  : 'border-slate-200 hover:border-blue-400 bg-slate-50/50'
              }`}
            >
              {capturedPhotoUrl ? (
                <div className="space-y-2">
                  <div className="relative w-36 h-24 mx-auto rounded-xl overflow-hidden border border-emerald-300 shadow-sm">
                    <img src={capturedPhotoUrl} alt="Camera capture" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setCapturedPhotoUrl(null)}
                      className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-full hover:bg-black"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Photo Captured via Mobile Camera
                  </p>
                  <p className="text-[10px] font-mono text-slate-500">{formData.fileName} ({formData.fileSize})</p>
                </div>
              ) : formData.fileName && formData.file ? (
                <div className="space-y-1">
                  <FileText className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="text-xs font-bold text-slate-800">{formData.fileName}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{formData.fileSize} • {formData.fileType}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
                  <div>
                    <p className="text-xs font-bold text-slate-700">
                      Drag and drop your file here, or{' '}
                      <label className="text-blue-600 hover:underline cursor-pointer">
                        browse files
                        <input
                          type="file"
                          onChange={handleFileSelect}
                          className="hidden"
                          accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
                        />
                      </label>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Supports PDF, Word, JPG, PNG up to 25MB
                    </p>
                  </div>
                </div>
              )}

              {/* Mobile Camera Shutter Trigger Button */}
              <div className="pt-3 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl shadow-2xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-blue-600" />
                  Mobile Camera Capture
                </button>
                <input
                  type="file"
                  ref={cameraInputRef}
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => setCameraActive((p) => !p)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
                >
                  {cameraActive ? 'Close Camera View' : 'Live Snapshot Simulator'}
                </button>
              </div>

              {/* Simulated In-Browser Camera Viewfinder */}
              {cameraActive && (
                <div className="mt-3 p-3 bg-slate-900 rounded-xl border border-slate-800 text-center space-y-2 animate-fade-in">
                  <div className="w-full h-32 bg-slate-800 rounded-lg flex items-center justify-center border border-dashed border-slate-700">
                    <p className="text-xs text-slate-400 font-mono">Camera Viewfinder Active (1080p Document Mode)</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCameraSnap}
                    className="px-4 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" /> Take Snapshot Now
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Document Title & Type (Requirement 1 & 2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Document Name / Title *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. NY Commercial DMV Registration"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Document Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))}
                className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                required
              >
                {CONTROLLED_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label} ({t.value})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Link-to-Record Selector (Requirement 2) */}
          <div className="p-4 bg-blue-50/40 border border-blue-100 rounded-2xl space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-blue-600" />
              Link to Fleet Asset / Entity Record *
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Entity Category
                </label>
                <select
                  value={formData.recordCategory}
                  onChange={(e) => {
                    const cat = e.target.value;
                    let defaultId = 'GEN-FLEET';
                    if (cat === 'Vehicle') defaultId = mockVehicles[0]?.id || 'VEH-001';
                    if (cat === 'Driver') defaultId = mockDrivers[0]?.id || 'DRV-101';
                    if (cat === 'Contract') defaultId = initialRentals[0]?.id || 'RNT-2025-001';
                    if (cat === 'Expense') defaultId = initialExpenses[0]?.id || 'EXP-001';
                    if (cat === 'Claim') defaultId = initialAccidents[0]?.claimNumber || 'CLM-001';

                    setFormData((p) => ({
                      ...p,
                      recordCategory: cat,
                      selectedRecordId: defaultId
                    }));
                  }}
                  className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-white"
                >
                  <option value="Vehicle">🚗 Vehicle</option>
                  <option value="Driver">👤 Driver</option>
                  <option value="Contract">🔑 Rental / Lease Contract</option>
                  <option value="Expense">💳 Expense / Vendor Payment</option>
                  <option value="Claim">🛡️ Accident &amp; Insurance Claim</option>
                  <option value="General">🏢 General Fleet / Facility</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Specific Record Subject
                </label>
                <select
                  value={formData.selectedRecordId}
                  onChange={(e) => setFormData((p) => ({ ...p, selectedRecordId: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-medium"
                >
                  {formData.recordCategory === 'Vehicle' &&
                    mockVehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.plate})
                      </option>
                    ))}
                  {formData.recordCategory === 'Driver' &&
                    mockDrivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.id})
                      </option>
                    ))}
                  {formData.recordCategory === 'Contract' &&
                    initialRentals.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.id} – {r.customer || r.driver}
                      </option>
                    ))}
                  {formData.recordCategory === 'Expense' &&
                    initialExpenses.map((exp) => (
                      <option key={exp.id} value={exp.id}>
                        {exp.id} – {exp.vendor} (${exp.amount})
                      </option>
                    ))}
                  {formData.recordCategory === 'Claim' &&
                    initialAccidents.map((acc) => (
                      <option key={acc.id} value={acc.claimNumber || acc.id}>
                        {acc.claimNumber || acc.id} – {acc.vehicle}
                      </option>
                    ))}
                  {formData.recordCategory === 'General' && (
                    <>
                      <option value="FAC-HUB-01">Fleet Operations Hub NYC</option>
                      <option value="FAC-STAGING-02">Main Depot Staging Facility</option>
                      <option value="CORP-LEGAL-03">Corporate Holding &amp; Legal</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Expiration Date & Version (Requirement 1 & 2) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Expiration Date
              </label>
              <input
                type="date"
                disabled={formData.isPermanent}
                value={formData.expiryDate}
                onChange={(e) => setFormData((p) => ({ ...p, expiryDate: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white disabled:bg-slate-100 disabled:text-slate-400"
              />
              <label className="flex items-center gap-1.5 mt-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPermanent}
                  onChange={(e) => setFormData((p) => ({ ...p, isPermanent: e.target.checked }))}
                  className="w-3.5 h-3.5 text-blue-600 rounded"
                />
                <span className="text-[11px] text-slate-500 font-semibold">No Expiration (Permanent)</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Version Tag
              </label>
              <input
                type="text"
                value={formData.version}
                onChange={(e) => setFormData((p) => ({ ...p, version: e.target.value }))}
                placeholder="v1.0"
                className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-200 rounded-xl bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Uploaded By
              </label>
              <input
                type="text"
                value={activeRole?.name || 'Marcus Brody'}
                readOnly
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-100 text-slate-600 font-semibold cursor-not-allowed"
              />
            </div>
          </div>

          {/* Restricted Document Access Control (Requirement 3) */}
          <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-2xl flex items-start gap-3">
            <input
              type="checkbox"
              id="isRestricted"
              checked={formData.isRestricted}
              onChange={(e) => setFormData((p) => ({ ...p, isRestricted: e.target.checked }))}
              className="w-4 h-4 text-amber-600 rounded border-amber-300 focus:ring-amber-500 mt-0.5"
            />
            <div className="text-xs">
              <label htmlFor="isRestricted" className="font-bold text-amber-900 cursor-pointer flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                Restricted / Confidential Document (Lock State)
              </label>
              <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                When enabled, this document will display a lock state. Only authorized Owner / Finance administrators will be permitted to open or download it.
              </p>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Version Changelog &amp; Metadata Notes
            </label>
            <textarea
              rows="2"
              value={formData.notes}
              onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
              placeholder="e.g. Certified copy received from county clerk; verified against physical vehicle plate."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Footer Actions */}
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
            Upload Document
          </button>
        </div>
      </form>
    </Modal>
  );
}
