import React from 'react';
import {
  Layers,
  CircleDollarSign,
  CreditCard,
  FileSignature,
  Smartphone,
  Cloud,
  Lock,
  ExternalLink,
  ShieldAlert,
  Info
} from 'lucide-react';

const INTEGRATIONS = [
  {
    id: 'int-quickbooks',
    name: 'QuickBooks Online',
    provider: 'Intuit',
    category: 'Accounting & General Ledger',
    icon: CircleDollarSign,
    iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    status: 'Not Connected',
    badgeColor: 'bg-slate-100 text-slate-600 border-slate-200',
    description:
      'Bi-directional synchronization of driver rental invoices, payment receipts, escrow deposits, and workshop repair bills directly to QuickBooks Online general ledger.',
    buttonLabel: 'Connect QuickBooks',
    requirements: 'Requires QuickBooks Online Accountant or Plus edition license with OAuth 2.0 API access.'
  },
  {
    id: 'int-payments',
    name: 'Stripe & Plaid Gateway',
    provider: 'Stripe / Plaid',
    category: 'Payment Processing & ACH',
    icon: CreditCard,
    iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-200',
    status: 'Not Connected',
    badgeColor: 'bg-slate-100 text-slate-600 border-slate-200',
    description:
      'Credit card tokenization, automated weekly driver auto-debit, instant bank account micro-deposit verification, and escrow security deposit pre-authorization.',
    buttonLabel: 'Connect Stripe / Plaid',
    requirements: 'Requires Stripe Connect platform keys and Plaid production credentials for live ACH debits.'
  },
  {
    id: 'int-esignature',
    name: 'DocuSign & Dropbox Sign',
    provider: 'DocuSign Inc.',
    category: 'Digital E-Signature',
    icon: FileSignature,
    iconBg: 'bg-blue-50 text-[#075EE8] border border-blue-200',
    status: 'Not Connected',
    badgeColor: 'bg-slate-100 text-slate-600 border-slate-200',
    description:
      'Generate legally binding digital signatures for vehicle rental agreements, driver damage liability waivers, and vehicle inspection handover signoffs with SHA-256 vault proof.',
    buttonLabel: 'Connect E-Signature',
    requirements: 'Supports DocuSign eSignature REST API and Dropbox Sign embedded signing ceremony.'
  },
  {
    id: 'int-telecom',
    name: 'Twilio & SendGrid Relay',
    provider: 'Twilio Inc.',
    category: 'SMS & Email Gateway',
    icon: Smartphone,
    iconBg: 'bg-rose-50 text-rose-600 border border-rose-200',
    status: 'Not Connected',
    badgeColor: 'bg-slate-100 text-slate-600 border-slate-200',
    description:
      'High-throughput delivery of automated SMS text reminders to drivers for lease expiration, overdue tickets, and PDF invoice receipts via SendGrid transactional email.',
    buttonLabel: 'Connect SMS / Email',
    requirements: 'Requires Twilio Account SID, verified 10DLC phone numbers, and SendGrid authenticated domain.'
  },
  {
    id: 'int-m365',
    name: 'Microsoft 365 & Azure AD',
    provider: 'Microsoft Corporation',
    category: 'Enterprise Identity & Calendar',
    icon: Cloud,
    iconBg: 'bg-sky-50 text-sky-600 border border-sky-200',
    status: 'Not Connected',
    badgeColor: 'bg-slate-100 text-slate-600 border-slate-200',
    description:
      'Single Sign-On (SSO) authentication using corporate Microsoft accounts and calendar synchronization for vehicle pickup/return appointment scheduling in Outlook.',
    buttonLabel: 'Connect Microsoft 365',
    requirements: 'Requires Microsoft Entra ID tenant registration with calendar and user profile scopes.'
  }
];

export default function IntegrationsTab() {
  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-[#075EE8]" />
            <div>
              <h3 className="text-base font-bold text-[#0A1E42]">Third-Party Enterprise Integrations</h3>
              <p className="text-xs text-slate-500">
                Synchronize PrimeRoute with certified cloud accounting, payment gateways, e-signature engines, and telecom relays
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold px-3 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 self-start sm:self-auto flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-400" /> Production API Connectors
          </span>
        </div>

        <div className="mt-4 p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-slate-600 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#075EE8] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Architecture Notice:</strong> Integration cards represent verified external connectors designed for production deployment. In this prototype environment, connection triggers are read-only placeholders pending secure backend credential exchange.
          </p>
        </div>
      </div>

      {/* Grid of 5 Placeholder Cards (Requirement 4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {INTEGRATIONS.map((intg) => {
          const Icon = intg.icon;
          return (
            <div
              key={intg.id}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_2px_12px_rgba(7,29,73,0.04)] hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4 group"
            >
              <div>
                {/* Top Row: Provider Icon & Status Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${intg.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider shrink-0 ${intg.badgeColor}`}
                  >
                    {intg.status}
                  </span>
                </div>

                {/* Service Name & Category */}
                <div className="mt-3.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    {intg.category}
                  </span>
                  <h4 className="font-black text-[#0A1E42] text-base tracking-tight mt-0.5">
                    {intg.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">Provider: {intg.provider}</p>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                  {intg.description}
                </p>

                {/* Requirements note */}
                <p className="text-[10.5px] text-slate-400 mt-3 p-2.5 bg-slate-50/80 rounded-xl border border-slate-100/80 leading-snug">
                  {intg.requirements}
                </p>
              </div>

              {/* Disabled Connect Button (Requirement 4) */}
              <div className="pt-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled
                  className="w-full py-2.5 px-4 bg-slate-100 text-slate-400 text-xs font-bold rounded-xl border border-slate-200/80 cursor-not-allowed opacity-60 flex items-center justify-center gap-1.5 shadow-2xs select-none"
                  title="Connection disabled: Requires production backend credentials."
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{intg.buttonLabel}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

