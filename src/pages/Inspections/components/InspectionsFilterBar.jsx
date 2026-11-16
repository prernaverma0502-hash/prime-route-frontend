import React from 'react';
import { Filter, X } from 'lucide-react';
import SearchBar from '../../../components/common/SearchBar';

export default function InspectionsFilterBar({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  isFilterOpen,
  setIsFilterOpen,
  filterRef,
  activeFilterCount,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  vehicleFilter,
  setVehicleFilter,
  availableVehicles,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onClearFilters,
  awaitingCount = 0,
  unresolvedAccidentsCount = 0,
}) {
  const tabs = [
    { id: 'all', label: 'All Inspections' },
    { id: 'awaiting', label: '⏳ Awaiting Inspection', badge: awaitingCount, badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'pickup', label: '🚀 Pickup (Check-out)' },
    { id: 'return', label: '📥 Return (Check-in)' },
    { id: 'damaged', label: '⚠️ Damage Detected' },
    { id: 'accidents', label: '🛡️ Accident Claims', badge: unresolvedAccidentsCount ? `${unresolvedAccidentsCount} Open` : null, badgeColor: 'bg-rose-100 text-rose-800' },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : tab.badgeColor || 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="w-full md:w-72">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            placeholder={
              activeTab === 'accidents'
                ? 'Search claim #, driver, vehicle...'
                : activeTab === 'awaiting'
                ? 'Search vehicle, plate, contract...'
                : 'Search inspection #, plate, driver...'
            }
          />
        </div>

        {/* Inspection Filter Dropdown Popover */}
        <div className="relative" ref={filterRef}>
          <button
            type="button"
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer shadow-xs active:scale-95 ${
              activeFilterCount > 0 || isFilterOpen
                ? 'bg-blue-50 border-[#075EE8] text-[#075EE8] ring-2 ring-[#075EE8]/20'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
            }`}
            aria-label="Filter inspections"
            title="Filter inspections"
          >
            <Filter className="w-3.5 h-3.5 text-[#075EE8]" />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#075EE8] text-white text-[10px] font-black flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Filter Dropdown Popover Menu */}
          {isFilterOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-scale-up space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#075EE8]" />
                  <h4 className="text-xs font-bold text-[#0A1E42] uppercase tracking-wider">
                    Filters
                  </h4>
                </div>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={onClearFilters}
                    className="text-[11px] text-rose-600 hover:underline font-semibold"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-500"
                >
                  <option value="All">All Statuses</option>
                  <option value="Passed">Passed (Clean)</option>
                  <option value="Damage Detected">Damage Detected</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Settled">Settled (Claims)</option>
                  <option value="Open">Open (Claims)</option>
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Inspection Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-500"
                >
                  <option value="All">All Types</option>
                  <option value="Check-out (Pickup)">Pickup / Handover</option>
                  <option value="Check-in (Return)">Return / Check-in</option>
                </select>
              </div>

              {/* Vehicle Filter */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Vehicle
                </label>
                <select
                  value={vehicleFilter}
                  onChange={(e) => setVehicleFilter(e.target.value)}
                  className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-500"
                >
                  {availableVehicles.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">From Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-[11px] px-2 py-1 rounded border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">To Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-[11px] px-2 py-1 rounded border border-slate-200"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
