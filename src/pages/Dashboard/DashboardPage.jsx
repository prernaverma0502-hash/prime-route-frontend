import React, { useState, useMemo } from 'react';
import RevenueOverviewChart from '../../components/charts/RevenueOverviewChart';
import FleetStatusChart from '../../components/charts/FleetStatusChart';
import FinancialBarChart from '../../components/charts/FinancialBarChart';
import DashboardFilters from './components/DashboardFilters';
import DashboardKpis from './components/DashboardKpis';
import DashboardQuickActions from './components/DashboardQuickActions';
import FleetUtilizationGauge from './components/FleetUtilizationGauge';
import UpcomingRemindersCard from './components/UpcomingRemindersCard';
import ImportantAlertsCard from './components/ImportantAlertsCard';
import TopVehiclesCard from './components/TopVehiclesCard';

// Quick action modals from existing pages
import RentalModal from '../Rentals/RentalModal';
import ExpenseIncomeModals from '../Accounting/components/ExpenseIncomeModals';
import MaintenanceModal from '../Maintenance/MaintenanceModal';

import { useFleet } from '../../context/FleetContext';
import { usePermission } from '../../auth/usePermission';
import {
  initialStats,
  topVehicles,
} from '../../data/mockData';

// 6 fleet donut statuses matching client brief specifications
const defaultFleetStatusData = [
  { name: 'Available', value: 12, color: '#10B981' },
  { name: 'Reserved', value: 4, color: '#6366F1' },
  { name: 'Rented', value: 42, color: '#075EE8' },
  { name: 'Maintenance', value: 4, color: '#F97316' },
  { name: 'Unavailable', value: 2, color: '#EF4444' },
  { name: 'Sold/Retired', value: 1, color: '#94A3B8' },
];

export default function DashboardPage({ onNavigate, onViewVehicle }) {
  const { saveRental } = useFleet();

  // Role permissions
  const canVehicles = usePermission('vehicles', 'view').can;
  const canAccounting = usePermission('accounting', 'view').can;
  const canRentals = usePermission('rentals', 'view').can;
  const canMaintenance = usePermission('maintenance', 'view').can;
  const canDocuments = usePermission('documents', 'view').can;

  // Filter States
  const [dateRange, setDateRange] = useState('This Month (July 2025)');
  const [selectedVehicleFilter, setSelectedVehicleFilter] = useState('All 65 Vehicles');
  const [selectedDriverFilter, setSelectedDriverFilter] = useState('All 48 Drivers');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All Categories');

  // Quick Action Modal States
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);

  // Quick Action Form States
  const [newExpense, setNewExpense] = useState({
    category: 'Fleet Fuel',
    description: '',
    vehicle: 'Toyota Camry SE',
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

  const isFiltered =
    dateRange !== 'This Month (July 2025)' ||
    selectedVehicleFilter !== 'All 65 Vehicles' ||
    selectedDriverFilter !== 'All 48 Drivers' ||
    selectedCategoryFilter !== 'All Categories';

  const handleResetFilters = () => {
    setDateRange('This Month (July 2025)');
    setSelectedVehicleFilter('All 65 Vehicles');
    setSelectedDriverFilter('All 48 Drivers');
    setSelectedCategoryFilter('All Categories');
  };

  const { filteredStats, filteredFleetStatus } = useMemo(() => {
    let dateMultiplier = 1.0;
    let revLabel = 'Monthly Revenue';
    let expLabel = 'Monthly Expenses';

    if (dateRange === 'Last 30 Days') {
      dateMultiplier = 0.95;
      revLabel = 'Last 30D Revenue';
      expLabel = 'Last 30D Expenses';
    } else if (dateRange === 'Second Quarter (Q2)') {
      dateMultiplier = 2.85;
      revLabel = 'Q2 Revenue';
      expLabel = 'Q2 Expenses';
    } else if (dateRange === 'Year to Date (2025)') {
      dateMultiplier = 6.8;
      revLabel = 'YTD Revenue';
      expLabel = 'YTD Expenses';
    }

    const vehicleData = {
      'Toyota Camry SE': {
        vehicles: 1,
        vChange: 'PR-2024-TC',
        activeRentals: 1,
        rentalsChange: 'Active lease',
        drivers: 1,
        driverChange: 'Marcus Vance',
        baseRev: 3850,
        revChange: '+9%',
        baseExp: 620,
        expChange: '-4%',
        outstandingBalances: 350,
        balancesChange: 'Due in 3 days',
        utilizationRate: 100,
        fleet: [
          { name: 'Available', value: 0, color: '#10B981' },
          { name: 'Reserved', value: 0, color: '#6366F1' },
          { name: 'Rented', value: 1, color: '#075EE8' },
          { name: 'Maintenance', value: 0, color: '#F97316' },
          { name: 'Unavailable', value: 0, color: '#EF4444' },
          { name: 'Sold/Retired', value: 0, color: '#94A3B8' },
        ],
      },
      'Tesla Model 3': {
        vehicles: 1,
        vChange: 'PR-2024-TM',
        activeRentals: 1,
        rentalsChange: 'Active lease',
        drivers: 1,
        driverChange: 'Elena Rostova',
        baseRev: 4600,
        revChange: '+14%',
        baseExp: 410,
        expChange: '-8%',
        outstandingBalances: 0,
        balancesChange: 'All clear',
        utilizationRate: 100,
        fleet: [
          { name: 'Available', value: 0, color: '#10B981' },
          { name: 'Reserved', value: 0, color: '#6366F1' },
          { name: 'Rented', value: 1, color: '#075EE8' },
          { name: 'Maintenance', value: 0, color: '#F97316' },
          { name: 'Unavailable', value: 0, color: '#EF4444' },
          { name: 'Sold/Retired', value: 0, color: '#94A3B8' },
        ],
      },
      'Honda Accord Sport': {
        vehicles: 1,
        vChange: 'PR-2024-HA',
        activeRentals: 1,
        rentalsChange: 'Active lease',
        drivers: 1,
        driverChange: 'David Miller',
        baseRev: 3700,
        revChange: '+6%',
        baseExp: 580,
        expChange: '+2%',
        outstandingBalances: 0,
        balancesChange: 'All clear',
        utilizationRate: 100,
        fleet: [
          { name: 'Available', value: 0, color: '#10B981' },
          { name: 'Reserved', value: 0, color: '#6366F1' },
          { name: 'Rented', value: 1, color: '#075EE8' },
          { name: 'Maintenance', value: 0, color: '#F97316' },
          { name: 'Unavailable', value: 0, color: '#EF4444' },
          { name: 'Sold/Retired', value: 0, color: '#94A3B8' },
        ],
      },
      'Chevrolet Tahoe': {
        vehicles: 1,
        vChange: 'PR-2024-CT',
        activeRentals: 1,
        rentalsChange: 'Active lease',
        drivers: 1,
        driverChange: 'Michael Chang',
        baseRev: 5400,
        revChange: '+11%',
        baseExp: 1120,
        expChange: '+10%',
        outstandingBalances: 0,
        balancesChange: 'All clear',
        utilizationRate: 100,
        fleet: [
          { name: 'Available', value: 0, color: '#10B981' },
          { name: 'Reserved', value: 0, color: '#6366F1' },
          { name: 'Rented', value: 1, color: '#075EE8' },
          { name: 'Maintenance', value: 0, color: '#F97316' },
          { name: 'Unavailable', value: 0, color: '#EF4444' },
          { name: 'Sold/Retired', value: 0, color: '#94A3B8' },
        ],
      },
      'Ford F-150 Lariat': {
        vehicles: 1,
        vChange: 'PR-2024-FF',
        activeRentals: 0,
        rentalsChange: 'In workshop',
        drivers: 0,
        driverChange: 'In Workshop',
        baseRev: 0,
        revChange: '-100%',
        baseExp: 850,
        expChange: '+40%',
        outstandingBalances: 0,
        balancesChange: 'All clear',
        utilizationRate: 0,
        fleet: [
          { name: 'Available', value: 0, color: '#10B981' },
          { name: 'Reserved', value: 0, color: '#6366F1' },
          { name: 'Rented', value: 0, color: '#075EE8' },
          { name: 'Maintenance', value: 1, color: '#F97316' },
          { name: 'Unavailable', value: 0, color: '#EF4444' },
          { name: 'Sold/Retired', value: 0, color: '#94A3B8' },
        ],
      },
    };

    const driverData = {
      'Sarah Jenkins': {
        vehicles: 1,
        vChange: 'Hyundai Sonata',
        activeRentals: 1,
        rentalsChange: 'Active contract',
        drivers: 1,
        driverChange: 'Active 5★',
        baseRev: 3950,
        revChange: '+8%',
        baseExp: 540,
        expChange: '-2%',
        outstandingBalances: 0,
        balancesChange: 'All clear',
        utilizationRate: 100,
        fleet: [
          { name: 'Available', value: 0, color: '#10B981' },
          { name: 'Reserved', value: 0, color: '#6366F1' },
          { name: 'Rented', value: 1, color: '#075EE8' },
          { name: 'Maintenance', value: 0, color: '#F97316' },
          { name: 'Unavailable', value: 0, color: '#EF4444' },
          { name: 'Sold/Retired', value: 0, color: '#94A3B8' },
        ],
      },
      'Marcus Vance': {
        vehicles: 1,
        vChange: 'Toyota Camry SE',
        activeRentals: 1,
        rentalsChange: 'Active contract',
        drivers: 1,
        driverChange: 'Active 4.9★',
        baseRev: 3850,
        revChange: '+9%',
        baseExp: 620,
        expChange: '-4%',
        outstandingBalances: 350,
        balancesChange: 'Due in 3 days',
        utilizationRate: 100,
        fleet: [
          { name: 'Available', value: 0, color: '#10B981' },
          { name: 'Reserved', value: 0, color: '#6366F1' },
          { name: 'Rented', value: 1, color: '#075EE8' },
          { name: 'Maintenance', value: 0, color: '#F97316' },
          { name: 'Unavailable', value: 0, color: '#EF4444' },
          { name: 'Sold/Retired', value: 0, color: '#94A3B8' },
        ],
      },
      'David Miller': {
        vehicles: 1,
        vChange: 'Honda Accord',
        activeRentals: 1,
        rentalsChange: 'Active contract',
        drivers: 1,
        driverChange: 'Active 4.8★',
        baseRev: 3700,
        revChange: '+6%',
        baseExp: 580,
        expChange: '+2%',
        outstandingBalances: 0,
        balancesChange: 'All clear',
        utilizationRate: 100,
        fleet: [
          { name: 'Available', value: 0, color: '#10B981' },
          { name: 'Reserved', value: 0, color: '#6366F1' },
          { name: 'Rented', value: 1, color: '#075EE8' },
          { name: 'Maintenance', value: 0, color: '#F97316' },
          { name: 'Unavailable', value: 0, color: '#EF4444' },
          { name: 'Sold/Retired', value: 0, color: '#94A3B8' },
        ],
      },
      'Michael Chang': {
        vehicles: 1,
        vChange: 'Chevrolet Tahoe',
        activeRentals: 1,
        rentalsChange: 'Active contract',
        drivers: 1,
        driverChange: 'Active 4.9★',
        baseRev: 5400,
        revChange: '+11%',
        baseExp: 1120,
        expChange: '+10%',
        outstandingBalances: 0,
        balancesChange: 'All clear',
        utilizationRate: 100,
        fleet: [
          { name: 'Available', value: 0, color: '#10B981' },
          { name: 'Reserved', value: 0, color: '#6366F1' },
          { name: 'Rented', value: 1, color: '#075EE8' },
          { name: 'Maintenance', value: 0, color: '#F97316' },
          { name: 'Unavailable', value: 0, color: '#EF4444' },
          { name: 'Sold/Retired', value: 0, color: '#94A3B8' },
        ],
      },
      'Elena Rostova': {
        vehicles: 1,
        vChange: 'Tesla Model 3',
        activeRentals: 1,
        rentalsChange: 'Active contract',
        drivers: 1,
        driverChange: 'Active 5★',
        baseRev: 4600,
        revChange: '+14%',
        baseExp: 410,
        expChange: '-8%',
        outstandingBalances: 0,
        balancesChange: 'All clear',
        utilizationRate: 100,
        fleet: [
          { name: 'Available', value: 0, color: '#10B981' },
          { name: 'Reserved', value: 0, color: '#6366F1' },
          { name: 'Rented', value: 1, color: '#075EE8' },
          { name: 'Maintenance', value: 0, color: '#F97316' },
          { name: 'Unavailable', value: 0, color: '#EF4444' },
          { name: 'Sold/Retired', value: 0, color: '#94A3B8' },
        ],
      },
    };

    const categoryData = {
      'Sedan (28)': {
        vehicles: 28,
        vChange: '+1 new',
        activeRentals: 20,
        rentalsChange: '71% leased',
        drivers: 22,
        driverChange: '+2 this mo',
        baseRev: 22400,
        revChange: '+10%',
        baseExp: 7800,
        expChange: '+5%',
        outstandingBalances: 1400,
        balancesChange: '2 accounts due',
        utilizationRate: 71,
        fleet: [
          { name: 'Available', value: 5, color: '#10B981' },
          { name: 'Reserved', value: 1, color: '#6366F1' },
          { name: 'Rented', value: 20, color: '#075EE8' },
          { name: 'Maintenance', value: 2, color: '#F97316' },
          { name: 'Unavailable', value: 0, color: '#EF4444' },
          { name: 'Sold/Retired', value: 0, color: '#94A3B8' },
        ],
      },
      'SUV (18)': {
        vehicles: 18,
        vChange: '+1 new',
        activeRentals: 12,
        rentalsChange: '67% leased',
        drivers: 14,
        driverChange: '+1 this mo',
        baseRev: 15200,
        revChange: '+13%',
        baseExp: 6100,
        expChange: '+9%',
        outstandingBalances: 1100,
        balancesChange: '1 account due',
        utilizationRate: 67,
        fleet: [
          { name: 'Available', value: 3, color: '#10B981' },
          { name: 'Reserved', value: 1, color: '#6366F1' },
          { name: 'Rented', value: 12, color: '#075EE8' },
          { name: 'Maintenance', value: 2, color: '#F97316' },
          { name: 'Unavailable', value: 0, color: '#EF4444' },
          { name: 'Sold/Retired', value: 0, color: '#94A3B8' },
        ],
      },
      'Electric (10)': {
        vehicles: 10,
        vChange: 'Eco Fleet',
        activeRentals: 7,
        rentalsChange: '70% leased',
        drivers: 8,
        driverChange: 'High Demand',
        baseRev: 8900,
        revChange: '+18%',
        baseExp: 2400,
        expChange: '-12%',
        outstandingBalances: 450,
        balancesChange: '1 account due',
        utilizationRate: 70,
        fleet: [
          { name: 'Available', value: 2, color: '#10B981' },
          { name: 'Reserved', value: 1, color: '#6366F1' },
          { name: 'Rented', value: 7, color: '#075EE8' },
          { name: 'Maintenance', value: 0, color: '#F97316' },
          { name: 'Unavailable', value: 0, color: '#EF4444' },
          { name: 'Sold/Retired', value: 0, color: '#94A3B8' },
        ],
      },
      'Luxury (5)': {
        vehicles: 5,
        vChange: 'Executive',
        activeRentals: 3,
        rentalsChange: '60% leased',
        drivers: 3,
        driverChange: 'VIP Chauffeurs',
        baseRev: 4800,
        revChange: '+15%',
        baseExp: 1450,
        expChange: '+4%',
        outstandingBalances: 500,
        balancesChange: 'VIP account',
        utilizationRate: 60,
        fleet: [
          { name: 'Available', value: 1, color: '#10B981' },
          { name: 'Reserved', value: 1, color: '#6366F1' },
          { name: 'Rented', value: 3, color: '#075EE8' },
          { name: 'Maintenance', value: 0, color: '#F97316' },
          { name: 'Unavailable', value: 0, color: '#EF4444' },
          { name: 'Sold/Retired', value: 0, color: '#94A3B8' },
        ],
      },
      'Truck (4)': {
        vehicles: 4,
        vChange: 'Heavy Duty',
        activeRentals: 1,
        rentalsChange: '25% leased',
        drivers: 1,
        driverChange: 'Commercial',
        baseRev: 2200,
        revChange: '-2%',
        baseExp: 850,
        expChange: '+14%',
        outstandingBalances: 400,
        balancesChange: 'Commercial',
        utilizationRate: 25,
        fleet: [
          { name: 'Available', value: 1, color: '#10B981' },
          { name: 'Reserved', value: 0, color: '#6366F1' },
          { name: 'Rented', value: 1, color: '#075EE8' },
          { name: 'Maintenance', value: 2, color: '#F97316' },
          { name: 'Unavailable', value: 0, color: '#EF4444' },
          { name: 'Sold/Retired', value: 0, color: '#94A3B8' },
        ],
      },
    };

    let selected = null;
    if (selectedVehicleFilter !== 'All 65 Vehicles' && vehicleData[selectedVehicleFilter]) {
      selected = vehicleData[selectedVehicleFilter];
    } else if (selectedDriverFilter !== 'All 48 Drivers' && driverData[selectedDriverFilter]) {
      selected = driverData[selectedDriverFilter];
    } else if (selectedCategoryFilter !== 'All Categories' && categoryData[selectedCategoryFilter]) {
      selected = categoryData[selectedCategoryFilter];
    }

    if (selected) {
      const calcRev = Math.round(selected.baseRev * dateMultiplier);
      const calcExp = Math.round(selected.baseExp * dateMultiplier);
      const calcNet = calcRev - calcExp;
      return {
        filteredStats: {
          totalVehicles: selected.vehicles,
          vehiclesChange: selected.vChange,
          activeRentals: selected.activeRentals ?? 1,
          rentalsChange: selected.rentalsChange || 'Active',
          activeDrivers: selected.drivers,
          driversChange: selected.driverChange,
          monthlyRevenue: calcRev,
          revLabel,
          revenueChange: selected.revChange,
          monthlyExpenses: calcExp,
          expLabel,
          expensesChange: selected.expChange,
          netProfit: calcNet,
          profitChange: calcNet >= 0 ? '+14%' : '-15%',
          isProfitPositive: calcNet >= 0,
          outstandingBalances: selected.outstandingBalances ?? 0,
          balancesChange: selected.balancesChange || 'All clear',
          utilizationRate: selected.utilizationRate ?? 100,
        },
        filteredFleetStatus: selected.fleet,
      };
    }

    const calcRev = Math.round(initialStats.monthlyRevenue * dateMultiplier);
    const calcExp = Math.round(initialStats.monthlyExpenses * dateMultiplier);
    const calcNet = calcRev - calcExp;

    return {
      filteredStats: {
        totalVehicles: initialStats.totalVehicles,
        vehiclesChange: '+3 this month',
        activeRentals: 42,
        rentalsChange: '91% leased',
        activeDrivers: initialStats.activeDrivers,
        driversChange: initialStats.driversChange,
        monthlyRevenue: calcRev,
        revLabel,
        revenueChange: initialStats.revenueChange,
        monthlyExpenses: calcExp,
        expLabel,
        expensesChange: initialStats.expensesChange,
        netProfit: calcNet,
        profitChange: initialStats.profitChange,
        isProfitPositive: calcNet >= 0,
        outstandingBalances: 3850,
        balancesChange: '5 accounts due',
        utilizationRate: 65, // 42 active / 65 total = 65%
      },
      filteredFleetStatus: defaultFleetStatusData,
    };
  }, [dateRange, selectedVehicleFilter, selectedDriverFilter, selectedCategoryFilter]);

  const displayedTopVehicles = useMemo(() => {
    if (selectedVehicleFilter !== 'All 65 Vehicles') {
      const match = topVehicles.filter(
        (v) =>
          selectedVehicleFilter.toLowerCase().includes(v.name.toLowerCase()) ||
          v.name.toLowerCase().includes(selectedVehicleFilter.toLowerCase())
      );
      return match.length > 0 ? match : topVehicles.slice(0, 1);
    }
    if (selectedCategoryFilter === 'Electric (10)') {
      return topVehicles.filter((v) => v.name.toLowerCase().includes('tesla'));
    }
    return topVehicles;
  }, [selectedVehicleFilter, selectedCategoryFilter]);

  return (
    <div className="space-y-4 sm:space-y-5 animate-slide-up duration-300">
      {/* Global Dashboard Multi-Parameter Filters */}
      <DashboardFilters
        dateRange={dateRange}
        setDateRange={setDateRange}
        selectedVehicleFilter={selectedVehicleFilter}
        setSelectedVehicleFilter={setSelectedVehicleFilter}
        selectedDriverFilter={selectedDriverFilter}
        setSelectedDriverFilter={setSelectedDriverFilter}
        selectedCategoryFilter={selectedCategoryFilter}
        setSelectedCategoryFilter={setSelectedCategoryFilter}
        isFiltered={isFiltered}
        onResetFilters={handleResetFilters}
      />

      {/* Quick Action Buttons (Opens Modals) */}
      <DashboardQuickActions
        onOpenRentalModal={() => setIsRentalModalOpen(true)}
        onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
        onOpenExpenseModal={() => setIsExpenseModalOpen(true)}
        onOpenMaintenanceModal={() => setIsMaintenanceModalOpen(true)}
      />

      {/* 6 KPI Cards with Trend Indicators (No orphan cards on 360px mobile) */}
      <DashboardKpis
        filteredStats={filteredStats}
        onNavigate={onNavigate}
      />

      {/* Row 1: Line Chart (Revenue vs Expenses), Donut Chart (Fleet Status 6 Statuses), Utilization Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 xl:gap-5">
        {/* Revenue vs Expenses Line Chart */}
        {canAccounting && (
          <div className="lg:col-span-6 h-[340px] transition-all duration-300 hover:shadow-card-hover rounded-2xl">
            <RevenueOverviewChart />
          </div>
        )}

        {/* Fleet Status Donut (Available, Reserved, Rented, Maintenance, Unavailable, Sold/Retired) */}
        {canVehicles && (
          <div
            className={`${
              canAccounting ? 'lg:col-span-3' : 'lg:col-span-6'
            } h-[340px] transition-all duration-300 hover:shadow-card-hover rounded-2xl`}
          >
            <FleetStatusChart data={filteredFleetStatus} />
          </div>
        )}

        {/* Fleet Utilization Gauge */}
        {(canVehicles || canRentals) && (
          <div
            className={`${
              canAccounting ? 'lg:col-span-3' : 'lg:col-span-6'
            } h-[340px] transition-all duration-300 hover:shadow-card-hover rounded-2xl`}
          >
            <FleetUtilizationGauge
              utilizationRate={filteredStats.utilizationRate ?? 65}
              activeCount={filteredStats.activeRentals ?? 42}
              totalCount={filteredStats.totalVehicles ?? 65}
              targetRate={85}
            />
          </div>
        )}
      </div>

      {/* Row 2: Important Alerts (7 Client Alerts), Upcoming Reminders, Top Performing Vehicles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 xl:gap-5">
        {/* Important Alerts Card */}
        <div className="lg:col-span-4">
          <ImportantAlertsCard onNavigate={onNavigate} />
        </div>

        {/* Upcoming Reminders (Oil changes, Insurance renewal, Contract expiry) */}
        {(canMaintenance || canDocuments || canRentals) && (
          <div className="lg:col-span-4">
            <UpcomingRemindersCard onNavigate={onNavigate} />
          </div>
        )}

        {/* Top Performing Vehicles Table */}
        {(canVehicles || canAccounting) && (
          <div className="lg:col-span-4">
            <TopVehiclesCard
              displayedTopVehicles={displayedTopVehicles}
              onNavigate={onNavigate}
              onViewVehicle={onViewVehicle}
            />
          </div>
        )}
      </div>

      {/* Row 3: Financial Summary Bar Chart & Statistics */}
      {canAccounting && (
        <div className="transition-all duration-300 hover:shadow-card-hover rounded-2xl">
          <FinancialBarChart />
        </div>
      )}

      {/* Existing Modals for Quick Actions */}
      <RentalModal
        isOpen={isRentalModalOpen}
        onClose={() => setIsRentalModalOpen(false)}
        onSave={(rental) => {
          saveRental(rental);
          setIsRentalModalOpen(false);
        }}
      />

      <ExpenseIncomeModals
        isExpenseModalOpen={isExpenseModalOpen}
        onCloseExpenseModal={() => setIsExpenseModalOpen(false)}
        newExpense={newExpense}
        setNewExpense={setNewExpense}
        onAddExpense={(e) => {
          e.preventDefault();
          setIsExpenseModalOpen(false);
        }}
        isIncomeModalOpen={isPaymentModalOpen}
        onCloseIncomeModal={() => setIsPaymentModalOpen(false)}
        newIncome={newIncome}
        setNewIncome={setNewIncome}
        onAddIncome={(e) => {
          e.preventDefault();
          setIsPaymentModalOpen(false);
        }}
      />

      <MaintenanceModal
        isOpen={isMaintenanceModalOpen}
        onClose={() => setIsMaintenanceModalOpen(false)}
        onSave={(record) => {
          setIsMaintenanceModalOpen(false);
        }}
      />
    </div>
  );
}
