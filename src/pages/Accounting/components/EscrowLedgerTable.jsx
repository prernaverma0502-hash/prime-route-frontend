import React from 'react';
import { formatCurrency } from '../../../utils/formatters';
import Can from '../../../auth/Can';

export default function EscrowLedgerTable({
  escrowDeposits,
  onReleaseDeposit,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden space-y-4">
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-[#0A1E42] text-sm flex items-center gap-2">
            <span>🛡️ Driver Refundable Security Deposit Escrow Ledger</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Segregated liability accounts: Security deposits are held in escrow and never recognized as operational rental revenue until deductions are applied.
          </p>
        </div>
        <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-xs font-bold text-blue-700 shrink-0">
          Total Held in Escrow: $1,510
        </div>
      </div>

      <div className="overflow-x-auto px-4 pb-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase">
              <th className="py-3 px-3">Escrow ID</th>
              <th className="py-3 px-3">Driver Name</th>
              <th className="py-3 px-3">Assigned Vehicle</th>
              <th className="py-3 px-3">Contract #</th>
              <th className="py-3 px-3">Initial Deposit</th>
              <th className="py-3 px-3">Deductions (Damages/Tolls)</th>
              <th className="py-3 px-3">Refundable Balance</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Escrow Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {escrowDeposits.map((esc) => (
              <tr key={esc.id} className="hover:bg-blue-50/20">
                <td className="py-3 px-3 font-mono font-bold text-[#075EE8]">{esc.id}</td>
                <td className="py-3 px-3 font-bold text-slate-800">{esc.driver}</td>
                <td className="py-3 px-3 text-slate-600">{esc.vehicle}</td>
                <td className="py-3 px-3 font-mono text-slate-500">{esc.contractId}</td>
                <td className="py-3 px-3 font-mono font-bold text-slate-700">{formatCurrency(esc.depositAmount)}</td>
                <td className="py-3 px-3 font-mono font-bold text-rose-600">
                  {esc.deductions > 0 ? `-${formatCurrency(esc.deductions)}` : '$0'}
                </td>
                <td className="py-3 px-3 font-mono font-extrabold text-emerald-600 text-sm">
                  {formatCurrency(esc.balance)}
                </td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                    esc.balance > 0 ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {esc.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  {esc.balance > 0 ? (
                    <Can
                      module="accounting"
                      do="approve"
                      showApprovalNotice={true}
                      fallback={<span className="text-[11px] text-slate-400">Escrow Locked</span>}
                    >
                      <button
                        onClick={() => onReleaseDeposit(esc.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg shadow-sm transition-all cursor-pointer"
                      >
                        Release & Refund
                      </button>
                    </Can>
                  ) : (
                    <span className="text-[11px] text-slate-400">Settled</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
