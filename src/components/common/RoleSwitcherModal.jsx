import React from 'react';
import {
  ShieldCheck,
  Shield,
  Briefcase,
  DollarSign,
  Wrench,
  KeyRound,
  Eye,
  Check,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import Modal from '../common/Modal';
import { useRole } from '../../context/RoleContext';

export default function RoleSwitcherModal({ isOpen, onClose, onRoleSwitched }) {
  const { currentRoleId, switchRole, returnToAdmin, rolesList } = useRole();

  const roleMeta = {
    owner: {
      icon: ShieldCheck,
      color: 'from-purple-600 to-indigo-800',
      tag: 'Owner Root Access',
      highlights: ['Full Access', 'Users & Settings', 'Finance & P&L', 'Reports & Audit Logs']
    },
    secondary_admin: {
      icon: Shield,
      color: 'from-blue-600 to-indigo-700',
      tag: 'Operations Admin',
      highlights: ['Broad Operations', 'Vehicles & Rentals', 'Approval Required on Sensitive Actions', 'Staff Dispatch']
    },
    finance: {
      icon: DollarSign,
      color: 'from-emerald-600 to-teal-700',
      tag: 'Accounting & Ledger',
      highlights: ['Invoices & Payments', 'Expense Approvals', 'Deposit Escrow Ledger', 'Financial Reports']
    },
    fleet_maintenance: {
      icon: Wrench,
      color: 'from-amber-600 to-orange-700',
      tag: 'Fleet & Service Lead',
      highlights: ['Vehicle Registry', 'Odometer & Mileage', '5,000-mi Maintenance', 'Work Orders & Inspections']
    },
    rental_operations: {
      icon: KeyRound,
      color: 'from-cyan-600 to-blue-700',
      tag: 'Front Desk & Dispatch',
      highlights: ['Driver Intake (Masked PII)', 'Rental Contracts', 'Vehicle Pickups', 'Check-in Returns']
    },
    readonly_manager: {
      icon: Eye,
      color: 'from-slate-600 to-slate-800',
      tag: 'Audit & Compliance',
      highlights: ['View-Only Dashboards', 'Auditing Reports', 'Zero Write/Edit Privileges', 'Read-Only Inspections']
    }
  };

  const handleSelectRole = (roleId) => {
    switchRole(roleId);
    if (onRoleSwitched) onRoleSwitched(roleId);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Switch Role Preview"
      subtitle="Demo mode: in production roles are enforced by the backend"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Mandatory Production Enforcement Disclaimer Banner */}
        <div className="p-3.5 bg-gradient-to-r from-blue-50 via-indigo-50/40 to-slate-50 rounded-2xl border border-blue-200/80 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[#075EE8] text-white shrink-0 shadow-xs mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <p className="font-extrabold text-[#0A1E42] flex items-center gap-2">
              <span>Demo mode: in production roles are enforced by the backend</span>
              <span className="px-2 py-0.5 bg-blue-100 text-[#075EE8] rounded-md text-[10px] uppercase font-bold">
                6 RBAC Roles
              </span>
            </p>
            <p className="text-slate-600 mt-1 leading-relaxed">
              Select any of the 6 client roles below to simulate how navigation menus, action buttons, PII masking, and approval barriers are dynamically rendered across PrimeRoute.
            </p>
          </div>
        </div>

        {/* Roles List */}
        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {rolesList.map((role) => {
            const meta = roleMeta[role.id] || roleMeta.owner;
            const Icon = meta.icon;
            const isSelected = currentRoleId === role.id;

            return (
              <div
                key={role.id}
                onClick={() => handleSelectRole(role.id)}
                className={`group relative p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-[#075EE8] border-[#075EE8] bg-blue-50/20 shadow-md'
                    : 'border-slate-200 hover:bg-slate-50/80 hover:border-blue-400'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    {/* User Avatar + Role Icon */}
                    <div className="relative shrink-0">
                      <img
                        src={role.avatar}
                        alt={role.fullName}
                        onError={(e) => { e.currentTarget.src = '/placeholders/avatar-default.svg'; }}
                        className="w-11 h-11 rounded-2xl object-cover ring-2 ring-white shadow-xs"
                      />
                      <div className={`absolute -bottom-1 -right-1 p-1 rounded-lg bg-gradient-to-br ${meta.color} text-white shadow-xs`}>
                        <Icon className="w-3 h-3" />
                      </div>
                    </div>

                    {/* Role Information */}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-[#0A1E42] text-sm group-hover:text-blue-600 transition-colors">
                          {role.name}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${role.badgeColor}`}>
                          {meta.tag}
                        </span>
                        {isSelected && (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded-full">
                            <Check className="w-3 h-3 stroke-[3]" /> Active Preview
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 mt-0.5">
                        <strong className="text-slate-700">{role.fullName}</strong> • {role.email}
                      </p>

                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {role.description}
                      </p>

                      {/* Visible Modules Pill Highlights */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {meta.highlights.map((h, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] text-slate-600 font-medium"
                          >
                            <span className="w-1 h-1 rounded-full bg-slate-400" />
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Switch Action Arrow */}
                  <div className="shrink-0 self-center">
                    <button
                      type="button"
                      className={`p-2 rounded-xl transition-all ${
                        isSelected
                          ? 'bg-[#075EE8] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-400 group-hover:bg-[#075EE8] group-hover:text-white'
                      }`}
                      aria-label={`Select ${role.name}`}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              returnToAdmin();
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Owner / Primary Admin
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
