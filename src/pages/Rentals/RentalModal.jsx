import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Calendar,
  DollarSign,
  Car,
  User,
  ShieldCheck,
  Building,
  Info
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import { FormInput, FormSelect, FormTextarea } from '../../components/forms/FormInputs';
import { isEndDateAfterStartDate } from '../../utils/validators';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { useFleet } from '../../context/FleetContext';

const STANDARD_TERMS = [
  'Authorized driver only — no unauthorized secondary drivers permitted without written rider',
  'Commercial comprehensive & primary collision insurance maintained by PrimeRoute',
  'Compliance with scheduled oil changes, tire rotations & preventative maintenance',
  'Direct responsibility for all toll transponder fees, tickets & moving violations',
  'Strict non-smoking policy & detailing cleanliness return standards enforced'
];

export default function RentalModal({
  isOpen,
  onClose,
  onSave,
  rental = null
}) {
  const { vehicles, drivers, rentals } = useFleet();
  const isEditing = !!rental;

  // Active drivers
  const activeDrivers = useMemo(() => {
    return drivers.filter((d) => d.status === 'Active');
  }, [drivers]);

  // Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultEndStr = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    id: '',
    customer: '',
    customerPhone: '',
    customerEmail: '',
    driverId: '',
    driver: '',
    vehicleId: '',
    vehicle: '',
    startDate: todayStr,
    endDate: defaultEndStr,
    rentalType: 'Commercial Weekly',
    weeklyRent: 450,
    amount: 900,
    deposit: 500,
    mileageAllowance: 1200,
    excessMileageRate: 0.25,
    paymentSchedule: 'Weekly every Monday',
    paymentMethod: 'Corporate ACH',
    status: 'Draft',
    notes: 'Commercial lease agreement generated via PrimeRoute Dispatch.',
    approvedTerms: [...STANDARD_TERMS]
  });

  const [validationError, setValidationError] = useState('');

  // Initialize or reset form data when opening modal
  useEffect(() => {
    if (rental && isOpen) {
      setFormData({
        ...rental,
        weeklyRent: rental.weeklyRent || Math.round((rental.amount || 1950) / 4) || 450,
        paymentSchedule: rental.paymentDueDay || rental.paymentSchedule || 'Weekly every Monday',
        approvedTerms: rental.approvedTerms || [...STANDARD_TERMS]
      });
      setValidationError('');
    } else if (isOpen) {
      const generatedContractNo = `PR-CTR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
      const firstAvailable = vehicles.find((v) => v.status === 'Available');
      const firstDriver = activeDrivers[0];

      setFormData({
        id: generatedContractNo,
        customer: firstDriver?.name || 'Authorized Driver',
        customerPhone: firstDriver?.phone || '+1 (555) 000-0000',
        customerEmail: firstDriver?.email || 'driver@primeroutefleet.com',
        driverId: firstDriver?.id || '',
        driver: firstDriver?.name || '',
        vehicleId: firstAvailable?.id || '',
        vehicle: firstAvailable ? `${firstAvailable.year} ${firstAvailable.make} ${firstAvailable.model} (${firstAvailable.plate})` : '',
        startDate: todayStr,
        endDate: defaultEndStr,
        rentalType: 'Commercial Weekly',
        weeklyRent: firstAvailable?.rate || 450,
        amount: (firstAvailable?.rate || 450) * 2,
        deposit: 500,
        mileageAllowance: 1200,
        excessMileageRate: 0.25,
        paymentSchedule: 'Weekly every Monday',
        paymentMethod: 'Corporate ACH',
        status: 'Draft',
        notes: 'Commercial lease agreement generated via PrimeRoute Dispatch.',
        approvedTerms: [...STANDARD_TERMS]
      });
      setValidationError('');
    }
  }, [rental, isOpen, vehicles, activeDrivers, todayStr, defaultEndStr]);

  // Recalculate amount whenever weeklyRent or date range changes
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const diffMs = new Date(formData.endDate) - new Date(formData.startDate);
      const diffDays = Math.max(1, Math.round(diffMs / (24 * 60 * 60 * 1000)));
      const weeks = Math.max(1, Math.ceil(diffDays / 7));
      const totalAmount = (Number(formData.weeklyRent) || 0) * weeks;
      setFormData((prev) => ({
        ...prev,
        amount: totalAmount,
        total: totalAmount + Math.round(totalAmount * 0.08)
      }));
    }
  }, [formData.startDate, formData.endDate, formData.weeklyRent]);

  // Selected driver object
  const selectedDriverObj = useMemo(() => {
    return drivers.find((d) => d.id === formData.driverId || d.name === formData.driver) || null;
  }, [drivers, formData.driverId, formData.driver]);

  // Selected vehicle object
  const selectedVehicleObj = useMemo(() => {
    return vehicles.find((v) => v.id === formData.vehicleId || (v.plate && formData.vehicle.includes(v.plate))) || null;
  }, [vehicles, formData.vehicleId, formData.vehicle]);

  // Handle Driver change
  const handleDriverChange = (e) => {
    const dId = e.target.value;
    const found = drivers.find((d) => d.id === dId);
    if (found) {
      setFormData((prev) => ({
        ...prev,
        driverId: found.id,
        driver: found.name,
        customer: found.name,
        customerPhone: found.phone || prev.customerPhone,
        customerEmail: found.email || prev.customerEmail
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        driverId: '',
        driver: '',
        customer: ''
      }));
    }
  };

  // Helper to check overlap for a vehicle
  const checkVehicleConflict = (vehId, sDate, eDate) => {
    if (!vehId || !sDate || !eDate) return null;
    return rentals.find((r) => {
      // Don't conflict with current rental being edited
      if (rental && r.id === rental.id) return false;

      // Only active / awaiting / renewed / draft leases conflict
      if (['Completed', 'Terminated', 'Cancelled'].includes(r.status)) return false;

      const isSameVehicle =
        r.vehicleId === vehId ||
        (r.vehicle && selectedVehicleObj && r.vehicle.includes(selectedVehicleObj.plate));

      if (!isSameVehicle) return false;

      // Overlap condition: reqStart <= existingEnd && reqEnd >= existingStart
      const rStart = r.startDate;
      const rEnd = r.endDate || r.startDate;
      return sDate <= rEnd && eDate >= rStart;
    });
  };

  // Check overlap for current selection
  const conflictingRental = useMemo(() => {
    return checkVehicleConflict(formData.vehicleId, formData.startDate, formData.endDate);
  }, [formData.vehicleId, formData.startDate, formData.endDate, rentals, rental, selectedVehicleObj]);

  // Handle Vehicle change
  const handleVehicleChange = (e) => {
    const vId = e.target.value;
    const found = vehicles.find((v) => v.id === vId);
    if (found) {
      setFormData((prev) => ({
        ...prev,
        vehicleId: found.id,
        vehicle: `${found.year} ${found.make} ${found.model} (${found.plate})`,
        weeklyRent: found.rate || prev.weeklyRent || 450
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        vehicleId: '',
        vehicle: ''
      }));
    }
  };

  // Toggle approved terms
  const handleToggleTerm = (term) => {
    setFormData((prev) => {
      const exists = prev.approvedTerms.includes(term);
      return {
        ...prev,
        approvedTerms: exists
          ? prev.approvedTerms.filter((t) => t !== term)
          : [...prev.approvedTerms, term]
      };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.driverId && !formData.driver) {
      setValidationError('Please select an authorized driver.');
      return;
    }

    if (!formData.vehicleId) {
      setValidationError('Please select an eligible fleet vehicle.');
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      setValidationError('Start and End dates are required.');
      return;
    }

    if (!isEndDateAfterStartDate(formData.startDate, formData.endDate)) {
      setValidationError('Invalid Dates: Rental Return/End Date must be on or after Start Date.');
      return;
    }

    // Overlap blocking rule
    if (conflictingRental) {
      setValidationError(
        `Overbooking Conflict Blocked: Vehicle is already scheduled for Contract ${conflictingRental.id} (${conflictingRental.customer || conflictingRental.driver}) from ${formatDate(conflictingRental.startDate)} to ${formatDate(conflictingRental.endDate)}.`
      );
      return;
    }

    const weeks = Math.max(1, Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (7 * 24 * 60 * 60 * 1000)));
    const baseAmount = (Number(formData.weeklyRent) || 450) * weeks;
    const taxAmount = Math.round(baseAmount * 0.08);

    const submissionData = {
      ...formData,
      amount: baseAmount,
      tax: taxAmount,
      total: baseAmount + taxAmount,
      agreementStatus: formData.agreementStatus || 'Draft',
      status: formData.status || 'Draft',
      paymentDueDay: formData.paymentSchedule,
      securityDeposit: Number(formData.deposit) || 500,
      weeklyRent: Number(formData.weeklyRent) || 450,
      mileageAllowance: Number(formData.mileageAllowance) || 1200,
      excessMileageRate: Number(formData.excessMileageRate) || 0.25,
      notes: formData.notes
    };

    onSave(submissionData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Rental Contract: ${formData.id}` : 'Create Vehicle Rental Agreement'}
      subtitle="Issue vehicle lease contract, calculate charges, and review live agreement draft"
      maxWidth="max-w-7xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Two-Column Grid: Left (Form Controls) | Right (Live Contract Preview) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Input Form */}
          <div className="lg:col-span-6 space-y-4">
            {/* Unique Auto-Generated Contract Number */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Contract Agreement Number (Auto-Generated)
                </span>
                <span className="font-mono text-base font-extrabold text-[#075EE8] flex items-center gap-1.5 mt-0.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  {formData.id}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-100 text-[#075EE8] border border-blue-200">
                Read-Only
              </span>
            </div>

            {/* Driver Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Authorized Driver / Lessee <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.driverId}
                onChange={handleDriverChange}
                required
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8]"
              >
                <option value="">-- Select a registered commercial driver --</option>
                {activeDrivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.id}) — DL: {d.license}
                  </option>
                ))}
              </select>
            </div>

            {/* Vehicle Selection with Disabled Reasons */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Assigned Fleet Vehicle <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.vehicleId}
                onChange={handleVehicleChange}
                required
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8]"
              >
                <option value="">-- Select an available fleet vehicle --</option>
                {vehicles.map((v) => {
                  const isMaint = v.status === 'Maintenance';
                  const isUnavail = v.status === 'Unavailable' || v.status === 'Sold / Retired';
                  const isRented = v.status === 'Rented';
                  const hasConflict = !!checkVehicleConflict(v.id, formData.startDate, formData.endDate);

                  const isDisabled = isMaint || isUnavail || (isRented && v.id !== rental?.vehicleId) || hasConflict;

                  let reasonLabel = '';
                  if (isMaint) reasonLabel = '[Disabled - In Maintenance]';
                  else if (isUnavail) reasonLabel = `[Disabled - ${v.status}]`;
                  else if (hasConflict) reasonLabel = '[Disabled - Schedule Conflict / Already Reserved]';
                  else if (isRented) reasonLabel = '[Disabled - Currently Rented]';

                  return (
                    <option key={v.id} value={v.id} disabled={isDisabled}>
                      {v.year} {v.make} {v.model} • Plate: {v.plate} {isDisabled ? `— ${reasonLabel}` : `[$${v.rate || 450}/wk]`}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Overlap Rule Alert Banner */}
            {conflictingRental && (
              <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl space-y-1 animate-shake">
                <div className="flex items-center gap-2 text-rose-800 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Automated Overlap Conflict Block</span>
                </div>
                <p className="text-[11px] text-rose-700 leading-normal pl-6">
                  Selected vehicle is already assigned to <strong>Contract {conflictingRental.id}</strong> ({conflictingRental.customer || conflictingRental.driver}) from <strong>{formatDate(conflictingRental.startDate)}</strong> to <strong>{formatDate(conflictingRental.endDate)}</strong>. Please select another vehicle or modify dates.
                </p>
              </div>
            )}

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Rental Start Date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
              <FormInput
                label="Rental End Date"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* Rates, Deposit & Mileage */}
            <div className="grid grid-cols-3 gap-3">
              <FormInput
                label="Weekly Rate ($)"
                name="weeklyRent"
                type="number"
                value={formData.weeklyRent}
                onChange={handleChange}
                required
              />
              <FormInput
                label="Security Deposit ($)"
                name="deposit"
                type="number"
                value={formData.deposit}
                onChange={handleChange}
                required
              />
              <FormInput
                label="Mileage Limit (mi/wk)"
                name="mileageAllowance"
                type="number"
                value={formData.mileageAllowance}
                onChange={handleChange}
                placeholder="1200"
              />
            </div>

            {/* Payment Schedule & Status */}
            <div className="grid grid-cols-2 gap-3">
              <FormSelect
                label="Payment Schedule"
                name="paymentSchedule"
                value={formData.paymentSchedule}
                onChange={handleChange}
                options={[
                  'Weekly every Monday',
                  'Weekly every Friday',
                  'Bi-weekly on 1st & 15th',
                  'Monthly Lease'
                ]}
              />

              <FormSelect
                label="Initial Agreement Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                  'Draft',
                  'Awaiting Signature',
                  'Active',
                  'Renewed',
                  'Completed',
                  'Terminated'
                ]}
              />
            </div>

            {/* Approved Terms Checklist */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2.5">
              <h4 className="text-xs font-bold text-[#0A1E42] uppercase tracking-wider flex items-center justify-between">
                <span>Approved Contract Terms &amp; Covenants</span>
                <span className="text-[11px] font-semibold text-blue-600">
                  {formData.approvedTerms.length} of {STANDARD_TERMS.length} selected
                </span>
              </h4>
              <div className="space-y-2 text-xs">
                {STANDARD_TERMS.map((term, idx) => (
                  <label
                    key={idx}
                    className="flex items-start gap-2.5 cursor-pointer text-slate-700 hover:text-slate-900 select-none"
                  >
                    <input
                      type="checkbox"
                      checked={formData.approvedTerms.includes(term)}
                      onChange={() => handleToggleTerm(term)}
                      className="mt-0.5 w-4 h-4 rounded-sm border-slate-300 text-[#075EE8] focus:ring-[#075EE8]"
                    />
                    <span className="text-[11px] leading-snug">{term}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Special Notes */}
            <FormTextarea
              label="Special Instructions / Dispatch Notes"
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              placeholder="Fuel reimbursement rules, airport toll coverage, transponder numbers..."
              rows={2}
            />

            {validationError && (
              <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Live PrimeRoute-Branded Contract Preview */}
          <div className="lg:col-span-6 sticky top-4">
            <div className="bg-slate-100 p-3 rounded-2xl border border-slate-300 shadow-inner">
              <div className="flex items-center justify-between px-2 pb-2 text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#075EE8]" /> Live Contract Preview
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#075EE8] font-bold text-[10px] animate-pulse">
                  Real-time Sync
                </span>
              </div>

              {/* Render Simulated Document */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-md font-serif text-[12px] leading-relaxed text-slate-900 space-y-4 max-h-[620px] overflow-y-auto">
                {/* Document Header */}
                <div className="text-center border-b border-slate-200 pb-3 space-y-1">
                  <div className="flex justify-center mb-1">
                    <img
                      src="/primeroute-logo.png"
                      alt="PrimeRoute"
                      className="h-9 w-auto object-contain"
                    />
                  </div>
                  <h3 className="font-sans font-black text-sm text-[#071D49] tracking-wider uppercase">
                    Commercial Vehicle Rental Agreement
                  </h3>
                  <p className="font-sans text-[10px] text-slate-500">
                    Agreement No: <span className="font-mono font-bold text-[#075EE8]">{formData.id}</span> • Status: <span className="font-bold text-slate-700">{formData.status}</span>
                  </p>
                </div>

                {/* Parties Section */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-sans text-[11px] space-y-1.5">
                  <div className="font-bold uppercase tracking-wider text-[#071D49] text-[10px]">
                    1. Contracting Parties
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Lessor (Owner):</span>
                      <span className="font-bold text-slate-800 block">PrimeRoute Fleet Operations</span>
                      <span className="text-[10px] text-slate-500">Commercial Carrier Dispatch Hub</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Lessee (Driver):</span>
                      <span className="font-bold text-slate-800 block">
                        {formData.driver || 'Selected Driver'}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        DL: {selectedDriverObj?.license || 'DL-PENDING'} • {formData.customerPhone || 'Phone'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vehicle Section */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-sans text-[11px] space-y-1.5">
                  <div className="font-bold uppercase tracking-wider text-[#071D49] text-[10px]">
                    2. Assigned Vehicle Specifications
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Make &amp; Model:</span>
                      <span className="font-bold text-slate-800 truncate block">
                        {selectedVehicleObj ? `${selectedVehicleObj.year} ${selectedVehicleObj.make} ${selectedVehicleObj.model}` : 'Unassigned'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">VIN:</span>
                      <span className="font-mono font-bold text-slate-800 text-[10px] truncate block">
                        {selectedVehicleObj?.vin || 'VIN-PENDING'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">License Plate:</span>
                      <span className="font-mono font-bold text-slate-800 block">
                        {selectedVehicleObj?.plate || 'PR-PENDING'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Financial & Schedule Terms */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-sans text-[11px] space-y-1.5">
                  <div className="font-bold uppercase tracking-wider text-[#071D49] text-[10px]">
                    3. Commercial Terms &amp; Rental Period
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Start Date:</span>
                      <span className="font-bold text-slate-800">{formatDate(formData.startDate)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">End Date:</span>
                      <span className="font-bold text-slate-800">{formatDate(formData.endDate)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Weekly Rate:</span>
                      <span className="font-bold text-[#075EE8]">${formData.weeklyRent}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Security Deposit:</span>
                      <span className="font-bold text-slate-800">${formData.deposit}</span>
                    </div>
                  </div>
                  <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-200/60">
                    <span>Payment Due: <strong>{formData.paymentSchedule}</strong></span>
                    <span>Mileage Allowance: <strong>{formData.mileageAllowance} mi/wk</strong> (${formData.excessMileageRate}/mi excess)</span>
                  </div>
                </div>

                {/* Covenants & Approved Terms */}
                <div className="space-y-1 text-[11px] font-sans">
                  <div className="font-bold uppercase tracking-wider text-[#071D49] text-[10px]">
                    4. Operational Terms &amp; Standard Covenants
                  </div>
                  <ul className="space-y-1 text-slate-700 pl-4 list-disc text-[10.5px]">
                    {formData.approvedTerms.map((term, i) => (
                      <li key={i}>{term}</li>
                    ))}
                  </ul>
                </div>

                {/* Signature Line Preview */}
                <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-4 font-sans text-[10px]">
                  <div>
                    <span className="text-slate-400 block">Lessee Signature:</span>
                    <div className="h-9 border-b border-dashed border-slate-300 flex items-center font-bold text-slate-700 italic">
                      {formData.driver ? `${formData.driver}` : 'Pending Signature'}
                    </div>
                    <span className="text-slate-400 text-[9px]">Authorized Commercial Driver</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Lessor Authorized Officer:</span>
                    <div className="h-9 border-b border-dashed border-slate-300 flex items-center font-bold text-[#075EE8] italic">
                      PrimeRoute Authorized Officer
                    </div>
                    <span className="text-slate-400 text-[9px]">PrimeRoute Fleet Operations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!!conflictingRental}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all cursor-pointer ${
              conflictingRental
                ? 'bg-slate-400 cursor-not-allowed opacity-60'
                : 'bg-[#075EE8] hover:bg-[#0650C7] shadow-blue-500/25 active:scale-95'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {isEditing ? 'Update Contract' : 'Generate Contract'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
