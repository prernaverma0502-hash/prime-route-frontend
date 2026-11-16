import React, { useState } from 'react';
import {
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  Database,
  Layers,
  Sparkles
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../../utils/formatters';

const DEFAULT_RECONCILIATION_DATA = [
  {
    id: 'REC-01',
    sourceId: 'CHG-001',
    sourceType: 'Weekly Lease Charge',
    entity: 'Marcus Vance',
    sourceDate: '2025-07-01',
    sourceAmount: 487.50,
    qboId: 'QBO-INV-1029',
    qboAccount: '4100 • Rental Operating Revenue',
    syncDate: '2025-07-01 09:30 AM',
    matchStatus: 'Matched',
    difference: 0
  },
  {
    id: 'REC-02',
    sourceId: 'PMT-101',
    sourceType: 'Corporate ACH Payment',
    entity: 'Marcus Vance',
    sourceDate: '2025-07-01',
    sourceAmount: 487.50,
    qboId: 'QBO-PMT-8841',
    qboAccount: '1010 • Operating Checking (Chase)',
    syncDate: '2025-07-01 09:35 AM',
    matchStatus: 'Matched',
    difference: 0
  },
  {
    id: 'REC-03',
    sourceId: 'DEP-001',
    sourceType: 'Security Deposit (Escrow)',
    entity: 'Marcus Vance',
    sourceDate: '2025-07-01',
    sourceAmount: 500.00,
    qboId: 'QBO-JRN-4402',
    qboAccount: '2100 • Customer Deposits Held (Liability)',
    syncDate: '2025-07-01 09:40 AM',
    matchStatus: 'Matched',
    difference: 0
  },
  {
    id: 'REC-04',
    sourceId: 'CHG-003',
    sourceType: 'VIP Lease Charge',
    entity: 'Elena Rostova',
    sourceDate: '2025-07-05',
    sourceAmount: 675.00,
    qboId: 'QBO-INV-1035',
    qboAccount: '4100 • Rental Operating Revenue',
    syncDate: '2025-07-05 10:15 AM',
    matchStatus: 'Matched',
    difference: 0
  },
  {
    id: 'REC-05',
    sourceId: 'PMT-103',
    sourceType: 'Credit Card Remittance',
    entity: 'Elena Rostova',
    sourceDate: '2025-07-05',
    sourceAmount: 675.00,
    qboId: 'QBO-PMT-8854',
    qboAccount: '1020 • Stripe Merchant Clearing',
    syncDate: '2025-07-05 10:20 AM',
    matchStatus: 'Matched',
    difference: 0
  },
  {
    id: 'REC-06',
    sourceId: 'AP-401',
    sourceType: 'Vendor Bill (Shell Fleet)',
    entity: 'Shell Fleet Solutions',
    sourceDate: '2025-07-08',
    sourceAmount: 4250.00,
    qboId: 'QBO-BILL-5091',
    qboAccount: '5200 • Fleet Fuel & EV Power',
    syncDate: '2025-07-08 02:00 PM',
    matchStatus: 'Matched',
    difference: 0
  },
  {
    id: 'REC-07',
    sourceId: 'CHG-004',
    sourceType: 'Eco Lease Charge',
    entity: 'Alexander Reed',
    sourceDate: '2025-07-10',
    sourceAmount: 462.50,
    qboId: 'Pending Creation',
    qboAccount: '4100 • Rental Operating Revenue',
    syncDate: 'Not synced yet',
    matchStatus: 'Unmatched / Pending Sync',
    difference: 462.50
  },
  {
    id: 'REC-08',
    sourceId: 'PMT-105',
    sourceType: 'Partial Bank Wire',
    entity: 'Alexander Reed',
    sourceDate: '2025-07-10',
    sourceAmount: 250.00,
    qboId: 'Pending Creation',
    qboAccount: '1010 • Operating Checking (Chase)',
    syncDate: 'Not synced yet',
    matchStatus: 'Unmatched / Pending Sync',
    difference: 250.00
  },
  {
    id: 'REC-09',
    sourceId: 'CHG-005',
    sourceType: 'Toll & Fine Re-charge',
    entity: 'Sarah Jenkins',
    sourceDate: '2025-07-04',
    sourceAmount: 90.00,
    qboId: 'Pending Review',
    qboAccount: '4300 • Toll & Violation Recovery',
    syncDate: 'Not synced yet',
    matchStatus: 'Unmatched / Pending Sync',
    difference: 90.00
  }
];

export default function AccountingSyncPanel() {
  const [syncStatus, setSyncStatus] = useState('Connected & In Sync');
  const [lastSyncTime, setLastSyncTime] = useState('Today at 02:45 PM');
  const [isSyncing, setIsSyncing] = useState(false);
  const [reconciliationRows, setReconciliationRows] = useState(DEFAULT_RECONCILIATION_DATA);
  const [notification, setNotification] = useState('');

  const unsyncedCount = reconciliationRows.filter((r) => r.matchStatus !== 'Matched').length;

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      // Mark all pending rows as matched
      setReconciliationRows((prev) =>
        prev.map((row) => ({
          ...row,
          matchStatus: 'Matched',
          qboId: row.qboId.includes('Pending') ? `QBO-SYNC-${Math.floor(1000 + Math.random() * 9000)}` : row.qboId,
          syncDate: 'Just now',
          difference: 0
        }))
      );
      setSyncStatus('Connected & In Sync');
      setLastSyncTime('Just now');
      setIsSyncing(false);
      setNotification('All 3 pending operational transactions successfully synchronized and reconciled with QuickBooks Online!');
      setTimeout(() => setNotification(''), 4500);
    }, 1200);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden space-y-5 p-5">
      {/* 1. Official Ledger Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#071D49] via-[#0A2660] to-[#075EE8] text-white space-y-2 relative overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
              <Database className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold tracking-tight">
                  Official Ledger Integration: QuickBooks Online (Advanced)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync Active
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5 leading-relaxed">
                The official general ledger, chart of accounts, and audited corporate financial statements live in your connected accounting software. PrimeRoute operates as the fleet management subledger, automatically synchronizing charges, receipts, and escrow liabilities.
              </p>
            </div>
          </div>

          <button
            onClick={handleTriggerSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-900/20 transition-all active:scale-95 duration-150 cursor-pointer shrink-0 disabled:opacity-60 self-start md:self-auto"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Synchronizing QBO...' : 'Sync Now with QBO'}
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 rounded-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* 2. Sync Status Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Accounting Platform
          </span>
          <p className="font-extrabold text-[#0A1E42] text-sm flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-[#075EE8]" /> QuickBooks Online
          </p>
          <span className="text-[11px] text-slate-500 block">Company ID: 9130-3490-PR</span>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Sync Status
          </span>
          <p className="font-bold text-emerald-600 text-sm flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> {syncStatus}
          </p>
          <span className="text-[11px] text-slate-500 block">Bi-directional Webhook Active</span>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Last Successful Sync
          </span>
          <p className="font-bold text-slate-800 text-sm font-mono">
            {lastSyncTime}
          </p>
          <span className="text-[11px] text-slate-500 block">Automated every 15 minutes</span>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Unsynced Queue
          </span>
          <p
            className={`font-extrabold text-sm ${
              unsyncedCount > 0 ? 'text-amber-600' : 'text-emerald-600'
            }`}
          >
            {unsyncedCount === 0 ? '0 pending (100% Reconciled)' : `${unsyncedCount} pending transactions`}
          </p>
          <span className="text-[11px] text-slate-500 block">Queue cleared upon manual or scheduled sync</span>
        </div>
      </div>

      {/* 3. Reconciliation Table (Source Record -> Accounting Entry, Matched/Unmatched) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1E42] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#075EE8]" /> General Ledger Reconciliation Matrix
            </h4>
            <p className="text-[11px] text-slate-500">
              Cross-verifies PrimeRoute operational dispatch records against QuickBooks Online chart of accounts entries
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            {reconciliationRows.length} Items Reconciled
          </span>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[880px]">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Source Record (PrimeRoute)</th>
                  <th className="py-2.5 px-3">Entity / Customer</th>
                  <th className="py-2.5 px-3">Source Date</th>
                  <th className="py-2.5 px-3 text-right">Local Amount</th>
                  <th className="py-2.5 px-3">Accounting Entry (QuickBooks Online)</th>
                  <th className="py-2.5 px-3 text-center">Match Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {reconciliationRows.map((row) => (
                  <tr key={row.id} className="hover:bg-blue-50/20">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#075EE8]">
                      {row.sourceId}
                      <span className="block text-[10px] font-sans font-normal text-slate-400">
                        {row.sourceType}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 font-semibold text-[#0A1E42]">
                      {row.entity}
                    </td>

                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                      {formatDate(row.sourceDate)}
                    </td>

                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 font-mono">
                      {formatCurrency(row.sourceAmount)}
                    </td>

                    <td className="py-2.5 px-3">
                      <span className="font-mono font-bold text-slate-800 block text-[11px]">
                        {row.qboId}
                      </span>
                      <span className="text-[10px] text-slate-500 block truncate max-w-[220px]">
                        {row.qboAccount}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          row.matchStatus === 'Matched'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {row.matchStatus === 'Matched' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                        )}
                        {row.matchStatus}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      {row.matchStatus === 'Matched' ? (
                        <button
                          onClick={() => alert(`Opening QuickBooks Online Ledger Entry ${row.qboId} in external QBO portal.`)}
                          className="text-[11px] font-bold text-[#075EE8] hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          View QBO <ExternalLink className="w-3 h-3" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setReconciliationRows((prev) =>
                              prev.map((r) =>
                                r.id === row.id
                                  ? {
                                      ...r,
                                      matchStatus: 'Matched',
                                      qboId: `QBO-SYNC-${Math.floor(1000 + Math.random() * 9000)}`,
                                      syncDate: 'Just now'
                                    }
                                  : r
                              )
                            );
                          }}
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold shadow-2xs cursor-pointer transition-all"
                        >
                          Push to QBO
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

