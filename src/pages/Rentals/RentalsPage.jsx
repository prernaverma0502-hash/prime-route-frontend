import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  Calendar,
  XCircle,
  FileText,
  KeyRound,
  PenLine,
  RotateCcw,
  ClipboardCheck,
  CarFront,
  Send,
  Lock,
  History,
  ShieldCheck,
  Table,
  CalendarDays,
  FileSignature
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import SearchBar from '../../components/common/SearchBar';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import RentalModal from './RentalModal';
import RentalDetailsModal from './RentalDetailsModal';
import RentalAmendModal from './RentalAmendModal';
import VehiclePickupModal from './VehiclePickupModal';
import VehicleReturnModal from './VehicleReturnModal';
import RentalsCalendarView from './RentalsCalendarView';
import RentalAgreementModal from '../../components/agreements/RentalAgreementModal';
import { useFleet } from '../../context/FleetContext';
import Can from '../../auth/Can';
import { exportToCsv } from '../../utils/exportCsv';
import { formatCurrency, formatDate } from '../../utils/formatters';

const STATUS_TABS = [
  'All',
  'Draft',
  'Awaiting Signature',
  'Active',
  'Renewed',
  'Terminated',
  'Completed'
];

export default function RentalsPage() {
  const { rentals, setRentals, vehicles, updateRental } = useFleet();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'calendar'
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [editingRental, setEditingRental] = useState(null);
  const [amendingRental, setAmendingRental] = useState(null);
  const [viewingRental, setViewingRental] = useState(null);
  const [signingRental, setSigningRental] = useState(null);
  const [returningRental, setReturningRental] = useState(null);
  const [viewingReturnRental, setViewingReturnRental] = useState(null);
  const [deletingRental, setDeletingRental] = useState(null);
  const [notification, setNotification] = useState('');

  const stats = useMemo(() => {
    return {
      total: rentals.length,
      active: rentals.filter((r) => r.status === 'Active').length,
      awaiting: rentals.filter((r) => r.status === 'Awaiting Signature' || r.agreementStatus === 'Awaiting Signature').length,
      renewed: rentals.filter((r) => r.status === 'Renewed').length,
      completed: rentals.filter((r) => r.status === 'Completed').length,
      draft: rentals.filter((r) => r.status === 'Draft' || r.agreementStatus === 'Draft').length
    };
  }, [rentals]);

  const filteredRentals = useMemo(() => {
    return rentals.filter((r) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (r.id && r.id.toLowerCase().includes(q)) ||
        (r.customer && r.customer.toLowerCase().includes(q)) ||
        (r.vehicle && r.vehicle.toLowerCase().includes(q)) ||
        (r.driver && r.driver.toLowerCase().includes(q));

      const matchesStatus =
        statusFilter === 'All' ||
        r.status === statusFilter ||
        (statusFilter === 'Awaiting Signature' && r.agreementStatus === 'Awaiting Signature');

      return matchesSearch && matchesStatus;
    });
  }, [rentals, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredRentals.length / pageSize) || 1;
  const paginatedRentals = filteredRentals.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSaveRental = (rentalData) => {
    if (editingRental) {
      setRentals((prev) =>
        prev.map((r) => (r.id === rentalData.id ? rentalData : r))
      );
    } else {
      setRentals((prev) => [rentalData, ...prev]);
    }
    setEditingRental(null);
  };

  const handleDeleteRental = () => {
    if (deletingRental) {
      // Check if signed
      const isSigned =
        deletingRental.agreementStatus === 'Signed' ||
        ['Active', 'Renewed', 'Completed'].includes(deletingRental.status);

      if (isSigned) {
        alert('Action Blocked: Legally executed signed contracts cannot be deleted.');
        setDeletingRental(null);
        return;
      }

      setRentals((prev) => prev.filter((r) => r.id !== deletingRental.id));
      setDeletingRental(null);
    }
  };

  // E-Signature flow helper: Send for signature
  const handleSendForSignature = (rental) => {
    updateRental(rental.id, {
      ...rental,
      status: 'Awaiting Signature',
      agreementStatus: 'Awaiting Signature'
    });
    setNotification(`Contract ${rental.id} dispatched for e-signature. Status is now "Awaiting Signature".`);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleExport = () => {
    exportToCsv(
      'PrimeRoute_Rentals_Export',
      filteredRentals.map((r) => ({
        RentalID: r.id,
        Customer: r.customer,
        Vehicle: r.vehicle,
        Driver: r.driver,
        StartDate: r.startDate,
        EndDate: r.endDate,
        Type: r.rentalType,
        WeeklyRate: r.weeklyRent || r.amount,
        Total: r.total || r.amount,
        PaymentStatus: r.paymentStatus,
        AgreementStatus: r.agreementStatus || 'Draft',
        Status: r.status
      }))
    );
  };

  return (
    <div className="space-y-6 animate-slide-up duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0A1E42] tracking-tight">Rentals &amp; Contracts</h1>
          <p className="text-xs text-slate-500 mt-1">
            Dispatch commercial fleet reservations, track active lease agreements, and enforce e-signatures
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <Can module="rentals" do="export">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition-all active:scale-95 duration-150 cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-500" /> Export CSV
            </button>
          </Can>
          <Can module="rentals" do="add">
            <button
              onClick={() => setIsPickupModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#071D49] hover:bg-[#0D2D6C] text-white text-xs font-bold shadow-md shadow-slate-900/10 transition-all active:scale-95 duration-150 cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-emerald-400" /> Vehicle Pickup
            </button>
          </Can>
          <Can module="rentals" do="add">
            <button
              onClick={() => {
                setEditingRental(null);
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 duration-150 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> New Rental
            </button>
          </Can>
        </div>
      </div>

      {/* Ephemeral Toast Notification */}
      {notification && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 text-xs font-bold text-[#075EE8] rounded-xl flex items-center justify-between animate-fade-in shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#075EE8]" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification('')} className="text-slate-400 hover:text-slate-600">
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Stats aligned to 6 Client Statuses */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatCard
          title="Total Rentals"
          value={stats.total}
          icon={FileSpreadsheet}
          iconColor="text-[#075EE8]"
          iconBg="bg-blue-50/90 border border-blue-100"
          subtitle="All Records"
          progress={100}
          progressColor="bg-[#075EE8]"
        />
        <StatCard
          title="Active Leases"
          value={stats.active}
          icon={CarFront}
          iconColor="text-blue-600"
          iconBg="bg-blue-50/90 border border-blue-100"
          badge="Live Dispatch"
          badgeColor="bg-blue-50 text-blue-700 border-blue-200/80"
          subtitle="Vehicles on Duty"
          progress={Math.round((stats.active / (stats.total || 1)) * 100)}
          progressColor="bg-blue-600"
        />
        <StatCard
          title="Awaiting Signature"
          value={stats.awaiting}
          icon={PenLine}
          iconColor="text-amber-600"
          iconBg="bg-amber-50/90 border border-amber-100"
          badge="Pending Review"
          badgeColor="bg-amber-50 text-amber-700 border-amber-200/80"
          subtitle="Drafts out for Sign"
          progress={Math.round((stats.awaiting / (stats.total || 1)) * 100)}
          progressColor="bg-amber-500"
        />
        <StatCard
          title="Renewed / Extended"
          value={stats.renewed}
          icon={History}
          iconColor="text-purple-600"
          iconBg="bg-purple-50/90 border border-purple-100"
          badge="Amendments"
          badgeColor="bg-purple-50 text-purple-700 border-purple-200/80"
          subtitle="Contract Renewals"
          progress={Math.round((stats.renewed / (stats.total || 1)) * 100)}
          progressColor="bg-purple-500"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50/90 border border-emerald-100"
          badge="Settled"
          badgeColor="bg-emerald-50 text-emerald-700 border-emerald-200/80"
          subtitle="Returned Clean"
          progress={Math.round((stats.completed / (stats.total || 1)) * 100)}
          progressColor="bg-emerald-500"
        />
        <StatCard
          title="Draft Agreements"
          value={stats.draft}
          icon={Clock}
          iconColor="text-slate-500"
          iconBg="bg-slate-100 border border-slate-200"
          badge="Pre-dispatch"
          badgeColor="bg-slate-100 text-slate-700 border-slate-300"
          subtitle="Awaiting Dispatch"
          progress={Math.round((stats.draft / (stats.total || 1)) * 100)}
          progressColor="bg-slate-400"
        />
      </div>

      {/* Filter Tabs, Search & View Switcher */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setStatusFilter(tab);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                statusFilter === tab
                  ? 'bg-[#075EE8] text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search & View Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="w-full md:w-72">
            <SearchBar
              value={searchQuery}
              onChange={(val) => {
                setSearchQuery(val);
                setCurrentPage(1);
              }}
              placeholder="Search contract ID, driver, vehicle..."
            />
          </div>

          {/* Table vs Calendar Toggle */}
          <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 shadow-2xs shrink-0">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-[#075EE8] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table className="w-3.5 h-3.5" /> Table
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-white text-[#075EE8] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" /> Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Main View Mode: Table vs Calendar */}
      {viewMode === 'calendar' ? (
        <RentalsCalendarView
          rentals={filteredRentals}
          vehicles={vehicles}
          onSelectRental={(rental) => setViewingRental(rental)}
          onViewAgreement={(rental) => setSigningRental(rental)}
        />
      ) : (
        /* Rentals Table View */
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
          {paginatedRentals.length === 0 ? (
            <EmptyState
              title="No rentals found"
              description="No rental records match your current filter and search settings."
              actionText="Reset Filter"
              onAction={() => {
                setSearchQuery('');
                setStatusFilter('All');
              }}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[960px]">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Contract ID</th>
                    <th className="py-3.5 px-4">Driver / Customer</th>
                    <th className="py-3.5 px-4">Assigned Vehicle</th>
                    <th className="py-3.5 px-4">Lease Term</th>
                    <th className="py-3.5 px-4">Weekly / Total</th>
                    <th className="py-3.5 px-4">Agreement &amp; Status</th>
                    <th className="py-3.5 px-4 text-center">E-Signature</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {paginatedRentals.map((rental) => {
                    const isSigned =
                      rental.agreementStatus === 'Signed' ||
                      ['Active', 'Renewed', 'Completed'].includes(rental.status);

                    const isDraft = rental.status === 'Draft' || rental.agreementStatus === 'Draft';
                    const isAwaitingSign =
                      rental.status === 'Awaiting Signature' ||
                      rental.agreementStatus === 'Awaiting Signature';

                    return (
                      <tr
                        key={rental.id}
                        className="hover:bg-blue-50/30 transition-colors group"
                      >
                        {/* Contract ID */}
                        <td className="py-3.5 px-4 font-mono font-bold text-[#075EE8]">
                          <div className="flex items-center gap-1.5">
                            {isSigned && (
                              <span title="Locked: Legally executed agreement" className="text-slate-400">
                                <Lock className="w-3.5 h-3.5" />
                              </span>
                            )}
                            <span>{rental.id}</span>
                          </div>
                        </td>

                        {/* Customer & Driver */}
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-[#0A1E42] group-hover:text-[#075EE8] transition-colors">
                            {rental.driver || rental.customer}
                          </p>
                          <p className="text-[11px] text-slate-400">{rental.customerPhone || rental.rentalType}</p>
                        </td>

                        {/* Vehicle */}
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-slate-800">{rental.vehicle}</p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {rental.vehicleId || 'Assigned Unit'}
                          </p>
                        </td>

                        {/* Dates */}
                        <td className="py-3.5 px-4">
                          <p className="font-medium text-slate-700">{formatDate(rental.startDate)}</p>
                          <p className="text-[11px] text-slate-400">to {formatDate(rental.endDate)}</p>
                        </td>

                        {/* Amounts */}
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-[#0A1E42]">
                            {formatCurrency(rental.weeklyRent || Math.round((rental.amount || 1950) / 4))}/wk
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Total: {formatCurrency(rental.total || rental.amount)}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 space-y-1">
                          <StatusBadge status={rental.status} />
                          {rental.status === 'Renewed' && (
                            <span className="block text-[10px] font-semibold text-purple-700">
                              Extended ({rental.amendmentHistory?.length || 1} amend)
                            </span>
                          )}
                        </td>

                        {/* E-Signature Flow Actions */}
                        <td className="py-3.5 px-4 text-center">
                          {isDraft && (
                            <button
                              onClick={() => handleSendForSignature(rental)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold hover:bg-amber-100 transition-all cursor-pointer shadow-2xs"
                              title="Send agreement to driver for digital signature"
                            >
                              <Send className="w-3.5 h-3.5 text-amber-600" /> Send for Sign
                            </button>
                          )}

                          {isAwaitingSign && (
                            <button
                              onClick={() => setSigningRental(rental)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-[#075EE8] text-[11px] font-bold hover:bg-blue-100 transition-all cursor-pointer shadow-2xs"
                              title="Open signature pad to execute agreement"
                            >
                              <PenLine className="w-3.5 h-3.5" /> Sign Agreement
                            </button>
                          )}

                          {isSigned && (
                            <button
                              onClick={() => setSigningRental(rental)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold hover:bg-emerald-100 transition-all cursor-pointer"
                              title="View immutable signed version"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Signed
                            </button>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Vehicle Return Action for Active Rentals */}
                            {rental.status === 'Active' && (
                              <button
                                onClick={() => setReturningRental(rental)}
                                title="Vehicle Return & Check-in"
                                className="p-1.5 text-blue-600 hover:text-white hover:bg-[#075EE8] rounded-lg transition-all cursor-pointer shadow-2xs"
                                aria-label="Vehicle Return"
                              >
                                <CarFront className="w-4 h-4" />
                              </button>
                            )}

                            {/* View Return Audit for Completed Rentals */}
                            {rental.status === 'Completed' && (
                              <button
                                onClick={() => setViewingReturnRental(rental)}
                                title="View Vehicle Return Audit"
                                className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <ClipboardCheck className="w-4 h-4" />
                              </button>
                            )}

                            {/* Extend / Amend Contract Action */}
                            <button
                              onClick={() => setAmendingRental(rental)}
                              title="Extend / Amend Lease Terms"
                              className="p-1.5 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <History className="w-4 h-4" />
                            </button>

                            {/* View Agreement Details */}
                            <button
                              onClick={() => setViewingRental(rental)}
                              title="View Agreement & Invoice"
                              className="p-1.5 text-slate-500 hover:text-[#075EE8] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredRentals.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* New / Edit Rental Modal */}
      <RentalModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingRental(null);
        }}
        onSave={handleSaveRental}
        rental={editingRental}
      />

      {/* Extension & Amendment Modal */}
      <RentalAmendModal
        isOpen={!!amendingRental}
        onClose={() => setAmendingRental(null)}
        rental={amendingRental}
        onSaved={(updated) => {
          setAmendingRental(null);
        }}
      />

      {/* Pickup Handover Modal */}
      <VehiclePickupModal
        isOpen={isPickupModalOpen}
        onClose={() => setIsPickupModalOpen(false)}
        onSave={handleSaveRental}
      />

      {/* View Agreement Summary & Invoice Modal */}
      <RentalDetailsModal
        isOpen={!!viewingRental}
        onClose={() => setViewingRental(null)}
        rental={viewingRental}
        onEdit={(r) => {
          setEditingRental(r);
          setIsAddModalOpen(true);
        }}
        onAmend={(r) => {
          setViewingRental(null);
          setAmendingRental(r);
        }}
        onDelete={(r) => setDeletingRental(r)}
        onViewAgreement={(r) => {
          setViewingRental(null);
          setSigningRental(r);
        }}
        onProcessReturn={(r) => {
          setViewingRental(null);
          setReturningRental(r);
        }}
        onViewReturn={(r) => {
          setViewingRental(null);
          setViewingReturnRental(r);
        }}
      />

      {/* Vehicle Return Live Modal */}
      <VehicleReturnModal
        isOpen={!!returningRental}
        onClose={() => setReturningRental(null)}
        rental={returningRental}
      />

      {/* View Return Audit Modal */}
      <VehicleReturnModal
        isOpen={!!viewingReturnRental}
        onClose={() => setViewingReturnRental(null)}
        rental={viewingReturnRental}
        isViewOnly
      />

      {/* Dual E-Signature & Agreement Document Modal */}
      <RentalAgreementModal
        isOpen={!!signingRental}
        onClose={() => setSigningRental(null)}
        rental={signingRental}
        onAgreementSigned={(updated) => {
          setSigningRental(updated);
        }}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deletingRental}
        onClose={() => setDeletingRental(null)}
        onConfirm={handleDeleteRental}
        title="Cancel Rental Contract"
        message={`Are you sure you want to cancel rental ${deletingRental?.id} for ${deletingRental?.customer || deletingRental?.driver}?`}
        confirmText="Cancel Contract"
      />
    </div>
  );
}
