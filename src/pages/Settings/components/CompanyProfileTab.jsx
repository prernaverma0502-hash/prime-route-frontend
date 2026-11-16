import React from 'react';
import { Save } from 'lucide-react';
import { FormInput } from '../../../components/forms/FormInputs';

export default function CompanyProfileTab({
  settings,
  onCompanyChange,
  onSave,
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)]">
      <h3 className="text-base font-bold text-[#0A1E42] mb-1">Company Profile</h3>
      <p className="text-xs text-slate-500 mb-6">Business identity used on customer invoices and official lease agreements</p>

      <form onSubmit={onSave} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Company Legal Name"
            name="name"
            value={settings.company.name}
            onChange={onCompanyChange}
            required
          />

          <FormInput
            label="Corporate Tagline"
            name="tagline"
            value={settings.company.tagline}
            onChange={onCompanyChange}
          />

          <FormInput
            label="Support / Billing Email"
            name="email"
            type="email"
            value={settings.company.email}
            onChange={onCompanyChange}
            required
          />

          <FormInput
            label="Corporate Phone"
            name="phone"
            value={settings.company.phone}
            onChange={onCompanyChange}
          />

          <FormInput
            label="Official Website"
            name="website"
            value={settings.company.website}
            onChange={onCompanyChange}
          />

          <FormInput
            label="Tax Employer ID (EIN)"
            name="taxId"
            value={settings.company.taxId}
            onChange={onCompanyChange}
          />

          <FormInput
            label="Default Currency"
            name="currency"
            value={settings.company.currency}
            onChange={onCompanyChange}
          />

          <FormInput
            label="Default Timezone"
            name="timezone"
            value={settings.company.timezone}
            onChange={onCompanyChange}
          />
        </div>

        <FormInput
          label="Headquarters Street Address"
          name="address"
          value={settings.company.address}
          onChange={onCompanyChange}
        />

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Profile Details
          </button>
        </div>
      </form>
    </div>
  );
}

