import React from 'react';
import { Printer } from 'lucide-react';
import Modal from '../../../components/common/Modal';
import { formatCurrency, formatDate } from '../../../utils/formatters';

export default function InvoicePrintModal({
  selectedInvoice,
  onClose,
}) {
  if (!selectedInvoice) return null;

  return (
    <Modal
      isOpen={!!selectedInvoice}
      onClose={onClose}
      title={`Invoice: ${selectedInvoice.id}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6 p-2 printable-area">
        <div className="flex justify-between items-start border-b pb-4">
          <div>
            <h2 className="text-xl font-black text-[#071D49]">PrimeRoute Enterprise Fleet</h2>
            <p className="text-xs text-slate-500">500 Madison Ave, Floor 24, New York, NY</p>
            <p className="text-xs text-slate-500">tax@primeroute.io • (800) 555-ROUT</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-[#075EE8] block">{selectedInvoice.id}</span>
            <span className="text-xs text-slate-400">Date: {formatDate(selectedInvoice.date)}</span>
            <span className="text-xs text-rose-500 font-semibold block">Due: {formatDate(selectedInvoice.dueDate)}</span>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl text-xs space-y-1">
          <span className="text-slate-400 font-medium">Billed To:</span>
          <p className="font-bold text-[#0A1E42] text-sm">{selectedInvoice.customer}</p>
          <p className="text-slate-600">Rental Reference: {selectedInvoice.rentalId}</p>
          <p className="text-slate-600">Vehicle: {selectedInvoice.vehicle}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b font-bold text-slate-500">
                <th className="py-2 text-left">Description</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-700">
              <tr>
                <td className="py-2">Vehicle Lease & Chauffeur Services ({selectedInvoice.vehicle})</td>
                <td className="py-2 text-right font-bold">{formatCurrency(selectedInvoice.subtotal || selectedInvoice.total)}</td>
              </tr>
              <tr>
                <td className="py-2">State & Municipal Fleet Tax</td>
                <td className="py-2 text-right font-bold">{formatCurrency(selectedInvoice.tax || 148)}</td>
              </tr>
              <tr className="border-t-2 font-black text-sm text-[#071D49]">
                <td className="py-3">Grand Total Due</td>
                <td className="py-3 text-right text-[#075EE8]">{formatCurrency(selectedInvoice.total)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-xl text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="px-5 py-2 bg-[#075EE8] text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print Invoice
          </button>
        </div>
      </div>
    </Modal>
  );
}

