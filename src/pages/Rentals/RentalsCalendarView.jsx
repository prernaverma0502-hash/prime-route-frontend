import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  Car,
  Clock,
  User,
  Info,
  CheckCircle2,
  AlertTriangle,
  Eye,
  FileText
} from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/formatters';

const STATUS_CONFIG = {
  Draft: {
    bg: 'bg-slate-500',
    border: 'border-slate-600',
    lightBg: 'bg-slate-100 text-slate-700',
    badge: 'Draft'
  },
  'Awaiting Signature': {
    bg: 'bg-amber-500',
    border: 'border-amber-600',
    lightBg: 'bg-amber-100 text-amber-800',
    badge: 'Awaiting Signature'
  },
  Active: {
    bg: 'bg-blue-600',
    border: 'border-blue-700',
    lightBg: 'bg-blue-100 text-blue-800',
    badge: 'Active Lease'
  },
  Renewed: {
    bg: 'bg-purple-600',
    border: 'border-purple-700',
    lightBg: 'bg-purple-100 text-purple-800',
    badge: 'Renewed / Extended'
  },
  Completed: {
    bg: 'bg-emerald-600',
    border: 'border-emerald-700',
    lightBg: 'bg-emerald-100 text-emerald-800',
    badge: 'Returned / Completed'
  },
  Terminated: {
    bg: 'bg-rose-500',
    border: 'border-rose-600',
    lightBg: 'bg-rose-100 text-rose-800',
    badge: 'Terminated / Cancelled'
  }
};

export default function RentalsCalendarView({
  rentals = [],
  vehicles = [],
  onSelectRental,
  onViewAgreement
}) {
  // Determine initial month based on rentals date range or current date
  const [currentDate, setCurrentDate] = useState(() => {
    // Check if rentals have 2025 dates
    const sample = rentals.find((r) => r.startDate);
    if (sample && sample.startDate) {
      const parts = sample.startDate.split('-');
      if (parts.length === 3) {
        return new Date(Number(parts[0]), Number(parts[1]) - 1, 1);
      }
    }
    return new Date();
  });

  const [selectedRentalPreview, setSelectedRentalPreview] = useState(null);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');

  // Month navigation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const daysInMonth = useMemo(() => {
    return new Date(year, month + 1, 0).getDate();
  }, [year, month]);

  const daysArray = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [daysInMonth]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Filter rentals by status if selected
  const activeRentals = useMemo(() => {
    if (selectedStatusFilter === 'All') return rentals;
    return rentals.filter((r) => r.status === selectedStatusFilter);
  }, [rentals, selectedStatusFilter]);

  // Compute rentals per vehicle for current month
  // A rental overlaps this month if:
  // rental.startDate <= monthEnd && rental.endDate >= monthStart
  const monthStartStr = `${year}-${String(month + 1).padStart(2, '0')}-01`;
  const monthEndStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;

  const vehicleRows = useMemo(() => {
    return vehicles.map((vehicle) => {
      // Find all rentals for this vehicle
      const vehicleRentals = activeRentals.filter((r) => {
        const matchesVehicle =
          r.vehicleId === vehicle.id ||
          (r.vehicle && (r.vehicle.includes(vehicle.plate) || r.vehicle.includes(vehicle.model)));

        if (!matchesVehicle) return false;

        // Check date overlap with current month
        const rStart = r.startDate;
        const rEnd = r.endDate || r.startDate;
        return rStart <= monthEndStr && rEnd >= monthStartStr;
      });

      return {
        vehicle,
        rentals: vehicleRentals
      };
    });
  }, [vehicles, activeRentals, monthStartStr, monthEndStr]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden space-y-4">
      {/* Calendar Header Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#F8FAFC]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#075EE8] shrink-0">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#071D49] flex items-center gap-2">
              <span>Fleet Schedule &amp; Lease Calendar</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-[#075EE8]">
                {monthName}
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Interactive fleet timeline showing active bookings, lease spans, and vehicle turnarounds
            </p>
          </div>
        </div>

        {/* Month Selector Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter Chips */}
          <div className="flex items-center gap-1 overflow-x-auto mr-2">
            {['All', 'Active', 'Awaiting Signature', 'Renewed', 'Completed', 'Draft'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatusFilter(status)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  selectedStatusFilter === status
                    ? 'bg-[#075EE8] text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-0.5 shadow-2xs">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Status Color Legend */}
      <div className="px-4 sm:px-5 flex flex-wrap items-center gap-3 text-xs border-b border-slate-100 pb-3">
        <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] mr-1">Legend:</span>
        <span className="flex items-center gap-1.5 text-slate-700">
          <span className="w-2.5 h-2.5 rounded-sm bg-blue-600"></span> Active
        </span>
        <span className="flex items-center gap-1.5 text-slate-700">
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span> Awaiting Signature
        </span>
        <span className="flex items-center gap-1.5 text-slate-700">
          <span className="w-2.5 h-2.5 rounded-sm bg-purple-600"></span> Renewed
        </span>
        <span className="flex items-center gap-1.5 text-slate-700">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600"></span> Completed
        </span>
        <span className="flex items-center gap-1.5 text-slate-700">
          <span className="w-2.5 h-2.5 rounded-sm bg-slate-500"></span> Draft
        </span>
        <span className="flex items-center gap-1.5 text-slate-700">
          <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span> Terminated
        </span>
      </div>

      {/* Calendar Matrix View */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[1100px] px-4 sm:px-5">
          {/* Days of Month Header */}
          <div className="grid grid-cols-[220px_repeat(31,minmax(28px,1fr))] border-b border-slate-200 text-center font-mono text-[11px] font-bold text-slate-500 bg-slate-50/70 rounded-t-xl py-2">
            <div className="text-left pl-3 text-slate-700 font-sans uppercase tracking-wider text-xs font-bold">
              Vehicle / Plate
            </div>
            {daysArray.map((day) => {
              const d = new Date(year, month, day);
              const dayName = d.toLocaleDateString('en-US', { weekday: 'narrow' });
              const isWeekend = d.getDay() === 0 || d.getDay() === 6;

              return (
                <div
                  key={day}
                  className={`flex flex-col items-center justify-center ${
                    isWeekend ? 'text-slate-400 bg-slate-100/50' : 'text-slate-700'
                  }`}
                >
                  <span className="text-[10px] text-slate-400 uppercase font-sans">{dayName}</span>
                  <span className="font-extrabold">{day}</span>
                </div>
              );
            })}
          </div>

          {/* Vehicle Rows */}
          <div className="divide-y divide-slate-100 border-x border-b border-slate-200 rounded-b-xl">
            {vehicleRows.map(({ vehicle, rentals: vRentals }) => (
              <div
                key={vehicle.id}
                className="grid grid-cols-[220px_repeat(31,minmax(28px,1fr))] items-center hover:bg-slate-50/40 transition-colors py-2.5"
              >
                {/* Vehicle Identity Column */}
                <div className="pr-2 pl-3 flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/80 flex items-center justify-center text-[#075EE8] shrink-0">
                    <Car className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1 text-xs">
                    <p className="font-bold text-[#071D49] truncate">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <span className="font-mono font-semibold">{vehicle.plate}</span>
                      <span>•</span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                          vehicle.status === 'Available'
                            ? 'bg-emerald-50 text-emerald-700'
                            : vehicle.status === 'Rented'
                            ? 'bg-blue-50 text-blue-700'
                            : vehicle.status === 'Maintenance'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {vehicle.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Days Grid & Spanning Rental Bars */}
                <div className="col-span-31 grid grid-cols-31 relative h-9 items-center">
                  {/* Background grid lines for day columns */}
                  {daysArray.map((day) => {
                    const d = new Date(year, month, day);
                    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                    return (
                      <div
                        key={day}
                        className={`h-full border-r border-slate-100 ${
                          isWeekend ? 'bg-slate-50/50' : ''
                        }`}
                      />
                    );
                  })}

                  {/* Render Rental Bars */}
                  {vRentals.map((r) => {
                    // Compute start and end days within this month
                    const [rStartYear, rStartMonth, rStartDay] = r.startDate.split('-').map(Number);
                    const [rEndYear, rEndMonth, rEndDay] = (r.endDate || r.startDate).split('-').map(Number);

                    const rStartDate = new Date(rStartYear, rStartMonth - 1, rStartDay);
                    const rEndDate = new Date(rEndYear, rEndMonth - 1, rEndDay);

                    const monthStart = new Date(year, month, 1);
                    const monthEnd = new Date(year, month, daysInMonth);

                    const effectiveStart = rStartDate < monthStart ? 1 : rStartDate.getDate();
                    const effectiveEnd = rEndDate > monthEnd ? daysInMonth : rEndDate.getDate();

                    const colStart = effectiveStart;
                    const colSpan = Math.max(1, effectiveEnd - effectiveStart + 1);

                    const cfg = STATUS_CONFIG[r.status] || STATUS_CONFIG.Active;

                    return (
                      <div
                        key={r.id}
                        style={{
                          gridColumnStart: colStart,
                          gridColumnEnd: `span ${colSpan}`
                        }}
                        onClick={() => {
                          setSelectedRentalPreview(r);
                          if (onSelectRental) onSelectRental(r);
                        }}
                        className={`absolute inset-y-1 mx-0.5 rounded-lg ${cfg.bg} text-white px-2 flex items-center justify-between text-[11px] font-bold shadow-xs cursor-pointer hover:brightness-110 transition-all select-none group z-10`}
                        title={`${r.id} - ${r.customer} (${formatDate(r.startDate)} to ${formatDate(r.endDate)})`}
                      >
                        <span className="truncate pr-1">
                          {r.id}: {r.customer || r.driver}
                        </span>
                        <span className="text-[10px] opacity-80 shrink-0 hidden sm:inline">
                          {formatCurrency(r.total || r.amount)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Rental Quick Preview Drawer / Banner */}
      {selectedRentalPreview && (
        <div className="p-4 mx-4 sm:mx-5 mb-4 bg-blue-50/80 rounded-2xl border border-blue-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#075EE8] text-sm">
                  {selectedRentalPreview.id}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                    (STATUS_CONFIG[selectedRentalPreview.status] || STATUS_CONFIG.Active).lightBg
                  }`}
                >
                  {selectedRentalPreview.status}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {selectedRentalPreview.rentalType || 'Commercial Lease'}
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-0.5">
                Driver: <strong>{selectedRentalPreview.driver || selectedRentalPreview.customer}</strong> • Vehicle: <strong>{selectedRentalPreview.vehicle}</strong> • Dates: <strong>{formatDate(selectedRentalPreview.startDate)}</strong> to <strong>{formatDate(selectedRentalPreview.endDate)}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            {onViewAgreement && (
              <button
                onClick={() => onViewAgreement(selectedRentalPreview)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-blue-200 text-xs font-bold text-[#071D49] hover:bg-blue-50 transition-all cursor-pointer shadow-2xs"
              >
                <FileText className="w-3.5 h-3.5 text-[#075EE8]" /> View Agreement
              </button>
            )}
            <button
              onClick={() => setSelectedRentalPreview(null)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

