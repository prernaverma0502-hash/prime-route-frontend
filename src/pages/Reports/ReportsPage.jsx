import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Printer,
  Calendar,
  Filter,
  Car,
  Users,
  DollarSign,
  PieChart,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import { exportToCsv } from '../../utils/exportCsv';
import { formatCurrency } from '../../utils/formatters';

export default function ReportsPage() {
  const [selectedCategory, setSelectedCategory] = useState('revenue');
  const [dateFilter, setDateFilter] = useState('2025-YTD');

  const reportCategories = [
    { id: 'revenue', label: 'Revenue & Cashflow' },
    { id: 'profitability', label: '🚗 Vehicle Profitability (ROI)' },
    { id: 'pnl', label: '📊 Profit & Loss (P&L)' },
    { id: 'balance_sheet', label: '⚖️ Balance Sheet' },
    { id: 'utilization', label: 'Fleet Utilization' },
    { id: 'drivers', label: 'Driver Efficiency' },
  ];

  const profitabilityData = [
    { name: 'Toyota Camry SE', plate: 'PR-2024-TC', revenue: 14200, maintenance: 840, insurance: 1100, financing: 920, depreciation: 1400, netProfit: 9940, roi: 34.8, rentalDays: 168, downtimeDays: 12, revPac: 78.8 },
    { name: 'Honda Accord Sport', plate: 'PR-2024-HA', revenue: 13100, maintenance: 920, insurance: 1150, financing: 960, depreciation: 1450, netProfit: 8620, roi: 28.9, rentalDays: 155, downtimeDays: 25, revPac: 72.7 },
    { name: 'Tesla Model 3', plate: 'PR-2024-TM', revenue: 18400, maintenance: 380, insurance: 1650, financing: 1450, depreciation: 2200, netProfit: 12720, roi: 29.5, rentalDays: 172, downtimeDays: 8, revPac: 102.2 },
    { name: 'Chevrolet Tahoe', plate: 'PR-2024-CT', revenue: 16800, maintenance: 1420, insurance: 1850, financing: 1820, depreciation: 2800, netProfit: 8910, roi: 16.2, rentalDays: 140, downtimeDays: 40, revPac: 93.3 },
    { name: 'BMW 530i M Sport', plate: 'PR-2024-BM', revenue: 21500, maintenance: 1100, insurance: 2200, financing: 2100, depreciation: 3400, netProfit: 12700, roi: 19.5, rentalDays: 160, downtimeDays: 20, revPac: 119.4 },
  ];

  const utilizationData = [
    { name: 'Toyota Camry', rate: 92, trips: 142, revenue: 12400 },
    { name: 'Honda Accord', rate: 88, trips: 130, revenue: 11200 },
    { name: 'Tesla Model 3', rate: 85, trips: 118, revenue: 10800 },
    { name: 'Hyundai Sonata', rate: 78, trips: 96, revenue: 8900 },
    { name: 'Chevrolet Tahoe', rate: 72, trips: 78, revenue: 9400 },
    { name: 'Ford F-150', rate: 68, trips: 64, revenue: 7600 },
  ];

  const monthlyReportData = [
    { month: 'Jan', revenue: 27000, expense: 10500, profit: 16500 },
    { month: 'Feb', revenue: 33000, expense: 15500, profit: 17500 },
    { month: 'Mar', revenue: 36000, expense: 19000, profit: 17000 },
    { month: 'Apr', revenue: 34000, expense: 17000, profit: 17000 },
    { month: 'May', revenue: 38000, expense: 21000, profit: 17000 },
    { month: 'Jun', revenue: 43000, expense: 24000, profit: 19000 },
    { month: 'Jul', revenue: 48750, expense: 18420, profit: 30330 },
  ];

  const handleExport = () => {
    exportToCsv(`PrimeRoute_${selectedCategory}_Report`, utilizationData);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-slide-up duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0A1E42] tracking-tight">Executive Analytics &amp; Reports</h1>
          <p className="text-xs text-slate-500 mt-1">
            Audited financial telemetry, asset utilization ratios, driver efficiency indexes &amp; P&amp;L
          </p>
        </div>

        <div className="flex items-center gap-3 no-print">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all active:scale-95 duration-150"
          >
            <Printer className="w-4 h-4 text-slate-500" /> Print Report
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 duration-150"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Fleet Utilization Rate"
          value="84.6%"
          change="+3.2% vs last month"
          isPositive={true}
          icon={Car}
          iconBg="bg-blue-50 text-[#075EE8]"
        />
        <StatCard
          title="Average Yield / Vehicle"
          value="750"
          prefix="$"
          change="+12% YoY"
          isPositive={true}
          icon={TrendingUp}
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Fuel &amp; Upkeep / Mile"
          value="0.34"
          prefix="$"
          change="-4.1% reduction"
          isPositive={true}
          icon={DollarSign}
          iconBg="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          title="Active Contract Retention"
          value="96.2%"
          change="+1.5%"
          isPositive={true}
          icon={Users}
          iconBg="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Category selector & Filter bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] flex flex-col md:flex-row items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {reportCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-[#075EE8] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-[#075EE8] cursor-pointer"
          >
            <option value="2025-YTD">Year to Date (2025)</option>
            <option value="Q2-2025">Second Quarter (Q2)</option>
            <option value="Q1-2025">First Quarter (Q1)</option>
            <option value="2024-Full">Full Year 2024</option>
          </select>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#0A1E42]">
              {selectedCategory === 'revenue' ? 'Monthly Revenue vs Expenses vs Net Profit' : 'Fleet Vehicle Utilization Spectrum'}
            </h3>
            <p className="text-xs text-slate-500">Aggregate ledger figures for executive audit</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
            ↑ 14.8% Annualized Expansion
          </span>
        </div>

        <div className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyReportData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                formatter={(val, name) => [`$${val.toLocaleString()}`, name.toUpperCase()]}
                contentStyle={{
                  backgroundColor: '#071D49',
                  borderRadius: '10px',
                  border: 'none',
                  color: '#fff',
                  fontSize: '11px',
                }}
              />
              <Bar dataKey="revenue" fill="#075EE8" radius={[4, 4, 0, 0]} name="Revenue" />
              <Bar dataKey="expense" fill="#0A1E42" radius={[4, 4, 0, 0]} name="Expenses" />
              <Bar dataKey="profit" fill="#10B981" radius={[4, 4, 0, 0]} name="Net Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dynamic Breakdown Table based on Category */}
      {selectedCategory === 'profitability' ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#0A1E42] text-sm">Vehicle Lifecycle Profitability &amp; Cost Ledger</h3>
              <p className="text-xs text-slate-500">Gross revenue minus operating, insurance, maintenance, financing, and depreciation allocations</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">Full Fleet View</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase">
                  <th className="py-3 px-3">Vehicle</th>
                  <th className="py-3 px-3">Revenue</th>
                  <th className="py-3 px-3">Maintenance</th>
                  <th className="py-3 px-3">Insurance</th>
                  <th className="py-3 px-3">Financing</th>
                  <th className="py-3 px-3">Depreciation</th>
                  <th className="py-3 px-3">Net Profit</th>
                  <th className="py-3 px-3">ROI %</th>
                  <th className="py-3 px-3">Rented / Downtime</th>
                  <th className="py-3 px-3">RevPAC ($/day)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {profitabilityData.map((row) => (
                  <tr key={row.name} className="hover:bg-blue-50/20">
                    <td className="py-3 px-3">
                      <span className="font-bold text-[#0A1E42] block">{row.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{row.plate}</span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">{formatCurrency(row.revenue)}</td>
                    <td className="py-3 px-3 font-mono text-rose-600">-{formatCurrency(row.maintenance)}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">-{formatCurrency(row.insurance)}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">-{formatCurrency(row.financing)}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">-{formatCurrency(row.depreciation)}</td>
                    <td className="py-3 px-3 font-mono font-extrabold text-emerald-600">{formatCurrency(row.netProfit)}</td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg text-[10px]">
                        +{row.roi}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      <span className="text-emerald-600 font-bold">{row.rentalDays}d</span> / <span className="text-rose-500 font-semibold">{row.downtimeDays}d</span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[#075EE8]">${row.revPac}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : selectedCategory === 'pnl' ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden p-6 space-y-6">
          <div>
            <h3 className="font-bold text-[#0A1E42] text-base">Formal Profit &amp; Loss (P&amp;L) Statement</h3>
            <p className="text-xs text-slate-500">For the period ended July 31, 2025 • Standard US GAAP Fleet Reporting</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Revenue */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-[#075EE8] uppercase tracking-wider text-xs border-b border-blue-100 pb-1.5">
                Operating Revenue
              </h4>
              <div className="divide-y divide-slate-100 space-y-1.5">
                <div className="flex justify-between py-1 pt-2">
                  <span className="text-slate-600">Commercial Vehicle Rental Leases:</span>
                  <span className="font-bold text-slate-800">$442,500</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-600">Excess Mileage &amp; Fuel Surcharges:</span>
                  <span className="font-bold text-slate-800">$24,800</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-600">Tollway Administrative Recovery Fees:</span>
                  <span className="font-bold text-slate-800">$15,200</span>
                </div>
                <div className="flex justify-between py-2 font-bold text-sm text-[#075EE8] bg-blue-50/50 px-2 rounded-lg">
                  <span>Gross Operating Income:</span>
                  <span>$482,500</span>
                </div>
              </div>
            </div>

            {/* Expenses */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-rose-600 uppercase tracking-wider text-xs border-b border-rose-100 pb-1.5">
                Operating &amp; Fleet Expenses
              </h4>
              <div className="divide-y divide-slate-100 space-y-1.5">
                <div className="flex justify-between py-1 pt-2">
                  <span className="text-slate-600">Routine Fleet Maintenance &amp; 5k-mile Oil:</span>
                  <span className="font-bold text-slate-800">($46,200)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-600">Commercial Auto Fleet Insurance:</span>
                  <span className="font-bold text-slate-800">($58,000)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-600">Vehicle Acquisition Financing &amp; Interest:</span>
                  <span className="font-bold text-slate-800">($52,400)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-600">Fleet Asset Amortization &amp; Depreciation:</span>
                  <span className="font-bold text-slate-800">($72,600)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-600">General &amp; Administrative (G&amp;A):</span>
                  <span className="font-bold text-slate-800">($22,000)</span>
                </div>
                <div className="flex justify-between py-2 font-bold text-sm text-rose-600 bg-rose-50/50 px-2 rounded-lg">
                  <span>Total Operating Deductions:</span>
                  <span>($251,200)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-emerald-900">
            <div>
              <p className="text-sm font-extrabold">Net Operating Profit (EBITDA)</p>
              <p className="text-xs text-emerald-700">Healthy 47.9% operating margin across 65 fleet assets</p>
            </div>
            <span className="text-2xl font-black text-emerald-600 font-mono">+$231,300</span>
          </div>
        </div>
      ) : selectedCategory === 'balance_sheet' ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden p-6 space-y-6">
          <div>
            <h3 className="font-bold text-[#0A1E42] text-base">Corporate Balance Sheet</h3>
            <p className="text-xs text-slate-500">As of July 31, 2025 • Consolidated Fleet Asset &amp; Liability Statement</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
              <h4 className="font-bold text-[#0A1E42] uppercase text-xs">Assets</h4>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>Fleet Vehicles Book Value:</span>
                <span className="font-mono font-bold text-slate-800">$1,850,000</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>Cash &amp; Bank Operating Accounts:</span>
                <span className="font-mono font-bold text-slate-800">$340,500</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>Accounts Receivable (Invoices Due):</span>
                <span className="font-mono font-bold text-slate-800">$64,200</span>
              </div>
              <div className="flex justify-between py-2 font-bold text-sm text-[#075EE8]">
                <span>Total Corporate Assets:</span>
                <span>$2,254,700</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
              <h4 className="font-bold text-[#0A1E42] uppercase text-xs">Liabilities &amp; Equity</h4>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>Outstanding Commercial Vehicle Loans:</span>
                <span className="font-mono font-bold text-slate-800">$780,000</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>Driver Refundable Security Escrow:</span>
                <span className="font-mono font-bold text-blue-600">$24,000</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>Accounts Payable (Vendors / Shops):</span>
                <span className="font-mono font-bold text-slate-800">$32,100</span>
              </div>
              <div className="flex justify-between py-2 font-bold text-sm text-slate-800">
                <span>Total Liabilities:</span>
                <span>$836,100</span>
              </div>
              <div className="flex justify-between py-2 font-extrabold text-sm text-emerald-600 border-t border-slate-300">
                <span>Total Owner Equity:</span>
                <span>$1,418,600</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-[#0A1E42] text-sm">Asset Performance Ledger</h3>
            <span className="text-xs text-slate-400">Showing 6 Key Models</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase">
                  <th className="py-3 px-4">Vehicle Model</th>
                  <th className="py-3 px-4">Utilization Rate</th>
                  <th className="py-3 px-4">Completed Bookings</th>
                  <th className="py-3 px-4">Revenue Generated</th>
                  <th className="py-3 px-4">Efficiency Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {utilizationData.map((row) => (
                  <tr key={row.name} className="hover:bg-blue-50/20">
                    <td className="py-3 px-4 font-bold text-[#0A1E42]">{row.name}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#075EE8] h-full rounded-full"
                            style={{ width: `${row.rate}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-700">{row.rate}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{row.trips} Trips</td>
                    <td className="py-3 px-4 font-extrabold text-[#075EE8]">{formatCurrency(row.revenue)}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <ArrowUpRight className="w-3 h-3" /> High Yield
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

