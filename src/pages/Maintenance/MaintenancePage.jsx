import React, { useState, useMemo } from 'react';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Download,
  Calendar,
  Eye,
  Edit2,
  Trash2,
  Check,
  LayoutGrid,
  List,
  Search,
  ShieldAlert,
  FileText,
  Building2,
  Gauge,
  PowerOff,
  Car,
  AlertCircle
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import SearchBar from '../../components/common/SearchBar';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import Modal from '../../components/common/Modal';
import MaintenanceModal from './MaintenanceModal';
import { initialMaintenance, initialSettings } from '../../data/mockData';
import { exportToCsv } from '../../utils/exportCsv';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useFleet } from '../../context/FleetContext';
import Can from '../../auth/Can';

export default function MaintenancePage() {
  const { vehicles = [], updateVehicleStatus } = useFleet();
  const [records, setRecords] = useState(initialMaintenance);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'overdue' | 'duesoon' | 'scheduled' | 'inprogress' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [deletingRecord, setDeletingRecord] = useState(null);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const defaultInterval = initialSettings?.maintenanceIntervals?.oilChangeMiles || 5000;

  // Helper: Determine if a maintenance record is Overdue, Due Soon, Scheduled, In Progress, or Completed
  const getRecordDueState = (record) => {
    if (record.status === 'Completed') return { badge: 'Completed', color: 'emerald', icon: 'check' };
    if (record.status === 'In Progress') return { badge: 'In Progress', color: 'amber', icon: 'clock' };

    const targetDate = record.nextServiceDate || record.serviceDate;
    const isPastDate = targetDate && targetDate < todayStr;

    // Check mileage comparison if current vehicle mileage exists
    const veh = vehicles.find(
      (v) =>
        (record.vehicleId && v.id === record.vehicleId) ||
        (record.plate && v.plate === record.plate) ||
        v.name === record.vehicle ||
        `${v.make} ${v.model}` === record.vehicle
    );

    const currentMiles = veh?.mileage
      ? Number(String(veh.mileage).replace(/[^0-9]/g, ''))
      : Number(record.odometer) || 0;

    const nextMiles = Number(record.nextServiceMileage) || (Number(record.odometer) + defaultInterval);

    if (isPastDate || (nextMiles > 0 && currentMiles >= nextMiles)) {
      return { badge: 'Overdue', color: 'rose', icon: 'warning', isAlert: true };
    }

    // Due Soon condition: targetDate within 14 days OR currentMiles within 500 miles of due
    const diffDays = targetDate
      ? Math.ceil((new Date(targetDate) - new Date(todayStr)) / (1000 * 60 * 60 * 24))
      : 999;

    if (diffDays <= 14 || (nextMiles > 0 && nextMiles - currentMiles <= 500)) {
      return { badge: 'Due Soon', color: 'amber', icon: 'clock', isDueSoon: true };
    }

    return { badge: record.status || 'Scheduled', color: 'blue', icon: 'clock' };
  };

  // Requirement 5: Calculate KPI counts & amounts
  const stats = useMemo(() => {
    let overdueCount = 0;
    let dueSoonCount = 0;
    let scheduledCount = 0;
    let inProgressCount = 0;
    let completedCount = 0;
    let totalCost = 0;

    records.forEach((r) => {
      totalCost += Number(r.cost || 0);
      const state = getRecordDueState(r);
      if (state.badge === 'Overdue') overdueCount++;
      else if (state.badge === 'Due Soon') dueSoonCount++;
      else if (state.badge === 'In Progress') inProgressCount++;
      else if (state.badge === 'Completed') completedCount++;
      else scheduledCount++;
    });

    return {
      overdueCount,
      dueSoonCount,
      scheduledCount,
      inProgressCount,
      completedCount,
      totalCost,
      totalRecords: records.length
    };
  }, [records, vehicles, todayStr, defaultInterval]);

  // Filter records based on activeTab and search
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const q = searchQuery.toLowerCase();
      const vehName = (r.vehicle || '').toLowerCase();
      const plate = (r.plate || '').toLowerCase();
      const type = (r.type || '').toLowerCase();
      const provider = (r.provider || '').toLowerCase();
      const id = (r.id || '').toLowerCase();

      const matchesSearch =
        vehName.includes(q) ||
        plate.includes(q) ||
        type.includes(q) ||
        provider.includes(q) ||
        id.includes(q);

      if (!matchesSearch) return false;

      const state = getRecordDueState(r);

      if (activeTab === 'all') return true;
      if (activeTab === 'overdue') return state.badge === 'Overdue';
      if (activeTab === 'duesoon') return state.badge === 'Due Soon';
      if (activeTab === 'scheduled') return state.badge === 'Scheduled' || r.status === 'Scheduled';
      if (activeTab === 'inprogress') return r.status === 'In Progress';
      if (activeTab === 'completed') return r.status === 'Completed';

      return true;
    });
  }, [records, searchQuery, activeTab, vehicles, todayStr]);

  // Requirement 7: Authorized "Mark vehicle unavailable" action
  const handleToggleVehicleAvailability = (record) => {
    const veh = vehicles.find(
      (v) =>
        (record.vehicleId && v.id === record.vehicleId) ||
        (record.plate && v.plate === record.plate) ||
        v.name === record.vehicle ||
        `${v.make} ${v.model}` === record.vehicle
    );

    const targetIdOrPlate = veh ? veh.id : (record.plate || record.vehicle);
    const isCurrentlyUnavailable = veh?.status === 'Unavailable' || veh?.status === 'Maintenance';

    if (isCurrentlyUnavailable) {
      // Restore to Available
      updateVehicleStatus(targetIdOrPlate, 'Available');
      setToastMessage(`✓ Vehicle ${record.plate || record.vehicle} restored to "Available" for active rentals.`);
    } else {
      // Mark Unavailable
      updateVehicleStatus(targetIdOrPlate, 'Unavailable');
      setToastMessage(`⚠️ Vehicle ${record.plate || record.vehicle} set to "Unavailable" (pulled from rental intake for workshop maintenance).`);
    }

    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleSaveRecord = (rec) => {
    if (editingRecord) {
      setRecords((prev) => prev.map((r) => (r.id === rec.id ? rec : r)));
      setToastMessage(`Maintenance job ${rec.id} updated successfully.`);
    } else {
      setRecords((prev) => [rec, ...prev]);
      setToastMessage(`Maintenance job ${rec.id} scheduled for ${rec.vehicle}.`);
    }
    setEditingRecord(null);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDeleteRecord = () => {
    if (deletingRecord) {
      setRecords((prev) => prev.filter((r) => r.id !== deletingRecord.id));
      setToastMessage(`Maintenance record ${deletingRecord.id} removed.`);
      setDeletingRecord(null);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const handleExport = () => {
    exportToCsv(
      'PrimeRoute_Maintenance_Fleet_Work_Orders',
      filteredRecords.map((r) => ({
        ID: r.id,
        Vehicle: r.vehicle,
        Plate: r.plate,
        ServiceType: r.type,
        ServiceDate: r.serviceDate,
        Odometer: r.odometer || r.mileage,
        NextServiceDate: r.nextServiceDate,
        NextServiceMileage: r.nextServiceMileage,
        Provider: r.provider,
        Cost: r.cost,
        Status: r.status
      }))
    );
  };

  return (
    <div className="space-y-6 animate-slide-up duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-black text-[#0A1E42] tracking-tight">Fleet Maintenance &amp; Work Orders</h1>
            <span className="text-xs font-bold px-3 py-1 rounded-xl bg-blue-50 text-[#075EE8] border border-blue-100 shadow-2xs">
              {defaultInterval.toLocaleString()} mi Standard Interval
            </span>
            {stats.overdueCount > 0 && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 animate-pulse">
                ⚠️ {stats.overdueCount} Overdue Services
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Preventative maintenance cadences, 5,000-mile synthetic oil thresholds, workshop work orders, and vehicle availability control
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          {/* View Toggle (Cards vs Table) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-[#0A1E42] shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Card Grid View (Client Mockup)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-[#0A1E42] shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table Grid View"
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition-all active:scale-95 duration-150 cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          {/* Requirement 7: Schedule Maintenance Button */}
          <Can module="maintenance" do="add">
            <button
              onClick={() => {
                setEditingRecord(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 duration-150 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Maintenance</span>
            </button>
          </Can>
        </div>
      </div>

      {/* Ephemeral Feedback Toast */}
      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 text-xs font-bold text-emerald-800 animate-slide-down shadow-2xs">
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

      {/* Requirement 5: KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overdue Card */}
        <StatCard
          title="Overdue Services"
          value={stats.overdueCount}
          icon={AlertTriangle}
          iconColor="text-rose-600"
          iconBg="bg-rose-50/90 border border-rose-100"
          badge="Action Required"
          badgeColor="bg-rose-50 text-rose-700 border-rose-200"
          subtitle="Past date or mileage limit"
          isPositive={false}
          progress={stats.overdueCount > 0 ? 80 : 0}
          progressColor="bg-rose-500"
        />

        {/* Due Soon Card */}
        <StatCard
          title="Due Soon (< 14 Days)"
          value={stats.dueSoonCount}
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50/90 border border-amber-100"
          badge="Upcoming"
          badgeColor="bg-amber-50 text-amber-700 border-amber-200"
          subtitle="Within 500 mi of threshold"
          isPositive={stats.dueSoonCount <= 2}
          progress={60}
          progressColor="bg-amber-500"
        />

        {/* In Workshop Card */}
        <StatCard
          title="In Progress (In Bay)"
          value={stats.inProgressCount}
          icon={Wrench}
          iconColor="text-[#075EE8]"
          iconBg="bg-blue-50/90 border border-blue-100"
          badge="Active Service"
          badgeColor="bg-blue-50 text-[#075EE8] border-blue-200"
          subtitle="Units pulled from intake"
          progress={45}
          progressColor="bg-[#075EE8]"
        />

        {/* Total Cost Card */}
        <StatCard
          title="Total Upkeep Spend"
          value={stats.totalCost.toLocaleString()}
          prefix="$"
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50/90 border border-emerald-100"
          badge="YTD Budget"
          badgeColor="bg-emerald-50 text-emerald-700 border-emerald-200"
          subtitle={`${stats.completedCount} Certified Completed`}
          progress={100}
          progressColor="bg-emerald-500"
        />
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Jobs' },
            { id: 'overdue', label: `Overdue (${stats.overdueCount})`, isAlert: stats.overdueCount > 0 },
            { id: 'duesoon', label: `Due Soon (${stats.dueSoonCount})`, isDueSoon: stats.dueSoonCount > 0 },
            { id: 'scheduled', label: 'Scheduled' },
            { id: 'inprogress', label: 'In Progress' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? tab.isAlert
                    ? 'bg-rose-600 text-white shadow-2xs font-bold'
                    : 'bg-[#075EE8] text-white shadow-2xs'
                  : tab.isAlert
                  ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                  : tab.isDueSoon
                  ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-80">
          <SearchBar
            value={searchQuery}
            onChange={(val) => setSearchQuery(val)}
            placeholder="Search vehicle, plate, service, provider..."
          />
        </div>
      </div>

      {/* Requirement 6: Cards Like the Client Mockup */}
      {viewMode === 'cards' ? (
        filteredRecords.length === 0 ? (
          <EmptyState
            title="No maintenance records match current filter"
            description="Try modifying search keywords or switching filter tabs."
            actionText="Reset Filters"
            onAction={() => {
              setSearchQuery('');
              setActiveTab('all');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRecords.map((r) => {
              const dueState = getRecordDueState(r);
              const veh =
                (r.vehicleId && vehicles.find((v) => v.id === r.vehicleId)) ||
                (r.plate && vehicles.find((v) => v.plate === r.plate)) ||
                vehicles.find((v) => v.name === r.vehicle || `${v.make} ${v.model}` === r.vehicle) ||
                null;

              const vehicleTitle = veh ? `${veh.year} ${veh.make} ${veh.model}` : r.vehicle;
              const vehiclePlate = r.plate || veh?.plate || 'PR-FLEET';
              const vehicleId = veh?.id || r.vehicleId || r.id;
              const currentVehicleStatus = veh?.status || 'Available';
              const isVehicleUnavailable =
                currentVehicleStatus === 'Unavailable' || currentVehicleStatus === 'Maintenance';

              const cleanOdo = r.odometer
                ? Number(String(r.odometer).replace(/[^0-9]/g, ''))
                : r.mileage
                ? Number(String(r.mileage).replace(/[^0-9]/g, ''))
                : 25000;

              const cleanNextOdo = r.nextServiceMileage
                ? Number(String(r.nextServiceMileage).replace(/[^0-9]/g, ''))
                : cleanOdo + defaultInterval;

              const percentOdo = Math.min(
                100,
                Math.max(15, Math.round((cleanOdo / cleanNextOdo) * 100))
              );

              return (
                <div
                  key={r.id}
                  className={`bg-white rounded-2xl border p-5 shadow-[0_2px_12px_rgba(7,29,73,0.04)] hover:shadow-card-hover transition-all flex flex-col justify-between group relative ${
                    dueState.badge === 'Overdue'
                      ? 'border-rose-200 ring-1 ring-rose-200/50 hover:border-rose-300'
                      : dueState.badge === 'Due Soon'
                      ? 'border-amber-200 ring-1 ring-amber-200/40 hover:border-amber-300'
                      : r.status === 'In Progress'
                      ? 'border-blue-200 ring-1 ring-blue-200/40 hover:border-blue-300'
                      : 'border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  {/* Top: Card Header & Identifiers */}
                  <div>
                    <div className="flex items-center justify-between gap-2.5">
                      {/* Left: Identifiers */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-xs font-bold text-[#075EE8] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                          {vehicleId}
                        </span>
                        <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200/60 text-slate-700">
                          {vehiclePlate}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            isVehicleUnavailable
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : currentVehicleStatus === 'Rented'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {currentVehicleStatus}
                        </span>
                      </div>

                      {/* Right: Status Pill */}
                      <div>
                        {dueState.badge === 'Overdue' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span>Overdue</span>
                          </span>
                        )}
                        {dueState.badge === 'Due Soon' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
                            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>Due Soon</span>
                          </span>
                        )}
                        {dueState.badge === 'In Progress' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#075EE8] border border-blue-200 shadow-2xs">
                            <Wrench className="w-3.5 h-3.5 text-[#075EE8] shrink-0" />
                            <span>In Progress</span>
                          </span>
                        )}
                        {dueState.badge === 'Completed' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Completed</span>
                          </span>
                        )}
                        {dueState.badge === 'Scheduled' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs">
                            <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span>Scheduled</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Vehicle Make/Model Heading */}
                    <h3 className="font-black text-[#0A1E42] text-base tracking-tight mt-2.5 truncate" title={vehicleTitle}>
                      {vehicleTitle}
                    </h3>

                    {/* Workshop & Service Category */}
                    <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5 truncate">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{r.provider || 'Fleet Workshop'}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500 shrink-0">{r.category || 'Maintenance'}</span>
                    </div>

                    {/* Service & Due Date Details Box */}
                    <div className="mt-3.5 p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/60 text-xs space-y-2.5">
                      {/* Service Required & Cost */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Required Service
                          </span>
                          <span className="font-bold text-[#0A1E42] text-xs leading-snug block mt-0.5" title={r.type}>
                            {r.type}
                          </span>
                        </div>
                        {r.cost ? (
                          <div className="text-right shrink-0">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              {dueState.badge === 'Completed' ? 'Total Cost' : 'Est. Cost'}
                            </span>
                            <span className="font-mono font-black text-xs text-slate-800 block mt-0.5">
                              {formatCurrency(r.cost)}
                            </span>
                          </div>
                        ) : null}
                      </div>

                      {/* Due Date Row */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {dueState.badge === 'Completed' ? 'Service Date' : 'Due Date'}
                        </span>
                        <span
                          className={`font-mono font-bold ${
                            dueState.badge === 'Overdue'
                              ? 'text-rose-600'
                              : dueState.badge === 'Due Soon'
                              ? 'text-amber-700'
                              : 'text-slate-700'
                          }`}
                        >
                          {formatDate(r.nextServiceDate || r.serviceDate)}
                        </span>
                      </div>

                      {/* Mileage Tracking Bar */}
                      <div className="space-y-1.5 pt-1 border-t border-slate-200/60">
                        <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                          <span className="flex items-center gap-1">
                            <Gauge className="w-3 h-3 text-slate-400" />
                            Odo: {cleanOdo.toLocaleString()} mi
                          </span>
                          <span>Due: {cleanNextOdo.toLocaleString()} mi</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              dueState.badge === 'Completed'
                                ? 'bg-emerald-500'
                                : dueState.badge === 'Overdue'
                                ? 'bg-rose-500'
                                : dueState.badge === 'Due Soon'
                                ? 'bg-amber-500'
                                : 'bg-[#075EE8]'
                            }`}
                            style={{ width: `${dueState.badge === 'Completed' ? 100 : percentOdo}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Meta & Actions */}
                  <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2 mt-4">
                    {/* Left Side: Context Badge or Availability Control */}
                    <div>
                      {dueState.badge === 'Completed' ? (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-2xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Service Cleared</span>
                        </span>
                      ) : dueState.badge === 'In Progress' ? (
                        <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200/70 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-2xs">
                          <Wrench className="w-3.5 h-3.5 text-[#075EE8] shrink-0" />
                          <span>In Workshop Bay</span>
                        </span>
                      ) : (
                        <Can module="maintenance" do="edit">
                          <button
                            onClick={() => handleToggleVehicleAvailability(r)}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5 ${
                              isVehicleUnavailable
                                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                            }`}
                            title={
                              isVehicleUnavailable
                                ? 'Restore vehicle status to Available'
                                : 'Pull vehicle from rental intake and set status to Unavailable'
                            }
                          >
                            <PowerOff className="w-3.5 h-3.5 shrink-0" />
                            <span>{isVehicleUnavailable ? 'Restore Available' : 'Pull From Intake'}</span>
                          </button>
                        </Can>
                      )}
                    </div>

                    {/* Right Side: Action Icons */}
                    <div className="flex items-center gap-1">
                      {r.invoiceUpload && (
                        <button
                          onClick={() => setViewingInvoice(r.invoiceUpload)}
                          className="p-1.5 text-slate-400 hover:text-[#075EE8] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="View Invoice Receipt"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      )}

                      <Can module="maintenance" do="edit">
                        <button
                          onClick={() => {
                            setEditingRecord(r);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-[#075EE8] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit work order"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </Can>

                      <Can module="maintenance" do="delete">
                        <button
                          onClick={() => setDeletingRecord(r)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete work order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </Can>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Table List View */
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[960px]">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Job ID &amp; Vehicle</th>
                  <th className="py-3.5 px-4">Service Type</th>
                  <th className="py-3.5 px-4">Service Date</th>
                  <th className="py-3.5 px-4">Odometer</th>
                  <th className="py-3.5 px-4">Next Due (Mi &amp; Date)</th>
                  <th className="py-3.5 px-4">Provider / Garage</th>
                  <th className="py-3.5 px-4 text-right">Cost</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredRecords.map((r) => {
                  const dueState = getRecordDueState(r);
                  const veh = vehicles.find(
                    (v) =>
                      (r.vehicleId && v.id === r.vehicleId) ||
                      (r.plate && v.plate === r.plate) ||
                      v.name === r.vehicle ||
                      `${v.make} ${v.model}` === r.vehicle
                  );
                  const isVehicleUnavailable =
                    veh?.status === 'Unavailable' || veh?.status === 'Maintenance';

                  return (
                    <tr key={r.id} className="hover:bg-blue-50/20 transition-colors group">
                      {/* Job ID & Vehicle */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-[#075EE8] block">{r.id}</span>
                        <span className="font-bold text-slate-800 block text-xs">{r.vehicle}</span>
                        <span className="font-mono text-[10px] text-slate-400">{r.plate}</span>
                      </td>

                      {/* Service Type */}
                      <td className="py-3.5 px-4 font-semibold text-[#0A1E42]">
                        {r.type}
                      </td>

                      {/* Service Date */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                        {formatDate(r.serviceDate)}
                      </td>

                      {/* Odometer */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        {r.odometer ? `${Number(r.odometer).toLocaleString()} mi` : (r.mileage || '—')}
                      </td>

                      {/* Next Due */}
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <span className="font-bold text-slate-800 block">
                          {r.nextServiceMileage ? `${Number(r.nextServiceMileage).toLocaleString()} mi` : '—'}
                        </span>
                        <span className={`block ${dueState.badge === 'Overdue' ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>
                          {formatDate(r.nextServiceDate)}
                        </span>
                      </td>

                      {/* Provider */}
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {r.provider}
                      </td>

                      {/* Cost */}
                      <td className="py-3.5 px-4 text-right font-extrabold text-[#0A1E42] font-mono">
                        {formatCurrency(r.cost)}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            dueState.badge === 'Overdue'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : dueState.badge === 'Due Soon'
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : dueState.badge === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-blue-100 text-[#075EE8] border border-blue-200'
                          }`}
                        >
                          {dueState.badge}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Requirement 7: Authorized Mark Unavailable Action */}
                          <Can module="maintenance" do="edit">
                            {dueState.badge === 'Completed' ? (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-600" /> Cleared
                              </span>
                            ) : (
                              <button
                                onClick={() => handleToggleVehicleAvailability(r)}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-2xs ${
                                  isVehicleUnavailable
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                                }`}
                                title={isVehicleUnavailable ? 'Restore to Available' : 'Mark vehicle status to Unavailable'}
                              >
                                {isVehicleUnavailable ? 'Restore Available' : 'Pull From Intake'}
                              </button>
                            )}
                          </Can>

                          <button
                            onClick={() => {
                              setEditingRecord(r);
                              setIsModalOpen(true);
                            }}
                            className="p-1 text-slate-400 hover:text-[#075EE8] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit maintenance record"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingRecord(r)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete maintenance record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
      )}

      {/* Maintenance Modal */}
      <MaintenanceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRecord(null);
        }}
        onSave={handleSaveRecord}
        record={editingRecord}
      />

      {/* Invoice Preview Modal */}
      {viewingInvoice && (
        <Modal
          isOpen={!!viewingInvoice}
          onClose={() => setViewingInvoice(null)}
          title="Maintenance Invoice / Receipt"
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 p-2 text-center">
            <div className="w-16 h-16 bg-blue-50 text-[#075EE8] rounded-2xl flex items-center justify-center mx-auto border border-blue-100">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-black text-[#0A1E42] text-base">{viewingInvoice}</h4>
              <p className="text-xs text-slate-500 mt-1">Verified Fleet Workshop Invoice Document</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Document Type:</span>
                <span className="font-bold text-slate-800">PDF Work Order Receipt</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Verification Status:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Certified Paid &amp; Attached
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setViewingInvoice(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={!!deletingRecord}
        onClose={() => setDeletingRecord(null)}
        onConfirm={handleDeleteRecord}
        title="Delete Maintenance Record"
        message={`Are you sure you want to delete maintenance record ${deletingRecord?.id} for ${deletingRecord?.vehicle}?`}
        confirmText="Delete Record"
      />
    </div>
  );
}
