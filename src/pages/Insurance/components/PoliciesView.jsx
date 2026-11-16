import React from 'react';
import {
  ShieldCheck,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  FileCheck,
  Building,
  Edit2,
  Clock,
  Car
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../../utils/formatters';

export default function PoliciesView({
  policies,
  onEditPolicy,
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {policies.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] p-5 flex flex-col justify-between hover:border-blue-200 transition-all group"
          >
            <div>
              {/* Card Header: Insurer & Status */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0 shadow-2xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#0A1E42] group-hover:text-blue-600 transition-colors">
                      {p.insurer}
                    </h3>
                    <p className="font-mono text-[11px] font-bold text-slate-500 mt-0.5">
                      {p.policyNumber}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold shrink-0 ${
                    p.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {p.status}
                </span>
              </div>

              {/* Coverage Details */}
              <div className="py-3.5 space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Coverage & Policy Scope
                  </span>
                  <p className="font-semibold text-slate-800 leading-snug">
                    {p.coverage}
                  </p>
                </div>

                {/* Financials: Premium & Deductible */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50/70 border border-slate-100 rounded-xl">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Annual Premium
                    </span>
                    <p className="font-mono font-extrabold text-sm text-[#0A1E42] mt-0.5">
                      {formatCurrency(p.premium)}
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium">
                      ~{formatCurrency(Math.round(p.premium / 12))}/mo
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Deductible Terms
                    </span>
                    <p className="text-xs font-bold text-slate-700 mt-0.5">
                      {p.deductible || p.deductibleTerms}
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Per Occurrence
                    </span>
                  </div>
                </div>

                {/* Validity Period & Expiry Countdown */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Effective – Expiry
                    </span>
                    <span className="font-mono text-slate-700 font-semibold mt-0.5 block">
                      {formatDate(p.effectiveDate)} – {formatDate(p.expiryDate)}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-200">
                    <Clock className="w-3 h-3" />
                    {p.daysRemaining} days left
                  </span>
                </div>

                {/* Contacts Box */}
                {p.contacts && (
                  <div className="p-3 bg-blue-50/40 border border-blue-100 rounded-xl space-y-1.5 text-xs">
                    <p className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                      <Building className="w-3 h-3 text-blue-600" />
                      {p.contacts.agentName || 'Agent Office'}
                    </p>
                    <div className="flex flex-col gap-0.5 text-[11px] text-slate-600">
                      {p.contacts.phone && (
                        <p className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span className="font-mono">{p.contacts.phone}</span>
                        </p>
                      )}
                      {p.contacts.email && (
                        <p className="flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="text-blue-600 hover:underline">{p.contacts.email}</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Documents Vouchers */}
                {p.documents && p.documents.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Verified Policy Documents
                    </span>
                    <div className="space-y-1">
                      {p.documents.map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-lg text-xs"
                        >
                          <span className="flex items-center gap-1.5 font-mono text-[11px] text-slate-700 truncate">
                            <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            {doc.name}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">{doc.size}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                Covered: <strong>{p.vehiclesCovered || 'Fleet'}</strong>
              </span>
              <button
                onClick={() => onEditPolicy(p)}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit Policy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

