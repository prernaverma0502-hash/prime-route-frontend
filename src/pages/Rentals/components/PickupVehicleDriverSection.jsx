import React from 'react';
import { User, Car, CheckCircle2, Phone, Mail, AlertTriangle } from 'lucide-react';
import { FormInput, FormSelect } from '../../../components/forms/FormInputs';

export default function PickupVehicleDriverSection({
  selectedDriverId,
  setSelectedDriverId,
  selectedDriver,
  activeDrivers,
  selectedVehicleId,
  setSelectedVehicleId,
  selectedVehicle,
  availableVehicles,
  formData,
  handleChange,
  errors,
  setErrors,
  odometerWarning,
  allowLowerOdometer,
  setAllowLowerOdometer,
}) {
  return (
    <>
      {/* Section 1: Driver Selection & Auto-Populated Profile */}
      <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-[#0A1E42] uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-[#075EE8]" /> 1. Driver Information
          </h4>
          {selectedDriver && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Profile Loaded
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Select Authorized Driver <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedDriverId}
              onChange={(e) => {
                setSelectedDriverId(e.target.value);
                if (errors.driver) setErrors((prev) => ({ ...prev, driver: '' }));
              }}
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl transition-all focus:outline-hidden focus:ring-2 ${
                errors.driver
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-200 focus:ring-[#075EE8]/20 focus:border-[#075EE8]'
              }`}
            >
              <option value="">-- Choose a registered driver --</option>
              {activeDrivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.id}) — {d.license}
                </option>
              ))}
            </select>
            {errors.driver && (
              <span className="text-xs text-rose-500 font-medium mt-1 block">
                {errors.driver}
              </span>
            )}
          </div>

          {/* Display Auto-Populated Driver Card */}
          {selectedDriver ? (
            <div className="bg-white p-3.5 rounded-xl border border-blue-200/80 shadow-xs flex items-center gap-3.5 animate-fade-in">
              <img
                src={selectedDriver.avatar}
                alt={selectedDriver.name}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-100 shrink-0"
              />
              <div className="min-w-0 flex-1 text-xs space-y-0.5">
                <p className="font-bold text-[#0A1E42] text-sm truncate">{selectedDriver.name}</p>
                <p className="text-slate-600 font-mono text-[11px]">
                  DL: <strong>{selectedDriver.license}</strong>
                </p>
                <div className="flex flex-wrap items-center gap-3 text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" /> {selectedDriver.phone}
                  </span>
                  <span className="flex items-center gap-1 truncate">
                    <Mail className="w-3 h-3 text-slate-400" /> {selectedDriver.email}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/60 p-3.5 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400">
              Driver details will automatically appear here once selected.
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Vehicle Selection & Auto-Populated Specs */}
      <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-[#0A1E42] uppercase tracking-wider flex items-center gap-2">
            <Car className="w-4 h-4 text-[#075EE8]" /> 2. Vehicle Selection & Handover Gauge
          </h4>
          {selectedVehicle && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Vehicle Available
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Select Available Fleet Vehicle <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedVehicleId}
              onChange={(e) => {
                setSelectedVehicleId(e.target.value);
                if (errors.vehicle) setErrors((prev) => ({ ...prev, vehicle: '' }));
              }}
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl transition-all focus:outline-hidden focus:ring-2 ${
                errors.vehicle
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-200 focus:ring-[#075EE8]/20 focus:border-[#075EE8]'
              }`}
            >
              <option value="">-- Choose an available vehicle --</option>
              {availableVehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.year} {v.make} {v.model} • {v.plate} ({v.mileage})
                </option>
              ))}
            </select>
            {errors.vehicle && (
              <span className="text-xs text-rose-500 font-medium mt-1 block">
                {errors.vehicle}
              </span>
            )}
            {availableVehicles.length === 0 && (
              <span className="text-xs text-amber-600 font-medium mt-1 block">
                No vehicles currently marked as Available in fleet inventory.
              </span>
            )}
          </div>

          {/* Display Auto-Populated Vehicle Specs Card */}
          {selectedVehicle ? (
            <div className="bg-white p-3.5 rounded-xl border border-blue-200/80 shadow-xs flex items-center gap-3.5 animate-fade-in">
              <img
                src={selectedVehicle.image}
                alt={selectedVehicle.name}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                className="w-16 h-12 rounded-xl object-cover ring-2 ring-blue-100 shrink-0"
              />
              <div className="min-w-0 flex-1 text-xs space-y-0.5">
                <p className="font-bold text-[#0A1E42] text-sm truncate">
                  {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                </p>
                <p className="text-slate-600 font-mono text-[11px]">
                  Plate: <strong>{selectedVehicle.plate}</strong> • Color: {selectedVehicle.color}
                </p>
                <p className="text-slate-500 text-[11px] font-mono truncate">
                  VIN: <strong>{selectedVehicle.vin}</strong>
                </p>
                <p className="text-blue-700 font-semibold text-[11px]">
                  Recorded Odometer: {selectedVehicle.mileage}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white/60 p-3.5 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400">
              Vehicle specifications will automatically load here once selected.
            </div>
          )}
        </div>

        {/* Handover Specifics: Pickup Odometer & Fuel Level */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200/60">
          <div>
            <FormInput
              label="Actual Handover Odometer Reading (Miles)"
              name="pickupOdometer"
              type="number"
              value={formData.pickupOdometer}
              onChange={handleChange}
              placeholder="e.g. 24500"
              required
              error={errors.pickupOdometer}
              helperText={selectedVehicle ? `Defaults to recorded mileage: ${selectedVehicle.mileage}` : ''}
            />

            {/* Odometer Warning Alert */}
            {odometerWarning && (
              <div className="mt-2 p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex flex-col gap-1.5 animate-fade-in">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{odometerWarning}</span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-amber-950 text-[11px] ml-6">
                  <input
                    type="checkbox"
                    checked={allowLowerOdometer}
                    onChange={(e) => setAllowLowerOdometer(e.target.checked)}
                    className="rounded-sm border-amber-300 text-amber-600 focus:ring-amber-500"
                  />
                  I confirm this odometer reading is correct (Staff Override)
                </label>
              </div>
            )}
          </div>

          <div>
            <FormSelect
              label="Handover Fuel Level"
              name="pickupFuelLevel"
              value={formData.pickupFuelLevel}
              onChange={handleChange}
              required
              error={errors.pickupFuelLevel}
              options={[
                'Full (100%)',
                '7/8 (87%)',
                '3/4 (75%)',
                '5/8 (62%)',
                '1/2 (50%)',
                '3/8 (37%)',
                '1/4 (25%)'
              ]}
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Standard PrimeRoute agreement requires the driver to return with an equal full tank of fuel.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

