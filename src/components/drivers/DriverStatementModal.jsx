import React from 'react';
import Modal from '../common/Modal';
import { Printer, Download, FileSpreadsheet, CheckCircle, CreditCard, ShieldCheck } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function DriverStatementModal({
  isOpen,
  onClose,
  driver
}) {
  if (!isOpen || !driver) return null;

  const statementItems = [
    { date: '2025-07-01', desc: 'Commercial Vehicle Weekly Lease (Week 1)', type: 'Rental Lease', debit: 600, credit: 0, balance: 600 },
    { date: '2025-07-03', desc: 'ACH Electronic Payment Received – Thank You', type: 'Payment', debit: 0, credit: 600, balance: 0 },
    { date: '2025-07-04', desc: 'NYC Parking Violation Fine (#NYC-PARK-881923)', type: 'Citation', debit: 75, credit: 0, balance: 75 },
    { date: '2025-07-04', desc: 'PrimeRoute Citation Processing & Recovery Admin Fee', type: 'Admin Fee', debit: 15, credit: 0, balance: 90 },
    { date: '2025-07-08', desc: 'Commercial Vehicle Weekly Lease (Week 2)', type: 'Rental Lease', debit: 600, credit: 0, balance: 690 },
    { date: '2025-07-10', desc: 'Lincoln Tunnel Toll Plaza Transponder Auto-Recharge', type: 'Tollway', debit: 16, credit: 0, balance: 706 },
    { date: '2025-07-10', desc: 'Credit Card Payment Received (Ref: CC-9921)', type: 'Payment', debit: 0, credit: 356, balance: 350 },
  ];

  const totalDebits = statementItems.reduce((acc, curr) => acc + curr.debit, 0);
  const totalCredits = statementItems.reduce((acc, curr) => acc + curr.credit, 0);
  const netDue = totalDebits - totalCredits;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Driver Monthly Billing Statement"
      subtitle={`Billing Period: July 01, 2025 – July 31, 2025 • Account Ref: ${driver.id || 'DRV-101'}`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6 printable-area">
        {/* Header Statement Banner */}
        <div className="p-5 bg-gradient-to-r from-[#071D49] to-[#0D2D6C] rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/30 text-blue-200">
                Official Account Ledger
              </span>
              <span className="text-xs text-slate-300">Statement # STMT-2025-07</span>
            </div>
            <h2 className="text-xl font-black">{driver.name}</h2>
            <p className="text-xs text-slate-300 mt-0.5">
              License: <span className="font-mono text-white font-bold">{driver.license}</span> • Vehicle: <span className="text-white font-semibold">{driver.vehicle}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-white text-[#071D49] hover:bg-slate-100 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" /> Print Statement
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-sm transition-all"
            >
              Close
            </button>
          </div>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
            <span className="text-slate-400 font-bold text-[10px] uppercase">Rental Leases Billed</span>
            <p className="text-base font-extrabold text-[#0A1E42] mt-1">$1,200.00</p>
          </div>
          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
            <span className="text-slate-400 font-bold text-[10px] uppercase">Tolls &amp; Violations</span>
            <p className="text-base font-extrabold text-amber-600 mt-1">$106.00</p>
          </div>
          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
            <span className="text-slate-400 font-bold text-[10px] uppercase">Total Payments Made</span>
            <p className="text-base font-extrabold text-emerald-600 mt-1">${totalCredits.toFixed(2)}</p>
          </div>
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl">
            <span className="text-blue-600 font-bold text-[10px] uppercase">Net Outstanding Balance</span>
            <p className="text-base font-black text-[#075EE8] mt-1 font-mono">${netDue.toFixed(2)}</p>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="p-3.5 bg-[#F8FAFC] border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Itemized Account Activity</span>
            <span className="text-[10px] text-slate-400">7 Transactions Logged</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase bg-slate-50/50">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Debit (+)</th>
                  <th className="py-2.5 px-3 text-right">Credit (-)</th>
                  <th className="py-2.5 px-3 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {statementItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-medium text-slate-500 whitespace-nowrap">{formatDate(item.date)}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{item.desc}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-800">
                      {item.debit > 0 ? `$${item.debit.toFixed(2)}` : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">
                      {item.credit > 0 ? `-$${item.credit.toFixed(2)}` : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-extrabold text-[#0A1E42]">
                      ${item.balance.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notice & Terms */}
        <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] text-slate-500 flex items-center justify-between">
          <span>Payment Terms: Net due within 7 days. Electronic ACH and portal card payments accepted.</span>
          <span className="font-semibold text-slate-700">PrimeRoute Fleet Leasing Inc.</span>
        </div>
      </div>
    </Modal>
  );
}

