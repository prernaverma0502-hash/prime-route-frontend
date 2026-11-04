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
  FileCode
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import Modal from '../../components/common/Modal';
import UploadDocumentModal from './UploadDocumentModal';
import { initialDocuments } from '../../data/mockData';
import { formatDate } from '../../utils/formatters';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState(initialDocuments);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [deletingDoc, setDeletingDoc] = useState(null);

  // Stats
  const expiringDocs = useMemo(() => {
    return documents.filter((d) => d.status === 'Expiring Soon');
  }, [documents]);

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.relatedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === 'All' || doc.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [documents, searchQuery, categoryFilter]);

  const totalPages = Math.ceil(filteredDocs.length / pageSize) || 1;
  const paginatedDocs = filteredDocs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSaveDoc = (newDoc) => {
    setDocuments([newDoc, ...documents]);
  };

  const handleDeleteDoc = () => {
    if (deletingDoc) {
      setDocuments(documents.filter((d) => d.id !== deletingDoc.id));
      setDeletingDoc(null);
    }
  };

  const handleDownload = (doc) => {
    // Generate text simulation download
    const blob = new Blob([`PrimeRoute Compliance Record\nDocument: ${doc.name}\nEntity: ${doc.relatedTo}\nCategory: ${doc.category}\nExpiry: ${doc.expiryDate}`], {
      type: 'text/plain',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.name.replace(/\s+/g, '_')}.txt`;
    link.click();
  };

  return (
    <div className="space-y-6 animate-slide-up duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0A1E42] tracking-tight">Compliance &amp; Documents</h1>
          <p className="text-xs text-slate-500 mt-1">
            Centralized digital vault for DOT certifications, vehicle registrations, and insurance policies
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 duration-150 self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" /> Upload Document
        </button>
      </div>

      {/* Expiring Soon Banner (From reference image alerts: 4 Documents Expiring) */}
      {expiringDocs.length > 0 && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#0A1E42] text-sm">
                Compliance Alert: {expiringDocs.length} Documents Expiring Soon
              </h4>
              <p className="text-xs text-amber-800">
                Action required within next 30 days to maintain Department of Transportation operating status.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCategoryFilter('Driver Documents')}
            className="px-3.5 py-1.5 bg-white border border-amber-300 text-amber-900 rounded-xl text-xs font-bold hover:bg-amber-100 transition-colors shrink-0"
          >
            Review Expiring
          </button>
        </div>
      )}

      {/* Categories Bar & Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            'All',
            'Vehicle Documents',
            'Driver Documents',
            'Insurance Documents',
            'Registration Documents',
            'Rental Agreements',
            'Licenses',
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategoryFilter(cat);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                categoryFilter === cat
                  ? 'bg-[#075EE8] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="w-full md:w-72">
          <SearchBar
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            placeholder="Search document name or vehicle..."
          />
        </div>
      </div>

      {/* Documents Grid */}
      {filteredDocs.length === 0 ? (
        <EmptyState
          title="No documents found"
          description="Try selecting another category or clearing your search query."
          actionText="View All Documents"
          onAction={() => {
            setSearchQuery('');
            setCategoryFilter('All');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] hover:shadow-[0_4px_16px_rgba(7,94,232,0.08)] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#075EE8] flex items-center justify-center font-bold text-xs uppercase">
                      {doc.fileType}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        {doc.category}
                      </span>
                      <h3 className="text-sm font-bold text-[#0A1E42] group-hover:text-[#075EE8] transition-colors line-clamp-1">
                        {doc.name}
                      </h3>
                    </div>
                  </div>
                  <StatusBadge status={doc.status} />
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Related Scope:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[150px]">{doc.relatedTo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Expiry Date:</span>
                    <span className={`font-bold ${doc.status === 'Expiring Soon' ? 'text-amber-600' : 'text-slate-700'}`}>
                      {formatDate(doc.expiryDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">File Size:</span>
                    <span className="text-slate-500">{doc.fileSize}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <button
                  onClick={() => setViewingDoc(doc)}
                  className="font-semibold text-[#075EE8] hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDownload(doc)}
                    className="p-1.5 text-slate-500 hover:text-[#075EE8] hover:bg-blue-50 rounded-lg transition-colors"
                    title="Download File"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingDoc(doc)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete File"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredDocs.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      {/* Preview Modal */}
      {viewingDoc && (
        <Modal
          isOpen={!!viewingDoc}
          onClose={() => setViewingDoc(null)}
          title={viewingDoc.name}
          subtitle={`Category: ${viewingDoc.category} • Expiry: ${formatDate(viewingDoc.expiryDate)}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            <div className="bg-slate-900 rounded-xl p-8 text-center text-slate-300 min-h-[220px] flex flex-col items-center justify-center">
              <FileText className="w-16 h-16 text-[#38BDF8] mb-3 opacity-90" />
              <h4 className="text-white font-bold text-base">{viewingDoc.name}</h4>
              <p className="text-xs text-slate-400 mt-1">Verified Digital Document Vault Record</p>
              <div className="mt-4 flex gap-2">
                <span className="text-[11px] bg-slate-800 text-slate-300 px-3 py-1 rounded-full">
                  Format: {viewingDoc.fileType}
                </span>
                <span className="text-[11px] bg-slate-800 text-slate-300 px-3 py-1 rounded-full">
                  Size: {viewingDoc.fileSize}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t">
              <button
                onClick={() => setViewingDoc(null)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => handleDownload(viewingDoc)}
                className="px-5 py-2 bg-[#075EE8] text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow"
              >
                <Download className="w-4 h-4" /> Download Certificate
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Upload Modal */}
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSave={handleSaveDoc}
      />

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!deletingDoc}
        onClose={() => setDeletingDoc(null)}
        onConfirm={handleDeleteDoc}
        title="Delete Document"
        message={`Are you sure you want to permanently delete '${deletingDoc?.name}'?`}
        confirmText="Delete File"
      />
    </div>
  );
}

