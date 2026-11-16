import React from 'react';

const ROLES = [
  {
    title: '1. Administrator 1 (Owner)',
    desc: 'Unrestricted system root access, owner oversight, audit log review, role configuration, master security overrides.',
    badge: 'Full Root Privileges',
    color: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  {
    title: '2. Administrator 2',
    desc: 'Platform operations administrator, employee account management, configuration maintenance.',
    badge: 'Operational Admin',
    color: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  {
    title: '3. Finance Employee',
    desc: 'Revenue, payment reconciliation, expense approvals, driver security deposit escrow, invoices and P&L audit.',
    badge: 'Financial Controller',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    title: '4. Fleet / Maintenance Employee',
    desc: 'Vehicle additions, 5,000-mile routine oil intervals, repair shop work orders, and vehicle inventory.',
    badge: 'Fleet Ops & Shop',
    color: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  {
    title: '5. Rental / Operations Employee',
    desc: 'Rental contracts, customer booking intake, driver assignment, handover check-in/check-out inspections.',
    badge: 'Front-desk & Dispatch',
    color: 'bg-cyan-50 text-cyan-700 border-cyan-200'
  },
  {
    title: '6. Manager',
    desc: 'Supervisory oversight, contract extensions, expense reviews, incident/accident approvals, and executive reports.',
    badge: 'Managerial Override',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  },
  {
    title: '7. Read-Only User',
    desc: 'Auditor, compliance officer, or external legal review. Full view-only capabilities with zero write/edit permissions.',
    badge: 'Compliance & Audit',
    color: 'bg-slate-100 text-slate-700 border-slate-200'
  }
];

const RBAC_ROWS = [
  { module: 'Vehicles & Fleet Registry', a1: 'Full', a2: 'Full', fin: 'View', flt: 'Full', ops: 'View', mgr: 'Full', ro: 'View' },
  { module: 'Driver Profiles & Documents', a1: 'Full', a2: 'Full', fin: 'View', flt: 'View', ops: 'Full', mgr: 'Full', ro: 'View' },
  { module: 'Rental Contracts & Leasing', a1: 'Full', a2: 'Full', fin: 'Edit', flt: 'View', ops: 'Full', mgr: 'Approve', ro: 'View' },
  { module: 'Check-in/Out Inspections', a1: 'Full', a2: 'Full', fin: 'None', flt: 'Full', ops: 'Full', mgr: 'Full', ro: 'View' },
  { module: 'Invoicing & Deposit Escrow', a1: 'Full', a2: 'Full', fin: 'Full', flt: 'None', ops: 'View', mgr: 'Full', ro: 'View' },
  { module: 'Expense Entry & Approvals', a1: 'Full', a2: 'Full', fin: 'Approve', flt: 'Create', ops: 'Create', mgr: 'Approve', ro: 'View' },
  { module: 'Tolls, Citations & Recharge', a1: 'Full', a2: 'Full', fin: 'Full', flt: 'View', ops: 'Full', mgr: 'Full', ro: 'View' },
  { module: 'Executive Reports & P&L', a1: 'Full', a2: 'Full', fin: 'Full', flt: 'View', ops: 'View', mgr: 'Full', ro: 'View' },
  { module: 'Security Settings & Audit Logs', a1: 'Full', a2: 'Full', fin: 'None', flt: 'None', ops: 'None', mgr: 'View', ro: 'None' },
];

export default function RolesMatrixTab() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] space-y-5">
      <div>
        <h3 className="text-base font-bold text-[#0A1E42]">Client Defined 7-Role Permission Hierarchy</h3>
        <p className="text-xs text-slate-500">Strictly mapped to PrimeRoute Database Project Outline specifications</p>
      </div>

      <div className="space-y-3">
        {ROLES.map((role) => (
          <div key={role.title} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-start justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm text-[#0A1E42]">{role.title}</h4>
              <p className="text-xs text-slate-500 mt-1">{role.desc}</p>
            </div>
            <span className={`text-[11px] font-bold border px-2.5 py-1 rounded-full shrink-0 ${role.color}`}>
              {role.badge}
            </span>
          </div>
        ))}
      </div>

      {/* Interactive Module Permissions Matrix Table */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-extrabold text-[#0A1E42]">Role-Based Access Control (RBAC) Matrix</h4>
            <p className="text-xs text-slate-500">Fine-grained operational permissions per business role</p>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
            ✓ Granular RBAC Active
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200/80">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-slate-200 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-3">Module</th>
                <th className="py-2.5 px-2 text-center">Admin 1</th>
                <th className="py-2.5 px-2 text-center">Admin 2</th>
                <th className="py-2.5 px-2 text-center">Finance</th>
                <th className="py-2.5 px-2 text-center">Fleet/Maint</th>
                <th className="py-2.5 px-2 text-center">Rental/Ops</th>
                <th className="py-2.5 px-2 text-center">Manager</th>
                <th className="py-2.5 px-2 text-center">Read-Only</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {RBAC_ROWS.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80">
                  <td className="py-2.5 px-3 font-bold text-slate-800">{row.module}</td>
                  {[row.a1, row.a2, row.fin, row.flt, row.ops, row.mgr, row.ro].map((perm, pIdx) => (
                    <td key={pIdx} className="py-2.5 px-2 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        perm === 'Full' ? 'bg-purple-50 text-purple-700' :
                        perm === 'Approve' ? 'bg-emerald-50 text-emerald-700' :
                        perm === 'Edit' || perm === 'Create' ? 'bg-blue-50 text-blue-700' :
                        perm === 'View' ? 'bg-slate-100 text-slate-600' :
                        'text-slate-300'
                      }`}>
                        {perm === 'None' ? '—' : perm}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

