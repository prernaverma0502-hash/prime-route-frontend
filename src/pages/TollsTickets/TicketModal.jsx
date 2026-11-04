import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import { FormInput, FormSelect, FormTextarea, FileUpload } from '../../components/forms/FormInputs';

export default function TicketModal({
  isOpen,
  onClose,
  onSave,
  ticket = null
}) {
  const isEditing = !!ticket;

  const initialForm = {
    ticketNumber: '',
    vehicle: 'Hyundai Sonata SEL (PR-2024-HS)',
    driver: 'Sarah Jenkins',
    type: 'Parking Violation',
    date: new Date().toISOString().split('T')[0],
    dueDate: '2025-08-10',
    location: '45th St & 7th Ave, Manhattan',
    fineAmount: 75,
    status: 'Unpaid',
    notes: 'Issued by Department of Transportation.'
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (ticket) {
      setFormData(ticket);
    } else {
      setFormData(initialForm);
    }
  }, [ticket, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: formData.id || `TCK-${Math.floor(Math.random() * 9000 + 1000)}`,
      fineAmount: Number(formData.fineAmount) || 0
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Citation: ${ticket.ticketNumber || ticket.id}` : 'Record Traffic Violation / Ticket'}
      subtitle="Input municipality violation notice and assign responsible driver"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Citation / Notice ID Number"
            name="ticketNumber"
            value={formData.ticketNumber}
            onChange={handleChange}
            placeholder="e.g. NYC-PARK-901824"
            required
          />

          <FormSelect
            label="Violation Category"
            name="type"
            value={formData.type}
            onChange={handleChange}
            options={[
              'Parking Violation',
              'Speed Camera Infraction',
              'Red Light Violation',
              'Bus Lane Infraction',
              'Toll Evasion',
              'Expired Meter'
            ]}
          />

          <FormInput
            label="Vehicle Reference"
            name="vehicle"
            value={formData.vehicle}
            onChange={handleChange}
            placeholder="Toyota Camry (PR-2024-TC)"
            required
          />

          <FormInput
            label="Driver Operating at Time"
            name="driver"
            value={formData.driver}
            onChange={handleChange}
            placeholder="Sarah Jenkins"
            required
          />

          <FormInput
            label="Fine Amount ($)"
            name="fineAmount"
            type="number"
            value={formData.fineAmount}
            onChange={handleChange}
            placeholder="75"
            required
          />

          <FormSelect
            label="Payment Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={['Unpaid', 'Paid', 'Disputed']}
          />

          <FormInput
            label="Violation Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Payment Due Date"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
        </div>

        <FormInput
          label="Infraction Location / Intersection"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g. 45th St & 7th Ave, Manhattan"
          required
        />

        <FileUpload label="Upload Notice PDF / Photo of Ticket Citation (Optional)" />

        <FormTextarea
          label="Notes &amp; Dispute Details"
          name="notes"
          value={formData.notes || ''}
          onChange={handleChange}
          placeholder="Details on whether fine should be billed to driver or company..."
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
            {isEditing ? 'Update Notice' : 'Save Notice'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

