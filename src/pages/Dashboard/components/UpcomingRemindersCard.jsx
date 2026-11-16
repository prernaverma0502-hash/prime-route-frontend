import React from 'react';
import { Clock, Wrench, Shield, FileSpreadsheet, ArrowRight, ChevronRight } from 'lucide-react';
import { usePermission } from '../../../auth/usePermission';

export default function UpcomingRemindersCard({ onNavigate }) {
  const canMaintenance = usePermission('maintenance', 'view').can;
  const canDocuments = usePermission('documents', 'view').can;
  const canRentals = usePermission('rentals', 'view').can;

  const reminders = [
    {
      id: 'rem-oil-1',
      title: 'Toyota Camry SE',
      subtitle: '5,000 mi Synthetic Oil & Filter Service',
      category: 'Oil Change',
      date: 'Jul 18',
      isUrgent: true,
      icon: Wrench,
      categoryColor: 'bg-amber-50 text-amber-700 border-amber-200',
      link: 'maintenance',
      visible: canMaintenance,
    },
    {
      id: 'rem-ins-1',
      title: 'Tesla Model 3',
      subtitle: 'Commercial Auto Policy #TRV-8821 Renewal',
      category: 'Insurance Renewal',
      date: 'Jul 24',
      isUrgent: false,
      icon: Shield,
      categoryColor: 'bg-blue-50 text-blue-700 border-blue-200',
      link: 'documents',
      visible: canDocuments,
    },
    {
      id: 'rem-contract-1',
      title: 'Marcus Vance (Camry)',
      subtitle: 'Contract RNT-2024-089 Monthly Lease Expiry',
      category: 'Contract Expiry',
      date: 'Jul 31',
      isUrgent: true,
      icon: FileSpreadsheet,
      categoryColor: 'bg-purple-50 text-purple-700 border-purple-200',
      link: 'rentals',
      visible: canRentals,
    },
    {
      id: 'rem-oil-2',
      title: 'Honda Accord Sport',
      subtitle: 'Transmission Fluid & 21-pt Safety Check',
      category: 'Oil & Fluids',
      date: 'Aug 04',
      isUrgent: false,
      icon: Wrench,
      categoryColor: 'bg-amber-50 text-amber-700 border-amber-200',
      link: 'maintenance',
      visible: canMaintenance,
    },
  ];

  const visibleReminders = reminders.filter((r) => r.visible);

  return (
    <div className="bg-white rounded-2xl p-4 xl:p-5 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-[#075EE8]">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-[#0A1E42] text-sm">Upcoming Reminders</h3>
            <p className="text-[10px] text-slate-400">Oil changes, insurance &amp; contracts</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('reports')}
          className="text-xs font-semibold text-[#075EE8] hover:underline flex items-center gap-1 transition-all hover:translate-x-0.5 cursor-pointer"
        >
          View All <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Reminders List */}
      <div className="space-y-2.5 flex-1 flex flex-col justify-center">
        {visibleReminders.length === 0 ? (
          <div className="text-center p-4 text-xs text-slate-400">
            No upcoming reminders for your role.
          </div>
        ) : (
          visibleReminders.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => onNavigate(item.link)}
                className="flex items-center justify-between gap-3 p-2.5 hover:bg-slate-50/90 rounded-xl cursor-pointer group transition-all duration-200 hover:translate-x-1 border border-transparent hover:border-slate-100"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-blue-50 group-hover:text-[#075EE8] transition-colors">
                    <Icon className="w-4 h-4 text-slate-500 group-hover:text-[#075EE8]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-[#0A1E42] group-hover:text-[#075EE8] transition-colors truncate">
                        {item.title}
                      </p>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md border ${item.categoryColor} truncate`}>
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 flex items-center gap-1">
                  <span
                    className={`text-xs font-bold ${
                      item.isUrgent ? 'text-rose-500' : 'text-slate-500'
                    }`}
                  >
                    {item.date}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#075EE8] transition-colors" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

