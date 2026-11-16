import React, { useState } from 'react';
import {
  Bell,
  Mail,
  Smartphone,
  Clock,
  Users,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Save,
  Check,
  RotateCcw,
  History,
  Sliders,
  Filter
} from 'lucide-react';
import { initialNotificationEvents, initialAlertHistory } from '../../../data/mockData';

const LEAD_TIME_OPTIONS = [
  'Real-time (Immediate)',
  '1 Day Before',
  '3 Days Before',
  '5 Days Before',
  '7 Days Before',
  '14 Days Before',
  '30 Days Before',
  'Within 500 Miles',
  'Weekly Follow-up'
];

const RECIPIENT_PRESETS = [
  'All Admins',
  'Billing Team, Assigned Driver',
  'Operations Manager, Assigned Driver',
  'All Admins, Compliance Officer',
  'Fleet Techs, Operations Manager',
  'Fleet Techs, Workshop Coordinator',
  'Operations Manager, Billing Team',
  'Assigned Staff Member',
  'All Admins, Rental Operations',
  'Owner, Claims Manager',
  'Depot Fleet Technicians'
];

export default function NotificationsSettingsTab() {
  const [events, setEvents] = useState(initialNotificationEvents);
  const [dedupWindow, setDedupWindow] = useState('24 hours');
  const [alertHistory, setAlertHistory] = useState(initialAlertHistory);
  const [historyFilter, setHistoryFilter] = useState('All'); // All | Sent | Resolved | Unresolved
  const [saveToast, setSaveToast] = useState(false);

  // Toggle Email for an event
  const handleToggleEmail = (id) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, email: !e.email } : e))
    );
  };

  // Toggle SMS for an event
  const handleToggleSms = (id) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, sms: !e.sms } : e))
    );
  };

  // Update lead time
  const handleLeadTimeChange = (id, newLeadTime) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, leadTime: newLeadTime } : e))
    );
  };

  // Update recipients
  const handleRecipientsChange = (id, newRecipients) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, recipients: newRecipients } : e))
    );
  };

  // Toggle alert history status (e.g. resolve)
  const handleToggleAlertStatus = (alertId) => {
    setAlertHistory((prev) =>
      prev.map((a) => {
        if (a.id === alertId) {
          const nextStatus = a.status === 'Resolved' ? 'Unresolved' : 'Resolved';
          return { ...a, status: nextStatus };
        }
        return a;
      })
    );
  };

  const handleSave = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3500);
  };

  // Filtered Alert History
  const filteredAlerts = alertHistory.filter((a) => {
    if (historyFilter === 'All') return true;
    return a.status === historyFilter;
  });

  return (
    <div className="space-y-6">
      {saveToast && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 text-xs font-bold text-emerald-800 shadow-2xs animate-slide-down">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Notification routing rules and deduplication settings saved successfully.</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveToast(false)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Deduplication & Rate Limiting Card (Requirement 3: Setting to avoid repeated messages) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-[#075EE8]" />
            <div>
              <h3 className="text-base font-bold text-[#0A1E42]">Notification Rate-Limiting &amp; Deduplication</h3>
              <p className="text-xs text-slate-500">Prevent driver and staff alert fatigue by suppressing redundant messages</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 duration-150 cursor-pointer self-start sm:self-auto"
          >
            <Save className="w-4 h-4" /> Save Preferences
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Avoid Repeated Messages (Deduplication Window) *
            </label>
            <select
              value={dedupWindow}
              onChange={(e) => setDedupWindow(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-bold border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#075EE8]"
            >
              <option value="12 hours">Suppress repeat alerts within 12 hours</option>
              <option value="24 hours">Suppress repeat alerts within 24 hours (Recommended)</option>
              <option value="48 hours">Suppress repeat alerts within 48 hours</option>
              <option value="Weekly">Suppress repeat alerts within 7 calendar days</option>
              <option value="Until Resolved">Once only (Never repeat until status updates or resolves)</option>
            </select>
          </div>
          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-slate-600 leading-relaxed">
            <strong className="text-[#075EE8] block font-bold mb-0.5">Automated Safeguard:</strong>
            PrimeRoute will not dispatch multiple email or SMS notifications for the same invoice, document, citation, or vehicle maintenance alert inside this cooldown window.
          </div>
        </div>
      </div>

      {/* 11 Notification Event Triggers Card (Requirement 3) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#075EE8]" />
            <h3 className="text-base font-bold text-[#0A1E42]">Event-Driven Notification Rules (11 Scenarios)</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure Email &amp; SMS delivery channels, predictive advance notice lead times, and default role recipients per event
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs min-w-[960px]">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Event Trigger &amp; Description</th>
                <th className="py-3 px-3 text-center">Email</th>
                <th className="py-3 px-3 text-center">SMS</th>
                <th className="py-3 px-4">Advance Notice / Lead Time</th>
                <th className="py-3 px-4">Designated Recipients</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.map((evt) => (
                <tr key={evt.id} className="hover:bg-blue-50/15 transition-colors">
                  {/* Event & Description */}
                  <td className="py-3.5 px-4 max-w-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0A1E42] text-xs">{evt.event}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {evt.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{evt.description}</p>
                  </td>

                  {/* Email Toggle */}
                  <td className="py-3.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleEmail(evt.id)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        evt.email
                          ? 'bg-blue-50 border-blue-200 text-[#075EE8] shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-300 hover:text-slate-500'
                      }`}
                      title={evt.email ? 'Email Enabled' : 'Email Disabled'}
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  </td>

                  {/* SMS Toggle */}
                  <td className="py-3.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleSms(evt.id)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        evt.sms
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-300 hover:text-slate-500'
                      }`}
                      title={evt.sms ? 'SMS Enabled' : 'SMS Disabled'}
                    >
                      <Smartphone className="w-4 h-4" />
                    </button>
                  </td>

                  {/* Lead Time Dropdown */}
                  <td className="py-3.5 px-4">
                    <div className="relative">
                      <select
                        value={evt.leadTime}
                        onChange={(e) => handleLeadTimeChange(evt.id, e.target.value)}
                        className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#075EE8]"
                      >
                        {LEAD_TIME_OPTIONS.map((lt) => (
                          <option key={lt} value={lt}>
                            {lt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>

                  {/* Recipients Input / Presets */}
                  <td className="py-3.5 px-4">
                    <input
                      type="text"
                      value={evt.recipients}
                      onChange={(e) => handleRecipientsChange(evt.id, e.target.value)}
                      placeholder="e.g. All Admins, Billing Team"
                      className="w-full px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#075EE8]"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alert History Table (Requirement 3: Alert history table with Sent, Resolved, Unresolved) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#075EE8]" />
              <h3 className="text-base font-bold text-[#0A1E42]">Notification &amp; Alert Dispatch History</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Audit log of recently transmitted automated messages with current resolution lifecycle
            </p>
          </div>

          {/* Filter Chips: All, Sent, Resolved, Unresolved */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
            {['All', 'Sent', 'Resolved', 'Unresolved'].map((filterOption) => (
              <button
                key={filterOption}
                type="button"
                onClick={() => setHistoryFilter(filterOption)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  historyFilter === filterOption
                    ? 'bg-white text-[#0A1E42] shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {filterOption}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto px-5 pb-5 pt-3">
          <table className="w-full text-left border-collapse text-xs min-w-[900px]">
            <thead>
              <tr className="bg-[#F8FAFC] border-y border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-3">Alert ID</th>
                <th className="py-3 px-3">Event Trigger</th>
                <th className="py-3 px-3">Target Record</th>
                <th className="py-3 px-3">Channel</th>
                <th className="py-3 px-3">Recipient Address</th>
                <th className="py-3 px-3">Date / Time Sent</th>
                <th className="py-3 px-3">Lifecycle Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400">
                    No alert logs found for "{historyFilter}" status.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alt) => (
                  <tr key={alt.id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#075EE8]">{alt.id}</td>
                    <td className="py-3 px-3 font-bold text-[#0A1E42]">{alt.event}</td>
                    <td className="py-3 px-3 font-mono text-slate-700">{alt.record}</td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {alt.channel}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">{alt.recipient}</td>
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{alt.timestamp}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                          alt.status === 'Resolved'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : alt.status === 'Sent'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        {alt.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleAlertStatus(alt.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-2xs ${
                          alt.status === 'Resolved'
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                        title="Toggle lifecycle resolution state"
                      >
                        {alt.status === 'Resolved' ? 'Reopen Alert' : 'Mark Resolved'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

