import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import { FormInput, FormSelect, FormTextarea, FileUpload } from '../../components/forms/FormInputs';

export default function MaintenanceModal({
  isOpen,
  onClose,
  onSave,
  record = null
}) {
  const isEditing = !!record;

  const initialForm = {
    vehicle: 'Toyota Camry SE',
    plate: 'PR-2024-TC',
    category: 'Oil & Filter',
    type: 'Synthetic Oil Change (0W-20)',
    serviceDate: new Date().toISOString().split('T')[0],
    nextServiceDate: '2025-11-15',
    mileage: '25,000 mi',
    provider: 'QuickLube Express Center',
    cost: 85,
    status: 'Scheduled',
    notes: 'Includes 21-point safety inspection.'
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (record) {
      setFormData(record);
    } else {
      setFormData(initialForm);
    }
  }, [record, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: formData.id || `MNT-${Math.floor(Math.random() * 900 + 100)}`,
      cost: Number(formData.cost) || 0
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Maintenance: ${record.id}` : 'Schedule Vehicle Maintenance'}
      subtitle="Log scheduled service, workshop provider, and repair estimates"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Vehicle Name"
            name="vehicle"
            value={formData.vehicle}
            onChange={handleChange}
            placeholder="Toyota Camry SE"
            required
          />

          <FormInput
            label="License Plate"
            name="plate"
            value={formData.plate}
            onChange={handleChange}
            placeholder="PR-2024-TC"
            required
          />

          <FormSelect
            label="Maintenance Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={[
              'Oil & Filter',
              'Brakes & Suspension',
              'Engine & Transmission',
              'Tires & Alignment',
              'Air Conditioning',
              'Electrical & Telematics',
              'Routine Inspection'
            ]}
          />

          <FormInput
            label="Specific Service Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="e.g. Brake pad replacement"
            required
          />

          <FormInput
            label="Service Provider / Garage"
            name="provider"
            value={formData.provider}
            onChange={handleChange}
            placeholder="Speedy Pro Auto Clinic"
            required
          />

          <FormInput
            label="Estimated / Invoiced Cost ($)"
            name="cost"
            type="number"
            value={formData.cost}
            onChange={handleChange}
            placeholder="150"
            required
          />

          <FormInput
            label="Current Odometer Mileage"
            name="mileage"
            value={formData.mileage}
            onChange={handleChange}
            placeholder="25,000 mi"
          />

          <FormSelect
            label="Job Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={['Scheduled', 'In Progress', 'Completed', 'Overdue']}
          />

          <FormInput
            label="Service Date"
            name="serviceDate"
            type="date"
            value={formData.serviceDate}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Next Service Due Date"
            name="nextServiceDate"
            type="date"
            value={formData.nextServiceDate}
            onChange={handleChange}
          />
        </div>

        <FileUpload label="Attach Mechanic Invoice / Diagnostic Report (Optional)" />

        <FormTextarea
          label="Technician Notes & Replaced Parts"
          name="notes"
          value={formData.notes || ''}
          onChange={handleChange}
          placeholder="OEM part numbers, warranty notes, fluid levels..."
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
            {isEditing ? 'Update Record' : 'Schedule Service'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

