import React, { useState, useEffect, useMemo } from 'react';
import {
  AlertTriangle,
  Upload,
  FileText,
  X,
  CheckCircle2,
  Calendar,
  Building2,
  DollarSign,
  User,
  ShieldCheck,
  Tag,
  Paperclip
} from 'lucide-react';
import Modal from '../../../components/common/Modal';
import { FormInput, FormSelect, FormTextarea } from '../../../components/forms/FormInputs';

// The 16 Controlled Categories (Admin-managed controlled list)
export const EXPENSE_CATEGORIES = [
  { id: 'insurance', label: 'Insurance (Commercial & Liability)' },
  { id: 'registration', label: 'Registration & Tag Renewal' },
  { id: 'oil change', label: 'Oil Change & Synthetic Fluids' },
  { id: 'repairs', label: 'Repairs & Mechanical Overhaul' },
  { id: 'tires', label: 'Tires & Wheel Alignment' },
  { id: 'towing', label: 'Towing & Roadside Recovery' },
  { id: 'cleaning', label: 'Cleaning & Turnaround Detailing' },
  { id: 'tolls', label: 'Tolls & E-ZPass Gateway' },
  { id: 'parking', label: 'Parking & Depot Storage' },
  { id: 'tickets', label: 'Tickets & Traffic Violations' },
  { id: 'marketing', label: 'Marketing & Driver Acquisition' },
  { id: 'software', label: 'Software & Telematics Cloud' },
  { id: 'bank fees', label: 'Bank Fees & Merchant Processing' },
  { id: 'office', label: 'Office Facilities & Admin Supplies' },
  { id: 'legal/accounting', label: 'Legal & Certified Accounting' },
  { id: 'other', label: 'Other Operating Miscellaneous' },
];

const PAYMENT_METHODS = [
  'Corporate ACH',
  'Credit Card',
  'Debit Card',
  'Company Fuel Card',
  'Bank Wire',
  'Company Check',
  'Auto-Debit Escrow',
];

const APPROVERS = [
  'Sarah Jenkins (Finance Controller)',
  'John Doe (Owner / Primary Admin)',
  'Operations Director (Secondary Admin)',
  'Marcus Brody (Fleet Lead)',
];

export default function ExpenseModal({
  isOpen,
  onClose,
  onSaveExpense,
  existingExpenses = [],
  vehicles = [],
  drivers = [],
  vendors = [],
  currentUser = { name: 'John Doe (Admin)' }
}) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'repairs',
    vehicle: 'Fleet Wide',
    relatedDriver: 'None / Fleet Wide',
    vendor: 'Speedy Pro Auto Clinic',
    invoiceNumber: '',
    description: '',
    amount: '',
    paymentMethod: 'Corporate ACH',
    paymentStatus: 'Paid',
    invoiceReceiptUpload: null,
    receiptFileName: '',
    receiptFileSize: '',
    enteredBy: currentUser?.name || 'John Doe (Admin)',
    approver: 'Sarah Jenkins (Finance Controller)',
    notes: '',
  });

  const [receiptPreview, setReceiptPreview] = useState(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        category: 'repairs',
        vehicle: 'Fleet Wide',
        relatedDriver: 'None / Fleet Wide',
        vendor: vendors[0]?.name || 'Speedy Pro Auto Clinic',
        invoiceNumber: '',
        description: '',
        amount: '',
        paymentMethod: 'Corporate ACH',
        paymentStatus: 'Paid',
        invoiceReceiptUpload: null,
        receiptFileName: '',
        receiptFileSize: '',
        enteredBy: currentUser?.name || 'John Doe (Admin)',
        approver: 'Sarah Jenkins (Finance Controller)',
        notes: '',
      });
      setReceiptPreview(null);
    }
  }, [isOpen, vendors, currentUser]);

  // Requirement 4: Duplicate Invoice Warning Engine
  // Triggered if same vendor + invoice number, or same vendor + amount + date
  const duplicateWarning = useMemo(() => {
    if (!formData.vendor || (!formData.invoiceNumber && !formData.amount)) return null;

    const trimmedVendor = formData.vendor.trim().toLowerCase();
    const trimmedInvoice = formData.invoiceNumber.trim().toLowerCase();
    const numAmount = Number(formData.amount);

    for (const exp of existingExpenses) {
      const expVendor = (exp.vendor || '').trim().toLowerCase();
      if (expVendor !== trimmedVendor) continue;

      // Condition 1: Same vendor + Same invoice number
      if (trimmedInvoice && exp.invoiceNumber && exp.invoiceNumber.trim().toLowerCase() === trimmedInvoice) {
        return {
          id: exp.id,
          vendor: exp.vendor,
          description: exp.description || exp.category,
          amount: exp.amount,
          date: exp.date,
          matchReason: `matching invoice number "${formData.invoiceNumber}" ($${Number(exp.amount).toLocaleString()})`,
        };
      }

      // Condition 2: Same vendor + Same amount + Same date
      if (numAmount > 0 && Number(exp.amount) === numAmount && exp.date === formData.date) {
        return {
          id: exp.id,
          vendor: exp.vendor,
          description: exp.description || exp.category,
          amount: exp.amount,
          date: exp.date,
          matchReason: `identical amount ($${numAmount.toLocaleString()}) on ${formData.date}`,
        };
      }
    }
    return null;
  }, [formData.vendor, formData.invoiceNumber, formData.amount, formData.date, existingExpenses]);

  // Handle simulated receipt file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        receiptFileName: file.name,
        receiptFileSize: `${(file.size / 1024).toFixed(1)} KB`,
        invoiceReceiptUpload: file.name,
      }));
      setReceiptPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveReceipt = () => {
    setFormData((prev) => ({
      ...prev,
      receiptFileName: '',
      receiptFileSize: '',
      invoiceReceiptUpload: null,
    }));
    setReceiptPreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.vendor || !formData.amount || !formData.description) return;

    const selectedCat = EXPENSE_CATEGORIES.find((c) => c.id === formData.category);

    const newExpenseRecord = {
      id: `EXP-${Math.floor(1000 + Math.random() * 9000)}`,
      date: formData.date,
      category: formData.category,
      displayCategory: selectedCat ? selectedCat.label.split(' (')[0] : formData.category,
      vehicle: formData.vehicle,
      relatedDriver: formData.relatedDriver,
      contractId: formData.relatedDriver.includes('(')
        ? formData.relatedDriver.split('(')[1]?.replace(')', '')
        : 'N/A',
      vendor: formData.vendor,
      invoiceNumber: formData.invoiceNumber || `INV-${Math.floor(10000 + Math.random() * 90000)}`,
      description: formData.description,
      amount: Number(formData.amount),
      paymentMethod: formData.paymentMethod,
      paymentStatus: formData.paymentStatus,
      invoiceReceiptUrl: formData.receiptFileName || 'receipt_scanned.pdf',
      enteredBy: formData.enteredBy,
      approver: formData.approver,
      status: formData.paymentStatus === 'Pending Approval' ? 'Pending' : 'Approved',
      approvedBy: formData.paymentStatus === 'Paid' ? formData.approver : null,
      approvalDate: formData.paymentStatus === 'Paid' ? formData.date : null,
      notes: formData.notes,
    };

    onSaveExpense(newExpenseRecord);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Fleet & Operating Expense"
      subtitle="Complete accounting entry with category code, vendor reference, receipt voucher, and duplicate audit"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Requirement 4: Duplicate Invoice Warning Banner */}
        {duplicateWarning && (
          <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-3 text-xs text-amber-950 animate-fade-in shadow-2xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-extrabold text-amber-900 flex items-center gap-1.5">
                <span>⚠️ Potential Duplicate Expense Detected</span>
                <span className="font-mono text-[10px] bg-amber-200/80 px-2 py-0.5 rounded text-amber-900">
                  {duplicateWarning.id}
                </span>
              </p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                An existing entry from <strong className="text-amber-950">{duplicateWarning.vendor}</strong> with{' '}
                <strong className="underline">{duplicateWarning.matchReason}</strong> is already recorded in the system.
                Please verify you are not double-entering this invoice before saving.
              </p>
            </div>
          </div>
        )}

        {/* Row 1: Date & Controlled Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Expense Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8] font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Category (Controlled Dictionary) <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8] font-medium"
              required
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Vehicle & Driver/Contract */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Target Vehicle / Fleet Scope
            </label>
            <select
              value={formData.vehicle}
              onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8]"
            >
              <option value="Fleet Wide">Fleet Wide / General Overhead</option>
              {vehicles.map((v) => (
                <option key={v.id} value={`${v.make} ${v.model} (${v.plate || v.id})`}>
                  {v.year} {v.make} {v.model} ({v.plate || v.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Related Driver / Contract
            </label>
            <select
              value={formData.relatedDriver}
              onChange={(e) => setFormData({ ...formData, relatedDriver: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8]"
            >
              <option value="None / Fleet Wide">None / Fleet Wide</option>
              {drivers.map((d) => (
                <option key={d.id} value={`${d.name} (${d.id})`}>
                  {d.name} ({d.id})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3: Vendor & Invoice Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Vendor / Payee <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              list="vendor-suggestions"
              value={formData.vendor}
              onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
              placeholder="Select or enter vendor name"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8] font-medium"
              required
            />
            <datalist id="vendor-suggestions">
              {vendors.map((v) => (
                <option key={v.id} value={v.name} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Vendor Invoice / Bill #
            </label>
            <input
              type="text"
              value={formData.invoiceNumber}
              onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
              placeholder="e.g. SPD-99201 or INV-4891"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8] font-mono"
            />
          </div>
        </div>

        {/* Row 4: Description & Amount */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description of Expense <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Front ceramic brake pads and rotor resurfacing"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8]"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Amount ($ USD) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                className="w-full pl-7 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8] font-mono font-bold text-[#0A1E42]"
                required
              />
            </div>
          </div>
        </div>

        {/* Row 5: Payment Method & Payment Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Payment Method
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8]"
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Payment / Authorization Status
            </label>
            <select
              value={formData.paymentStatus}
              onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8]"
            >
              <option value="Paid">Paid / Settled</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Unpaid">Unpaid / Open AP Bill</option>
            </select>
          </div>
        </div>

        {/* Row 6: Entered By & Approver */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Entered By (Originator)
            </label>
            <input
              type="text"
              value={formData.enteredBy}
              onChange={(e) => setFormData({ ...formData, enteredBy: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Designated Approver
            </label>
            <select
              value={formData.approver}
              onChange={(e) => setFormData({ ...formData, approver: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8]"
            >
              {APPROVERS.map((app) => (
                <option key={app} value={app}>
                  {app}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 7: Receipt / Invoice Voucher Upload */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Invoice / Receipt Upload</span>
            <span className="text-[10px] text-slate-400 font-normal">PDF, PNG, JPG (up to 10MB)</span>
          </label>

          {formData.receiptFileName ? (
            <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-[#075EE8]" />
                <div>
                  <p className="font-bold text-[#071D49]">{formData.receiptFileName}</p>
                  <p className="text-[10px] text-slate-500">{formData.receiptFileSize} • Attached Voucher</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveReceipt}
                className="p-1 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer transition-colors"
                title="Remove attachment"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-slate-200 hover:border-[#075EE8] rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-blue-50/30 transition-all">
              <Upload className="w-5 h-5 text-slate-400 mb-1" />
              <p className="text-xs font-semibold text-slate-700">Click to upload vendor invoice or receipt</p>
              <p className="text-[10px] text-slate-400">Attach scanned voucher or photo</p>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Row 8: Notes */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Accounting Notes / Internal Remarks
          </label>
          <textarea
            rows="2"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Add any internal approval references, PO numbers, or inspection notes..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8]"
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/20 transition-all cursor-pointer active:scale-95 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save &amp; Log Expense</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}

