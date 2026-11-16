import React, { useState, useMemo } from 'react';
import {
  FileText,
  Filter,
  Download,
  Calendar,
  Search,
  ArrowRight,
  ShieldCheck,
  User,
  Layers,
  Activity,
  RotateCcw
} from 'lucide-react';
import { initialAuditLogs } from '../../../data/mockData';
import { exportToCsv } from '../../../utils/exportCsv';
import { useRole } from '../../../context/RoleContext';
import Can from '../../../auth/Can';

const ACTION_TYPES = [
  'All Actions',
  'Create',
  'Edit',
  'Approve',
  'Archive',
  'Contract Generated / Amended',
  'Permission Change',
  'Document Activity'
];

const MODULE_OPTIONS = [
  'All Modules',
  'Vehicles',
  'Drivers',
  'Rentals',
  'Accounting',
  'Inspections',
  'Documents',
  'Users & Roles'
];

const USERS_OPTIONS = [
  'All Users',
  'Marcus Brody (Owner)',
  'John Doe (Secondary Admin)',
  'Elena Vance (Fleet Ops)',
  'Sarah Jenkins (Finance)'
];

export default function AuditLogTab() {
  const { currentRoleId, activeRole } = useRole();
  const [logs, setLogs] = useState(initialAuditLogs);
  const [selectedUser, setSelectedUser] = useState('All Users');
  const [selectedAction, setSelectedAction] = useState('All Actions');
  const [selectedModule, setSelectedModule] = useState('All Modules');
  const [selectedDateFilter, setSelectedDateFilter] = useState('All'); // All | Today | 7days | 30days
  const [searchQuery, setSearchQuery] = useState('');

  // Filter logic
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // User filter
      if (selectedUser !== 'All Users' && !log.user.includes(selectedUser.split(' ')[0])) {
        return false;
      }
      // Action filter
      if (selectedAction !== 'All Actions' && log.action !== selectedAction) {
        return false;
      }
      // Module filter
      if (selectedModule !== 'All Modules' && log.module !== selectedModule) {
        return false;
      }
      // Date filter
      if (selectedDateFilter === 'Today' && !log.timestamp.includes('Today') && !log.timestamp.includes('2025-07-15')) {
        return false;
      }
      if (selectedDateFilter === '7days') {
        // Mock filtering logic for recent 7 days
        if (!log.timestamp.includes('2025-07') && !log.timestamp.includes('Today')) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          log.record.toLowerCase().includes(q) ||
          log.user.toLowerCase().includes(q) ||
          log.action.toLowerCase().includes(q) ||
          log.module.toLowerCase().includes(q) ||
          (log.notes && log.notes.toLowerCase().includes(q)) ||
          (log.previousValue && log.previousValue.toLowerCase().includes(q)) ||
          (log.newValue && log.newValue.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [logs, selectedUser, selectedAction, selectedModule, selectedDateFilter, searchQuery]);

  const handleExport = () => {
    exportToCsv(
      'PrimeRoute_Audit_Trail_Log',
      filteredLogs.map((l) => ({
        LogID: l.id,
        Timestamp: l.timestamp,
        User: l.user,
        Action: l.action,
        Module: l.module,
        TargetRecord: l.record,
        PreviousValue: l.previousValue || 'N/A',
        NewValue: l.newValue || 'N/A',
        AuditNotes: l.notes
      }))
    );
  };

  const resetFilters = () => {
    setSelectedUser('All Users');
    setSelectedAction('All Actions');
    setSelectedModule('All Modules');
    setSelectedDateFilter('All');
    setSearchQuery('');
  };

  const getActionBadgeColor = (action) => {
    switch (action) {
      case 'Create':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Edit':
        return 'bg-blue-50 text-[#075EE8] border-blue-200';
      case 'Approve':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Archive':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'Contract Generated / Amended':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Permission Change':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Document Activity':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden space-y-4">
      {/* Header Banner */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-bold text-[#0A1E42] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#075EE8]" /> System Audit Log
            </h3>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              Read-Only Immutable Stream
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Tamper-Proof
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Certified chronological audit records of data changes, approvals, permissions, and contract activities.
          </p>
        </div>

        {/* Export Button: Strictly for Admins only (Requirement 2) */}
        <Can module="users" do="export">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition-all active:scale-95 duration-150 cursor-pointer self-start sm:self-auto"
            title="Export filtered audit trail for compliance verification"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Audit Log (Admin)</span>
          </button>
        </Can>
      </div>

      {/* Multi-Criteria Filter Bar (Requirement 2: Filters by user, action, date, module) */}
      <div className="px-5 pt-1 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* User Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              User
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-2.5 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#075EE8]"
            >
              {USERS_OPTIONS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          {/* Action Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Action
            </label>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="w-full px-2.5 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#075EE8]"
            >
              {ACTION_TYPES.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* Module Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Module
            </label>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="w-full px-2.5 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#075EE8]"
            >
              {MODULE_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Date Period
            </label>
            <select
              value={selectedDateFilter}
              onChange={(e) => setSelectedDateFilter(e.target.value)}
              className="w-full px-2.5 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#075EE8]"
            >
              <option value="All">All Recorded Dates</option>
              <option value="Today">Today (Jul 15, 2025)</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
          </div>

          {/* Search Query */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Search Record / Notes
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search record..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#075EE8]"
              />
            </div>
          </div>
        </div>

        {/* Results summary & Reset */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
          <span>
            Showing <strong>{filteredLogs.length}</strong> of {logs.length} immutable audit records
          </span>
          {(selectedUser !== 'All Users' ||
            selectedAction !== 'All Actions' ||
            selectedModule !== 'All Modules' ||
            selectedDateFilter !== 'All' ||
            searchQuery) && (
            <button
              onClick={resetFilters}
              className="text-[#075EE8] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Read-Only Table (Requirement 2: No edit or delete controls) */}
      <div className="overflow-x-auto px-5 pb-5">
        <table className="w-full text-left border-collapse text-xs min-w-[1000px]">
          <thead>
            <tr className="bg-[#F8FAFC] border-y border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-3">Log ID</th>
              <th className="py-3 px-3">Date / Time</th>
              <th className="py-3 px-3">User &amp; Role</th>
              <th className="py-3 px-3">Action</th>
              <th className="py-3 px-3">Module</th>
              <th className="py-3 px-3">Target Record</th>
              <th className="py-3 px-3">Previous Value → New Value</th>
              <th className="py-3 px-3">Audit Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-10 text-center text-slate-400">
                  No audit log entries match the selected filters.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-blue-50/20 transition-colors">
                  {/* Log ID */}
                  <td className="py-3 px-3 font-mono font-bold text-[#075EE8] whitespace-nowrap">
                    {log.id}
                  </td>

                  {/* Date / Time */}
                  <td className="py-3 px-3 text-slate-600 font-mono whitespace-nowrap">
                    {log.timestamp}
                  </td>

                  {/* User */}
                  <td className="py-3 px-3 font-semibold text-slate-800 whitespace-nowrap">
                    {log.user}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border ${getActionBadgeColor(
                        log.action
                      )}`}
                    >
                      {log.action}
                    </span>
                  </td>

                  {/* Module */}
                  <td className="py-3 px-3 text-slate-700 font-medium whitespace-nowrap">
                    {log.module}
                  </td>

                  {/* Target Record */}
                  <td className="py-3 px-3 font-mono font-bold text-[#0A1E42] whitespace-nowrap">
                    {log.record}
                  </td>

                  {/* Previous Value -> New Value (Requirement 2) */}
                  <td className="py-3 px-3 max-w-sm">
                    <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-mono leading-tight">
                      <span className="bg-rose-50 border border-rose-200/60 text-rose-700 px-2 py-0.5 rounded line-through">
                        {log.previousValue || 'null'}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="bg-emerald-50 border border-emerald-200/60 text-emerald-800 px-2 py-0.5 rounded font-bold">
                        {log.newValue}
                      </span>
                    </div>
                  </td>

                  {/* Audit Details */}
                  <td className="py-3 px-3 text-slate-600 text-[11px] max-w-xs leading-relaxed">
                    {log.notes}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

