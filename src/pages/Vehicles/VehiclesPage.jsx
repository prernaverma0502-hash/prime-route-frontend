import React, { useState, useMemo } from 'react';
import {
  Car,
  Plus,
  Download,
  Printer,
  Eye,
  Edit2,
  Archive,
  Trash2,
  CheckCircle2,
  Clock,
  Wrench,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import VehicleModal from './VehicleModal';
import VehicleDetailsModal from './VehicleDetailsModal';
import ArchiveVehicleModal from './ArchiveVehicleModal';
import { useFleet } from '../../context/FleetContext';
import Can from '../../auth/Can';
import { vehiclesApi, auditApi } from '../../api';
import { exportToCsv } from '../../utils/exportCsv';
import { formatCurrency } from '../../utils/formatters';

const CONTROLLED_STATUSES = [
  'All',
  'Available',
  'Reserved',
  'Rented',
  'Maintenance',
  'Unavailable',
  'Sold/Retired',
];

const VEHICLE_TYPES = [
  'All',
  'Sedan',
  'SUV',
  'Truck',
  'Electric',
  'Luxury',
];

export default function VehiclesPage() {
  const { vehicles, setVehicles } = useFleet();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Sorting State
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [viewingVehicle, setViewingVehicle] = useState(null);
  const [archivingVehicle, setArchivingVehicle] = useState(null);
  const [deletingVehicle, setDeletingVehicle] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Statistics calculation matching controlled statuses
  const stats = useMemo(() => {
    return {
      total: vehicles.length,
      available: vehicles.filter((v) => v.status === 'Available').length,
      rented: vehicles.filter((v) => v.status === 'Rented').length,
      maintenance: vehicles.filter((v) => v.status === 'Maintenance').length,
      retired: vehicles.filter((v) => v.status === 'Sold/Retired').length,
    };
  }, [vehicles]);

  // Handle Column Header Sort Toggle
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Helper to resolve vehicle Revenue (MTD)
  const getRevenueMtd = (vehicle) => {
    if (vehicle.revenueMtd !== undefined) return Number(vehicle.revenueMtd);
    if (vehicle.revenue !== undefined) return Number(vehicle.revenue);
    const rate = Number(vehicle.dailyRate) || 65;
    if (vehicle.status === 'Rented') return rate * 26;
    if (vehicle.status === 'Available') return rate * 12;
    if (vehicle.status === 'Maintenance') return rate * 8;
    return 0;
  };

  // Filtering & Sorting Pipeline
  const filteredAndSortedVehicles = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    const filtered = vehicles.filter((v) => {
      const idMatch = (v.id || '').toLowerCase().includes(q);
      const nameMatch = (v.name || '').toLowerCase().includes(q);
      const makeMatch = (v.make || '').toLowerCase().includes(q);
      const modelMatch = (v.model || '').toLowerCase().includes(q);
      const plateMatch = (v.plate || '').toLowerCase().includes(q);
      const vinMatch = (v.vin || '').toLowerCase().includes(q);
      const driverMatch = (v.driver || '').toLowerCase().includes(q);

      const matchesSearch =
        !q || idMatch || nameMatch || makeMatch || modelMatch || plateMatch || vinMatch || driverMatch;

      const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
      const matchesType = typeFilter === 'All' || v.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });

    return filtered.sort((a, b) => {
      let valA, valB;

      switch (sortField) {
        case 'id':
          valA = a.id || '';
          valB = b.id || '';
          break;
        case 'make':
          valA = `${a.make || ''} ${a.model || ''}`.trim();
          valB = `${b.make || ''} ${b.model || ''}`.trim();
          break;
        case 'year':
          valA = Number(a.year) || 0;
          valB = Number(b.year) || 0;
          break;
        case 'vin':
          valA = a.vin || '';
          valB = b.vin || '';
          break;
        case 'status':
          valA = a.status || '';
          valB = b.status || '';
          break;
        case 'driver':
          valA = a.driver || 'Unassigned';
          valB = b.driver || 'Unassigned';
          break;
        case 'rate':
          valA = Number(a.dailyRate) || 0;
          valB = Number(b.dailyRate) || 0;
          break;
        case 'revenueMtd':
          valA = getRevenueMtd(a);
          valB = getRevenueMtd(b);
          break;
        default:
          valA = a.id || '';
          valB = b.id || '';
      }

      if (typeof valA === 'string') {
        const comp = valA.localeCompare(valB);
        return sortDirection === 'asc' ? comp : -comp;
      }
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    });
  }, [vehicles, searchQuery, statusFilter, typeFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedVehicles.length / pageSize) || 1;
  const paginatedVehicles = filteredAndSortedVehicles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Save handler (Add or Edit)
  const handleSaveVehicle = (vehicleData) => {
    const finalVehicle = {
      ...vehicleData,
      name: vehicleData.name || `${vehicleData.make} ${vehicleData.model}`.trim() || 'Fleet Vehicle',
      dailyRate: Number(vehicleData.dailyRate) || 65,
      purchasePrice: Number(vehicleData.purchasePrice) || 28500,
      year: Number(vehicleData.year) || 2024,
      status: vehicleData.status || 'Available',
      image: vehicleData.image || 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&auto=format&fit=crop&q=80',
    };

    if (editingVehicle) {
      setVehicles((prev) =>
        prev.map((v) => (v.id === finalVehicle.id ? finalVehicle : v))
      );
      vehiclesApi.updateVehicle(finalVehicle.id, finalVehicle).catch(console.error);
      auditApi.appendAuditLog({
        action: 'Vehicle Updated',
        module: 'Vehicles',
        details: `Vehicle ${finalVehicle.id} (${finalVehicle.name}) updated.`
      });
      setToastMessage(`✓ Vehicle ${finalVehicle.id} (${finalVehicle.name}) updated successfully.`);
    } else {
      setVehicles((prev) => [finalVehicle, ...prev]);
      vehiclesApi.createVehicle(finalVehicle).catch(console.error);
      auditApi.appendAuditLog({
        action: 'Vehicle Created',
        module: 'Vehicles',
        details: `New vehicle ${finalVehicle.id} (${finalVehicle.name}) added to fleet.`
      });
      setToastMessage(`✓ New vehicle ${finalVehicle.id} (${finalVehicle.name}) successfully added to fleet!`);
      // Reset filters and navigate to page 1 so user immediately sees newly added vehicle
      setSearchQuery('');
      setStatusFilter('All');
      setTypeFilter('All');
      setCurrentPage(1);
    }
    setEditingVehicle(null);
    setIsAddModalOpen(false);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Delete / Remove Vehicle Handler
  const handleConfirmDelete = () => {
    if (!deletingVehicle) return;
    const targetId = deletingVehicle.id;
    const targetName = deletingVehicle.name || deletingVehicle.id;

    setVehicles((prev) => prev.filter((v) => v.id !== targetId));
    vehiclesApi.deleteVehicle(targetId).catch(console.error);
    auditApi.appendAuditLog({
      action: 'Vehicle Removed',
      module: 'Vehicles',
      details: `Vehicle ${targetId} (${targetName}) permanently deleted from fleet registry.`
    });

    setToastMessage(`✓ Vehicle ${targetId} (${targetName}) removed from fleet registry.`);
    setTimeout(() => setToastMessage(null), 4000);
    setDeletingVehicle(null);
  };

  // Archive Handler (Changes status to Sold/Retired, stores reason)
  const handleConfirmArchive = ({ vehicleId, archiveReason, archiveDate, salvageValue, notes }) => {
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === vehicleId) {
          return {
            ...v,
            status: 'Sold/Retired',
            isArchived: true,
            archiveReason,
            archiveDate,
            salvageValue,
            archiveNotes: notes,
          };
        }
        return v;
      })
    );
    setArchivingVehicle(null);
  };

  // Export CSV Handler
  const handleExport = () => {
    exportToCsv(
      'PrimeRoute_Fleet_Vehicles_Export',
      filteredAndSortedVehicles.map((v) => ({
        'Vehicle ID': v.id,
        Make: v.make || '',
        Model: v.model || '',
        Year: v.year || '',
        VIN: v.vin || '',
        'License Plate': v.plate || '',
        Status: v.status || 'Available',
        'Assigned Driver': v.driver || 'Unassigned',
        'Daily Rate ($/day)': v.dailyRate || 65,
        'Revenue MTD ($)': getRevenueMtd(v),
        Mileage: v.mileage || '',
        Location: v.location || v.depotLocation || 'JFK Airport Fleet Hub',
        'Purchase Price ($)': v.purchasePrice || 28500,
        'Financing Lender': v.lenderName || '',
      }))
    );
  };

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // Render Sort Header Indicator
  const renderSortIndicator = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-300 ml-1 inline opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-[#075EE8] ml-1 inline" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#075EE8] ml-1 inline" />
    );
  };

  return (
    <div className="space-y-6 animate-slide-up duration-300">
      {/* Print-only CSS rules injected */}
      <style>{`
        @media print {
          nav, aside, header, .no-print, button, input, select {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .print-area {
            display: block !important;
            width: 100% !important;
          }
        }
      `}</style>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-black text-[#0A1E42] tracking-tight">Vehicles Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise fleet inventory, acquisition finance, compliance lifecycle, and profitability
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrint}
            title="Print Fleet Table"
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <Can module="vehicles" do="export">
            <button
              type="button"
              onClick={handleExport}
              title="Export to CSV"
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export CSV</span>
            </button>
          </Can>

          <Can module="vehicles" do="add">
            <button
              type="button"
              onClick={() => {
                setEditingVehicle(null);
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Vehicle</span>
            </button>
          </Can>
        </div>
      </div>

      
      {/* Ephemeral Feedback Toast */}
      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 text-xs font-bold text-emerald-800 animate-slide-down shadow-xs no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 no-print">
        <StatCard
          title="Total Fleet"
          value={stats.total}
          icon={Car}
          iconColor="text-[#075EE8]"
          iconBg="bg-blue-50/90 border border-blue-100"
          badge="100% Tracked"
          badgeColor="bg-blue-50 text-[#075EE8] border-blue-200/80"
          subtitle="Enterprise Capacity"
          change="+3 this month"
          progress={100}
          progressColor="bg-[#075EE8]"
        />
        <StatCard
          title="Available"
          value={stats.available}
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50/90 border border-emerald-100"
          badge={`${Math.round((stats.available / (stats.total || 1)) * 100)}% Ready`}
          badgeColor="bg-emerald-50 text-emerald-700 border-emerald-200/80"
          subtitle="Immediate Dispatch"
          progress={Math.round((stats.available / (stats.total || 1)) * 100)}
          progressColor="bg-emerald-500"
        />
        <StatCard
          title="Active Rented"
          value={stats.rented}
          icon={Clock}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50/90 border border-indigo-100"
          badge={`${Math.round((stats.rented / (stats.total || 1)) * 100)}% Leased`}
          badgeColor="bg-indigo-50 text-indigo-700 border-indigo-200/80"
          subtitle="Revenue Generating"
          progress={Math.round((stats.rented / (stats.total || 1)) * 100)}
          progressColor="bg-indigo-600"
        />
        <StatCard
          title="In Maintenance"
          value={stats.maintenance}
          icon={Wrench}
          iconColor="text-amber-600"
          iconBg="bg-amber-50/90 border border-amber-100"
          badge={`${Math.round((stats.maintenance / (stats.total || 1)) * 100)}% Workshop`}
          badgeColor="bg-amber-50 text-amber-700 border-amber-200/80"
          subtitle="Inspection & Garage"
          progress={Math.round((stats.maintenance / (stats.total || 1)) * 100)}
          progressColor="bg-amber-500"
        />
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] flex flex-col md:flex-row items-center justify-between gap-3.5 no-print">
        <div className="w-full md:w-80">
          <SearchBar
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            placeholder="Search ID, make, model, VIN, plate, driver..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter (Controlled List) */}
          <FilterDropdown
            label="Status"
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
            options={CONTROLLED_STATUSES.map((s) => ({
              value: s,
              label: s === 'All' ? 'All Statuses' : s,
            }))}
          />

          {/* Type Filter */}
          <FilterDropdown
            label="Type"
            value={typeFilter}
            onChange={(val) => {
              setTypeFilter(val);
              setCurrentPage(1);
            }}
            options={VEHICLE_TYPES.map((t) => ({
              value: t,
              label: t === 'All' ? 'All Vehicle Types' : t,
            }))}
          />

          {(searchQuery || statusFilter !== 'All' || typeFilter !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('All');
                setTypeFilter('All');
                setCurrentPage(1);
              }}
              className="text-xs text-[#075EE8] font-bold hover:underline cursor-pointer ml-1"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Vehicle Listing Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden print-area">
        {paginatedVehicles.length === 0 ? (
          <EmptyState
            title="No vehicles found"
            description="No vehicles match your current search and filter criteria."
            actionText="Reset Filters"
            onAction={() => {
              setSearchQuery('');
              setStatusFilter('All');
              setTypeFilter('All');
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
                  {/* 1. ID */}
                  <th
                    onClick={() => handleSort('id')}
                    className="py-3.5 px-4 cursor-pointer group hover:text-[#075EE8] transition-colors"
                  >
                    <span>ID</span>
                    {renderSortIndicator('id')}
                  </th>

                  {/* 2. Make/Model */}
                  <th
                    onClick={() => handleSort('make')}
                    className="py-3.5 px-4 cursor-pointer group hover:text-[#075EE8] transition-colors"
                  >
                    <span>Make / Model</span>
                    {renderSortIndicator('make')}
                  </th>

                  {/* 3. Year */}
                  <th
                    onClick={() => handleSort('year')}
                    className="py-3.5 px-3 cursor-pointer group hover:text-[#075EE8] transition-colors"
                  >
                    <span>Year</span>
                    {renderSortIndicator('year')}
                  </th>

                  {/* 4. VIN */}
                  <th
                    onClick={() => handleSort('vin')}
                    className="py-3.5 px-4 cursor-pointer group hover:text-[#075EE8] transition-colors"
                  >
                    <span>VIN</span>
                    {renderSortIndicator('vin')}
                  </th>

                  {/* 5. Status */}
                  <th
                    onClick={() => handleSort('status')}
                    className="py-3.5 px-4 cursor-pointer group hover:text-[#075EE8] transition-colors"
                  >
                    <span>Status</span>
                    {renderSortIndicator('status')}
                  </th>

                  {/* 6. Assigned Driver */}
                  <th
                    onClick={() => handleSort('driver')}
                    className="py-3.5 px-4 cursor-pointer group hover:text-[#075EE8] transition-colors"
                  >
                    <span>Assigned Driver</span>
                    {renderSortIndicator('driver')}
                  </th>

                  {/* 7. Rate */}
                  <th
                    onClick={() => handleSort('rate')}
                    className="py-3.5 px-4 text-right cursor-pointer group hover:text-[#075EE8] transition-colors"
                  >
                    <span>Rate</span>
                    {renderSortIndicator('rate')}
                  </th>

                  {/* 8. Revenue (MTD) */}
                  <th
                    onClick={() => handleSort('revenueMtd')}
                    className="py-3.5 px-4 text-right cursor-pointer group hover:text-[#075EE8] transition-colors"
                  >
                    <span>Revenue (MTD)</span>
                    {renderSortIndicator('revenueMtd')}
                  </th>

                  {/* 9. Actions */}
                  <th className="py-3.5 px-4 text-right no-print">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {paginatedVehicles.map((car) => {
                  const mtdRev = getRevenueMtd(car);
                  return (
                    <tr
                      key={car.id}
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      {/* 1. ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {car.id}
                      </td>

                      {/* 2. Make/Model */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={car.image}
                            alt={car.name}
                            onError={(e) => {
                              e.currentTarget.src = '/placeholders/vehicle-default.svg';
                            }}
                            className="w-11 h-8 object-cover rounded-lg border border-slate-100 shrink-0 shadow-xs"
                          />
                          <div className="min-w-0">
                            <p
                              onClick={() => setViewingVehicle(car)}
                              className="font-bold text-[#0A1E42] group-hover:text-[#075EE8] transition-colors cursor-pointer truncate max-w-[150px]"
                            >
                              {car.name || `${car.make} ${car.model}`}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate">
                              {car.plate} • {car.type || 'Sedan'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* 3. Year */}
                      <td className="py-3.5 px-3 font-semibold text-slate-600">
                        {car.year}
                      </td>

                      {/* 4. VIN */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 select-all">
                        {car.vin || '4T1B11HK5JU192831'}
                      </td>

                      {/* 5. Status (Controlled List) */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={car.status} />
                      </td>

                      {/* 6. Assigned Driver */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-semibold ${
                            !car.driver || car.driver === 'Unassigned'
                              ? 'text-slate-400 italic'
                              : 'text-[#0A1E42]'
                          }`}
                        >
                          {car.driver || 'Unassigned'}
                        </span>
                      </td>

                      {/* 7. Rate */}
                      <td className="py-3.5 px-4 text-right font-bold text-slate-800">
                        {formatCurrency(car.dailyRate || 65)}/d
                      </td>

                      {/* 8. Revenue (MTD) */}
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-600">
                        {formatCurrency(mtdRev)}
                      </td>

                      {/* 9. Actions */}
                      <td className="py-3.5 px-4 text-right no-print">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setViewingVehicle(car)}
                            title="View Vehicle Details"
                            className="p-1.5 text-slate-500 hover:text-[#075EE8] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <Can module="vehicles" do="edit">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingVehicle(car);
                                setIsAddModalOpen(true);
                              }}
                              title="Edit Vehicle"
                              className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </Can>

                          {/* Archive vehicle */}
                          <Can module="vehicles" do="archive">
                            <button
                              type="button"
                              onClick={() => setArchivingVehicle(car)}
                              title="Archive Vehicle"
                              className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          </Can>

                          {/* Delete / Remove Vehicle */}
                          <Can module="vehicles" do="archive">
                            <button
                              type="button"
                              onClick={() => setDeletingVehicle(car)}
                              title="Delete / Remove Vehicle"
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </Can>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="no-print">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredAndSortedVehicles.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Add / Edit Vehicle Modal */}
      <VehicleModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingVehicle(null);
        }}
        onSave={handleSaveVehicle}
        vehicle={editingVehicle}
      />

      {/* 7-Tab Vehicle Details Modal */}
      <VehicleDetailsModal
        isOpen={!!viewingVehicle}
        onClose={() => setViewingVehicle(null)}
        vehicle={viewingVehicle}
        onEdit={(v) => {
          setEditingVehicle(v);
          setIsAddModalOpen(true);
        }}
        onArchive={(v) => setArchivingVehicle(v)}
        onDelete={(v) => setDeletingVehicle(v)}
      />

      {/* Delete / Remove Vehicle Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deletingVehicle}
        onClose={() => setDeletingVehicle(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Vehicle From Fleet"
        message={`Are you sure you want to permanently remove ${deletingVehicle?.name || 'this vehicle'} (${deletingVehicle?.id} • ${deletingVehicle?.plate}) from the active fleet registry? This action cannot be undone.`}
        confirmText="Remove Vehicle"
        isDanger={true}
      />

      {/* Archive Instead of Delete Modal */}
      <ArchiveVehicleModal
        isOpen={!!archivingVehicle}
        onClose={() => setArchivingVehicle(null)}
        vehicle={archivingVehicle}
        onConfirmArchive={handleConfirmArchive}
      />
    </div>
  );
}
