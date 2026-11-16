import React from 'react';
import { Car, Clock, User, ClipboardCheck, AlertCircle, ArrowRight } from 'lucide-react';
import EmptyState from '../../../components/common/EmptyState';
import { formatDate } from '../../../utils/formatters';

export default function AwaitingInspectionsTable({
  awaitingList,
  onStartInspection,
}) {
  if (awaitingList.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
        <EmptyState
          title="No vehicles awaiting inspection"
          description="All returned and dispatched vehicles have completed digital handover inspection checklists."
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
      <div className="p-4 bg-amber-50/60 border-b border-amber-200/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-amber-900">
              Vehicles Flagged for Immediate Handover Inspection
            </h4>
            <p className="text-[11px] text-amber-700">
              Vehicles returned from lease or awaiting pre-rental delivery require verified odometer, fuel dip, and damage sign-off before releasing keys.
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 text-xs font-extrabold bg-amber-100 text-amber-800 rounded-xl border border-amber-200 shrink-0">
          {awaitingList.length} Vehicles Pending
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">Vehicle & Plate</th>
              <th className="py-3.5 px-4">Handover Inspection Type</th>
              <th className="py-3.5 px-4">Assigned Driver & Contract</th>
              <th className="py-3.5 px-4">Scheduled Date</th>
              <th className="py-3.5 px-4">Expected Odometer & Fuel</th>
              <th className="py-3.5 px-4">Operational Status / Reason</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {awaitingList.map((item) => (
              <tr key={item.id} className="hover:bg-amber-50/20 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                      <Car className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-[#0A1E42]">{item.vehicle}</p>
                      <span className="font-mono text-[10px] text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                        {item.plate}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold ${
                      item.type.includes('Return')
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    {item.type}
                  </span>
                </td>

                <td className="py-3.5 px-4">
                  <p className="font-semibold text-slate-800 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    {item.driver}
                  </p>
                  <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                    Contract: {item.contractId}
                  </p>
                </td>

                <td className="py-3.5 px-4">
                  <span className="font-semibold text-slate-700">
                    {formatDate(item.scheduledDate || item.returnDate)}
                  </span>
                  <span className="block text-[10px] text-rose-500 font-bold">
                    {item.priority === 'Urgent' ? '⚠️ Handover Urgent' : 'Pending Sign-off'}
                  </span>
                </td>

                <td className="py-3.5 px-4">
                  <p className="font-mono text-slate-800 font-bold">
                    ~{Number(item.odometerExpected).toLocaleString()} mi
                  </p>
                  <p className="text-[10px] text-slate-500">{item.fuelEstimated}</p>
                </td>

                <td className="py-3.5 px-4 max-w-[220px]">
                  <p className="text-slate-600 leading-relaxed truncate" title={item.reason}>
                    {item.reason}
                  </p>
                </td>

                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => onStartInspection(item)}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all active:scale-95 inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <ClipboardCheck className="w-3.5 h-3.5" />
                    Inspect Now
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

