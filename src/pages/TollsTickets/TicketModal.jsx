import React, { useState, useEffect, useMemo } from 'react';
import {
  AlertTriangle,
  Upload,
  FileText,
  X,
  CheckCircle2,
  Calendar,
  Building2,
  User,
  ShieldAlert,
  Paperclip,
  Check,
  Link,
  RotateCcw
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import { useFleet } from '../../context/FleetContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

const ISSUING_AUTHORITIES = [
  'NYC Department of Finance (DOF)',
  'MTA Bridges & Tunnels / E-ZPass',
  'Port Authority of NY & NJ',
  'NJ Turnpike & Garden State Pkwy',
  'Miami-Dade County Traffic Bureau',
  'Texas Department of Transportation (TxDOT)',
  'City of Chicago Dept of Finance',
  'Florida Turnpike Enterprise',
  'California Department of Motor Vehicles'
];

const VIOLATION_TYPES = [
  'Parking Violation (Street Sweeping / No Standing)',
  'Speed Camera Infraction',
  'Red Light Camera Infraction',
  'Bus Lane / Transit Lane Infraction',
  'Toll Evasion / Video Toll Surcharge',
  'Expired Meter / Parking Garage Surcharge',
  'Commercial Weight / Inspection Infraction'
];

const WORKFLOW_STATUSES = [
  'Unassigned',
  'Under Review',
  'Assigned',
  'Charged',
  'Paid',
  'Disputed'
];

export default function TicketModal({
  isOpen,
  onClose,
  onSave,
  ticket = null
}) {
  const { vehicles = [], drivers = [], rentals = [] } = useFleet();
  const isEditing = !!ticket;

  const [formData, setFormData] = useState({
    vehicle: '',
    vehiclePlate: '',
    driver: '',
    contract: '',
    issuingAuthority: 'NYC Department of Finance (DOF)',
    referenceNumber: '',
    incurredDate: new Date().toISOString().split('T')[0],
    receivedDate: new Date().toISOString().split('T')[0],
    amount: 75,
    dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    adminFee: 15,
    driverCharge: 90,
    balance: 90,
    status: 'Assigned',
    type: 'Parking Violation (Street Sweeping / No Standing)',
    location: '',
    paymentProofUpload: null,
    proofFileName: '',
    proofFileSize: '',
    notes: '',
    isManualDriverOverride: false
  });

  const [proofPreview, setProofPreview] = useState(null);

  // Initialize or reset form data
  useEffect(() => {
    if (ticket && isOpen) {
      setFormData({
        ...ticket,
        referenceNumber: ticket.referenceNumber || ticket.ticketNumber || '',
        incurredDate: ticket.incurredDate || ticket.date || new Date().toISOString().split('T')[0],
        receivedDate: ticket.receivedDate || new Date().toISOString().split('T')[0],
        amount: Number(ticket.amount || ticket.fineAmount || 75),
        adminFee: Number(ticket.adminFee || 15),
        driverCharge: Number(ticket.driverCharge || (ticket.fineAmount || ticket.amount || 75) + (ticket.adminFee || 15)),
        balance: Number(ticket.balance !== undefined ? ticket.balance : (ticket.status === 'Paid' ? 0 : 90)),
        status: ticket.status || 'Assigned',
        issuingAuthority: ticket.issuingAuthority || 'NYC Department of Finance (DOF)',
        contract: ticket.contract || ticket.contractId || '',
        proofFileName: ticket.proofFileName || (ticket.paymentProofUpload ? 'violation_voucher.pdf' : ''),
        isManualDriverOverride: false
      });
      setProofPreview(ticket.paymentProofUpload || null);
    } else if (isOpen) {
      const defaultVehicle = vehicles[0];
      const vehicleStr = defaultVehicle
        ? `${defaultVehicle.make} ${defaultVehicle.model} (${defaultVehicle.plate || defaultVehicle.id})`
        : 'Hyundai Sonata SEL (PR-2024-HS)';

      setFormData({
        vehicle: vehicleStr,
        vehiclePlate: defaultVehicle?.plate || 'PR-2024-HS',
        driver: '',
        contract: '',
        issuingAuthority: 'NYC Department of Finance (DOF)',
        referenceNumber: `NYC-PARK-${Math.floor(100000 + Math.random() * 900000)}`,
        incurredDate: new Date().toISOString().split('T')[0],
        receivedDate: new Date().toISOString().split('T')[0],
        amount: 75,
        dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        adminFee: 15,
        driverCharge: 90,
        balance: 90,
        status: 'Under Review',
        type: 'Parking Violation (Street Sweeping / No Standing)',
        location: '45th St & 7th Ave, Manhattan',
        paymentProofUpload: null,
        proofFileName: '',
        proofFileSize: '',
        notes: '',
        isManualDriverOverride: false
      });
      setProofPreview(null);
    }
  }, [ticket, isOpen, vehicles]);

  // Requirement 1 & 2: Auto-match driver from rental period covering incurred date
  const matchedRental = useMemo(() => {
    if (!formData.vehicle || !formData.incurredDate) return null;

    // Extract plate or clean vehicle name
    const match = formData.vehicle.match(/\(([^)]+)\)/);
    const plate = match ? match[1].toLowerCase() : formData.vehicle.toLowerCase();

    const incurred = new Date(formData.incurredDate);

    return rentals.find((r) => {
      const rVehicle = (r.vehicle || '').toLowerCase();
      const rPlate = (r.plate || '').toLowerCase();
      const rId = (r.vehicleId || '').toLowerCase();

      const vehicleMatches =
        rVehicle.includes(plate) || rPlate.includes(plate) || (rId && rId.includes(plate));

      if (!vehicleMatches) return false;

      // Check date window
      if (!r.startDate) return false;
      const start = new Date(r.startDate);
      const end = r.endDate ? new Date(r.endDate) : new Date();

      return incurred >= start && incurred <= end;
    });
  }, [formData.vehicle, formData.incurredDate, rentals]);

  // When vehicle or incurredDate changes, automatically update driver & contract unless manually overridden
  useEffect(() => {
    if (!formData.isManualDriverOverride && isOpen) {
      if (matchedRental) {
        const autoDriver = matchedRental.driver || matchedRental.customer || 'Assigned Driver';
        const autoContract = matchedRental.id || matchedRental.contractId || 'RNT-2024-089';
        setFormData((prev) => ({
          ...prev,
          driver: autoDriver,
          contract: autoContract,
          status: prev.status === 'Unassigned' ? 'Assigned' : prev.status
        }));
      } else {
        // Warning condition: date falls outside any rental
        setFormData((prev) => ({
          ...prev,
          driver: prev.driver && prev.isManualDriverOverride ? prev.driver : 'Unassigned / Outside Rental',
          contract: prev.contract && prev.isManualDriverOverride ? prev.contract : 'N/A',
          status: prev.status === 'Paid' || prev.status === 'Charged' ? prev.status : 'Under Review'
        }));
      }
    }
  }, [matchedRental, formData.isManualDriverOverride, isOpen]);

  // Keep driverCharge in sync with amount + adminFee
  const handleAmountChange = (newAmt) => {
    const amt = Number(newAmt) || 0;
    const fee = Number(formData.adminFee) || 0;
    setFormData((prev) => ({
      ...prev,
      amount: amt,
      driverCharge: amt + fee,
      balance: prev.status === 'Paid' ? 0 : amt + fee
    }));
  };

  const handleAdminFeeChange = (newFee) => {
    const fee = Number(newFee) || 0;
    const amt = Number(formData.amount) || 0;
    setFormData((prev) => ({
      ...prev,
      adminFee: fee,
      driverCharge: amt + fee,
      balance: prev.status === 'Paid' ? 0 : amt + fee
    }));
  };

  // Proof file upload handling
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        proofFileName: file.name,
        proofFileSize: `${(file.size / 1024).toFixed(1)} KB`,
        paymentProofUpload: file.name
      }));
      setProofPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveProof = () => {
    setFormData((prev) => ({
      ...prev,
      proofFileName: '',
      proofFileSize: '',
      paymentProofUpload: null
    }));
    setProofPreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.referenceNumber || !formData.amount) return;

    const record = {
      ...formData,
      id: formData.id || `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      ticketNumber: formData.referenceNumber,
      fineAmount: Number(formData.amount),
      adminFee: Number(formData.adminFee),
      driverCharge: Number(formData.driverCharge),
      balance: formData.status === 'Paid' ? 0 : Number(formData.driverCharge),
      chargedToDriver: formData.status === 'Charged' || formData.status === 'Paid'
    };

    onSave(record);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Citation Notice: ${formData.referenceNumber}` : 'Record Municipal Citation / Toll Violation'}
      subtitle="Complete violation registration with rental window auto-matching, proof upload, and recovery subledger"
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Requirement 2: Rental Auto-Match Indicator or Warning Banner */}
        {matchedRental ? (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-start gap-2.5 text-xs text-emerald-950 animate-fade-in shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-0.5">
              <p className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                <span>✓ Active Rental Window Auto-Matched</span>
                <span className="font-mono text-[10px] bg-emerald-200/80 px-1.5 py-0.5 rounded text-emerald-900">
                  {matchedRental.id}
                </span>
              </p>
              <p className="text-[11px] text-emerald-800">
                Driver <strong className="text-emerald-950">{matchedRental.driver || matchedRental.customer}</strong> held this vehicle from{' '}
                <span className="font-mono">{formatDate(matchedRental.startDate)}</span> to{' '}
                <span className="font-mono">{formatDate(matchedRental.endDate || 'Active')}</span> covering the infraction date.
              </p>
            </div>
            {formData.isManualDriverOverride && (
              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, isManualDriverOverride: false }))}
                className="text-[10px] font-bold text-emerald-700 underline hover:text-emerald-900"
              >
                Revert to Auto
              </button>
            )}
          </div>
        ) : (
          <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-2.5 text-xs text-amber-950 animate-fade-in shadow-2xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-0.5">
              <p className="font-extrabold text-amber-900">
                ⚠️ Incurred Date Falls Outside Any Recorded Rental
              </p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                No active rental contract covers <span className="font-semibold">{formData.vehicle}</span> on{' '}
                <span className="font-mono font-bold">{formData.incurredDate}</span>. Status set to{' '}
                <strong className="underline">Under Review</strong> to prevent improper driver recharge.
              </p>
            </div>
          </div>
        )}

        {/* Row 1: Vehicle & Incurred Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Vehicle Target <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.vehicle}
              onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8] font-medium"
              required
            >
              {vehicles.map((v) => (
                <option key={v.id} value={`${v.make} ${v.model} (${v.plate || v.id})`}>
                  {v.year} {v.make} {v.model} ({v.plate || v.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Incurred Date (Infraction Date) <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={formData.incurredDate}
              onChange={(e) => setFormData({ ...formData, incurredDate: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8] font-mono font-medium"
              required
            />
          </div>
        </div>

        {/* Row 2: Driver (Auto-matched with manual override) & Contract */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Responsible Driver {formData.isManualDriverOverride && <span className="text-amber-600">(Manual Override)</span>}
              </label>
              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, isManualDriverOverride: !p.isManualDriverOverride }))}
                className="text-[10px] font-bold text-[#075EE8] hover:underline cursor-pointer"
              >
                {formData.isManualDriverOverride ? 'Use Auto-Match' : 'Override Driver'}
              </button>
            </div>

            {formData.isManualDriverOverride ? (
              <select
                value={formData.driver}
                onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-amber-50/50 border border-amber-300 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8] font-medium"
              >
                <option value="Unassigned / Outside Rental">Unassigned / Outside Rental</option>
                <option value="Standby Driver">Standby Driver / Yard Staff</option>
                {drivers.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name} ({d.id})
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                readOnly
                value={formData.driver || 'No Driver Matched'}
                className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-800 font-bold"
              />
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Rental Contract Reference
            </label>
            <input
              type="text"
              value={formData.contract}
              onChange={(e) => setFormData({ ...formData, contract: e.target.value })}
              placeholder="e.g. RNT-2024-089"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8] font-mono font-medium"
            />
          </div>
        </div>

        {/* Row 3: Issuing Authority & Reference Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Issuing Authority <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              list="authority-list"
              value={formData.issuingAuthority}
              onChange={(e) => setFormData({ ...formData, issuingAuthority: e.target.value })}
              placeholder="e.g. NYC Department of Finance (DOF)"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8]"
              required
            />
            <datalist id="authority-list">
              {ISSUING_AUTHORITIES.map((auth) => (
                <option key={auth} value={auth} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Citation Reference / Notice # <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.referenceNumber}
              onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
              placeholder="e.g. NYC-PARK-881923"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8] font-mono font-bold text-[#0A1E42]"
              required
            />
          </div>
        </div>

        {/* Row 4: Dates (Received Date & Due Date) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Notice Received Date
            </label>
            <input
              type="date"
              value={formData.receivedDate}
              onChange={(e) => setFormData({ ...formData, receivedDate: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8] font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Payment Due Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8] font-mono font-bold text-rose-600"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Violation Classification
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8]"
            >
              {VIOLATION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.split(' (')[0]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 5: Financials (Amount, Admin Processing Fee, Driver Charge/Recovery, Balance) */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
            Financial &amp; Driver Recovery Subledger
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                City Fine ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono font-bold text-[#0A1E42]"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                Fleet Admin Fee ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.adminFee}
                onChange={(e) => handleAdminFeeChange(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono font-medium text-slate-700"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                Driver Charge ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.driverCharge}
                onChange={(e) => setFormData({ ...formData, driverCharge: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono font-extrabold text-rose-600"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                Driver Balance ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.balance}
                onChange={(e) => setFormData({ ...formData, balance: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono font-extrabold text-[#075EE8]"
              />
            </div>
          </div>
        </div>

        {/* Row 6: Review Workflow Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Review Workflow Status (Requirement 2)
            </label>
            <select
              value={formData.status}
              onChange={(e) => {
                const newStatus = e.target.value;
                setFormData({
                  ...formData,
                  status: newStatus,
                  balance: newStatus === 'Paid' ? 0 : formData.driverCharge
                });
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8] font-bold text-[#0A1E42]"
            >
              {WORKFLOW_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Infraction Location / Intersection
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Lincoln Tunnel Toll Plaza"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8]"
            />
          </div>
        </div>

        {/* Row 7: Payment Proof Upload (Requirement 1) */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Payment Proof / Citation Notice Voucher Upload</span>
            <span className="text-[10px] text-slate-400 font-normal">PDF, JPG, PNG (up to 10MB)</span>
          </label>

          {formData.proofFileName ? (
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-[#075EE8]" />
                <div>
                  <p className="font-bold text-[#071D49]">{formData.proofFileName}</p>
                  <p className="text-[10px] text-slate-500">{formData.proofFileSize || 'Attached Notice Slip'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveProof}
                className="p-1 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer transition-colors"
                title="Remove attachment"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-slate-200 hover:border-[#075EE8] rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-blue-50/30 transition-all">
              <Upload className="w-5 h-5 text-slate-400 mb-1" />
              <p className="text-xs font-semibold text-slate-700">Click to upload municipal payment proof or citation notice</p>
              <p className="text-[10px] text-slate-400">Scanned document, remittance slip, or camera capture</p>
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
            Internal Audit Notes &amp; Dispute Details
          </label>
          <textarea
            rows="2"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Add driver dispute reason, court hearing date, or transponder serial details..."
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
            className="px-5 py-2.5 bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer active:scale-95 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isEditing ? 'Save Citation Updates' : 'Record Violation Notice'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
