import React from 'react';
import { KeyRound, CreditCard, Receipt, Wrench, Zap } from 'lucide-react';
import { usePermission } from '../../../auth/usePermission';

export default function DashboardQuickActions({
  onOpenRentalModal,
  onOpenPaymentModal,
  onOpenExpenseModal,
  onOpenMaintenanceModal,
}) {
  const canAddRental = usePermission('rentals', 'add').can;
  const canAddPayment = usePermission('accounting', 'add').can;
  const canAddExpense = usePermission('accounting', 'add').can;
  const canAddMaintenance = usePermission('maintenance', 'add').can;

  const actions = [
    {
      id: 'rental',
      label: 'Add Rental',
      icon: KeyRound,
      color: 'bg-[#075EE8] hover:bg-[#0650C7] text-white shadow-blue-500/20',
      iconColor: 'text-white',
      visible: canAddRental,
      onClick: onOpenRentalModal,
    },
    {
      id: 'payment',
      label: 'Record Payment',
      icon: CreditCard,
      color: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20',
      iconColor: 'text-white',
      visible: canAddPayment,
      onClick: onOpenPaymentModal,
    },
    {
      id: 'expense',
      label: 'Log Expense',
      icon: Receipt,
      color: 'bg-[#071D49] hover:bg-[#0D2D6C] text-white shadow-slate-900/10',
      iconColor: 'text-amber-300',
      visible: canAddExpense,
      onClick: onOpenExpenseModal,
    },
    {
      id: 'maintenance',
      label: 'Schedule Maintenance',
      icon: Wrench,
      color: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs',
      iconColor: 'text-[#075EE8]',
      visible: canAddMaintenance,
      onClick: onOpenMaintenanceModal,
    },
  ];

  const visibleActions = actions.filter((a) => a.visible);

  if (visibleActions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#075EE8] flex items-center justify-center shrink-0">
          <Zap className="w-3.5 h-3.5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-[#0A1E42] leading-tight">
            Quick Actions
          </h4>
          <p className="text-[10px] text-slate-400">
            Rapid workflow dispatch &amp; operational entries
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {visibleActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              type="button"
              onClick={action.onClick}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95 duration-150 cursor-pointer ${action.color}`}
            >
              <Icon className={`w-3.5 h-3.5 ${action.iconColor}`} />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

