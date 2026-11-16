import React from 'react';
import {
  ShieldAlert,
  FileCheck,
  Edit2,
  DollarSign,
  Car,
  User,
  ExternalLink,
  Phone,
  AlertTriangle
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import EmptyState from '../../../components/common/EmptyState';
import { formatCurrency, formatDate } from '../../../utils/formatters';

export default function ClaimsView({
  claims,
  onEditClaim,
  onResetFilters,
}) {
  if (claims.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
        <EmptyState
          title="No insurance claims recorded"
          description="No active or settled claims match your criteria."
          actionText="Reset All Filters"
          onAction={onResetFilters}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">Claim # & Status</th>
              <th className="py-3.5 px-4">Linked Insurance Policy</th>
              <th className="py-3.5 px-4">Linked Accident & Date</th>
              <th className="py-3.5 px-4">Vehicle & Driver</th>
              <th className="py-3.5 px-4">Claimed / Estimate</th>
              <th className="py-3.5 px-4">Carrier Disbursed</th>
              <th className="py-3.5 px-4">Deductible & Recovery</th>
              <th className="py-3.5 px-4">Assigned Adjuster</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {claims.map((claim) => (
              <tr key={claim.id} className="hover:bg-blue-50/25 transition-colors group">
                <td className="py-3.5 px-4">
                  <span className="font-mono font-extrabold text-blue-700 block">
                    {claim.claimNumber}
                  </span>
                  <div className="mt-1">
                    <StatusBadge status={claim.status} />
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <p className="font-bold text-[#0A1E42]">{claim.insurer}</p>
                  <p className="font-mono text-[10px] text-slate-500">{claim.policyNumber}</p>
                </td>

                <td className="py-3.5 px-4">
                  <span className="font-mono text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                    {claim.accidentId}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {formatDate(claim.incidentDate)}
                  </p>
                </td>

                <td className="py-3.5 px-4">
                  <p className="font-bold text-[#0A1E42]">{claim.vehicle}</p>
                  <p className="text-[11px] text-slate-500">
                    {claim.plate} • <span className="text-slate-700 font-semibold">{claim.driver}</span>
                  </p>
                </td>

                <td className="py-3.5 px-4">
                  <p className="font-mono font-extrabold text-[#0A1E42]">
                    {formatCurrency(claim.claimedAmount || claim.repairEstimate)}
                  </p>
                  {claim.repairInvoice && (
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Inv: {claim.repairInvoice}
                    </span>
                  )}
                </td>

                <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">
                  {formatCurrency(claim.insurancePaid || 0)}
                </td>

                <td className="py-3.5 px-4">
                  <p className="text-[11px] font-semibold text-slate-700">
                    Ded: {formatCurrency(claim.deductibleAmount)}
                  </p>
                  <p className="text-[10px] font-bold text-emerald-600">
                    Collected: {formatCurrency(claim.driverRecovered || 0)}
                  </p>
                </td>

                <td className="py-3.5 px-4">
                  <p className="font-medium text-slate-800">{claim.adjusterName || 'Underwriter Assigned'}</p>
                  {claim.adjusterPhone && (
                    <p className="text-[10px] font-mono text-slate-400 flex items-center gap-1 mt-0.5">
                      <Phone className="w-2.5 h-2.5" />
                      {claim.adjusterPhone}
                    </p>
                  )}
                </td>

                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => onEditClaim(claim)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Edit Claim Record"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

