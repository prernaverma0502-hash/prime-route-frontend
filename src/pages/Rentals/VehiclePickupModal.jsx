import React, { useState, useEffect, useMemo } from 'react';
import {
  KeyRound,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import { useFleet } from '../../context/FleetContext';
import PickupVehicleDriverSection from './components/PickupVehicleDriverSection';
import PickupTermsSection from './components/PickupTermsSection';

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
  const [photos, setPhotos] = useState([]);

  const [formData, setFormData] = useState({
    startDate: todayStr,
    pickupTime: '09:00',
    endDate: defaultEndStr,
    weeklyRent: '450',
    paymentDueDay: 'Every Monday',
    securityDeposit: '500',
    pickupOdometer: '',
    pickupFuelLevel: 'Full (100%)',
    pickupExterior: 'Pristine / No visible damage',
    pickupInterior: 'Clean & Sanitized',
    pickupRemarks: 'Standard commercial rental handover. Keys, transponder, and vehicle manual handed over.',
    hasExistingDamage: false,
    existingDamageNotes: '',
    keysHandedOver: true,
    driverAcknowledged: true,
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
      setPhotos([]);
      setFormData({
        startDate: new Date().toISOString().split('T')[0],
        pickupTime: '09:00',
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        weeklyRent: '450',
        paymentDueDay: 'Every Monday',
        securityDeposit: '500',
        pickupOdometer: '',
        pickupFuelLevel: 'Full (100%)',
        pickupExterior: 'Pristine / No visible damage',
        pickupInterior: 'Clean & Sanitized',
        pickupRemarks: 'Standard commercial rental handover. Keys, transponder, and vehicle manual handed over.',
        hasExistingDamage: false,
        existingDamageNotes: '',
        keysHandedOver: true,
        driverAcknowledged: true,
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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

    if (!formData.keysHandedOver) {
      newErrors.keysHandedOver = 'Verification of keys and transponder handover is required.';
    }

    if (!formData.driverAcknowledged) {
      newErrors.driverAcknowledged = 'Driver acknowledgment of handover metrics is mandatory.';
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
    const depositAmount = Number(formData.securityDeposit) || 500;
    const taxAmount = Math.round(baseAmount * 0.08);
    const totalAmount = baseAmount + taxAmount;

    const newRentalId = `RNT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const agreementId = `AGR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const combinedPickupCondition = `${formData.pickupExterior} • Interior: ${formData.pickupInterior}${
      formData.hasExistingDamage && formData.existingDamageNotes
        ? ` (Existing Wear: ${formData.existingDamageNotes})`
        : ''
    }`;

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

      pickupDateTime: `${formData.startDate}T${formData.pickupTime || '09:00'}:00`,
      pickupOdometer: Number(formData.pickupOdometer),
      pickupFuelLevel: formData.pickupFuelLevel,
      pickupCondition: combinedPickupCondition,
      pickupRemarks: formData.pickupRemarks,
      existingDamage: formData.hasExistingDamage ? formData.existingDamageNotes : 'None documented',
      pickupPhotos: photos,

      weeklyRent: weeklyRate,
      paymentDueDay: formData.paymentDueDay,
      securityDeposit: depositAmount,
      mileageAllowance: Number(formData.mileageAllowance) || 1200,
      excessMileageRate: Number(formData.excessMileageRate) || 0.25,

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

      returnDateTime: null,
      returnOdometer: null,
      returnFuelLevel: null,
      returnCondition: null,
      returnRemarks: null,
      returnStatus: 'Pending Return'
    };

    updateVehicleStatus(selectedVehicle.id, 'Rented', selectedDriver.name);

    updateDriverVehicle(
      selectedDriver.id,
      `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.plate})`
    );

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
        time: formData.pickupTime || '09:00 AM',
        odometer: Number(formData.pickupOdometer),
        fuelLevel: formData.pickupFuelLevel,
        exteriorCondition: formData.pickupExterior,
        interiorCondition: formData.pickupInterior,
        tiresCondition: 'Good (Verified)',
        windshieldStatus: 'Clear / Intact',
        spareTirePresent: true,
        inspector: 'John Doe (Admin)',
        status: 'Passed',
        notes: `${formData.pickupRemarks} ${formData.hasExistingDamage ? `| Pre-existing Wear: ${formData.existingDamageNotes}` : ''}`,
        driverSignature: selectedDriver.name,
        photos: photos
      });
    }

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

        {/* Section 1 & 2: Driver & Vehicle Selection */}
        <PickupVehicleDriverSection
          selectedDriverId={selectedDriverId}
          setSelectedDriverId={setSelectedDriverId}
          selectedDriver={selectedDriver}
          activeDrivers={activeDrivers}
          selectedVehicleId={selectedVehicleId}
          setSelectedVehicleId={setSelectedVehicleId}
          selectedVehicle={selectedVehicle}
          availableVehicles={availableVehicles}
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          setErrors={setErrors}
          odometerWarning={odometerWarning}
          allowLowerOdometer={allowLowerOdometer}
          setAllowLowerOdometer={setAllowLowerOdometer}
        />

        {/* Section 3 & 4: Terms, Conditions, Photos, Keys & Driver Acknowledgment */}
        <PickupTermsSection
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          photos={photos}
          setPhotos={setPhotos}
        />

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
