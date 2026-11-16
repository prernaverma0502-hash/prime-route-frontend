import React, { useState } from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Car,
  Star,
  ShieldCheck,
  AlertCircle,
  Edit2,
  Archive,
  Eye,
  EyeOff,
  ClipboardCheck,
  Receipt,
  ShieldAlert,
  FileSpreadsheet,
  Lock,
  Download,
  AlertTriangle,
  Clock,
  DollarSign,
  FileText,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import DriverStatementModal from './DriverStatementModal';
import { useRole } from '../../context/RoleContext';
import { shouldMaskDriverData } from '../../auth/permissions';
import { maskLicense, maskDob, maskAddress } from '../../utils/masking';
import Can from '../../auth/Can';
import {
  getDriverRentals,
  getDriverPayments,
  getDriverBalance,
  getDriverInspections,
  getDriverAccidents,
  getDriverTollsAndTickets,
  getDriverContracts,
  getDriverDocuments,
} from './driverDataHelpers';

export default function DriverDetailsModal({
  isOpen,
  onClose,
  driver,
  onEdit,
  onArchive,
  onDelete,
  onRecordPayment,
}) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isStatementOpen, setIsStatementOpen] = useState(false);
  const [showSensitive, setShowSensitive] = useState(false);
  const [activeDocPreview, setActiveDocPreview] = useState(null);

  const { currentRoleId } = useRole();
  const shouldMask = shouldMaskDriverData(currentRoleId);

  if (!isOpen || !driver) return null;

  // Retrieve rich sub-tab models
  const rentals = getDriverRentals(driver);
  const payments = getDriverPayments(driver);
  const balanceData = getDriverBalance(driver);
  const inspections = getDriverInspections(driver);
  const accidents = getDriverAccidents(driver);
  const tollsAndTickets = getDriverTollsAndTickets(driver);
  const contracts = getDriverContracts(driver);
  const documents = getDriverDocuments(driver);

  // Masked representations
  const displayLicense = shouldMask
    ? maskLicense(driver.license)
    : showSensitive
    ? driver.license
    : `${driver.license?.slice(0, 5) || 'DL-NY'}••••••`;

  const displayAddress = shouldMask
    ? maskAddress(driver.address || '142 W 57th St, New York, NY 10019')
    : (driver.address || '142 W 57th St, New York, NY 10019');

  const displayDob = shouldMask
    ? maskDob(driver.dob || '1990-05-14')
    : (driver.dob || '1990-05-14');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'rentals', label: 'Current and Previous Rentals', icon: Car, count: rentals.length },
    { id: 'payments', label: 'Payment History', icon: CreditCard, count: payments.length },
    { id: 'balance', label: 'Balance', icon: DollarSign },
    { id: 'inspections', label: 'Inspections', icon: ClipboardCheck, count: inspections.length },
    { id: 'accidents', label: 'Accidents', icon: ShieldAlert, count: accidents.length },
    { id: 'tolls', label: 'Tolls and Tickets', icon: Receipt, count: tollsAndTickets.length },
    { id: 'contracts', label: 'Contract History', icon: FileSpreadsheet, count: contracts.length },
    { id: 'documents', label: 'Documents', icon: FileText, count: documents.length },
  ];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={driver.name}
        subtitle={`Driver ID: ${driver.id} • License: ${displayLicense} (${driver.licenseState || 'NY'})`}
        maxWidth="max-w-5xl"
      >
        <div className="space-y-5">
          {/* Top Banner Card */}
          <div className="bg-gradient-to-r from-[#071D49] via-[#0A2763] to-[#0D3685] rounded-2xl p-4 sm:p-5 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
            <div className="flex flex-col sm:flex-row items-center gap-4 z-10 w-full md:w-auto">
              <img
                src={driver.avatar}
                alt={driver.name}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-white/20 shadow-xl shrink-0"
              />
              <div className="text-center sm:text-left min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                  <StatusBadge status={driver.status} />
                  <span className="flex items-center gap-1 text-xs text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded-full">
                    <Star className="w-3 h-3 fill-amber-300" /> {driver.rating || '4.9'}
                  </span>
                  {shouldMask && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-200 border border-amber-300/30">
                      <Lock className="w-2.5 h-2.5" /> PII Protected
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white truncate">{driver.name}</h2>
                <p className="text-slate-300 text-xs mt-0.5">
                  Assigned Vehicle: <strong className="text-white">{driver.vehicle || 'Unassigned'}</strong>
                </p>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Member since {driver.startDate || driver.joiningDate || '2023-02-15'}
                </p>
              </div>
            </div>

            {/* Quick Header Actions */}
            <div className="flex flex-wrap items-center gap-2 z-10 shrink-0">
              <button
                type="button"
                onClick={() => setIsStatementOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-[#071D49] hover:bg-slate-100 text-xs font-black shadow transition-all cursor-pointer"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Statement</span>
              </button>

              <Can module="drivers" do="edit">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEdit(driver);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-blue-200" />
                  <span>Edit</span>
                </button>
              </Can>

              <Can module="drivers" do="archive">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onArchive(driver);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-bold transition-all border border-amber-400/30 cursor-pointer"
                >
                  <Archive className="w-3.5 h-3.5 text-amber-300" />
                  <span>Archive</span>
                </button>
              </Can>

              <Can module="drivers" do="archive">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onDelete) onDelete(driver);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-bold transition-all border border-rose-400/30 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-300" />
                  <span>Delete</span>
                </button>
              </Can>
            </div>
          </div>

          {/* 9 Tab Navigation Bar */}
          <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto pb-px scrollbar-none text-xs font-bold">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'border-[#075EE8] text-[#075EE8] bg-blue-50/50 rounded-t-lg'
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#075EE8]' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                        isActive ? 'bg-[#075EE8] text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-4 animate-fade-in">
              {/* Privacy Control Banner */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#075EE8]" />
                  <span className="text-slate-700">
                    {shouldMask
                      ? 'Role Privacy Applied: Sensitive driver PII (License, DOB, Address) is restricted & masked.'
                      : 'Authorized Role: Full driver personal identifiers and verified records accessible.'}
                  </span>
                </div>
                {!shouldMask && (
                  <button
                    type="button"
                    onClick={() => setShowSensitive(!showSensitive)}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#075EE8] hover:underline cursor-pointer"
                  >
                    {showSensitive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {showSensitive ? 'Hide Sensitive Data' : 'Reveal Full Unmasked PII'}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contact & Personal */}
                <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#0A1E42] pb-1.5 border-b border-slate-100 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#075EE8]" /> Personal &amp; Contact Details
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Phone Number:</span>
                      <span className="font-semibold text-slate-800">{driver.phone}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Email Address:</span>
                      <span className="font-semibold text-slate-800">{driver.email}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Residential Address:</span>
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        {displayAddress}
                        {shouldMask && <Lock className="w-3 h-3 text-amber-500" />}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Date of Birth (DOB):</span>
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        {displayDob}
                        {shouldMask && <Lock className="w-3 h-3 text-amber-500" />}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Emergency Contact:</span>
                      <span className="font-semibold text-[#0A1E42]">{driver.emergencyContact}</span>
                    </div>
                  </div>
                </div>

                {/* CDL License & Compliance */}
                <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#0A1E42] pb-1.5 border-b border-slate-100 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Commercial Driving License
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">License Number:</span>
                      <span className="font-mono font-bold text-slate-800 flex items-center gap-1">
                        {displayLicense}
                        {shouldMask && <Lock className="w-3 h-3 text-amber-500" />}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Issuing State:</span>
                      <span className="font-bold text-slate-800">{driver.licenseState || 'NY'} (State Certified)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Expiration Date:</span>
                      <span className="font-bold text-emerald-700">{driver.licenseExpiry || '2026-09-14'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Current Assigned Vehicle:</span>
                      <span className="font-bold text-[#075EE8]">{driver.vehicle || 'Unassigned'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Internal Remarks / Notes:</span>
                      <span className="text-slate-600 italic">
                        {driver.notes || 'Equipped with electronic transponder and safety speed governor.'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CURRENT AND PREVIOUS RENTALS */}
          {activeTab === 'rentals' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#0A1E42]">Current &amp; Historical Rental Leases</h3>
                  <p className="text-xs text-slate-400">All commercial fleet leases executed by this driver</p>
                </div>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {rentals.length} Leases Recorded
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-100">
                      <th className="py-2.5 px-3">Contract ID</th>
                      <th className="py-2.5 px-3">Vehicle</th>
                      <th className="py-2.5 px-3">Rental Dates</th>
                      <th className="py-2.5 px-3">Lease Type</th>
                      <th className="py-2.5 px-3 text-right">Weekly Rate</th>
                      <th className="py-2.5 px-3 text-right">Total Amount</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {rentals.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-[#075EE8]">{r.id}</td>
                        <td className="py-2.5 px-3 font-semibold text-[#0A1E42]">{r.vehicle}</td>
                        <td className="py-2.5 px-3">{r.startDate} – {r.endDate}</td>
                        <td className="py-2.5 px-3 text-slate-600">{r.rentalType}</td>
                        <td className="py-2.5 px-3 text-right font-semibold">{formatCurrency(r.weeklyRate)}/wk</td>
                        <td className="py-2.5 px-3 text-right font-bold text-[#0A1E42]">{formatCurrency(r.totalAmount)}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              r.status === 'Active' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PAYMENT HISTORY */}
          {activeTab === 'payments' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#0A1E42]">Direct Driver Payment Receipts</h3>
                  <p className="text-xs text-slate-400">Electronic ACH, card transactions, and cash reconciliations</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Total Paid: {formatCurrency(payments.reduce((sum, p) => sum + p.amount, 0))}
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-100">
                      <th className="py-2.5 px-3">Payment ID</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Method</th>
                      <th className="py-2.5 px-3">Invoice Ref</th>
                      <th className="py-2.5 px-3">Purpose</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-[#075EE8]">{p.id}</td>
                        <td className="py-2.5 px-3 text-slate-500">{p.date}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-700">{p.paymentMethod}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">{p.invoiceRef}</td>
                        <td className="py-2.5 px-3 text-slate-600">{p.category}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-600">{formatCurrency(p.amount)}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: BALANCE */}
          {activeTab === 'balance' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Total Outstanding Balance</span>
                  <p
                    className={`text-xl font-black mt-1 ${
                      balanceData.outstandingBalance > 0 ? 'text-amber-600' : 'text-slate-800'
                    }`}
                  >
                    {formatCurrency(balanceData.outstandingBalance)}
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Security Deposit Escrow</span>
                  <p className="text-xl font-black text-indigo-700 mt-1">
                    {formatCurrency(balanceData.heldDeposit)}
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Unpaid Violations / Tolls</span>
                  <p className="text-xl font-black text-rose-600 mt-1">
                    {formatCurrency(balanceData.unpaidTolls + balanceData.unpaidCitations)}
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Account Aging Status</span>
                  <p
                    className={`text-sm font-bold mt-1 ${
                      balanceData.outstandingBalance > 0 ? 'text-amber-600' : 'text-emerald-600'
                    }`}
                  >
                    {balanceData.status}
                  </p>
                </div>
              </div>

              {balanceData.outstandingBalance > 0 && onRecordPayment && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-amber-900">
                        Outstanding Delinquent Balance: {formatCurrency(balanceData.outstandingBalance)}
                      </p>
                      <p className="text-[11px] text-amber-800">
                        Includes weekly rental arrears and unpaid city parking citations.
                      </p>
                    </div>
                  </div>
                  <Can module="accounting" do="add">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onRecordPayment(driver);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                    >
                      Record Immediate Payment
                    </button>
                  </Can>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: INSPECTIONS */}
          {activeTab === 'inspections' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#0A1E42]">Vehicle Handover Inspection Audits</h3>
                  <p className="text-xs text-slate-400">Odometer readings, body checklist scores, and technician sign-offs</p>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {inspections.length} Handover Audits
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-100">
                      <th className="py-2.5 px-3">Audit ID</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Vehicle</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Odometer</th>
                      <th className="py-2.5 px-3">Checklist Score</th>
                      <th className="py-2.5 px-3">Inspector Notes</th>
                      <th className="py-2.5 px-3 text-center">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {inspections.map((ins) => (
                      <tr key={ins.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-[#075EE8]">{ins.id}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{ins.type}</td>
                        <td className="py-2.5 px-3 text-slate-700">{ins.vehicle}</td>
                        <td className="py-2.5 px-3 text-slate-500">{ins.inspectionDate}</td>
                        <td className="py-2.5 px-3 font-mono font-medium">{ins.odometer}</td>
                        <td className="py-2.5 px-3 font-bold text-emerald-600">{ins.checklistScore}</td>
                        <td className="py-2.5 px-3 text-slate-500 max-w-xs truncate">{ins.condition}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                            {ins.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: ACCIDENTS */}
          {activeTab === 'accidents' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#0A1E42]">Collision &amp; Damage Incident Logs</h3>
                  <p className="text-xs text-slate-400">Insurance adjuster appraisals, police report filings, and liability determinations</p>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {accidents.length} Incident Records
                </span>
              </div>

              {accidents.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                  <p className="font-bold text-xs text-[#0A1E42]">Zero Accident Records on File</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    This driver has maintained a clean safety and collision-free driving record.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {accidents.map((acc) => (
                    <div
                      key={acc.id}
                      className="p-4 bg-white border border-rose-100 rounded-xl shadow-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-rose-600" />
                          <h5 className="font-bold text-xs text-[#0A1E42]">{acc.id} • {acc.date}</h5>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          {acc.claimStatus}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{acc.description}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                        <div>
                          <span className="text-slate-400 block">Liability:</span>
                          <span className="font-bold text-slate-800">{acc.liability}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Vehicle:</span>
                          <span className="font-semibold text-slate-700">{acc.vehicle}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Insurance Claim #:</span>
                          <span className="font-mono text-slate-700">{acc.insuranceClaimNo}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Claim Amount:</span>
                          <span className="font-bold text-emerald-600">{formatCurrency(acc.claimAmount)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: TOLLS AND TICKETS */}
          {activeTab === 'tolls' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#0A1E42]">Tolls, Citations &amp; Parking Violations</h3>
                  <p className="text-xs text-slate-400">Electronic bridge tolls, speed cameras, and municipal parking fines</p>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                  Total: {formatCurrency(tollsAndTickets.reduce((sum, t) => sum + t.totalAmount, 0))}
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-100">
                      <th className="py-2.5 px-3">Notice Ref</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Violation Type</th>
                      <th className="py-2.5 px-3">Location / Plaza</th>
                      <th className="py-2.5 px-3 text-right">Fine</th>
                      <th className="py-2.5 px-3 text-right">Admin Fee</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {tollsAndTickets.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-[#075EE8]">{t.citationNo}</td>
                        <td className="py-2.5 px-3 text-slate-500">{t.date}</td>
                        <td className="py-2.5 px-3 font-semibold text-[#0A1E42]">{t.type}</td>
                        <td className="py-2.5 px-3 text-slate-600">{t.location}</td>
                        <td className="py-2.5 px-3 text-right font-mono">{formatCurrency(t.fineAmount)}</td>
                        <td className="py-2.5 px-3 text-right font-mono">{formatCurrency(t.adminFee)}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-[#0A1E42]">{formatCurrency(t.totalAmount)}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              t.status.includes('Unpaid')
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: CONTRACT HISTORY */}
          {activeTab === 'contracts' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#0A1E42]">Master Lease &amp; Independent Contractor Agreements</h3>
                  <p className="text-xs text-slate-400">Countersigned commercial agreements, insurance covenants, and riders</p>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {contracts.length} Agreements Executed
                </span>
              </div>

              <div className="space-y-3">
                {contracts.map((ctr) => (
                  <div
                    key={ctr.id}
                    className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs space-y-2 hover:border-[#075EE8] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4 text-[#075EE8]" />
                        <h5 className="font-bold text-xs text-[#0A1E42]">{ctr.title} ({ctr.id})</h5>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {ctr.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{ctr.terms}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                      <div>
                        <span className="text-slate-400 block">Term Duration:</span>
                        <span className="font-semibold text-slate-700">{ctr.startDate} – {ctr.endDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Insurance Rider:</span>
                        <span className="font-semibold text-slate-700">{ctr.insuranceCoverage}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Digital Verification:</span>
                        <span className="font-semibold text-emerald-700">{ctr.digitalSignature}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: DOCUMENTS (Personal Documents Masked/Restricted for roles without permission) */}
          {activeTab === 'documents' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#0A1E42]">Driver Compliance &amp; Qualification Documents</h3>
                  <p className="text-xs text-slate-400">
                    Commercial driver's license, DOT physical medical card, MVR abstract, W-9, and bank ACH mandate
                  </p>
                </div>
                <span className="text-xs font-bold text-[#075EE8] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                  {documents.length} Files on Record
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {documents.map((doc) => {
                  const isRestricted = shouldMask && doc.isPersonal;

                  return (
                    <div
                      key={doc.id}
                      className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-xs flex flex-col justify-between space-y-2.5 hover:border-[#075EE8] transition-colors"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${doc.badgeColor}`}>
                            {doc.category}
                          </span>
                          {isRestricted ? (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" /> Restricted
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                              {doc.status}
                            </span>
                          )}
                        </div>

                        <h5 className="font-bold text-xs text-[#0A1E42] leading-snug">
                          {doc.title}
                        </h5>

                        <p className="text-[11px] text-slate-500 line-clamp-2">
                          {isRestricted
                            ? 'Personal identifier document protected under role privacy policy.'
                            : doc.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                        <div>
                          <span>Expires: </span>
                          <span className="font-semibold text-slate-700">
                            {isRestricted ? '••••-••-••' : doc.expiryDate}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {isRestricted ? (
                            <span className="text-[10px] text-slate-400 italic">No Access</span>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => setActiveDocPreview(doc)}
                                className="p-1 text-slate-400 hover:text-[#075EE8] rounded transition-colors cursor-pointer"
                                title="View Document Preview"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => alert(`Downloading ${doc.title}...`)}
                                className="p-1 text-slate-400 hover:text-[#075EE8] rounded transition-colors cursor-pointer"
                                title="Download File"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Document Preview Lightbox */}
              {activeDocPreview && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl animate-scale-up">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h4 className="font-bold text-sm text-[#0A1E42]">{activeDocPreview.title}</h4>
                      <button
                        type="button"
                        onClick={() => setActiveDocPreview(null)}
                        className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="bg-slate-50 border rounded-xl p-4 text-center space-y-2">
                      <FileText className="w-12 h-12 text-[#075EE8] mx-auto opacity-80" />
                      <p className="font-bold text-xs text-[#0A1E42]">Verified Compliance File</p>
                      <p className="text-[11px] text-slate-500">{activeDocPreview.description}</p>
                      <div className="text-[10px] text-slate-400 pt-2 border-t">
                        Format: {activeDocPreview.fileSize} • Issued: {activeDocPreview.issueDate}
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveDocPreview(null)}
                        className="px-3 py-1.5 border rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          alert(`Downloading ${activeDocPreview.title}...`);
                          setActiveDocPreview(null);
                        }}
                        className="px-4 py-1.5 bg-[#075EE8] text-white rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Download File
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>

      {/* Driver Statement Modal Integration */}
      <DriverStatementModal
        isOpen={isStatementOpen}
        onClose={() => setIsStatementOpen(false)}
        driver={driver}
      />
    </>
  );
}
