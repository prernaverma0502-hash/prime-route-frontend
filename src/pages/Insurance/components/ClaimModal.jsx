import React, { useState, useEffect } from 'react';
import Modal from '../../../components/common/Modal';
import { ShieldAlert, DollarSign, FileText, Wrench, Building } from 'lucide-react';
import { initialPolicies, mockVehicles, mockDrivers } from '../../../data/mockData';

export default function ClaimModal({
  isOpen,
  onClose,
  onSave,
  claim = null,
  accidents = []
}) {
  const [formData, setFormData] = useState({
    claimNumber: '',
    policyId: 'POL-TRV-101',
    policyNumber: 'TRV-CA-9821034-25',
    insurer: 'Travelers Commercial Auto & Marine',
    accidentId: '',
    incidentDate: new Date().toISOString().split('T')[0],
    vehicle: '',
    plate: '',
    driver: '',
    claimedAmount: 2500,
    repairEstimate: 2500,
    repairInvoice: '',
    repairInvoiceFile: '',
    deductibleAmount: 1000,
    deductibleTerms: '$1,000 Collision Deductible',
    insurancePaid: 0,
    driverCharge: 1000,
    amountRecovered: 0,
    driverRecovered: 0,
    status: 'Under Review',
    adjusterName: '',
    adjusterPhone: '',
    notes: ''
  });

  useEffect(() => {
    if (claim) {
      setFormData(claim);
    } else {
      const generatedClaimNum = `CLM-TRV-${Math.floor(100000 + Math.random() * 900000)}`;
      const pol = initialPolicies[0] || {};
      const firstAccident = accidents[0] || {};

      setFormData({
        id: generatedClaimNum,
        claimNumber: generatedClaimNum,
        policyId: pol.id || 'POL-TRV-101',
        policyNumber: pol.policyNumber || 'TRV-CA-9821034-25',
        insurer: pol.insurer || 'Travelers Commercial Auto & Marine',
        accidentId: firstAccident.id || 'ACC-2025-014',
        incidentDate: firstAccident.incidentDate || new Date().toISOString().split('T')[0],
        vehicle: firstAccident.vehicle || mockVehicles[0]?.name || 'Honda Civic EX',
        plate: firstAccident.plate || mockVehicles[0]?.plate || 'PR-2024-HC',
        driver: firstAccident.driver || mockDrivers[0]?.name || 'Carlos Mendez',
        claimedAmount: firstAccident.repairEstimate || 2800,
        repairEstimate: firstAccident.repairEstimate || 2800,
        repairInvoice: firstAccident.repairInvoiceNumber || 'INV-SHOP-8944',
        repairInvoiceFile: firstAccident.repairInvoiceFile || 'collision_repair_invoice.pdf',
        deductibleAmount: firstAccident.deductibleAmount || 1000,
        deductibleTerms: firstAccident.deductibleTerms || '$1,000 Collision Deductible',
        insurancePaid: 0,
        driverCharge: 1000,
        amountRecovered: 250,
        driverRecovered: 250,
        status: 'Under Review',
        adjusterName: 'Jessica Taylor (Field Adjuster)',
        adjusterPhone: '+1 (800) 555-8728 ext. 235',
        notes: 'Claim initiated for vehicle front collision damage; adjuster inspection pending.'
      });
    }
  }, [claim, isOpen, accidents]);

  const handleAccidentSelect = (accidentId) => {
    const selected = accidents.find((a) => a.id === accidentId);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        accidentId: selected.id,
        vehicle: selected.vehicle,
        plate: selected.plate,
        driver: selected.driver,
        incidentDate: selected.incidentDate || selected.date,
        claimedAmount: selected.repairEstimate || prev.claimedAmount,
        repairEstimate: selected.repairEstimate || prev.repairEstimate,
        repairInvoice: selected.repairInvoiceNumber || prev.repairInvoice,
        deductibleAmount: selected.deductibleAmount || prev.deductibleAmount,
        driverCharge: selected.driverCharge || prev.driverCharge
      }));
    } else {
      setFormData((prev) => ({ ...prev, accidentId }));
    }
  };

  const handlePolicySelect = (policyId) => {
    const pol = initialPolicies.find((p) => p.id === policyId);
    if (pol) {
      setFormData((prev) => ({
        ...prev,
        policyId: pol.id,
        policyNumber: pol.policyNumber,
        insurer: pol.insurer,
        deductibleTerms: pol.deductibleTerms || pol.deductible
      }));
    } else {
      setFormData((prev) => ({ ...prev, policyId }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      amountRecovered: (Number(formData.insurancePaid) || 0) + (Number(formData.driverRecovered) || 0)
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={claim ? 'Edit Insurance Claim' : 'File Insurance Claim Linked to Accident'}
      subtitle="Connect accident incident damage with fleet insurance policies, carrier claim numbers, and adjuster notes"
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
        <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(85vh-140px)]">
          {/* Claim # & Policy Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Insurance Claim # *
              </label>
              <input
                type="text"
                value={formData.claimNumber}
                onChange={(e) => setFormData((p) => ({ ...p, claimNumber: e.target.value }))}
                placeholder="CLM-TRV-882190"
                className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Linked Insurance Policy *
              </label>
              <select
                value={formData.policyId}
                onChange={(e) => handlePolicySelect(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                required
              >
                {initialPolicies.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.insurer} ({p.policyNumber})
                  </option>
                ))}
                <option value="Internal Escrow">Internal Escrow (Sub-threshold)</option>
              </select>
            </div>
          </div>

          {/* Linked Accident Incident */}
          <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-2xl space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              Linked Accident Incident Record *
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Select Incident / Accident Log
                </label>
                <select
                  value={formData.accidentId}
                  onChange={(e) => handleAccidentSelect(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-bold"
                  required
                >
                  {accidents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.id} – {a.vehicle} ({a.incidentDate || a.date})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Incident Date
                </label>
                <input
                  type="date"
                  value={formData.incidentDate}
                  onChange={(e) => setFormData((p) => ({ ...p, incidentDate: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Involved Vehicle & Plate
                </label>
                <input
                  type="text"
                  value={`${formData.vehicle} (${formData.plate})`}
                  readOnly
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-100 text-slate-700 font-semibold cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Involved Driver
                </label>
                <input
                  type="text"
                  value={formData.driver}
                  readOnly
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-100 text-slate-700 font-semibold cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Financials & Deductibles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Claimed Amount ($)
              </label>
              <input
                type="number"
                value={formData.claimedAmount}
                onChange={(e) => setFormData((p) => ({ ...p, claimedAmount: Number(e.target.value) }))}
                className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-200 rounded-xl bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Deductible Amount ($)
              </label>
              <input
                type="number"
                value={formData.deductibleAmount}
                onChange={(e) => setFormData((p) => ({ ...p, deductibleAmount: Number(e.target.value) }))}
                className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-200 rounded-xl bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Carrier Paid ($)
              </label>
              <input
                type="number"
                value={formData.insurancePaid}
                onChange={(e) => setFormData((p) => ({ ...p, insurancePaid: Number(e.target.value) }))}
                className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-200 rounded-xl bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Driver Recovered ($)
              </label>
              <input
                type="number"
                value={formData.driverRecovered}
                onChange={(e) => setFormData((p) => ({ ...p, driverRecovered: Number(e.target.value) }))}
                className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-200 rounded-xl bg-white text-emerald-600"
              />
            </div>
          </div>

          {/* Adjuster Details & Resolution Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Claim Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
                className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-white"
              >
                <option value="Filed">📝 Claim Filed</option>
                <option value="Under Review">🟡 Under Adjuster Review</option>
                <option value="Approved">🔵 Approved (Repairs Active)</option>
                <option value="Settled">🟢 Settled & Funds Collected</option>
                <option value="Denied">🔴 Claim Denied / Disputed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Insurance Adjuster
              </label>
              <input
                type="text"
                value={formData.adjusterName}
                onChange={(e) => setFormData((p) => ({ ...p, adjusterName: e.target.value }))}
                placeholder="Jessica Taylor (Field Adjuster)"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Adjuster Telephone / Ext.
              </label>
              <input
                type="text"
                value={formData.adjusterPhone}
                onChange={(e) => setFormData((p) => ({ ...p, adjusterPhone: e.target.value }))}
                placeholder="+1 (800) 555-8728"
                className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl bg-white"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Adjuster Findings & Settlement Notes
            </label>
            <textarea
              rows="2"
              value={formData.notes}
              onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
              placeholder="Record adjuster remarks, subrogation updates, repair authorization..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
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
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            Save Claim
          </button>
        </div>
      </form>
    </Modal>
  );
}

