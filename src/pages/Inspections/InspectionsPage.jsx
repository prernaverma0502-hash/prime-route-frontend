import React, { useState, useMemo } from 'react';
import {
  ClipboardCheck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Download,
  Eye,
  Edit2,
  Trash2,
  Gauge,
  Fuel,
  Car,
  DollarSign
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import InspectionModal from './InspectionModal';
import InspectionDetailsModal from './InspectionDetailsModal';
import AccidentModal from './AccidentModal';
import { initialInspections, initialAccidents } from '../../data/mockData';
import { useFleet } from '../../context/FleetContext';
import { exportToCsv } from '../../utils/exportCsv';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function InspectionsPage() {
  const { inspections, setInspections, accidents, setAccidents } = useFleet();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pickup' | 'return' | 'damaged' | 'accidents'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Modals state
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAccidentModalOpen, setIsAccidentModalOpen] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [editingInspection, setEditingInspection] = useState(null);
  const [editingAccident, setEditingAccident] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null); // { type: 'inspection'|'accident', item }

  // Stats
  const stats = useMemo(() => {
    const passedCount = inspections.filter((i) => i.status === 'Passed').length;
    const damageCount = inspections.filter((i) => i.status === 'Damage Detected' || i.status === 'Under Review').length;
    const openClaims = accidents.filter((a) => a.status !== 'Settled').length;
    const totalRepairCost = accidents.reduce((sum, a) => sum + (a.repairEstimate || 0), 0);

    return {
      totalInspections: inspections.length,
      passedCount,
      damageCount,
      openClaims,
      totalRepairCost
    };
  }, [inspections, accidents]);

  // Filtered Inspections
  const filteredInspections = useMemo(() => {
    return inspections.filter((i) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        i.inspectionNumber.toLowerCase().includes(q) ||
        i.vehicle.toLowerCase().includes(q) ||
        i.plate.toLowerCase().includes(q) ||
        i.driver.toLowerCase().includes(q) ||
        i.inspector.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'All' || i.status === statusFilter;

      if (activeTab === 'pickup') {
        return matchesSearch && matchesStatus && i.type.includes('Pickup');
      }
      if (activeTab === 'return') {
        return matchesSearch && matchesStatus && i.type.includes('Return');
      }
      if (activeTab === 'damaged') {
        return matchesSearch && (i.status === 'Damage Detected' || i.status === 'Under Review');
      }
      return matchesSearch && matchesStatus;
    });
  }, [inspections, searchQuery, statusFilter, activeTab]);

  // Filtered Accidents
  const filteredAccidents = useMemo(() => {
    return accidents.filter((a) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        a.id.toLowerCase().includes(q) ||
        a.vehicle.toLowerCase().includes(q) ||
        a.plate.toLowerCase().includes(q) ||
        a.driver.toLowerCase().includes(q) ||
        a.policeReportNumber.toLowerCase().includes(q) ||
        a.claimNumber.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [accidents, searchQuery, statusFilter]);

  // Pagination calculations
  const currentList = activeTab === 'accidents' ? filteredAccidents : filteredInspections;
  const totalPages = Math.ceil(currentList.length / pageSize) || 1;
  const paginatedList = currentList.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handlers
  const handleSaveInspection = (inspectionData) => {
    if (editingInspection) {
      setInspections((prev) =>
        prev.map((i) => (i.id === inspectionData.id ? inspectionData : i))
      );
    } else {
      setInspections((prev) => [inspectionData, ...prev]);
    }
    setEditingInspection(null);
  };

  const handleSaveAccident = (accidentData) => {
    if (editingAccident) {
      setAccidents((prev) =>
        prev.map((a) => (a.id === accidentData.id ? accidentData : a))
      );
    } else {
      setAccidents((prev) => [accidentData, ...prev]);
    }
    setEditingAccident(null);
  };

  const handleDeleteConfirm = () => {
    if (!deletingItem) return;
    if (deletingItem.type === 'inspection') {
      setInspections((prev) => prev.filter((i) => i.id !== deletingItem.item.id));
    } else {
      setAccidents((prev) => prev.filter((a) => a.id !== deletingItem.item.id));
    }
    setDeletingItem(null);
  };

  const handleExport = () => {
    if (activeTab === 'accidents') {
      exportToCsv(accidents, 'primeroute-accidents-claims.csv');
    } else {
      exportToCsv(inspections, 'primeroute-inspections.csv');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0A1E42] tracking-tight">
            Inspections &amp; Damage Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Standard check-in/check-out digital inspection checklists, damage photo evidence, and insurance claim tracking
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExport}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl flex items-center gap-2 shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export Data
          </button>

          <button
            onClick={() => {
              setEditingAccident(null);
              setIsAccidentModalOpen(true);
            }}
            className="px-3.5 py-2 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            + Report Accident / Claim
          </button>

          <button
            onClick={() => {
              setEditingInspection(null);
              setIsInspectionModalOpen(true);
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all active:scale-97"
          >
            <Plus className="w-4 h-4" />
            New Inspection
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={ClipboardCheck}
          label="Total Inspections"
          value={stats.totalInspections}
          change="+4 this week"
          isPositive={true}
          color="blue"
        />
        <StatCard
          icon={CheckCircle2}
          label="Passed / Pristine"
          value={stats.passedCount}
          change="Clean Handover"
          isPositive={true}
          color="emerald"
        />
        <StatCard
          icon={AlertTriangle}
          label="Damages Flagged"
          value={stats.damageCount}
          change="Action Required"
          isPositive={false}
          color="amber"
        />
        <StatCard
          icon={ShieldAlert}
          label="Accident Claims Total"
          value={formatCurrency(stats.totalRepairCost)}
          change={`${stats.openClaims} open claims`}
          isPositive={false}
          color="indigo"
        />
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Inspections' },
            { id: 'pickup', label: '🚀 Pickup (Check-out)' },
            { id: 'return', label: '📥 Return (Check-in)' },
            { id: 'damaged', label: '⚠️ Damage Detected' },
            { id: 'accidents', label: '🛡️ Accident & Insurance Claims' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-full md:w-72">
            <SearchBar
              value={searchQuery}
              onChange={(val) => {
                setSearchQuery(val);
                setCurrentPage(1);
              }}
              placeholder={
                activeTab === 'accidents'
                  ? 'Search claims, police report, driver...'
                  : 'Search inspection #, vehicle, plate, driver...'
              }
            />
          </div>

          <FilterDropdown
            label="Status"
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
            options={
              activeTab === 'accidents'
                ? ['All', 'Open', 'Under Review', 'Approved', 'Settled']
                : ['All', 'Passed', 'Damage Detected', 'Under Review']
            }
          />
        </div>
      </div>

      {/* Content Table */}
      {activeTab !== 'accidents' ? (
        // INSPECTIONS TABLE
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
          {filteredInspections.length === 0 ? (
            <EmptyState
              title="No inspection records found"
              description="No vehicle inspections match your current filter parameters."
              actionText="Reset Filter"
              onAction={() => {
                setSearchQuery('');
                setStatusFilter('All');
                setActiveTab('all');
              }}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Inspection #</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Vehicle &amp; Driver</th>
                    <th className="py-3.5 px-4">Date &amp; Inspector</th>
                    <th className="py-3.5 px-4">Odometer</th>
                    <th className="py-3.5 px-4">Fuel / Battery</th>
                    <th className="py-3.5 px-4">Condition</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {paginatedList.map((i) => (
                    <tr key={i.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-blue-600 block">
                          {i.inspectionNumber}
                        </span>
                        <span className="text-[10px] text-slate-400">{i.id}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                            i.type.includes('Pickup')
                              ? 'bg-blue-50 text-blue-700 border border-blue-100'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                          }`}
                        >
                          {i.type}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-bold text-[#0A1E42]">{i.vehicle}</p>
                        <p className="text-[11px] text-slate-500">
                          {i.plate} • <span className="text-slate-700 font-semibold">{i.driver}</span>
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800">{formatDate(i.date)}</p>
                        <p className="text-[10px] text-slate-400">By: {i.inspector}</p>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        {Number(i.odometer).toLocaleString()} mi
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-800 text-[11px]">{i.fuelLevel}%</span>
                          <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                i.fuelLevel >= 80 ? 'bg-emerald-500' : i.fuelLevel >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${i.fuelLevel}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-[170px] truncate text-slate-600">
                        <span className="block font-medium truncate">{i.exteriorCondition}</span>
                        {i.photos?.length > 0 && (
                          <span className="text-[10px] text-blue-600 font-bold">
                            📷 {i.photos.length} photos
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusBadge status={i.status} />
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedInspection(i);
                              setIsDetailsModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Full Report"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingInspection(i);
                              setIsInspectionModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit Record"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingItem({ type: 'inspection', item: i })}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete"
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
        </div>
      ) : (
        // ACCIDENT & CLAIMS TABLE
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
          {filteredAccidents.length === 0 ? (
            <EmptyState
              title="No accident records found"
              description="No incident or insurance claim records match your parameters."
              actionText="Reset Filter"
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
                    <th className="py-3.5 px-4">Claim # &amp; Date</th>
                    <th className="py-3.5 px-4">Vehicle &amp; Driver</th>
                    <th className="py-3.5 px-4">Location / Police #</th>
                    <th className="py-3.5 px-4">Damage Summary</th>
                    <th className="py-3.5 px-4">Repair Estimate</th>
                    <th className="py-3.5 px-4">Insurance &amp; Deductible</th>
                    <th className="py-3.5 px-4">Driver Recovered</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {paginatedList.map((a) => (
                    <tr key={a.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-amber-600 block">{a.id}</span>
                        <span className="text-[10px] text-slate-400">{formatDate(a.incidentDate)}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-bold text-[#0A1E42]">{a.vehicle}</p>
                        <p className="text-[11px] text-slate-500">{a.plate} • {a.driver}</p>
                      </td>

                      <td className="py-3.5 px-4 max-w-[180px] truncate">
                        <p className="font-medium text-slate-700 truncate">{a.location}</p>
                        <p className="text-[10px] font-mono text-slate-400">{a.policeReportNumber}</p>
                      </td>

                      <td className="py-3.5 px-4 max-w-[200px] truncate text-slate-600" title={a.damageDescription}>
                        {a.damageDescription}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-extrabold text-[#0A1E42]">
                        {formatCurrency(a.repairEstimate)}
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800 text-[11px]">{a.insuranceCarrier}</p>
                        <p className="text-[10px] text-slate-400">
                          Ded: {formatCurrency(a.deductibleAmount)} • Paid: {formatCurrency(a.insurancePaid)}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">
                        {formatCurrency(a.driverRecovered)}
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusBadge status={a.status} />
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingAccident(a);
                              setIsAccidentModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit Claim"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingItem({ type: 'accident', item: a })}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete"
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
        </div>
      )}

      {/* Pagination */}
      {currentList.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={currentList.length}
          pageSize={pageSize}
        />
      )}

      {/* Inspection Form Modal */}
      <InspectionModal
        isOpen={isInspectionModalOpen}
        onClose={() => {
          setIsInspectionModalOpen(false);
          setEditingInspection(null);
        }}
        onSave={handleSaveInspection}
        inspection={editingInspection}
      />

      {/* Inspection Details Modal */}
      <InspectionDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedInspection(null);
        }}
        inspection={selectedInspection}
      />

      {/* Accident / Claim Modal */}
      <AccidentModal
        isOpen={isAccidentModalOpen}
        onClose={() => {
          setIsAccidentModalOpen(false);
          setEditingAccident(null);
        }}
        onSave={handleSaveAccident}
        accident={editingAccident}
      />

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${deletingItem?.type === 'inspection' ? 'Inspection Record' : 'Accident Claim'}`}
        message="Are you sure you want to remove this record? This action will update the fleet history log and cannot be undone."
        confirmText="Delete Record"
        isDanger={true}
      />
    </div>
  );
}

