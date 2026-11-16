import React, { useState, useEffect } from 'react';
import Modal from '../../../components/common/Modal';
import { ShieldCheck, DollarSign, Calendar, Phone, Mail, FileText, Building } from 'lucide-react';

export default function PolicyModal({
  isOpen,
  onClose,
  onSave,
  policy = null
}) {
  const [formData, setFormData] = useState({
    insurer: '',
    policyNumber: '',
    coverage: '',
    coverageType: 'Full Comprehensive & Liability',
    premium: 12000,
    premiumFormatted: '',
    deductible: '$1,000 Collision / $1,000 Comp',
    deductibleTerms: '$1,000 Deductible',
    effectiveDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    vehiclesCovered: 'All Fleet Vehicles',
    status: 'Active',
    documents: [{ name: 'Master_Policy_Document.pdf', size: '2.5 MB' }],
    contacts: {
      agentName: '',
      phone: '',
      email: '',
      broker: ''
    }
  });

  useEffect(() => {
    if (policy) {
      setFormData(policy);
    } else {
      setFormData({
        id: `POL-${Date.now()}`,
        insurer: 'Travelers Commercial Auto & Marine',
        policyNumber: `TRV-${Math.floor(1000000 + Math.random() * 9000000)}`,
        coverage: '$1,000,000 Combined Single Limit (CSL) Liability, Comprehensive & Collision',
        coverageType: 'Commercial Fleet Master Policy',
        premium: 24000,
        premiumFormatted: '$24,000 / year ($2,000 / month)',
        deductible: '$1,000 Collision / $1,000 Comprehensive',
        deductibleTerms: '$1,000 Collision Deductible',
        effectiveDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        vehiclesCovered: 65,
        status: 'Active',
        documents: [{ name: 'Commercial_Fleet_Policy_2025.pdf', size: '3.2 MB', uploadDate: new Date().toISOString().split('T')[0] }],
        contacts: {
          agentName: 'Arthur Pendelton',
          phone: '+1 (800) 555-8728',
          email: 'commercial.claims@travelers.com',
          broker: 'Aon Risk Solutions'
        }
      });
    }
  }, [policy, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={policy ? 'Edit Fleet Insurance Policy' : 'Add Fleet Master Insurance Policy'}
      subtitle="Configure insurer, policy limits, annual premiums, deductibles, effective dates, and claims contacts"
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
        <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(85vh-140px)]">
          {/* Primary Insurer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Insurance Carrier / Insurer *
              </label>
              <input
                type="text"
                value={formData.insurer}
                onChange={(e) => setFormData((p) => ({ ...p, insurer: e.target.value }))}
                placeholder="e.g. Travelers Commercial Auto & Marine"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Policy Number *
              </label>
              <input
                type="text"
                value={formData.policyNumber}
                onChange={(e) => setFormData((p) => ({ ...p, policyNumber: e.target.value }))}
                placeholder="TRV-CA-9821034-25"
                className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                required
              />
            </div>
          </div>

          {/* Coverage & Policy Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Coverage Breakdown & Limits *
              </label>
              <input
                type="text"
                value={formData.coverage}
                onChange={(e) => setFormData((p) => ({ ...p, coverage: e.target.value }))}
                placeholder="$1,000,000 Combined Single Limit (CSL), Comprehensive & Collision, Roadside"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Policy Category *
              </label>
              <select
                value={formData.coverageType}
                onChange={(e) => setFormData((p) => ({ ...p, coverageType: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Commercial Fleet Master Policy">Master Fleet Auto</option>
                <option value="Excess Umbrella Liability">Excess Umbrella</option>
                <option value="Garagekeepers & Depot Liability">Garagekeepers & Depot</option>
                <option value="Hired & Non-Owned Auto">Hired & Non-Owned</option>
              </select>
            </div>
          </div>

          {/* Premium & Deductible Terms */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-blue-600" />
              Financial Terms, Premiums & Deductibles
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Annual Premium ($) *
                </label>
                <input
                  type="number"
                  value={formData.premium}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      premium: Number(e.target.value),
                      premiumFormatted: `$${Number(e.target.value).toLocaleString()} / year`
                    }))
                  }
                  className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-200 rounded-xl bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Deductible Terms *
                </label>
                <input
                  type="text"
                  value={formData.deductible}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      deductible: e.target.value,
                      deductibleTerms: e.target.value
                    }))
                  }
                  placeholder="$1,000 Comprehensive / $1,000 Collision"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Vehicles Covered
                </label>
                <input
                  type="text"
                  value={formData.vehiclesCovered}
                  onChange={(e) => setFormData((p) => ({ ...p, vehiclesCovered: e.target.value }))}
                  placeholder="e.g. 65 Active Vehicles"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>
          </div>

          {/* Dates & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Effective Date *
              </label>
              <input
                type="date"
                value={formData.effectiveDate}
                onChange={(e) => setFormData((p) => ({ ...p, effectiveDate: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Expiration Date *
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData((p) => ({ ...p, expiryDate: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Policy Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
                className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-white"
              >
                <option value="Active">🟢 Active & In Force</option>
                <option value="Expiring Soon">🟡 Expiring Soon (&le;30 Days)</option>
                <option value="Under Renewal">🔵 Under Renewal Negotiation</option>
                <option value="Terminated">⚪ Terminated / Replaced</option>
              </select>
            </div>
          </div>

          {/* Insurer Contact & Claims Info */}
          <div className="p-4 bg-blue-50/40 border border-blue-100 rounded-2xl space-y-3.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              Underwriter, Agent & Claims Emergency Contacts
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Agent / Underwriter Name
                </label>
                <input
                  type="text"
                  value={formData.contacts?.agentName || ''}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      contacts: { ...p.contacts, agentName: e.target.value }
                    }))
                  }
                  placeholder="Arthur Pendelton (Senior Underwriter)"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Claims Telephone Hotline
                </label>
                <input
                  type="text"
                  value={formData.contacts?.phone || ''}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      contacts: { ...p.contacts, phone: e.target.value }
                    }))
                  }
                  placeholder="+1 (800) 555-8728"
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Claims Email Address
                </label>
                <input
                  type="email"
                  value={formData.contacts?.email || ''}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      contacts: { ...p.contacts, email: e.target.value }
                    }))
                  }
                  placeholder="commercial.claims@travelers.com"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Broker Agency
                </label>
                <input
                  type="text"
                  value={formData.contacts?.broker || ''}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      contacts: { ...p.contacts, broker: e.target.value }
                    }))
                  }
                  placeholder="Aon Risk Solutions"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>
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
            Save Policy
          </button>
        </div>
      </form>
    </Modal>
  );
}

