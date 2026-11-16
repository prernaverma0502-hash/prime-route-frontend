import React, { useState } from 'react';
import Modal from '../../components/common/Modal';
import {
  FileText,
  Download,
  Calendar,
  Clock,
  User,
  Link2,
  ShieldCheck,
  Lock,
  Layers,
  FileCheck,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/formatters';

export default function DocumentPreviewModal({
  isOpen,
  onClose,
  document: doc,
  onDownload
}) {
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'versions' | 'metadata'
  const [zoomLevel, setZoomLevel] = useState(100);

  if (!doc) return null;

  const versionHistory = doc.versionHistory || [
    {
      version: doc.version || 'v1.0',
      uploadedDate: doc.uploadedDate || '2025-07-01',
      uploadedBy: doc.uploadedBy || 'Marcus Brody',
      notes: 'Initial verified upload to document repository',
      fileSize: doc.fileSize || '2.4 MB'
    }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={doc.name}
      subtitle={`Type: ${doc.type?.toUpperCase()} • Linked to: ${doc.relatedTo || doc.linkedRecord?.name || 'General Fleet'} • Current: ${doc.version || 'v1.0'}`}
      maxWidth="max-w-3xl"
    >
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Sub-header Navigation Tabs */}
        <div className="px-6 pt-3 pb-2 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Document Preview
            </button>
            <button
              onClick={() => setActiveTab('versions')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'versions'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Version History</span>
              <span
                className={`text-[10px] px-1.5 rounded-full font-black ${
                  activeTab === 'versions' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {versionHistory.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('metadata')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'metadata'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Metadata &amp; Linkages
            </button>
          </div>

          <div className="flex items-center gap-2">
            {doc.isRestricted && (
              <span className="px-2.5 py-1 text-[10px] font-extrabold bg-amber-100 text-amber-800 rounded-lg border border-amber-200 flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-600" /> Restricted
              </span>
            )}
            <StatusBadge status={doc.status} />
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(85vh-160px)]">
          {activeTab === 'preview' ? (
            <div className="space-y-3">
              {/* Preview Zoom Controls */}
              <div className="flex items-center justify-between px-2 text-xs text-slate-500">
                <span className="font-mono text-[11px]">Format: {doc.fileType} • Size: {doc.fileSize}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(70, z - 15))}
                    className="p-1 hover:bg-slate-100 rounded text-slate-600"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-[11px] font-bold">{zoomLevel}%</span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
                    className="p-1 hover:bg-slate-100 rounded text-slate-600"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Simulated Document Canvas / PDF Viewer */}
              <div
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-sm text-slate-800 space-y-6 min-h-[360px] relative overflow-hidden transition-transform duration-200"
              >
                {/* Diagonal Watermark */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center rotate-[-25deg] select-none opacity-5">
                  <span className="text-6xl font-black text-slate-900 tracking-widest uppercase">
                    PRIMEROUTE SECURE VAULT
                  </span>
                </div>

                {/* Document Simulated Header */}
                <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-mono tracking-widest uppercase text-slate-500">
                      PRIMEROUTE FLEET DIGITAL CERTIFIED VAULT
                    </p>
                    <h2 className="text-lg font-black text-[#0A1E42] tracking-tight">{doc.name}</h2>
                    <p className="text-xs font-semibold text-blue-700">Official Controlled Document • {doc.type?.toUpperCase()}</p>
                  </div>
                  <div className="text-right font-mono text-[11px]">
                    <p className="font-bold text-slate-800">Doc ID: {doc.id}</p>
                    <p className="text-slate-500">Version: {doc.version || 'v1.0'}</p>
                    <p className="text-slate-500">Date: {doc.uploadedDate}</p>
                  </div>
                </div>

                {/* Key Spec Grid */}
                <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Subject Entity</span>
                    <span className="font-bold text-slate-800 block mt-0.5">{doc.relatedTo || 'Company Fleet Operations'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Expiration Term</span>
                    <span className={`font-mono font-bold block mt-0.5 ${doc.status === 'Expiring Soon' ? 'text-amber-600' : 'text-slate-800'}`}>
                      {doc.expiryDate ? formatDate(doc.expiryDate) : 'Permanent / In Force'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Verified By</span>
                    <span className="font-medium text-slate-700 block mt-0.5">{doc.uploadedBy}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Storage Protocol</span>
                    <span className="font-mono text-[11px] text-emerald-700 font-semibold block mt-0.5">
                      ✓ SHA-256 Verified Digital Seal
                    </span>
                  </div>
                </div>

                {/* Document Simulated Body Content */}
                <div className="space-y-2 text-xs leading-relaxed text-slate-600">
                  <p>
                    This electronic certificate confirms that <strong>{doc.name}</strong> was submitted, verified, and stamped into the PrimeRoute global fleet compliance registry on {formatDate(doc.uploadedDate)}.
                  </p>
                  <p className="text-[11px] text-slate-400 italic">
                    All compliance terms, inspections, and regulatory provisions remain bound to the associated fleet operating records.
                  </p>
                </div>
              </div>
            </div>
          ) : activeTab === 'versions' ? (
            /* Version History Tab (Requirement 4) */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-600" />
                  Historical Revision &amp; Version Trail ({versionHistory.length} Versions)
                </h4>
                <span className="text-[11px] text-slate-400">All past revisions preserved</span>
              </div>

              <div className="space-y-3">
                {versionHistory.map((ver, idx) => {
                  const isCurrent = idx === 0;

                  return (
                    <div
                      key={ver.version}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isCurrent
                          ? 'bg-blue-50/50 border-blue-200 shadow-2xs'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono font-black text-xs px-2 py-0.5 rounded-lg ${
                              isCurrent
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {ver.version}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                              Current Active Version
                            </span>
                          )}
                          <span className="text-xs font-semibold text-slate-800">
                            {formatDate(ver.uploadedDate)}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 mt-1 leading-snug">
                          {ver.notes || 'Routine revision update.'}
                        </p>

                        <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                          <span>Uploaded by: <strong className="text-slate-600">{ver.uploadedBy}</strong></span>
                          <span>•</span>
                          <span>File size: {ver.fileSize || '2.0 MB'}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onDownload({ ...doc, name: `${doc.name}_${ver.version}` })}
                        className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-2xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                        title={`Download ${ver.version}`}
                      >
                        <Download className="w-3.5 h-3.5 text-blue-600" />
                        Download {ver.version}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Metadata Tab */
            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                <h4 className="font-bold text-[#0A1E42] text-xs uppercase tracking-wider">
                  Entity &amp; Regulatory Metadata
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Document Identifier</span>
                    <span className="font-mono font-bold text-slate-800">{doc.id}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Controlled Category</span>
                    <span className="font-semibold text-slate-800">{doc.category} ({doc.type})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Linked Entity Subject</span>
                    <span className="font-semibold text-slate-800">{doc.relatedTo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Confidentiality Level</span>
                    <span className="font-bold text-slate-800">{doc.isRestricted ? 'Restricted (Owner/Finance Only)' : 'Standard Fleet Operational'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#F8FAFC] border-t border-slate-100 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => onDownload(doc)}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download Current ({doc.version || 'v1.0'})
          </button>
        </div>
      </div>
    </Modal>
  );
}

