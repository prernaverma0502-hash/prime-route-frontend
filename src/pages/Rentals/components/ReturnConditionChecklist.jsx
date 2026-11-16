import React, { useRef } from 'react';
import {
  ClipboardCheck,
  ShieldAlert,
  Camera,
  Trash2,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  FileText
} from 'lucide-react';
import { FormInput, FormSelect, FormTextarea } from '../../../components/forms/FormInputs';
import { formatCurrency } from '../../../utils/formatters';

export default function ReturnConditionChecklist({
  isCompleted,
  formData,
  handleChange,
  errors,
  rental,
  photos = [],
  setPhotos,
  settlement
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && setPhotos) {
          setPhotos((prev) => [...prev, event.target.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (indexToRemove) => {
    if (setPhotos) {
      setPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    }
  };

  return (
    <>
      {/* Section: Return Schedule & Condition Assessment */}
      <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1E42] flex items-center gap-2">
          <ClipboardCheck className="w-4 h-4 text-[#075EE8]" /> Return Date, Time &amp; Physical Condition
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <FormInput
            label="Return Date"
            name="returnDate"
            type="date"
            value={formData.returnDate}
            onChange={handleChange}
            disabled={isCompleted}
            required
            error={errors.returnDate}
          />

          <FormInput
            label="Return Time"
            name="returnTime"
            type="time"
            value={formData.returnTime}
            onChange={handleChange}
            disabled={isCompleted}
            required
          />

          <FormSelect
            label="Exterior Condition"
            name="exteriorCondition"
            value={formData.exteriorCondition}
            onChange={handleChange}
            disabled={isCompleted}
            options={[
              'Clean / Pristine (No Dents)',
              'Minor Road Dust (Normal Wear)',
              'Surface Scratches Noted',
              'Body Dent / Damage Present'
            ]}
          />

          <FormSelect
            label="Interior Condition"
            name="interiorCondition"
            value={formData.interiorCondition}
            onChange={handleChange}
            disabled={isCompleted}
            options={[
              'Clean & Sanitized',
              'Acceptable (Minor Dirt)',
              'Requires Detailing & Shampoo',
              'Upholstery Stain / Tear'
            ]}
          />
        </div>

        {/* Existing vs. New Damage Section */}
        <div className="pt-2 border-t border-slate-200/80 space-y-3">
          {/* Baseline Condition from Departure */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Departure Handover Baseline:
            </span>
            <p className="text-slate-700">
              {rental?.existingDamage || rental?.pickupCondition || 'Pristine / No visible damage recorded at dispatch.'}
            </p>
          </div>

          {/* New Damage Evaluation */}
          <div>
            <label className="flex items-center gap-2.5 cursor-pointer font-bold text-xs text-[#0A1E42]">
              <input
                type="checkbox"
                name="hasDamage"
                checked={formData.hasDamage}
                onChange={handleChange}
                disabled={isCompleted}
                className="w-4 h-4 text-rose-600 rounded-sm border-slate-300 focus:ring-rose-500"
              />
              <span className="flex items-center gap-1.5 text-rose-700">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                New Damage Incurred During Lease (Requires Work Order &amp; Deposit Deduction)
              </span>
            </label>

            {formData.hasDamage && (
              <div className="mt-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-3 animate-fade-in">
                <FormTextarea
                  label="New Damage Observations & Repair Assessment"
                  name="damageNotes"
                  value={formData.damageNotes}
                  onChange={handleChange}
                  placeholder="Describe location and severity of new dents, bumper cracks, windshield stars, or mechanical faults..."
                  disabled={isCompleted}
                  required={formData.hasDamage}
                  error={errors.damageNotes}
                />

                {!isCompleted && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <FormInput
                      label="Damage Repair Deduction from Deposit ($)"
                      name="damageFee"
                      type="number"
                      value={formData.damageFee || ''}
                      onChange={handleChange}
                      placeholder="e.g. 250"
                    />
                    <div className="text-[11px] text-rose-700 font-semibold flex items-center pt-5">
                      ⚠️ Note: Reporting new damage will automatically set the vehicle status to <strong>Maintenance</strong>.
                    </div>
                  </div>
                )}
              </div>
            )}

            {!formData.hasDamage && (
              <p className="text-[11px] text-emerald-700 font-medium mt-1">
                ✓ No new damage reported. Vehicle will automatically transition to <strong>Available</strong> for immediate re-dispatch.
              </p>
            )}
          </div>
        </div>

        {/* Mobile Camera Upload & Photos for Check-in */}
        <div className="pt-2 border-t border-slate-200/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h5 className="text-xs font-bold text-[#0A1E42] flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-[#075EE8]" /> Return Check-in Photos
              </h5>
              <p className="text-[11px] text-slate-500">
                Capture return vehicle photos on mobile (dashboard odometer, fuel gauge, all 4 vehicle corners)
              </p>
            </div>

            {!isCompleted && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="return-camera-upload"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs cursor-pointer transition-all active:scale-95 shrink-0"
                >
                  <Camera className="w-4 h-4 text-[#075EE8]" />
                  Capture / Upload Return Photos
                </button>
              </>
            )}
          </div>

          {/* Photo Previews */}
          {photos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-1">
              {photos.map((photo, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-100">
                  <img src={photo} alt={`Return ${idx + 1}`} className="w-full h-full object-cover" />
                  {!isCompleted && (
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-white rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
              No return photos attached yet.
            </div>
          )}
        </div>

        {/* Financial Settlement & Outstanding Charges Calculation */}
        {settlement && (
          <div className="pt-2 border-t border-slate-200/80 bg-white p-4 rounded-xl border border-slate-200 space-y-3">
            <h5 className="text-xs font-bold text-[#0A1E42] uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" /> Outstanding Charges &amp; Deposit Settlement
              </span>
              <span className="text-xs font-mono font-bold text-slate-500">
                Deposit Held: {formatCurrency(settlement.depositHeld)}
              </span>
            </h5>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="flex justify-between py-1.5 text-slate-600">
                <span>Security Deposit in Escrow:</span>
                <span className="font-semibold text-slate-900">{formatCurrency(settlement.depositHeld)}</span>
              </div>
              {settlement.fuelShortfallFee > 0 && (
                <div className="flex justify-between py-1.5 text-rose-600">
                  <span>Fuel Shortfall Refill Fee:</span>
                  <span className="font-bold">-{formatCurrency(settlement.fuelShortfallFee)}</span>
                </div>
              )}
              {settlement.excessMileageFee > 0 && (
                <div className="flex justify-between py-1.5 text-rose-600">
                  <span>Excess Mileage Fee ({settlement.excessMiles} mi @ $0.25):</span>
                  <span className="font-bold">-{formatCurrency(settlement.excessMileageFee)}</span>
                </div>
              )}
              {settlement.damageDeduction > 0 && (
                <div className="flex justify-between py-1.5 text-rose-600">
                  <span>New Damage Repair Deductible:</span>
                  <span className="font-bold">-{formatCurrency(settlement.damageDeduction)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 text-sm font-extrabold bg-slate-50 px-3 rounded-lg mt-1">
                <span className="text-[#071D49]">
                  {settlement.netRefund >= 0 ? 'Net Refund Due to Driver:' : 'Outstanding Balance Due from Driver:'}
                </span>
                <span className={settlement.netRefund >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                  {formatCurrency(Math.abs(settlement.netRefund))}
                </span>
              </div>
            </div>
          </div>
        )}

        <FormTextarea
          label="Additional Return Remarks & Detailing Notes"
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          disabled={isCompleted}
          placeholder="Staff check-in observations..."
        />
      </div>

      {/* Mandatory Return Checklist & Driver Acknowledgment */}
      {!isCompleted && (
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1E42]">
            Mandatory Return Checklist &amp; Acknowledgment
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 select-none">
              <input
                type="checkbox"
                name="keysReturned"
                checked={formData.keysReturned}
                onChange={handleChange}
                className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-slate-500" /> All Vehicle Keys &amp; Transponder Returned
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 select-none">
              <input
                type="checkbox"
                name="vehicleClean"
                checked={formData.vehicleClean}
                onChange={handleChange}
                className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Vehicle Cleanliness Inspected</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 select-none">
              <input
                type="checkbox"
                name="fuelChecked"
                checked={formData.fuelChecked}
                onChange={handleChange}
                className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Fuel Gauge Verified Against Departure State</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 select-none">
              <input
                type="checkbox"
                name="belongingsRemoved"
                checked={formData.belongingsRemoved}
                onChange={handleChange}
                className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Driver Personal Belongings Cleared</span>
            </label>
          </div>

          <div className="pt-2 border-t border-slate-200/60">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-[#071D49] select-none">
              <input
                type="checkbox"
                name="driverAcknowledged"
                checked={!!formData.driverAcknowledged}
                onChange={handleChange}
                className="rounded-sm border-slate-300 text-[#075EE8] focus:ring-[#075EE8]"
              />
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#075EE8]" />
                Driver Acknowledgment: Driver confirms return inspection, mileage readings, and deposit settlement amount.
              </span>
            </label>
            {errors.driverAcknowledged && (
              <span className="text-xs text-rose-500 font-medium block mt-1">{errors.driverAcknowledged}</span>
            )}
          </div>

          {errors.keysReturned && (
            <span className="text-xs text-rose-500 font-medium block">{errors.keysReturned}</span>
          )}
        </div>
      )}
    </>
  );
}
