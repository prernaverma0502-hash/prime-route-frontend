import React from 'react';
import { Printer, CheckCircle2, ShieldCheck, Download } from 'lucide-react';
import Modal from '../../../components/common/Modal';
import { formatCurrency, formatDate } from '../../../utils/formatters';

export default function PaymentReceiptModal({
  selectedPayment,
  onClose
}) {
  if (!selectedPayment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={!!selectedPayment}
      onClose={onClose}
      title={`Payment Receipt: ${selectedPayment.receiptNo || selectedPayment.id}`}
      subtitle="Official commercial transaction receipt and payment confirmation"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6 p-2 printable-area font-sans">
        {/* Receipt Header */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <img
                src="/primeroute-logo.png"
                alt="PrimeRoute"
                className="h-8 w-auto object-contain"
              />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Official Receipt
              </span>
            </div>
            <h2 className="text-lg font-black text-[#071D49]">PrimeRoute Commercial Fleet Operations</h2>
            <p className="text-xs text-slate-500">500 Madison Ave, New York, NY 10022</p>
            <p className="text-xs text-slate-500">billing@primeroute.io • (800) 555-ROUT</p>
          </div>
          <div className="text-right space-y-0.5">
            <span className="text-xs font-mono font-bold text-[#075EE8] block">
              {selectedPayment.receiptNo || `REC-${selectedPayment.id}`}
            </span>
            <span className="text-xs text-slate-500 block">
              Date: <strong>{formatDate(selectedPayment.date)}</strong>
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Payment {selectedPayment.status || 'Paid'}
            </span>
          </div>
        </div>

        {/* Remitter & Rental Details */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
              Received From (Driver / Lessee):
            </span>
            <p className="font-extrabold text-[#0A1E42] text-sm mt-0.5">
              {selectedPayment.driver || selectedPayment.customer || 'Authorized Driver'}
            </p>
            <p className="text-slate-600">Rental Reference: {selectedPayment.rentalId || selectedPayment.rental || 'Commercial Lease'}</p>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
              Payment Method &amp; Reference:
            </span>
            <p className="font-bold text-slate-800 text-xs mt-0.5">
              {selectedPayment.method || selectedPayment.paymentMethod || 'Corporate ACH'}
            </p>
            <p className="font-mono text-slate-600">Ref: {selectedPayment.refNumber || selectedPayment.referenceNumber || 'N/A'}</p>
          </div>
        </div>

        {/* Financial Line Items */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                <th className="py-2.5 text-left">Description</th>
                <th className="py-2.5 text-left">Due Date</th>
                <th className="py-2.5 text-right">Amount Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              <tr>
                <td className="py-3">
                  <p className="font-bold">Commercial Fleet Lease Payment</p>
                  <p className="text-[11px] text-slate-500">
                    Agreement #{selectedPayment.rentalId || selectedPayment.rental || 'Active Agreement'} • Driver: {selectedPayment.driver}
                  </p>
                </td>
                <td className="py-3 text-slate-600 font-mono">
                  {formatDate(selectedPayment.dueDate || selectedPayment.date)}
                </td>
                <td className="py-3 text-right font-extrabold text-emerald-600 text-sm">
                  {formatCurrency(selectedPayment.amount)}
                </td>
              </tr>
              <tr className="border-t-2 border-slate-300 bg-slate-50 font-black text-sm text-[#071D49]">
                <td colSpan="2" className="py-3 pl-3">Total Amount Remitted</td>
                <td className="py-3 text-right pr-3 text-[#075EE8]">
                  {formatCurrency(selectedPayment.amount)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Seal and Notes */}
        <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 flex items-center justify-between text-xs text-blue-900">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#075EE8] shrink-0" />
            <span>
              This is a digitally generated payment confirmation receipt. Synchronized with general ledger records.
            </span>
          </div>
          <span className="font-mono text-[10px] text-blue-600 font-bold shrink-0">
            AUTHENTICATED
          </span>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-5 py-2 bg-[#075EE8] hover:bg-[#0650C7] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all"
          >
            <Printer className="w-4 h-4" /> Print Official Receipt
          </button>
        </div>
      </div>
    </Modal>
  );
}

