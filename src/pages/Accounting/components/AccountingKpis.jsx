import React, { useState } from 'react';
import {
  TrendingUp,
  Wallet,
  DollarSign,
  Clock,
  ShieldAlert,
  Info,
  Search
} from 'lucide-react';
import StatCard from '../../../components/common/StatCard';
import { formatCurrency } from '../../../utils/formatters';

export default function AccountingKpis({
  totalIncome,
  totalExpenses,
  netProfit,
  totalPending,
  totalEscrowLiability = 2100,
  onTraceMetric
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* KPI 1: Operating Revenue (Traceable) */}
        <div
          onClick={() => onTraceMetric && onTraceMetric('revenue')}
          className="cursor-pointer group relative transition-transform hover:-translate-y-0.5"
          title="Click to trace source transactions for Total Revenue"
        >
          <StatCard
            title="Operating Revenue"
            value={totalIncome.toLocaleString()}
            prefix="$"
            change="+15.8% YTD"
            isPositive={true}
            icon={TrendingUp}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-50/90 border border-emerald-100"
            badge="🔍 Traceable"
            badgeColor="bg-emerald-50 text-emerald-700 border-emerald-200/80"
            subtitle="Excludes Escrow Deposits"
            progress={90}
            progressColor="bg-emerald-500"
          />
        </div>

        {/* KPI 2: Total Operating Expenses (Traceable) */}
        <div
          onClick={() => onTraceMetric && onTraceMetric('expenses')}
          className="cursor-pointer group relative transition-transform hover:-translate-y-0.5"
          title="Click to trace source transactions for Total Expenses"
        >
          <StatCard
            title="Total Expenses"
            value={totalExpenses.toLocaleString()}
            prefix="$"
            change="+6.2% YTD"
            isPositive={false}
            icon={Wallet}
            iconColor="text-[#075EE8]"
            iconBg="bg-blue-50/90 border border-blue-100"
            badge="🔍 Traceable"
            badgeColor="bg-blue-50 text-[#075EE8] border-blue-200/80"
            subtitle="Fuel, Fleet & Maintenance"
            progress={55}
            progressColor="bg-[#075EE8]"
          />
        </div>

        {/* KPI 3: Net Operational Profit (Traceable) */}
        <div
          onClick={() => onTraceMetric && onTraceMetric('profit')}
          className="cursor-pointer group relative transition-transform hover:-translate-y-0.5"
          title="Click to trace source transactions for Net Profit"
        >
          <StatCard
            title="Net Profit"
            value={netProfit.toLocaleString()}
            prefix="$"
            change="+18.4% YTD"
            isPositive={true}
            icon={DollarSign}
            iconColor="text-[#075EE8]"
            iconBg="bg-blue-50/90 border border-blue-100"
            badge="🔍 Traceable"
            badgeColor="bg-emerald-50 text-emerald-700 border-emerald-200/80"
            subtitle="Operational Cashflow"
            progress={75}
            progressColor="bg-emerald-600"
          />
        </div>

        {/* KPI 4: Pending Receivables / AR (Traceable) */}
        <div
          onClick={() => onTraceMetric && onTraceMetric('ar')}
          className="cursor-pointer group relative transition-transform hover:-translate-y-0.5"
          title="Click to trace source transactions for Pending AR"
        >
          <StatCard
            title="Pending AR"
            value={totalPending.toLocaleString()}
            prefix="$"
            change="4 Invoices"
            isPositive={false}
            icon={Clock}
            iconColor="text-amber-600"
            iconBg="bg-amber-50/90 border border-amber-100"
            badge="🔍 Traceable"
            badgeColor="bg-amber-50 text-amber-700 border-amber-200/80"
            subtitle="Awaiting Settlement"
            progress={30}
            progressColor="bg-amber-500"
          />
        </div>

        {/* KPI 5: Escrow Deposits (Liability - NOT Revenue) with Tooltip (Traceable) */}
        <div
          onClick={() => onTraceMetric && onTraceMetric('deposits')}
          className="cursor-pointer group relative transition-transform hover:-translate-y-0.5"
          title="Click to trace source deposit accounts"
        >
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-[0_2px_12px_rgba(7,29,73,0.04)] space-y-2 h-full flex flex-col justify-between hover:border-amber-400 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                Escrow Liabilities
              </span>
              <div className="relative">
                <button
                  type="button"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTooltip((prev) => !prev);
                  }}
                  className="p-1 rounded-full text-amber-600 hover:bg-amber-100 transition-colors"
                  title="Accounting Rule"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
                {showTooltip && (
                  <div className="absolute right-0 top-6 w-64 p-2.5 bg-slate-900 text-white rounded-xl shadow-xl text-[11px] z-50 leading-relaxed border border-slate-700">
                    <p className="font-bold text-amber-300">Liability Escrow Rule:</p>
                    <p>
                      Security deposits are held as balance sheet liabilities and are legally never counted as revenue.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <span className="text-xl font-black text-amber-950 font-mono block">
                {formatCurrency(totalEscrowLiability)}
              </span>
              <p className="text-[11px] text-amber-700 mt-0.5 flex items-center justify-between">
                <span>Customer Deposits</span>
                <span className="font-bold underline text-[10px]">🔍 Trace Source</span>
              </p>
            </div>

            <div className="pt-1 border-t border-amber-100 text-[10px] text-amber-800 flex items-center justify-between font-semibold">
              <span>Account 2100</span>
              <span className="px-1.5 py-0.2 bg-amber-100 rounded text-amber-800">Liability</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
