import React, { useState } from 'react';
import { Save, UploadCloud, RefreshCw, Building, DollarSign, Gauge, CheckCircle2 } from 'lucide-react';
import { FormInput, FormSelect } from '../../../components/forms/FormInputs';

const CURRENCY_OPTIONS = [
  { value: 'USD ($)', label: 'USD ($) – United States Dollar' },
  { value: 'CAD ($)', label: 'CAD ($) – Canadian Dollar' },
  { value: 'EUR (€)', label: 'EUR (€) – Euro' },
  { value: 'GBP (£)', label: 'GBP (£) – British Pound Sterling' },
  { value: 'AUD ($)', label: 'AUD ($) – Australian Dollar' }
];

export default function GeneralSettingsTab({
  settings,
  onCompanyChange,
  onSave
}) {
  const [logoPreview, setLogoPreview] = useState(settings?.company?.logo || '/primeroute-logo.png');
  const [saveToast, setSaveToast] = useState(false);

  const handleLogoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setLogoPreview(uploadEvent.target.result);
        if (onCompanyChange) {
          onCompanyChange({ target: { name: 'logo', value: uploadEvent.target.result } });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetLogo = () => {
    setLogoPreview('/primeroute-logo.png');
    if (onCompanyChange) {
      onCompanyChange({ target: { name: 'logo', value: '/primeroute-logo.png' } });
    }
  };

  const handleSubmit = (e) => {
    if (onSave) onSave(e);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3500);
  };

  return (
    <div className="space-y-6">
      {saveToast && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 text-xs font-bold text-emerald-800 shadow-2xs animate-slide-down">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>General enterprise settings and oil change threshold saved successfully.</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveToast(false)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Brand & Logo Customization */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)]">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <Building className="w-5 h-5 text-[#075EE8]" />
            <div>
              <h3 className="text-base font-bold text-[#0A1E42]">Brand Identity &amp; Corporate Logo</h3>
              <p className="text-xs text-slate-500">Corporate logo and branding displayed on agreements, invoices, and headers</p>
            </div>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row items-center gap-6">
            {/* Logo Preview Box */}
            <div className="w-48 h-20 bg-slate-50 border border-slate-200 rounded-2xl p-2 flex items-center justify-center overflow-hidden shadow-2xs shrink-0">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Corporate Brand Logo"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span className="text-xs text-slate-400 font-medium">No Logo Uploaded</span>
              )}
            </div>

            {/* Logo Controls */}
            <div className="space-y-2 text-center sm:text-left">
              <div className="flex items-center gap-2.5 flex-wrap">
                <label className="px-3.5 py-2 bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95 duration-150">
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload New Logo</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleResetLogo}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer active:scale-95 duration-150"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Reset to PrimeRoute Default</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Recommended dimensions: 320×80px (PNG or SVG with transparent background, max 2MB).
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Company Legal Information */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)]">
          <div className="pb-4 border-b border-slate-100 mb-5">
            <h3 className="text-base font-bold text-[#0A1E42]">Company Legal Information</h3>
            <p className="text-xs text-slate-500">Business registration information utilized across client leasing contracts and billing ledgers</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Legal Entity Name"
              name="name"
              value={settings?.company?.name || ''}
              onChange={onCompanyChange}
              required
              placeholder="PrimeRoute Global Fleet Systems"
            />

            <FormInput
              label="Tagline / Fleet Slogan"
              name="tagline"
              value={settings?.company?.tagline || ''}
              onChange={onCompanyChange}
              placeholder="Manage • Track • Grow"
            />

            <FormInput
              label="Billing &amp; Support Email"
              name="email"
              type="email"
              value={settings?.company?.email || ''}
              onChange={onCompanyChange}
              required
              placeholder="admin@primeroute.io"
            />

            <FormInput
              label="Customer Service Phone"
              name="phone"
              value={settings?.company?.phone || ''}
              onChange={onCompanyChange}
              placeholder="+1 (800) 555-ROUT"
            />

            <FormInput
              label="Official Fleet Portal Website"
              name="website"
              value={settings?.company?.website || ''}
              onChange={onCompanyChange}
              placeholder="https://primeroute.io"
            />

            <FormInput
              label="Federal Employer Tax ID (EIN)"
              name="taxId"
              value={settings?.company?.taxId || ''}
              onChange={onCompanyChange}
              placeholder="US-EIN-948210382"
            />
          </div>

          <div className="mt-4">
            <FormInput
              label="Principal Office Street Address"
              name="address"
              value={settings?.company?.address || ''}
              onChange={onCompanyChange}
              placeholder="500 Madison Ave, Floor 24, New York, NY 10022"
            />
          </div>
        </div>

        {/* Card 3: Regional Currency & Fleet Preventative Maintenance Standards */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)]">
          <div className="pb-4 border-b border-slate-100 mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#0A1E42]">Financial Currency &amp; Fleet Intervals</h3>
              <p className="text-xs text-slate-500">System default currency and preventative maintenance mileage standards</p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-blue-50 text-[#075EE8] border border-blue-100">
              Fleet Standards
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Currency Selector (Requirement 1) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#075EE8]" />
                <span>Primary Operational Currency *</span>
              </label>
              <select
                name="currency"
                value={settings?.company?.currency || 'USD ($)'}
                onChange={onCompanyChange}
                className="w-full px-3.5 py-2.5 text-xs font-bold border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#075EE8]"
              >
                {CURRENCY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Applied to lease rates, charges, statements, repair invoices, and report exports.
              </p>
            </div>

            {/* Oil Change Interval (Requirement 1: default 5,000 miles) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-amber-600" />
                <span>Standard Oil Change Interval (Miles) *</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="oilChangeInterval"
                  min="2000"
                  max="15000"
                  step="500"
                  value={settings?.company?.oilChangeInterval || 5000}
                  onChange={onCompanyChange}
                  className="w-full px-3.5 py-2.5 text-xs font-mono font-bold border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#075EE8]"
                  required
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  miles
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Default: <strong>5,000 miles</strong>. Triggers preventative maintenance cadences and odometer thresholds across the fleet.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 duration-150 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save General Configuration
          </button>
        </div>
      </form>
    </div>
  );
}

