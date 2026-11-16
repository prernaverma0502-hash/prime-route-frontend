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
  Archive,
  Phone,
  Mail,
  Lock,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Receipt,
  DollarSign,
  AlertTriangle,
  Clock,
  Printer,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { driversApi, auditApi } from '../../api';
import StatCard from '../../components/common/StatCard';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import DriverModal from './DriverModal';
import DriverDetailsModal from './DriverDetailsModal';
import DriverStatementModal from './DriverStatementModal';
import ArchiveDriverModal from './ArchiveDriverModal';
import OverdueCollectionsView from './OverdueCollectionsView';
import RecordPaymentModal from './RecordPaymentModal';
import { useFleet } from '../../context/FleetContext';
import { useRole } from '../../context/RoleContext';
import { shouldMaskDriverData } from '../../auth/permissions';
import { maskLicense } from '../../utils/masking';
import Can from '../../auth/Can';
import { exportToCsv } from '../../utils/exportCsv';
import { formatCurrency } from '../../utils/formatters';

export default function DriversPage() {
  const { drivers, setDrivers, updateVehicleStatus } = useFleet();
  const { currentRoleId } = useRole();
  const shouldMask = shouldMaskDriverData(currentRoleId);

  // View state: 'all' (Driver Roster) or 'overdue' (Overdue & Collections)
  const [activeView, setActiveView] = useState('all');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Sorting State
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [viewingDriver, setViewingDriver] = useState(null);
  const [statementDriver, setStatementDriver] = useState(null);
  const [archivingDriver, setArchivingDriver] = useState(null);
  const [deletingDriver, setDeletingDriver] = useState(null);
  const [paymentDriver, setPaymentDriver] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Statistics calculation
  const stats = useMemo(() => {
    return {
      total: drivers.length,
      active: drivers.filter((d) => d.status === 'Active').length,
      inactive: drivers.filter((d) => d.status === 'Inactive' || d.status === 'Archived').length,
      withBalance: drivers.filter((d) => Number(d.balance) > 0).length,
      totalBalance: drivers.reduce((sum, d) => sum + (Number(d.balance) || 0), 0),
    };
  }, [drivers]);

  // Handle Sort Toggle
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and Sort Pipeline
  const filteredAndSortedDrivers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    const filtered = drivers.filter((d) => {
      const nameMatch = (d.name || '').toLowerCase().includes(q);
      const emailMatch = (d.email || '').toLowerCase().includes(q);
      const phoneMatch = (d.phone || '').toLowerCase().includes(q);
      const licenseMatch = (d.license || '').toLowerCase().includes(q);
      const vehicleMatch = (d.vehicle || '').toLowerCase().includes(q);
      const idMatch = (d.id || '').toLowerCase().includes(q);

      const matchesSearch =
        !q || nameMatch || emailMatch || phoneMatch || licenseMatch || vehicleMatch || idMatch;

      const matchesStatus =
        statusFilter === 'All'
          ? true
          : statusFilter === 'With Balance'
          ? Number(d.balance) > 0
          : d.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      let valA, valB;

      switch (sortField) {
        case 'name':
          valA = a.name || '';
          valB = b.name || '';
          break;
        case 'id':
          valA = a.id || '';
          valB = b.id || '';
          break;
        case 'licenseExpiry':
          valA = a.licenseExpiry || '';
          valB = b.licenseExpiry || '';
          break;
        case 'balance':
          valA = Number(a.balance) || 0;
          valB = Number(b.balance) || 0;
          break;
        case 'status':
          valA = a.status || '';
          valB = b.status || '';
          break;
        default:
          valA = a.name || '';
          valB = b.name || '';
      }

      if (typeof valA === 'string') {
        const comp = valA.localeCompare(valB);
        return sortDirection === 'asc' ? comp : -comp;
      }
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    });
  }, [drivers, searchQuery, statusFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedDrivers.length / pageSize) || 1;
  const paginatedDrivers = filteredAndSortedDrivers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Save Driver (Add or Edit)
  const handleSaveDriver = (driverData) => {
    if (editingDriver) {
      setDrivers((prev) =>
        prev.map((d) => (d.id === driverData.id ? { ...d, ...driverData } : d))
      );
      driversApi.updateDriver(driverData.id, driverData).catch(console.error);
      auditApi.appendAuditLog({
        action: 'Driver Updated',
        module: 'Drivers',
        details: `Driver ${driverData.name} (${driverData.id}) profile updated.`
      });
      setToastMessage(`✓ Driver ${driverData.name} (${driverData.id}) updated successfully.`);
    } else {
      setDrivers((prev) => [driverData, ...prev]);
      driversApi.createDriver(driverData).catch(console.error);
      auditApi.appendAuditLog({
        action: 'Driver Registered',
        module: 'Drivers',
        details: `New driver ${driverData.name} (${driverData.id}) registered in fleet.`
      });
      setToastMessage(`✓ New driver ${driverData.name} (${driverData.id}) registered successfully!`);
      setSearchQuery('');
      setStatusFilter('All');
      setCurrentPage(1);
    }
    setEditingDriver(null);
    setIsAddModalOpen(false);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Delete / Remove Driver
  const handleConfirmDelete = () => {
    if (!deletingDriver) return;
    const targetId = deletingDriver.id;
    const targetName = deletingDriver.name || targetId;

    // If driver was assigned to a vehicle, unassign the vehicle and set it Available
    if (deletingDriver.vehicle && deletingDriver.vehicle !== 'Unassigned') {
      updateVehicleStatus(deletingDriver.vehicle, 'Available', null);
    }

    setDrivers((prev) => prev.filter((d) => d.id !== targetId));
    driversApi.deleteDriver(targetId).catch(console.error);
    auditApi.appendAuditLog({
      action: 'Driver Removed',
      module: 'Drivers',
      details: `Driver ${targetName} (${targetId}) permanently removed from fleet registry.`
    });

    setToastMessage(`✓ Driver ${targetName} (${targetId}) removed successfully.`);
    setTimeout(() => setToastMessage(null), 4000);
    setDeletingDriver(null);
  };

  // Confirm Archive Driver
  const handleConfirmArchive = ({ driverId, archiveReason, archiveDate, unassignVehicle, notes }) => {
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id === driverId) {
          const updated = {
            ...d,
            status: 'Inactive',
            isArchived: true,
            archiveReason,
            archiveDate,
            archiveNotes: notes,
            ...(unassignVehicle ? { vehicle: 'Unassigned' } : {}),
          };
          if (unassignVehicle && d.vehicle && d.vehicle !== 'Unassigned') {
            updateVehicleStatus(d.vehicle, 'Available', null);
          }
          return updated;
        }
        return d;
      })
    );
    setArchivingDriver(null);
  };

  // Record Payment
  const handleSavePayment = ({ driverId, amount, paymentMethod, reference, notes }) => {
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id === driverId) {
          const currentBal = Number(d.balance) || 0;
          const newBal = Math.max(0, currentBal - amount);
          return {
            ...d,
            balance: newBal,
            lastPaymentDate: new Date().toISOString().split('T')[0],
          };
        }
        return d;
      })
    );
    setPaymentDriver(null);
  };

  // Export CSV Handler
  const handleExport = () => {
    exportToCsv(
      'PrimeRoute_Drivers_Export',
      filteredAndSortedDrivers.map((d) => ({
        'Driver ID': d.id,
        Name: d.name,
        Phone: d.phone,
        Email: d.email,
        Address: shouldMask ? '[Restricted PII]' : d.address || '',
        'DOB': shouldMask ? '••••-••-••' : d.dob || '',
        'License Number': shouldMask ? maskLicense(d.license) : d.license,
        'License State': d.licenseState || 'NY',
        'License Expiry': d.licenseExpiry,
        'Assigned Vehicle': d.vehicle,
        Status: d.status,
        'Outstanding Balance ($)': d.balance,
        'Start Date': d.startDate || d.joiningDate || '',
        'Emergency Contact': d.emergencyContact || '',
      }))
    );
  };

  const renderSortIndicator = (field) => {
    if (sortField !== field) {
      return (
        <ArrowUpDown className="w-3 h-3 text-slate-300 ml-1 inline opacity-0 group-hover:opacity-100 transition-opacity" />
      );
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-[#075EE8] ml-1 inline" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#075EE8] ml-1 inline" />
    );
  };

  return (
    <div className="space-y-6 animate-slide-up duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-[#0A1E42] tracking-tight">Drivers Management</h1>
            {shouldMask && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                <Lock className="w-3 h-3 text-amber-600" />
                PII Privacy Protected
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Oversee certified commercial chauffeurs, license compliance, assignments &amp; payouts
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Can module="drivers" do="export">
            <button
              type="button"
              onClick={handleExport}
              title="Export CSV Roster"
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export CSV</span>
            </button>
          </Can>

          <Can module="drivers" do="add">
            <button
              type="button"
              onClick={() => {
                setEditingDriver(null);
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Driver</span>
            </button>
          </Can>
        </div>
      </div>

      {/* Ephemeral Feedback Toast */}
      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 text-xs font-bold text-emerald-800 animate-slide-down shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
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
          title="Delinquent Balances"
          value={stats.withBalance}
          icon={AlertCircle}
          iconColor="text-amber-600"
          iconBg="bg-amber-50/90 border border-amber-100"
          badge="Collections"
          badgeColor="bg-amber-50 text-amber-700 border-amber-200/80"
          subtitle="Total Due"
          isPositive={false}
          change={formatCurrency(stats.totalBalance)}
          progress={40}
          progressColor="bg-amber-500"
        />
      </div>

      {/* Main View Mode Navigation Tabs: All Drivers vs Overdue and Collections */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-px">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveView('all')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeView === 'all'
                ? 'border-[#075EE8] text-[#075EE8]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>All Drivers Roster ({drivers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('overdue')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeView === 'overdue'
                ? 'border-amber-600 text-amber-700 bg-amber-50/40 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Overdue &amp; Collections View</span>
            {stats.withBalance > 0 && (
              <span className="px-2 py-0.2 rounded-full text-[10px] font-extrabold bg-amber-500 text-white">
                {stats.withBalance}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ACTIVE VIEW: OVERDUE & COLLECTIONS */}
      {activeView === 'overdue' && (
        <OverdueCollectionsView
          drivers={drivers}
          onRecordPayment={(d) => setPaymentDriver(d)}
          onViewDriver={(d) => setViewingDriver(d)}
          onOpenStatement={(d) => setStatementDriver(d)}
        />
      )}

      {/* ACTIVE VIEW: ALL DRIVERS LIST */}
      {activeView === 'all' && (
        <div className="space-y-4">
          {/* Search and Filters Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-80">
              <SearchBar
                value={searchQuery}
                onChange={(val) => {
                  setSearchQuery(val);
                  setCurrentPage(1);
                }}
                placeholder="Search driver name, phone, license, car, ID..."
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
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
                  { value: 'Inactive', label: 'Inactive / Standby' },
                  { value: 'With Balance', label: 'With Outstanding Balance' },
                ]}
              />

              {(searchQuery || statusFilter !== 'All') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('All');
                    setCurrentPage(1);
                  }}
                  className="text-xs text-[#075EE8] font-bold hover:underline cursor-pointer ml-1"
                >
                  Reset Filters
                </button>
              )}
            </div>
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
                    <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
                      <th
                        onClick={() => handleSort('name')}
                        className="py-3.5 px-4 cursor-pointer group hover:text-[#075EE8] transition-colors"
                      >
                        <span>Driver</span>
                        {renderSortIndicator('name')}
                      </th>

                      <th className="py-3.5 px-4">Contact</th>

                      <th
                        onClick={() => handleSort('licenseExpiry')}
                        className="py-3.5 px-4 cursor-pointer group hover:text-[#075EE8] transition-colors"
                      >
                        <span>License / Expiry</span>
                        {renderSortIndicator('licenseExpiry')}
                      </th>

                      <th className="py-3.5 px-4">Assigned Vehicle</th>

                      <th
                        onClick={() => handleSort('status')}
                        className="py-3.5 px-4 cursor-pointer group hover:text-[#075EE8] transition-colors"
                      >
                        <span>Status</span>
                        {renderSortIndicator('status')}
                      </th>

                      <th
                        onClick={() => handleSort('balance')}
                        className="py-3.5 px-4 text-right cursor-pointer group hover:text-[#075EE8] transition-colors"
                      >
                        <span>Balance</span>
                        {renderSortIndicator('balance')}
                      </th>

                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {paginatedDrivers.map((driver) => (
                      <tr
                        key={driver.id}
                        className="hover:bg-blue-50/30 transition-colors group"
                      >
                        {/* Driver */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={driver.avatar}
                              alt={driver.name}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 shrink-0"
                            />
                            <div>
                              <p
                                onClick={() => setViewingDriver(driver)}
                                className="font-bold text-[#0A1E42] group-hover:text-[#075EE8] transition-colors cursor-pointer truncate max-w-[140px]"
                              >
                                {driver.name}
                              </p>
                              <p className="text-[11px] text-slate-400 font-mono">{driver.id}</p>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-slate-700">{driver.phone}</p>
                          <p className="text-[11px] text-slate-400 truncate max-w-[150px]">{driver.email}</p>
                        </td>

                        {/* License / Expiry */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                              {shouldMask ? maskLicense(driver.license) : driver.license}
                            </span>
                            {shouldMask && (
                              <Lock className="w-3 h-3 text-slate-400" title="PII Masked" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Exp: {driver.licenseExpiry}
                          </p>
                        </td>

                        {/* Assigned Vehicle */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`font-semibold ${
                              !driver.vehicle || driver.vehicle === 'Unassigned'
                                ? 'text-slate-400 italic'
                                : 'text-[#0A1E42]'
                            }`}
                          >
                            {driver.vehicle || 'Unassigned'}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <StatusBadge status={driver.status} />
                        </td>

                        {/* Balance */}
                        <td className="py-3.5 px-4 text-right">
                          <span
                            className={`font-mono font-bold ${
                              Number(driver.balance) > 0 ? 'text-amber-600' : 'text-slate-500'
                            }`}
                          >
                            {formatCurrency(driver.balance)}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View Details */}
                            <button
                              type="button"
                              onClick={() => setViewingDriver(driver)}
                              title="View Driver Details"
                              className="p-1.5 text-slate-500 hover:text-[#075EE8] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* View Statement */}
                            <button
                              type="button"
                              onClick={() => setStatementDriver(driver)}
                              title="Generate Official Account Statement"
                              className="p-1.5 text-slate-500 hover:text-[#071D49] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            >
                              <Receipt className="w-4 h-4" />
                            </button>

                            {/* Edit Driver */}
                            <Can module="drivers" do="edit">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingDriver(driver);
                                  setIsAddModalOpen(true);
                                }}
                                title="Edit Driver"
                                className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            </Can>

                            {/* Archive Driver */}
                            <Can module="drivers" do="archive">
                              <button
                                type="button"
                                onClick={() => setArchivingDriver(driver)}
                                title="Archive Driver"
                                className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Archive className="w-4 h-4" />
                              </button>
                            </Can>

                            {/* Delete / Remove Driver */}
                            <Can module="drivers" do="archive">
                              <button
                                type="button"
                                onClick={() => setDeletingDriver(driver)}
                                title="Delete / Remove Driver"
                                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </Can>
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
              totalItems={filteredAndSortedDrivers.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      )}

      {/* Add / Edit Driver Modal */}
      <DriverModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingDriver(null);
        }}
        onSave={handleSaveDriver}
        driver={editingDriver}
      />

      {/* 9-Tab Driver Details Modal */}
      <DriverDetailsModal
        isOpen={!!viewingDriver}
        onClose={() => setViewingDriver(null)}
        driver={viewingDriver}
        onEdit={(d) => {
          setEditingDriver(d);
          setIsAddModalOpen(true);
        }}
        onArchive={(d) => setArchivingDriver(d)}
        onDelete={(d) => setDeletingDriver(d)}
        onRecordPayment={(d) => setPaymentDriver(d)}
      />

      {/* Driver Statement Modal */}
      <DriverStatementModal
        isOpen={!!statementDriver}
        onClose={() => setStatementDriver(null)}
        driver={statementDriver}
      />

      {/* Archive Driver Modal */}
      <ArchiveDriverModal
        isOpen={!!archivingDriver}
        onClose={() => setArchivingDriver(null)}
        driver={archivingDriver}
        onConfirmArchive={handleConfirmArchive}
      />

      {/* Delete Driver Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deletingDriver}
        onClose={() => setDeletingDriver(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Driver"
        message={`Are you sure you want to permanently delete ${deletingDriver?.name} (${deletingDriver?.id}) from the fleet driver registry? This action cannot be undone.`}
        confirmText="Delete Driver"
        isDanger={true}
      />

      {/* Quick Record Payment Modal */}
      <RecordPaymentModal
        isOpen={!!paymentDriver}
        onClose={() => setPaymentDriver(null)}
        driver={paymentDriver}
        onSavePayment={handleSavePayment}
      />
    </div>
  );
}
