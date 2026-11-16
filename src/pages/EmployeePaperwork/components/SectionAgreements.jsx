import React from 'react';
import { Shield } from 'lucide-react';
import DigitalSignaturePad from '../../../components/agreements/DigitalSignaturePad';

export default function SectionAgreements({
  formData,
  errors,
  onAgreementChange,
}) {
  return (
    <section className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgba(7,29,73,0.03)] space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0A1E42]">
              Section D: Agreements, Policies & Digital Signature
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review company vehicle safety covenants, conduct rules, and execute your binding digital signature.
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Terms & Agreement Box */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700">
          PrimeRoute Fleet Employee Operating Agreement & Code of Conduct
        </label>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-h-44 overflow-y-auto text-xs text-slate-600 space-y-2 leading-relaxed">
          <p className="font-bold text-slate-800">1. FLEET VEHICLE CARE AND RESPONSIBILITY</p>
          <p>
            The employee agrees to operate all PrimeRoute fleet vehicles in strict compliance with federal, state, and local laws. Vehicles must undergo pre-trip and post-trip inspections through the PrimeRoute system. Unauthorized personal usage, unregistered passengers, or reckless driving are strictly prohibited.
          </p>
          <p className="font-bold text-slate-800">2. TELEMETRY AND SAFETY MONITORING</p>
          <p>
            Fleet vehicles are equipped with GPS, speed monitoring, and diagnostic telemetry to protect assets and ensure safety. Tampering with telematics hardware is grounds for immediate termination.
          </p>
          <p className="font-bold text-slate-800">3. ACCIDENT REPORTING & TRAFFIC VIOLATIONS</p>
          <p>
            Any collision, property damage, ticket, or mechanical failure must be logged in PrimeRoute within 2 hours. Traffic fines and toll violations incurred due to employee negligence remain the sole responsibility of the operator.
          </p>
          <p className="font-bold text-slate-800">4. CONFIDENTIALITY & ACCURACY</p>
          <p>
            The employee certifies that all documentation, driver credentials, and personal information submitted in this form are accurate and free from misrepresentation.
          </p>
        </div>
      </div>

      {/* Acceptance Checkbox */}
      <div className={`p-4 rounded-2xl border transition-colors ${
        errors.acceptedTerms ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 bg-slate-50/50'
      }`}>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.agreements.acceptedTerms}
            onChange={(e) => onAgreementChange('acceptedTerms', e.target.checked)}
            className="mt-1 w-4 h-4 text-[#075EE8] rounded-sm border-slate-300 focus:ring-[#075EE8]"
          />
          <span className="text-xs text-slate-700 leading-relaxed">
            <strong className="text-[#0A1E42]">I have read, acknowledge, and agree</strong> to the PrimeRoute Employee Operating Agreement, Vehicle Safety Guidelines, and Drug & Alcohol Testing policies. I confirm that all submitted details and uploaded records are true, genuine, and legally valid. <span className="text-rose-500">*</span>
          </span>
        </label>
        {errors.acceptedTerms && <p className="text-[11px] text-rose-500 mt-2 font-medium">{errors.acceptedTerms}</p>}
      </div>

      {/* Digital Signature Pad */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-700">
            Digital Signature Field <span className="text-rose-500">*</span>
          </label>
          <span className="text-[11px] text-slate-400">Sign using mouse, touchscreen or type name</span>
        </div>

        <DigitalSignaturePad
          title="Employee Digital Signature"
          signerName={`${formData.personal.firstName} ${formData.personal.lastName}`.trim() || 'David Miller'}
          role="Fleet Employee"
          initialSignature={formData.agreements.digitalSignature}
          onSignatureChange={(sigData) => onAgreementChange('digitalSignature', sigData)}
        />
        {errors.digitalSignature && (
          <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.digitalSignature}</p>
        )}
      </div>
    </section>
  );
}
