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
  Check
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import MaintenanceModal from './MaintenanceModal';
import { initialMaintenance } from '../../data/mockData';
import { exportToCsv } from '../../utils/exportCsv';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function MaintenancePage() {
  const [records, setRecords] = useState(initialMaintenance);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [deletingRecord, setDeletingRecord] = useState(null);

  const stats = useMemo(() => {
    return {
      scheduled: records.filter((r) => r.status === 'Scheduled').length,
      inProgress: records.filter((r) => r.status === 'In Progress').length,
      completed: records.filter((r) => r.status === 'Completed').length,
      totalCost: records.reduce((sum, r) => sum + r.cost, 0),
    };
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesSearch =
        r.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.plate.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        activeTab === 'all'
          ? statusFilter === 'All' || r.status === statusFilter
          : activeTab === 'upcoming'
          ? r.status === 'Scheduled'
          : activeTab === 'history'
          ? r.status === 'Completed'
          : true;

      return matchesSearch && matchesStatus;
    });
  }, [records, searchQuery, statusFilter, activeTab]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSaveRecord = (rec) => {
    if (editingRecord) {
      setRecords((prev) => prev.map((r) => (r.id === rec.id ? rec : r)));
    } else {
      setRecords((prev) => [rec, ...prev]);
    }
    setEditingRecord(null);
  };

  const handleDeleteRecord = () => {
    if (deletingRecord) {
      setRecords((prev) => prev.filter((r) => r.id !== deletingRecord.id));
      setDeletingRecord(null);
    }
  };

  const handleMarkCompleted = (id) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Completed' } : r))
    );
  };

  const handleExport = () => {
    exportToCsv(
      'PrimeRoute_Maintenance_Records',
      filteredRecords.map((r) => ({
        ID: r.id,
        Vehicle: r.vehicle,
        Plate: r.plate,
        Category: r.category,
        Type: r.type,
        ServiceDate: r.serviceDate,
        NextDate: r.nextServiceDate,
        Provider: r.provider,
        Cost: r.cost,
        Status: r.status,
      }))
    );
  };

  return (
    <div className="space-y-6 animate-slide-up duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0A1E42] tracking-tight">Fleet Maintenance</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track routine oil changes, safety milestones, parts overhaul, and repair budgets
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
              setEditingRecord(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 duration-150"
          >
            <Plus className="w-4 h-4" /> Schedule Service
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Scheduled Services"
          value={stats.scheduled}
          icon={Calendar}
          iconColor="text-[#075EE8]"
          iconBg="bg-blue-50/90 border border-blue-100"
          badge="Upcoming Due"
          badgeColor="bg-blue-50 text-[#075EE8] border-blue-200/80"
          subtitle="Routine Oil & Checkups"
          change="+1 this week"
          progress={75}
          progressColor="bg-[#075EE8]"
        />
        <StatCard
          title="In Garage / Progress"
          value={stats.inProgress}
          icon={Wrench}
          iconColor="text-amber-600"
          iconBg="bg-amber-50/90 border border-amber-100"
          badge="In Workshop"
          badgeColor="bg-amber-50 text-amber-700 border-amber-200/80"
          subtitle="Active Bay Work"
          progress={50}
          progressColor="bg-amber-500"
        />
        <StatCard
          title="Completed Services"
          value={stats.completed}
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50/90 border border-emerald-100"
          badge="Certified"
          badgeColor="bg-emerald-50 text-emerald-700 border-emerald-200/80"
          subtitle="Inspection Passed"
          progress={100}
          progressColor="bg-emerald-500"
        />
        <StatCard
          title="Total Maintenance Cost"
          value={stats.totalCost.toLocaleString()}
          prefix="$"
          icon={Clock}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50/90 border border-indigo-100"
          badge="Budget On-Track"
          badgeColor="bg-indigo-50 text-indigo-700 border-indigo-200/80"
          subtitle="YTD Upkeep Spend"
          progress={65}
          progressColor="bg-indigo-600"
        />
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Records' },
            { id: 'upcoming', label: 'Upcoming / Due' },
            { id: 'history', label: 'Service History' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-[#075EE8] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
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
            placeholder="Search vehicle, plate, service, provider..."
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
        {paginatedRecords.length === 0 ? (
          <EmptyState
            title="No maintenance records found"
            description="No scheduled or past service tasks match your criteria."
            actionText="Clear Filter"
            onAction={() => {
              setSearchQuery('');
              setActiveTab('all');
              setStatusFilter('All');
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Vehicle</th>
                  <th className="py-3.5 px-4">Service Type</th>
                  <th className="py-3.5 px-4">Service Date</th>
                  <th className="py-3.5 px-4">Next Due Date</th>
                  <th className="py-3.5 px-4">Mileage</th>
                  <th className="py-3.5 px-4">Provider</th>
                  <th className="py-3.5 px-4">Cost</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {paginatedRecords.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#0A1E42] group-hover:text-[#075EE8] transition-colors">
                        {item.vehicle}
                      </p>
                      <span className="font-mono text-[11px] text-slate-400 bg-slate-100 px-1 rounded">
                        {item.plate}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{item.type}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] text-slate-400">{item.category}</span>
                        {item.type.toLowerCase().includes('oil') && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                            ⚡ 5,000-Mi Interval
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {formatDate(item.serviceDate)}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {item.nextServiceDate ? formatDate(item.nextServiceDate) : '-'}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {item.mileage}
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {item.provider}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-[#0A1E42]">
                      {formatCurrency(item.cost)}
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.status} />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {item.status !== 'Completed' && (
                          <button
                            onClick={() => handleMarkCompleted(item.id)}
                            title="Mark as Completed"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setEditingRecord(item);
                            setIsModalOpen(true);
                          }}
                          title="Edit Service"
                          className="p-1.5 text-slate-500 hover:text-[#075EE8] hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingRecord(item)}
                          title="Delete Record"
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
          totalItems={filteredRecords.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>

      <MaintenanceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRecord(null);
        }}
        onSave={handleSaveRecord}
        record={editingRecord}
      />

      <ConfirmationModal
        isOpen={!!deletingRecord}
        onClose={() => setDeletingRecord(null)}
        onConfirm={handleDeleteRecord}
        title="Delete Maintenance Record"
        message={`Are you sure you want to remove this service record for ${deletingRecord?.vehicle}?`}
        confirmText="Remove Record"
      />
    </div>
  );
}

