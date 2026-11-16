import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ShieldAlert,
  Plus,
  Download,
  AlertTriangle,
  Clock,
  ArrowRight,
  Car,
  FileText
} from 'lucide-react';
import Pagination from '../../components/common/Pagination';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import InspectionModal from './InspectionModal';
import InspectionDetailsModal from './InspectionDetailsModal';
import AccidentModal from './AccidentModal';
import InspectionKpis from './components/InspectionKpis';
import InspectionsFilterBar from './components/InspectionsFilterBar';
import InspectionsTable from './components/InspectionsTable';
import AccidentsTable from './components/AccidentsTable';
import AwaitingInspectionsTable from './components/AwaitingInspectionsTable';
import { useFleet } from '../../context/FleetContext';
import { exportToCsv } from '../../utils/exportCsv';
import { awaitingInspectionVehicles } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Can from '../../auth/Can';

export default function InspectionsPage() {
  const { inspections, setInspections, accidents, setAccidents } = useFleet();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'awaiting' | 'pickup' | 'return' | 'damaged' | 'accidents'
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Awaiting inspections list
  const [awaitingList, setAwaitingList] = useState(awaitingInspectionVehicles);

  // Multi-Filter State
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [vehicleFilter, setVehicleFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  // Close filter popover on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isFilterOpen]);

  // Extract unique vehicles available in existing inspections
  const availableVehicles = useMemo(() => {
    const list = inspections.map((i) => i.vehicle).filter(Boolean);
    return ['All', ...Array.from(new Set(list))];
  }, [inspections]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (typeFilter !== 'All') count++;
    if (statusFilter !== 'All') count++;
    if (vehicleFilter !== 'All') count++;
    if (startDate) count++;
    if (endDate) count++;
    return count;
  }, [typeFilter, statusFilter, vehicleFilter, startDate, endDate]);

  const handleClearFilters = () => {
    setTypeFilter('All');
    setStatusFilter('All');
    setVehicleFilter('All');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  // Modals state
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAccidentModalOpen, setIsAccidentModalOpen] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [editingInspection, setEditingInspection] = useState(null);
  const [editingAccident, setEditingAccident] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null); // { type: 'inspection'|'accident', item }

  // Unresolved accidents
  const unresolvedAccidents = useMemo(() => {
    return accidents.filter(
      (a) => a.status !== 'Settled' && (a.resolutionStatus !== 'Settled')
    );
  }, [accidents]);

  // Stats
  const stats = useMemo(() => {
    const passedCount = inspections.filter((i) => i.status === 'Passed').length;
    const damageCount = inspections.filter(
      (i) => i.status === 'Damage Detected' || i.status === 'Under Review'
    ).length;
    const openClaims = unresolvedAccidents.length;
    const totalRepairCost = accidents.reduce((sum, a) => sum + (Number(a.repairEstimate) || 0), 0);

    return {
      totalInspections: inspections.length,
      passedCount,
      damageCount,
      openClaims,
      totalRepairCost,
      awaitingCount: awaitingList.length
    };
  }, [inspections, accidents, unresolvedAccidents, awaitingList]);

  // Filtered Inspections
  const filteredInspections = useMemo(() => {
    return inspections.filter((i) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (i.inspectionNumber || '').toLowerCase().includes(q) ||
        (i.vehicle || '').toLowerCase().includes(q) ||
        (i.plate || '').toLowerCase().includes(q) ||
        (i.driver || '').toLowerCase().includes(q) ||
        (i.inspector || '').toLowerCase().includes(q);

      let matchesStatus = true;
      if (statusFilter !== 'All') {
        if (statusFilter === 'Passed') {
          matchesStatus = i.status === 'Passed';
        } else if (statusFilter === 'Damage Detected') {
          matchesStatus = i.status === 'Damage Detected';
        } else if (statusFilter === 'Under Review') {
          matchesStatus = i.status === 'Under Review';
        } else {
          matchesStatus = i.status === statusFilter;
        }
      }

      let matchesType = true;
      if (typeFilter !== 'All') {
        if (typeFilter.includes('Pickup')) {
          matchesType = (i.type || '').toLowerCase().includes('pickup');
        } else if (typeFilter.includes('Return')) {
          matchesType = (i.type || '').toLowerCase().includes('return');
        } else {
          matchesType = i.type === typeFilter;
        }
      }

      let matchesVehicle = true;
      if (vehicleFilter !== 'All') {
        matchesVehicle = i.vehicle === vehicleFilter || (i.vehicle || '').toLowerCase().includes(vehicleFilter.toLowerCase());
      }

      let matchesDate = true;
      if (startDate) {
        matchesDate = matchesDate && i.date >= startDate;
      }
      if (endDate) {
        matchesDate = matchesDate && i.date <= endDate;
      }

      let matchesTab = true;
      if (activeTab === 'pickup') {
        matchesTab = (i.type || '').toLowerCase().includes('pickup');
      } else if (activeTab === 'return') {
        matchesTab = (i.type || '').toLowerCase().includes('return');
      } else if (activeTab === 'damaged') {
        matchesTab = i.status === 'Damage Detected' || i.status === 'Under Review';
      }

      return matchesSearch && matchesStatus && matchesType && matchesVehicle && matchesDate && matchesTab;
    });
  }, [inspections, searchQuery, statusFilter, typeFilter, vehicleFilter, startDate, endDate, activeTab]);

  // Filtered Accidents
  const filteredAccidents = useMemo(() => {
    return accidents.filter((a) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (a.id || '').toLowerCase().includes(q) ||
        (a.vehicle || '').toLowerCase().includes(q) ||
        (a.plate || '').toLowerCase().includes(q) ||
        (a.driver || '').toLowerCase().includes(q) ||
        (a.policeReportNumber || '').toLowerCase().includes(q) ||
        (a.claimNumber || '').toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'All' || a.status === statusFilter || a.resolutionStatus === statusFilter;
      const matchesVehicle = vehicleFilter === 'All' || a.vehicle === vehicleFilter || (a.vehicle || '').toLowerCase().includes(vehicleFilter.toLowerCase());
      let matchesDate = true;
      if (startDate) matchesDate = matchesDate && (a.incidentDate || a.date) >= startDate;
      if (endDate) matchesDate = matchesDate && (a.incidentDate || a.date) <= endDate;

      return matchesSearch && matchesStatus && matchesVehicle && matchesDate;
    });
  }, [accidents, searchQuery, statusFilter, vehicleFilter, startDate, endDate]);

  // Filtered Awaiting List
  const filteredAwaiting = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return awaitingList.filter(
      (item) =>
        (item.vehicle || '').toLowerCase().includes(q) ||
        (item.plate || '').toLowerCase().includes(q) ||
        (item.driver || '').toLowerCase().includes(q) ||
        (item.contractId || '').toLowerCase().includes(q)
    );
  }, [awaitingList, searchQuery]);

  // Pagination calculations
  const currentList =
    activeTab === 'accidents'
      ? filteredAccidents
      : activeTab === 'awaiting'
      ? filteredAwaiting
      : filteredInspections;

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
      // If was from awaiting list, remove from awaiting
      setAwaitingList((prev) =>
        prev.filter((item) => item.plate !== inspectionData.plate && item.vehicle !== inspectionData.vehicle)
      );
    }
    setEditingInspection(null);
  };

  const handleStartInspectionFromAwaiting = (awaitingItem) => {
    setEditingInspection({
      id: `INS-${Date.now()}`,
      inspectionNumber: `INSP-${Math.floor(1000 + Math.random() * 9000)}`,
      type: awaitingItem.type.includes('Return') ? 'Check-in (Return)' : 'Check-out (Pickup)',
      contractId: awaitingItem.contractId || 'RNT-2025-001',
      vehicle: awaitingItem.vehicle,
      plate: awaitingItem.plate,
      driver: awaitingItem.driver,
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      odometer: awaitingItem.odometerExpected || 25000,
      fuelLevel: 100,
      exteriorCondition: 'Pristine / Clean',
      interiorCondition: 'Clean & Sanitized',
      tiresCondition: 'Good (8/32")',
      windshieldStatus: 'Clear / No Cracks',
      spareTirePresent: true,
      damageClassification: 'No Damage',
      existingDamage: 'No prior damage reported.',
      newDamage: 'None.',
      inspector: 'Marcus Brody (Fleet Tech)',
      status: 'Passed',
      notes: awaitingItem.reason || '',
      driverSignature: awaitingItem.driver,
      driverAcknowledged: true,
      photos: []
    });
    setIsInspectionModalOpen(true);
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
      exportToCsv('primeroute-accidents-claims', accidents);
    } else if (activeTab === 'awaiting') {
      exportToCsv('primeroute-awaiting-inspections', awaitingList);
    } else {
      exportToCsv('primeroute-inspections', inspections);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0A1E42] tracking-tight">
            Inspections & Damage Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Standard check-in/check-out digital inspections, baseline damage comparison, and insurance claim tracking
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2.5 shrink-0 self-start md:self-auto">
          <div className="flex items-center gap-2.5 flex-wrap justify-end">
            <Can module="inspections" do="export">
              <button
                onClick={handleExport}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                Export Data
              </button>
            </Can>

            <Can module="inspections" do="add">
              <button
                onClick={() => {
                  setEditingAccident(null);
                  setIsAccidentModalOpen(true);
                }}
                className="px-3.5 py-2 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                + Report Accident / Claim
              </button>
            </Can>

            <Can module="inspections" do="add">
              <button
                onClick={() => {
                  setEditingInspection(null);
                  setIsInspectionModalOpen(true);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all active:scale-97 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                New Inspection
              </button>
            </Can>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <InspectionKpis stats={stats} />

      {/* Requirement 3: Prominent Flags for Unresolved Accidents & Vehicles Awaiting Inspection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Flag 1: Vehicles Awaiting Inspection Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200 flex items-start justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-extrabold text-[#0A1E42]">
                  {awaitingList.length} Vehicles Awaiting Handover Inspection
                </h4>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-500 text-white rounded-full">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Returned leases & pending checkout units require certified odometer, fuel, and condition sign-off.
              </p>
              <div className="flex items-center gap-2 mt-2 text-[11px] font-semibold text-amber-800">
                <span>• Toyota RAV4 (PR-2024-TR)</span>
                <span>• Ford F-150 (PR-2024-FF)</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveTab('awaiting');
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-xl border border-amber-300 transition-all flex items-center gap-1 shrink-0 cursor-pointer"
          >
            Review Vehicles <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Flag 2: Unresolved Accident Claims Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent border border-rose-200 flex items-start justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-extrabold text-[#0A1E42]">
                  {unresolvedAccidents.length} Unresolved Accident Claim Under Review
                </h4>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-rose-600 text-white rounded-full">
                  Claim Open
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                CLM-TRV-882204 (Honda Civic EX): $2,800 estimate awaiting adjuster report and driver recovery.
              </p>
              <div className="flex items-center gap-2 mt-2 text-[11px] font-semibold text-rose-800">
                <span>Insurer: Travelers Commercial</span>
                <span>•</span>
                <span>Deductible: $1,000</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveTab('accidents');
              setStatusFilter('Under Review');
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 text-xs font-bold text-rose-800 bg-rose-100 hover:bg-rose-200 rounded-xl border border-rose-300 transition-all flex items-center gap-1 shrink-0 cursor-pointer"
          >
            View Open Claim <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <InspectionsFilterBar
        activeTab={activeTab}
        onTabChange={(tabId) => {
          setActiveTab(tabId);
          setCurrentPage(1);
        }}
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setCurrentPage(1);
        }}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        filterRef={filterRef}
        activeFilterCount={activeFilterCount}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        vehicleFilter={vehicleFilter}
        setVehicleFilter={setVehicleFilter}
        availableVehicles={availableVehicles}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onClearFilters={handleClearFilters}
        awaitingCount={awaitingList.length}
        unresolvedAccidentsCount={unresolvedAccidents.length}
      />

      {/* Dynamic Content Views */}
      {activeTab === 'awaiting' ? (
        <AwaitingInspectionsTable
          awaitingList={filteredAwaiting}
          onStartInspection={handleStartInspectionFromAwaiting}
        />
      ) : activeTab === 'accidents' ? (
        <AccidentsTable
          accidents={filteredAccidents}
          paginatedList={paginatedList}
          onResetFilters={() => {
            setSearchQuery('');
            handleClearFilters();
          }}
          onEditAccident={(a) => {
            setEditingAccident(a);
            setIsAccidentModalOpen(true);
          }}
          onDeleteAccident={(a) => setDeletingItem({ type: 'accident', item: a })}
        />
      ) : (
        <InspectionsTable
          inspections={filteredInspections}
          paginatedList={paginatedList}
          onResetFilters={() => {
            setSearchQuery('');
            handleClearFilters();
            setActiveTab('all');
          }}
          onViewDetails={(i) => {
            setSelectedInspection(i);
            setIsDetailsModalOpen(true);
          }}
          onEditInspection={(i) => {
            setEditingInspection(i);
            setIsInspectionModalOpen(true);
          }}
          onDeleteInspection={(i) => setDeletingItem({ type: 'inspection', item: i })}
        />
      )}

      {/* Pagination */}
      {currentList.length > 0 && activeTab !== 'awaiting' && (
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
