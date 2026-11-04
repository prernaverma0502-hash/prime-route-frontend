import React, { useState } from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Car,
  Star,
  ShieldCheck,
  AlertCircle,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ClipboardCheck,
  Receipt,
  ShieldAlert,
  FileSpreadsheet
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import { formatCurrency } from '../../utils/formatters';
import DriverStatementModal from '../../components/drivers/DriverStatementModal';

export default function DriverDetailsModal({
  isOpen,
  onClose,
  driver,
  onEdit,
  onDelete
}) {
  const [showSensitive, setShowSensitive] = useState(false);
  const [activeDriverTab, setActiveDriverTab] = useState('overview'); // overview, rentals, inspections, tickets, accidents
  const [isStatementOpen, setIsStatementOpen] = useState(false);

  if (!isOpen || !driver) return null;

  const maskedLicense = showSensitive
    ? driver.license
    : `${driver.license?.slice(0, 5) || 'DL-NY'}••••••`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={driver.name}
      subtitle={`ID: ${driver.id} • License: ${driver.license}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Driver Top Banner */}
        <div className="bg-gradient-to-r from-[#071D49] to-[#0D2D6C] rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-4 z-10">
            <img
              src={driver.avatar}
              alt={driver.name}
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white/20 shadow-xl"
            />
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <StatusBadge status={driver.status} />
                <span className="flex items-center gap-1 text-xs text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3 fill-amber-300" /> {driver.rating || '4.9'}
                </span>
              </div>
              <h2 className="text-2xl font-black text-white">{driver.name}</h2>
              <p className="text-slate-300 text-xs mt-0.5">
                {driver.vehicle || 'No Assigned Vehicle'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 z-10">
            <button
              onClick={() => setIsStatementOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-[#071D49] hover:bg-slate-100 text-xs font-bold shadow transition-all"
            >
              <Receipt className="w-3.5 h-3.5" /> Statement
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(driver);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm transition-all"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit
            </button>
            <button
              onClick={() => {
                onClose();
                onDelete(driver);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold backdrop-blur-sm transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 text-xs font-medium">Completed Trips</span>
            <p className="text-lg font-bold text-[#0A1E42] mt-0.5">{driver.tripsCount || 280}</p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 text-xs font-medium">Monthly Rate</span>
            <p className="text-lg font-bold text-[#0A1E42] mt-0.5">{driver.salaryRate || '$2,400/mo'}</p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 text-xs font-medium">Outstanding Balance</span>
            <p className={`text-lg font-bold mt-0.5 ${driver.balance > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {formatCurrency(driver.balance)}
            </p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 text-xs font-medium">License Expiry</span>
            <p className="text-sm font-bold text-[#0A1E42] mt-1 truncate">{driver.licenseExpiry || '2026-11-20'}</p>
          </div>
        </div>

        {/* Driver Navigation Sub-tabs */}
        <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Driver Overview', icon: User },
            { id: 'rentals', label: 'Rental Contracts', icon: FileSpreadsheet },
            { id: 'inspections', label: 'Inspections', icon: ClipboardCheck },
            { id: 'tickets', label: 'Tolls & Violations', icon: Receipt },
            { id: 'accidents', label: 'Accidents & Claims', icon: ShieldAlert },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeDriverTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveDriverTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#075EE8] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Detailed Info Cards (Overview) */}
        {activeDriverTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs animate-fade-in">
            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-2.5">
              <h4 className="font-bold text-sm text-[#0A1E42] flex items-center gap-2">
                <User className="w-4 h-4 text-[#075EE8]" /> Contact &amp; Personal Info
              </h4>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{driver.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{driver.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{driver.address || '142 W 57th St, New York, NY'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Joined: {driver.joiningDate || '2023-02-15'}</span>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-2.5">
              <h4 className="font-bold text-sm text-[#0A1E42] flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#075EE8]" /> Commercial License &amp; ID
                </span>
                <button
                  type="button"
                  onClick={() => setShowSensitive((p) => !p)}
                  className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800"
                >
                  {showSensitive ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {showSensitive ? 'Hide Sensitive' : 'Reveal Data'}
                </button>
              </h4>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Commercial License ID:</span>
                <span className="font-mono font-bold text-slate-800">{maskedLicense}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Assigned Vehicle:</span>
                <span className="font-bold text-[#075EE8]">{driver.vehicle}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Emergency Contact:</span>
                <span className="font-semibold text-slate-700">{driver.emergencyContact || 'Rachel Vance (+1 555-901-2244)'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Background Verification:</span>
                <span className="font-bold text-emerald-600">Passed &amp; Approved</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Rentals */}
        {activeDriverTab === 'rentals' && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs space-y-2 animate-fade-in">
            <h4 className="font-bold text-[#0A1E42] uppercase text-[11px]">Active &amp; Historical Rental Contracts</h4>
            <div className="bg-white p-3 rounded-lg border border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-[#0A1E42]">RNT-2025-001 (Monthly Commercial Lease)</p>
                <p className="text-[10px] text-slate-400">Vehicle: {driver.vehicle} • Jul 01, 2025 – Jul 31, 2025</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">Active</span>
            </div>
          </div>
        )}

        {/* Tab 3: Inspections */}
        {activeDriverTab === 'inspections' && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs space-y-2 animate-fade-in">
            <h4 className="font-bold text-[#0A1E42] uppercase text-[11px]">Vehicle Handover &amp; Return Checklists</h4>
            <div className="bg-white p-3 rounded-lg border border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-[#0A1E42]">Check-out (Pickup Handover) – INSP-8819</p>
                <p className="text-[10px] text-slate-400">Odometer: 14,200 mi • Fuel: 100% • Certified by Marcus Brody</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">Passed</span>
            </div>
          </div>
        )}

        {/* Tab 4: Tickets */}
        {activeDriverTab === 'tickets' && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs space-y-2 animate-fade-in">
            <h4 className="font-bold text-[#0A1E42] uppercase text-[11px]">Tolls &amp; Citations Incurred</h4>
            <div className="bg-white p-3 rounded-lg border border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-[#0A1E42]">Parking Violation ($75 + $15 admin fee)</p>
                <p className="text-[10px] text-slate-400">NYC Dept of Finance • Jul 04, 2025 • Manhattan 45th St</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700">Charged to Driver</span>
            </div>
          </div>
        )}

        {/* Tab 5: Accidents */}
        {activeDriverTab === 'accidents' && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs space-y-2 animate-fade-in">
            <h4 className="font-bold text-[#0A1E42] uppercase text-[11px]">Accident &amp; Damage Claims Record</h4>
            <div className="bg-white p-3 rounded-lg border border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-[#0A1E42]">ACC-2025-012 (Rear bumper scratch)</p>
                <p className="text-[10px] text-slate-400">Claim: CLM-TRV-882190 • Deductible $500 settled</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">Settled</span>
            </div>
          </div>
        )}
      </div>

      {/* Driver Monthly Account Statement Modal */}
      <DriverStatementModal
        isOpen={isStatementOpen}
        onClose={() => setIsStatementOpen(false)}
        driver={driver}
      />
    </Modal>
  );
}

