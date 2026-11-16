import React, { useState, useMemo } from 'react';
import {
  FolderArchive,
  FileText,
  AlertTriangle,
  Upload,
  Download,
  Eye,
  Trash2,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Search,
  Lock,
  Unlock,
  Layers,
  Filter,
  Car,
  User,
  KeyRound,
  Receipt,
  FileCheck,
  ShieldAlert,
  Clock,
  LayoutGrid,
  List
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import SearchBar from '../../components/common/SearchBar';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import UploadDocumentModal from './UploadDocumentModal';
import DocumentPreviewModal from './DocumentPreviewModal';
import RestrictedAccessModal from './RestrictedAccessModal';
import { initialDocuments } from '../../data/mockData';
import { formatDate } from '../../utils/formatters';
import { useRole } from '../../context/RoleContext';
import Can from '../../auth/Can';

// ============================================================================
// SECURITY ARCHITECTURE NOTICE:
// Real permission enforcement must happen in the document storage backend,
// not only in the UI.
// Client-side UI gating and lock states provide visual indication and user
// guidance, but production systems must enforce zero-trust authentication,
// pre-signed expiring S3/GCS URLs, and KMS envelope encryption at the object
// storage layer.
// ============================================================================

const CONTROLLED_TYPES = [
  'All Types',
  'title',
  'registration',
  'license',
  'contract',
  'inspection',
  'receipt',
  'invoice',
  'insurance',
  'accident record',
  'toll/ticket',
  'other'
];

export default function DocumentsPage() {
  const { currentRoleId, activeRole } = useRole();

  const [documents, setDocuments] = useState(initialDocuments);
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [restrictedDocToView, setRestrictedDocToView] = useState(null);
  const [deletingDoc, setDeletingDoc] = useState(null);

  // Check role authorization for restricted documents
  // Authorized: Owner / Primary Admin, Secondary Admin, Finance
  const canAccessRestricted = useMemo(() => {
    return ['owner', 'secondary_admin', 'finance'].includes(currentRoleId?.toLowerCase());
  }, [currentRoleId]);

  // Stats
  const stats = useMemo(() => {
    const expiringCount = documents.filter((d) => d.status === 'Expiring Soon').length;
    const restrictedCount = documents.filter((d) => d.isRestricted).length;
    const totalCount = documents.length;

    return {
      totalCount,
      expiringCount,
      restrictedCount,
      activeCount: totalCount - expiringCount
    };
  }, [documents]);

  // Filtered Documents
  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (doc.name || '').toLowerCase().includes(q) ||
        (doc.relatedTo || '').toLowerCase().includes(q) ||
        (doc.type || '').toLowerCase().includes(q) ||
        (doc.uploadedBy || '').toLowerCase().includes(q) ||
        (doc.id || '').toLowerCase().includes(q);

      let matchesType = true;
      if (typeFilter !== 'All Types') {
        matchesType = doc.type?.toLowerCase() === typeFilter.toLowerCase();
      }

      let matchesStatus = true;
      if (statusFilter !== 'All') {
        if (statusFilter === 'Restricted') {
          matchesStatus = doc.isRestricted;
        } else if (statusFilter === 'Expiring Soon') {
          matchesStatus = doc.status === 'Expiring Soon';
        } else if (statusFilter === 'Valid') {
          matchesStatus = doc.status === 'Valid';
        }
      }

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [documents, searchQuery, typeFilter, statusFilter]);

  const totalPages = Math.ceil(filteredDocs.length / pageSize) || 1;
  const paginatedDocs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDocs.slice(start, start + pageSize);
  }, [filteredDocs, currentPage, pageSize]);

  // Document Handlers
  const handleSaveDoc = (newDoc) => {
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const handleDeleteDoc = () => {
    if (deletingDoc) {
      setDocuments((prev) => prev.filter((d) => d.id !== deletingDoc.id));
      setDeletingDoc(null);
    }
  };

  const handleOpenPreview = (doc) => {
    if (doc.isRestricted && !canAccessRestricted) {
      setRestrictedDocToView(doc);
      return;
    }
    setViewingDoc(doc);
  };

  const handleDownload = (doc) => {
    if (doc.isRestricted && !canAccessRestricted) {
      setRestrictedDocToView(doc);
      return;
    }

    // Generate simulated document file download
    const content = `=====================================================
PRIMEROUTE SECURE FLEET VAULT RECORD
=====================================================
Document ID:     ${doc.id}
Document Title:  ${doc.name}
Controlled Type: ${doc.type?.toUpperCase()}
Linked Record:   ${doc.relatedTo}
Current Version: ${doc.version || 'v1.0'}
Expiry Date:     ${doc.expiryDate || 'Permanent / No Expiration'}
Uploaded By:     ${doc.uploadedBy}
Upload Date:     ${doc.uploadedDate}
Confidentiality: ${doc.isRestricted ? 'RESTRICTED / OWNER & FINANCE ONLY' : 'Standard Fleet'}
Digital Hash:    SHA-256 Verified Seal
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.name.replace(/[^a-zA-Z0-9_-]/g, '_')}_${doc.version || 'v1.0'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'title':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'registration':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'license':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'contract':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'inspection':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'invoice':
      case 'receipt':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'insurance':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'accident record':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'toll/ticket':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-slide-up duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0A1E42] tracking-tight flex items-center gap-2.5">
            <FolderArchive className="w-7 h-7 text-[#075EE8]" />
            Documents Repository &amp; Compliance Vault
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Centralized digital vault for titles, registrations, CDLs, lease contracts, inspection vouchers, and restricted legal records
          </p>
        </div>

        <Can module="documents" do="add">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 duration-150 self-start sm:self-auto cursor-pointer"
          >
            <Upload className="w-4 h-4" /> Upload Document
          </button>
        </Can>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FolderArchive}
          label="Total Vault Records"
          value={stats.totalCount}
          change="Certified Documents"
          isPositive={true}
          color="blue"
        />
        <StatCard
          icon={AlertTriangle}
          label="Expiring Soon (≤30 Days)"
          value={stats.expiringCount}
          change="Action Required"
          isPositive={false}
          color="amber"
        />
        <StatCard
          icon={Lock}
          label="Restricted / Confidential"
          value={stats.restrictedCount}
          change="Locked &amp; Access Controlled"
          isPositive={true}
          color="indigo"
        />
        <StatCard
          icon={ShieldCheck}
          label="Active Regulatory Status"
          value={`${stats.activeCount}/${stats.totalCount}`}
          change="100% Audit Verified"
          isPositive={true}
          color="emerald"
        />
      </div>

      {/* Expiring Soon Compliance Alert Banner */}
      {stats.expiringCount > 0 && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#0A1E42] text-xs sm:text-sm">
                Compliance Alert: {stats.expiringCount} Regulatory Documents Expiring Within 30 Days
              </h4>
              <p className="text-xs text-amber-800">
                Action required to avoid municipal penalties or Department of Transportation fleet operating suspensions.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setStatusFilter('Expiring Soon');
              setCurrentPage(1);
            }}
            className="px-3.5 py-1.5 bg-white border border-amber-300 text-amber-900 rounded-xl text-xs font-bold hover:bg-amber-100 transition-colors shrink-0 cursor-pointer"
          >
            Review Expiring
          </button>
        </div>
      )}

      {/* Categories Bar & Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Controlled Types Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {CONTROLLED_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTypeFilter(t);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 capitalize cursor-pointer ${
                typeFilter === t
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 cursor-pointer shrink-0"
          >
            <option value="All">All Statuses</option>
            <option value="Valid">Valid</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Restricted">Restricted (Locked)</option>
          </select>

          {/* Search Bar */}
          <div className="w-full md:w-72">
            <SearchBar
              value={searchQuery}
              onChange={(val) => {
                setSearchQuery(val);
                setCurrentPage(1);
              }}
              placeholder="Search title, vehicle, driver, type..."
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-slate-200 rounded-xl p-1 bg-slate-50 shrink-0">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Document Records View */}
      {filteredDocs.length === 0 ? (
        <EmptyState
          title="No documents found"
          description="Try selecting another document type or clearing your search filter."
          actionText="View All Documents"
          onAction={() => {
            setSearchQuery('');
            setTypeFilter('All Types');
            setStatusFilter('All');
          }}
        />
      ) : viewMode === 'table' ? (
        /* Requirement 1: List with all required columns */
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Document Name &amp; ID</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Linked Record</th>
                  <th className="py-3.5 px-4">Expiry Date</th>
                  <th className="py-3.5 px-4">Uploaded By</th>
                  <th className="py-3.5 px-4">Uploaded Date</th>
                  <th className="py-3.5 px-4">Version</th>
                  <th className="py-3.5 px-4">Access Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {paginatedDocs.map((doc) => {
                  const isLocked = doc.isRestricted && !canAccessRestricted;

                  return (
                    <tr key={doc.id} className="hover:bg-blue-50/25 transition-colors group">
                      <td className="py-3.5 px-4 max-w-[220px]">
                        <div className="flex items-center gap-2">
                          {doc.isRestricted && (
                            <span title="Restricted Document">
                              <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            </span>
                          )}
                          <div className="truncate">
                            <span
                              onClick={() => handleOpenPreview(doc)}
                              className="font-bold text-[#0A1E42] group-hover:text-blue-600 transition-colors block truncate cursor-pointer"
                              title={doc.name}
                            >
                              {doc.name}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400 block">
                              {doc.id} • {doc.fileType} ({doc.fileSize})
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold capitalize border ${getTypeBadgeClass(
                            doc.type
                          )}`}
                        >
                          {doc.type}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 max-w-[190px]">
                        <p className="font-semibold text-slate-800 truncate" title={doc.relatedTo}>
                          {doc.relatedTo}
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        {doc.expiryDate ? (
                          <div>
                            <span
                              className={`font-mono font-bold ${
                                doc.status === 'Expiring Soon' ? 'text-amber-600' : 'text-slate-800'
                              }`}
                            >
                              {formatDate(doc.expiryDate)}
                            </span>
                            {doc.status === 'Expiring Soon' && (
                              <span className="block text-[10px] text-amber-600 font-semibold">
                                Expiring Soon
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 font-medium">Permanent</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {doc.uploadedBy}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {formatDate(doc.uploadedDate)}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-extrabold text-blue-700">
                        {doc.version || 'v1.0'}
                      </td>

                      <td className="py-3.5 px-4">
                        {doc.isRestricted ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
                            <Lock className="w-2.5 h-2.5" />
                            {isLocked ? 'Locked (No Access)' : 'Restricted (Authorized)'}
                          </span>
                        ) : (
                          <StatusBadge status={doc.status} />
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenPreview(doc)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isLocked
                                ? 'text-amber-600 hover:bg-amber-50'
                                : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                            }`}
                            title={isLocked ? 'Restricted Access – Locked' : 'Preview Document'}
                          >
                            {isLocked ? <Lock className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDownload(doc)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Download Document"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingDoc(doc)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedDocs.map((doc) => {
            const isLocked = doc.isRestricted && !canAccessRestricted;

            return (
              <div
                key={doc.id}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] hover:shadow-[0_4px_16px_rgba(7,94,232,0.08)] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#075EE8] flex items-center justify-center font-bold text-xs uppercase font-mono">
                        {doc.fileType}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded border ${getTypeBadgeClass(
                              doc.type
                            )}`}
                          >
                            {doc.type}
                          </span>
                          <span className="font-mono text-[10px] text-blue-700 font-bold">
                            {doc.version || 'v1.0'}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-[#0A1E42] group-hover:text-[#075EE8] transition-colors line-clamp-1 mt-0.5">
                          {doc.name}
                        </h3>
                      </div>
                    </div>

                    {doc.isRestricted ? (
                      <span className="p-1.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-200" title="Restricted Document">
                        <Lock className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <StatusBadge status={doc.status} />
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Linked Record:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[150px]">
                        {doc.relatedTo}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Expiry Date:</span>
                      <span
                        className={`font-mono font-bold ${
                          doc.status === 'Expiring Soon' ? 'text-amber-600' : 'text-slate-700'
                        }`}
                      >
                        {doc.expiryDate ? formatDate(doc.expiryDate) : 'Permanent'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Uploaded By:</span>
                      <span className="text-slate-600 truncate max-w-[140px]">{doc.uploadedBy}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <button
                    onClick={() => handleOpenPreview(doc)}
                    className={`font-semibold flex items-center gap-1 cursor-pointer ${
                      isLocked ? 'text-amber-700 hover:underline' : 'text-[#075EE8] hover:underline'
                    }`}
                  >
                    {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {isLocked ? 'Locked' : 'Preview'}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="p-1.5 text-slate-500 hover:text-[#075EE8] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="Download File"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingDoc(doc)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete File"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {filteredDocs.length > pageSize && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredDocs.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Upload Modal (Requirement 2) */}
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSave={handleSaveDoc}
      />

      {/* Preview & Version History Modal (Requirement 4) */}
      <DocumentPreviewModal
        isOpen={!!viewingDoc}
        onClose={() => setViewingDoc(null)}
        document={viewingDoc}
        onDownload={handleDownload}
      />

      {/* Restricted Access Lock Modal (Requirement 3) */}
      <RestrictedAccessModal
        isOpen={!!restrictedDocToView}
        onClose={() => setRestrictedDocToView(null)}
        document={restrictedDocToView}
        currentRole={activeRole}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deletingDoc}
        onClose={() => setDeletingDoc(null)}
        onConfirm={handleDeleteDoc}
        title="Delete Document"
        message={`Are you sure you want to permanently remove "${deletingDoc?.name}" from the fleet compliance vault? This action cannot be undone.`}
        confirmText="Delete File"
        isDanger={true}
      />
    </div>
  );
}
