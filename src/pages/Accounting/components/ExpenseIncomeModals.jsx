import React from 'react';
import Modal from '../../../components/common/Modal';
import { FormInput, FormSelect } from '../../../components/forms/FormInputs';

export default function ExpenseIncomeModals({
  isExpenseModalOpen,
  onCloseExpenseModal,
  newExpense,
  setNewExpense,
  onAddExpense,
  isIncomeModalOpen,
  onCloseIncomeModal,
  newIncome,
  setNewIncome,
  onAddIncome,
}) {
  return (
    <>
      {/* Add Expense Modal */}
      <Modal
        isOpen={isExpenseModalOpen}
        onClose={onCloseExpenseModal}
        title="Log Operating Fleet Expense"
        maxWidth="max-w-md"
      >
        <form onSubmit={onAddExpense} className="space-y-4">
          <FormSelect
            label="Category"
            name="category"
            value={newExpense.category}
            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
            options={['Fleet Fuel', 'Vehicle Maintenance', 'Insurance', 'Tolls & Violations', 'Telematics & GPS']}
          />
          <FormInput
            label="Description"
            name="description"
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            placeholder="e.g. Synthetic oil & fluid change"
            required
          />
          <FormInput
            label="Vehicle Reference"
            name="vehicle"
            value={newExpense.vehicle}
            onChange={(e) => setNewExpense({ ...newExpense, vehicle: e.target.value })}
            placeholder="Vehicle plate or 'Fleet Wide'"
          />
          <FormInput
            label="Vendor / Supplier"
            name="vendor"
            value={newExpense.vendor}
            onChange={(e) => setNewExpense({ ...newExpense, vendor: e.target.value })}
            placeholder="Vendor name"
            required
          />
          <FormInput
            label="Amount ($)"
            name="amount"
            type="number"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            placeholder="0.00"
            required
          />
          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={onCloseExpenseModal}
              className="px-4 py-2 border rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold shadow cursor-pointer"
            >
              Save Expense
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Income Modal */}
      <Modal
        isOpen={isIncomeModalOpen}
        onClose={onCloseIncomeModal}
        title="Record Fleet Income"
        maxWidth="max-w-md"
      >
        <form onSubmit={onAddIncome} className="space-y-4">
          <FormInput
            label="Income Category"
            name="source"
            value={newIncome.source}
            onChange={(e) => setNewIncome({ ...newIncome, source: e.target.value })}
            placeholder="Vehicle Rental Lease"
            required
          />
          <FormInput
            label="Customer / Source"
            name="customer"
            value={newIncome.customer}
            onChange={(e) => setNewIncome({ ...newIncome, customer: e.target.value })}
            placeholder="Apex Logistics LLC"
            required
          />
          <FormInput
            label="Amount ($)"
            name="amount"
            type="number"
            value={newIncome.amount}
            onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
            placeholder="0.00"
            required
          />
          <FormSelect
            label="Payment Method"
            name="paymentMethod"
            value={newIncome.paymentMethod}
            onChange={(e) => setNewIncome({ ...newIncome, paymentMethod: e.target.value })}
            options={['Corporate ACH', 'Credit Card', 'Bank Wire', 'Cash']}
          />
          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={onCloseIncomeModal}
              className="px-4 py-2 border rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#075EE8] text-white rounded-xl text-xs font-semibold shadow cursor-pointer"
            >
              Record Income
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

