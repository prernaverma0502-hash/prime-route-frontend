import React, { useState } from 'react';
import {
  Printer,
  Download,
  Mail,
  Receipt,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Shield,
  Send,
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useRole } from '../../context/RoleContext';
import { shouldMaskDriverData } from '../../auth/permissions';
import { maskLicense, maskAddress } from '../../utils/masking';
import { getDriverStatementData } from './driverDataHelpers';

export default function DriverStatementModal({
  isOpen,
  onClose,
  driver,
}) {
  const { currentRoleId } = useRole();
  const shouldMask = shouldMaskDriverData(currentRoleId);
  const [notification, setNotification] = useState(null);

  if (!isOpen || !driver) return null;

  const {
    items,
    totalCharges,
    totalPayments,
    totalDeposits,
    totalRefunds,
    netBalance,
  } = getDriverStatementData(driver);

  const displayLicense = shouldMask ? maskLicense(driver.license) : driver.license;
  const displayAddress = shouldMask ? maskAddress(driver.address) : (driver.address || 'New York, NY');

  const handleDownloadPdf = () => {
    setNotification({
      type: 'success',
      message: `Statement #STMT-2025-${driver.id} downloaded successfully as PDF.`,
    });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleEmailStatement = () => {
    setNotification({
      type: 'success',
      message: `Statement dispatched via secure email to ${driver.email}.`,
    });
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Driver Official Account Statement"
      subtitle={`Billing Period: July 01 – July 31, 2025 • Ref: ${driver.id || 'DRV-101'}`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-5 print:p-0">
        {/* Toast / Notification Banner */}
        {notification && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between animate-fade-in no-print">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {notification.message}
            </span>
            <button
              type="button"
              onClick={() => setNotification(null)}
              className="text-emerald-700 font-bold hover:text-emerald-900"
            >
              ✕
            </button>
          </div>
        )}

        {/* Statement Header Card */}
        <div className="bg-gradient-to-r from-[#071D49] to-[#0D2D6C] rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/30 text-blue-200">
                Official Account Statement
              </span>
              <span className="text-xs text-slate-300">#STMT-2025-{driver.id?.replace(/\D/g, '') || '101'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">{driver.name}</h2>
            <p className="text-xs text-slate-300 mt-0.5">
              License: <strong className="font-mono text-white">{displayLicense}</strong> • Vehicle:{' '}
              <strong className="text-white">{driver.vehicle || 'Assigned Fleet'}</strong>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">{displayAddress}</p>
          </div>

          {/* Action Buttons: Print, Download PDF, Email Statement */}
          <div className="flex flex-wrap items-center gap-2 no-print shrink-0">
            <button
              type="button"
              onClick={handleEmailStatement}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/20 cursor-pointer"
              title="Email statement to driver"
            >
              <Mail className="w-3.5 h-3.5 text-blue-200" />
              <span>Email Statement</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/20 cursor-pointer"
              title="Download PDF Copy"
            >
              <Download className="w-3.5 h-3.5 text-blue-200" />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-[#071D49] hover:bg-slate-100 rounded-xl text-xs font-black shadow-sm transition-all cursor-pointer"
              title="Print Statement Sheet"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* 5 Cumulative Financial Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <span className="text-slate-400 font-bold text-[10px] uppercase">1. Charges Billed</span>
            <p className="text-sm sm:text-base font-extrabold text-[#0A1E42] mt-0.5">
              {formatCurrency(totalCharges)}
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <span className="text-slate-400 font-bold text-[10px] uppercase">2. Payments Made</span>
            <p className="text-sm sm:text-base font-extrabold text-emerald-600 mt-0.5">
              -{formatCurrency(totalPayments)}
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <span className="text-slate-400 font-bold text-[10px] uppercase">3. Security Deposit</span>
            <p className="text-sm sm:text-base font-extrabold text-indigo-600 mt-0.5">
              {formatCurrency(totalDeposits || 500)} (Escrow)
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <span className="text-slate-400 font-bold text-[10px] uppercase">4. Refunds / Credits</span>
            <p className="text-sm sm:text-base font-extrabold text-cyan-600 mt-0.5">
              {totalRefunds > 0 ? `-${formatCurrency(totalRefunds)}` : '$0.00'}
            </p>
          </div>

          <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl col-span-2 sm:col-span-1">
            <span className="text-blue-700 font-bold text-[10px] uppercase">5. Running Balance</span>
            <p
              className={`text-sm sm:text-base font-black mt-0.5 ${
                netBalance > 0 ? 'text-amber-600' : 'text-[#075EE8]'
              }`}
            >
              {formatCurrency(netBalance)}
            </p>
          </div>
        </div>

        {/* Itemized Activity Ledger with Running Balance */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs">
          <div className="p-3 bg-[#F8FAFC] border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Itemized Account Activity &amp; Running Balance
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {items.length} Transactions Recorded
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase bg-slate-50/50">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Charges (+)</th>
                  <th className="py-2.5 px-3 text-right">Payments (-)</th>
                  <th className="py-2.5 px-3 text-right">Deposits</th>
                  <th className="py-2.5 px-3 text-right">Refunds (-)</th>
                  <th className="py-2.5 px-3 text-right font-bold text-[#0A1E42]">Running Bal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-slate-500 whitespace-nowrap">
                      {formatDate(item.date)}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{item.desc}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-800">
                      {item.debit > 0 ? formatCurrency(item.debit) : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">
                      {item.credit > 0 ? `-${formatCurrency(item.credit)}` : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-indigo-600">
                      {item.deposit > 0 ? formatCurrency(item.deposit) : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-cyan-600">
                      {item.refund > 0 ? `-${formatCurrency(item.refund)}` : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-black text-[#0A1E42]">
                      {formatCurrency(item.runningBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Terms & Legal Notice */}
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Payment Terms: Standard weekly settlement due within 7 days. Electronic ACH and driver portal debit accepted.
          </span>
          <span className="font-bold text-slate-700">PrimeRoute Fleet Operations Inc.</span>
        </div>
      </div>
    </Modal>
  );
}

