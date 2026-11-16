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
  FileSignature,
  Trash2,
  Plus,
  ShieldCheck,
  AlertCircle
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
    odometer: 15200,
    fuelLevel: 100,
    exteriorCondition: 'Pristine / Clean',
    interiorCondition: 'Clean & Sanitized',
    tiresCondition: 'Good (8/32")',
    windshieldStatus: 'Clear / No Cracks',
    spareTirePresent: true,
    damageClassification: 'No Damage',
    existingDamage: 'Minor 0.5-inch stone chip on lower front bumper (baseline recorded).',
    newDamage: 'None. Clean check-out handover.',
    inspector: 'Marcus Brody (Fleet Tech)',
    status: 'Passed',
    notes: '',
    driverSignature: '',
    driverAcknowledged: true,
    photos: []
  });

  const [newPhotoLabel, setNewPhotoLabel] = useState('Front View');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  useEffect(() => {
    if (inspection) {
      setFormData({
        ...inspection,
        existingDamage: inspection.existingDamage || 'None reported.',
        newDamage: inspection.newDamage || 'None detected.',
        damageClassification: inspection.damageClassification || (inspection.status === 'Damage Detected' ? 'New Damage Incurred' : 'Pre-existing Only'),
        driverAcknowledged: inspection.driverAcknowledged !== undefined ? inspection.driverAcknowledged : true,
        time: inspection.time || '10:00 AM'
      });
    } else {
      const defaultVehicle = mockVehicles[0] || { name: 'Toyota Camry SE', plate: 'PR-2024-TC' };
      const defaultDriver = mockDrivers[0] || { name: 'Sarah Jenkins' };
      setFormData({
        id: `INS-${Date.now()}`,
        inspectionNumber: `INSP-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'Check-out (Pickup)',
        contractId: 'RNT-2025-001',
        vehicle: defaultVehicle.name,
        plate: defaultVehicle.plate,
        driver: defaultDriver.name,
        date: new Date().toISOString().split('T')[0],
        time: '10:00 AM',
        odometer: 15200,
        fuelLevel: 100,
        exteriorCondition: 'Pristine / Clean',
        interiorCondition: 'Clean & Sanitized',
        tiresCondition: 'Good (8/32")',
        windshieldStatus: 'Clear / No Cracks',
        spareTirePresent: true,
        damageClassification: 'No Damage',
        existingDamage: 'Minor 0.5-inch stone chip on lower front bumper (baseline recorded).',
        newDamage: 'None. Clean handover.',
        inspector: 'Marcus Brody (Fleet Tech)',
        status: 'Passed',
        notes: '',
        driverSignature: defaultDriver.name,
        driverAcknowledged: true,
        photos: [
          { id: 1, label: 'Front Exterior', url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500&auto=format&fit=crop&q=60' },
          { id: 2, label: 'Rear Bumper & Trunk', url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=500&auto=format&fit=crop&q=60' }
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

  const handleAddPhoto = () => {
    if (!newPhotoUrl.trim()) return;
    const newEntry = {
      id: Date.now(),
      label: newPhotoLabel,
      url: newPhotoUrl.trim()
    };
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, newEntry]
    }));
    setNewPhotoUrl('');
  };

  const handleRemovePhoto = (photoId) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((p) => p.id !== photoId)
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
      title={inspection ? 'Edit Inspection Record' : 'New Vehicle Handover Inspection'}
      subtitle="Complete thorough check-in / check-out inspection, record fuel & odometer, baseline existing vs new damage, and driver sign-off"
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(85vh-140px)]">
          {/* Header Type Selector */}
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  type: 'Check-out (Pickup)',
                  status: prev.status === 'Damage Detected' ? 'Damage Detected' : 'Passed'
                }))
              }
              className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                formData.type === 'Check-out (Pickup)'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🚀 Check-out (Pickup / Handover)
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  type: 'Check-in (Return)'
                }))
              }
              className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                formData.type === 'Check-in (Return)'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📥 Check-in (Vehicle Return)
            </button>
          </div>

          {/* Vehicle, Driver, Contract */}
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
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    driver: e.target.value,
                    driverSignature: e.target.value
                  }))
                }
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

          {/* Date, Time, Inspector, Odometer, Fuel */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5 p-4 bg-slate-50/70 border border-slate-100 rounded-2xl">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Time *</label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
                placeholder="10:00 AM"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Certified Inspector *</label>
              <input
                type="text"
                value={formData.inspector}
                onChange={(e) => setFormData((prev) => ({ ...prev, inspector: e.target.value }))}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-blue-600" /> Odometer (mi) *
              </label>
              <input
                type="number"
                value={formData.odometer}
                onChange={(e) => setFormData((prev) => ({ ...prev, odometer: Number(e.target.value) }))}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl bg-white font-mono font-bold focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Fuel className="w-3.5 h-3.5 text-amber-500" /> Fuel: {formData.fuelLevel}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={formData.fuelLevel}
                onChange={(e) => setFormData((prev) => ({ ...prev, fuelLevel: Number(e.target.value) }))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
              />
              <div className="flex justify-between text-[9px] text-slate-400 mt-0.5 font-bold">
                <span onClick={() => setFormData((p) => ({ ...p, fuelLevel: 25 }))} className="cursor-pointer hover:text-blue-600">25%</span>
                <span onClick={() => setFormData((p) => ({ ...p, fuelLevel: 50 }))} className="cursor-pointer hover:text-blue-600">50%</span>
                <span onClick={() => setFormData((p) => ({ ...p, fuelLevel: 75 }))} className="cursor-pointer hover:text-blue-600">75%</span>
                <span onClick={() => setFormData((p) => ({ ...p, fuelLevel: 100 }))} className="cursor-pointer hover:text-blue-600">Full</span>
              </div>
            </div>
          </div>

          {/* Condition Checklist */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2.5">
              360° Interior & Exterior Condition Checklist
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Exterior Body & Paint</label>
                <select
                  value={formData.exteriorCondition}
                  onChange={(e) => setFormData((prev) => ({ ...prev, exteriorCondition: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                >
                  <option value="Pristine / Clean">Pristine / Clean (No body damage)</option>
                  <option value="Minor Scratches">Minor Scratches (Documented)</option>
                  <option value="Dents / Scrapes">Dents / Scrapes (Flagged for repair)</option>
                  <option value="Significant Damage">Significant Collision Damage</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Interior Cabin & Upholstery</label>
                <select
                  value={formData.interiorCondition}
                  onChange={(e) => setFormData((prev) => ({ ...prev, interiorCondition: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                >
                  <option value="Clean & Sanitized">Clean & Sanitized</option>
                  <option value="Acceptable">Acceptable (Normal Wear & Tear)</option>
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
                  <option value="Minor Rock Chip">Minor Rock Chip (Documented)</option>
                  <option value="Cracked (Needs Replacement)">Cracked (Safety Hazard - Replace)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Existing vs New Damage Differentiation (Requirement 1) */}
          <div className="p-4 bg-amber-50/40 border border-amber-200/80 rounded-2xl space-y-3.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Existing vs New Damage Breakdown (Charge Verification)
              </h4>
              <select
                value={formData.damageClassification}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    damageClassification: val,
                    status: val === 'New Damage Incurred' ? 'Damage Detected' : val === 'Pre-existing Only' ? 'Passed' : prev.status
                  }));
                }}
                className="px-2.5 py-1 text-xs font-bold border border-amber-200 rounded-xl bg-white text-slate-800"
              >
                <option value="No Damage">No Damage (Pristine)</option>
                <option value="Pre-existing Only">Pre-existing Damage Only (Baseline)</option>
                <option value="New Damage Incurred">New Damage Incurred (Chargeable)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Pre-Existing / Baseline Damage</span>
                  <span className="text-[10px] text-slate-400 font-normal">Prior leases / pickup baseline</span>
                </label>
                <textarea
                  rows="2"
                  value={formData.existingDamage}
                  onChange={(e) => setFormData((prev) => ({ ...prev, existingDamage: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Record prior blemishes, rock chips, baseline scratches..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>New Damage Identified At This Inspection</span>
                  <span className="text-[10px] text-rose-500 font-bold">Driver deductible/repair</span>
                </label>
                <textarea
                  rows="2"
                  value={formData.newDamage}
                  onChange={(e) => setFormData((prev) => ({ ...prev, newDamage: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-rose-500"
                  placeholder="Record new scratches, bumper dents, broken glass, interior burns..."
                />
              </div>
            </div>
          </div>

          {/* Status & Spare Tire Check */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Overall Handover Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-white"
              >
                <option value="Passed">✅ Passed (Approved for Service / Clean Return)</option>
                <option value="Damage Detected">⚠️ Damage Detected (Billed to Deductible/Deposit)</option>
                <option value="Under Review">🔍 Under Review (Manager / Adjuster Sign-off Needed)</option>
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
                Spare tire, jack, tool kit, and emergency kit present
              </label>
            </div>
          </div>

          {/* Detailed Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Detailed Inspector Notes & Recommendations
            </label>
            <textarea
              rows="2"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder="Record any detailing notes, mechanical observations, or refuel fees..."
            />
          </div>

          {/* Photo Gallery & Upload Section (Requirement 1) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-blue-600" />
                Condition Evidence Photos ({formData.photos.length})
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Front, Rear, Left, Right, Interior, Odometer</span>
            </label>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={newPhotoLabel}
                  onChange={(e) => setNewPhotoLabel(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white font-bold"
                >
                  <option value="Front View">Front Angle / Bumper</option>
                  <option value="Rear View">Rear Bumper / Trunk</option>
                  <option value="Driver Side">Driver Side / Doors</option>
                  <option value="Passenger Side">Passenger Side / Quarter Panel</option>
                  <option value="Interior Dashboard">Dashboard & Odometer</option>
                  <option value="Cabin Interior">Interior Cabin & Seats</option>
                  <option value="Damage Closeup">Damage Evidence Close-up</option>
                </select>

                <input
                  type="text"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="Paste Image URL or simulated photo path..."
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
                />

                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Photo
                </button>
              </div>

              {/* Photos Grid Preview */}
              {formData.photos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  {formData.photos.map((p) => (
                    <div key={p.id} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                      <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 truncate">
                        {p.label}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(p.id)}
                        className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-xs text-slate-400 py-2">No condition photos attached yet.</p>
              )}
            </div>
          </div>

          {/* Driver Digital Acknowledgment (Requirement 1) */}
          <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-2.5">
            <div className="flex items-start gap-2.5">
              <FileSignature className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-extrabold text-slate-900">Driver Digital Handover Acknowledgment</p>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  I certify that I have personally inspected this vehicle with the certified fleet inspector. I confirm the recorded odometer ({Number(formData.odometer).toLocaleString()} mi), fuel level ({formData.fuelLevel}%), and the existing vs new damage conditions listed above.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-blue-100">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.driverAcknowledged}
                  onChange={(e) => setFormData((p) => ({ ...p, driverAcknowledged: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  required
                />
                <span className="text-xs font-semibold text-slate-800">
                  Driver accepts handover inspection terms
                </span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500">Signatory:</span>
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
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#F8FAFC] border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            Save Inspection Record
          </button>
        </div>
      </form>
    </Modal>
  );
}
