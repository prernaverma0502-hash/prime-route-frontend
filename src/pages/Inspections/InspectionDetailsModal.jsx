import React from 'react';
import Modal from '../../components/common/Modal';
import {
  Car,
  User,
  Calendar,
  Clock,
  Gauge,
  Fuel,
  CheckCircle2,
  AlertTriangle,
  Printer,
  ShieldCheck,
  FileSignature,
  FileSpreadsheet
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/formatters';

export default function InspectionDetailsModal({
  isOpen,
  onClose,
  inspection
}) {
  if (!inspection) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Vehicle Inspection Report – ${inspection.inspectionNumber || inspection.id}`}
      subtitle={`Conducted on ${formatDate(inspection.date)} at ${inspection.time || '10:00 AM'}`}
      maxWidth="max-w-3xl"
    >
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(85vh-140px)]">
          {/* Header Banner */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-[#0A1E42]">{inspection.vehicle}</h3>
                  <span className="font-mono text-xs px-2 py-0.5 bg-white border border-blue-200 text-blue-700 font-bold rounded-lg">
                    {inspection.plate}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                  <span>Assigned Driver: <strong>{inspection.driver}</strong></span>
                  <span>•</span>
                  <span>Contract: <strong>{inspection.contractId || 'RNT-2025-001'}</strong></span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                inspection.type.includes('Pickup')
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-indigo-100 text-indigo-700'
              }`}>
                {inspection.type}
              </span>
              <StatusBadge status={inspection.status} />
            </div>
          </div>

          {/* Key Metrics: Odometer, Fuel Level, Spare Tire */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase">Odometer Reading</p>
                <p className="text-base font-extrabold text-[#0A1E42] font-mono">
                  {Number(inspection.odometer).toLocaleString()} mi
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-amber-50 text-amber-500">
                <Fuel className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Fuel / Charge Level</p>
                <div className="flex items-center gap-2">
                  <p className="text-base font-extrabold text-[#0A1E42] font-mono">{inspection.fuelLevel}%</p>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        inspection.fuelLevel >= 80 ? 'bg-emerald-500' : inspection.fuelLevel >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${inspection.fuelLevel}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase">Emergency Kit</p>
                <p className="text-xs font-bold text-slate-700">
                  {inspection.spareTirePresent ? 'Spare Tire & Tools Present' : 'Missing / Incomplete'}
                </p>
              </div>
            </div>
          </div>

          {/* Condition Breakdown */}
          <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
              360° Inspection Evaluation
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Exterior Body</span>
                <span className="font-extrabold text-slate-800 mt-0.5 block">{inspection.exteriorCondition}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Interior Cabin</span>
                <span className="font-extrabold text-slate-800 mt-0.5 block">{inspection.interiorCondition}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Tires &amp; Rims</span>
                <span className="font-extrabold text-slate-800 mt-0.5 block">{inspection.tiresCondition}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Windshield</span>
                <span className="font-extrabold text-slate-800 mt-0.5 block">{inspection.windshieldStatus}</span>
              </div>
            </div>
          </div>

          {/* Inspector Notes */}
          {inspection.notes && (
            <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl">
              <p className="text-xs font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Inspector Observations &amp; Damage Report
              </p>
              <p className="text-xs text-amber-800 leading-relaxed">{inspection.notes}</p>
            </div>
          )}

          {/* Condition Photos */}
          {inspection.photos && inspection.photos.length > 0 && (
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2.5">
                Attached Condition Photos ({inspection.photos.length})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {inspection.photos.map((p, idx) => (
                  <div key={idx} className="group relative rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                    <img src={p.url} alt={p.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <p className="text-white text-[11px] font-bold truncate">{p.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Signatures */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase">Certified Inspector</p>
              <p className="text-xs font-bold text-slate-800 mt-1">{inspection.inspector}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">PrimeRoute Fleet Operations</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase">Driver Acknowledgment</p>
              <p className="text-xs font-mono font-bold text-blue-700 mt-1 flex items-center gap-1">
                <FileSignature className="w-3.5 h-3.5" />
                {inspection.driverSignature || inspection.driver}
              </p>
              <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">✓ Verified at handover</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#F8FAFC] border-t border-slate-100 flex items-center justify-between shrink-0">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl flex items-center gap-2 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            Print Report
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

