import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Download,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Calendar,
  XCircle,
  FileText,
  KeyRound,
  PenLine,
  RotateCcw,
  ClipboardCheck,
  CarFront
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import RentalModal from './RentalModal';
import RentalDetailsModal from './RentalDetailsModal';
import VehiclePickupModal from './VehiclePickupModal';
import VehicleReturnModal from './VehicleReturnModal';
import RentalAgreementModal from '../../components/agreements/RentalAgreementModal';
import { initialRentals } from '../../data/mockData';
import { useFleet } from '../../context/FleetContext';
import { exportToCsv } from '../../utils/exportCsv';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function RentalsPage() {
  const { rentals, setRentals } = useFleet();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [editingRental, setEditingRental] = useState(null);
  const [viewingRental, setViewingRental] = useState(null);
  const [signingRental, setSigningRental] = useState(null);
  const [returningRental, setReturningRental] = useState(null);
  const [viewingReturnRental, setViewingReturnRental] = useState(null);
  const [deletingRental, setDeletingRental] = useState(null);

  const stats = useMemo(() => {
    return {
      total: rentals.length,
      active: rentals.filter((r) => r.status === 'Active').length,
      upcoming: rentals.filter((r) => r.status === 'Upcoming').length,
      completed: rentals.filter((r) => r.status === 'Completed').length,
      cancelled: rentals.filter((r) => r.status === 'Cancelled').length,
    };
  }, [rentals]);

  const filteredRentals = useMemo(() => {
    return rentals.filter((r) => {
      const matchesSearch =
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.driver.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || r.status === statusFilter;

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
      setRentals((prev) => prev.filter((r) => r.id !== deletingRental.id));
      setDeletingRental(null);
    }
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
        Amount: r.amount,
        Total: r.total,
        PaymentStatus: r.paymentStatus,
        Status: r.status,
      }))
    );
  };

  return (
    <div className="space-y-6 animate-slide-up duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0A1E42] tracking-tight">Rentals &amp; Leasing</h1>
          <p className="text-xs text-slate-500 mt-1">
            Dispatch commercial fleet reservations, track active lease agreements, and issue invoices
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all active:scale-95 duration-150 cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" /> Export CSV
          </button>
          <button
            onClick={() => setIsPickupModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#071D49] hover:bg-[#0D2D6C] text-white text-xs font-bold shadow-md shadow-slate-900/10 transition-all active:scale-95 duration-150 cursor-pointer"
          >
            <KeyRound className="w-4 h-4 text-emerald-400" /> Vehicle Pickup
          </button>
          <button
            onClick={() => {
              setEditingRental(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 duration-150 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create Rental
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Rentals"
          value={stats.total}
          icon={FileSpreadsheet}
          iconColor="text-[#075EE8]"
          iconBg="bg-blue-50/90 border border-blue-100"
          subtitle="Signed Agreements"
          change="+18% YoY"
          progress={100}
          progressColor="bg-[#075EE8]"
        />
        <StatCard
          title="Active Leases"
          value={stats.active}
          icon={Clock}
          iconColor="text-blue-600"
          iconBg="bg-blue-50/90 border border-blue-100"
          badge="Live Dispatch"
          badgeColor="bg-blue-50 text-blue-700 border-blue-200/80"
          subtitle="Vehicles on Duty"
          progress={Math.round((stats.active / (stats.total || 1)) * 100)}
          progressColor="bg-blue-600"
        />
        <StatCard
          title="Upcoming"
          value={stats.upcoming}
          icon={Calendar}
          iconColor="text-amber-600"
          iconBg="bg-amber-50/90 border border-amber-100"
          badge="Next 7 Days"
          badgeColor="bg-amber-50 text-amber-700 border-amber-200/80"
          subtitle="Reserved Pipeline"
          progress={Math.round((stats.upcoming / (stats.total || 1)) * 100)}
          progressColor="bg-amber-500"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50/90 border border-emerald-100"
          badge="Settled"
          badgeColor="bg-emerald-50 text-emerald-700 border-emerald-200/80"
          subtitle="Successfully Returned"
          progress={Math.round((stats.completed / (stats.total || 1)) * 100)}
          progressColor="bg-emerald-500"
        />
        <StatCard
          title="Cancelled"
          value={stats.cancelled}
          icon={XCircle}
          iconColor="text-rose-500"
          iconBg="bg-rose-50/90 border border-rose-100"
          badge="Voided"
          badgeColor="bg-rose-50 text-rose-700 border-rose-200/80"
          subtitle="Zero Penalties"
          isPositive={false}
          progress={0}
          progressColor="bg-rose-400"
        />
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Quick Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['All', 'Active', 'Awaiting Signature', 'Renewed', 'Completed', 'Terminated'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setStatusFilter(tab);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                statusFilter === tab
                  ? 'bg-[#075EE8] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="w-full md:w-80">
          <SearchBar
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            placeholder="Search agreement ID, customer, vehicle..."
          />
        </div>
      </div>

      {/* Rental Agreements Section Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-[#075EE8]" />
          </div>
          <div>
            <h2 className="text-lg font-black text-[#0A1E42] tracking-tight">Rental Agreements</h2>
            <p className="text-xs text-slate-500">
              Active commercial lease contracts, legal agreements, and fleet dispatch records
            </p>
          </div>
        </div>

        <div className="text-xs font-semibold text-slate-500 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/80 shadow-xs self-start sm:self-auto">
          Total Contracts: <span className="font-bold text-[#075EE8]">{filteredRentals.length}</span>
        </div>
      </div>

      {/* Rentals Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
        {paginatedRentals.length === 0 ? (
          <EmptyState
            title="No rentals found"
            description="No rental records match your current filter settings."
            actionText="Clear Filter"
            onAction={() => {
              setSearchQuery('');
              setStatusFilter('All');
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[880px]">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Rental ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Vehicle &amp; Chauffeur</th>
                  <th className="py-3.5 px-4">Dates</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Agreement</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {paginatedRentals.map((rental) => (
                  <tr
                    key={rental.id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#075EE8]">
                      {rental.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#0A1E42] group-hover:text-[#075EE8] transition-colors">
                        {rental.customer}
                      </p>
                      <p className="text-[11px] text-slate-400">{rental.rentalType}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{rental.vehicle}</p>
                      <p className="text-[11px] text-slate-400">Driver: {rental.driver}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-700">{formatDate(rental.startDate)}</p>
                      <p className="text-[11px] text-slate-400">to {formatDate(rental.endDate)}</p>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-[#0A1E42]">
                      {formatCurrency(rental.total || rental.amount)}
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={rental.paymentStatus} />
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={rental.status} />
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSigningRental(rental)}
                        title="Open Rental Agreement"
                        className="p-1.5 text-slate-600 hover:text-[#075EE8] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center active:scale-95"
                        aria-label="Open Rental Agreement"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Vehicle Return Action for Active Rentals */}
                        {rental.status === 'Active' && (
                          <button
                            onClick={() => setReturningRental(rental)}
                            title="Vehicle Return"
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

                        <button
                          onClick={() => setViewingRental(rental)}
                          title="View Agreement & Invoice"
                          className="p-1.5 text-slate-500 hover:text-[#075EE8] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingRental(rental);
                            setIsAddModalOpen(true);
                          }}
                          title="Edit Agreement"
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingRental(rental)}
                          title="Cancel Rental"
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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

      <RentalModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingRental(null);
        }}
        onSave={handleSaveRental}
        rental={editingRental}
      />

      <VehiclePickupModal
        isOpen={isPickupModalOpen}
        onClose={() => setIsPickupModalOpen(false)}
        onSave={handleSaveRental}
      />

      <RentalDetailsModal
        isOpen={!!viewingRental}
        onClose={() => setViewingRental(null)}
        rental={viewingRental}
        onEdit={(r) => {
          setEditingRental(r);
          setIsAddModalOpen(true);
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

      <VehicleReturnModal
        isOpen={!!returningRental}
        onClose={() => setReturningRental(null)}
        rental={returningRental}
      />

      <VehicleReturnModal
        isOpen={!!viewingReturnRental}
        onClose={() => setViewingReturnRental(null)}
        rental={viewingReturnRental}
        isViewOnly
      />

      <RentalAgreementModal
        isOpen={!!signingRental}
        onClose={() => setSigningRental(null)}
        rental={signingRental}
        onAgreementSigned={(updated) => {
          setSigningRental(updated);
        }}
      />

      <ConfirmationModal
        isOpen={!!deletingRental}
        onClose={() => setDeletingRental(null)}
        onConfirm={handleDeleteRental}
        title="Cancel Rental Contract"
        message={`Are you sure you want to cancel rental ${deletingRental?.id} for ${deletingRental?.customer}?`}
        confirmText="Cancel Contract"
      />
    </div>
  );
}

