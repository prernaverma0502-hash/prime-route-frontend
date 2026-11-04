import React, { useState, useMemo } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  AlertCircle,
  Plus,
  Download,
  Eye,
  Edit2,
  Trash2,
  Phone,
  Mail
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import DriverModal from './DriverModal';
import DriverDetailsModal from './DriverDetailsModal';
import { initialDrivers } from '../../data/mockData';
import { exportToCsv } from '../../utils/exportCsv';
import { formatCurrency } from '../../utils/formatters';

export default function DriversPage() {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [viewingDriver, setViewingDriver] = useState(null);
  const [deletingDriver, setDeletingDriver] = useState(null);

  const stats = useMemo(() => {
    return {
      total: drivers.length,
      active: drivers.filter((d) => d.status === 'Active').length,
      inactive: drivers.filter((d) => d.status === 'Inactive').length,
      withBalance: drivers.filter((d) => d.balance > 0).length,
    };
  }, [drivers]);

  const filteredDrivers = useMemo(() => {
    return drivers.filter((d) => {
      const matchesSearch =
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.license.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.vehicle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'All'
          ? true
          : statusFilter === 'With Balance'
          ? d.balance > 0
          : d.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [drivers, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredDrivers.length / pageSize) || 1;
  const paginatedDrivers = filteredDrivers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSaveDriver = (driverData) => {
    if (editingDriver) {
      setDrivers((prev) =>
        prev.map((d) => (d.id === driverData.id ? driverData : d))
      );
    } else {
      setDrivers((prev) => [driverData, ...prev]);
    }
    setEditingDriver(null);
  };

  const handleDeleteDriver = () => {
    if (deletingDriver) {
      setDrivers((prev) => prev.filter((d) => d.id !== deletingDriver.id));
      setDeletingDriver(null);
    }
  };

  const handleExport = () => {
    exportToCsv(
      'PrimeRoute_Drivers_Export',
      filteredDrivers.map((d) => ({
        ID: d.id,
        Name: d.name,
        Phone: d.phone,
        Email: d.email,
        License: d.license,
        LicenseExpiry: d.licenseExpiry,
        Vehicle: d.vehicle,
        Status: d.status,
        Balance: d.balance,
      }))
    );
  };

  return (
    <div className="space-y-6 animate-slide-up duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0A1E42] tracking-tight">Drivers Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Oversee certified commercial chauffeurs, license compliance, assignments &amp; payouts
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
              setEditingDriver(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 duration-150"
          >
            <Plus className="w-4 h-4" /> Add Driver
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Drivers"
          value={stats.total}
          icon={Users}
          iconColor="text-[#075EE8]"
          iconBg="bg-blue-50/90 border border-blue-100"
          badge="Verified CDL"
          badgeColor="bg-blue-50 text-[#075EE8] border-blue-200/80"
          subtitle="Certified Roster"
          change="+3 this month"
          progress={100}
          progressColor="bg-[#075EE8]"
        />
        <StatCard
          title="Active Drivers"
          value={stats.active}
          icon={UserCheck}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50/90 border border-emerald-100"
          badge={`${Math.round((stats.active / (stats.total || 1)) * 100)}% On Duty`}
          badgeColor="bg-emerald-50 text-emerald-700 border-emerald-200/80"
          subtitle="Assigned to Vehicles"
          progress={Math.round((stats.active / (stats.total || 1)) * 100)}
          progressColor="bg-emerald-500"
        />
        <StatCard
          title="Inactive / Standby"
          value={stats.inactive}
          icon={UserX}
          iconColor="text-slate-600"
          iconBg="bg-slate-100 border border-slate-200"
          badge="Available Pool"
          badgeColor="bg-slate-100 text-slate-700 border-slate-200"
          subtitle="On Leave or Reserve"
          progress={Math.round((stats.inactive / (stats.total || 1)) * 100)}
          progressColor="bg-slate-400"
        />
        <StatCard
          title="With Balance"
          value={stats.withBalance}
          icon={AlertCircle}
          iconColor="text-amber-600"
          iconBg="bg-amber-50/90 border border-amber-100"
          badge="Outstanding"
          badgeColor="bg-amber-50 text-amber-700 border-amber-200/80"
          subtitle="Reconciliation Due"
          isPositive={false}
          change="$350 Total"
          progress={40}
          progressColor="bg-amber-500"
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-80">
          <SearchBar
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            placeholder="Search driver name, phone, license, car..."
          />
        </div>

        <FilterDropdown
          label="Filter Status"
          value={statusFilter}
          onChange={(val) => {
            setStatusFilter(val);
            setCurrentPage(1);
          }}
          options={[
            { value: 'All', label: 'All Drivers' },
            { value: 'Active', label: 'Active Drivers' },
            { value: 'Inactive', label: 'Inactive Drivers' },
            { value: 'With Balance', label: 'With Outstanding Balance' },
          ]}
        />
      </div>

      {/* Drivers Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
        {paginatedDrivers.length === 0 ? (
          <EmptyState
            title="No drivers found"
            description="No drivers match your current search and filter criteria."
            actionText="Reset Filters"
            onAction={() => {
              setSearchQuery('');
              setStatusFilter('All');
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Driver</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">License / Expiry</th>
                  <th className="py-3.5 px-4">Assigned Vehicle</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Balance</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {paginatedDrivers.map((driver) => (
                  <tr
                    key={driver.id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={driver.avatar}
                          alt={driver.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-[#0A1E42] group-hover:text-[#075EE8] transition-colors">
                            {driver.name}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">{driver.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-700">{driver.phone}</p>
                      <p className="text-[11px] text-slate-400">{driver.email}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                        {driver.license}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">Exp: {driver.licenseExpiry}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-[#0A1E42]">
                        {driver.vehicle}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={driver.status} />
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`font-bold ${
                          driver.balance > 0 ? 'text-amber-600' : 'text-slate-500'
                        }`}
                      >
                        {formatCurrency(driver.balance)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingDriver(driver)}
                          title="View Details"
                          className="p-1.5 text-slate-500 hover:text-[#075EE8] hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingDriver(driver);
                            setIsAddModalOpen(true);
                          }}
                          title="Edit Driver"
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingDriver(driver)}
                          title="Delete Driver"
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
          totalItems={filteredDrivers.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>

      <DriverModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingDriver(null);
        }}
        onSave={handleSaveDriver}
        driver={editingDriver}
      />

      <DriverDetailsModal
        isOpen={!!viewingDriver}
        onClose={() => setViewingDriver(null)}
        driver={viewingDriver}
        onEdit={(d) => {
          setEditingDriver(d);
          setIsAddModalOpen(true);
        }}
        onDelete={(d) => setDeletingDriver(d)}
      />

      <ConfirmationModal
        isOpen={!!deletingDriver}
        onClose={() => setDeletingDriver(null)}
        onConfirm={handleDeleteDriver}
        title="Remove Driver Record"
        message={`Are you sure you want to delete ${deletingDriver?.name}? This action cannot be reversed.`}
        confirmText="Remove Driver"
      />
    </div>
  );
}

