import React from 'react';
import { Car, Tags } from 'lucide-react';

export default function CategoriesDictionaryTab({
  vehicleCategories,
  expenseCategories,
}) {
  return (
    <div className="space-y-6">
      {/* Vehicle Categories */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0A1E42] flex items-center gap-2">
              <Car className="w-4 h-4 text-[#075EE8]" /> Fleet Vehicle Classification Dictionary
            </h3>
            <p className="text-xs text-slate-500">Configured vehicle segments available during new vehicle onboarding</p>
          </div>
        </div>
        <div className="overflow-x-auto px-5 pb-5">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase">
                <th className="py-3 px-3">Segment Name</th>
                <th className="py-3 px-3">Description & Models</th>
                <th className="py-3 px-3">Active Units</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vehicleCategories.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-3 font-bold text-[#0A1E42]">{c.name}</td>
                  <td className="py-3 px-3 text-slate-600">{c.description}</td>
                  <td className="py-3 px-3 font-mono font-bold text-[#075EE8]">{c.count} vehicles</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expense Category Codes */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0A1E42] flex items-center gap-2">
              <Tags className="w-4 h-4 text-[#075EE8]" /> Expense Category Codes & Accounting Rules
            </h3>
            <p className="text-xs text-slate-500">GL expense accounts and managerial approval enforcement rules</p>
          </div>
        </div>
        <div className="overflow-x-auto px-5 pb-5">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase">
                <th className="py-3 px-3">Account Code</th>
                <th className="py-3 px-3">Expense Category</th>
                <th className="py-3 px-3">Tax Deductible</th>
                <th className="py-3 px-3">Approval Required</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenseCategories.map((ec) => (
                <tr key={ec.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-3 font-mono font-bold text-slate-700">{ec.code}</td>
                  <td className="py-3 px-3 font-bold text-[#0A1E42]">{ec.name}</td>
                  <td className="py-3 px-3">
                    {ec.taxDeductible ? (
                      <span className="text-emerald-600 font-bold">✓ Tax Deductible</span>
                    ) : (
                      <span className="text-slate-400">Non-deductible</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    {ec.requiresApproval ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        Manager Approval Enforced
                      </span>
                    ) : (
                      <span className="text-slate-500">Direct Entry Allowed</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      Active Code
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

