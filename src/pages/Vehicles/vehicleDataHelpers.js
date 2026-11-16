/**
 * Vehicle Data Helper Utilities
 * Provides comprehensive, realistic data models for the 7 vehicle detail tabs:
 * 1. Overview
 * 2. Rental History
 * 3. Driver Assignment History (Immutable audit trail)
 * 4. Maintenance Records
 * 5. Documents (Title, Registration, Insurance, Purchase/Finance, Inspection, Maintenance, Accident, Warranty, Sale)
 * 6. Operating Expenses
 * 7. Profitability Metrics (Cash Flow, Operating Profit, Accounting Profit)
 */

export function getVehicleRentals(vehicle) {
  if (!vehicle) return [];
  const rate = Number(vehicle.dailyRate) || 65;
  const driverName = vehicle.driver && vehicle.driver !== 'Unassigned' ? vehicle.driver : 'Marcus Vance';

  return [
    {
      id: `RNT-2025-${vehicle.id?.replace(/\D/g, '') || '091'}`,
      customer: driverName,
      customerPhone: '+1 (555) 234-8901',
      startDate: '2025-07-01',
      endDate: '2025-07-31',
      rentalType: 'Monthly Lease',
      dailyRate: rate,
      totalAmount: rate * 30,
      depositAmount: 500,
      paymentStatus: 'Paid',
      status: vehicle.status === 'Rented' ? 'Active' : 'Completed',
      notes: 'Corporate monthly lease renewal with automated ACH billing.'
    },
    {
      id: `RNT-2025-${(Number(vehicle.id?.replace(/\D/g, '') || 90) - 1).toString().padStart(3, '0')}`,
      customer: 'David Miller',
      customerPhone: '+1 (555) 876-1204',
      startDate: '2025-06-01',
      endDate: '2025-06-30',
      rentalType: 'Monthly Lease',
      dailyRate: rate,
      totalAmount: rate * 30,
      depositAmount: 500,
      paymentStatus: 'Paid',
      status: 'Completed',
      notes: 'Vehicle returned in clean condition. 920 miles accrued.'
    },
    {
      id: `RNT-2025-${(Number(vehicle.id?.replace(/\D/g, '') || 90) - 2).toString().padStart(3, '0')}`,
      customer: 'Sarah Jenkins',
      customerPhone: '+1 (555) 432-5590',
      startDate: '2025-04-15',
      endDate: '2025-05-31',
      rentalType: 'Weekly Lease',
      dailyRate: rate,
      totalAmount: rate * 46,
      depositAmount: 500,
      paymentStatus: 'Paid',
      status: 'Completed',
      notes: 'Routine commercial courier dispatch.'
    }
  ];
}

export function getVehicleDriverHistory(vehicle) {
  if (!vehicle) return [];
  const currentDriver = vehicle.driver && vehicle.driver !== 'Unassigned' ? vehicle.driver : 'Marcus Vance';
  const currentOdo = parseInt(String(vehicle.mileage || '18500').replace(/\D/g, ''), 10) || 18500;

  return [
    {
      id: 'DAH-001',
      driver: currentDriver,
      period: 'Jul 01, 2025 – Present',
      handoverDate: '2025-07-01',
      returnDate: 'Active in Service',
      handoverOdometer: `${(currentOdo - 1450).toLocaleString()} mi`,
      returnOdometer: 'Active in Service',
      status: vehicle.status === 'Rented' ? 'Active Assignment' : 'Handed Over',
      condition: 'Passed 21-point checklist • Full fuel tank • No exterior dents',
      isCurrent: true,
    },
    {
      id: 'DAH-002',
      driver: 'David Miller',
      period: 'Mar 10, 2025 – Jun 28, 2025',
      handoverDate: '2025-03-10',
      returnDate: '2025-06-28',
      handoverOdometer: `${(currentOdo - 6200).toLocaleString()} mi`,
      returnOdometer: `${(currentOdo - 1450).toLocaleString()} mi`,
      status: 'Completed Handover',
      condition: 'Minor bumper scuff repaired • Return inspection verified by shop',
      isCurrent: false,
    },
    {
      id: 'DAH-003',
      driver: 'Elena Rostova',
      period: 'Nov 15, 2024 – Feb 28, 2025',
      handoverDate: '2024-11-15',
      returnDate: '2025-02-28',
      handoverOdometer: `${(currentOdo - 11800).toLocaleString()} mi`,
      returnOdometer: `${(currentOdo - 6200).toLocaleString()} mi`,
      status: 'Completed Handover',
      condition: 'Normal wear & tear • Interior detailing completed',
      isCurrent: false,
    }
  ];
}

export function getVehicleMaintenance(vehicle) {
  if (!vehicle) return [];
  const currentOdo = parseInt(String(vehicle.mileage || '18500').replace(/\D/g, ''), 10) || 18500;

  return [
    {
      id: `MNT-2025-0${vehicle.id?.replace(/\D/g, '') || '42'}`,
      category: 'Oil & Filter',
      type: '5,000 mi Synthetic Oil & Filter Service (0W-20)',
      provider: 'QuickLube Express Center',
      serviceDate: '2025-06-18',
      nextServiceDate: '2025-11-15',
      mileage: `${(currentOdo - 1200).toLocaleString()} mi`,
      cost: 85,
      status: 'Completed',
      notes: 'Included tire pressure adjustment, air filter replacement, and 21-point safety checklist.'
    },
    {
      id: `MNT-2025-0${(Number(vehicle.id?.replace(/\D/g, '') || 42) + 10)}`,
      category: 'Brake System',
      type: 'Front Ceramic Brake Pads & Rotor Resurfacing',
      provider: 'Firestone Complete Auto Care',
      serviceDate: '2025-04-12',
      nextServiceDate: '2026-04-12',
      mileage: `${(currentOdo - 4800).toLocaleString()} mi`,
      cost: 320,
      status: 'Completed',
      notes: 'Replaced OEM pads with heavy-duty ceramic fleet pads.'
    },
    {
      id: `MNT-2025-0${(Number(vehicle.id?.replace(/\D/g, '') || 42) + 20)}`,
      category: 'Annual State Inspection',
      type: 'NYS DMV Safety & Emissions Annual Inspection',
      provider: 'Metro Fleet Certified Inspection Station',
      serviceDate: '2024-10-15',
      nextServiceDate: '2025-10-15',
      mileage: `${(currentOdo - 10500).toLocaleString()} mi`,
      cost: 37,
      status: 'Completed',
      notes: 'Passed all emissions standards. DMV inspection decal #NY-88219 renewed.'
    }
  ];
}

export function getVehicleDocuments(vehicle) {
  if (!vehicle) return [];
  const vin = vehicle.vin || '4T1B11HK5JU192831';
  const plate = vehicle.plate || 'PR-2024-TC';

  return [
    {
      id: 'DOC-TITLE-01',
      title: `Certificate of Title (DMV-NY-${plate.replace(/\W/g, '')})`,
      category: 'Title',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      issueDate: '2024-01-20',
      expiryDate: 'Permanent (Clean Title)',
      fileSize: '2.4 MB PDF',
      status: 'Verified',
      description: `Official State Department of Motor Vehicles Certificate of Title for VIN ${vin}. Lien holder recorded.`
    },
    {
      id: 'DOC-REG-01',
      title: `State DMV Vehicle Registration (${plate})`,
      category: 'Registration',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      issueDate: '2024-11-01',
      expiryDate: vehicle.registrationExpiry || '2025-10-31',
      fileSize: '1.1 MB PDF',
      status: 'Active',
      description: 'Annual commercial passenger registration document with official state seal and barcode.'
    },
    {
      id: 'DOC-INS-01',
      title: 'Commercial Fleet Auto Policy Certificate',
      category: 'Insurance',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      issueDate: '2024-12-01',
      expiryDate: vehicle.insuranceExpiry || '2025-11-30',
      fileSize: '3.8 MB PDF',
      status: 'Active Policy',
      description: 'Travelers Commercial Insurance #TRV-8821-NY. $1M Combined Single Limit liability coverage.'
    },
    {
      id: 'DOC-PURCH-01',
      title: 'Commercial Bill of Sale & Finance Agreement',
      category: 'Purchase / Finance',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      issueDate: '2024-01-15',
      expiryDate: 'Term: 48 Months',
      fileSize: '4.5 MB PDF',
      status: 'Executed',
      description: `Original purchase agreement from dealer with ${vehicle.lenderName || 'Chase Commercial Fleet Financing'}.`
    },
    {
      id: 'DOC-INSP-01',
      title: 'Annual Safety & Emissions Inspection Certificate',
      category: 'Inspection Reports',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      issueDate: '2024-10-15',
      expiryDate: '2025-10-15',
      fileSize: '1.4 MB PDF',
      status: 'Passed',
      description: 'Certified 21-point mechanical safety, braking, lighting, and OBD-II exhaust emissions compliance.'
    },
    {
      id: 'DOC-MNT-01',
      title: 'Workshop Service Receipt & Repair Work Order',
      category: 'Maintenance Invoices',
      badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      issueDate: '2025-06-18',
      expiryDate: 'N/A (Archived)',
      fileSize: '890 KB PDF',
      status: 'Paid',
      description: 'Itemized maintenance invoice for synthetic oil service, tire rotation, and brake inspection.'
    },
    {
      id: 'DOC-ACC-01',
      title: 'Accident Incident & Collision Audit Report',
      category: 'Accident Records',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      issueDate: '2025-02-14',
      expiryDate: 'Claim Resolved',
      fileSize: '2.1 MB PDF',
      status: 'Closed Claim',
      description: 'Minor parking lot scraper incident report; insurance adjuster appraisal and body shop repair clearance.'
    },
    {
      id: 'DOC-WARR-01',
      title: 'OEM 5-Year / 60,000-Mile Powertrain Warranty',
      category: 'Warranty',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      issueDate: '2024-01-15',
      expiryDate: '2029-01-15',
      fileSize: '1.9 MB PDF',
      status: 'Under Warranty',
      description: 'Manufacturer factory warranty covering engine block, transmission, drivetrain, and electrical sensors.'
    },
    {
      id: 'DOC-SALE-01',
      title: 'Fleet Decommissioning & Sale Transfer Agreement',
      category: 'Sale Documents',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      issueDate: 'Template Available',
      expiryDate: 'Upon Retirement',
      fileSize: '1.2 MB PDF',
      status: vehicle.status === 'Sold/Retired' ? 'Executed' : 'Pre-Authorized',
      description: 'Standardized fleet asset disposition, salvage release, and odometer transfer disclosure agreement.'
    }
  ];
}

export function getVehicleExpenses(vehicle) {
  if (!vehicle) return { totalExpenses: 0, items: [] };

  const items = [
    {
      id: 'EXP-V01',
      date: '2025-07-04',
      category: 'Fleet Fuel',
      vendor: 'Shell Fleet Commercial Card',
      amount: 145.5,
      description: 'Premium Unleaded Fuel refill (38.2 gal)',
      paymentMethod: 'Corporate Card',
      status: 'Cleared'
    },
    {
      id: 'EXP-V02',
      date: '2025-06-18',
      category: 'Scheduled Maintenance',
      vendor: 'QuickLube Express Center',
      amount: 85.0,
      description: '5,000 mi Synthetic Oil & Filter Service',
      paymentMethod: 'ACH Direct',
      status: 'Cleared'
    },
    {
      id: 'EXP-V03',
      date: '2025-07-01',
      category: 'Commercial Insurance',
      vendor: 'Travelers Fleet Insurance',
      amount: 160.0,
      description: 'Allocated Monthly Vehicle Policy Liability Premium',
      paymentMethod: 'Auto Debit',
      status: 'Cleared'
    },
    {
      id: 'EXP-V04',
      date: '2025-06-25',
      category: 'Tolls & Violations',
      vendor: 'MTA Bridges & Tunnels E-ZPass',
      amount: 68.25,
      description: 'Electronic Transponder toll tolls on Triborough & RFK',
      paymentMethod: 'Prepaid Transponder',
      status: 'Cleared'
    },
    {
      id: 'EXP-V05',
      date: '2025-07-01',
      category: 'Telematics & GPS',
      vendor: 'Samsara Fleet Cloud',
      amount: 35.0,
      description: 'Monthly cellular OBD-II tracking and engine telematics subscription',
      paymentMethod: 'Corporate ACH',
      status: 'Cleared'
    },
    {
      id: 'EXP-V06',
      date: '2025-06-30',
      category: 'Fleet Detailing',
      vendor: 'Sparkle Auto Spa & Detail Hub',
      amount: 45.0,
      description: 'Interior sanitization and exterior hand wash handover prep',
      paymentMethod: 'Cash Voucher',
      status: 'Cleared'
    }
  ];

  const totalExpenses = items.reduce((sum, item) => sum + item.amount, 0);
  return { totalExpenses, items };
}

export function getVehicleProfitability(vehicle) {
  if (!vehicle) {
    return {
      revenueLifetime: 0,
      revenueMtd: 0,
      operatingExpenses: 0,
      insuranceCost: 0,
      maintenanceCost: 0,
      repairsCost: 0,
      financingCost: 0,
      depreciationCost: 0,
      rentalDays: 0,
      downtimeDays: 0,
      revenuePerRentalDay: 0,
      costPerRentalDay: 0,
      cashFlow: 0,
      operatingProfit: 0,
      accountingProfit: 0,
      roi: 0,
      utilizationRate: 0,
    };
  }

  const dailyRate = Number(vehicle.dailyRate) || 65;
  const purchasePrice = Number(vehicle.purchasePrice) || 28500;
  const isAvailable = vehicle.status === 'Available';
  const isMaintenance = vehicle.status === 'Maintenance';
  const isRetired = vehicle.status === 'Sold/Retired';

  // Rental & Downtime Days
  const rentalDaysMtd = isAvailable ? 12 : isMaintenance ? 8 : 26;
  const downtimeDaysMtd = 30 - rentalDaysMtd;
  const rentalDaysLifetime = 248;
  const downtimeDaysLifetime = 24;

  // Revenue
  const revenueMtd = rentalDaysMtd * dailyRate;
  const revenueLifetime = rentalDaysLifetime * dailyRate;

  // Direct Operating Expenses (Fuel, Telematics, Detailing)
  const operatingExpensesMtd = 225.5;
  const operatingExpensesLifetime = 2480;

  // Insurance
  const insuranceCostMtd = 160;
  const insuranceCostLifetime = 1760;

  // Maintenance (Routine)
  const maintenanceCostMtd = isMaintenance ? 385 : 85;
  const maintenanceCostLifetime = 1150;

  // Repairs (Unscheduled damage/body)
  const repairsCostMtd = isMaintenance ? 450 : 0;
  const repairsCostLifetime = 650;

  // Financing Cost (Loan interest & admin fee)
  const monthlyLoanPayment = Number(vehicle.monthlyPayment) || 460;
  const financingCostMtd = 135; // interest portion
  const financingCostLifetime = 1620;

  // Depreciation (Straight-line 5-year depreciation: (Purchase Price - 20% salvage) / 60 months)
  const monthlyDepreciation = Math.round(((purchasePrice * 0.8) / 60));
  const depreciationCostMtd = monthlyDepreciation;
  const depreciationCostLifetime = monthlyDepreciation * 14; // ~14 months in fleet

  // Total Operating Costs (Excluding Financing & Depreciation)
  const totalDirectCostsMtd = operatingExpensesMtd + insuranceCostMtd + maintenanceCostMtd + repairsCostMtd;
  const totalDirectCostsLifetime = operatingExpensesLifetime + insuranceCostLifetime + maintenanceCostLifetime + repairsCostLifetime;

  // Total All-in Accounting Costs
  const totalAccountingCostsMtd = totalDirectCostsMtd + financingCostMtd + depreciationCostMtd;
  const totalAccountingCostsLifetime = totalDirectCostsLifetime + financingCostLifetime + depreciationCostLifetime;

  // Daily Efficiency
  const revenuePerRentalDay = rentalDaysMtd > 0 ? (revenueMtd / rentalDaysMtd) : dailyRate;
  const costPerRentalDay = rentalDaysMtd > 0 ? (totalAccountingCostsMtd / rentalDaysMtd) : (totalAccountingCostsMtd / 30);

  // 1. CASH FLOW: Actual cash collected minus actual cash disbursed (Operating + Debt payment; non-cash depreciation excluded)
  const cashOutMtd = operatingExpensesMtd + insuranceCostMtd + maintenanceCostMtd + repairsCostMtd + monthlyLoanPayment;
  const cashFlowMtd = Math.round(revenueMtd - cashOutMtd);
  const cashFlowLifetime = Math.round(revenueLifetime - (totalDirectCostsLifetime + (monthlyLoanPayment * 14)));

  // 2. OPERATING PROFIT: Revenue minus direct vehicle operating costs, maintenance, repairs, and insurance (before debt service and depreciation)
  const operatingProfitMtd = Math.round(revenueMtd - totalDirectCostsMtd);
  const operatingProfitLifetime = Math.round(revenueLifetime - totalDirectCostsLifetime);

  // 3. ACCOUNTING PROFIT: GAAP Net Income = Revenue minus operating costs, maintenance, repairs, insurance, loan interest, and vehicle depreciation
  const accountingProfitMtd = Math.round(revenueMtd - totalAccountingCostsMtd);
  const accountingProfitLifetime = Math.round(revenueLifetime - totalAccountingCostsLifetime);

  // Utilization & ROI
  const utilizationRate = Math.round((rentalDaysLifetime / (rentalDaysLifetime + downtimeDaysLifetime)) * 100);
  const roi = Math.round((accountingProfitLifetime / purchasePrice) * 100);

  return {
    revenueMtd,
    revenueLifetime,
    operatingExpensesMtd,
    operatingExpensesLifetime,
    insuranceCostMtd,
    insuranceCostLifetime,
    maintenanceCostMtd,
    maintenanceCostLifetime,
    repairsCostMtd,
    repairsCostLifetime,
    financingCostMtd,
    financingCostLifetime,
    depreciationCostMtd,
    depreciationCostLifetime,
    rentalDaysMtd,
    downtimeDaysMtd,
    rentalDaysLifetime,
    downtimeDaysLifetime,
    revenuePerRentalDay: Math.round(revenuePerRentalDay * 100) / 100,
    costPerRentalDay: Math.round(costPerRentalDay * 100) / 100,
    cashFlowMtd,
    cashFlowLifetime,
    operatingProfitMtd,
    operatingProfitLifetime,
    accountingProfitMtd,
    accountingProfitLifetime,
    roi,
    utilizationRate,
  };
}

