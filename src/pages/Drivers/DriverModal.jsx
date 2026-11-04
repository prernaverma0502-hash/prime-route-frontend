import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import { FormInput, FormSelect, FormTextarea, FileUpload } from '../../components/forms/FormInputs';

export default function DriverModal({
  isOpen,
  onClose,
  onSave,
  driver = null,
  availableVehicles = []
}) {
  const isEditing = !!driver;

  const initialForm = {
    name: '',
    phone: '',
    email: '',
    address: '',
    dob: '1990-01-01',
    license: '',
    licenseExpiry: '2027-01-01',
    joiningDate: '2024-01-01',
    emergencyContact: '',
    vehicle: 'Unassigned',
    salaryRate: '$2,400/mo',
    status: 'Active',
    balance: 0,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    notes: '',
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (driver) {
      setFormData(driver);
    } else {
      setFormData(initialForm);
    }
  }, [driver, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: formData.id || `DRV-10${Math.floor(Math.random() * 90 + 10)}`,
      rating: formData.rating || 5.0,
      tripsCount: formData.tripsCount || 0,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Driver: ${driver.name}` : 'Register New Fleet Driver'}
      subtitle="Complete profile, official commercial license, and vehicle assignment"
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <FormInput
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Marcus Vance"
            required
          />

          <FormInput
            label="Contact Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            required
          />

          <FormInput
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="driver@primeroute.io"
            required
          />

          <FormInput
            label="Driving License No."
            name="license"
            value={formData.license}
            onChange={handleChange}
            placeholder="DL-NY-1928301"
            required
          />

          <FormInput
            label="License Expiry Date"
            name="licenseExpiry"
            type="date"
            value={formData.licenseExpiry}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Date of Birth"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
          />

          <FormInput
            label="Joining Date"
            name="joiningDate"
            type="date"
            value={formData.joiningDate}
            onChange={handleChange}
          />

          <FormSelect
            label="Driver Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={['Active', 'Inactive', 'On Leave']}
          />

          <FormInput
            label="Assigned Vehicle"
            name="vehicle"
            value={formData.vehicle}
            onChange={handleChange}
            placeholder="Toyota Camry SE (PR-2024-TC)"
          />

          <FormInput
            label="Monthly Salary / Compensation"
            name="salaryRate"
            value={formData.salaryRate}
            onChange={handleChange}
            placeholder="$2,400/mo"
          />

          <FormInput
            label="Outstanding Balance ($)"
            name="balance"
            type="number"
            value={formData.balance}
            onChange={handleChange}
            placeholder="0"
          />

          <FormInput
            label="Emergency Contact & Phone"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleChange}
            placeholder="Name & Contact number"
          />
        </div>

        <FormInput
          label="Residential Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Street address, City, State, ZIP"
        />

        <FormInput
          label="Profile Photo URL"
          name="avatar"
          value={formData.avatar}
          onChange={handleChange}
          placeholder="Profile avatar image link"
        />

        <FileUpload label="Upload Driver License Scan / Background Clearance (Optional)" />

        <FormTextarea
          label="Notes & Certification History"
          name="notes"
          value={formData.notes || ''}
          onChange={handleChange}
          placeholder="Clean driving record, DOT medical clearance, hazmat endorsement..."
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
            {isEditing ? 'Update Driver' : 'Save Driver'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

