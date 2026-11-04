import React from 'react';
import {
  Car,
  Calendar,
  Shield,
  Gauge,
  Fuel,
  Settings2,
  DollarSign,
  User,
  Wrench,
  FileText,
  Clock
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import { formatCurrency } from '../../utils/formatters';

export default function VehicleDetailsModal({
  isOpen,
  onClose,
  vehicle,
  onEdit,
  onDelete
}) {
  if (!isOpen || !vehicle) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={vehicle.name}
      subtitle={`Plate: ${vehicle.plate} • VIN: ${vehicle.vin || 'N/A'}`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-[#071D49] to-[#0D2D6C] rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-5 z-10">
            <img
              src={vehicle.image}
              alt={vehicle.name}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              className="w-36 h-24 object-cover rounded-xl border-2 border-white/20 shadow-lg"
            />
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <StatusBadge status={vehicle.status} />
                <span className="text-xs bg-white/10 px-2.5 py-0.5 rounded-full font-medium">
                  {vehicle.type}
                </span>
              </div>
              <h2 className="text-2xl font-black text-white">{vehicle.name}</h2>
              <p className="text-slate-300 text-xs mt-1">
                {vehicle.year} • {vehicle.make} {vehicle.model} • {vehicle.color}
              </p>
            </div>
          </div>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
              <Gauge className="w-4 h-4 text-[#075EE8]" /> Mileage
            </div>
            <p className="text-base font-bold text-[#0A1E42]">{vehicle.mileage || '20,000 mi'}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
              <Fuel className="w-4 h-4 text-emerald-600" /> Fuel Type
            </div>
            <p className="text-base font-bold text-[#0A1E42]">{vehicle.fuel || 'Gasoline'}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
              <Settings2 className="w-4 h-4 text-amber-500" /> Transmission
            </div>
            <p className="text-base font-bold text-[#0A1E42]">{vehicle.transmission || 'Automatic'}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
              <DollarSign className="w-4 h-4 text-indigo-500" /> Daily Rate
            </div>
            <p className="text-base font-bold text-[#0A1E42]">{formatCurrency(vehicle.dailyRate || 65)}/day</p>
          </div>
        </div>

        {/* Detailed Sections Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Registration & Insurance */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-3">
            <h4 className="font-bold text-sm text-[#0A1E42] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#075EE8]" /> Registration &amp; Insurance
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">License Plate:</span>
                <span className="font-bold text-[#0A1E42]">{vehicle.plate}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">VIN Number:</span>
                <span className="font-mono font-semibold text-slate-700">{vehicle.vin || '4T1B11HK5JU192831'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Purchase Value:</span>
                <span className="font-bold text-[#0A1E42]">{formatCurrency(vehicle.purchasePrice || 28500)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Insurance Expiry:</span>
                <span className="font-bold text-emerald-600">{vehicle.insuranceExpiry || '2025-11-15'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Registration Expiry:</span>
                <span className="font-bold text-slate-800">{vehicle.registrationExpiry || '2025-10-30'}</span>
              </div>
            </div>
          </div>

          {/* Assigned Driver & Rental Status */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-3">
            <h4 className="font-bold text-sm text-[#0A1E42] flex items-center gap-2">
              <User className="w-4 h-4 text-[#075EE8]" /> Assignment &amp; Driver
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Assigned Driver:</span>
                <span className="font-bold text-[#075EE8]">{vehicle.driver}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Operational Hub:</span>
                <span className="font-semibold text-slate-700">New York Metro Logistics Depot</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Telematics GPS:</span>
                <span className="font-semibold text-emerald-600">Online • Live Tracking</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Depot Location:</span>
                <span className="font-semibold text-slate-700">{vehicle.depotLocation || 'JFK Airport Fleet Hub'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Financing / Loan:</span>
                <span className="font-semibold text-slate-700">
                  {vehicle.financingType || 'Financed'} • {vehicle.monthlyPayment ? `$${vehicle.monthlyPayment}/mo` : '$460/mo'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Internal Notes:</span>
                <span className="text-slate-600 italic">
                  {vehicle.notes || 'Equipped with electronic toll transponder and safety speed limiter.'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Historical Driver Assignment Log */}
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-3">
          <h4 className="font-bold text-sm text-[#0A1E42] flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#075EE8]" /> Driver Assignment &amp; Handover History
            </span>
            <span className="text-[10px] text-slate-400 font-normal">Audit Recorded</span>
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-100">
                  <th className="py-2 px-3">Driver Name</th>
                  <th className="py-2 px-3">Period / Dates</th>
                  <th className="py-2 px-3">Handover Odometer</th>
                  <th className="py-2 px-3">Return Odometer</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-2 px-3 font-bold text-[#0A1E42]">{vehicle.driver || 'Sarah Jenkins'}</td>
                  <td className="py-2 px-3">Jul 01, 2025 – Present</td>
                  <td className="py-2 px-3 font-mono">14,200 mi</td>
                  <td className="py-2 px-3 font-mono text-blue-600 font-bold">Active in Service</td>
                  <td className="py-2 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">Active</span></td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-bold text-[#0A1E42]">Michael Chang</td>
                  <td className="py-2 px-3">Mar 10, 2025 – Jun 28, 2025</td>
                  <td className="py-2 px-3 font-mono">8,400 mi</td>
                  <td className="py-2 px-3 font-mono">14,190 mi</td>
                  <td className="py-2 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">Completed</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
}

