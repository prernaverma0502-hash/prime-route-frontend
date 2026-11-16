import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Building2,
  TrendingUp,
  Scale,
  ShieldCheck,
  AlertCircle,
  Printer
} from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';
import { exportToCsv } from '../../../utils/exportCsv';

export default function FinancialReportsTab() {
  const [reportType, setReportType] = useState('pnl'); // 'pnl' | 'balance_sheet'
  const [dateRange, setDateRange] = useState('This Month (July 2025)');

  const dateRanges = [
    'This Month (July 2025)',
    'Last Month (June 2025)',
    'Q2 2025 (Apr - Jun)',
    'Year to Date (2025)',
    'Fiscal Year 2024'
  ];

  const handleExport = () => {
    if (reportType === 'pnl') {
      exportToCsv('PrimeRoute_Profit_and_Loss_Preview', [
        { Section: 'Revenue', LineItem: 'Commercial Fleet Lease Income', Amount: 42850 },
        { Section: 'Revenue', LineItem: 'Excess Mileage Surcharges', Amount: 2450 },
        { Section: 'Revenue', LineItem: 'Toll Administration & Recovery', Amount: 1850 },
        { Section: 'Revenue', LineItem: 'Miscellaneous Service Fees', Amount: 1600 },
        { Section: 'Revenue', LineItem: 'TOTAL REVENUE', Amount: 48750 },
        { Section: 'Cost of Fleet', LineItem: 'Fleet Fuel & EV Power', Amount: 4250 },
        { Section: 'Cost of Fleet', LineItem: 'Routine Maintenance & Tires', Amount: 3820 },
        { Section: 'Cost of Fleet', LineItem: 'Commercial Fleet Insurance', Amount: 8900 },
        { Section: 'Cost of Fleet', LineItem: 'Tolls & Violations Direct', Amount: 1450 },
        { Section: 'Cost of Fleet', LineItem: 'TOTAL COST OF FLEET', Amount: 18420 },
        { Section: 'Summary', LineItem: 'GROSS PROFIT', Amount: 30330 },
        { Section: 'OpEx', LineItem: 'Software & Telematics', Amount: 650 },
        { Section: 'OpEx', LineItem: 'Merchant Clearing & Bank Fees', Amount: 940 },
        { Section: 'OpEx', LineItem: 'Depot Yard Facility Lease', Amount: 3500 },
        { Section: 'Summary', LineItem: 'NET OPERATING INCOME', Amount: 25240 },
        { Section: 'Notice', LineItem: 'Official statements come from the accounting software (QuickBooks Online)', Amount: '' }
      ]);
    } else {
      exportToCsv('PrimeRoute_Balance_Sheet_Preview', [
        { Section: 'Current Assets', LineItem: 'Operating Checking & Cash', Amount: 124500 },
        { Section: 'Current Assets', LineItem: 'Accounts Receivable (AR)', Amount: 18450 },
        { Section: 'Current Assets', LineItem: 'Customer Deposits Escrow Account (Asset)', Amount: 12500 },
        { Section: 'Fixed Assets', LineItem: 'Vehicle Fleet Capital Asset Basis', Amount: 1420000 },
        { Section: 'Fixed Assets', LineItem: 'Less: Accumulated Depreciation', Amount: -320000 },
        { Section: 'Assets Summary', LineItem: 'TOTAL ASSETS', Amount: 1255450 },
        { Section: 'Current Liabilities', LineItem: 'Accounts Payable (AP)', Amount: 14250 },
        { Section: 'Current Liabilities', LineItem: 'Refundable Security Deposits Held (Liability - Excluded from Revenue)', Amount: 12500 },
        { Section: 'Current Liabilities', LineItem: 'Short-term Vehicle Note Principal Due', Amount: 48000 },
        { Section: 'Long-term Liabilities', LineItem: 'Fleet Vehicle Financing Notes Payable', Amount: 680000 },
        { Section: 'Liabilities Summary', LineItem: 'TOTAL LIABILITIES', Amount: 754750 },
        { Section: 'Equity', LineItem: 'Contributed Capital', Amount: 350000 },
        { Section: 'Equity', LineItem: 'Retained Earnings', Amount: 150700 },
        { Section: 'Equity Summary', LineItem: 'TOTAL LIABILITIES & EQUITY', Amount: 1255450 },
        { Section: 'Notice', LineItem: 'Official statements come from the accounting software (QuickBooks Online)', Amount: '' }
      ]);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden space-y-5 p-5">
      {/* 1. Official Software Mandatory Label Banner */}
      <div className="p-3.5 bg-blue-50/80 border border-blue-200/90 rounded-xl flex items-center justify-between gap-3 text-xs text-blue-900">
        <div className="flex items-center gap-2.5">
          <Building2 className="w-4 h-4 text-[#075EE8] shrink-0" />
          <span className="font-semibold">
            Official statements come from the accounting software (e.g. QuickBooks Online). This operational view provides real-time estimates derived from dispatch ledger activity.
          </span>
        </div>
        <span className="font-mono text-[11px] font-bold text-[#075EE8] shrink-0 bg-white px-2 py-0.5 rounded-md border border-blue-200">
          QBO Synced
        </span>
      </div>

      {/* 2. Controls Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-b border-slate-100 pb-3">
        {/* Toggle between P&L and Balance Sheet */}
        <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 shadow-2xs">
          <button
            onClick={() => setReportType('pnl')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              reportType === 'pnl'
                ? 'bg-white text-[#075EE8] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" /> Profit &amp; Loss (Income Statement)
          </button>
          <button
            onClick={() => setReportType('balance_sheet')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              reportType === 'balance_sheet'
                ? 'bg-white text-[#075EE8] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5" /> Balance Sheet Summary
          </button>
        </div>

        {/* Date Range Selector & Export */}
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8] font-semibold text-slate-700"
          >
            {dateRanges.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" /> Export CSV
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
        </div>
      </div>

      {/* 3. REPORT CONTENT: Profit and Loss View */}
      {reportType === 'pnl' && (
        <div className="space-y-6 printable-area">
          <div className="border-b pb-3">
            <h3 className="text-base font-black text-[#071D49]">
              Statement of Operations &amp; Profitability (P&amp;L)
            </h3>
            <p className="text-xs text-slate-500">
              Period: {dateRange} • Basis: Accrual Accounting
            </p>
          </div>

          <div className="space-y-5 text-xs">
            {/* 1. Operating Revenue */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold uppercase tracking-wider text-slate-500 border-b pb-1 text-[11px]">
                <span>1. Operating Rental Revenue</span>
                <span>Amount</span>
              </div>
              <div className="space-y-1 pl-3 divide-y divide-slate-100">
                <div className="flex justify-between py-1 text-slate-700">
                  <span>Commercial Fleet Vehicle Lease Income</span>
                  <span className="font-semibold font-mono">{formatCurrency(42850)}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-700">
                  <span>Excess Mileage Surcharges</span>
                  <span className="font-semibold font-mono">{formatCurrency(2450)}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-700">
                  <span>Toll Administration &amp; Fine Recovery</span>
                  <span className="font-semibold font-mono">{formatCurrency(1850)}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-700">
                  <span>Incidentals, Cleaning &amp; Dispatch Surcharges</span>
                  <span className="font-semibold font-mono">{formatCurrency(1600)}</span>
                </div>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-[#071D49] bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span>Total Operating Revenue</span>
                <span className="font-mono text-[#075EE8]">{formatCurrency(48750)}</span>
              </div>
            </div>

            {/* 2. Cost of Fleet Operations */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold uppercase tracking-wider text-slate-500 border-b pb-1 text-[11px]">
                <span>2. Cost of Fleet Operations (Direct CoGS)</span>
                <span>Amount</span>
              </div>
              <div className="space-y-1 pl-3 divide-y divide-slate-100">
                <div className="flex justify-between py-1 text-slate-700">
                  <span>Fleet Fuel Cards &amp; Commercial Supercharging</span>
                  <span className="font-semibold font-mono">{formatCurrency(4250)}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-700">
                  <span>Routine Preventative Maintenance, Brakes &amp; Tires</span>
                  <span className="font-semibold font-mono">{formatCurrency(3820)}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-700">
                  <span>Commercial Primary Auto Fleet Insurance</span>
                  <span className="font-semibold font-mono">{formatCurrency(8900)}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-700">
                  <span>MTA Bridges &amp; Turnpikes Direct Tolls</span>
                  <span className="font-semibold font-mono">{formatCurrency(1450)}</span>
                </div>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span>Total Cost of Fleet Operations</span>
                <span className="font-mono text-rose-600">-{formatCurrency(18420)}</span>
              </div>
            </div>

            {/* 3. Gross Profit */}
            <div className="flex justify-between font-black text-sm text-[#071D49] bg-blue-50/70 p-3 rounded-xl border border-blue-200">
              <span>Gross Operational Margin (62.2%)</span>
              <span className="font-mono text-emerald-600">{formatCurrency(30330)}</span>
            </div>

            {/* 4. Operating Expenses (OpEx) */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold uppercase tracking-wider text-slate-500 border-b pb-1 text-[11px]">
                <span>3. General &amp; Administrative (G&amp;A OpEx)</span>
                <span>Amount</span>
              </div>
              <div className="space-y-1 pl-3 divide-y divide-slate-100">
                <div className="flex justify-between py-1 text-slate-700">
                  <span>Samsara IoT Telematics &amp; Software Subscriptions</span>
                  <span className="font-semibold font-mono">{formatCurrency(650)}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-700">
                  <span>Merchant Processing &amp; ACH Wire Clearance Fees</span>
                  <span className="font-semibold font-mono">{formatCurrency(940)}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-700">
                  <span>Commercial Depot Hub &amp; Dispatch Yard Lease</span>
                  <span className="font-semibold font-mono">{formatCurrency(3500)}</span>
                </div>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span>Total Operating Expenses</span>
                <span className="font-mono text-rose-600">-{formatCurrency(5090)}</span>
              </div>
            </div>

            {/* 5. Net Operating Income */}
            <div className="flex justify-between font-black text-base text-[#071D49] bg-gradient-to-r from-emerald-50 to-blue-50 p-4 rounded-2xl border-2 border-emerald-300 shadow-xs">
              <div>
                <span>Net Operating Income (EBITDA)</span>
                <span className="block text-xs font-normal text-emerald-800 font-sans mt-0.5">
                  Operating Margin: 51.8% • Unadjusted for year-end corporate tax
                </span>
              </div>
              <span className="font-mono text-emerald-600 text-lg">
                {formatCurrency(25240)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. REPORT CONTENT: Balance Sheet Summary View */}
      {reportType === 'balance_sheet' && (
        <div className="space-y-6 printable-area">
          <div className="border-b pb-3">
            <h3 className="text-base font-black text-[#071D49]">
              Balance Sheet Statement of Financial Position
            </h3>
            <p className="text-xs text-slate-500">
              As of: July 31, 2025 • Currency: USD
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* ASSETS COLUMN */}
            <div className="space-y-4">
              <h4 className="font-black uppercase tracking-wider text-[#075EE8] text-sm border-b-2 border-blue-200 pb-1 flex items-center justify-between">
                <span>Assets</span>
                <span>Amount</span>
              </h4>

              <div className="space-y-2">
                <span className="font-bold text-slate-600 uppercase text-[10px] block">Current Assets</span>
                <div className="space-y-1 pl-2 divide-y divide-slate-100">
                  <div className="flex justify-between py-1 text-slate-700">
                    <span>Chase Commercial Checking &amp; Operating Cash</span>
                    <span className="font-mono font-semibold">{formatCurrency(124500)}</span>
                  </div>
                  <div className="flex justify-between py-1 text-slate-700">
                    <span>Accounts Receivable (AR)</span>
                    <span className="font-mono font-semibold">{formatCurrency(18450)}</span>
                  </div>
                  <div className="flex justify-between py-1 text-slate-700">
                    <span>Customer Escrow Security Deposit Bank Account</span>
                    <span className="font-mono font-semibold">{formatCurrency(12500)}</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-slate-800 bg-slate-50 p-2 rounded-lg">
                  <span>Total Current Assets</span>
                  <span className="font-mono">{formatCurrency(155450)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="font-bold text-slate-600 uppercase text-[10px] block">Property &amp; Equipment (Fleet)</span>
                <div className="space-y-1 pl-2 divide-y divide-slate-100">
                  <div className="flex justify-between py-1 text-slate-700">
                    <span>Commercial Vehicle Fleet (Cost Basis)</span>
                    <span className="font-mono font-semibold">{formatCurrency(1420000)}</span>
                  </div>
                  <div className="flex justify-between py-1 text-slate-700">
                    <span>Less: Accumulated MACRS Depreciation</span>
                    <span className="font-mono font-semibold text-rose-600">-{formatCurrency(320000)}</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-slate-800 bg-slate-50 p-2 rounded-lg">
                  <span>Net Vehicle Fleet Fixed Assets</span>
                  <span className="font-mono">{formatCurrency(1100000)}</span>
                </div>
              </div>

              <div className="flex justify-between font-black text-sm text-[#071D49] bg-blue-50 p-3 rounded-xl border border-blue-200 mt-4">
                <span>TOTAL ASSETS</span>
                <span className="font-mono text-[#075EE8]">{formatCurrency(1255450)}</span>
              </div>
            </div>

            {/* LIABILITIES & EQUITY COLUMN */}
            <div className="space-y-4">
              <h4 className="font-black uppercase tracking-wider text-[#071D49] text-sm border-b-2 border-slate-300 pb-1 flex items-center justify-between">
                <span>Liabilities &amp; Equity</span>
                <span>Amount</span>
              </h4>

              <div className="space-y-2">
                <span className="font-bold text-slate-600 uppercase text-[10px] block">Current Liabilities</span>
                <div className="space-y-1 pl-2 divide-y divide-slate-100">
                  <div className="flex justify-between py-1 text-slate-700">
                    <span>Accounts Payable (AP)</span>
                    <span className="font-mono font-semibold">{formatCurrency(14250)}</span>
                  </div>
                  <div className="flex justify-between py-1 text-slate-700 font-semibold bg-amber-50/60 px-1 rounded">
                    <div>
                      <span>Customer Escrow Security Deposits (Liability)</span>
                      <span className="block text-[10px] text-amber-800 font-normal">
                        *Strictly excluded from revenue per GAAP
                      </span>
                    </div>
                    <span className="font-mono text-amber-900">{formatCurrency(12500)}</span>
                  </div>
                  <div className="flex justify-between py-1 text-slate-700">
                    <span>Vehicle Notes Principal Due within 1 Year</span>
                    <span className="font-mono font-semibold">{formatCurrency(48000)}</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-slate-800 bg-slate-50 p-2 rounded-lg">
                  <span>Total Current Liabilities</span>
                  <span className="font-mono">{formatCurrency(74750)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="font-bold text-slate-600 uppercase text-[10px] block">Long-term Debt</span>
                <div className="space-y-1 pl-2 divide-y divide-slate-100">
                  <div className="flex justify-between py-1 text-slate-700">
                    <span>Commercial Fleet Vehicle Financing Notes</span>
                    <span className="font-mono font-semibold">{formatCurrency(680000)}</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-slate-800 bg-slate-50 p-2 rounded-lg">
                  <span>Total Long-term Liabilities</span>
                  <span className="font-mono">{formatCurrency(680000)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="font-bold text-slate-600 uppercase text-[10px] block">Stockholders&apos; / Owner&apos;s Equity</span>
                <div className="space-y-1 pl-2 divide-y divide-slate-100">
                  <div className="flex justify-between py-1 text-slate-700">
                    <span>Contributed Partner Capital</span>
                    <span className="font-mono font-semibold">{formatCurrency(350000)}</span>
                  </div>
                  <div className="flex justify-between py-1 text-slate-700">
                    <span>Cumulative Retained Earnings</span>
                    <span className="font-mono font-semibold">{formatCurrency(150700)}</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-slate-800 bg-slate-50 p-2 rounded-lg">
                  <span>Total Equity</span>
                  <span className="font-mono">{formatCurrency(500700)}</span>
                </div>
              </div>

              <div className="flex justify-between font-black text-sm text-[#071D49] bg-slate-100 p-3 rounded-xl border border-slate-300 mt-4">
                <span>TOTAL LIABILITIES &amp; EQUITY</span>
                <span className="font-mono text-[#071D49]">{formatCurrency(1255450)}</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border text-[11px] text-slate-500 text-center">
            Official audited statements come from the accounting software (QuickBooks Online).
          </div>
        </div>
      )}
    </div>
  );
}

