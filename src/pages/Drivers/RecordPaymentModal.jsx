import React, { useState, useEffect } from 'react';
import { DollarSign, CreditCard, CheckCircle2, ShieldCheck } from 'lucide-react';
import Modal from '../../components/common/Modal';
import { FormInput, FormSelect, FormTextarea } from '../../components/forms/FormInputs';
import { formatCurrency } from '../../utils/formatters';

const PAYMENT_METHODS = [
  'Corporate ACH Direct Debit',
  'Credit Card (Visa / Mastercard)',
  'Cash Settlement at Hub',
  'Electronic Bank Wire',
  'Escrow Deposit Deduction',
];

export default function RecordPaymentModal({
  isOpen,
  onClose,
  driver,
  onSavePayment,
}) {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && driver) {
      setAmount(String(driver.balance || ''));
      setPaymentMethod(PAYMENT_METHODS[0]);
      setReference(`PAY-${Math.floor(Math.random() * 900000 + 100000)}`);
      setNotes('Overdue account balance settlement collection');
      setError('');
    }
  }, [isOpen, driver]);

  if (!isOpen || !driver) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (isNaN(num) || num <= 0) {
      setError('Please enter a valid positive payment amount.');
      return;
    }

    onSavePayment({
      driverId: driver.id,
      amount: num,
      paymentMethod,
      reference,
      notes,
      date: new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Driver Account Payment"
      subtitle={`Driver: ${driver.name} (ID: ${driver.id}) • Current Outstanding: ${formatCurrency(driver.balance)}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-center justify-between text-xs">
          <span className="text-slate-600 font-medium">Delinquent Account Balance:</span>
          <span className="font-mono font-black text-rose-600 text-sm">
            {formatCurrency(driver.balance)}
          </span>
        </div>

        <FormInput
          label="Payment Amount ($)"
          type="number"
          name="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          min={1}
          required
        />

        <FormSelect
          label="Payment Method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          options={PAYMENT_METHODS}
          required
        />

        <FormInput
          label="Payment Reference / Receipt ID"
          name="reference"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          required
        />

        <FormTextarea
          label="Accounting Ledger Remarks"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5 text-white" />
            <span>Apply Payment</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}

