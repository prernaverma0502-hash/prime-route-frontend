import React, { useState } from 'react';
import Modal from '../../components/common/Modal';
import { FormInput, FormSelect, FormTextarea } from '../../components/forms/FormInputs';

export default function InvoiceModal({
  isOpen,
  onClose,
  onSave
}) {
  const [invoice, setInvoice] = useState({
    customer: '',
    rentalId: 'RNT-2025-095',
    vehicle: 'Toyota Camry SE (PR-2024-TC)',
    date: new Date().toISOString().split('T')[0],
    dueDate: '2025-08-15',
    subtotal: 1850,
    tax: 148,
    discount: 0,
    total: 1998,
    status: 'Pending',
    paymentMethod: 'Credit Card',
    notes: 'Net 15 payment terms apply.'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoice((prev) => {
      const updated = { ...prev, [name]: value };
      const sub = Number(updated.subtotal) || 0;
      const tx = Number(updated.tax) || 0;
      const disc = Number(updated.discount) || 0;
      updated.total = Math.max(0, sub + tx - disc);
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...invoice,
      id: `INV-2025-${Math.floor(Math.random() * 900 + 100)}`
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Commercial Fleet Invoice"
      subtitle="Generate formal tax invoice for leasing or corporate services"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Client / Organization"
            name="customer"
            value={invoice.customer}
            onChange={handleChange}
            placeholder="e.g. Paramount Logistics Inc."
            required
          />

          <FormInput
            label="Associated Rental ID"
            name="rentalId"
            value={invoice.rentalId}
            onChange={handleChange}
            placeholder="RNT-2025-095"
            required
          />

          <FormInput
            label="Vehicle Description"
            name="vehicle"
            value={invoice.vehicle}
            onChange={handleChange}
            placeholder="Vehicle model & plate"
            required
          />

          <FormSelect
            label="Payment Status"
            name="status"
            value={invoice.status}
            onChange={handleChange}
            options={['Pending', 'Paid', 'Overdue']}
          />

          <FormInput
            label="Invoice Date"
            name="date"
            type="date"
            value={invoice.date}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Due Date"
            name="dueDate"
            type="date"
            value={invoice.dueDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <FormInput
            label="Subtotal ($)"
            name="subtotal"
            type="number"
            value={invoice.subtotal}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Tax ($)"
            name="tax"
            type="number"
            value={invoice.tax}
            onChange={handleChange}
          />
          <FormInput
            label="Discount ($)"
            name="discount"
            type="number"
            value={invoice.discount}
            onChange={handleChange}
          />
          <div>
            <label className="text-xs font-semibold text-slate-700">Grand Total</label>
            <div className="h-10 mt-1.5 flex items-center px-3 font-extrabold text-[#075EE8] bg-blue-50/70 border border-blue-200 rounded-xl text-sm">
              ${invoice.total}
            </div>
          </div>
        </div>

        <FormTextarea
          label="Payment Terms &amp; Wire Routing Instructions"
          name="notes"
          value={invoice.notes}
          onChange={handleChange}
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
            Issue Invoice
          </button>
        </div>
      </form>
    </Modal>
  );
}

