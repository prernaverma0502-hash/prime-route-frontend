import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import { FormInput, FormSelect, FormTextarea } from '../../components/forms/FormInputs';

export default function RentalModal({
  isOpen,
  onClose,
  onSave,
  rental = null
}) {
  const isEditing = !!rental;

  const initialForm = {
    customer: '',
    customerPhone: '+1 (555) 000-0000',
    customerEmail: 'client@domain.com',
    vehicle: 'Toyota Camry SE (PR-2024-TC)',
    driver: 'Marcus Vance',
    startDate: '2025-08-01',
    endDate: '2025-08-15',
    rentalType: 'Monthly Lease',
    pickupLocation: 'JFK Airport Fleet Hub',
    dropoffLocation: 'Manhattan Financial Center',
    amount: 1950,
    deposit: 500,
    mileageAllowance: 1200,
    excessMileageRate: 0.25,
    tax: 156,
    discount: 50,
    total: 2056,
    paymentStatus: 'Paid',
    status: 'Active',
    paymentMethod: 'Corporate ACH',
    notes: 'Commercial lease contract.',
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (rental) {
      setFormData(rental);
    } else {
      setFormData(initialForm);
    }
  }, [rental, isOpen]);

  // Recalculate total
  useEffect(() => {
    const sub = Number(formData.amount) || 0;
    const tx = Number(formData.tax) || 0;
    const disc = Number(formData.discount) || 0;
    setFormData((prev) => ({
      ...prev,
      total: Math.max(0, sub + tx - disc),
    }));
  }, [formData.amount, formData.tax, formData.discount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: formData.id || `RNT-2025-0${Math.floor(Math.random() * 90 + 10)}`,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Rental: ${rental.id}` : 'Create Vehicle Rental Agreement'}
      subtitle="Issue vehicle lease contract, calculate charges, and set schedule"
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <FormInput
            label="Customer / Company Name"
            name="customer"
            value={formData.customer}
            onChange={handleChange}
            placeholder="e.g. Apex Logistics LLC"
            required
          />

          <FormInput
            label="Customer Phone"
            name="customerPhone"
            value={formData.customerPhone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            required
          />

          <FormInput
            label="Customer Email"
            name="customerEmail"
            type="email"
            value={formData.customerEmail}
            onChange={handleChange}
            placeholder="billing@customer.com"
          />

          <FormInput
            label="Assigned Vehicle"
            name="vehicle"
            value={formData.vehicle}
            onChange={handleChange}
            placeholder="Toyota Camry (PR-2024-TC)"
            required
          />

          <FormInput
            label="Assigned Chauffeur / Driver"
            name="driver"
            value={formData.driver}
            onChange={handleChange}
            placeholder="Marcus Vance"
          />

          <FormSelect
            label="Lease Agreement Type"
            name="rentalType"
            value={formData.rentalType}
            onChange={handleChange}
            options={['Daily Rental', 'Weekly Rental', 'Monthly Lease', 'Executive VIP', 'Long Term Lease']}
          />

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

          <FormSelect
            label="Rental Contract Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={['Draft', 'Awaiting Signature', 'Active', 'Renewed', 'Terminated', 'Completed']}
          />

          <FormInput
            label="Mileage Allowance (miles/wk)"
            name="mileageAllowance"
            type="number"
            value={formData.mileageAllowance}
            onChange={handleChange}
            placeholder="1200"
          />

          <FormInput
            label="Excess Mileage Rate ($/mi)"
            name="excessMileageRate"
            type="number"
            step="0.05"
            value={formData.excessMileageRate}
            onChange={handleChange}
            placeholder="0.25"
          />

          <FormInput
            label="Pickup Location"
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleChange}
            placeholder="Hub name or address"
          />

          <FormInput
            label="Drop-off Location"
            name="dropoffLocation"
            value={formData.dropoffLocation}
            onChange={handleChange}
            placeholder="Return depot"
          />

          <FormSelect
            label="Payment Method"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            options={['Credit Card', 'Corporate ACH', 'Bank Wire', 'Cash / POS', 'Invoice Net 30']}
          />
        </div>

        {/* Overbooking / Availability Warning */}
        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center gap-2.5 text-xs text-amber-800">
          <span className="text-base">⚠️</span>
          <div>
            <p className="font-bold">Automated Fleet Conflict Check Active</p>
            <p className="text-[11px] text-amber-700">PrimeRoute validates start and end dates against existing active contracts and maintenance blackout windows.</p>
          </div>
        </div>

        {/* Pricing & Fees breakdown */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <h4 className="text-xs font-bold text-[#0A1E42] mb-3 uppercase tracking-wider">
            Financial Terms &amp; Calculation
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <FormInput
              label="Base Rate ($)"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Deposit ($)"
              name="deposit"
              type="number"
              value={formData.deposit}
              onChange={handleChange}
            />
            <FormInput
              label="Tax ($)"
              name="tax"
              type="number"
              value={formData.tax}
              onChange={handleChange}
            />
            <FormInput
              label="Discount ($)"
              name="discount"
              type="number"
              value={formData.discount}
              onChange={handleChange}
            />
            <div>
              <label className="text-xs font-semibold text-slate-700">Total Billable</label>
              <div className="h-10 mt-1.5 flex items-center px-3 font-extrabold text-[#075EE8] bg-blue-50/70 border border-blue-200 rounded-xl text-sm">
                ${formData.total}
              </div>
            </div>
          </div>
        </div>

        <FormTextarea
          label="Contract Terms &amp; Special Instructions"
          name="notes"
          value={formData.notes || ''}
          onChange={handleChange}
          placeholder="Fuel policy, toll reimbursement terms, mileage limits..."
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#075EE8] hover:bg-[#0650C7] text-sm font-semibold text-white shadow-md transition-all"
          >
            {isEditing ? 'Update Agreement' : 'Generate Agreement'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

