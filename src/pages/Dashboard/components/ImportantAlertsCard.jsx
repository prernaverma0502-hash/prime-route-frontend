import React from 'react';
import {
  Bell,
  Calendar,
  Wrench,
  Receipt,
  FolderArchive,
  Users,
  ShieldAlert,
  ClipboardCheck,
  ArrowRight,
} from 'lucide-react';
import { usePermission } from '../../../auth/usePermission';

export default function ImportantAlertsCard({ onNavigate }) {
  const canRentals = usePermission('rentals', 'view').can;
  const canMaintenance = usePermission('maintenance', 'view').can;
  const canTolls = usePermission('tolls-tickets', 'view').can;
  const canDocuments = usePermission('documents', 'view').can;
  const canDrivers = usePermission('drivers', 'view').can;
  const canInspections = usePermission('inspections', 'view').can;

  const allAlerts = [
    {
      id: 'alert-contracts',
      title: '3 Lease Contracts Expire in 7 Days',
      badge: '3 Expiring',
      module: 'rentals',
      link: 'rentals',
      icon: Calendar,
      iconColor: 'text-rose-600',
      bgColor: 'bg-rose-50',
      badgeColor: 'text-rose-600',
      visible: canRentals,
    },
    {
      id: 'alert-oil',
      title: '2 Vehicles Due for 5,000 mi Oil Service',
      badge: 'Service Due',
      module: 'maintenance',
      link: 'maintenance',
      icon: Wrench,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      badgeColor: 'text-amber-600',
      visible: canMaintenance,
    },
    {
      id: 'alert-tickets',
      title: 'Unpaid Toll / Violation NYC-PARK-8819',
      badge: '$75 Due',
      module: 'tolls-tickets',
      link: 'tolls-tickets',
      icon: Receipt,
      iconColor: 'text-rose-600',
      bgColor: 'bg-rose-50',
      badgeColor: 'text-rose-600',
      visible: canTolls,
    },
    {
      id: 'alert-docs',
      title: '4 Compliance Documents Expiring (Reg / Insurance)',
      badge: '30 Days',
      module: 'documents',
      link: 'documents',
      icon: FolderArchive,
      iconColor: 'text-[#075EE8]',
      bgColor: 'bg-blue-50',
      badgeColor: 'text-[#075EE8]',
      visible: canDocuments,
    },
    {
      id: 'alert-balance',
      title: '1 Driver with Outstanding Balance ($350)',
      badge: '$350',
      module: 'drivers',
      link: 'drivers',
      icon: Users,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      badgeColor: 'text-amber-600',
      visible: canDrivers,
    },
    {
      id: 'alert-accident',
      title: '1 Unresolved Accident Claim Under Review',
      badge: 'Claim Open',
      module: 'inspections',
      link: 'inspections',
      icon: ShieldAlert,
      iconColor: 'text-rose-600',
      bgColor: 'bg-rose-50',
      badgeColor: 'text-rose-600',
      visible: canInspections,
    },
    {
      id: 'alert-inspection',
      title: '2 Vehicles Awaiting Handover Inspection',
      badge: '2 Awaiting',
      module: 'inspections',
      link: 'inspections',
      icon: ClipboardCheck,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      badgeColor: 'text-indigo-600',
      visible: canInspections,
    },
  ];

  const visibleAlerts = allAlerts.filter((a) => a.visible);

  return (
    <div className="h-[340px] bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden">
      {/* Header Banner */}
      <div className="bg-[#071D49] text-white px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-400 animate-pulse" />
          <h3 className="font-bold text-xs sm:text-sm tracking-wide">
            Important Alerts ({visibleAlerts.length})
          </h3>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('reports')}
          className="text-[11px] sm:text-xs text-blue-200 hover:text-white flex items-center gap-1 font-medium transition-all hover:translate-x-0.5 cursor-pointer"
        >
          View All <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Alert Items List */}
      <div className="p-2.5 sm:p-3 flex-1 overflow-y-auto divide-y divide-slate-100/80 space-y-1">
        {visibleAlerts.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center p-4 text-slate-400 text-xs">
            No active alerts matching your role privileges.
          </div>
        ) : (
          visibleAlerts.map((alert) => {
            const Icon = alert.icon;
            return (
              <div
                key={alert.id}
                onClick={() => onNavigate(alert.link)}
                className="py-1.5 first:pt-0 last:pb-0 flex items-center justify-between gap-2.5 cursor-pointer group hover:bg-slate-50/80 rounded-xl px-2 transition-all duration-200 hover:translate-x-1"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`p-1.5 rounded-lg ${alert.bgColor} shrink-0 transition-transform duration-200 group-hover:scale-110`}>
                    <Icon className={`w-3.5 h-3.5 ${alert.iconColor}`} />
                  </div>
                  <span className="text-[11px] xl:text-xs font-semibold text-[#0A1E42] group-hover:text-[#075EE8] transition-colors truncate">
                    {alert.title}
                  </span>
                </div>
                <span className={`text-[10px] xl:text-[11px] font-bold shrink-0 transition-transform group-hover:scale-105 whitespace-nowrap px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100 ${alert.badgeColor}`}>
                  {alert.badge}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
