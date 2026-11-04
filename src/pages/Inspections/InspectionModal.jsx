import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import {
  ClipboardCheck,
  Gauge,
  Fuel,
  Camera,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  FileSignature
} from 'lucide-react';
import { mockVehicles, mockDrivers } from '../../data/mockData';

export default function InspectionModal({
  isOpen,
  onClose,
  onSave,
  inspection = null,
}) {
  const [formData, setFormData] = useState({
    inspectionNumber: '',
    type: 'Check-out (Pickup)',
    contractId: 'RNT-2025-001',
    vehicle: '',
    plate: '',
    driver: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    odometer: 15000,
    fuelLevel: 100,
    exteriorCondition: 'Pristine / Clean',
    interiorCondition: 'Clean & Sanitized',
    tiresCondition: 'Good (8/32")',
    windshieldStatus: 'Clear / No Cracks',
    spareTirePresent: true,
    inspector: 'John Doe (Admin)',
    status: 'Passed',
    notes: '',
    driverSignature: '',
    photos: []
  });

  useEffect(() => {
    if (inspection) {
      setFormData(inspection);
    } else {
      setFormData({
        id: `INS-${Date.now()}`,
        inspectionNumber: `INSP-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'Check-out (Pickup)',
        contractId: 'RNT-2025-001',
        vehicle: mockVehicles[0]?.name || 'Toyota Camry SE',
        plate: mockVehicles[0]?.plate || 'PR-2024-TC',
        driver: mockDrivers[0]?.name || 'Sarah Jenkins',
        date: new Date().toISOString().split('T')[0],
        time: '10:00 AM',
        odometer: 15200,
        fuelLevel: 100,
        exteriorCondition: 'Pristine / Clean',
        interiorCondition: 'Clean & Sanitized',
        tiresCondition: 'Good (8/32")',
        windshieldStatus: 'Clear / No Cracks',
        spareTirePresent: true,
        inspector: 'John Doe (Admin)',
        status: 'Passed',
        notes: '',
        driverSignature: mockDrivers[0]?.name || 'Sarah Jenkins',
        photos: [
          { id: 1, label: 'Front Angle', url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500&auto=format&fit=crop&q=60' }
        ]
      });
    }
  }, [inspection, isOpen]);

  const handleVehicleChange = (vehicleName) => {
    const selected = mockVehicles.find((v) => v.name === vehicleName);
    setFormData((prev) => ({
      ...prev,
      vehicle: vehicleName,
      plate: selected?.plate || prev.plate,
      odometer: selected?.mileage ? parseInt(selected.mileage.replace(/[^0-9]/g, '')) || prev.odometer : prev.odometer
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={inspection ? 'Edit Inspection Record' : 'New Vehicle Check-in / Check-out Inspection'}
      subtitle="Complete thorough vehicle inspection checklist, record fuel and odometer, and attach condition photos"
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(85vh-140px)]">
          {/* Header Type Selector */}
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, type: 'Check-out (Pickup)' }))}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                formData.type === 'Check-out (Pickup)'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🚀 Check-out (Pickup / Handover)
            </button>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, type: 'Check-in (Return)' }))}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                formData.type === 'Check-in (Return)'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📥 Check-in (Vehicle Return)
            </button>
          </div>

          {/* Core Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Vehicle *
              </label>
              <select
                value={formData.vehicle}
                onChange={(e) => handleVehicleChange(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                required
              >
                {mockVehicles.map((v) => (
                  <option key={v.id} value={v.name}>
                    {v.name} ({v.plate})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Assigned Driver *
              </label>
              <select
                value={formData.driver}
                onChange={(e) => setFormData((prev) => ({ ...prev, driver: e.target.value, driverSignature: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                required
              >
                {mockDrivers.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Related Contract #
              </label>
              <input
                type="text"
                value={formData.contractId}
                onChange={(e) => setFormData((prev) => ({ ...prev, contractId: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="RNT-2025-001"
              />
            </div>
          </div>

          {/* Date, Inspector, Odometer, Fuel */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-slate-50/70 border border-slate-100 rounded-2xl">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Inspector</label>
              <input
                type="text"
                value={formData.inspector}
                onChange={(e) => setFormData((prev) => ({ ...prev, inspector: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-blue-600" /> Current Odometer (mi) *
              </label>
              <input
                type="number"
                value={formData.odometer}
                onChange={(e) => setFormData((prev) => ({ ...prev, odometer: Number(e.target.value) }))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-mono font-bold focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Fuel className="w-3.5 h-3.5 text-amber-500" /> Fuel / Charge: {formData.fuelLevel}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={formData.fuelLevel}
                onChange={(e) => setFormData((prev) => ({ ...prev, fuelLevel: Number(e.target.value) }))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                <span onClick={() => setFormData((p) => ({ ...p, fuelLevel: 25 }))} className="cursor-pointer hover:text-blue-600">1/4</span>
                <span onClick={() => setFormData((p) => ({ ...p, fuelLevel: 50 }))} className="cursor-pointer hover:text-blue-600">1/2</span>
                <span onClick={() => setFormData((p) => ({ ...p, fuelLevel: 75 }))} className="cursor-pointer hover:text-blue-600">3/4</span>
                <span onClick={() => setFormData((p) => ({ ...p, fuelLevel: 100 }))} className="cursor-pointer hover:text-blue-600">Full</span>
              </div>
            </div>
          </div>

          {/* Condition Checklist */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2.5">
              360° Condition Inspection Checklist
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Exterior Body & Paint</label>
                <select
                  value={formData.exteriorCondition}
                  onChange={(e) => setFormData((prev) => ({ ...prev, exteriorCondition: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                >
                  <option value="Pristine / Clean">Pristine / Clean (No damage)</option>
                  <option value="Minor Scratches">Minor Scratches (Documented)</option>
                  <option value="Dents / Scrapes">Dents / Scrapes (Flagged)</option>
                  <option value="Significant Damage">Significant Collision Damage</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Interior & Upholstery</label>
                <select
                  value={formData.interiorCondition}
                  onChange={(e) => setFormData((prev) => ({ ...prev, interiorCondition: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                >
                  <option value="Clean & Sanitized">Clean & Sanitized</option>
                  <option value="Acceptable">Acceptable (Normal Wear)</option>
                  <option value="Excessive Dirt / Stains">Excessive Dirt / Stains (Cleaning Fee)</option>
                  <option value="Torn / Damaged Upholstery">Torn / Damaged Upholstery</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Tires & Wheels</label>
                <select
                  value={formData.tiresCondition}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tiresCondition: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                >
                  <option value="Good (8/32&quot;)">Good Tread Depth (8/32&quot;+)</option>
                  <option value="Fair (5/32&quot;)">Fair (5/32&quot;)</option>
                  <option value="Worn / Replacement Needed">Worn / Replacement Due</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Windshield & Windows</label>
                <select
                  value={formData.windshieldStatus}
                  onChange={(e) => setFormData((prev) => ({ ...prev, windshieldStatus: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                >
                  <option value="Clear / No Cracks">Clear / No Cracks</option>
                  <option value="Minor Rock Chip">Minor Rock Chip</option>
                  <option value="Cracked (Needs Replacement)">Cracked (Needs Replacement)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Status & Spare Tire Check */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Overall Inspection Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-white"
              >
                <option value="Passed">✅ Passed (Ready for Service / Clean Return)</option>
                <option value="Damage Detected">⚠️ Damage Detected (Deductible / Charges)</option>
                <option value="Under Review">🔍 Under Review (Manager Inspection Needed)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="spareTire"
                checked={formData.spareTirePresent}
                onChange={(e) => setFormData((prev) => ({ ...prev, spareTirePresent: e.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <label htmlFor="spareTire" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Spare tire, jack, and emergency kit present in trunk
              </label>
            </div>
          </div>

          {/* Notes & Damage Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Detailed Inspector Notes & Damage Observations
            </label>
            <textarea
              rows="3"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder="Record any scratches, dents, missing items, or fuel shortfall..."
            />
          </div>

          {/* Photo Gallery & Dropzone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-blue-600" />
                Condition Evidence Photos ({formData.photos.length})
              </span>
              <span className="text-[11px] text-slate-400 font-normal">JPG, PNG up to 10MB</span>
            </label>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-blue-400 transition-colors bg-slate-50/50">
              <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <p className="text-xs font-semibold text-slate-600">Click to upload vehicle photos or drag & drop</p>
              <p className="text-[10px] text-slate-400">Front, Rear, Left/Right sides, Dashboard odometer & fuel gauge</p>
            </div>

            {/* Photos Preview */}
            {formData.photos.length > 0 && (
              <div className="flex gap-2 mt-2.5 overflow-x-auto pb-1">
                {formData.photos.map((p, idx) => (
                  <div key={idx} className="relative w-20 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                    <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] font-bold text-center truncate px-1 py-0.5">
                      {p.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Driver Signature Acknowledgment */}
          <div className="p-3.5 bg-blue-50/40 border border-blue-100 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <FileSignature className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-800">Driver Digital Acknowledgment</p>
                <p className="text-[10px] text-slate-500">I certify that I have inspected this vehicle and verify the recorded condition, mileage, and fuel level.</p>
              </div>
            </div>
            <input
              type="text"
              value={formData.driverSignature}
              onChange={(e) => setFormData((prev) => ({ ...prev, driverSignature: e.target.value }))}
              placeholder="Driver Full Name"
              className="px-3 py-1.5 text-xs font-mono font-bold border border-blue-200 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 w-44"
              required
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#F8FAFC] border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
          >
            Save Inspection Record
          </button>
        </div>
      </form>
    </Modal>
  );
}

