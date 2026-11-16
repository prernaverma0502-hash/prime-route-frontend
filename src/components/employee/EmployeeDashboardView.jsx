import React from 'react';
import {
  FileText,
  CarFront,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  User,
  MapPin,
  Fuel,
  Gauge,
  Phone,
  FileCheck
} from 'lucide-react';
import { useRole } from '../../context/RoleContext';
import StatusBadge from '../common/StatusBadge';

export default function EmployeeDashboardView({ onNavigate }) {
  const { activeRole, paperworkData } = useRole();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <StatusBadge status="Approved" />;
      case 'Pending Review':
        return <StatusBadge status="Pending Review" />;
      case 'Draft':
        return <StatusBadge status="Draft" />;
      case 'Rejected':
        return <StatusBadge status="Rejected" />;
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Action Required
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgba(7,29,73,0.03)]">
        <div className="flex items-center gap-4">
          <img
            src={activeRole.avatar}
            alt={activeRole.fullName}
            onError={(e) => { e.currentTarget.src = '/placeholders/avatar-default.svg'; }}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-blue-50 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-[#0A1E42] tracking-tight">
                Welcome back, {activeRole.fullName}!
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#075EE8] border border-blue-200">
                {activeRole.title}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Employee ID: <strong className="text-slate-700 font-mono">PR-EMP-2026</strong> • Department: Fleet Operations • Depot: New York HQ
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('employee-paperwork')}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#075EE8] hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
        >
          <FileCheck className="w-4 h-4" />
          My Onboarding Paperwork
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* High-Priority Paperwork Status Banner */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50/50 to-slate-50 p-5 rounded-3xl border border-blue-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#075EE8] text-white rounded-2xl shadow-sm shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-base font-bold text-[#0A1E42]">
                Employee Onboarding &amp; Compliance Paperwork
              </h3>
              {getStatusBadge(paperworkData.status)}
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {paperworkData.status === 'Approved'
                ? 'Your paperwork has been reviewed and verified by the compliance department. Your credentials and certifications are active.'
                : paperworkData.status === 'Pending Review'
                ? 'Your paperwork has been submitted and is currently being reviewed by operations management. We will notify you once approved.'
                : 'All PrimeRoute fleet drivers and staff must complete personal information, upload required documents (ID, License, Tax Form), and sign safety policies before commencing routes.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('employee-paperwork')}
          className="px-4 py-2 rounded-xl bg-white hover:bg-blue-50 text-[#075EE8] border border-blue-200 font-bold text-xs shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
        >
          {paperworkData.status === 'Approved' ? 'View Submitted Documents' : 'Open Paperwork Form'}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Grid: Assigned Vehicle & Shift Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assigned Vehicle Card */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgba(7,29,73,0.03)] space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Current Assignment</span>
              <h3 className="text-lg font-bold text-[#0A1E42] mt-0.5">Assigned Fleet Vehicle</h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Active Assignment
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="sm:col-span-1">
              <img
                src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&auto=format&fit=crop&q=80"
                alt="Ford Transit 250"
                onError={(e) => { e.currentTarget.src = '/placeholders/vehicle-default.svg'; }}
                className="w-full h-32 rounded-xl object-cover shadow-xs"
              />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <div className="flex items-baseline justify-between">
                <h4 className="text-base font-bold text-[#0A1E42]">2024 Ford Transit 250 High Roof</h4>
                <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-mono text-xs font-bold text-slate-700">
                  PR-6502
                </span>
              </div>
              <p className="text-xs text-slate-500">VIN: 1FTBR1Y88PKA98231 • Type: Cargo Van</p>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 block">Odometer</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                    <Gauge className="w-3.5 h-3.5 text-blue-600" />
                    24,850 mi
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Fuel Level</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                    <Fuel className="w-3.5 h-3.5 text-emerald-600" />
                    85% Full
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Next Service</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    Nov 28
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Depot: Bay 4, New York Central Hub
            </div>
            <button
              onClick={() => onNavigate('inspections')}
              className="text-xs font-bold text-[#075EE8] hover:underline flex items-center gap-1"
            >
              Start Pre-Trip Inspection →
            </button>
          </div>
        </div>

        {/* Quick Driver KPIs & Safety */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgba(7,29,73,0.03)] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-[#0A1E42]">Performance Summary</h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              Good Standing
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0A1E42]">Safety Score</p>
                  <p className="text-[11px] text-slate-500">Based on telemetry</p>
                </div>
              </div>
              <span className="text-base font-black text-blue-600 font-mono">98/100</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                  <CarFront className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0A1E42]">Trips Completed</p>
                  <p className="text-[11px] text-slate-500">This Month</p>
                </div>
              </div>
              <span className="text-base font-black text-slate-800 font-mono">42</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0A1E42]">Hours Logged</p>
                  <p className="text-[11px] text-slate-500">Current Cycle</p>
                </div>
              </div>
              <span className="text-base font-black text-slate-800 font-mono">148 hrs</span>
            </div>
          </div>

          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-slate-600">
            <strong className="text-[#075EE8] block mb-0.5">Assigned Dispatcher:</strong>
            Marcus Vance (+1 555-019-3321) • Available 24/7 on channel #3
          </div>
        </div>
      </div>
    </div>
  );
}

