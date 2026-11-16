import React from 'react';
import { User } from 'lucide-react';

export default function SectionPersonal({ formData, errors, onChange }) {
  return (
    <section className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgba(7,29,73,0.03)] space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-50 text-[#075EE8]">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0A1E42]">
              Section A: Personal Information
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Legal name, residential address, and emergency contact details for official employment records.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
          * Required Fields
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            First Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.firstName || ''}
            onChange={(e) => onChange('firstName', e.target.value)}
            placeholder="e.g. David"
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors ${
              errors.firstName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-[#075EE8]'
            } focus:outline-hidden`}
          />
          {errors.firstName && <p className="text-[11px] text-rose-500 mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Last Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.lastName || ''}
            onChange={(e) => onChange('lastName', e.target.value)}
            placeholder="e.g. Miller"
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors ${
              errors.lastName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-[#075EE8]'
            } focus:outline-hidden`}
          />
          {errors.lastName && <p className="text-[11px] text-rose-500 mt-1">{errors.lastName}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="david.miller@primeroute.io"
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors ${
              errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-[#075EE8]'
            } focus:outline-hidden`}
          />
          {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Phone Number <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="+1 (555) 349-1029"
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors ${
              errors.phone ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-[#075EE8]'
            } focus:outline-hidden`}
          />
          {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Date of Birth <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            value={formData.dob || ''}
            onChange={(e) => onChange('dob', e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors ${
              errors.dob ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-[#075EE8]'
            } focus:outline-hidden`}
          />
          {errors.dob && <p className="text-[11px] text-rose-500 mt-1">{errors.dob}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Residential Street Address <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.address || ''}
            onChange={(e) => onChange('address', e.target.value)}
            placeholder="742 Evergreen Terrace, Apt 4B"
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors ${
              errors.address ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-[#075EE8]'
            } focus:outline-hidden`}
          />
          {errors.address && <p className="text-[11px] text-rose-500 mt-1">{errors.address}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            City <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.city || ''}
            onChange={(e) => onChange('city', e.target.value)}
            placeholder="Queens"
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors ${
              errors.city ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-[#075EE8]'
            } focus:outline-hidden`}
          />
          {errors.city && <p className="text-[11px] text-rose-500 mt-1">{errors.city}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            State <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.state || ''}
            onChange={(e) => onChange('state', e.target.value)}
            placeholder="NY"
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors ${
              errors.state ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-[#075EE8]'
            } focus:outline-hidden`}
          />
          {errors.state && <p className="text-[11px] text-rose-500 mt-1">{errors.state}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            ZIP Code <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.zipCode || ''}
            onChange={(e) => onChange('zipCode', e.target.value)}
            placeholder="11375"
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors ${
              errors.zipCode ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-[#075EE8]'
            } focus:outline-hidden`}
          />
          {errors.zipCode && <p className="text-[11px] text-rose-500 mt-1">{errors.zipCode}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Emergency Contact Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.emergencyContactName || ''}
            onChange={(e) => onChange('emergencyContactName', e.target.value)}
            placeholder="e.g. Sarah Miller (Spouse)"
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors ${
              errors.emergencyContactName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-[#075EE8]'
            } focus:outline-hidden`}
          />
          {errors.emergencyContactName && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.emergencyContactName}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Emergency Contact Phone <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.emergencyContactPhone || ''}
            onChange={(e) => onChange('emergencyContactPhone', e.target.value)}
            placeholder="+1 (555) 902-4821"
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors ${
              errors.emergencyContactPhone ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-[#075EE8]'
            } focus:outline-hidden`}
          />
          {errors.emergencyContactPhone && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.emergencyContactPhone}</p>
          )}
        </div>
      </div>
    </section>
  );
}

