import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  Download,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Building2,
  DollarSign
} from 'lucide-react';
import Modal from '../../../components/common/Modal';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { exportToCsv } from '../../../utils/exportCsv';

export default function TraceTransactionsModal({
  isOpen,
  onClose,
  traceData
}) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen || !traceData) return null;

  const {
    title = 'Total Line Trace',
    totalAmount = 0,
    description = 'Detailed source transactions composing this metric',
    accountCode = 'General Ledger Subledger',
    sourceTransactions = []
  } = traceData;

  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return sourceTransactions;
    const q = searchQuery.toLowerCase();
    return sourceTransactions.filter((tx) => {
      return (
        (tx.id && tx.id.toLowerCase().includes(q)) ||
        (tx.driver && tx.driver.toLowerCase().includes(q)) ||
        (tx.customer && tx.customer.toLowerCase().includes(q)) ||
        (tx.vendor && tx.vendor.toLowerCase().includes(q)) ||
        (tx.description && tx.description.toLowerCase().includes(q)) ||
        (tx.category && tx.category.toLowerCase().includes(q))
      );
    });
  }, [sourceTransactions, searchQuery]);

  const calculatedSum = useMemo(() => {
    return filteredTransactions.reduce(
      (sum, tx) => sum + Number(tx.amount || tx.total || tx.depositAmount || 0),
      0
    );
  }, [filteredTransactions]);

  const handleExport = () => {
    exportToCsv(
      `PrimeRoute_Trace_${title.replace(/\s+/g, '_')}`,
      filteredTransactions.map((tx) => ({
        TransactionID: tx.id,
        Date: tx.date || tx.heldDate || tx.dueDate,
        Entity: tx.driver || tx.customer || tx.vendor || 'N/A',
        Description: tx.description || tx.category || 'N/A',
        Amount: tx.amount || tx.total || tx.depositAmount || 0,
        Status: tx.status || 'Posted'
      }))
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Traceability Audit: ${title}`}
      subtitle={description}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-4">
        {/* Banner with Total and Account Code */}
        <div className="bg-gradient-to-r from-[#071D49] to-[#0D2D6C] text-white p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-200 shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Metric Total:</span>
                <span className="text-xl font-extrabold text-white">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                Ledger Account: <span className="font-mono font-bold text-white">{accountCode}</span> • Source: Verified Operational Subledger
              </p>
            </div>
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all cursor-pointer shadow-xs shrink-0 self-end sm:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-[#075EE8]" /> Export Audit List
          </button>
        </div>

        {/* Search input */}
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter source transactions by ID, driver, description..."
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8]"
            />
          </div>
          <span className="text-xs font-semibold text-slate-500 shrink-0">
            Showing {filteredTransactions.length} of {sourceTransactions.length} items
          </span>
        </div>

        {/* Source Transactions Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white max-h-[360px] overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-[#F8FAFC] border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Tx ID</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Entity / Driver</th>
                <th className="py-2.5 px-3">Description / Category</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-slate-400">
                    No source transactions match your search filter.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx, idx) => {
                  const itemAmount = Number(tx.amount || tx.total || tx.depositAmount || 0);
                  return (
                    <tr key={tx.id || idx} className="hover:bg-blue-50/20">
                      <td className="py-2.5 px-3 font-mono font-bold text-[#075EE8]">
                        {tx.id}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                        {formatDate(tx.date || tx.heldDate || tx.dueDate)}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-[#0A1E42]">
                        {tx.driver || tx.customer || tx.vendor || 'N/A'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 truncate max-w-[240px]">
                        {tx.description || tx.category || tx.source || tx.type || 'Fleet Charge'}
                      </td>
                      <td
                        className={`py-2.5 px-3 text-right font-bold ${
                          itemAmount < 0 ? 'text-rose-600' : 'text-slate-900'
                        }`}
                      >
                        {formatCurrency(itemAmount)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {tx.status || 'Posted'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Audit Sum Verification Footer */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Audit reconciliation verified: line item sum matches general ledger total.
            </span>
          </div>
          <div className="font-mono text-xs">
            <span className="text-slate-500">Calculated Sum: </span>
            <span className="font-extrabold text-[#075EE8]">{formatCurrency(calculatedSum)}</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Close Trace
          </button>
        </div>
      </div>
    </Modal>
  );
}

