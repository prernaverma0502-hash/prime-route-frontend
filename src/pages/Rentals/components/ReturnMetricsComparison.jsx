import React from 'react';
import { Gauge, Fuel, AlertTriangle } from 'lucide-react';
import { FormInput, FormSelect } from '../../../components/forms/FormInputs';
import { formatDate } from '../../../utils/formatters';

export default function ReturnMetricsComparison({
  rental,
  pickupOdometer,
  pickupFuel,
  pickupCondition,
  isCompleted,
  distanceTravelled,
  formData,
  handleChange,
  errors,
  isOdometerInvalid,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="bg-[#F8FAFC] px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#071D49] flex items-center gap-2">
          <Gauge className="w-4 h-4 text-[#075EE8]" /> Handover vs. Return Comparison
        </h4>
        <span className="text-xs font-bold text-[#075EE8] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
          Total Travelled: {distanceTravelled.toLocaleString()} miles
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
        {/* Left: Pickup Handover Baseline */}
        <div className="p-4 sm:p-5 space-y-4 bg-slate-50/40">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Departure State (Pickup)
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {formatDate(rental.pickupDateTime || rental.startDate)}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Departure Odometer</span>
              <span className="font-mono font-bold text-[#0A1E42] text-base">
                {pickupOdometer.toLocaleString()} mi
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Departure Fuel Level</span>
              <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Fuel className="w-3.5 h-3.5 text-emerald-600" /> {pickupFuel}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Departure Condition</span>
              <span className="font-medium text-slate-700 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 block mt-0.5">
                {pickupCondition}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Return Check-in Metrics */}
        <div className="p-4 sm:p-5 space-y-4 bg-white">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
            <span className="text-xs font-bold uppercase tracking-wider text-[#075EE8]">
              Check-in State (Return)
            </span>
            <span className="text-[11px] font-bold text-emerald-600">
              {isCompleted ? 'Audit Recorded' : 'Live Check-in'}
            </span>
          </div>

          <div className="space-y-3">
            {isCompleted ? (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Return Odometer</span>
                  <span className="font-mono font-bold text-[#075EE8] text-base">
                    {Number(formData.returnOdometer).toLocaleString()} mi
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Return Fuel Level</span>
                  <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <Fuel className="w-3.5 h-3.5 text-blue-600" /> {formData.returnFuelLevel}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Return Condition</span>
                  <span className="font-medium text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 block mt-0.5">
                    {formData.exteriorCondition} • {formData.interiorCondition}
                  </span>
                </div>
              </div>
            ) : (
              <>
                <FormInput
                  label="Return Odometer Reading (Miles)"
                  name="returnOdometer"
                  type="number"
                  value={formData.returnOdometer}
                  onChange={handleChange}
                  placeholder={`e.g. ${pickupOdometer + 350}`}
                  required
                  error={errors.returnOdometer}
                  helperText={`Must be >= departure reading (${pickupOdometer.toLocaleString()} mi)`}
                />

                {isOdometerInvalid && (
                  <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Return odometer cannot be lower than pickup reading ({pickupOdometer} mi).</span>
                  </div>
                )}

                <FormSelect
                  label="Return Fuel Level"
                  name="returnFuelLevel"
                  value={formData.returnFuelLevel}
                  onChange={handleChange}
                  options={[
                    'Full (100%)',
                    '7/8 (87%)',
                    '3/4 (75%)',
                    '5/8 (62%)',
                    '1/2 (50%)',
                    '3/8 (37%)',
                    '1/4 (25%)',
                    'Empty (Reserve)'
                  ]}
                  required
                  error={errors.returnFuelLevel}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

