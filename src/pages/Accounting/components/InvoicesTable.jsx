import React from 'react';
import { Printer, RotateCcw } from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../../../utils/formatters';

export default function InvoicesTable({
  invoices = [],
  onOpenCreateModal,
  onSelectInvoiceForPrint,
  onOpenReverseModal
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-[#F8FAFC]">
        <div>
          <h3 className="font-bold text-[#0A1E42] text-sm">Corporate Client Invoices &amp; Billings</h3>
          <p className="text-xs text-slate-500">Official tax invoices for corporate fleet leases, executive charters, and delivery agreements</p>
        </div>
        <button
          onClick={onOpenCreateModal}
          className="px-3.5 py-1.5 bg-[#075EE8] text-white text-xs font-bold rounded-lg hover:bg-[#0650C7] cursor-pointer shadow-2xs"
        >
          + New Invoice
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[880px]">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase">
              <th className="py-3.5 px-4">Invoice #</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Rental Link</th>
              <th className="py-3.5 px-4">Date Issued</th>
              <th className="py-3.5 px-4">Due Date</th>
              <th className="py-3.5 px-4 text-right">Total Amount</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-blue-50/20">
                <td className="py-3.5 px-4 font-mono font-bold text-[#075EE8]">{inv.id}</td>
                <td className="py-3.5 px-4 font-bold text-[#0A1E42]">{inv.customer}</td>
                <td className="py-3.5 px-4 font-mono text-slate-600">{inv.rentalId}</td>
                <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">{formatDate(inv.date)}</td>
                <td className="py-3.5 px-4 text-slate-600 font-medium font-mono text-[11px]">{formatDate(inv.dueDate)}</td>
                <td className="py-3.5 px-4 text-right font-extrabold text-[#0A1E42]">{formatCurrency(inv.total)}</td>
                <td className="py-3.5 px-4 text-center"><StatusBadge status={inv.status} /></td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onSelectInvoiceForPrint(inv)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:text-[#075EE8] hover:border-blue-200 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" /> View / Print
                    </button>
                    {onOpenReverseModal && (
                      <button
                        onClick={() => onOpenReverseModal(inv)}
                        disabled={inv.status === 'Reversed' || inv.status === 'Reversed & Offset'}
                        title="Reverse / Correct Invoice"
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
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
