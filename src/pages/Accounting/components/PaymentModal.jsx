import React, { useState, useEffect } from 'react';
import { DollarSign, CheckCircle2, ShieldCheck, CreditCard } from 'lucide-react';
import Modal from '../../../components/common/Modal';
import { FormInput, FormSelect, FormTextarea } from '../../../components/forms/FormInputs';
import { formatCurrency } from '../../../utils/formatters';

export default function PaymentModal({
  isOpen,
  onClose,
  onSavePayment,
  drivers = [],
  rentals = [],
  initialDriver = ''
}) {
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    driver: '',
    rental: '',
    date: todayStr,
    dueDate: todayStr,
    method: 'Corporate ACH',
    referenceNumber: '',
    status: 'Paid',
    amount: '',
    notes: 'Commercial lease remittance received.'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      const randomRef = `REF-${Math.floor(100000 + Math.random() * 900000)}`;
      const selectedDriver = initialDriver || (drivers[0]?.name || '');
      // Find active rental for driver if any
      const matchingRental = rentals.find((r) => r.driver === selectedDriver || r.customer === selectedDriver);

      setFormData({
        driver: selectedDriver,
        rental: matchingRental ? matchingRental.id : (rentals[0]?.id || 'RNT-2024-089'),
        date: todayStr,
        dueDate: todayStr,
        method: 'Corporate ACH',
        referenceNumber: randomRef,
        status: 'Paid',
        amount: '487.50',
        notes: 'Commercial lease remittance received.'
      });
      setErrors({});
    }
  }, [isOpen, initialDriver, drivers, rentals, todayStr]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleDriverSelect = (e) => {
    const dName = e.target.value;
    const matchingRental = rentals.find((r) => r.driver === dName || r.customer === dName);
    setFormData((prev) => ({
      ...prev,
      driver: dName,
      rental: matchingRental ? matchingRental.id : prev.rental
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.driver) errs.driver = 'Driver is required.';
    if (!formData.amount || Number(formData.amount) <= 0) errs.amount = 'Valid positive amount is required.';
    if (!formData.referenceNumber) errs.referenceNumber = 'Reference number is required.';
    if (!formData.date) errs.date = 'Payment date is required.';
    if (!formData.dueDate) errs.dueDate = 'Due date is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const receiptNo = `REC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newPayment = {
      id: `PMT-${Date.now().toString().slice(-6)}`,
      driver: formData.driver,
      rental: formData.rental,
      rentalId: formData.rental,
      date: formData.date,
      dueDate: formData.dueDate,
      method: formData.method,
      refNumber: formData.referenceNumber,
      referenceNumber: formData.referenceNumber,
      status: formData.status,
      amount: Number(formData.amount),
      notes: formData.notes,
      receiptNo: receiptNo,
      syncStatus: 'Pending Sync to QBO'
    };

    onSavePayment(newPayment);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Driver Lease Payment"
      subtitle="Enter received remittance, reference transaction ID, and generate printable receipt"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Authorized Driver <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.driver}
              onChange={handleDriverSelect}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8]"
              required
            >
              <option value="">-- Select driver --</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name} ({d.id})
                </option>
              ))}
            </select>
            {errors.driver && <span className="text-xs text-rose-500 mt-0.5 block">{errors.driver}</span>}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Associated Rental Contract <span className="text-rose-500">*</span>
            </label>
            <select
              name="rental"
              value={formData.rental}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8]"
              required
            >
              <option value="">-- Select contract reference --</option>
              {rentals.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.id} — {r.vehicle} ({r.driver || r.customer})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormInput
            label="Payment Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
            error={errors.date}
          />

          <FormInput
            label="Invoice Due Date"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            required
            error={errors.dueDate}
          />

          <FormInput
            label="Amount Received ($)"
            name="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            placeholder="487.50"
            required
            error={errors.amount}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormSelect
            label="Payment Method"
            name="method"
            value={formData.method}
            onChange={handleChange}
            options={[
              'Corporate ACH',
              'Credit Card',
              'Debit Card',
              'Bank Wire',
              'Check',
              'Cash / POS'
            ]}
          />

          <FormInput
            label="Reference / Check #"
            name="referenceNumber"
            value={formData.referenceNumber}
            onChange={handleChange}
            placeholder="e.g. ACH-902814"
            required
            error={errors.referenceNumber}
          />

          <FormSelect
            label="Payment Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={['Paid', 'Partial', 'Overdue']}
          />
        </div>

        <FormTextarea
          label="Internal Accounting Notes / Allocation"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Notes on ACH clearance, invoice coverage, or late fees..."
          rows={2}
        />

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#075EE8] hover:bg-[#0650C7] text-xs font-bold text-white shadow-md shadow-blue-500/25 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" /> Save Payment &amp; Issue Receipt
          </button>
        </div>
      </form>
    </Modal>
  );
}

