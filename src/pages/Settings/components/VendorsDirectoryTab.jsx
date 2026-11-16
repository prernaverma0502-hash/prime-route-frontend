import React from 'react';
import { Briefcase } from 'lucide-react';

export default function VendorsDirectoryTab({ vendors }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden space-y-4">
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-[#0A1E42] flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#075EE8]" /> Approved Fleet Vendors & Partners
          </h3>
          <p className="text-xs text-slate-500">Service providers, mechanic body shops, insurance carriers & municipal agencies</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
            {vendors.length} Active Vendors
          </span>
        </div>
      </div>

      <div className="overflow-x-auto px-5 pb-5">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase">
              <th className="py-3 px-3">Vendor ID</th>
              <th className="py-3 px-3">Company & Service</th>
              <th className="py-3 px-3">Contact Person</th>
              <th className="py-3 px-3">Contact Details</th>
              <th className="py-3 px-3">Payment Terms</th>
              <th className="py-3 px-3">Cumulative Spend (YTD)</th>
              <th className="py-3 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {vendors.map((v) => (
              <tr key={v.id} className="hover:bg-blue-50/20">
                <td className="py-3 px-3 font-mono font-bold text-[#075EE8]">{v.id}</td>
                <td className="py-3 px-3">
                  <span className="font-bold text-[#0A1E42] block">{v.name}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{v.category}</span>
                </td>
                <td className="py-3 px-3 font-semibold text-slate-800">{v.contact}</td>
                <td className="py-3 px-3 text-slate-600">
                  <p>{v.phone}</p>
                  <p className="text-[10px] text-slate-400">{v.email}</p>
                </td>
                <td className="py-3 px-3 font-medium text-slate-700">{v.terms}</td>
                <td className="py-3 px-3 font-mono font-bold text-slate-800">${v.spendYTD.toLocaleString()}</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {v.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

