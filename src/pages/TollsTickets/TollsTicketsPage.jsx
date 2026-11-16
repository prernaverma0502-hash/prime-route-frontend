import React, { useState, useMemo } from 'react';
import {
  Receipt,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Download,
  CreditCard,
  MapPin,
  Clock,
  Eye,
  Edit2,
  Trash2,
  DollarSign,
  Zap,
  Check,
  ShieldAlert,
  FileText,
  XCircle,
  HelpCircle,
  X
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import Modal from '../../components/common/Modal';
import TicketModal from './TicketModal';
import { initialTickets, initialTolls } from '../../data/mockData';
import { exportToCsv } from '../../utils/exportCsv';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useFleet } from '../../context/FleetContext';

export default function TollsTicketsPage() {
  const { rentals = [], drivers = [] } = useFleet();
  const [tickets, setTickets] = useState(initialTickets);
  const [tolls, setTolls] = useState(initialTolls);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unresolved' | 'overdue' | 'charged' | 'paid' | 'tolls'
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [deletingTicket, setDeletingTicket] = useState(null);
  const [viewingProof, setViewingProof] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Requirement 3: Summary Cards metrics
  const stats = useMemo(() => {
    // 1. Overdue citations: dueDate < today && status !== 'Paid'
    const overdueList = tickets.filter(
      (t) => t.dueDate && t.dueDate < todayStr && t.status !== 'Paid'
    );
    const overdueAmount = overdueList.reduce(
      (sum, t) => sum + Number(t.fineAmount || t.amount || 0),
      0
    );

    // 2. Unresolved violations: Unassigned, Under Review, Assigned, Disputed
    const unresolvedList = tickets.filter(
      (t) =>
        t.status === 'Unassigned' ||
        t.status === 'Under Review' ||
        t.status === 'Assigned' ||
        t.status === 'Disputed' ||
        t.status === 'Unpaid'
    );
    const unresolvedAmount = unresolvedList.reduce(
      (sum, t) => sum + Number(t.fineAmount || t.amount || 0),
      0
    );

    // 3. Driver Charges & Recoveries: Charged or Paid
    const chargedList = tickets.filter(
      (t) => t.status === 'Charged' || t.chargedToDriver === true || t.status === 'Paid'
    );
    const chargedAmount = chargedList.reduce(
      (sum, t) =>
        sum +
        Number(
          t.driverCharge ||
            (Number(t.fineAmount || t.amount || 0) + Number(t.adminFee || 15))
        ),
      0
    );

    // 4. Paid / Cleared with authorities
    const paidList = tickets.filter((t) => t.status === 'Paid');
    const tollTotal = tolls.reduce((sum, t) => sum + Number(t.amount || 0), 0);

    return {
      overdueCount: overdueList.length,
      overdueAmount,
      unresolvedCount: unresolvedList.length,
      unresolvedAmount,
      chargedCount: chargedList.length,
      chargedAmount,
      paidCount: paidList.length,
      tollTotal,
      totalTickets: tickets.length
    };
  }, [tickets, tolls, todayStr]);

  // Requirement 3: Filters for Overdue, Unresolved, Charged, Paid
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const q = searchQuery.toLowerCase();
      const refNum = (t.referenceNumber || t.ticketNumber || t.id || '').toLowerCase();
      const auth = (t.issuingAuthority || '').toLowerCase();
      const veh = (t.vehicle || '').toLowerCase();
      const drv = (t.driver || '').toLowerCase();
      const contract = (t.contract || t.contractId || '').toLowerCase();
      const loc = (t.location || '').toLowerCase();

      const matchesSearch =
        refNum.includes(q) ||
        auth.includes(q) ||
        veh.includes(q) ||
        drv.includes(q) ||
        contract.includes(q) ||
        loc.includes(q);

      if (!matchesSearch) return false;

      // Status / tab filter
      if (activeTab === 'all') return true;
      if (activeTab === 'overdue') {
        return t.dueDate && t.dueDate < todayStr && t.status !== 'Paid';
      }
      if (activeTab === 'unresolved') {
        return (
          t.status === 'Unassigned' ||
          t.status === 'Under Review' ||
          t.status === 'Assigned' ||
          t.status === 'Disputed' ||
          t.status === 'Unpaid'
        );
      }
      if (activeTab === 'charged') {
        return t.status === 'Charged' || (t.chargedToDriver && t.status !== 'Paid');
      }
      if (activeTab === 'paid') {
        return t.status === 'Paid';
      }
      return true;
    });
  }, [tickets, searchQuery, activeTab, todayStr]);

  // Filtered tolls
  const filteredTolls = useMemo(() => {
    return tolls.filter((t) => {
      const q = searchQuery.toLowerCase();
      return (
        t.id.toLowerCase().includes(q) ||
        t.vehicle.toLowerCase().includes(q) ||
        (t.tollLocation && t.tollLocation.toLowerCase().includes(q))
      );
    });
  }, [tolls, searchQuery]);

  // Save ticket handler
  const handleSaveTicket = (ticketData) => {
    if (editingTicket) {
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketData.id ? ticketData : t))
      );
      setToastMessage(`Citation notice ${ticketData.referenceNumber || ticketData.ticketNumber} updated successfully.`);
    } else {
      setTickets((prev) => [ticketData, ...prev]);
      setToastMessage(`Citation notice ${ticketData.referenceNumber || ticketData.ticketNumber} registered successfully.`);
    }
    setEditingTicket(null);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleDeleteTicket = () => {
    if (deletingTicket) {
      setTickets((prev) => prev.filter((t) => t.id !== deletingTicket.id));
      setToastMessage(`Citation notice ${deletingTicket.ticketNumber || deletingTicket.referenceNumber} removed.`);
      setDeletingTicket(null);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  // Requirement 2: Review Workflow Transition Handlers before charging a driver
  // Unassigned -> Under Review -> Assigned -> Charged -> Paid / Disputed

  const handlePutUnderReview = (ticketId) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, status: 'Under Review', notes: `${t.notes ? t.notes + ' | ' : ''}Placed under operational review to audit rental contract dates.` }
          : t
      )
    );
    setToastMessage(`Violation ${ticketId} status transitioned to "Under Review".`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleConfirmAssignment = (ticketId) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, status: 'Assigned' }
          : t
      )
    );
    setToastMessage(`Violation ${ticketId} driver verified and marked as "Assigned". Ready for recharge.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleChargeDriver = (ticket) => {
    const adminFee = ticket.adminFee !== undefined ? Number(ticket.adminFee) : 15;
    const fine = Number(ticket.fineAmount || ticket.amount || 0);
    const totalCharge = fine + adminFee;

    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticket.id
          ? {
              ...t,
              status: 'Charged',
              chargedToDriver: true,
              driverCharge: totalCharge,
              balance: totalCharge
            }
          : t
      )
    );
    setToastMessage(
      `⚡ Successfully charged ${formatCurrency(totalCharge)} (${formatCurrency(fine)} fine + $${adminFee} processing fee) to ${ticket.driver}'s rental subledger.`
    );
    setTimeout(() => setToastMessage(null), 6000);
  };

  const handleMarkPaid = (ticketId) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, status: 'Paid', balance: 0 }
          : t
      )
    );
    setToastMessage(`Violation ${ticketId} marked as Paid & Cleared with city issuing authority.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleFlagDisputed = (ticketId) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, status: 'Disputed' }
          : t
      )
    );
    setToastMessage(`Violation ${ticketId} marked as Disputed by driver. Review transponder/license logs.`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleExport = () => {
    if (activeTab === 'tolls') {
      exportToCsv('PrimeRoute_Tolls_Export', filteredTolls);
    } else {
      exportToCsv('PrimeRoute_Citations_Violations_Export', filteredTickets);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-black text-[#0A1E42] tracking-tight">Tolls &amp; Violations</h1>
            <span className="text-xs font-bold px-3 py-1 rounded-xl bg-blue-50 text-[#075EE8] border border-blue-100 shadow-2xs">
              {tickets.length} Municipal Records
            </span>
            {stats.overdueCount > 0 && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 animate-pulse">
                ⚠️ {stats.overdueCount} Overdue Citations
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated rental window driver matching, review workflows, driver subledger recovery &amp; payment proof repository
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition-all active:scale-95 duration-150 cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => {
              setEditingTicket(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 duration-150 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Log Violation Notice</span>
          </button>
        </div>
      </div>

      {/* Ephemeral Feedback Toast */}
      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 text-xs font-bold text-emerald-800 animate-slide-down shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Requirement 3: Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Overdue Citations */}
        <StatCard
          title="Overdue Citations"
          value={stats.overdueAmount}
          prefix="$"
          change={`${stats.overdueCount} Past Due`}
          isPositive={false}
          icon={AlertTriangle}
          iconColor="text-rose-600"
          iconBg="bg-rose-50/90 border border-rose-100"
          badge="Urgent Penalty Risk"
          badgeColor="bg-rose-50 text-rose-700 border-rose-200"
          subtitle="Past municipal deadline"
          progress={stats.overdueCount > 0 ? 80 : 0}
          progressColor="bg-rose-500"
        />

        {/* Card 2: Unresolved Violations */}
        <StatCard
          title="Unresolved Violations"
          value={stats.unresolvedAmount}
          prefix="$"
          change={`${stats.unresolvedCount} Pending Review`}
          isPositive={stats.unresolvedCount === 0}
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50/90 border border-amber-100"
          badge="Review Workflow"
          badgeColor="bg-amber-50 text-amber-700 border-amber-200"
          subtitle="Unassigned & In Review"
          progress={55}
          progressColor="bg-amber-500"
        />

        {/* Card 3: Charged to Drivers */}
        <StatCard
          title="Driver Recoveries"
          value={stats.chargedAmount}
          prefix="$"
          change={`${stats.chargedCount} Recharged`}
          isPositive={true}
          icon={Zap}
          iconColor="text-[#075EE8]"
          iconBg="bg-blue-50/90 border border-blue-100"
          badge="Subledger Posted"
          badgeColor="bg-blue-50 text-[#075EE8] border-blue-200"
          subtitle="Fines + $15 Admin Fees"
          progress={90}
          progressColor="bg-[#075EE8]"
        />

        {/* Card 4: Electronic Tollway Volume */}
        <StatCard
          title="E-ZPass Toll Summary"
          value={stats.tollTotal.toFixed(2)}
          prefix="$"
          change={`${tolls.length} Pings`}
          isPositive={true}
          icon={CreditCard}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50/90 border border-indigo-100"
          badge="Auto-Replenished"
          badgeColor="bg-indigo-50 text-indigo-700 border-indigo-200"
          subtitle="Tunnels, Bridges & Gates"
          progress={100}
          progressColor="bg-indigo-600"
        />
      </div>

      {/* Requirement 3: Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Filter Chips: All, Unresolved, Overdue, Charged, Paid, Tolls */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Violations' },
            { id: 'unresolved', label: `Unresolved (${stats.unresolvedCount})`, highlight: stats.unresolvedCount > 0 },
            { id: 'overdue', label: `Overdue (${stats.overdueCount})`, isAlert: stats.overdueCount > 0 },
            { id: 'charged', label: 'Charged to Driver' },
            { id: 'paid', label: 'Paid & Cleared' },
            { id: 'tolls', label: 'E-ZPass Tolls' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? tab.isAlert
                    ? 'bg-rose-600 text-white shadow-2xs font-bold'
                    : 'bg-[#075EE8] text-white shadow-2xs'
                  : tab.isAlert
                  ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-80">
          <SearchBar
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            placeholder="Search citation #, driver, vehicle, authority..."
          />
        </div>
      </div>

      {/* Table Section: Violations OR Toll Transactions */}
      {activeTab !== 'tolls' ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
          {filteredTickets.length === 0 ? (
            <EmptyState
              title="No citation records match current filter"
              description="Adjust your search query or reset filter to view all municipal notices."
              actionText="Reset Filter"
              onAction={() => {
                setSearchQuery('');
                setActiveTab('all');
              }}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1080px]">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Citation Ref &amp; Authority</th>
                    <th className="py-3.5 px-4">Incurred / Received</th>
                    <th className="py-3.5 px-4">Vehicle &amp; Contract</th>
                    <th className="py-3.5 px-4">Responsible Driver</th>
                    <th className="py-3.5 px-4">Fine / Recovery ($)</th>
                    <th className="py-3.5 px-4">Due Date</th>
                    <th className="py-3.5 px-4 text-center">Proof / Voucher</th>
                    <th className="py-3.5 px-4 text-center">Review Workflow</th>
                    <th className="py-3.5 px-4 text-right">Workflow Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredTickets.map((t) => {
                    const isOverdue = t.dueDate && t.dueDate < todayStr && t.status !== 'Paid';
                    const fineAmt = Number(t.fineAmount || t.amount || 0);
                    const adminFee = Number(t.adminFee || 15);
                    const driverCharge = Number(t.driverCharge || fineAmt + adminFee);
                    const balance = t.status === 'Paid' ? 0 : Number(t.balance !== undefined ? t.balance : driverCharge);

                    return (
                      <tr key={t.id} className="hover:bg-blue-50/25 transition-colors group">
                        {/* Reference Number & Issuing Authority */}
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-[#075EE8] block text-xs">
                            {t.referenceNumber || t.ticketNumber || t.id}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium block truncate max-w-[160px]" title={t.issuingAuthority}>
                            {t.issuingAuthority || 'NYC Department of Finance'}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate max-w-[160px]">
                            {t.type || 'Parking Violation'}
                          </span>
                        </td>

                        {/* Incurred & Received Date */}
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                          <div>
                            <span className="text-[9px] text-slate-400 block uppercase">Incurred:</span>
                            <span className="font-semibold text-slate-800">{formatDate(t.incurredDate || t.date)}</span>
                          </div>
                          {t.receivedDate && (
                            <div className="mt-0.5">
                              <span className="text-[9px] text-slate-400 block uppercase">Received:</span>
                              <span>{formatDate(t.receivedDate)}</span>
                            </div>
                          )}
                        </td>

                        {/* Vehicle & Contract */}
                        <td className="py-3.5 px-4 text-slate-700">
                          <span className="font-bold block text-slate-800">{t.vehicle}</span>
                          <span className="font-mono text-[10px] text-slate-400 block">
                            Contract: {t.contract || t.contractId || 'N/A'}
                          </span>
                        </td>

                        {/* Responsible Driver */}
                        <td className="py-3.5 px-4">
                          {t.driver && t.driver !== 'Unassigned / Outside Rental' ? (
                            <div>
                              <span className="font-bold text-[#0A1E42] block">{t.driver}</span>
                              <span className="text-[9px] text-emerald-600 font-semibold flex items-center gap-1">
                                <Check className="w-2.5 h-2.5" /> Matched to Rental
                              </span>
                            </div>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                              ⚠️ Unassigned
                            </span>
                          )}
                        </td>

                        {/* Fine / Recovery / Balance */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div>
                              <span className="font-extrabold text-[#0A1E42] block">
                                {formatCurrency(fineAmt)}
                              </span>
                              <span className="text-[10px] text-slate-400 block">
                                +${adminFee} fee = {formatCurrency(driverCharge)}
                              </span>
                            </div>
                            {balance > 0 && (
                              <span className="text-[10px] font-bold text-rose-600 font-mono">
                                (Bal: {formatCurrency(balance)})
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Due Date & Overdue Badge */}
                        <td className="py-3.5 px-4">
                          <span className={`font-mono text-[11px] block ${isOverdue ? 'font-bold text-rose-600' : 'text-slate-700 font-medium'}`}>
                            {formatDate(t.dueDate)}
                          </span>
                          {isOverdue && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-rose-100 text-rose-800 uppercase tracking-wider inline-block mt-0.5">
                              Past Due
                            </span>
                          )}
                        </td>

                        {/* Payment Proof / Voucher Upload */}
                        <td className="py-3.5 px-4 text-center">
                          {t.proofFileName || t.paymentProofUpload ? (
                            <button
                              onClick={() => setViewingProof(t)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#075EE8] rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                              title="View uploaded citation proof or receipt"
                            >
                              <FileText className="w-3 h-3" />
                              <span>View Proof</span>
                            </button>
                          ) : (
                            <span className="text-slate-300 text-[10px]">—</span>
                          )}
                        </td>

                        {/* Review Workflow Status (Requirement 2) */}
                        <td className="py-3.5 px-4 text-center">
                          <StatusBadge status={t.status || 'Assigned'} />
                        </td>

                        {/* Review Workflow Action Buttons (Requirement 2) */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {/* Workflow: Unassigned -> Under Review */}
                            {t.status === 'Unassigned' && (
                              <button
                                onClick={() => handlePutUnderReview(t.id)}
                                className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold shadow-2xs transition-all cursor-pointer"
                                title="Put under review to investigate rental dates"
                              >
                                Review
                              </button>
                            )}

                            {/* Workflow: Under Review -> Assign Driver */}
                            {t.status === 'Under Review' && (
                              <button
                                onClick={() => handleConfirmAssignment(t.id)}
                                className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-bold shadow-2xs transition-all cursor-pointer"
                                title="Confirm driver assignment"
                              >
                                Assign
                              </button>
                            )}

                            {/* Workflow: Assigned -> Charge Driver */}
                            {t.status === 'Assigned' && (
                              <button
                                onClick={() => handleChargeDriver(t)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#075EE8] hover:bg-[#0650C7] text-white shadow-2xs transition-all active:scale-95 cursor-pointer"
                                title="Recharge fine + fee to driver subledger"
                              >
                                <Zap className="w-3 h-3 text-amber-300" /> Charge Driver
                              </button>
                            )}

                            {/* Workflow: Charged -> Mark Paid / Dispute */}
                            {t.status === 'Charged' && (
                              <>
                                <button
                                  onClick={() => handleMarkPaid(t.id)}
                                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-2xs transition-all cursor-pointer"
                                  title="Mark fine paid and cleared with municipality"
                                >
                                  Pay
                                </button>
                                <button
                                  onClick={() => handleFlagDisputed(t.id)}
                                  className="px-1.5 py-1 bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                                  title="Flag driver dispute"
                                >
                                  Dispute
                                </button>
                              </>
                            )}

                            {/* Workflow: Disputed */}
                            {t.status === 'Disputed' && (
                              <button
                                onClick={() => handleConfirmAssignment(t.id)}
                                className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold shadow-2xs transition-all cursor-pointer"
                                title="Resolve driver dispute"
                              >
                                Resolve
                              </button>
                            )}

                            {/* Edit & Delete */}
                            <button
                              onClick={() => {
                                setEditingTicket(t);
                                setIsModalOpen(true);
                              }}
                              className="p-1 text-slate-400 hover:text-[#075EE8] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit citation details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingTicket(t)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Electronic Toll Transactions Table */
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#0A1E42] text-sm">Automated Electronic Tollway Gateway (E-ZPass)</h3>
              <p className="text-xs text-slate-500">Live transponder scans, automatic replenishment ledger, and bridge tolls</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-[#075EE8]">
              {filteredTolls.length} Transponder Scans
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Trans. ID</th>
                  <th className="py-3.5 px-4">Vehicle</th>
                  <th className="py-3.5 px-4">Toll Plaza / Crossing Location</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4 text-right">Toll Fee</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredTolls.map((toll) => (
                  <tr key={toll.id} className="hover:bg-blue-50/20">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#075EE8]">{toll.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{toll.vehicle}</td>
                    <td className="py-3.5 px-4 text-slate-700">{toll.tollLocation}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono">{toll.date}</td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-[#0A1E42] font-mono">
                      {formatCurrency(toll.amount)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={toll.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ticket Modal */}
      <TicketModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTicket(null);
        }}
        onSave={handleSaveTicket}
        ticket={editingTicket}
      />

      {/* Proof / Voucher Preview Modal */}
      {viewingProof && (
        <Modal
          isOpen={!!viewingProof}
          onClose={() => setViewingProof(null)}
          title={`Violation Proof Document: ${viewingProof.referenceNumber || viewingProof.ticketNumber || viewingProof.id}`}
          subtitle={`Issued by ${viewingProof.issuingAuthority || 'Municipality'} (${formatCurrency(viewingProof.fineAmount || viewingProof.amount || 75)})`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-[#075EE8] shadow-sm">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-[#0A1E42] text-sm">
                  {viewingProof.proofFileName || 'citation_notice_scanned.pdf'}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official municipal infraction citation voucher
                </p>
              </div>

              <div className="w-full bg-white p-3 rounded-xl border border-slate-200 text-left text-xs space-y-1.5">
                <div className="flex justify-between text-slate-500">
                  <span>Issuing Authority:</span>
                  <span className="font-bold text-slate-800">{viewingProof.issuingAuthority}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Citation Amount:</span>
                  <span className="font-extrabold text-rose-600 font-mono">
                    {formatCurrency(viewingProof.fineAmount || viewingProof.amount || 75)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Target Vehicle:</span>
                  <span className="font-medium text-slate-800">{viewingProof.vehicle}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Charged Driver:</span>
                  <span className="font-medium text-slate-800">{viewingProof.driver}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setViewingProof(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Close Voucher
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={!!deletingTicket}
        onClose={() => setDeletingTicket(null)}
        onConfirm={handleDeleteTicket}
        title="Delete Citation Notice"
        message={`Are you sure you want to delete citation ${deletingTicket?.ticketNumber || deletingTicket?.referenceNumber}? This action will permanently remove the violation record.`}
        confirmText="Delete Citation"
      />
    </div>
  );
}
