import React, { useRef } from 'react';
import {
  CreditCard,
  FileText,
  Camera,
  KeyRound,
  ShieldAlert,
  CheckCircle2,
  Trash2,
  Clock,
  Car
} from 'lucide-react';
import { FormInput, FormSelect, FormTextarea } from '../../../components/forms/FormInputs';

export default function PickupTermsSection({
  formData,
  handleChange,
  errors,
  photos = [],
  setPhotos
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
      {/* Section 3: Rental Schedule & Financial Terms */}
      <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-4">
        <h4 className="text-xs font-bold text-[#0A1E42] uppercase tracking-wider flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-[#075EE8]" /> 3. Rental Period &amp; Handover Schedule
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <FormInput
            label="Pickup Date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            required
            error={errors.startDate}
          />

          <FormInput
            label="Pickup Time"
            name="pickupTime"
            type="time"
            value={formData.pickupTime || '09:00'}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Estimated Return Date"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            required
            error={errors.endDate}
          />

          <FormInput
            label="Weekly Lease Rate ($)"
            name="weeklyRent"
            type="number"
            value={formData.weeklyRent}
            onChange={handleChange}
            placeholder="450"
            required
            error={errors.weeklyRent}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-200/60">
          <div>
            <FormInput
              label="Refundable Security Deposit ($)"
              name="securityDeposit"
              type="number"
              value={formData.securityDeposit}
              onChange={handleChange}
              placeholder="500"
              required
              error={errors.securityDeposit}
            />
            <span className="text-[11px] text-blue-600 block mt-1 font-medium">
              Recorded in escrow until return check-in
            </span>
          </div>

          <FormInput
            label="Payment Schedule Due Terms"
            name="paymentDueDay"
            value={formData.paymentDueDay}
            onChange={handleChange}
            placeholder="Every Monday by 5:00 PM"
            required
          />

          <FormSelect
            label="Initial Payment Method"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            options={['Corporate ACH', 'Credit Card', 'Bank Wire', 'Cash / POS']}
          />
        </div>
      </div>

      {/* Section 4: Vehicle Condition & Pre-existing Damage Inspection */}
      <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-4">
        <h4 className="text-xs font-bold text-[#0A1E42] uppercase tracking-wider flex items-center gap-2">
          <Car className="w-4 h-4 text-[#075EE8]" /> 4. Handover Condition &amp; Damage Documentation
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormSelect
            label="Exterior Handover Condition"
            name="pickupExterior"
            value={formData.pickupExterior || 'Pristine / No visible damage'}
            onChange={handleChange}
            options={[
              'Pristine / No visible damage',
              'Clean & Detailed (Normal Road Wear)',
              'Minor stone chips noted',
              'Pre-existing blemish (documented below)'
            ]}
          />

          <FormSelect
            label="Interior Handover Condition"
            name="pickupInterior"
            value={formData.pickupInterior || 'Clean & Sanitized'}
            onChange={handleChange}
            options={[
              'Clean & Sanitized (Detailing Certified)',
              'Acceptable / Standard Clean',
              'Normal cosmetic upholstery wear'
            ]}
          />
        </div>

        {/* Existing vs New Damage Baseline Documentation */}
        <div className="pt-2 border-t border-slate-200/60 space-y-3">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-800 select-none">
            <input
              type="checkbox"
              name="hasExistingDamage"
              checked={!!formData.hasExistingDamage}
              onChange={handleChange}
              className="w-4 h-4 rounded-sm border-slate-300 text-amber-600 focus:ring-amber-500"
            />
            <span className="flex items-center gap-1.5 text-amber-800">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Document Pre-existing Damage / Blemishes (Baseline for Return Inspection)
            </span>
          </label>

          {formData.hasExistingDamage && (
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2 animate-fade-in">
              <FormTextarea
                label="Pre-existing Damage Description"
                name="existingDamageNotes"
                value={formData.existingDamageNotes || ''}
                onChange={handleChange}
                placeholder="Specify location and details of pre-existing scratch, bumper scuff, or windshield chip so driver is not charged upon return..."
                rows={2}
              />
              <p className="text-[11px] text-amber-800">
                Notice: Documenting existing wear protects both the driver and the fleet. Any damage not listed here will be assessed as NEW damage at return.
              </p>
            </div>
          )}
        </div>

        {/* Mobile Camera Upload & Photos Gallery */}
        <div className="pt-2 border-t border-slate-200/60 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h5 className="text-xs font-bold text-[#0A1E42] flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-[#075EE8]" /> Handover Photo Documentation
              </h5>
              <p className="text-[11px] text-slate-500">
                Capture live vehicle photos on mobile (all 4 angles, odometer gauge, fuel tank, and any blemishes)
              </p>
            </div>

            {/* Hidden Camera Input for Mobile Capture */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="pickup-camera-upload"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs cursor-pointer transition-all active:scale-95 shrink-0"
            >
              <Camera className="w-4 h-4 text-[#075EE8]" />
              Capture / Upload Photos
            </button>
          </div>

          {/* Photo Preview Thumbnails */}
          {photos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-1">
              {photos.map((photo, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-100">
                  <img src={photo} alt={`Handover ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-white rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
              No photos attached yet. Use the camera button above to record vehicle condition.
            </div>
          )}
        </div>

        {/* Handover Checklist: Keys & Driver Acknowledgment */}
        <div className="pt-3 border-t border-slate-200/60 bg-white p-3.5 rounded-xl border border-slate-200 space-y-2.5">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-800 select-none">
            <input
              type="checkbox"
              name="keysHandedOver"
              checked={!!formData.keysHandedOver}
              onChange={handleChange}
              className="w-4 h-4 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="flex items-center gap-1.5 text-slate-800">
              <KeyRound className="w-4 h-4 text-emerald-600" />
              Keys &amp; Transponder Handed Over (2 vehicle keys &amp; electronic toll transponder verified)
            </span>
          </label>
          {errors.keysHandedOver && (
            <span className="text-xs text-rose-500 font-medium block">{errors.keysHandedOver}</span>
          )}

          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-800 select-none">
            <input
              type="checkbox"
              name="driverAcknowledged"
              checked={!!formData.driverAcknowledged}
              onChange={handleChange}
              className="w-4 h-4 rounded-sm border-slate-300 text-[#075EE8] focus:ring-[#075EE8]"
            />
            <span className="flex items-center gap-1.5 text-[#071D49]">
              <CheckCircle2 className="w-4 h-4 text-[#075EE8]" />
              Driver Acknowledgment: Driver confirms receipt of vehicle in the condition noted, agrees to fuel policy, and verifies starting odometer.
            </span>
          </label>
          {errors.driverAcknowledged && (
            <span className="text-xs text-rose-500 font-medium block">{errors.driverAcknowledged}</span>
          )}
        </div>
      </div>
    </>
  );
}
