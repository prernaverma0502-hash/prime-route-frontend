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
  Check
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import TicketModal from './TicketModal';
import { initialTickets, initialTolls } from '../../data/mockData';
import { exportToCsv } from '../../utils/exportCsv';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function TollsTicketsPage() {
  const [tickets, setTickets] = useState(initialTickets);
  const [tolls, setTolls] = useState(initialTolls);
  const [activeTab, setActiveTab] = useState('tickets');
  const [ticketFilter, setTicketFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [deletingTicket, setDeletingTicket] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Stats
  const stats = useMemo(() => {
    const unpaidList = tickets.filter((t) => t.status === 'Unpaid');
    const unpaidAmount = unpaidList.reduce((sum, t) => sum + t.fineAmount, 0);
    const paidList = tickets.filter((t) => t.status === 'Paid');
    const tollTotal = tolls.reduce((sum, t) => sum + t.amount, 0);

    return {
      totalTickets: tickets.length,
      unpaidCount: unpaidList.length,
      unpaidAmount,
      paidCount: paidList.length,
      tollTotal,
    };
  }, [tickets, tolls]);

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesSearch =
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = ticketFilter === 'All' || t.status === ticketFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tickets, searchQuery, ticketFilter]);

  // Filtered tolls
  const filteredTolls = useMemo(() => {
    return tolls.filter((t) => {
      return (
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tollLocation.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [tolls, searchQuery]);

  const handleSaveTicket = (ticketData) => {
    if (editingTicket) {
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketData.id ? ticketData : t))
      );
    } else {
      setTickets((prev) => [ticketData, ...prev]);
    }
    setEditingTicket(null);
  };

  const handleDeleteTicket = () => {
    if (deletingTicket) {
      setTickets((prev) => prev.filter((t) => t.id !== deletingTicket.id));
      setDeletingTicket(null);
    }
  };

  const handlePayTicket = (id) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'Paid' } : t))
    );
  };

  const handleChargeDriver = (ticket) => {
    const adminFee = ticket.adminFee || 15;
    const totalCharge = ticket.fineAmount + adminFee;
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticket.id ? { ...t, chargedToDriver: true } : t
      )
    );
    setToastMessage(
      `⚡ Successfully charged ${formatCurrency(totalCharge)} (${formatCurrency(ticket.fineAmount)} fine + $${adminFee} admin processing fee) to ${ticket.driver}'s rental ledger.`
    );
    setTimeout(() => setToastMessage(null), 6000);
  };

  const handleExport = () => {
    if (activeTab === 'tolls') {
      exportToCsv('PrimeRoute_Tolls_Export', filteredTolls);
    } else {
      exportToCsv('PrimeRoute_Tickets_Export', filteredTickets);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0A1E42] tracking-tight">Tolls &amp; Citations</h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated E-ZPass tollway charges, municipal speeding camera citations, driver recharges &amp; fine reconciliation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all active:scale-95 duration-150"
          >
            <Download className="w-4 h-4 text-slate-500" /> Export CSV
          </button>
          <button
            onClick={() => {
              setEditingTicket(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 duration-150"
          >
            <Plus className="w-4 h-4" /> Add Citation
          </button>
        </div>
      </div>

      {/* Driver Charge Success Notification Banner */}
      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 text-xs font-bold text-emerald-800 animate-slide-down shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">✓</span>
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-emerald-600 hover:text-emerald-900 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Unpaid Citations"
          value={stats.unpaidAmount}
          prefix="$"
          change={`${stats.unpaidCount} Pending`}
          isPositive={false}
          icon={AlertTriangle}
          iconColor="text-rose-600"
          iconBg="bg-rose-50/90 border border-rose-100"
          badge="Action Required"
          badgeColor="bg-rose-50 text-rose-700 border-rose-200/80"
          subtitle="Municipal Traffic Fines"
          progress={35}
          progressColor="bg-rose-500"
        />
        <StatCard
          title="Paid / Resolved"
          value={stats.paidCount}
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50/90 border border-emerald-100"
          badge="Closed"
          badgeColor="bg-emerald-50 text-emerald-700 border-emerald-200/80"
          subtitle="Cleared with City Auth"
          progress={100}
          progressColor="bg-emerald-500"
        />
        <StatCard
          title="Toll Transactions"
          value={stats.tollTotal.toFixed(2)}
          prefix="$"
          icon={CreditCard}
          iconColor="text-[#075EE8]"
          iconBg="bg-blue-50/90 border border-blue-100"
          badge="E-ZPass Auto"
          badgeColor="bg-blue-50 text-[#075EE8] border-blue-200/80"
          subtitle="Electronic Bridge & Tunnel"
          progress={80}
          progressColor="bg-[#075EE8]"
        />
        <StatCard
          title="Total Citations Recorded"
          value={stats.totalTickets}
          icon={Receipt}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50/90 border border-indigo-100"
          badge="Audited"
          badgeColor="bg-indigo-50 text-indigo-700 border-indigo-200/80"
          subtitle="All Municipal Notices"
          progress={100}
          progressColor="bg-indigo-600"
        />
      </div>

      {/* Navigation Subpage Tabs & Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'tickets', label: 'All Violations & Tickets' },
            { id: 'unpaid', label: 'Unpaid Tickets' },
            { id: 'paid', label: 'Paid Tickets' },
            { id: 'tolls', label: 'Electronic Toll Transactions' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'unpaid') {
                  setActiveTab('tickets');
                  setTicketFilter('Unpaid');
                } else if (tab.id === 'paid') {
                  setActiveTab('tickets');
                  setTicketFilter('Paid');
                } else {
                  setActiveTab(tab.id);
                  setTicketFilter('All');
                }
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                (activeTab === tab.id && ticketFilter === 'All') ||
                (activeTab === 'tickets' && ticketFilter === tab.label.split(' ')[0])
                  ? 'bg-[#075EE8] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full md:w-80">
          <SearchBar
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            placeholder="Search citation #, vehicle, location, driver..."
          />
        </div>
      </div>

      {/* Content Section: Tickets OR Tolls */}
      {activeTab === 'tickets' ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
          {filteredTickets.length === 0 ? (
            <EmptyState
              title="No citation records found"
              description="No tickets match your search parameters."
              actionText="Reset Filter"
              onAction={() => {
                setSearchQuery('');
                setTicketFilter('All');
              }}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Ticket # &amp; Authority</th>
                    <th className="py-3.5 px-4">Violation Type</th>
                    <th className="py-3.5 px-4">Vehicle &amp; Driver</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Due Date</th>
                    <th className="py-3.5 px-4">Fine Amount</th>
                    <th className="py-3.5 px-4">Driver Charge</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredTickets.map((t) => (
                    <tr
                      key={t.id}
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-[#075EE8] block">
                          {t.ticketNumber}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium block truncate max-w-[150px]">
                          {t.issuingAuthority || 'Municipal Bureau'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-bold text-[#0A1E42]">{t.type}</p>
                        <p className="text-[11px] text-slate-400">Date: {formatDate(t.date)}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800">{t.vehicle}</p>
                        <p className="text-[11px] text-slate-400">Driver: {t.driver}</p>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 max-w-[180px] truncate">
                        {t.location}
                      </td>

                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {formatDate(t.dueDate)}
                      </td>

                      <td className="py-3.5 px-4 font-extrabold text-[#0A1E42]">
                        {formatCurrency(t.fineAmount)}
                      </td>

                      <td className="py-3.5 px-4">
                        {t.chargedToDriver ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Check className="w-3 h-3 text-emerald-600" /> Charged
                          </span>
                        ) : (
                          <button
                            onClick={() => handleChargeDriver(t)}
                            title="Recharge violation fine plus $15 processing fee to driver ledger"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-all active:scale-95"
                          >
                            <Zap className="w-3 h-3" /> Charge Driver
                          </button>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusBadge status={t.status} />
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {t.status === 'Unpaid' && (
                            <button
                              onClick={() => handlePayTicket(t.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] rounded-lg shadow-sm"
                            >
                              Pay Now
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setEditingTicket(t);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-[#075EE8] hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingTicket(t)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Toll Transactions Table */
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-bold text-[#0A1E42] text-sm">Automated Electronic Tollway Ledger</h3>
            <p className="text-xs text-slate-500">Live transponder pings logged by E-ZPass and SunPass bridge/tunnel authorities</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Trans. ID</th>
                  <th className="py-3.5 px-4">Vehicle</th>
                  <th className="py-3.5 px-4">Toll Plaza / Crossing</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredTolls.map((toll) => (
                  <tr key={toll.id} className="hover:bg-blue-50/20">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#075EE8]">{toll.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{toll.vehicle}</td>
                    <td className="py-3.5 px-4 text-slate-700">{toll.tollLocation}</td>
                    <td className="py-3.5 px-4 text-slate-500">{toll.date}</td>
                    <td className="py-3.5 px-4 font-extrabold text-[#0A1E42]">{formatCurrency(toll.amount)}</td>
                    <td className="py-3.5 px-4"><StatusBadge status={toll.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <TicketModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTicket(null);
        }}
        onSave={handleSaveTicket}
        ticket={editingTicket}
      />

      <ConfirmationModal
        isOpen={!!deletingTicket}
        onClose={() => setDeletingTicket(null)}
        onConfirm={handleDeleteTicket}
        title="Delete Citation Notice"
        message={`Are you sure you want to delete citation ${deletingTicket?.ticketNumber}?`}
        confirmText="Delete Citation"
      />
    </div>
  );
}

