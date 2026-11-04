import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import { FormInput, FormSelect, FormTextarea, FileUpload } from '../../components/forms/FormInputs';
import { initialVehicles } from '../../data/mockData';

export default function VehicleModal({
  isOpen,
  onClose,
  onSave,
  vehicle = null
}) {
  const isEditing = !!vehicle;

  const initialForm = {
    name: '',
    plate: '',
    make: '',
    model: '',
    year: 2024,
    type: 'Sedan',
    fuel: 'Gasoline',
    transmission: 'Automatic',
    color: 'Midnight Blue',
    mileage: '15,000 mi',
    vin: '',
    purchasePrice: 28000,
    dailyRate: 65,
    status: 'Available',
    driver: 'Unassigned',
    depotLocation: 'JFK Airport Fleet Hub',
    financingType: 'Financed (Bank Loan)',
    lenderName: 'Chase Commercial Fleet Financing',
    monthlyPayment: 460,
    loanTermMonths: 48,
    insuranceExpiry: '2026-01-01',
    registrationExpiry: '2026-01-01',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&auto=format&fit=crop&q=80',
    notes: '',
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (vehicle) {
      setFormData(vehicle);
    } else {
      setFormData(initialForm);
    }
  }, [vehicle, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: formData.id || `VEH-00${Math.floor(Math.random() * 900 + 100)}`,
    });
    onClose();
  };

  const duplicateMatch = formData.vin
    ? initialVehicles.find(
        (v) =>
          v.vin &&
          v.vin.trim().toLowerCase() === formData.vin.trim().toLowerCase() &&
          v.id !== formData.id
      )
    : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Vehicle: ${vehicle.name}` : 'Add New Fleet Vehicle'}
      subtitle="Complete fleet vehicle profile and registration details"
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <FormInput
            label="Vehicle Name / Display Title"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Toyota Camry SE"
            required
          />

          <FormInput
            label="License Plate / Reg Number"
            name="plate"
            value={formData.plate}
            onChange={handleChange}
            placeholder="e.g. PR-2024-TC"
            required
          />

          <FormSelect
            label="Vehicle Category"
            name="type"
            value={formData.type}
            onChange={handleChange}
            options={['Sedan', 'SUV', 'Truck', 'Electric', 'Luxury', 'Van']}
          />

          <FormInput
            label="Make (Manufacturer)"
            name="make"
            value={formData.make}
            onChange={handleChange}
            placeholder="e.g. Toyota"
            required
          />

          <FormInput
            label="Model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="e.g. Camry"
            required
          />

          <FormInput
            label="Manufacturing Year"
            name="year"
            type="number"
            value={formData.year}
            onChange={handleChange}
            min="2015"
            max="2026"
            required
          />

          <FormSelect
            label="Fuel Type"
            name="fuel"
            value={formData.fuel}
            onChange={handleChange}
            options={['Gasoline', 'Hybrid', 'Electric', 'Diesel']}
          />

          <FormSelect
            label="Transmission"
            name="transmission"
            value={formData.transmission}
            onChange={handleChange}
            options={['Automatic', 'Manual', 'Dual-Clutch']}
          />

          <FormInput
            label="Exterior Color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            placeholder="e.g. Alpine White"
          />

          <FormInput
            label="Current Mileage"
            name="mileage"
            value={formData.mileage}
            onChange={handleChange}
            placeholder="e.g. 24,500 mi"
          />

          <div>
            <FormInput
              label="VIN Number (17-Characters)"
              name="vin"
              value={formData.vin}
              onChange={handleChange}
              placeholder="17-character VIN"
              required
            />
            {duplicateMatch && (
              <p className="text-[10px] font-bold text-rose-600 mt-1 flex items-center gap-1 animate-fade-in bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                <span>⚠️ Duplicate VIN:</span>
                <span className="truncate">Matches {duplicateMatch.name} ({duplicateMatch.plate})</span>
              </p>
            )}
          </div>

          <FormInput
            label="Purchase Price ($)"
            name="purchasePrice"
            type="number"
            value={formData.purchasePrice}
            onChange={handleChange}
            placeholder="28000"
          />

          <FormInput
            label="Daily Rental Rate ($)"
            name="dailyRate"
            type="number"
            value={formData.dailyRate}
            onChange={handleChange}
            placeholder="65"
          />

          <FormSelect
            label="Fleet Operational Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={['Available', 'Reserved', 'Rented', 'Maintenance', 'Unavailable', 'Sold/Retired']}
          />

          <FormSelect
            label="Depot / Physical Yard Location"
            name="depotLocation"
            value={formData.depotLocation}
            onChange={handleChange}
            options={['JFK Airport Fleet Hub', 'Manhattan Central Depot', 'Newark Logistics Yard', 'Brooklyn Operations Base']}
          />

          <FormInput
            label="Assigned Driver"
            name="driver"
            value={formData.driver}
            onChange={handleChange}
            placeholder="Driver name or Unassigned"
          />

          <FormInput
            label="Insurance Expiry Date"
            name="insuranceExpiry"
            type="date"
            value={formData.insuranceExpiry}
            onChange={handleChange}
          />

          <FormInput
            label="Registration Expiry Date"
            name="registrationExpiry"
            type="date"
            value={formData.registrationExpiry}
            onChange={handleChange}
          />

          <FormInput
            label="Vehicle Image URL"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Image web URL"
          />
        </div>

        {/* Vehicle Financing & Acquisition Ledger */}
        <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
          <h4 className="text-xs font-bold text-[#0A1E42] uppercase tracking-wider flex items-center justify-between">
            <span>Asset Financing &amp; Purchase Details</span>
            <span className="text-[10px] text-slate-400 font-normal">Asset ID: {formData.id || 'PR-AUTO'}</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <FormSelect
              label="Purchase / Ownership Type"
              name="financingType"
              value={formData.financingType}
              onChange={handleChange}
              options={['Cash Purchase (Owned)', 'Financed (Bank Loan)', 'Commercial Lease']}
            />
            <FormInput
              label="Lender / Finance Bank"
              name="lenderName"
              value={formData.lenderName}
              onChange={handleChange}
              placeholder="e.g. JPMorgan Fleet Finance"
            />
            <FormInput
              label="Monthly Payment / EMI ($)"
              name="monthlyPayment"
              type="number"
              value={formData.monthlyPayment}
              onChange={handleChange}
              placeholder="460"
            />
            <FormInput
              label="Loan Term (Months)"
              name="loanTermMonths"
              type="number"
              value={formData.loanTermMonths}
              onChange={handleChange}
              placeholder="48"
            />
          </div>
        </div>

        <FileUpload label="Upload Vehicle Inspection / Title Document (Optional)" />

        <FormTextarea
          label="Internal Notes & Equipment Specs"
          name="notes"
          value={formData.notes || ''}
          onChange={handleChange}
          placeholder="Special options, tire conditions, fleet telematics ID, toll transponder tag..."
        />

        <div className="sticky -bottom-4 sm:-bottom-6 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3.5 bg-white/95 backdrop-blur-md border-t border-slate-100 flex items-center justify-end gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.03)] z-10 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#075EE8] hover:bg-[#0650C7] text-sm font-semibold text-white shadow-md transition-all active:scale-98 cursor-pointer"
          >
            {isEditing ? 'Update Vehicle' : 'Save Vehicle'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

