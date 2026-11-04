import React, { useState, useEffect, useMemo } from 'react';
import {
  Car,
  User,
  KeyRound,
  Calendar,
  Fuel,
  Gauge,
  Shield,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Mail,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import { FormInput, FormSelect, FormTextarea } from '../../components/forms/FormInputs';
import { useFleet } from '../../context/FleetContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function VehiclePickupModal({
  isOpen,
  onClose,
  onSave
}) {
  const { vehicles, drivers, rentals, updateVehicleStatus, updateDriverVehicle, saveRental, addInspection } = useFleet();

  // Filter available vehicles only
  const availableVehicles = useMemo(() => {
    return vehicles.filter((v) => v.status === 'Available');
  }, [vehicles]);

  // Active drivers list
  const activeDrivers = useMemo(() => {
    return drivers.filter((d) => d.status === 'Active');
  }, [drivers]);

  // Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultEndStr = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');

  const [formData, setFormData] = useState({
    startDate: todayStr,
    endDate: defaultEndStr,
    weeklyRent: '450',
    paymentDueDay: 'Every Monday',
    securityDeposit: '300', // Standard contract amount per Section 9
    pickupOdometer: '',
    pickupFuelLevel: 'Full (100%)',
    pickupCondition: 'Pristine / No visible damage',
    pickupRemarks: 'Standard commercial rental handover. Keys, transponder, and vehicle manual handed over.',
    paymentMethod: 'Corporate ACH',
    mileageAllowance: '1200',
    excessMileageRate: '0.25'
  });

  const [errors, setErrors] = useState({});
  const [odometerWarning, setOdometerWarning] = useState('');
  const [allowLowerOdometer, setAllowLowerOdometer] = useState(false);

  // Selected Driver & Vehicle Objects
  const selectedDriver = useMemo(() => {
    return drivers.find((d) => d.id === selectedDriverId) || null;
  }, [drivers, selectedDriverId]);

  const selectedVehicle = useMemo(() => {
    return vehicles.find((v) => v.id === selectedVehicleId) || null;
  }, [vehicles, selectedVehicleId]);

  // Auto-populate when vehicle changes
  useEffect(() => {
    if (selectedVehicle) {
      // Extract numeric mileage from vehicle (e.g., "24,500 mi" -> 24500)
      const rawMileage = typeof selectedVehicle.mileage === 'number'
        ? selectedVehicle.mileage
        : parseInt(String(selectedVehicle.mileage || '0').replace(/\D/g, ''), 10) || 0;

      setFormData((prev) => ({
        ...prev,
        pickupOdometer: String(rawMileage)
      }));
      setOdometerWarning('');
      setAllowLowerOdometer(false);
    } else {
      setFormData((prev) => ({
        ...prev,
        pickupOdometer: ''
      }));
      setOdometerWarning('');
      setAllowLowerOdometer(false);
    }
  }, [selectedVehicleId, selectedVehicle]);

  // Validate Odometer in relation to recorded mileage
  useEffect(() => {
    if (selectedVehicle && formData.pickupOdometer !== '') {
      const enteredMiles = Number(formData.pickupOdometer);
      const recordedMiles = typeof selectedVehicle.mileage === 'number'
        ? selectedVehicle.mileage
        : parseInt(String(selectedVehicle.mileage || '0').replace(/\D/g, ''), 10) || 0;

      if (!isNaN(enteredMiles) && enteredMiles < recordedMiles) {
        setOdometerWarning(
          `Entered pickup mileage (${enteredMiles.toLocaleString()} mi) is lower than the vehicle's last recorded mileage (${recordedMiles.toLocaleString()} mi). Please double check the gauge.`
        );
      } else {
        setOdometerWarning('');
      }
    } else {
      setOdometerWarning('');
    }
  }, [formData.pickupOdometer, selectedVehicle]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedDriverId('');
      setSelectedVehicleId('');
      setFormData({
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        weeklyRent: '450',
        paymentDueDay: 'Every Monday',
        securityDeposit: '300',
        pickupOdometer: '',
        pickupFuelLevel: 'Full (100%)',
        pickupCondition: 'Pristine / No visible damage',
        pickupRemarks: 'Standard commercial rental handover. Keys, transponder, and vehicle manual handed over.',
        paymentMethod: 'Corporate ACH',
        mileageAllowance: '1200',
        excessMileageRate: '0.25'
      });
      setErrors({});
      setOdometerWarning('');
      setAllowLowerOdometer(false);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!selectedDriverId) {
      newErrors.driver = 'Please select a driver for vehicle handover.';
    }

    if (!selectedVehicleId) {
      newErrors.vehicle = 'Please select an available vehicle.';
    } else {
      // Check for duplicate active rentals on this vehicle
      const isAlreadyActive = rentals.some(
        (r) => r.vehicleId === selectedVehicleId && r.status === 'Active'
      );
      if (isAlreadyActive) {
        newErrors.vehicle = 'This vehicle already has an active rental agreement.';
      }
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Rental start date is required.';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Rental end date is required.';
    } else if (formData.startDate && formData.endDate < formData.startDate) {
      newErrors.endDate = 'End date cannot be earlier than start date.';
    }

    const rentVal = Number(formData.weeklyRent);
    if (isNaN(rentVal) || rentVal <= 0) {
      newErrors.weeklyRent = 'Weekly rent must be a positive amount.';
    }

    const depositVal = Number(formData.securityDeposit);
    if (isNaN(depositVal) || depositVal < 0) {
      newErrors.securityDeposit = 'Security deposit must be 0 or greater.';
    }

    const odoVal = Number(formData.pickupOdometer);
    if (formData.pickupOdometer === '' || isNaN(odoVal) || odoVal < 0) {
      newErrors.pickupOdometer = 'Valid pickup odometer reading is required.';
    } else if (odometerWarning && !allowLowerOdometer) {
      newErrors.pickupOdometer = 'Please confirm or correct the lower odometer reading.';
    }

    if (!formData.pickupFuelLevel) {
      newErrors.pickupFuelLevel = 'Pickup fuel level is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (!selectedDriver || !selectedVehicle) return;

    const weeks = Math.max(
      1,
      Math.ceil(
        (new Date(formData.endDate) - new Date(formData.startDate)) /
          (7 * 24 * 60 * 60 * 1000)
      )
    );
    const weeklyRate = Number(formData.weeklyRent) || 450;
    const baseAmount = weeklyRate * weeks;
    const depositAmount = Number(formData.securityDeposit) || 300;
    const taxAmount = Math.round(baseAmount * 0.08); // 8% standard tax
    const totalAmount = baseAmount + taxAmount;

    const newRentalId = `RNT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const agreementId = `AGR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newRentalRecord = {
      id: newRentalId,
      customer: selectedDriver.name,
      customerPhone: selectedDriver.phone,
      customerEmail: selectedDriver.email,
      vehicle: `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.plate})`,
      vehicleId: selectedVehicle.id,
      driver: selectedDriver.name,
      driverId: selectedDriver.id,
      startDate: formData.startDate,
      endDate: formData.endDate,
      rentalType: 'Commercial Weekly',
      pickupLocation: selectedVehicle.depotLocation || 'JFK Airport Fleet Hub',
      dropoffLocation: 'Same as Pickup Depot',
      amount: baseAmount,
      deposit: depositAmount,
      tax: taxAmount,
      discount: 0,
      total: totalAmount,
      paymentStatus: 'Paid',
      status: 'Active',
      paymentMethod: formData.paymentMethod,
      notes: formData.pickupRemarks,

      // Workflow: Pickup Handover Information
      pickupDateTime: `${formData.startDate}T${new Date().toTimeString().slice(0, 5)}:00`,
      pickupOdometer: Number(formData.pickupOdometer),
      pickupFuelLevel: formData.pickupFuelLevel,
      pickupCondition: formData.pickupCondition,
      pickupRemarks: formData.pickupRemarks,

      // Workflow: Rental Terms
      weeklyRent: weeklyRate,
      paymentDueDay: formData.paymentDueDay,
      securityDeposit: depositAmount,
      mileageAllowance: Number(formData.mileageAllowance) || 1200,
      excessMileageRate: Number(formData.excessMileageRate) || 0.25,

      // Workflow: Agreement Information (Ready for Task 4)
      agreementStatus: 'Awaiting Signature',
      agreementData: {
        owner: 'PrimeRoute Fleet Operations',
        representativeName: 'John Doe (Administrator)',
        renter: selectedDriver.name,
        driverName: selectedDriver.name,
        license: selectedDriver.license,
        driverLicense: selectedDriver.license,
        phone: selectedDriver.phone,
        driverPhone: selectedDriver.phone,
        email: selectedDriver.email,
        driverEmail: selectedDriver.email,
        vehicleYear: selectedVehicle.year,
        vehicleMake: selectedVehicle.make,
        vehicleModel: selectedVehicle.model,
        vehicleColor: selectedVehicle.color,
        vin: selectedVehicle.vin,
        vehicleVin: selectedVehicle.vin,
        plate: selectedVehicle.plate,
        vehiclePlate: selectedVehicle.plate,
        pickupOdometer: Number(formData.pickupOdometer),
        pickupFuelLevel: formData.pickupFuelLevel,
        startDate: formData.startDate,
        endDate: formData.endDate,
        weeklyRent: weeklyRate,
        paymentDueDay: formData.paymentDueDay,
        securityDeposit: depositAmount
      },
      driverSignature: null,
      representativeSignature: null,
      signedAt: null,
      agreementId: agreementId,

      // Workflow: Return Information
      returnDateTime: null,
      returnOdometer: null,
      returnFuelLevel: null,
      returnCondition: null,
      returnRemarks: null,
      returnStatus: 'Pending Return'
    };

    // 1. Update vehicle status to Rented and assign driver
    updateVehicleStatus(selectedVehicle.id, 'Rented', selectedDriver.name);

    // 2. Update driver's assigned vehicle in Driver store
    updateDriverVehicle(
      selectedDriver.id,
      `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.plate})`
    );

    // 3. Log Check-out (Pickup) Handover Inspection
    if (addInspection) {
      const inspectionId = `INS-${Date.now()}`;
      addInspection({
        id: inspectionId,
        inspectionNumber: `INSP-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'Check-out (Pickup)',
        contractId: newRentalId,
        vehicle: `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.plate})`,
        vehicleId: selectedVehicle.id,
        plate: selectedVehicle.plate,
        driver: selectedDriver.name,
        driverId: selectedDriver.id,
        date: formData.startDate,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        odometer: Number(formData.pickupOdometer),
        fuelLevel: formData.pickupFuelLevel,
        exteriorCondition: formData.pickupCondition,
        interiorCondition: 'Clean & Sanitized',
        tiresCondition: 'Good (Verified)',
        windshieldStatus: 'Clear / Intact',
        spareTirePresent: true,
        inspector: 'John Doe (Admin)',
        status: 'Passed',
        notes: formData.pickupRemarks,
        driverSignature: selectedDriver.name,
        photos: []
      });
    }

    // 4. Save new rental into shared state
    if (onSave) {
      onSave(newRentalRecord);
    } else {
      saveRental(newRentalRecord);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Vehicle Handover & Pickup"
      subtitle="Authorized Administrator Dispatch: Assign vehicle, verify handover metrics, and issue lease terms"
      maxWidth="max-w-4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Banner Alert */}
        <div className="bg-gradient-to-r from-[#071D49] to-[#0D2D6C] text-white p-4 rounded-2xl flex items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0">
              <KeyRound className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Live Administrator Dispatch Console</h4>
              <p className="text-xs text-blue-200">
                Completing this pickup will immediately mark the vehicle as <strong>Rented</strong> and generate an active rental record.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold rounded-lg shrink-0">
            {availableVehicles.length} Vehicles Available
          </span>
        </div>

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
                className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl transition-all focus:outline-none focus:ring-2 ${
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
              <div className="bg-white p-3.5 rounded-xl border border-blue-200/80 shadow-sm flex items-center gap-3.5 animate-fade-in">
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
              <Car className="w-4 h-4 text-[#075EE8]" /> 2. Vehicle Selection &amp; Handover Gauge
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
                className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl transition-all focus:outline-none focus:ring-2 ${
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
              <div className="bg-white p-3.5 rounded-xl border border-blue-200/80 shadow-sm flex items-center gap-3.5 animate-fade-in">
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
                      className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
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

        {/* Section 3: Rental Schedule & Financial Terms */}
        <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <h4 className="text-xs font-bold text-[#0A1E42] uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#075EE8]" /> 3. Rental Period &amp; Financial Terms
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <FormInput
              label="Pickup / Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              required
              error={errors.startDate}
            />

            <FormInput
              label="Estimated End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              required
              error={errors.endDate}
            />

            <FormInput
              label="Weekly Rent ($)"
              name="weeklyRent"
              type="number"
              value={formData.weeklyRent}
              onChange={handleChange}
              placeholder="450"
              required
              error={errors.weeklyRent}
            />

            <div>
              <FormInput
                label="Refundable Security Deposit ($)"
                name="securityDeposit"
                type="number"
                value={formData.securityDeposit}
                onChange={handleChange}
                placeholder="300"
                required
                error={errors.securityDeposit}
              />
              <span className="text-[11px] text-blue-600 block mt-1 font-medium">
                Standard Agreement Section 9: $300
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-200/60">
            <FormInput
              label="Payment Due Terms"
              name="paymentDueDay"
              value={formData.paymentDueDay}
              onChange={handleChange}
              placeholder="e.g. Every Monday by 5:00 PM"
              required
            />

            <FormSelect
              label="Payment Method"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              options={['Corporate ACH', 'Credit Card', 'Bank Wire', 'Cash / POS']}
            />

            <FormInput
              label="Mileage Allowance (Miles / Wk)"
              name="mileageAllowance"
              type="number"
              value={formData.mileageAllowance}
              onChange={handleChange}
              placeholder="1200"
            />
          </div>
        </div>

        {/* Section 4: Vehicle Condition & Remarks */}
        <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <h4 className="text-xs font-bold text-[#0A1E42] uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#075EE8]" /> 4. Handover Condition &amp; Special Remarks
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <FormSelect
                label="Vehicle Condition at Pickup"
                name="pickupCondition"
                value={formData.pickupCondition}
                onChange={handleChange}
                options={[
                  'Pristine / No visible damage',
                  'Clean & Sanitized',
                  'Minor surface wear (documented)',
                  'Custom assessment'
                ]}
              />
            </div>

            <div className="sm:col-span-2">
              <FormTextarea
                label="Handover Notes / Accessories Issued"
                name="pickupRemarks"
                value={formData.pickupRemarks}
                onChange={handleChange}
                placeholder="Notes on keys, toll transponder ID, spare tire, or driver requests..."
              />
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#075EE8] hover:bg-[#0650C7] text-xs font-bold text-white shadow-md shadow-blue-500/25 transition-all active:scale-95 duration-150 cursor-pointer"
          >
            <KeyRound className="w-4 h-4" /> Save Pickup
          </button>
        </div>
      </form>
    </Modal>
  );
}

