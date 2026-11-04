import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import { ShieldAlert, DollarSign, FileText, Wrench } from 'lucide-react';
import { mockVehicles, mockDrivers } from '../../data/mockData';

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
    damageDescription: '',
    repairEstimate: 1200,
    insuranceCarrier: 'Travelers Commercial Auto',
    claimNumber: '',
    deductibleAmount: 500,
    insurancePaid: 700,
    driverRecovered: 500,
    assignedShop: 'Speedy Pro Auto Clinic',
    status: 'Open',
    notes: ''
  });

  useEffect(() => {
    if (accident) {
      setFormData(accident);
    } else {
      setFormData({
        id: `ACC-${Date.now()}`,
        incidentDate: new Date().toISOString().split('T')[0],
        vehicle: mockVehicles[0]?.name || 'Toyota Camry SE',
        plate: mockVehicles[0]?.plate || 'PR-2024-TC',
        driver: mockDrivers[0]?.name || 'Sarah Jenkins',
        location: '',
        policeReportNumber: `POL-${Math.floor(10000 + Math.random() * 90000)}`,
        thirdPartyInfo: '',
        damageDescription: '',
        repairEstimate: 1500,
        insuranceCarrier: 'Travelers Commercial Auto',
        claimNumber: `CLM-${Math.floor(100000 + Math.random() * 900000)}`,
        deductibleAmount: 500,
        insurancePaid: 1000,
        driverRecovered: 500,
        assignedShop: 'Speedy Pro Auto Clinic',
        status: 'Open',
        notes: ''
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={accident ? 'Edit Accident & Claim Record' : 'Record Incident / Accident & Insurance Claim'}
      subtitle="Track damage incidents, repair estimates, insurance claims, deductibles, and driver recovery"
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
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. NJPD-2025-9981"
              />
            </div>
          </div>

          {/* Damage Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Damage Description & Circumstances</label>
            <textarea
              rows="2"
              value={formData.damageDescription}
              onChange={(e) => setFormData((p) => ({ ...p, damageDescription: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder="Describe damage to front bumper, quarter panel, airbags deployed, etc..."
            />
          </div>

          {/* Financial Breakdown (Insurance & Deductibles) */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-blue-600" /> Financials, Insurance Claims & Deductibles
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Repair Estimate ($)</label>
                <input
                  type="number"
                  value={formData.repairEstimate}
                  onChange={(e) => setFormData((p) => ({ ...p, repairEstimate: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-200 rounded-xl bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Policy Deductible ($)</label>
                <input
                  type="number"
                  value={formData.deductibleAmount}
                  onChange={(e) => setFormData((p) => ({ ...p, deductibleAmount: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-200 rounded-xl bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Insurance Paid ($)</label>
                <input
                  type="number"
                  value={formData.insurancePaid}
                  onChange={(e) => setFormData((p) => ({ ...p, insurancePaid: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-200 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Driver Recovered ($)</label>
                <input
                  type="number"
                  value={formData.driverRecovered}
                  onChange={(e) => setFormData((p) => ({ ...p, driverRecovered: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Insurance Carrier</label>
                <input
                  type="text"
                  value={formData.insuranceCarrier}
                  onChange={(e) => setFormData((p) => ({ ...p, insuranceCarrier: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Claim #</label>
                <input
                  type="text"
                  value={formData.claimNumber}
                  onChange={(e) => setFormData((p) => ({ ...p, claimNumber: e.target.value }))}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Assigned Repair Body Shop</label>
                <input
                  type="text"
                  value={formData.assignedShop}
                  onChange={(e) => setFormData((p) => ({ ...p, assignedShop: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>
          </div>

          {/* Status & Resolution Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Claim Resolution Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
                className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-white"
              >
                <option value="Open">🔴 Open (Pending Body Shop Estimate)</option>
                <option value="Under Review">🟡 Under Review (Insurance Adjuster Inspection)</option>
                <option value="Approved">🔵 Approved (Repairs In Progress)</option>
                <option value="Settled">🟢 Settled (Vehicle Repaired & Funds Recovered)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Third-Party Details</label>
              <input
                type="text"
                value={formData.thirdPartyInfo}
                onChange={(e) => setFormData((p) => ({ ...p, thirdPartyInfo: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                placeholder="Third party vehicle, plate, insurance, contact"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#F8FAFC] border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
          >
            Save Claim Record
          </button>
        </div>
      </form>
    </Modal>
  );
}

