import React from 'react';
import {
  FileText,
  Printer,
  Download,
  Calendar,
  MapPin,
  Car,
  User,
  CreditCard,
  CheckCircle,
  Clock
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function RentalDetailsModal({
  isOpen,
  onClose,
  rental,
  onEdit,
  onDelete,
  onViewAgreement,
  onProcessReturn,
  onViewReturn
}) {
  if (!isOpen || !rental) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Rental Agreement: ${rental.id}`}
      subtitle={`Customer: ${rental.customer} • Type: ${rental.rentalType}`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6 printable-area">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-[#071D49] to-[#0D2D6C] rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="z-10">
            <div className="flex items-center gap-2 mb-2">
              <StatusBadge status={rental.status} />
              <span className="text-xs bg-white/10 px-2.5 py-0.5 rounded-full font-medium">
                {rental.paymentStatus}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">{rental.customer}</h2>
            <p className="text-slate-300 text-xs mt-1">
              Vehicle: <span className="text-white font-semibold">{rental.vehicle}</span> • Driver: <span className="text-white font-semibold">{rental.driver}</span>
            </p>
          </div>
        </div>

        {/* Schedule & Routing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0A1E42]">
              <Calendar className="w-4 h-4 text-[#075EE8]" /> Schedule Timeline
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div>
                <span className="text-slate-400 block text-[11px]">Start Date</span>
                <span className="font-bold text-[#0A1E42]">{formatDate(rental.startDate)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">End Date</span>
                <span className="font-bold text-[#0A1E42]">{formatDate(rental.endDate)}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0A1E42]">
              <MapPin className="w-4 h-4 text-[#075EE8]" /> Location Routing
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div>
                <span className="text-slate-400 block text-[11px]">Pickup</span>
                <span className="font-bold text-[#0A1E42] truncate block">{rental.pickupLocation || 'JFK Fleet Depot'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Drop-off</span>
                <span className="font-bold text-[#0A1E42] truncate block">{rental.dropoffLocation || 'Manhattan Hub'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Summary Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
          <h4 className="font-bold text-sm text-[#0A1E42] flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#075EE8]" /> Financial Breakdown &amp; Invoice
            </span>
            <span className="text-xs font-mono text-slate-500">Method: {rental.paymentMethod}</span>
          </h4>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Base Rental Charge:</span>
              <span className="font-bold text-[#0A1E42]">{formatCurrency(rental.amount)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Refundable Security Deposit:</span>
              <span className="font-medium text-slate-700">{formatCurrency(rental.deposit || 500)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Mileage Allowance &amp; Excess:</span>
              <span className="font-medium text-slate-700">
                {rental.mileageAllowance || 1200} mi/wk (${rental.excessMileageRate || 0.25}/mi excess)
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">State &amp; Municipal Tax (8%):</span>
              <span className="font-medium text-slate-700">{formatCurrency(rental.tax || 156)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Corporate Promotional Discount:</span>
              <span className="font-bold text-emerald-600">-{formatCurrency(rental.discount || 50)}</span>
            </div>
            <div className="flex justify-between py-3 text-sm font-black bg-blue-50/60 px-3 rounded-lg mt-2">
              <span className="text-[#071D49]">Total Amount Billed:</span>
              <span className="text-[#075EE8]">{formatCurrency(rental.total || rental.amount)}</span>
            </div>
          </div>
        </div>

        {/* Contract terms note */}
        <div className="text-xs text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="font-semibold text-slate-700 mb-1">Contract Compliance &amp; Terms:</p>
          <p>{rental.notes || 'All PrimeRoute vehicles are monitored via telematics. Fuel level must match departure state.'}</p>
        </div>

        {/* Return Audit Section if Completed */}
        {rental.status === 'Completed' && (
          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 space-y-2 text-xs animate-fade-in">
            <div className="flex items-center justify-between text-emerald-950 font-bold">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Vehicle Return Audit Completed
              </span>
              <span className="text-[11px] font-mono text-emerald-700">
                {formatDate(rental.returnDateTime || rental.endDate)}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-slate-700">
              <div>
                <span className="text-slate-400 block text-[11px]">Return Odometer</span>
                <span className="font-bold text-[#0A1E42] font-mono">
                  {typeof rental.returnOdometer === 'number'
                    ? `${rental.returnOdometer.toLocaleString()} mi`
                    : rental.returnOdometer || 'Recorded'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Return Fuel Level</span>
                <span className="font-bold text-slate-800">{rental.returnFuelLevel || 'Full (100%)'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Distance Travelled</span>
                <span className="font-bold text-[#075EE8] font-mono">
                  {rental.distanceTravelled
                    ? `${rental.distanceTravelled.toLocaleString()} mi`
                    : 'Verified'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Return Condition</span>
                <span className="font-medium text-slate-800 truncate block">
                  {rental.returnCondition || 'Good / Normal Wear'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Modal Actions Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between no-print">
          <div className="text-xs text-slate-500">
            Agreement ID: <span className="font-mono font-bold text-[#0A1E42]">{rental.id}</span>
          </div>
          <div className="flex items-center gap-2.5">
            {onViewAgreement && (
              <button
                onClick={() => onViewAgreement(rental)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#071D49] bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-xl transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#075EE8]" />
                Legal Agreement ({rental.agreementStatus || 'Draft'})
              </button>
            )}

            {rental.status === 'Active' && onProcessReturn && (
              <button
                onClick={() => onProcessReturn(rental)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                <Car className="w-4 h-4" />
                Vehicle Return
              </button>
            )}

            {rental.status === 'Completed' && onViewReturn && (
              <button
                onClick={() => onViewReturn(rental)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-xl transition-all cursor-pointer"
              >
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Return Audit
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#075EE8] hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
            >
              <Printer className="w-4 h-4" />
              Print Agreement
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

