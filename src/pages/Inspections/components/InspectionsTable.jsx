import React from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import EmptyState from '../../../components/common/EmptyState';
import { formatDate } from '../../../utils/formatters';

export default function InspectionsTable({
  inspections,
  paginatedList,
  onResetFilters,
  onViewDetails,
  onEditInspection,
  onDeleteInspection,
}) {
  if (inspections.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
        <EmptyState
          title="No inspection records found"
          description="No vehicle inspections match your current filter parameters."
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
              <th className="py-3.5 px-4">Inspection #</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Vehicle & Driver</th>
              <th className="py-3.5 px-4">Date & Inspector</th>
              <th className="py-3.5 px-4">Odometer</th>
              <th className="py-3.5 px-4">Fuel / Battery</th>
              <th className="py-3.5 px-4">Condition</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {paginatedList.map((i) => (
              <tr key={i.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="py-3.5 px-4">
                  <span className="font-mono font-bold text-blue-600 block">
                    {i.inspectionNumber}
                  </span>
                  <span className="text-[10px] text-slate-400">{i.id}</span>
                </td>

                <td className="py-3.5 px-4">
                  <span
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                      i.type.includes('Pickup')
                        ? 'bg-blue-50 text-blue-700 border border-blue-100'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                    }`}
                  >
                    {i.type}
                  </span>
                </td>

                <td className="py-3.5 px-4">
                  <p className="font-bold text-[#0A1E42]">{i.vehicle}</p>
                  <p className="text-[11px] text-slate-500">
                    {i.plate} • <span className="text-slate-700 font-semibold">{i.driver}</span>
                  </p>
                </td>

                <td className="py-3.5 px-4">
                  <p className="font-semibold text-slate-800">{formatDate(i.date)}</p>
                  <p className="text-[10px] text-slate-400">By: {i.inspector}</p>
                </td>

                <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                  {Number(i.odometer).toLocaleString()} mi
                </td>

                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-800 text-[11px]">{i.fuelLevel}%</span>
                    <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          i.fuelLevel >= 80 ? 'bg-emerald-500' : i.fuelLevel >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${i.fuelLevel}%` }}
                      />
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-4 max-w-[170px] truncate text-slate-600">
                  <span className="block font-medium truncate">{i.exteriorCondition}</span>
                  {i.photos?.length > 0 && (
                    <span className="text-[10px] text-blue-600 font-bold">
                      📷 {i.photos.length} photos
                    </span>
                  )}
                </td>

                <td className="py-3.5 px-4">
                  <StatusBadge status={i.status} />
                </td>

                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onViewDetails(i)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="View Full Report"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEditInspection(i)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Edit Record"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteInspection(i)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

