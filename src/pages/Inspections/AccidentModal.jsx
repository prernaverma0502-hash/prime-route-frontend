import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import {
  ShieldAlert,
  DollarSign,
  FileText,
  Wrench,
  FileCheck,
  Building,
  UploadCloud,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { mockVehicles, mockDrivers, initialPolicies } from '../../data/mockData';

export default function AccidentModal({
  isOpen,
  onClose,
  onSave,
  accident = null,
}) {
  const [formData, setFormData] = useState({
    incidentDate: new Date().toISOString().split('T')[0],
    vehicle: '',
    plate: '',
    driver: '',
    location: '',
    policeReportNumber: '',
    thirdPartyInfo: '',
    damage: '',
    damageDescription: '',
    repairEstimate: 1500,
    repairInvoiceNumber: '',
    repairInvoiceAmount: 1500,
    repairInvoiceFile: '',
    insuranceCarrier: 'Travelers Commercial Auto & Marine',
    claimNumber: '',
    linkedPolicyId: 'POL-TRV-101',
    deductibleTerms: '$500 Collision Deductible',
    deductibleAmount: 500,
    driverCharge: 500,
    insurancePaid: 1000,
    driverRecovered: 500,
    amountRecovered: 1500,
    assignedShop: 'Speedy Pro Auto Clinic',
    status: 'Under Review',
    resolutionStatus: 'Under Review',
    notes: ''
  });

  useEffect(() => {
    if (accident) {
      setFormData({
        ...accident,
        damage: accident.damage || accident.damageDescription || '',
        damageDescription: accident.damageDescription || accident.damage || '',
        repairInvoiceNumber: accident.repairInvoiceNumber || 'INV-SHOP-8841',
        repairInvoiceAmount: accident.repairInvoiceAmount || accident.repairEstimate || 1500,
        repairInvoiceFile: accident.repairInvoiceFile || 'shop_repair_invoice.pdf',
        linkedPolicyId: accident.linkedPolicyId || 'POL-TRV-101',
        deductibleTerms: accident.deductibleTerms || '$500 Collision Deductible',
        driverCharge: accident.driverCharge !== undefined ? accident.driverCharge : (accident.deductibleAmount || 500),
        amountRecovered: accident.amountRecovered !== undefined ? accident.amountRecovered : ((accident.insurancePaid || 0) + (accident.driverRecovered || 0)),
        resolutionStatus: accident.resolutionStatus || accident.status || 'Under Review',
        status: accident.status || accident.resolutionStatus || 'Under Review'
      });
    } else {
      const defaultVehicle = mockVehicles[0] || { name: 'Toyota Camry SE', plate: 'PR-2024-TC' };
      const defaultDriver = mockDrivers[0] || { name: 'Sarah Jenkins' };
      const generatedClaimNum = `CLM-TRV-${Math.floor(100000 + Math.random() * 900000)}`;

      setFormData({
        id: `ACC-${Date.now()}`,
        incidentDate: new Date().toISOString().split('T')[0],
        vehicle: defaultVehicle.name,
        plate: defaultVehicle.plate,
        driver: defaultDriver.name,
        location: 'Route 4 & Grand Ave, Paramus NJ',
        policeReportNumber: `NJPD-2025-${Math.floor(10000 + Math.random() * 90000)}`,
        thirdPartyInfo: 'Third Party Commercial Vehicle (Plate: NY-COMM-8891)',
        damage: 'Front bumper cover cracked and passenger side headlight assembly damaged.',
        damageDescription: 'Front bumper cover cracked and passenger side headlight assembly damaged.',
        repairEstimate: 1650,
        repairInvoiceNumber: `INV-SHOP-${Math.floor(8000 + Math.random() * 1000)}`,
        repairInvoiceAmount: 1650,
        repairInvoiceFile: 'speedy_pro_invoice_prelim.pdf',
        insuranceCarrier: 'Travelers Commercial Auto & Marine',
        claimNumber: generatedClaimNum,
        linkedPolicyId: 'POL-TRV-101',
        deductibleTerms: '$500 Collision Deductible',
        deductibleAmount: 500,
        driverCharge: 500,
        insurancePaid: 1150,
        driverRecovered: 500,
        amountRecovered: 1650,
        assignedShop: 'Speedy Pro Auto Clinic',
        status: 'Under Review',
        resolutionStatus: 'Under Review',
        notes: 'Claim initiated with carrier. Repair estimate verified by fleet mechanic.'
      });
    }
  }, [accident, isOpen]);

  const handleVehicleChange = (vehicleName) => {
    const selected = mockVehicles.find((v) => v.name === vehicleName);
    setFormData((prev) => ({
      ...prev,
      vehicle: vehicleName,
      plate: selected?.plate || prev.plate
    }));
  };

  const handlePolicyChange = (policyId) => {
    const pol = initialPolicies.find((p) => p.id === policyId);
    if (pol) {
      setFormData((prev) => ({
        ...prev,
        linkedPolicyId: pol.id,
        insuranceCarrier: pol.insurer,
        deductibleTerms: pol.deductibleTerms || pol.deductible
      }));
    } else {
      setFormData((prev) => ({ ...prev, linkedPolicyId: policyId }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      status: formData.resolutionStatus,
      damageDescription: formData.damage,
      amountRecovered: (Number(formData.insurancePaid) || 0) + (Number(formData.driverRecovered) || 0)
    };
    onSave(finalData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={accident ? 'Edit Accident & Claim Record' : 'Record Accident & Insurance Claim'}
      subtitle="Track damage assessment, repair invoice vouchers, insurance claim link, deductible terms, and driver recovery"
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
        <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(85vh-140px)]">
          {/* Incident Primary Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Incident Date *</label>
              <input
                type="date"
                value={formData.incidentDate}
                onChange={(e) => setFormData((p) => ({ ...p, incidentDate: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Vehicle *</label>
              <select
                value={formData.vehicle}
                onChange={(e) => handleVehicleChange(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                required
              >
                {mockVehicles.map((v) => (
                  <option key={v.id} value={v.name}>
                    {v.name} ({v.plate})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Involved Driver *</label>
              <select
                value={formData.driver}
                onChange={(e) => setFormData((p) => ({ ...p, driver: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                required
              >
                {mockDrivers.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location & Police Report */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Incident Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Route 9 North & Main St, Edison NJ"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Police Report #</label>
              <input
                type="text"
                value={formData.policeReportNumber}
                onChange={(e) => setFormData((p) => ({ ...p, policeReportNumber: e.target.value }))}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. NJSP-2025-99812"
              />
            </div>
          </div>

          {/* Damage Description (Requirement 2) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Vehicle Damage Assessment & Circumstances *
            </label>
            <textarea
              rows="2"
              value={formData.damage}
              onChange={(e) => setFormData((p) => ({ ...p, damage: e.target.value, damageDescription: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder="Describe physical damage to bumper, panels, glass, structural components..."
              required
            />
          </div>

          {/* Repair Estimate & Repair Invoice (Requirement 2) */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-blue-600" />
              Repair Estimate & Workshop Invoice Record
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Repair Estimate ($) *</label>
                <input
                  type="number"
                  value={formData.repairEstimate}
                  onChange={(e) => setFormData((p) => ({ ...p, repairEstimate: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-200 rounded-xl bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Repair Invoice #</label>
                <input
                  type="text"
                  value={formData.repairInvoiceNumber}
                  onChange={(e) => setFormData((p) => ({ ...p, repairInvoiceNumber: e.target.value }))}
                  placeholder="INV-SHOP-8819"
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Repair Invoice Amount ($)</label>
                <input
                  type="number"
                  value={formData.repairInvoiceAmount}
                  onChange={(e) => setFormData((p) => ({ ...p, repairInvoiceAmount: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-200 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Assigned Repair Body Shop</label>
                <input
                  type="text"
                  value={formData.assignedShop}
                  onChange={(e) => setFormData((p) => ({ ...p, assignedShop: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  placeholder="e.g. Speedy Pro Auto Clinic"
                />
              </div>
            </div>

            {/* Repair Invoice Document Voucher */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2.5 bg-white border border-slate-200 rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800">Shop Repair Invoice / Estimate File: </span>
                  <span className="font-mono text-slate-600">{formData.repairInvoiceFile || 'speedy_pro_invoice_1450.pdf'}</span>
                </div>
              </div>
              <input
                type="text"
                value={formData.repairInvoiceFile}
                onChange={(e) => setFormData((p) => ({ ...p, repairInvoiceFile: e.target.value }))}
                placeholder="voucher_filename.pdf"
                className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg w-full sm:w-56 font-mono"
              />
            </div>
          </div>

          {/* Insurance Claim, Deductible Terms, Driver Charge, Recovery (Requirement 2) */}
          <div className="p-4 bg-blue-50/40 border border-blue-100 rounded-2xl space-y-3.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
              Insurance Claim Link, Deductible Terms & Driver Recovery
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Linked Insurance Policy *</label>
                <select
                  value={formData.linkedPolicyId}
                  onChange={(e) => handlePolicyChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-medium"
                >
                  {initialPolicies.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.insurer} ({p.policyNumber})
                    </option>
                  ))}
                  <option value="Internal Escrow">Direct Fleet Expense (Below Deductible)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Insurance Claim # *</label>
                <input
                  type="text"
                  value={formData.claimNumber}
                  onChange={(e) => setFormData((p) => ({ ...p, claimNumber: e.target.value }))}
                  placeholder="CLM-TRV-882190"
                  className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-200 rounded-xl bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Deductible Terms *</label>
                <input
                  type="text"
                  value={formData.deductibleTerms}
                  onChange={(e) => setFormData((p) => ({ ...p, deductibleTerms: e.target.value }))}
                  placeholder="$500 Collision Deductible"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  required
                />
              </div>
            </div>

            {/* Financials: Deductible, Driver Charge, Ins Paid, Recovered */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-1">
              <div className="p-2.5 bg-white rounded-xl border border-blue-100 shadow-2xs">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Policy Deductible ($)</label>
                <input
                  type="number"
                  value={formData.deductibleAmount}
                  onChange={(e) => setFormData((p) => ({ ...p, deductibleAmount: Number(e.target.value) }))}
                  className="w-full mt-1 text-sm font-mono font-extrabold text-slate-800 bg-transparent border-b border-slate-200 focus:outline-none"
                />
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-blue-100 shadow-2xs">
                <label className="block text-[10px] font-bold text-rose-500 uppercase">Driver Charge ($)</label>
                <input
                  type="number"
                  value={formData.driverCharge}
                  onChange={(e) => setFormData((p) => ({ ...p, driverCharge: Number(e.target.value) }))}
                  className="w-full mt-1 text-sm font-mono font-extrabold text-rose-600 bg-transparent border-b border-slate-200 focus:outline-none"
                  title="Deductible or damage charge billed to driver"
                />
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-blue-100 shadow-2xs">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Insurance Paid ($)</label>
                <input
                  type="number"
                  value={formData.insurancePaid}
                  onChange={(e) => setFormData((p) => ({ ...p, insurancePaid: Number(e.target.value) }))}
                  className="w-full mt-1 text-sm font-mono font-extrabold text-slate-800 bg-transparent border-b border-slate-200 focus:outline-none"
                />
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-blue-100 shadow-2xs">
                <label className="block text-[10px] font-bold text-emerald-600 uppercase">Driver Recovered ($)</label>
                <input
                  type="number"
                  value={formData.driverRecovered}
                  onChange={(e) => setFormData((p) => ({ ...p, driverRecovered: Number(e.target.value) }))}
                  className="w-full mt-1 text-sm font-mono font-extrabold text-emerald-600 bg-transparent border-b border-slate-200 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Resolution Status & Third-Party Info (Requirement 2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Claim Resolution Status *</label>
              <select
                value={formData.resolutionStatus}
                onChange={(e) => setFormData((p) => ({ ...p, resolutionStatus: e.target.value, status: e.target.value }))}
                className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-white"
              >
                <option value="Open">🔴 Open (Pending Body Shop Estimate)</option>
                <option value="Under Review">🟡 Under Review (Insurance Adjuster Inspection)</option>
                <option value="Repairs In Progress">🔵 Repairs In Progress (Body Shop Dispatched)</option>
                <option value="Settled">🟢 Settled (Repairs Done & Funds Recovered)</option>
                <option value="Disputed">🟣 Disputed (Liability Appeal / Third-Party Contested)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Third-Party Details</label>
              <input
                type="text"
                value={formData.thirdPartyInfo}
                onChange={(e) => setFormData((p) => ({ ...p, thirdPartyInfo: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                placeholder="Third-party vehicle, plate, insurer, and contact"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Resolution & Subrogation Notes</label>
            <textarea
              rows="2"
              value={formData.notes}
              onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder="Record adjuster remarks, subrogation status, deposit deductions..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#F8FAFC] border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            Save Claim Record
          </button>
        </div>
      </form>
    </Modal>
  );
}
