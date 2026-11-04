import React, { useState } from 'react';
import {
  Calculator,
  DollarSign,
  TrendingUp,
  Wallet,
  Clock,
  Plus,
  Download,
  Printer,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  FileText
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import SearchBar from '../../components/common/SearchBar';
import FinancialBarChart from '../../components/charts/FinancialBarChart';
import RevenueOverviewChart from '../../components/charts/RevenueOverviewChart';
import InvoiceModal from './InvoiceModal';
import Modal from '../../components/common/Modal';
import { FormInput, FormSelect } from '../../components/forms/FormInputs';
import {
  initialInvoices,
  initialExpenses,
  initialIncome
} from '../../data/mockData';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportToCsv } from '../../utils/exportCsv';

export default function AccountingPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [invoices, setInvoices] = useState(initialInvoices);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [income, setIncome] = useState(initialIncome);

  const [escrowDeposits, setEscrowDeposits] = useState([
    { id: 'ESC-001', driver: 'Marcus Vance', vehicle: 'Toyota Camry SE (PR-2024-TC)', contractId: 'RNT-2024-089', depositAmount: 500, heldDate: '2025-07-01', deductions: 0, balance: 500, status: 'Held in Escrow' },
    { id: 'ESC-002', driver: 'David Miller', vehicle: 'Honda Accord Sport (PR-2024-HA)', contractId: 'RNT-2024-098', depositAmount: 500, heldDate: '2025-06-15', deductions: 90, balance: 410, status: 'Partial Deduction' },
    { id: 'ESC-003', driver: 'Michael Chang', vehicle: 'Tesla Model 3 (PR-2024-TM)', contractId: 'RNT-2025-002', depositAmount: 600, heldDate: '2025-07-10', deductions: 0, balance: 600, status: 'Held in Escrow' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState(null);

  // Forms for new expense / income
  const [newExpense, setNewExpense] = useState({
    category: 'Fleet Fuel',
    description: '',
    vehicle: 'Toyota Camry',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    vendor: '',
    status: 'Paid',
  });

  const [newIncome, setNewIncome] = useState({
    source: 'Vehicle Rental Lease',
    customer: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Corporate ACH',
    status: 'Completed',
  });

  // Calculate totals
  const totalIncomeCalc = income.reduce((sum, item) => sum + Number(item.amount), 0) + 482500;
  const totalExpensesCalc = expenses.reduce((sum, item) => sum + Number(item.amount), 0) + 251200;
  const netProfitCalc = totalIncomeCalc - totalExpensesCalc;
  const pendingInvoices = invoices.filter((i) => i.status === 'Pending' || i.status === 'Overdue');
  const totalPending = pendingInvoices.reduce((sum, item) => sum + Number(item.total), 0);

  const tabs = [
    { id: 'overview', label: 'Financial Overview' },
    { id: 'invoices', label: 'Invoices' },
    { id: 'income', label: 'Income' },
    { id: 'expenses', label: 'Expenses & Approvals' },
    { id: 'escrow', label: '🛡️ Deposit Escrow Ledger' },
    { id: 'outstanding', label: 'Outstanding Payments' },
  ];

  const handleApproveExpense = (id) => {
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: 'Approved by Manager', approvedBy: 'John Doe (Admin)' } : e
      )
    );
  };

  const handleRejectExpense = (id) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'Rejected' } : e))
    );
  };

  const handleReleaseDeposit = (id) => {
    setEscrowDeposits((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'Released / Refunded', balance: 0 } : d))
    );
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    setExpenses([
      {
        ...newExpense,
        id: `EXP-${Math.floor(Math.random() * 9000 + 1000)}`,
        amount: Number(newExpense.amount),
      },
      ...expenses,
    ]);
    setIsExpenseModalOpen(false);
    setNewExpense({
      category: 'Fleet Fuel',
      description: '',
      vehicle: 'Toyota Camry',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      vendor: '',
      status: 'Paid',
    });
  };

  const handleAddIncome = (e) => {
    e.preventDefault();
    setIncome([
      {
        ...newIncome,
        id: `INC-${Math.floor(Math.random() * 900 + 100)}`,
        amount: Number(newIncome.amount),
      },
      ...income,
    ]);
    setIsIncomeModalOpen(false);
    setNewIncome({
      source: 'Vehicle Rental Lease',
      customer: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Corporate ACH',
      status: 'Completed',
    });
  };

  return (
    <div className="space-y-6 animate-slide-up duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0A1E42] tracking-tight">Accounting &amp; Finance</h1>
          <p className="text-xs text-slate-500 mt-1">
            General ledger, corporate leasing invoices, fuel &amp; maintenance expenditures, and P&amp;L
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => exportToCsv('PrimeRoute_Accounting_Invoices', invoices)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all active:scale-95 duration-150"
          >
            <Download className="w-4 h-4 text-slate-500" /> Export CSV
          </button>
          <button
            onClick={() => setIsInvoiceModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 duration-150"
          >
            <Plus className="w-4 h-4" /> Create Invoice
          </button>
        </div>
      </div>

      {/* Financial Top KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Income"
          value={totalIncomeCalc.toLocaleString()}
          prefix="$"
          change="+15.8% YTD"
          isPositive={true}
          icon={TrendingUp}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50/90 border border-emerald-100"
          badge="Audit Verified"
          badgeColor="bg-emerald-50 text-emerald-700 border-emerald-200/80"
          subtitle="Gross Inflow YTD"
          progress={90}
          progressColor="bg-emerald-500"
        />
        <StatCard
          title="Total Expenses"
          value={totalExpensesCalc.toLocaleString()}
          prefix="$"
          change="+6.2% YTD"
          isPositive={false}
          icon={Wallet}
          iconColor="text-[#075EE8]"
          iconBg="bg-blue-50/90 border border-blue-100"
          badge="Operating Opex"
          badgeColor="bg-blue-50 text-[#075EE8] border-blue-200/80"
          subtitle="Fuel, Fleet & Parts"
          progress={55}
          progressColor="bg-[#075EE8]"
        />
        <StatCard
          title="Net Profit"
          value={netProfitCalc.toLocaleString()}
          prefix="$"
          change="+18.4% YTD"
          isPositive={true}
          icon={DollarSign}
          iconColor="text-[#075EE8]"
          iconBg="bg-blue-50/90 border border-blue-100"
          badge="Healthy Margin"
          badgeColor="bg-emerald-50 text-emerald-700 border-emerald-200/80"
          subtitle="Operational Free Cash"
          progress={75}
          progressColor="bg-emerald-600"
        />
        <StatCard
          title="Pending Receivables"
          value={totalPending.toLocaleString()}
          prefix="$"
          change="3 Invoices"
          isPositive={false}
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50/90 border border-amber-100"
          badge="Awaiting Wire"
          badgeColor="bg-amber-50 text-amber-700 border-amber-200/80"
          subtitle="Net 30 Invoices"
          progress={30}
          progressColor="bg-amber-500"
        />
      </div>

      {/* Subpage Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === tab.id
                ? 'bg-[#075EE8] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Financial Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-6 h-[320px]">
              <RevenueOverviewChart />
            </div>
            <div className="lg:col-span-6">
              <FinancialBarChart />
            </div>
          </div>

          {/* Recent Invoices Quick Table */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#0A1E42] text-sm">Recent Issued Invoices</h3>
              <button
                onClick={() => setActiveTab('invoices')}
                className="text-xs font-semibold text-[#075EE8] hover:underline"
              >
                View All Invoices →
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400">
                    <th className="py-2.5 px-3">Invoice #</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Vehicle</th>
                    <th className="py-2.5 px-3">Due Date</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3 font-mono font-bold text-[#075EE8]">{inv.id}</td>
                      <td className="py-3 px-3 font-semibold text-[#0A1E42]">{inv.customer}</td>
                      <td className="py-3 px-3 text-slate-600">{inv.vehicle}</td>
                      <td className="py-3 px-3 text-slate-500">{formatDate(inv.dueDate)}</td>
                      <td className="py-3 px-3 font-bold text-[#0A1E42]">{formatCurrency(inv.total)}</td>
                      <td className="py-3 px-3"><StatusBadge status={inv.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Invoices */}
      {activeTab === 'invoices' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-[#0A1E42] text-sm">All Invoices &amp; Billings</h3>
            <button
              onClick={() => setIsInvoiceModalOpen(true)}
              className="px-3.5 py-1.5 bg-[#075EE8] text-white text-xs font-bold rounded-lg hover:bg-[#0650C7]"
            >
              + New Invoice
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase">
                  <th className="py-3.5 px-4">Invoice #</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Rental Link</th>
                  <th className="py-3.5 px-4">Date Issued</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-blue-50/20">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#075EE8]">{inv.id}</td>
                    <td className="py-3.5 px-4 font-bold text-[#0A1E42]">{inv.customer}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{inv.rentalId}</td>
                    <td className="py-3.5 px-4 text-slate-500">{formatDate(inv.date)}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{formatDate(inv.dueDate)}</td>
                    <td className="py-3.5 px-4 font-extrabold text-[#0A1E42]">{formatCurrency(inv.total)}</td>
                    <td className="py-3.5 px-4"><StatusBadge status={inv.status} /></td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedInvoiceForPrint(inv)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:text-[#075EE8] hover:border-blue-200 text-xs font-semibold inline-flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" /> View / Print
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Income */}
      {activeTab === 'income' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-[#0A1E42] text-sm">Income Receipts</h3>
            <button
              onClick={() => setIsIncomeModalOpen(true)}
              className="px-3.5 py-1.5 bg-[#075EE8] text-white text-xs font-bold rounded-lg hover:bg-[#0650C7]"
            >
              + Record Income
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase">
                  <th className="py-3.5 px-4">Income ID</th>
                  <th className="py-3.5 px-4">Source Category</th>
                  <th className="py-3.5 px-4">Client / Payee</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {income.map((inc) => (
                  <tr key={inc.id} className="hover:bg-blue-50/20">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#075EE8]">{inc.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#0A1E42]">{inc.source}</td>
                    <td className="py-3.5 px-4 text-slate-700">{inc.customer}</td>
                    <td className="py-3.5 px-4 text-slate-500">{formatDate(inc.date)}</td>
                    <td className="py-3.5 px-4 text-slate-600">{inc.paymentMethod}</td>
                    <td className="py-3.5 px-4 font-extrabold text-emerald-600">+{formatCurrency(inc.amount)}</td>
                    <td className="py-3.5 px-4"><StatusBadge status={inc.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Expenses */}
      {activeTab === 'expenses' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-[#0A1E42] text-sm">Operating &amp; Fleet Expenses</h3>
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="px-3.5 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700"
            >
              + Log Expense
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase">
                  <th className="py-3.5 px-4">Expense ID</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Vehicle / Scope</th>
                  <th className="py-3.5 px-4">Vendor</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status &amp; Approval</th>
                  <th className="py-3.5 px-4 text-right">Manager Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-rose-50/20">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{exp.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#0A1E42]">{exp.category}</td>
                    <td className="py-3.5 px-4 text-slate-600">{exp.description}</td>
                    <td className="py-3.5 px-4 text-slate-600">{exp.vehicle}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{exp.vendor}</td>
                    <td className="py-3.5 px-4 text-slate-500">{formatDate(exp.date)}</td>
                    <td className="py-3.5 px-4 font-extrabold text-rose-600">-{formatCurrency(exp.amount)}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={exp.status} />
                      {exp.approvedBy && (
                        <span className="block text-[10px] text-slate-400 mt-0.5">By: {exp.approvedBy}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {exp.status === 'Pending' || exp.status === 'Pending Approval' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleApproveExpense(exp.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg shadow-sm transition-all"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => handleRejectExpense(exp.id)}
                            className="px-2.5 py-1 bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-600 font-bold text-[10px] rounded-lg transition-all"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">No action needed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: Deposit Escrow Ledger */}
      {activeTab === 'escrow' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden space-y-4">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-[#0A1E42] text-sm flex items-center gap-2">
                <span>🛡️ Driver Refundable Security Deposit Escrow Ledger</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Segregated liability accounts: Security deposits are held in escrow and never recognized as operational rental revenue until deductions are applied.
              </p>
            </div>
            <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-xs font-bold text-blue-700 shrink-0">
              Total Held in Escrow: $1,510
            </div>
          </div>

          <div className="overflow-x-auto px-4 pb-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase">
                  <th className="py-3 px-3">Escrow ID</th>
                  <th className="py-3 px-3">Driver Name</th>
                  <th className="py-3 px-3">Assigned Vehicle</th>
                  <th className="py-3 px-3">Contract #</th>
                  <th className="py-3 px-3">Initial Deposit</th>
                  <th className="py-3 px-3">Deductions (Damages/Tolls)</th>
                  <th className="py-3 px-3">Refundable Balance</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Escrow Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {escrowDeposits.map((esc) => (
                  <tr key={esc.id} className="hover:bg-blue-50/20">
                    <td className="py-3 px-3 font-mono font-bold text-[#075EE8]">{esc.id}</td>
                    <td className="py-3 px-3 font-bold text-slate-800">{esc.driver}</td>
                    <td className="py-3 px-3 text-slate-600">{esc.vehicle}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{esc.contractId}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">{formatCurrency(esc.depositAmount)}</td>
                    <td className="py-3 px-3 font-mono font-bold text-rose-600">
                      {esc.deductions > 0 ? `-${formatCurrency(esc.deductions)}` : '$0'}
                    </td>
                    <td className="py-3 px-3 font-mono font-extrabold text-emerald-600 text-sm">
                      {formatCurrency(esc.balance)}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                        esc.balance > 0 ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {esc.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {esc.balance > 0 ? (
                        <button
                          onClick={() => handleReleaseDeposit(esc.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg shadow-sm transition-all"
                        >
                          Release &amp; Refund
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: Outstanding Payments */}
      {activeTab === 'outstanding' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-bold text-[#0A1E42] text-sm">Overdue &amp; Pending Receivables</h3>
            <p className="text-xs text-slate-500">Invoices awaiting customer settlement or wire reconciliation</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase">
                  <th className="py-3.5 px-4">Invoice #</th>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Vehicle</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4">Amount Due</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {pendingInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-amber-50/20">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#075EE8]">{inv.id}</td>
                    <td className="py-3.5 px-4 font-bold text-[#0A1E42]">{inv.customer}</td>
                    <td className="py-3.5 px-4 text-slate-600">{inv.vehicle}</td>
                    <td className="py-3.5 px-4 font-semibold text-rose-600">{formatDate(inv.dueDate)}</td>
                    <td className="py-3.5 px-4 font-extrabold text-[#0A1E42]">{formatCurrency(inv.total)}</td>
                    <td className="py-3.5 px-4"><StatusBadge status={inv.status} /></td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setInvoices((prev) =>
                            prev.map((i) => (i.id === inv.id ? { ...i, status: 'Paid' } : i))
                          );
                        }}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 shadow-sm"
                      >
                        Mark as Paid
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        onSave={(newInv) => setInvoices([newInv, ...invoices])}
      />

      {/* Add Expense Modal */}
      <Modal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        title="Log Operating Fleet Expense"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddExpense} className="space-y-4">
          <FormSelect
            label="Category"
            name="category"
            value={newExpense.category}
            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
            options={['Fleet Fuel', 'Vehicle Maintenance', 'Insurance', 'Tolls & Violations', 'Telematics & GPS']}
          />
          <FormInput
            label="Description"
            name="description"
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            placeholder="e.g. Synthetic oil & fluid change"
            required
          />
          <FormInput
            label="Vehicle Reference"
            name="vehicle"
            value={newExpense.vehicle}
            onChange={(e) => setNewExpense({ ...newExpense, vehicle: e.target.value })}
            placeholder="Vehicle plate or 'Fleet Wide'"
          />
          <FormInput
            label="Vendor / Supplier"
            name="vendor"
            value={newExpense.vendor}
            onChange={(e) => setNewExpense({ ...newExpense, vendor: e.target.value })}
            placeholder="Vendor name"
            required
          />
          <FormInput
            label="Amount ($)"
            name="amount"
            type="number"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            placeholder="0.00"
            required
          />
          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={() => setIsExpenseModalOpen(false)}
              className="px-4 py-2 border rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold shadow"
            >
              Save Expense
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Income Modal */}
      <Modal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        title="Record Fleet Income"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddIncome} className="space-y-4">
          <FormInput
            label="Income Category"
            name="source"
            value={newIncome.source}
            onChange={(e) => setNewIncome({ ...newIncome, source: e.target.value })}
            placeholder="Vehicle Rental Lease"
            required
          />
          <FormInput
            label="Customer / Source"
            name="customer"
            value={newIncome.customer}
            onChange={(e) => setNewIncome({ ...newIncome, customer: e.target.value })}
            placeholder="Apex Logistics LLC"
            required
          />
          <FormInput
            label="Amount ($)"
            name="amount"
            type="number"
            value={newIncome.amount}
            onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
            placeholder="0.00"
            required
          />
          <FormSelect
            label="Payment Method"
            name="paymentMethod"
            value={newIncome.paymentMethod}
            onChange={(e) => setNewIncome({ ...newIncome, paymentMethod: e.target.value })}
            options={['Corporate ACH', 'Credit Card', 'Bank Wire', 'Cash']}
          />
          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={() => setIsIncomeModalOpen(false)}
              className="px-4 py-2 border rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#075EE8] text-white rounded-xl text-xs font-semibold shadow"
            >
              Record Income
            </button>
          </div>
        </form>
      </Modal>

      {/* Print Invoice Modal */}
      {selectedInvoiceForPrint && (
        <Modal
          isOpen={!!selectedInvoiceForPrint}
          onClose={() => setSelectedInvoiceForPrint(null)}
          title={`Invoice: ${selectedInvoiceForPrint.id}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6 p-2 printable-area">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h2 className="text-xl font-black text-[#071D49]">PrimeRoute Enterprise Fleet</h2>
                <p className="text-xs text-slate-500">500 Madison Ave, Floor 24, New York, NY</p>
                <p className="text-xs text-slate-500">tax@primeroute.io • (800) 555-ROUT</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-[#075EE8] block">{selectedInvoiceForPrint.id}</span>
                <span className="text-xs text-slate-400">Date: {formatDate(selectedInvoiceForPrint.date)}</span>
                <span className="text-xs text-rose-500 font-semibold block">Due: {formatDate(selectedInvoiceForPrint.dueDate)}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl text-xs space-y-1">
              <span className="text-slate-400 font-medium">Billed To:</span>
              <p className="font-bold text-[#0A1E42] text-sm">{selectedInvoiceForPrint.customer}</p>
              <p className="text-slate-600">Rental Reference: {selectedInvoiceForPrint.rentalId}</p>
              <p className="text-slate-600">Vehicle: {selectedInvoiceForPrint.vehicle}</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b font-bold text-slate-500">
                    <th className="py-2 text-left">Description</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  <tr>
                    <td className="py-2">Vehicle Lease &amp; Chauffeur Services ({selectedInvoiceForPrint.vehicle})</td>
                    <td className="py-2 text-right font-bold">{formatCurrency(selectedInvoiceForPrint.subtotal || selectedInvoiceForPrint.total)}</td>
                  </tr>
                  <tr>
                    <td className="py-2">State &amp; Municipal Fleet Tax</td>
                    <td className="py-2 text-right font-bold">{formatCurrency(selectedInvoiceForPrint.tax || 148)}</td>
                  </tr>
                  <tr className="border-t-2 font-black text-sm text-[#071D49]">
                    <td className="py-3">Grand Total Due</td>
                    <td className="py-3 text-right text-[#075EE8]">{formatCurrency(selectedInvoiceForPrint.total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t no-print">
              <button
                onClick={() => setSelectedInvoiceForPrint(null)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-[#075EE8] text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow"
              >
                <Printer className="w-4 h-4" /> Print Invoice
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

