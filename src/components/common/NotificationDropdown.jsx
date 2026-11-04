import React from 'react';
import { Bell, CheckCircle2, Clock, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function NotificationDropdown({ isOpen, onClose, onNavigate }) {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      title: '3 Contracts Expire Soon',
      desc: 'Vehicle lease contracts expiring in the next 7 days.',
      time: '15m ago',
      icon: Clock,
      color: 'text-rose-500 bg-rose-50',
      tab: 'rentals'
    },
    {
      id: 2,
      title: 'Vehicle Maintenance Due',
      desc: 'Toyota Camry SE due for 5,000 miles oil change.',
      time: '1h ago',
      icon: AlertTriangle,
      color: 'text-amber-500 bg-amber-50',
      tab: 'maintenance'
    },
    {
      id: 3,
      title: 'Unpaid Traffic Ticket',
      desc: 'Violation NYC-PARK-881923 requires settlement ($75).',
      time: '3h ago',
      icon: ShieldAlert,
      color: 'text-rose-600 bg-rose-50',
      tab: 'tolls-tickets'
    }
  ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-dropdown border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
        <div className="flex items-center justify-between px-4 py-3 bg-[#F8FAFC] border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#075EE8]" />
            <span className="font-bold text-sm text-[#0A1E42]">Notifications</span>
          </div>
          <span className="text-[11px] font-semibold text-[#075EE8] bg-blue-50 px-2 py-0.5 rounded-full">
            3 New
          </span>
        </div>

        <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
          {notifications.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => {
                  onNavigate(item.tab);
                  onClose();
                }}
                className="p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 items-start"
              >
                <div className={`p-2 rounded-xl shrink-0 ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-[#0A1E42] truncate">{item.title}</p>
                    <span className="text-[10px] text-slate-400">{item.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-2.5 bg-[#F8FAFC] border-t border-slate-100 text-center">
          <button
            onClick={() => {
              onNavigate('reports');
              onClose();
            }}
            className="text-xs font-semibold text-[#075EE8] hover:underline"
          >
            View all system activities →
          </button>
        </div>
      </div>
    </>
  );
}

