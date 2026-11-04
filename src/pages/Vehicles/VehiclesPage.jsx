import React, { useState, useMemo } from 'react';
import {
  Car,
  Plus,
  Download,
  Filter,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Wrench,
  AlertCircle
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
import { initialVehicles } from '../../data/mockData';
import { useFleet } from '../../context/FleetContext';
import { exportToCsv } from '../../utils/exportCsv';
import { formatCurrency } from '../../utils/formatters';

export default function VehiclesPage() {
  const { vehicles, setVehicles } = useFleet();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [viewingVehicle, setViewingVehicle] = useState(null);
  const [deletingVehicle, setDeletingVehicle] = useState(null);

  // Statistics calculation
  const stats = useMemo(() => {
    return {
      total: vehicles.length,
      available: vehicles.filter((v) => v.status === 'Available').length,
      rented: vehicles.filter((v) => v.status === 'Rented').length,
      maintenance: vehicles.filter((v) => v.status === 'Maintenance').length,
    };
  }, [vehicles]);

  // Filtering
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesSearch =
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.driver.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
      const matchesType = typeFilter === 'All' || v.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [vehicles, searchQuery, statusFilter, typeFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredVehicles.length / pageSize) || 1;
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handlers
  const handleSaveVehicle = (vehicleData) => {
    if (editingVehicle) {
      setVehicles((prev) =>
        prev.map((v) => (v.id === vehicleData.id ? vehicleData : v))
      );
    } else {
      setVehicles((prev) => [vehicleData, ...prev]);
    }
    setEditingVehicle(null);
  };

  const handleDeleteVehicle = () => {
    if (deletingVehicle) {
      setVehicles((prev) => prev.filter((v) => v.id !== deletingVehicle.id));
      setDeletingVehicle(null);
    }
  };

  const handleExport = () => {
    exportToCsv(
      'PrimeRoute_Vehicles_Export',
      filteredVehicles.map((v) => ({
        ID: v.id,
        Name: v.name,
        Plate: v.plate,
        Make: v.make,
        Model: v.model,
        Year: v.year,
        Type: v.type,
        Fuel: v.fuel,
        Status: v.status,
        Driver: v.driver,
        DailyRate: v.dailyRate,
      }))
    );
  };

  return (
    <div className="space-y-6 animate-slide-up duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0A1E42] tracking-tight">Vehicles Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track, assign, and manage enterprise fleet vehicles and leasing contracts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all active:scale-95 duration-150"
          >
            <Download className="w-4 h-4 text-slate-500" /> Export CSV
          </button>
          <button
            onClick={() => {
              setEditingVehicle(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 duration-150"
          >
            <Plus className="w-4 h-4" /> Add Vehicle
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Fleet"
          value={stats.total}
          icon={Car}
          iconColor="text-[#075EE8]"
          iconBg="bg-blue-50/90 border border-blue-100"
          badge="100% Tracked"
          badgeColor="bg-blue-50 text-[#075EE8] border-blue-200/80"
          subtitle="Enterprise Fleet Capacity"
          change="+2 new"
          progress={100}
          progressColor="bg-[#075EE8]"
        />
        <StatCard
          title="Available Vehicles"
          value={stats.available}
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50/90 border border-emerald-100"
          badge={`${Math.round((stats.available / (stats.total || 1)) * 100)}% Ready`}
          badgeColor="bg-emerald-50 text-emerald-700 border-emerald-200/80"
          subtitle="Ready for Immediate Dispatch"
          progress={Math.round((stats.available / (stats.total || 1)) * 100)}
          progressColor="bg-emerald-500"
        />
        <StatCard
          title="Rented Vehicles"
          value={stats.rented}
          icon={Clock}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50/90 border border-indigo-100"
          badge={`${Math.round((stats.rented / (stats.total || 1)) * 100)}% Active`}
          badgeColor="bg-indigo-50 text-indigo-700 border-indigo-200/80"
          subtitle="Generating Active Revenue"
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
          subtitle="Inspection & Garage Upkeep"
          progress={Math.round((stats.maintenance / (stats.total || 1)) * 100)}
          progressColor="bg-amber-500"
        />
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-80">
          <SearchBar
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            placeholder="Search by vehicle, plate, make, or driver..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <FilterDropdown
            label="Status"
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
            options={[
              { value: 'All', label: 'All Statuses' },
              { value: 'Available', label: 'Available' },
              { value: 'Rented', label: 'Rented' },
              { value: 'Maintenance', label: 'Maintenance' },
            ]}
          />

          <FilterDropdown
            label="Type"
            value={typeFilter}
            onChange={(val) => {
              setTypeFilter(val);
              setCurrentPage(1);
            }}
            options={[
              { value: 'All', label: 'All Types' },
              { value: 'Sedan', label: 'Sedan' },
              { value: 'SUV', label: 'SUV' },
              { value: 'Truck', label: 'Truck' },
              { value: 'Electric', label: 'Electric' },
              { value: 'Luxury', label: 'Luxury' },
            ]}
          />
        </div>
      </div>

      {/* Vehicle Listing Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
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
                <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Vehicle</th>
                  <th className="py-3.5 px-4">Plate No.</th>
                  <th className="py-3.5 px-4">Type / Year</th>
                  <th className="py-3.5 px-4">Fuel &amp; Trans.</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Assigned Driver</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {paginatedVehicles.map((car) => (
                  <tr
                    key={car.id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={car.image}
                          alt={car.name}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          className="w-12 h-9 object-cover rounded-lg border border-slate-100 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-[#0A1E42] group-hover:text-[#075EE8] transition-colors">
                            {car.name}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {car.make} • {car.model}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {car.plate}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-700">{car.type}</p>
                      <p className="text-[11px] text-slate-400">{car.year}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-700">{car.fuel}</p>
                      <p className="text-[11px] text-slate-400">{car.transmission}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={car.status} />
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`font-semibold ${
                          car.driver === 'Unassigned'
                            ? 'text-slate-400 italic'
                            : 'text-[#0A1E42]'
                        }`}
                      >
                        {car.driver}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingVehicle(car)}
                          title="View Details"
                          className="p-1.5 text-slate-500 hover:text-[#075EE8] hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingVehicle(car);
                            setIsAddModalOpen(true);
                          }}
                          title="Edit Vehicle"
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingVehicle(car)}
                          title="Delete Vehicle"
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

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredVehicles.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
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

      {/* Vehicle Details Modal */}
      <VehicleDetailsModal
        isOpen={!!viewingVehicle}
        onClose={() => setViewingVehicle(null)}
        vehicle={viewingVehicle}
        onEdit={(v) => {
          setEditingVehicle(v);
          setIsAddModalOpen(true);
        }}
        onDelete={(v) => setDeletingVehicle(v)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deletingVehicle}
        onClose={() => setDeletingVehicle(null)}
        onConfirm={handleDeleteVehicle}
        title="Remove Vehicle from Fleet"
        message={`Are you sure you want to delete ${deletingVehicle?.name} (${deletingVehicle?.plate})? This will remove all associated logs.`}
        confirmText="Remove Vehicle"
      />
    </div>
  );
}

