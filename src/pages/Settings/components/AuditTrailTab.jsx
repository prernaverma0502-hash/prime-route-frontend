import React from 'react';
import { FileText } from 'lucide-react';

export default function AuditTrailTab({ auditLogs }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden space-y-4">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#0A1E42] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#075EE8]" /> System-Wide Immutable Audit Trail
          </h3>
          <p className="text-xs text-slate-500">Tamper-proof event logs recording user actions, timestamps, and data changes</p>
        </div>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold">
          ● SHA-256 Verified
        </span>
      </div>

      <div className="overflow-x-auto px-5 pb-5">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase">
              <th className="py-3 px-3">Log ID</th>
              <th className="py-3 px-3">Timestamp</th>
              <th className="py-3 px-3">Acting User & Role</th>
              <th className="py-3 px-3">Event Action</th>
              <th className="py-3 px-3">Module</th>
              <th className="py-3 px-3">Target Record</th>
              <th className="py-3 px-3">Audit Details & Old/New Values</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-blue-50/20">
                <td className="py-3 px-3 font-mono font-bold text-[#075EE8]">{log.id}</td>
                <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{log.time}</td>
                <td className="py-3 px-3 font-semibold text-slate-800">{log.user}</td>
                <td className="py-3 px-3">
                  <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {log.action}
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-600 font-medium">{log.module}</td>
                <td className="py-3 px-3 font-mono font-bold text-[#0A1E42]">{log.recordId}</td>
                <td className="py-3 px-3 text-slate-600 max-w-xs">{log.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

