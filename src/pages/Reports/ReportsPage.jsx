import React, { useState, useMemo } from 'react';
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
  PieChart as PieChartIcon,
  ArrowUpRight,
  ShieldAlert,
  FileText,
  Clock,
  Layers,
  Wrench,
  Receipt,
  Folders,
  Briefcase,
  KeyRound,
  FileSpreadsheet,
  ChevronDown,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import { exportToCsv } from '../../utils/exportCsv';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  mockVehicles,
  mockDrivers,
  initialRentals,
  initialExpenses,
  initialAccidents,
  initialVendors,
  initialTolls,
  initialComplianceItems
} from '../../data/mockData';
import Can from '../../auth/Can';
import { useRole } from '../../context/RoleContext';

const PRIMARY_TABS = [
  { id: 'overview', label: 'Executive Overview', icon: BarChart3 },
  { id: 'vehicles', label: 'Vehicles & Utilization', icon: Car },
  { id: 'financial', label: 'Financial Statements (P&L / Balance Sheet)', icon: DollarSign },
  { id: 'maintenance', label: 'Maintenance & Service', icon: Wrench },
  { id: 'more', label: 'Specialized Reports', icon: Layers },
];

const MORE_REPORT_TYPES = [
  { id: 'drivers', label: 'Driver Statements', icon: Users },
  { id: 'receivables_payables', label: 'Receivables & Payables (AR/AP)', icon: DollarSign },
  { id: 'tolls_tickets', label: 'Tolls & Violations Reconciliation', icon: Receipt },
  { id: 'document_expiry', label: 'Document Expiration Schedule', icon: Folders },
  { id: 'contract_expiry', label: 'Lease Contract Expiration', icon: KeyRound },
  { id: 'vendor_spending', label: 'Vendor & Supplier Spending', icon: Briefcase },
];

const EXPENSE_DONUT_DATA = [
  { name: 'Vehicle Depreciation', value: 72600, color: '#075EE8' },
  { name: 'Commercial Insurance', value: 58000, color: '#38BDF8' },
  { name: 'Acquisition Financing', value: 52400, color: '#6366F1' },
  { name: 'Routine & Repair Maintenance', value: 46200, color: '#F59E0B' },
  { name: 'General & Administrative (G&A)', value: 22000, color: '#10B981' },
];

export default function ReportsPage() {
  const { currentRoleId } = useRole();

  // Primary tab & sub-report state
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'vehicles' | 'financial' | 'maintenance' | 'more'
  const [moreReportType, setMoreReportType] = useState('drivers');

  // Filters state (Requirement 7)
  const [dateFilter, setDateFilter] = useState('2025-YTD');
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-07-31');
  const [selectedVehicle, setSelectedVehicle] = useState('All');

  // Master Vehicle Profitability & Lifecycle Data
  const baseProfitabilityData = [
    { id: 'VEH-001', name: 'Toyota Camry SE', plate: 'PR-2024-TC', revenue: 14200, maintenance: 840, insurance: 1100, financing: 920, depreciation: 1400, netProfit: 9940, roi: 34.8, rentalDays: 168, downtimeDays: 12, revPac: 78.8, utilizationRate: 92 },
    { id: 'VEH-002', name: 'Honda Accord Sport', plate: 'PR-2024-HA', revenue: 13100, maintenance: 920, insurance: 1150, financing: 960, depreciation: 1450, netProfit: 8620, roi: 28.9, rentalDays: 155, downtimeDays: 25, revPac: 72.7, utilizationRate: 88 },
    { id: 'VEH-005', name: 'Tesla Model 3', plate: 'PR-2024-TM', revenue: 18400, maintenance: 380, insurance: 1650, financing: 1450, depreciation: 2200, netProfit: 12720, roi: 29.5, rentalDays: 172, downtimeDays: 8, revPac: 102.2, utilizationRate: 95 },
    { id: 'VEH-006', name: 'Chevrolet Tahoe', plate: 'PR-2024-CT', revenue: 16800, maintenance: 1420, insurance: 1850, financing: 1820, depreciation: 2800, netProfit: 8910, roi: 16.2, rentalDays: 140, downtimeDays: 40, revPac: 93.3, utilizationRate: 78 },
    { id: 'VEH-008', name: 'BMW 530i M Sport', plate: 'PR-2024-BM', revenue: 21500, maintenance: 1100, insurance: 2200, financing: 2100, depreciation: 3400, netProfit: 12700, roi: 19.5, rentalDays: 160, downtimeDays: 20, revPac: 119.4, utilizationRate: 85 },
    { id: 'VEH-003', name: 'Ford F-150 SuperCab', plate: 'PR-2024-FF', revenue: 12600, maintenance: 1150, insurance: 1250, financing: 1100, depreciation: 1800, netProfit: 7300, roi: 18.2, rentalDays: 135, downtimeDays: 45, revPac: 70.0, utilizationRate: 75 },
  ];

  // Filtered Vehicle Profitability based on vehicle filter
  const profitabilityData = useMemo(() => {
    if (selectedVehicle === 'All') return baseProfitabilityData;
    return baseProfitabilityData.filter(
      (v) => v.name === selectedVehicle || v.plate === selectedVehicle || selectedVehicle.includes(v.name)
    );
  }, [selectedVehicle]);

  // Monthly Overview Ledger Data
  const monthlyReportData = [
    { month: 'Jan', revenue: 27000, expense: 10500, profit: 16500 },
    { month: 'Feb', revenue: 33000, expense: 15500, profit: 17500 },
    { month: 'Mar', revenue: 36000, expense: 19000, profit: 17000 },
    { month: 'Apr', revenue: 34000, expense: 17000, profit: 17000 },
    { month: 'May', revenue: 38000, expense: 21000, profit: 17000 },
    { month: 'Jun', revenue: 43000, expense: 24000, profit: 19000 },
    { month: 'Jul', revenue: 48750, expense: 18420, profit: 30330 },
  ];

  // Driver Statements Data
  const driverStatementsData = [
    { id: 'DRV-103', name: 'Sarah Jenkins', contract: 'RNT-2025-001', vehicle: 'Toyota Camry (PR-2024-TC)', earnings: 6420, rentDeduction: 2800, tollDeductions: 125, fuelReimbursement: 180, netPayout: 3675, depositBalance: 1000, status: 'Current' },
    { id: 'DRV-102', name: 'David Miller', contract: 'RNT-2024-098', vehicle: 'Honda Accord (PR-2024-HA)', earnings: 5890, rentDeduction: 2750, tollDeductions: 85, fuelReimbursement: 0, netPayout: 3055, depositBalance: 1000, status: 'Current' },
    { id: 'DRV-106', name: 'Michael Chang', contract: 'RNT-2025-002', vehicle: 'Tesla Model 3 (PR-2024-TM)', earnings: 8150, rentDeduction: 3400, tollDeductions: 45, fuelReimbursement: 220, netPayout: 4925, depositBalance: 1200, status: 'Current' },
    { id: 'DRV-108', name: 'James Wilson', contract: 'RNT-2025-098', vehicle: 'Ford F-150 (PR-2024-FF)', earnings: 4920, rentDeduction: 2600, tollDeductions: 110, fuelReimbursement: 90, netPayout: 2300, depositBalance: 1000, status: 'Current' },
    { id: 'DRV-104', name: 'Alexander Reed', contract: 'RNT-2025-091', vehicle: 'Tesla Model 3 (PR-2024-TM)', earnings: 5100, rentDeduction: 2850, tollDeductions: 195, fuelReimbursement: 0, netPayout: 2055, depositBalance: 1200, status: 'Pending Review' },
  ];

  // Receivables / Payables Data (AR/AP)
  const arAgingData = [
    { period: 'Current (0-30 Days)', receivables: 42100, payables: 21500 },
    { period: '31-60 Days', receivables: 14200, payables: 8200 },
    { period: '61-90 Days', receivables: 5400, payables: 2400 },
    { period: '90+ Days Past Due', receivables: 2500, payables: 0 },
  ];

  // Maintenance Service Records Data
  const maintenanceReportData = [
    { id: 'MNT-101', vehicle: 'Toyota Camry SE', type: '5,000-Mile Oil & Filter Service', completedDate: '2025-07-02', shop: 'Speedy Pro Auto Clinic', partsCost: 85, laborCost: 75, total: 160, turnaroundHours: 3.5, status: 'Completed' },
    { id: 'MNT-102', vehicle: 'Honda Accord Sport', type: 'Front Brake Pads & Rotor Resurfacing', completedDate: '2025-06-28', shop: 'Brembo Certified Hub', partsCost: 220, laborCost: 180, total: 400, turnaroundHours: 6.0, status: 'Completed' },
    { id: 'MNT-103', vehicle: 'Chevrolet Tahoe', type: 'Transmission Fluid & Transfer Case Flush', completedDate: '2025-07-05', shop: 'Chevy Master Service', partsCost: 310, laborCost: 240, total: 550, turnaroundHours: 8.5, status: 'Completed' },
    { id: 'MNT-104', vehicle: 'Tesla Model 3', type: 'Cabin HEPA Filter & Tire Rotation', completedDate: '2025-07-08', shop: 'Tesla Mobile Service', partsCost: 110, laborCost: 90, total: 200, turnaroundHours: 2.0, status: 'Completed' },
  ];

  // Tolls & Violations Summary
  const tollsSummaryData = [
    { authority: 'Port Authority of NY & NJ (GWB / Lincoln / Holland)', citations: 42, incurredAmount: 672.00, recoveredFromDrivers: 672.00, adminFeesCollected: 315.00, outstandingBalance: 0.00, status: 'Reconciled' },
    { authority: 'MTA Bridges and Tunnels (RFK / Queens Midtown)', citations: 28, incurredAmount: 266.00, recoveredFromDrivers: 242.00, adminFeesCollected: 210.00, outstandingBalance: 24.00, status: 'Under Review' },
    { authority: 'Illinois Tollway Authority (I-90 / I-294)', citations: 15, incurredAmount: 112.50, recoveredFromDrivers: 112.50, adminFeesCollected: 112.50, outstandingBalance: 0.00, status: 'Reconciled' },
    { authority: 'NYC Dept of Finance (Bus Lane / Red Light Cameras)', citations: 6, incurredAmount: 510.00, recoveredFromDrivers: 385.00, adminFeesCollected: 90.00, outstandingBalance: 125.00, status: 'Disputed' },
  ];

  // Vendor Spending Summary
  const vendorSpendingData = [
    { vendor: 'Speedy Pro Auto Clinic', category: 'Repairs & Mechanics', ytdSpend: 18450, invoiceCount: 14, lastInvoice: '2025-07-05', paymentTerms: 'Net 30', status: 'Preferred' },
    { vendor: 'Travelers Commercial Auto', category: 'Fleet Insurance', ytdSpend: 34200, invoiceCount: 7, lastInvoice: '2025-07-01', paymentTerms: 'Auto-Debit', status: 'Contracted' },
    { vendor: 'Shell Commercial Fleet Card', category: 'Fuel & Depot Fluid', ytdSpend: 14200, invoiceCount: 28, lastInvoice: '2025-07-10', paymentTerms: 'Weekly', status: 'Active' },
    { vendor: 'Empire Tire & Wholesale Parts', category: 'Tires & Brakes', ytdSpend: 9800, invoiceCount: 9, lastInvoice: '2025-06-29', paymentTerms: 'Net 15', status: 'Preferred' },
    { vendor: 'NYC TLC Regulatory Agency', category: 'Inspection Decals & Permits', ytdSpend: 4200, invoiceCount: 6, lastInvoice: '2025-06-15', paymentTerms: 'Immediate', status: 'Government' },
  ];

  // Contract Expiration Pipeline Data
  const contractExpiryData = [
    { contractId: 'RNT-2025-088', customer: 'Apex Logistics LLC', vehicle: 'Toyota Camry (PR-2024-TC)', weeklyRate: 420, expiryDate: '2025-07-16', daysRemaining: 4, depositHeld: 1500, renewalStatus: 'Extension Addendum Sent' },
    { contractId: 'RNT-2025-091', customer: 'Alexander Reed', vehicle: 'Tesla Model 3 (PR-2024-TM)', weeklyRate: 490, expiryDate: '2025-07-23', daysRemaining: 11, depositHeld: 1200, renewalStatus: 'Driver Verbal Renewal' },
    { contractId: 'RNT-2025-079', customer: 'Metro Courier Corp', vehicle: 'Ford Transit 250', weeklyRate: 550, expiryDate: '2025-08-03', daysRemaining: 22, depositHeld: 2000, renewalStatus: 'Quarterly Review Pending' },
    { contractId: 'RNT-2025-001', customer: 'Sarah Jenkins', vehicle: 'Toyota Camry SE', weeklyRate: 400, expiryDate: '2025-11-15', daysRemaining: 126, depositHeld: 1000, renewalStatus: 'Active Good Standing' },
  ];

  // Export CSV Handler
  const handleExportCsv = () => {
    let filename = `PrimeRoute_${activeTab}_Report`;
    let rows = [];

    if (activeTab === 'overview' || activeTab === 'financial') {
      filename = 'PrimeRoute_PnL_Financial_Statement';
      rows = monthlyReportData;
    } else if (activeTab === 'vehicles') {
      filename = 'PrimeRoute_Vehicle_Profitability_Report';
      rows = profitabilityData;
    } else if (activeTab === 'maintenance') {
      filename = 'PrimeRoute_Maintenance_Report';
      rows = maintenanceReportData;
    } else if (activeTab === 'more') {
      if (moreReportType === 'drivers') {
        filename = 'PrimeRoute_Driver_Statements';
        rows = driverStatementsData;
      } else if (moreReportType === 'receivables_payables') {
        filename = 'PrimeRoute_AR_AP_Aging_Report';
        rows = arAgingData;
      } else if (moreReportType === 'tolls_tickets') {
        filename = 'PrimeRoute_Tolls_Violations_Report';
        rows = tollsSummaryData;
      } else if (moreReportType === 'document_expiry') {
        filename = 'PrimeRoute_Document_Expiry_Schedule';
        rows = initialComplianceItems;
      } else if (moreReportType === 'contract_expiry') {
        filename = 'PrimeRoute_Contract_Expiry_Pipeline';
        rows = contractExpiryData;
      } else if (moreReportType === 'vendor_spending') {
        filename = 'PrimeRoute_Vendor_Spending_Report';
        rows = vendorSpendingData;
      }
    }

    exportToCsv(filename, rows);
  };

  // Export Excel Handler (Simulated XML-based Spreadsheet)
  const handleExportExcel = () => {
    handleExportCsv();
  };

  // Export PDF Handler
  const handleExportPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-slide-up duration-300">
      {/* Print Specific CSS Rules */}
      <style>{`
        @media print {
          nav, aside, header, .no-print, button, input, select {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .print-area {
            display: block !important;
            width: 100% !important;
          }
        }
      `}</style>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-black text-[#0A1E42] tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-[#075EE8]" />
            Executive Reports &amp; Financial Telemetry
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Audited P&amp;L, balance sheet, vehicle profitability, driver statements, and compliance analytics
          </p>
        </div>

        {/* Action Controls & Export Buttons (Requirement 7: Only roles with export permission see export buttons) */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition-all active:scale-95 cursor-pointer"
            title="Print Executive Report"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print View</span>
          </button>

          {/* Export Permission Guard */}
          <Can module="reports" do="export">
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleExportCsv}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition-all active:scale-95 cursor-pointer"
                title="Export to CSV"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>CSV</span>
              </button>

              <button
                onClick={handleExportExcel}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 text-xs font-bold text-emerald-800 hover:bg-emerald-100 shadow-2xs transition-all active:scale-95 cursor-pointer"
                title="Export to Excel Spreadsheet"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span>Excel</span>
              </button>

              <button
                onClick={handleExportPdf}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 cursor-pointer"
                title="Export / Print PDF"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            </div>
          </Can>
        </div>
      </div>

      {/* KPI Stats (Requirement 6: Key Financial Metrics) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp}
          label="Total Fleet Revenue (YTD)"
          value="$482,500"
          change="+14.8% YoY Expansion"
          isPositive={true}
          color="blue"
        />
        <StatCard
          icon={DollarSign}
          label="Operating Net Profit (EBITDA)"
          value="$231,300"
          change="47.9% Operating Margin"
          isPositive={true}
          color="emerald"
        />
        <StatCard
          icon={Car}
          label="Fleet Utilization Rate"
          value="84.6%"
          change="55 Active / 65 Fleet Assets"
          isPositive={true}
          color="indigo"
        />
        <StatCard
          icon={Clock}
          label="AR / AP Aging Balance"
          value="$64,200 AR"
          change="$32,100 Vendor AP"
          isPositive={false}
          color="amber"
        />
      </div>

      {/* Date Range & Vehicle Filters Bar (Requirement 7) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] flex flex-col md:flex-row items-center justify-between gap-4 no-print">
        {/* Primary Tabs (Requirement 6: Overview, Vehicles, Financial, Maintenance, More) */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {PRIMARY_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filter Controls (Requirement 7) */}
        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap justify-end">
          {/* Vehicle Filter Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl">
            <Car className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
              title="Filter by Vehicle"
            >
              <option value="All">All Vehicles (Full Fleet)</option>
              {baseProfitabilityData.map((v) => (
                <option key={v.id} value={v.name}>
                  {v.name} ({v.plate})
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Preset */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
              title="Date Range"
            >
              <option value="2025-YTD">Year to Date (2025)</option>
              <option value="Q2-2025">Second Quarter (Q2)</option>
              <option value="Q1-2025">First Quarter (Q1)</option>
              <option value="Last-30">Last 30 Days</option>
              <option value="Full-2024">Full Year 2024</option>
            </select>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: OVERVIEW TAB
          Includes: Key metrics, Monthly Revenue vs Expenses, Utilization Gauge
         ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Charts Row: Monthly Revenue vs Expenses & Fleet Utilization Gauge */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monthly Trend Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-extrabold text-[#0A1E42]">
                    Monthly Revenue, Expenses &amp; Net Margin
                  </h3>
                  <p className="text-xs text-slate-500">Consolidated financial performance across active fleet operations</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  ↑ 14.8% YoY
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
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Bar dataKey="revenue" fill="#075EE8" radius={[4, 4, 0, 0]} name="Gross Revenue" />
                    <Bar dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} name="Operating Expenses" />
                    <Bar dataKey="profit" fill="#10B981" radius={[4, 4, 0, 0]} name="Net Operating Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Requirement 6: Utilization Gauge */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] flex flex-col justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#0A1E42]">
                  Fleet Utilization Gauge
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Active deployment ratio vs. idle assets</p>

                {/* Circular / Radial Gauge Simulation */}
                <div className="py-6 flex flex-col items-center justify-center">
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background Track */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#F1F5F9"
                        strokeWidth="12"
                        fill="transparent"
                      />
                      {/* Active Rented Arc (84.6%) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#075EE8"
                        strokeWidth="12"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 * (1 - 0.846)}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-3xl font-black text-[#0A1E42] font-mono tracking-tight">
                        84.6%
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                        Active Utilization
                      </span>
                    </div>
                  </div>

                  <div className="w-full space-y-2 mt-4 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-blue-50 text-blue-900 font-bold">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#075EE8]" />
                        Active on Lease (55 units)
                      </span>
                      <span>84.6%</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 text-emerald-900 font-bold">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        Available for Dispatch (6 units)
                      </span>
                      <span>8.4%</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-rose-50 text-rose-900 font-bold">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        Maintenance Downtime (4 units)
                      </span>
                      <span>7.0%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: VEHICLES & UTILIZATION TAB
          Includes: Profit by vehicle bar chart, Revenue & expenses by vehicle, Utilization and downtime
         ========================================================================= */}
      {activeTab === 'vehicles' && (
        <div className="space-y-6">
          {/* Requirement 6: Profit by Vehicle Bar Chart */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-extrabold text-[#0A1E42]">
                  Net Profit Yield by Vehicle Asset ($)
                </h3>
                <p className="text-xs text-slate-500">Gross revenue generated minus direct maintenance, insurance, financing, and depreciation</p>
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                Top Model: Tesla Model 3 ($12,720 Net)
              </span>
            </div>

            <div className="w-full h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profitabilityData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    formatter={(val) => [`$${val.toLocaleString()}`, 'Net Profit']}
                    contentStyle={{
                      backgroundColor: '#071D49',
                      borderRadius: '10px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="netProfit" fill="#10B981" radius={[6, 6, 0, 0]} name="Net Profit" />
                  <Bar dataKey="revenue" fill="#075EE8" radius={[6, 6, 0, 0]} name="Gross Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Requirement 5: Revenue and Expenses by Vehicle Report */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-[#0A1E42] text-sm">
                  Vehicle-by-Vehicle Lifecycle Profitability &amp; Cost Ledger
                </h3>
                <p className="text-xs text-slate-500">Detailed breakdown of operating yield, maintenance upkeep, financing, and RevPAC</p>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                Showing {profitabilityData.length} Units
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
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
                    <tr key={row.name} className="hover:bg-blue-50/20 transition-colors">
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
        </div>
      )}

      {/* =========================================================================
          TAB 3: FINANCIAL STATEMENTS TAB
          Includes: Profit and Loss (P&L), Balance Sheet (summary), Expenses donut chart
         ========================================================================= */}
      {activeTab === 'financial' && (
        <div className="space-y-6">
          {/* Requirement 6: Expenses Breakdown Donut Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)]">
              <h3 className="text-base font-extrabold text-[#0A1E42]">
                Operating Expenses Breakdown (Donut)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Cost allocations across fleet asset lifecycle ($251,200 Total)</p>

              <div className="w-full h-[260px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={EXPENSE_DONUT_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {EXPENSE_DONUT_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Balance Snapshot */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] space-y-4">
              <h3 className="text-base font-extrabold text-[#0A1E42]">
                Key Financial Telemetry
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                  <span className="text-slate-600">Gross Fleet Yield:</span>
                  <span className="font-mono font-bold text-slate-900">$482,500</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                  <span className="text-slate-600">Fleet Opex Deductions:</span>
                  <span className="font-mono font-bold text-rose-600">($251,200)</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl flex justify-between items-center">
                  <span className="font-bold text-emerald-900">EBITDA Net Profit:</span>
                  <span className="font-mono font-black text-emerald-600 text-sm">+$231,300</span>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl flex justify-between items-center">
                  <span className="font-bold text-blue-900">Total Owner Equity:</span>
                  <span className="font-mono font-black text-blue-700 text-sm">$1,418,600</span>
                </div>
              </div>
            </div>
          </div>

          {/* Requirement 5: Formal Profit and Loss (P&L) Statement */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden p-6 space-y-6">
            <div>
              <h3 className="font-extrabold text-[#0A1E42] text-base">Formal Profit &amp; Loss (P&amp;L) Statement</h3>
              <p className="text-xs text-slate-500">Period Ended July 31, 2025 • Standard US GAAP Commercial Fleet Reporting</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Operating Revenue */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-[#075EE8] uppercase tracking-wider text-xs border-b border-blue-100 pb-1.5">
                  Operating Fleet Revenue
                </h4>
                <div className="divide-y divide-slate-100 space-y-1.5">
                  <div className="flex justify-between py-1 pt-2">
                    <span className="text-slate-600">Commercial Vehicle Rental Contracts:</span>
                    <span className="font-mono font-bold text-slate-800">$442,500</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600">Excess Mileage &amp; Refuel Surcharges:</span>
                    <span className="font-mono font-bold text-slate-800">$24,800</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600">Tollway Administrative Recovery Surcharges:</span>
                    <span className="font-mono font-bold text-slate-800">$15,200</span>
                  </div>
                  <div className="flex justify-between py-2 font-bold text-sm text-[#075EE8] bg-blue-50/50 px-2.5 rounded-xl">
                    <span>Gross Operating Income:</span>
                    <span className="font-mono">$482,500</span>
                  </div>
                </div>
              </div>

              {/* Operating Expenses */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-rose-600 uppercase tracking-wider text-xs border-b border-rose-100 pb-1.5">
                  Operating &amp; Direct Fleet Expenses
                </h4>
                <div className="divide-y divide-slate-100 space-y-1.5">
                  <div className="flex justify-between py-1 pt-2">
                    <span className="text-slate-600">Routine Fleet Maintenance &amp; 5,000-mi Service:</span>
                    <span className="font-mono font-bold text-slate-800">($46,200)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600">Commercial Fleet Master Insurance Premiums:</span>
                    <span className="font-mono font-bold text-slate-800">($58,000)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600">Vehicle Acquisition Financing &amp; Interest:</span>
                    <span className="font-mono font-bold text-slate-800">($52,400)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600">Fleet Asset Amortization &amp; Depreciation:</span>
                    <span className="font-mono font-bold text-slate-800">($72,600)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600">General, Administrative &amp; Software (G&amp;A):</span>
                    <span className="font-mono font-bold text-slate-800">($22,000)</span>
                  </div>
                  <div className="flex justify-between py-2 font-bold text-sm text-rose-600 bg-rose-50/50 px-2.5 rounded-xl">
                    <span>Total Operating Deductions:</span>
                    <span className="font-mono">($251,200)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-emerald-900">
              <div>
                <p className="text-sm font-extrabold">Net Operating Profit (EBITDA)</p>
                <p className="text-xs text-emerald-700">Healthy 47.9% operating margin across 65 active fleet assets</p>
              </div>
              <span className="text-2xl font-black text-emerald-600 font-mono">+$231,300</span>
            </div>
          </div>

          {/* Requirement 5: Balance Sheet (Summary) */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden p-6 space-y-6">
            <div>
              <h3 className="font-extrabold text-[#0A1E42] text-base">Corporate Balance Sheet (Summary)</h3>
              <p className="text-xs text-slate-500">As of July 31, 2025 • Consolidated Fleet Asset &amp; Liability Statement</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                <h4 className="font-bold text-[#0A1E42] uppercase text-xs border-b pb-1">Assets</h4>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span>Fleet Vehicles Net Book Value (65 Units):</span>
                  <span className="font-mono font-bold text-slate-800">$1,850,000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span>Cash &amp; Bank Operating Accounts:</span>
                  <span className="font-mono font-bold text-slate-800">$340,500</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span>Accounts Receivable (Invoices &amp; Balances Due):</span>
                  <span className="font-mono font-bold text-slate-800">$64,200</span>
                </div>
                <div className="flex justify-between py-2 font-bold text-sm text-[#075EE8]">
                  <span>Total Corporate Assets:</span>
                  <span className="font-mono">$2,254,700</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                <h4 className="font-bold text-[#0A1E42] uppercase text-xs border-b pb-1">Liabilities &amp; Equity</h4>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span>Outstanding Commercial Vehicle Loans:</span>
                  <span className="font-mono font-bold text-slate-800">$780,000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span>Driver Refundable Security Deposit Escrow:</span>
                  <span className="font-mono font-bold text-blue-600">$24,000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span>Accounts Payable (Mechanics / Parts / Insurance):</span>
                  <span className="font-mono font-bold text-slate-800">$32,100</span>
                </div>
                <div className="flex justify-between py-2 font-bold text-sm text-slate-800">
                  <span>Total Liabilities:</span>
                  <span className="font-mono">$836,100</span>
                </div>
                <div className="flex justify-between py-2 font-extrabold text-sm text-emerald-600 border-t border-slate-300">
                  <span>Total Owner Equity:</span>
                  <span className="font-mono">$1,418,600</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: MAINTENANCE & SERVICE TAB
          Includes: Maintenance cadence, oil change status, workshop expenditure
         ========================================================================= */}
      {activeTab === 'maintenance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-[#0A1E42] text-sm">
                  Maintenance &amp; Workshop Repair Telemetry
                </h3>
                <p className="text-xs text-slate-500">Scheduled 5,000-mile services, brake overhauls, parts vs. labor costs, and turnaround times</p>
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                YTD Maintenance: $46,200
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Order ID &amp; Date</th>
                    <th className="py-3 px-4">Vehicle</th>
                    <th className="py-3 px-4">Service Description</th>
                    <th className="py-3 px-4">Workshop Facility</th>
                    <th className="py-3 px-4">Parts Cost</th>
                    <th className="py-3 px-4">Labor Cost</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Turnaround</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {maintenanceReportData.map((m) => (
                    <tr key={m.id} className="hover:bg-blue-50/20 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-blue-700 block">{m.id}</span>
                        <span className="text-[10px] text-slate-400">{formatDate(m.completedDate)}</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#0A1E42]">{m.vehicle}</td>
                      <td className="py-3 px-4 text-slate-700 font-medium">{m.type}</td>
                      <td className="py-3 px-4 text-slate-600">{m.shop}</td>
                      <td className="py-3 px-4 font-mono">${m.partsCost}</td>
                      <td className="py-3 px-4 font-mono">${m.laborCost}</td>
                      <td className="py-3 px-4 font-mono font-extrabold text-[#0A1E42]">${m.total}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{m.turnaroundHours} hrs</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={m.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: SPECIALIZED REPORTS (MORE)
          Includes: Driver statements, Receivables/payables, Tolls/tickets, Document expiry, Contract expiry, Vendor spending
         ========================================================================= */}
      {activeTab === 'more' && (
        <div className="space-y-6">
          {/* Sub-Report Navigation Selector */}
          <div className="bg-white rounded-2xl p-2 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] flex items-center gap-1.5 overflow-x-auto no-print">
            {MORE_REPORT_TYPES.map((sub) => {
              const Icon = sub.icon;
              const isSelected = moreReportType === sub.id;

              return (
                <button
                  key={sub.id}
                  onClick={() => setMoreReportType(sub.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{sub.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sub-Report 1: Driver Statements (Requirement 5) */}
          {moreReportType === 'drivers' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-[#0A1E42] text-sm">Driver Earnings, Charges &amp; Statements</h3>
                  <p className="text-xs text-slate-500">Gross revenue minus rental leasing deductions, toll charges, and deposit balances</p>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {driverStatementsData.length} Active Driver Ledgers
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Driver Name &amp; ID</th>
                      <th className="py-3 px-4">Assigned Vehicle</th>
                      <th className="py-3 px-4">Gross Earnings</th>
                      <th className="py-3 px-4">Rent Deductions</th>
                      <th className="py-3 px-4">Toll Deductions</th>
                      <th className="py-3 px-4">Net Payout</th>
                      <th className="py-3 px-4">Security Escrow</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {driverStatementsData.map((d) => (
                      <tr key={d.id} className="hover:bg-blue-50/20 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-bold text-[#0A1E42] block">{d.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{d.id} • {d.contract}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-700">{d.vehicle}</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">{formatCurrency(d.earnings)}</td>
                        <td className="py-3 px-4 font-mono text-rose-600">-{formatCurrency(d.rentDeduction)}</td>
                        <td className="py-3 px-4 font-mono text-rose-600">-{formatCurrency(d.tollDeductions)}</td>
                        <td className="py-3 px-4 font-mono font-extrabold text-emerald-600">{formatCurrency(d.netPayout)}</td>
                        <td className="py-3 px-4 font-mono font-bold text-blue-700">{formatCurrency(d.depositBalance)}</td>
                        <td className="py-3 px-4">
                          <StatusBadge status={d.status === 'Current' ? 'Active' : 'Under Review'} />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => window.print()}
                            className="px-2.5 py-1 text-xs font-bold text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors cursor-pointer"
                          >
                            Print Statement
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-Report 2: Receivables / Payables (AR/AP) (Requirement 5) */}
          {moreReportType === 'receivables_payables' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden p-6 space-y-6">
              <div>
                <h3 className="font-extrabold text-[#0A1E42] text-base">Receivables &amp; Payables Aging Summary (AR / AP)</h3>
                <p className="text-xs text-slate-500">Aging buckets of outstanding customer balances and vendor invoices</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Aging Period</th>
                      <th className="py-3 px-4">Accounts Receivable (Customer AR)</th>
                      <th className="py-3 px-4">Accounts Payable (Vendor AP)</th>
                      <th className="py-3 px-4">Net Liquidity Spread</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {arAgingData.map((row) => (
                      <tr key={row.period} className="hover:bg-blue-50/20">
                        <td className="py-3 px-4 font-bold text-[#0A1E42]">{row.period}</td>
                        <td className="py-3 px-4 font-mono font-bold text-blue-700">{formatCurrency(row.receivables)}</td>
                        <td className="py-3 px-4 font-mono font-bold text-rose-600">{formatCurrency(row.payables)}</td>
                        <td className="py-3 px-4 font-mono font-extrabold text-emerald-600">
                          +{formatCurrency(row.receivables - row.payables)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-Report 3: Tolls & Tickets Reconciliation (Requirement 5) */}
          {moreReportType === 'tolls_tickets' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-[#0A1E42] text-sm">Tolls &amp; Violations Reconciliation Ledger</h3>
                  <p className="text-xs text-slate-500">Authority citations, driver cost recovery, and administrative fee income</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  96.8% Recovery Rate
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Issuing Authority</th>
                      <th className="py-3 px-4">Citations</th>
                      <th className="py-3 px-4">Incurred Amount</th>
                      <th className="py-3 px-4">Recovered from Drivers</th>
                      <th className="py-3 px-4">Admin Fees Earned</th>
                      <th className="py-3 px-4">Outstanding Balance</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tollsSummaryData.map((t) => (
                      <tr key={t.authority} className="hover:bg-blue-50/20">
                        <td className="py-3 px-4 font-bold text-[#0A1E42]">{t.authority}</td>
                        <td className="py-3 px-4 font-mono">{t.citations} Tickets</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">${t.incurredAmount.toFixed(2)}</td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-600">${t.recoveredFromDrivers.toFixed(2)}</td>
                        <td className="py-3 px-4 font-mono font-bold text-blue-700">+${t.adminFeesCollected.toFixed(2)}</td>
                        <td className="py-3 px-4 font-mono text-rose-600">${t.outstandingBalance.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <StatusBadge status={t.status === 'Reconciled' ? 'Paid' : 'Under Review'} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-Report 4: Document Expiry Schedule (Requirement 5) */}
          {moreReportType === 'document_expiry' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-[#0A1E42] text-sm">Regulatory Document Expiration Schedule</h3>
                  <p className="text-xs text-slate-500">Upcoming expiration countdown across vehicle registrations, driver CDLs, permits, and policies</p>
                </div>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                  {initialComplianceItems.length} Regulatory Tracking Records
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Title &amp; Identifier</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Entity Subject</th>
                      <th className="py-3 px-4">Authority</th>
                      <th className="py-3 px-4">Expiration Date</th>
                      <th className="py-3 px-4">Countdown Term</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {initialComplianceItems.map((c) => (
                      <tr key={c.id} className="hover:bg-blue-50/20">
                        <td className="py-3 px-4">
                          <span className="font-bold text-[#0A1E42] block">{c.title}</span>
                          <span className="font-mono text-[10px] text-slate-400">{c.identifier}</span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-700">{c.category}</td>
                        <td className="py-3 px-4 text-slate-800">{c.entityName}</td>
                        <td className="py-3 px-4 text-slate-600">{c.authority}</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">{formatDate(c.expiryDate)}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                              c.daysRemaining <= 7
                                ? 'bg-rose-100 text-rose-700 font-black animate-pulse'
                                : c.daysRemaining <= 14
                                ? 'bg-amber-100 text-amber-800 font-bold'
                                : c.daysRemaining <= 30
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {c.daysRemaining} days remaining
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-Report 5: Contract Expiry Pipeline (Requirement 5) */}
          {moreReportType === 'contract_expiry' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-[#0A1E42] text-sm">Commercial Lease Contract Expiration Pipeline</h3>
                  <p className="text-xs text-slate-500">Upcoming contract maturities, renewal statuses, and security deposit escrow settlements</p>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                  {contractExpiryData.length} Pipeline Contracts
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Contract #</th>
                      <th className="py-3 px-4">Customer / Lessee</th>
                      <th className="py-3 px-4">Vehicle</th>
                      <th className="py-3 px-4">Weekly Rate</th>
                      <th className="py-3 px-4">Expiry Date</th>
                      <th className="py-3 px-4">Days Remaining</th>
                      <th className="py-3 px-4">Security Escrow</th>
                      <th className="py-3 px-4">Renewal Pipeline Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {contractExpiryData.map((c) => (
                      <tr key={c.contractId} className="hover:bg-blue-50/20">
                        <td className="py-3 px-4 font-mono font-bold text-blue-700">{c.contractId}</td>
                        <td className="py-3 px-4 font-bold text-[#0A1E42]">{c.customer}</td>
                        <td className="py-3 px-4 text-slate-700">{c.vehicle}</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">${c.weeklyRate}/wk</td>
                        <td className="py-3 px-4 font-mono text-slate-800">{formatDate(c.expiryDate)}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                              c.daysRemaining <= 7
                                ? 'bg-rose-100 text-rose-700 font-black'
                                : c.daysRemaining <= 14
                                ? 'bg-amber-100 text-amber-800 font-bold'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {c.daysRemaining} days
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-700">${c.depositHeld}</td>
                        <td className="py-3 px-4 font-semibold text-slate-700">{c.renewalStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-Report 6: Vendor Spending (Requirement 5) */}
          {moreReportType === 'vendor_spending' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-[#0A1E42] text-sm">Vendor &amp; Supplier Expenditure Ledger</h3>
                  <p className="text-xs text-slate-500">Annual cumulative spending across body shops, parts suppliers, insurance, and fuel</p>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                  Total Vendor YTD: $80,850
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Vendor &amp; Partner</th>
                      <th className="py-3 px-4">Supply Category</th>
                      <th className="py-3 px-4">Cumulative YTD Spend</th>
                      <th className="py-3 px-4">Invoices Billed</th>
                      <th className="py-3 px-4">Latest Voucher Date</th>
                      <th className="py-3 px-4">Credit Terms</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {vendorSpendingData.map((v) => (
                      <tr key={v.vendor} className="hover:bg-blue-50/20">
                        <td className="py-3 px-4 font-bold text-[#0A1E42]">{v.vendor}</td>
                        <td className="py-3 px-4 font-semibold text-slate-700">{v.category}</td>
                        <td className="py-3 px-4 font-mono font-extrabold text-[#0A1E42]">{formatCurrency(v.ytdSpend)}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">{v.invoiceCount} invoices</td>
                        <td className="py-3 px-4 font-mono text-slate-600">{formatDate(v.lastInvoice)}</td>
                        <td className="py-3 px-4 font-medium text-slate-700">{v.paymentTerms}</td>
                        <td className="py-3 px-4">
                          <StatusBadge status={v.status === 'Preferred' ? 'Active' : v.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
