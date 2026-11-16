import React from 'react';
import StatCard from '../../../components/common/StatCard';
import {
  SolidCarIcon,
  SolidDollarCircleIcon,
  SolidWalletIcon,
  SolidProfitChartIcon,
} from '../../../components/common/KpiIcons';
import { usePermission } from '../../../auth/usePermission';

// High-fidelity vector icon for Active Rentals (Car Key Fob)
function SolidRentalsKeyIcon({ className = "w-11 h-11" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} shrink-0`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="8.5" cy="8.5" r="5.5" fill="#075EE8" />
      <circle cx="8.5" cy="8.5" r="2.2" fill="#FFFFFF" />
      <path
        d="M13 10.5L20.5 18C21.3 18.8 21.3 20.2 20.5 21C19.7 21.8 18.3 21.8 17.5 21L16 19.5L14.5 21L13 19.5L15.5 17L12 13.5"
        stroke="#075EE8"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// High-fidelity vector icon for Outstanding Balances (Receipt with Alert)
function SolidOutstandingBalanceIcon({ className = "w-11 h-11" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} shrink-0`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Receipt body */}
      <path
        d="M5 3.5C5 2.7 5.7 2 6.5 2H17.5C18.3 2 19 2.7 19 3.5V21.5L16.5 19.5L14 21.5L12 19.5L10 21.5L7.5 19.5L5 21.5V3.5Z"
        fill="#075EE8"
      />
      {/* Receipt lines */}
      <rect x="8" y="6.5" width="8" height="1.6" rx="0.8" fill="#FFFFFF" />
      <rect x="8" y="10" width="8" height="1.6" rx="0.8" fill="#FFFFFF" />
      {/* Alert badge in lower right */}
      <circle cx="15.5" cy="15" r="3" fill="#F59E0B" stroke="#071D49" strokeWidth="1" />
      <path d="M15.5 13.5V15.2M15.5 16.5H15.51" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export default function DashboardKpis({
  filteredStats,
  onNavigate,
}) {
  const canVehicles = usePermission('vehicles', 'view').can;
  const canRentals = usePermission('rentals', 'view').can;
  const canFinance = usePermission('accounting', 'view').can;
  const canDrivers = usePermission('drivers', 'view').can;

  const cards = [
    {
      id: 'vehicles',
      title: 'Total Vehicles',
      value: filteredStats.totalVehicles ?? 65,
      change: filteredStats.vehiclesChange || '+3 this month',
      isPositive: true,
      customIcon: <SolidCarIcon className="w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 xl:w-8 xl:h-8 2xl:w-8.5 2xl:h-8.5" />,
      onClick: () => onNavigate('vehicles'),
      visible: canVehicles,
      className: 'delay-75 cursor-pointer',
    },
    {
      id: 'rentals',
      title: 'Active Rentals',
      value: filteredStats.activeRentals ?? 42,
      change: filteredStats.rentalsChange || '91% leased',
      isPositive: true,
      customIcon: <SolidRentalsKeyIcon className="w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 xl:w-8 xl:h-8 2xl:w-8.5 2xl:h-8.5" />,
      onClick: () => onNavigate('rentals'),
      visible: canRentals,
      className: 'delay-100 cursor-pointer',
    },
    {
      id: 'revenue',
      title: filteredStats.revLabel || 'Monthly Revenue',
      value: (filteredStats.monthlyRevenue ?? 48750).toLocaleString(),
      prefix: '$',
      change: filteredStats.revenueChange || '+12.5%',
      isPositive: true,
      customIcon: <SolidDollarCircleIcon className="w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 xl:w-8 xl:h-8 2xl:w-8.5 2xl:h-8.5" />,
      onClick: () => onNavigate('accounting'),
      visible: canFinance,
      className: 'delay-150 cursor-pointer',
    },
    {
      id: 'expenses',
      title: filteredStats.expLabel || 'Monthly Expenses',
      value: (filteredStats.monthlyExpenses ?? 18420).toLocaleString(),
      prefix: '$',
      change: filteredStats.expensesChange || '-3.2%',
      isPositive: false,
      customIcon: <SolidWalletIcon className="w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 xl:w-8 xl:h-8 2xl:w-8.5 2xl:h-8.5" />,
      onClick: () => onNavigate('accounting'),
      visible: canFinance,
      className: 'delay-200 cursor-pointer',
    },
    {
      id: 'net-profit',
      title: 'Net Profit',
      value: (filteredStats.netProfit ?? 30330).toLocaleString(),
      prefix: '$',
      change: filteredStats.profitChange || '+18.4%',
      isPositive: filteredStats.isProfitPositive !== false,
      customIcon: <SolidProfitChartIcon className="w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 xl:w-8 xl:h-8 2xl:w-8.5 2xl:h-8.5" />,
      onClick: () => onNavigate('accounting'),
      visible: canFinance,
      className: 'delay-250 cursor-pointer',
    },
    {
      id: 'outstanding-balances',
      title: 'Outstanding Balances',
      value: (filteredStats.outstandingBalances ?? 3850).toLocaleString(),
      prefix: '$',
      change: filteredStats.balancesChange || '5 accounts due',
      isPositive: false,
      customIcon: <SolidOutstandingBalanceIcon className="w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 xl:w-8 xl:h-8 2xl:w-8.5 2xl:h-8.5" />,
      onClick: () => onNavigate('accounting'),
      visible: canFinance || canDrivers,
      className: 'delay-300 cursor-pointer',
    },
  ];

  const visibleCards = cards.filter((c) => c.visible);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-2.5 xl:gap-2.5 2xl:gap-3">
      {visibleCards.map((card) => (
        <StatCard
          key={card.id}
          title={card.title}
          value={card.value}
          prefix={card.prefix}
          change={card.change}
          isPositive={card.isPositive}
          customIcon={card.customIcon}
          onClick={card.onClick}
          className={card.className}
        />
      ))}
    </div>
  );
}
