import React, { useState, useMemo } from 'react';
import {
  Car,
  Users,
  DollarSign,
  Wallet,
  TrendingUp,
  Bell,
  Calendar,
  Wrench,
  Receipt,
  FolderArchive,
  ArrowRight,
  Trophy,
  ChevronRight,
  ExternalLink,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  CarFront,
  RotateCcw
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import {
  SolidCarIcon,
  SolidSteeringWheelIcon,
  SolidDollarCircleIcon,
  SolidWalletIcon,
  SolidProfitChartIcon,
} from '../../components/common/KpiIcons';
import RevenueOverviewChart from '../../components/charts/RevenueOverviewChart';
import FleetStatusChart from '../../components/charts/FleetStatusChart';
import FinancialBarChart from '../../components/charts/FinancialBarChart';
import {
  initialStats,
  fleetStatusData,
  importantAlerts,
  topVehicles,
  upcomingMaintenanceList
} from '../../data/mockData';
import { formatCurrency } from '../../utils/formatters';

export default function DashboardPage({ onNavigate, onViewVehicle }) {
  const [dateRange, setDateRange] = useState('This Month (July 2025)');
  const [selectedVehicleFilter, setSelectedVehicleFilter] = useState('All 65 Vehicles');
  const [selectedDriverFilter, setSelectedDriverFilter] = useState('All 48 Drivers');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All Categories');

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
    // Multiplier for Date Range
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

    // Vehicle Specific Lookup
    const vehicleData = {
      'Toyota Camry SE': {
        vehicles: 1,
        vChange: 'PR-2024-TC',
        drivers: 1,
        driverChange: 'Marcus Vance',
        baseRev: 3850,
        revChange: '+9%',
        baseExp: 620,
        expChange: '-4%',
        fleet: [{ name: 'Rented', value: 1, color: '#075EE8' }]
      },
      'Tesla Model 3': {
        vehicles: 1,
        vChange: 'PR-2024-TM',
        drivers: 1,
        driverChange: 'Elena Rostova',
        baseRev: 4600,
        revChange: '+14%',
        baseExp: 410,
        expChange: '-8%',
        fleet: [{ name: 'Rented', value: 1, color: '#075EE8' }]
      },
      'Honda Accord Sport': {
        vehicles: 1,
        vChange: 'PR-2024-HA',
        drivers: 1,
        driverChange: 'David Miller',
        baseRev: 3700,
        revChange: '+6%',
        baseExp: 580,
        expChange: '+2%',
        fleet: [{ name: 'Rented', value: 1, color: '#075EE8' }]
      },
      'Chevrolet Tahoe': {
        vehicles: 1,
        vChange: 'PR-2024-CT',
        drivers: 1,
        driverChange: 'Michael Chang',
        baseRev: 5400,
        revChange: '+11%',
        baseExp: 1120,
        expChange: '+10%',
        fleet: [{ name: 'Rented', value: 1, color: '#075EE8' }]
      },
      'Ford F-150 Lariat': {
        vehicles: 1,
        vChange: 'PR-2024-FF',
        drivers: 0,
        driverChange: 'In Workshop',
        baseRev: 0,
        revChange: '-100%',
        baseExp: 850,
        expChange: '+40%',
        fleet: [{ name: 'Maintenance', value: 1, color: '#F97316' }]
      }
    };

    // Driver Specific Lookup
    const driverData = {
      'Sarah Jenkins': {
        vehicles: 1,
        vChange: 'Hyundai Sonata',
        drivers: 1,
        driverChange: 'Active 5★',
        baseRev: 3950,
        revChange: '+8%',
        baseExp: 540,
        expChange: '-2%',
        fleet: [{ name: 'Rented', value: 1, color: '#075EE8' }]
      },
      'Marcus Vance': {
        vehicles: 1,
        vChange: 'Toyota Camry SE',
        drivers: 1,
        driverChange: 'Active 4.9★',
        baseRev: 3850,
        revChange: '+9%',
        baseExp: 620,
        expChange: '-4%',
        fleet: [{ name: 'Rented', value: 1, color: '#075EE8' }]
      },
      'David Miller': {
        vehicles: 1,
        vChange: 'Honda Accord',
        drivers: 1,
        driverChange: 'Active 4.8★',
        baseRev: 3700,
        revChange: '+6%',
        baseExp: 580,
        expChange: '+2%',
        fleet: [{ name: 'Rented', value: 1, color: '#075EE8' }]
      },
      'Michael Chang': {
        vehicles: 1,
        vChange: 'Chevrolet Tahoe',
        drivers: 1,
        driverChange: 'Active 4.9★',
        baseRev: 5400,
        revChange: '+11%',
        baseExp: 1120,
        expChange: '+10%',
        fleet: [{ name: 'Rented', value: 1, color: '#075EE8' }]
      },
      'Elena Rostova': {
        vehicles: 1,
        vChange: 'Tesla Model 3',
        drivers: 1,
        driverChange: 'Active 5★',
        baseRev: 4600,
        revChange: '+14%',
        baseExp: 410,
        expChange: '-8%',
        fleet: [{ name: 'Rented', value: 1, color: '#075EE8' }]
      }
    };

    // Category Specific Lookup
    const categoryData = {
      'Sedan (28)': {
        vehicles: 28,
        vChange: '+1 new',
        drivers: 22,
        driverChange: '+2 this mo',
        baseRev: 22400,
        revChange: '+10%',
        baseExp: 7800,
        expChange: '+5%',
        fleet: [
          { name: 'Rented', value: 20, color: '#075EE8' },
          { name: 'Available', value: 5, color: '#10B981' },
          { name: 'Maintenance', value: 2, color: '#F97316' },
          { name: 'Reserved', value: 1, color: '#6366F1' },
        ]
      },
      'SUV (18)': {
        vehicles: 18,
        vChange: '+1 new',
        drivers: 14,
        driverChange: '+1 this mo',
        baseRev: 15200,
        revChange: '+13%',
        baseExp: 6100,
        expChange: '+9%',
        fleet: [
          { name: 'Rented', value: 12, color: '#075EE8' },
          { name: 'Available', value: 3, color: '#10B981' },
          { name: 'Maintenance', value: 2, color: '#F97316' },
          { name: 'Reserved', value: 1, color: '#6366F1' },
        ]
      },
      'Electric (10)': {
        vehicles: 10,
        vChange: 'Eco Fleet',
        drivers: 8,
        driverChange: 'High Demand',
        baseRev: 8900,
        revChange: '+18%',
        baseExp: 2400,
        expChange: '-12%',
        fleet: [
          { name: 'Rented', value: 7, color: '#075EE8' },
          { name: 'Available', value: 2, color: '#10B981' },
          { name: 'Reserved', value: 1, color: '#6366F1' },
        ]
      },
      'Luxury (5)': {
        vehicles: 5,
        vChange: 'Executive',
        drivers: 3,
        driverChange: 'VIP Chauffeurs',
        baseRev: 4800,
        revChange: '+15%',
        baseExp: 1450,
        expChange: '+4%',
        fleet: [
          { name: 'Rented', value: 3, color: '#075EE8' },
          { name: 'Available', value: 1, color: '#10B981' },
          { name: 'Reserved', value: 1, color: '#6366F1' },
        ]
      },
      'Truck (4)': {
        vehicles: 4,
        vChange: 'Heavy Duty',
        drivers: 1,
        driverChange: 'Commercial',
        baseRev: 2200,
        revChange: '-2%',
        baseExp: 850,
        expChange: '+14%',
        fleet: [
          { name: 'Rented', value: 1, color: '#075EE8' },
          { name: 'Available', value: 1, color: '#10B981' },
          { name: 'Maintenance', value: 2, color: '#F97316' },
        ]
      }
    };

    // Calculate selection hierarchy:
    // 1. Vehicle has highest specificity
    // 2. Driver has next specificity
    // 3. Category has next specificity
    // 4. Default baseline (All 65 vehicles, 48 drivers)
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
          isProfitPositive: calcNet >= 0
        },
        filteredFleetStatus: selected.fleet
      };
    }

    // Default with dateMultiplier
    const calcRev = Math.round(initialStats.monthlyRevenue * dateMultiplier);
    const calcExp = Math.round(initialStats.monthlyExpenses * dateMultiplier);
    const calcNet = calcRev - calcExp;

    return {
      filteredStats: {
        totalVehicles: initialStats.totalVehicles,
        vehiclesChange: initialStats.vehiclesChange,
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
        isProfitPositive: calcNet >= 0
      },
      filteredFleetStatus: fleetStatusData
    };
  }, [dateRange, selectedVehicleFilter, selectedDriverFilter, selectedCategoryFilter]);

  const displayedTopVehicles = useMemo(() => {
    if (selectedVehicleFilter !== 'All 65 Vehicles') {
      const match = topVehicles.filter(v =>
        selectedVehicleFilter.toLowerCase().includes(v.name.toLowerCase()) ||
        v.name.toLowerCase().includes(selectedVehicleFilter.toLowerCase())
      );
      return match.length > 0 ? match : topVehicles.slice(0, 1);
    }
    if (selectedCategoryFilter === 'Electric (10)') {
      return topVehicles.filter(v => v.name.toLowerCase().includes('tesla'));
    }
    return topVehicles;
  }, [selectedVehicleFilter, selectedCategoryFilter]);

  const displayedMaintenance = useMemo(() => {
    if (selectedVehicleFilter !== 'All 65 Vehicles') {
      const match = upcomingMaintenanceList.filter(item =>
        selectedVehicleFilter.toLowerCase().includes(item.vehicle.toLowerCase()) ||
        item.vehicle.toLowerCase().includes(selectedVehicleFilter.toLowerCase())
      );
      return match.length > 0 ? match : upcomingMaintenanceList;
    }
    return upcomingMaintenanceList;
  }, [selectedVehicleFilter]);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'contract':
        return <Calendar className="w-4 h-4 text-rose-500" />;
      case 'maintenance':
        return <Wrench className="w-4 h-4 text-amber-500" />;
      case 'ticket':
        return <Receipt className="w-4 h-4 text-rose-500" />;
      case 'document':
        return <FolderArchive className="w-4 h-4 text-blue-500" />;
      case 'balance':
        return <DollarSign className="w-4 h-4 text-amber-600" />;
      default:
        return <Bell className="w-4 h-4 text-[#075EE8]" />;
    }
  };

  return (
    <div className="space-y-5 animate-slide-up duration-300">
      {/* Global Dashboard Multi-Parameter Filters */}
      <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)]">
        {/* 4 Equal-Width Filter Columns (Equal Grid Distribution) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs w-full">
          {/* 1. Date Filter */}
          <div className="relative flex items-center bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 rounded-xl px-3 py-2.5 transition-all">
            <Calendar className="w-4 h-4 text-[#075EE8] shrink-0 mr-2.5" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer pr-5 appearance-none text-xs"
            >
              <option>This Month (July 2025)</option>
              <option>Last 30 Days</option>
              <option>Second Quarter (Q2)</option>
              <option>Year to Date (2025)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none" />
          </div>

          {/* 2. Vehicle Filter */}
          <div className="relative flex items-center bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 rounded-xl px-3 py-2.5 transition-all">
            <CarFront className="w-4 h-4 text-[#075EE8] shrink-0 mr-2.5" />
            <select
              value={selectedVehicleFilter}
              onChange={(e) => setSelectedVehicleFilter(e.target.value)}
              className="w-full bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer pr-5 appearance-none text-xs"
            >
              <option>All 65 Vehicles</option>
              <option>Toyota Camry SE</option>
              <option>Tesla Model 3</option>
              <option>Honda Accord Sport</option>
              <option>Chevrolet Tahoe</option>
              <option>Ford F-150 Lariat</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none" />
          </div>

          {/* 3. Driver Filter */}
          <div className="relative flex items-center bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 rounded-xl px-3 py-2.5 transition-all">
            <Users className="w-4 h-4 text-[#075EE8] shrink-0 mr-2.5" />
            <select
              value={selectedDriverFilter}
              onChange={(e) => setSelectedDriverFilter(e.target.value)}
              className="w-full bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer pr-5 appearance-none text-xs"
            >
              <option>All 48 Drivers</option>
              <option>Sarah Jenkins</option>
              <option>Marcus Vance</option>
              <option>David Miller</option>
              <option>Michael Chang</option>
              <option>Elena Rostova</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none" />
          </div>

          {/* 4. Category Filter */}
          <div className="relative flex items-center bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 rounded-xl px-3 py-2.5 transition-all">
            <Layers className="w-4 h-4 text-[#075EE8] shrink-0 mr-2.5" />
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="w-full bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer pr-5 appearance-none text-xs"
            >
              <option>All Categories</option>
              <option>Sedan (28)</option>
              <option>SUV (18)</option>
              <option>Electric (10)</option>
              <option>Luxury (5)</option>
              <option>Truck (4)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none" />
          </div>
        </div>

        {/* Active Filter Indicators & 1-Click Reset */}
        {isFiltered && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 mt-2.5 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-1.5 text-slate-500">
              <span className="font-semibold text-slate-700">Active Filters:</span>
              {dateRange !== 'This Month (July 2025)' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-[#075EE8] font-medium border border-blue-100">
                  {dateRange}
                </span>
              )}
              {selectedVehicleFilter !== 'All 65 Vehicles' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-[#075EE8] font-medium border border-blue-100">
                  {selectedVehicleFilter}
                </span>
              )}
              {selectedDriverFilter !== 'All 48 Drivers' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-[#075EE8] font-medium border border-blue-100">
                  {selectedDriverFilter}
                </span>
              )}
              {selectedCategoryFilter !== 'All Categories' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-[#075EE8] font-medium border border-blue-100">
                  {selectedCategoryFilter}
                </span>
              )}
            </div>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Top 5 KPI Cards (Responsive Grid across Mobile, Tablet & Desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2 sm:gap-2.5 xl:gap-3.5">
        {/* Total Vehicles */}
        <StatCard
          title="Total Vehicles"
          value={filteredStats.totalVehicles}
          change={filteredStats.vehiclesChange}
          isPositive={true}
          customIcon={<SolidCarIcon className="w-7 h-7 sm:w-8 sm:h-8 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10" />}
          onClick={() => onNavigate('vehicles')}
          className="delay-75"
        />

        {/* Active Drivers */}
        <StatCard
          title="Active Drivers"
          value={filteredStats.activeDrivers}
          change={filteredStats.driversChange}
          isPositive={true}
          customIcon={<SolidSteeringWheelIcon className="w-7 h-7 sm:w-8 sm:h-8 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10" />}
          onClick={() => onNavigate('drivers')}
          className="delay-100"
        />

        {/* Revenue */}
        <StatCard
          title={filteredStats.revLabel}
          value={filteredStats.monthlyRevenue.toLocaleString()}
          prefix="$"
          change={filteredStats.revenueChange}
          isPositive={true}
          customIcon={<SolidDollarCircleIcon className="w-7 h-7 sm:w-8 sm:h-8 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10" />}
          onClick={() => onNavigate('accounting')}
          className="delay-150"
        />

        {/* Expenses */}
        <StatCard
          title={filteredStats.expLabel}
          value={filteredStats.monthlyExpenses.toLocaleString()}
          prefix="$"
          change={filteredStats.expensesChange}
          isPositive={false}
          customIcon={<SolidWalletIcon className="w-7 h-7 sm:w-8 sm:h-8 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10" />}
          onClick={() => onNavigate('accounting')}
          className="delay-200"
        />

        {/* Net Profit */}
        <StatCard
          title="Net Profit"
          value={filteredStats.netProfit.toLocaleString()}
          prefix="$"
          change={filteredStats.profitChange}
          isPositive={filteredStats.isProfitPositive}
          customIcon={<SolidProfitChartIcon className="w-7 h-7 sm:w-8 sm:h-8 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10" />}
          onClick={() => onNavigate('accounting')}
          className="delay-250"
        />
      </div>

      {/* Row 1: Revenue Overview, Fleet Status, Important Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 xl:gap-5">
        {/* Revenue Overview (5 cols) */}
        <div className="lg:col-span-5 h-[330px] transition-all duration-300 hover:shadow-card-hover rounded-2xl">
          <RevenueOverviewChart />
        </div>

        {/* Fleet Status Donut (3 cols) */}
        <div className="lg:col-span-3 h-[330px] transition-all duration-300 hover:shadow-card-hover rounded-2xl">
          <FleetStatusChart data={filteredFleetStatus} />
        </div>

        {/* Important Alerts (4 cols) */}
        <div className="lg:col-span-4 h-[330px] bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden">
          {/* Header Banner - Dark Navy like Reference Image */}
          <div className="bg-[#071D49] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400 animate-pulse" />
              <h3 className="font-bold text-xs sm:text-sm tracking-wide">Important Alerts</h3>
            </div>
            <button
              onClick={() => onNavigate('reports')}
              className="text-[11px] sm:text-xs text-blue-200 hover:text-white flex items-center gap-1 font-medium transition-all hover:translate-x-0.5"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Alert Items List */}
          <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between divide-y divide-slate-100/80">
            {importantAlerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => onNavigate(alert.link)}
                className="py-2 first:pt-0 last:pb-0 flex items-center justify-between gap-2.5 cursor-pointer group hover:bg-slate-50/80 rounded-xl px-2 transition-all duration-200 hover:translate-x-1"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`p-1.5 rounded-lg ${alert.bgColor} shrink-0 transition-transform duration-200 group-hover:scale-110`}>
                    {getAlertIcon(alert.type)}
                  </div>
                  <span className="text-[11px] xl:text-xs font-semibold text-[#0A1E42] group-hover:text-[#075EE8] transition-colors truncate">
                    {alert.title}
                  </span>
                </div>
                <span className={`text-[11px] xl:text-xs font-bold shrink-0 transition-transform group-hover:scale-105 whitespace-nowrap ${alert.color}`}>
                  {alert.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Top Performing Vehicles, Financial Summary, Upcoming Maintenance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 xl:gap-5">
        {/* Top Performing Vehicles Table (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 xl:p-5 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <Trophy className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-[#0A1E42] text-sm">Top Performing Vehicles</h3>
            </div>
            <button
              onClick={() => onNavigate('reports')}
              className="text-xs font-semibold text-[#075EE8] hover:underline flex items-center gap-1 transition-all hover:translate-x-0.5"
            >
              View Report <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400">
                  <th className="py-2 pr-2">#</th>
                  <th className="py-2 px-2">Vehicle</th>
                  <th className="py-2 px-2 text-right">Revenue</th>
                  <th className="py-2 pl-2 text-right">Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60 text-xs">
                {displayedTopVehicles.map((car) => (
                  <tr
                    key={car.id}
                    onClick={() => {
                      if (onViewVehicle) onViewVehicle(car);
                      else onNavigate('vehicles');
                    }}
                    className="hover:bg-blue-50/40 cursor-pointer group transition-all duration-200"
                  >
                    <td className="py-2.5 pr-2 font-medium text-slate-400 group-hover:text-slate-600">{car.rank}</td>
                    <td className="py-2.5 px-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={car.image}
                          alt={car.name}
                          className="w-10 h-7 object-cover rounded-md border border-slate-100 shrink-0 transition-transform duration-200 group-hover:scale-108"
                        />
                        <span className="font-bold text-[#0A1E42] group-hover:text-[#075EE8] transition-colors truncate max-w-[120px]">
                          {car.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-right font-bold text-[#0A1E42]">
                      {formatCurrency(car.revenue)}
                    </td>
                    <td className="py-2.5 pl-2 text-right font-bold text-emerald-600">
                      {formatCurrency(car.profit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Summary (5 cols) */}
        <div className="lg:col-span-5 transition-all duration-300 hover:shadow-card-hover rounded-2xl">
          <FinancialBarChart />
        </div>

        {/* Upcoming Maintenance (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-4 xl:p-5 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-[#075EE8]">
                <Wrench className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-[#0A1E42] text-sm">Upcoming Maintenance</h3>
            </div>
            <button
              onClick={() => onNavigate('maintenance')}
              className="text-xs font-semibold text-[#075EE8] hover:underline flex items-center gap-1 transition-all hover:translate-x-0.5"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* List */}
          <div className="space-y-3 flex-1 flex flex-col justify-center">
            {displayedMaintenance.map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigate('maintenance')}
                className="flex items-center justify-between gap-3 p-2.5 hover:bg-slate-50/90 rounded-xl cursor-pointer group transition-all duration-200 hover:translate-x-1"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.image}
                    alt={item.vehicle}
                    className="w-12 h-8 object-cover rounded-lg border border-slate-100 shrink-0 transition-transform duration-200 group-hover:scale-108"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#0A1E42] group-hover:text-[#075EE8] transition-colors truncate">
                      {item.vehicle}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{item.type}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-xs font-bold ${
                      item.isUrgent ? 'text-rose-500' : 'text-slate-500'
                    }`}
                  >
                    {item.date}
                  </span>
                  {item.isUrgent && (
                    <ChevronRight className="w-3.5 h-3.5 text-rose-500 inline ml-1 animate-pulse" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
