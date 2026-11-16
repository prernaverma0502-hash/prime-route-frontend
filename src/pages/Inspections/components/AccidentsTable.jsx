import React from 'react';
import { Edit2, Trash2, FileCheck, ShieldAlert, Wrench } from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import EmptyState from '../../../components/common/EmptyState';
import { formatCurrency, formatDate } from '../../../utils/formatters';

export default function AccidentsTable({
  accidents,
  paginatedList,
  onResetFilters,
  onEditAccident,
  onDeleteAccident,
}) {
  if (accidents.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
        <EmptyState
          title="No accident records found"
          description="No incident or insurance claim records match your parameters."
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
              <th className="py-3.5 px-4">Claim ID & Date</th>
              <th className="py-3.5 px-4">Vehicle & Driver</th>
              <th className="py-3.5 px-4">Damage Description & Shop</th>
              <th className="py-3.5 px-4">Estimate & Invoice</th>
              <th className="py-3.5 px-4">Insurance & Policy</th>
              <th className="py-3.5 px-4">Deductible & Driver Charge</th>
              <th className="py-3.5 px-4">Amount Recovered</th>
              <th className="py-3.5 px-4">Resolution Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {paginatedList.map((a) => {
              const totalRecovered = (Number(a.insurancePaid) || 0) + (Number(a.driverRecovered) || 0);

              return (
                <tr key={a.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-amber-600 block">{a.id}</span>
                    <span className="text-[10px] text-slate-400">{formatDate(a.incidentDate || a.date)}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-bold text-[#0A1E42]">{a.vehicle}</p>
                    <p className="text-[11px] text-slate-500">{a.plate} • <span className="text-slate-700 font-semibold">{a.driver}</span></p>
                  </td>

                  <td className="py-3.5 px-4 max-w-[200px]">
                    <p className="font-medium text-slate-800 truncate" title={a.damage || a.damageDescription}>
                      {a.damage || a.damageDescription}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                      <Wrench className="w-3 h-3 text-slate-400 shrink-0" />
                      {a.assignedShop || 'Speedy Pro Auto Clinic'}
                    </p>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-mono font-extrabold text-[#0A1E42]">
                      {formatCurrency(a.repairEstimate)}
                    </p>
                    {a.repairInvoiceNumber && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mt-0.5">
                        <FileCheck className="w-2.5 h-2.5" />
                        {a.repairInvoiceNumber}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-800 text-[11px] truncate max-w-[150px]">
                      {a.insuranceCarrier}
                    </p>
                    <p className="text-[10px] font-mono text-blue-600 mt-0.5">
                      {a.claimNumber || 'Claim In Review'}
                    </p>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="text-[11px] font-semibold text-slate-700">
                      {a.deductibleTerms || formatCurrency(a.deductibleAmount)}
                    </p>
                    <p className="text-[10px] text-rose-600 font-bold mt-0.5">
                      Billed to Driver: {formatCurrency(a.driverCharge !== undefined ? a.driverCharge : a.deductibleAmount)}
                    </p>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-mono font-extrabold text-emerald-600">
                      {formatCurrency(a.amountRecovered || totalRecovered)}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Ins: {formatCurrency(a.insurancePaid || 0)} • Drv: {formatCurrency(a.driverRecovered || 0)}
                    </p>
                  </td>

                  <td className="py-3.5 px-4">
                    <StatusBadge status={a.resolutionStatus || a.status} />
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onEditAccident(a)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Edit Claim"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteAccident(a)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
