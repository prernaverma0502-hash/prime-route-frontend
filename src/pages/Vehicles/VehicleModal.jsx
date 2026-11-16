import React, { useState, useEffect } from 'react';
import { AlertCircle, Car, Shield, DollarSign, MapPin, User, FileText, Sparkles, RefreshCw } from 'lucide-react';
import Modal from '../../components/common/Modal';
import { FormInput, FormSelect, FormTextarea } from '../../components/forms/FormInputs';
import { useFleet } from '../../context/FleetContext';
import { isValidVin, isDuplicateVin } from '../../utils/validators';

const CONTROLLED_STATUSES = [
  'Available',
  'Reserved',
  'Rented',
  'Maintenance',
  'Unavailable',
  'Sold/Retired',
];

const VEHICLE_TYPES = ['Sedan', 'SUV', 'Truck', 'Electric', 'Luxury'];
const FUEL_TYPES = ['Gasoline', 'Electric', 'Hybrid', 'Diesel'];
const TRANSMISSION_TYPES = ['Automatic', 'Manual'];
const FLEET_LOCATIONS = [
  'JFK Airport Fleet Hub',
  'Manhattan Downtown Depot',
  'Newark Logistics Center',
  'Brooklyn Fleet Yard',
  'Queens Service Hub',
];
const FINANCING_TYPES = [
  'Financed (Bank Loan)',
  'Commercial Capital Lease',
  'Cash Purchase (Owned Outright)',
];


export function generateUniqueVin(existingVehicles = []) {
  const existingVins = new Set((existingVehicles || []).map((v) => (v.vin || '').toUpperCase().trim()));
  const chars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789'; // Valid VIN characters (no I, O, Q)
  let candidate = '';
  let attempts = 0;
  do {
    let suffix = '';
    for (let i = 0; i < 6; i++) {
      suffix += chars[Math.floor(Math.random() * chars.length)];
    }
    candidate = `4T1B11HK8RU${suffix}`;
    attempts++;
  } while (existingVins.has(candidate) && attempts < 100);
  return candidate;
}

export default function VehicleModal({
  isOpen,
  onClose,
  onSave,
  vehicle = null,
}) {
  const { vehicles, drivers } = useFleet();
  const isEditing = !!vehicle;

  const defaultForm = {
    id: '',
    name: 'Toyota Camry SE',
    plate: 'PR-2025-09',
    make: 'Toyota',
    model: 'Camry SE',
    year: 2024,
    color: 'Midnight Blue',
    mileage: '18,500 mi',
    vin: '',
    purchaseDate: '2024-01-15',
    purchasePrice: 28500,
    financingType: 'Financed (Bank Loan)',
    lenderName: 'Chase Commercial Fleet Financing',
    loanAmount: 24000,
    monthlyPayment: 460,
    loanTermMonths: 48,
    status: 'Available',
    location: 'JFK Airport Fleet Hub',
    depotLocation: 'JFK Airport Fleet Hub',
    driver: 'Unassigned',
    dailyRate: 65,
    type: 'Sedan',
    fuel: 'Gasoline',
    transmission: 'Automatic',
    insuranceExpiry: '2025-11-30',
    registrationExpiry: '2025-10-31',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&auto=format&fit=crop&q=80',
    notes: '',
  };

  const [formData, setFormData] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (vehicle) {
      setFormData({
        ...defaultForm,
        ...vehicle,
        location: vehicle.location || vehicle.depotLocation || 'JFK Airport Fleet Hub',
        depotLocation: vehicle.depotLocation || vehicle.location || 'JFK Airport Fleet Hub',
        purchaseDate: vehicle.purchaseDate || '2024-01-15',
        purchasePrice: vehicle.purchasePrice || 28500,
        lenderName: vehicle.lenderName || 'Chase Commercial Fleet Financing',
        loanAmount: vehicle.loanAmount || 24000,
        monthlyPayment: vehicle.monthlyPayment || 460,
        loanTermMonths: vehicle.loanTermMonths || 48,
      });
      setErrors({});
    } else if (isOpen) {
      // Auto-generate next unique ID
      const existingIds = (vehicles || []).map((v) => v.id).filter(Boolean);
      let nextNum = 1;
      while (existingIds.includes(`VEH-${String(nextNum).padStart(3, '0')}`)) {
        nextNum++;
      }
      const uniquePlate = `PR-2025-${String(nextNum).padStart(2, '0')}`;
      const uniqueVin = generateUniqueVin(vehicles);

      setFormData({
        ...defaultForm,
        id: `VEH-${String(nextNum).padStart(3, '0')}`,
        plate: uniquePlate,
        vin: uniqueVin,
        name: 'Toyota Camry SE',
        make: 'Toyota',
        model: 'Camry SE',
      });
      setErrors({});
    }
  }, [vehicle, isOpen, vehicles]);

  
  const handleGenerateVin = () => {
    const freshVin = generateUniqueVin(vehicles);
    setFormData((prev) => ({ ...prev, vin: freshVin }));
    if (errors.vin) {
      setErrors((prev) => ({ ...prev, vin: null }));
    }
  };

  const handleAutoFillSample = () => {
    const existingIds = (vehicles || []).map((v) => v.id).filter(Boolean);
    let nextNum = 1;
    while (existingIds.includes(`VEH-${String(nextNum).padStart(3, '0')}`)) {
      nextNum++;
    }
    const samples = [
      { make: 'Toyota', model: 'Camry SE', type: 'Sedan', rate: 65, color: 'Midnight Blue' },
      { make: 'Honda', model: 'Accord Sport', type: 'Sedan', rate: 70, color: 'Platinum White' },
      { make: 'Chevrolet', model: 'Tahoe Premier', type: 'SUV', rate: 110, color: 'Shadow Gray' },
      { make: 'Tesla', model: 'Model 3 Long Range', type: 'Electric', rate: 95, color: 'Deep Blue Metallic' },
      { make: 'Ford', model: 'F-150 SuperCrew', type: 'Truck', rate: 90, color: 'Oxford White' },
    ];
    const picked = samples[Math.floor(Math.random() * samples.length)];
    const uniquePlate = `PR-2025-${String(nextNum).padStart(2, '0')}`;
    const uniqueVin = generateUniqueVin(vehicles);

    setFormData((prev) => ({
      ...prev,
      id: prev.id || `VEH-${String(nextNum).padStart(3, '0')}`,
      make: picked.make,
      model: picked.model,
      name: `${picked.make} ${picked.model}`,
      type: picked.type,
      color: picked.color,
      dailyRate: picked.rate,
      plate: uniquePlate,
      vin: uniqueVin,
      purchasePrice: 28500,
      status: 'Available',
    }));
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // Auto-generate display name if make and model are updated
      if (name === 'make' || name === 'model') {
        const mk = name === 'make' ? value : prev.make;
        const md = name === 'model' ? value : prev.model;
        if (mk && md) {
          updated.name = `${mk} ${md}`.trim();
        }
      }
      if (name === 'location') {
        updated.depotLocation = value;
      }
      return updated;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // 1. Vehicle ID Validation & Uniqueness
    if (!formData.id?.trim()) {
      newErrors.id = 'Vehicle ID is required.';
    } else {
      const idUpper = formData.id.trim().toUpperCase();
      const duplicateId = (vehicles || []).find(
        (v) => v.id?.toUpperCase() === idUpper && v.id !== vehicle?.id
      );
      if (duplicateId) {
        newErrors.id = `Vehicle ID "${formData.id}" already exists. Each vehicle must have a unique ID.`;
      }
    }

    // 2. VIN Validation (17 chars, no I, O, Q) & Duplicate Check
    const cleanVin = (formData.vin || '').toUpperCase().trim();
    if (!cleanVin) {
      newErrors.vin = 'VIN number is required.';
    } else if (cleanVin.length !== 17) {
      newErrors.vin = `VIN must be exactly 17 characters (currently ${cleanVin.length}).`;
    } else if (!isValidVin(cleanVin)) {
      newErrors.vin = 'Invalid VIN format. Standard VINs cannot contain letters I, O, or Q.';
    } else if (isDuplicateVin(cleanVin, vehicles, vehicle?.id)) {
      const existingMatch = vehicles.find(
        (v) => v.vin?.toUpperCase() === cleanVin && v.id !== vehicle?.id
      );
      newErrors.vin = `Duplicate VIN Blocked: VIN is already registered to "${existingMatch?.name || 'another vehicle'}" (${existingMatch?.plate || 'Unknown Plate'}). Duplicate VINs are strictly prohibited.`;
    }

    // 3. License Plate
    if (!formData.plate?.trim()) {
      newErrors.plate = 'License plate is required.';
    }

    // 4. Make & Model
    if (!formData.make?.trim()) newErrors.make = 'Make is required.';
    if (!formData.model?.trim()) newErrors.model = 'Model is required.';

    // 5. Purchase details
    if (!formData.purchasePrice || Number(formData.purchasePrice) <= 0) {
      newErrors.purchasePrice = 'Valid purchase price is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Build payload
    const payload = {
      ...formData,
      id: formData.id.trim().toUpperCase(),
      vin: formData.vin.trim().toUpperCase(),
      plate: formData.plate.trim().toUpperCase(),
      year: Number(formData.year) || 2024,
      purchasePrice: Number(formData.purchasePrice) || 0,
      dailyRate: Number(formData.dailyRate) || 65,
      loanAmount: Number(formData.loanAmount) || 0,
      monthlyPayment: Number(formData.monthlyPayment) || 0,
      loanTermMonths: Number(formData.loanTermMonths) || 48,
    };

    onSave(payload);
    onClose();
  };

  // Compile driver options
  const driverOptions = [
    'Unassigned',
    ...Array.from(new Set((drivers || []).map((d) => d.name).filter(Boolean))),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Vehicle: ${vehicle.name}` : 'Add New Fleet Vehicle'}
      subtitle="Complete vehicle registry, acquisition, financing, and operational assignment"
      maxWidth="max-w-4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Top Error Alert Banner if validation failed */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start gap-3 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Please correct the highlighted errors before saving:</p>
              <ul className="list-disc pl-4 mt-1 space-y-0.5 text-rose-700">
                {Object.values(errors).map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Section 1: Identification & Basic Specs */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1E42] flex items-center gap-1.5 pb-1 border-b border-slate-100">
            <Car className="w-3.5 h-3.5 text-[#075EE8]" /> 1. Vehicle Identification &amp; Specifications
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
            <div>
              <FormInput
                label="Unique Vehicle ID"
                name="id"
                value={formData.id}
                onChange={handleChange}
                placeholder="e.g. VEH-001"
                required
              />
              {errors.id && <p className="text-[11px] text-rose-600 font-semibold mt-1">{errors.id}</p>}
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  VIN (17 Characters Required) <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleGenerateVin}
                  className="text-[11px] font-bold text-[#075EE8] hover:text-[#0650C7] hover:underline flex items-center gap-1 cursor-pointer"
                  title="Generate a valid unique 17-character VIN"
                >
                  <Sparkles className="w-3 h-3 text-[#075EE8]" />
                  <span>Auto-Generate Valid VIN</span>
                </button>
              </div>
              <input
                type="text"
                name="vin"
                value={formData.vin}
                onChange={handleChange}
                placeholder="e.g. 4T1B11HK8RU918273"
                maxLength={17}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono uppercase transition-all focus:outline-none focus:ring-2 focus:ring-[#075EE8] ${
                  errors.vin ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-white'
                }`}
                required
              />
              {errors.vin && <p className="text-[11px] text-rose-600 font-semibold mt-1">{errors.vin}</p>}
            </div>

            <div>
              <FormInput
                label="License Plate"
                name="plate"
                value={formData.plate}
                onChange={handleChange}
                placeholder="e.g. PR-2024-TC"
                required
              />
              {errors.plate && <p className="text-[11px] text-rose-600 font-semibold mt-1">{errors.plate}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
            <div>
              <FormInput
                label="Make"
                name="make"
                value={formData.make}
                onChange={handleChange}
                placeholder="e.g. Toyota"
                required
              />
              {errors.make && <p className="text-[11px] text-rose-600 font-semibold mt-1">{errors.make}</p>}
            </div>

            <div>
              <FormInput
                label="Model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g. Camry SE"
                required
              />
              {errors.model && <p className="text-[11px] text-rose-600 font-semibold mt-1">{errors.model}</p>}
            </div>

            <div>
              <FormInput
                label="Model Year"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleChange}
                min={2000}
                max={2030}
                required
              />
            </div>

            <div>
              <FormInput
                label="Exterior Color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="e.g. Midnight Blue"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <FormSelect
              label="Vehicle Category / Body Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={VEHICLE_TYPES}
            />

            <FormInput
              label="Current Odometer / Mileage"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              placeholder="e.g. 18,500 mi"
              required
            />

            <FormInput
              label="Daily Rental Rate ($/day)"
              name="dailyRate"
              type="number"
              value={formData.dailyRate}
              onChange={handleChange}
              min={1}
              required
            />
          </div>
        </div>

        {/* Section 2: Acquisition & Financing Details */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1E42] flex items-center gap-1.5 pb-1 border-b border-slate-100">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> 2. Purchase &amp; Financing Details
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            <div>
              <FormInput
                label="Purchase Date"
                name="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <FormInput
                label="Purchase Price ($)"
                name="purchasePrice"
                type="number"
                value={formData.purchasePrice}
                onChange={handleChange}
                min={1}
                required
              />
              {errors.purchasePrice && (
                <p className="text-[11px] text-rose-600 font-semibold mt-1">{errors.purchasePrice}</p>
              )}
            </div>

            <div>
              <FormSelect
                label="Acquisition / Financing Type"
                name="financingType"
                value={formData.financingType}
                onChange={handleChange}
                options={FINANCING_TYPES}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <FormInput
                label="Lender / Financial Institution"
                name="lenderName"
                value={formData.lenderName}
                onChange={handleChange}
                placeholder="e.g. Chase Commercial Fleet Financing"
              />
            </div>

            <div>
              <FormInput
                label="Financed Loan Amount ($)"
                name="loanAmount"
                type="number"
                value={formData.loanAmount}
                onChange={handleChange}
                placeholder="e.g. 24000"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <FormInput
                label="Monthly Payment ($)"
                name="monthlyPayment"
                type="number"
                value={formData.monthlyPayment}
                onChange={handleChange}
                placeholder="e.g. 460"
              />
              <FormInput
                label="Term (Months)"
                name="loanTermMonths"
                type="number"
                value={formData.loanTermMonths}
                onChange={handleChange}
                placeholder="e.g. 48"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Operational Status & Driver Assignment */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1E42] flex items-center gap-1.5 pb-1 border-b border-slate-100">
            <Shield className="w-3.5 h-3.5 text-purple-600" /> 3. Operational Status &amp; Driver Assignment
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Status (Controlled List) */}
            <div>
              <FormSelect
                label="Fleet Operational Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={CONTROLLED_STATUSES}
                required
              />
              <p className="text-[10px] text-slate-400 mt-1">Controlled enterprise status</p>
            </div>

            {/* Location */}
            <div>
              <FormSelect
                label="Operational Location / Hub"
                name="location"
                value={formData.location}
                onChange={handleChange}
                options={FLEET_LOCATIONS}
                required
              />
            </div>

            {/* Assigned Driver */}
            <div>
              <FormSelect
                label="Assigned Driver"
                name="driver"
                value={formData.driver}
                onChange={handleChange}
                options={driverOptions}
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Reassigning preserves previous audit history
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormInput
              label="Commercial Insurance Policy Expiry"
              name="insuranceExpiry"
              type="date"
              value={formData.insuranceExpiry}
              onChange={handleChange}
            />
            <FormInput
              label="DMV Vehicle Registration Expiry"
              name="registrationExpiry"
              type="date"
              value={formData.registrationExpiry}
              onChange={handleChange}
            />
          </div>

          <FormTextarea
            label="Internal Operational Remarks / Notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="e.g. Equipped with high-speed transponder E-ZPass #004-98124 and commercial speed governor."
            rows={2}
          />
        </div>

        {/* Bottom error summary so user never misses errors on scroll */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center gap-2 text-rose-800 text-xs font-bold">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Please complete all highlighted required fields above to create the vehicle.</span>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 flex-wrap gap-2">
          {!isEditing ? (
            <button
              type="button"
              onClick={handleAutoFillSample}
              className="px-3.5 py-2 rounded-xl bg-blue-50 text-[#075EE8] hover:bg-blue-100 text-xs font-bold border border-blue-200 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto-fill Sample Vehicle</span>
            </button>
          ) : <div />}

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Car className="w-4 h-4" />
              <span>{isEditing ? 'Save Vehicle Changes' : 'Create Fleet Vehicle'}</span>
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
