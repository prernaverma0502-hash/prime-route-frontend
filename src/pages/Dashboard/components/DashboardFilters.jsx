import React from 'react';
import {
  Calendar,
  CarFront,
  Users,
  Layers,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';

export default function DashboardFilters({
  dateRange,
  setDateRange,
  selectedVehicleFilter,
  setSelectedVehicleFilter,
  selectedDriverFilter,
  setSelectedDriverFilter,
  selectedCategoryFilter,
  setSelectedCategoryFilter,
  isFiltered,
  onResetFilters,
}) {
  return (
    <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)]">
      {/* 4 Equal-Width Filter Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs w-full">
        {/* 1. Date Filter */}
        <div className="relative flex items-center bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 rounded-xl px-3 py-2.5 transition-all">
          <Calendar className="w-4 h-4 text-[#075EE8] shrink-0 mr-2.5" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full bg-transparent font-semibold text-slate-700 focus:outline-hidden cursor-pointer pr-5 appearance-none text-xs"
          >
            <option>This Month (July 2025)</option>
            <option>Last 30 Days</option>
            <option>Second Quarter (Q2)</option>
            <option>Year to Date (2025)</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none" />
        </div>

        {/* 2. Vehicle Filter */}
        <div className="relative flex items-center bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 rounded-xl px-3 py-2.5 transition-all">
          <CarFront className="w-4 h-4 text-[#075EE8] shrink-0 mr-2.5" />
          <select
            value={selectedVehicleFilter}
            onChange={(e) => setSelectedVehicleFilter(e.target.value)}
            className="w-full bg-transparent font-semibold text-slate-700 focus:outline-hidden cursor-pointer pr-5 appearance-none text-xs"
          >
            <option>All 65 Vehicles</option>
            <option>Toyota Camry SE</option>
            <option>Tesla Model 3</option>
            <option>Honda Accord Sport</option>
            <option>Chevrolet Tahoe</option>
            <option>Ford F-150 Lariat</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none" />
        </div>

        {/* 3. Driver Filter */}
        <div className="relative flex items-center bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 rounded-xl px-3 py-2.5 transition-all">
          <Users className="w-4 h-4 text-[#075EE8] shrink-0 mr-2.5" />
          <select
            value={selectedDriverFilter}
            onChange={(e) => setSelectedDriverFilter(e.target.value)}
            className="w-full bg-transparent font-semibold text-slate-700 focus:outline-hidden cursor-pointer pr-5 appearance-none text-xs"
          >
            <option>All 48 Drivers</option>
            <option>Sarah Jenkins</option>
            <option>Marcus Vance</option>
            <option>David Miller</option>
            <option>Michael Chang</option>
            <option>Elena Rostova</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none" />
        </div>

        {/* 4. Category Filter */}
        <div className="relative flex items-center bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 rounded-xl px-3 py-2.5 transition-all">
          <Layers className="w-4 h-4 text-[#075EE8] shrink-0 mr-2.5" />
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="w-full bg-transparent font-semibold text-slate-700 focus:outline-hidden cursor-pointer pr-5 appearance-none text-xs"
          >
            <option>All Categories</option>
            <option>Sedan (28)</option>
            <option>SUV (18)</option>
            <option>Electric (10)</option>
            <option>Luxury (5)</option>
            <option>Truck (4)</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none" />
        </div>
      </div>

      {/* Active Filter Indicators & 1-Click Reset */}
      {isFiltered && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 mt-2.5 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-1.5 text-slate-500">
            <span className="font-semibold text-slate-700">Active Filters:</span>
            {dateRange !== 'This Month (July 2025)' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-[#075EE8] font-medium border border-blue-100">
                {dateRange}
              </span>
            )}
            {selectedVehicleFilter !== 'All 65 Vehicles' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-[#075EE8] font-medium border border-blue-100">
                {selectedVehicleFilter}
              </span>
            )}
            {selectedDriverFilter !== 'All 48 Drivers' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-[#075EE8] font-medium border border-blue-100">
                {selectedDriverFilter}
              </span>
            )}
            {selectedCategoryFilter !== 'All Categories' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-[#075EE8] font-medium border border-blue-100">
                {selectedCategoryFilter}
              </span>
            )}
          </div>
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

