/**
 * Driver Data Helper Utilities
 * Provides comprehensive data models for the 9 driver detail tabs:
 * 1. Profile
 * 2. Current and Previous Rentals
 * 3. Payment History
 * 4. Balance Breakdown
 * 5. Inspections
 * 6. Accidents
 * 7. Tolls and Tickets
 * 8. Contract History
 * 9. Documents
 * Plus Driver Statement and Overdue Collections models
 */

export function getDriverRentals(driver) {
  if (!driver) return [];
  const carName = driver.vehicle && driver.vehicle !== 'Unassigned' ? driver.vehicle : 'Toyota Camry SE (PR-2024-TC)';
  const idNum = driver.id?.replace(/\D/g, '') || '101';

  return [
    {
      id: `RNT-2025-${idNum}`,
      vehicle: carName,
      startDate: '2025-07-01',
      endDate: '2025-07-31',
      rentalType: 'Monthly Commercial Lease',
      weeklyRate: 487.5,
      totalAmount: 1950,
      depositAmount: 500,
      paymentStatus: driver.balance > 0 ? 'Partial Payment' : 'Paid in Full',
      status: driver.status === 'Active' ? 'Active' : 'Completed',
      notes: 'Standard TLC/commercial fleet lease with electronic transponder access.'
    },
    {
      id: `RNT-2025-${(Number(idNum) - 10).toString().padStart(3, '0')}`,
      vehicle: 'Honda Accord Sport (PR-2024-HA)',
      startDate: '2025-04-01',
      endDate: '2025-06-30',
      rentalType: 'Quarterly Lease',
      weeklyRate: 490,
      totalAmount: 5880,
      depositAmount: 500,
      paymentStatus: 'Paid in Full',
      status: 'Completed',
      notes: 'Returned in good order. Security deposit rolled over.'
    },
    {
      id: `RNT-2024-${(Number(idNum) - 20).toString().padStart(3, '0')}`,
      vehicle: 'Hyundai Sonata SEL (PR-2024-HS)',
      startDate: '2024-10-01',
      endDate: '2025-03-31',
      rentalType: '6-Month Lease',
      weeklyRate: 460,
      totalAmount: 11040,
      depositAmount: 500,
      paymentStatus: 'Paid in Full',
      status: 'Completed',
      notes: 'Completed full term. Vehicle swapped for scheduled fleet rotation.'
    }
  ];
}

export function getDriverPayments(driver) {
  if (!driver) return [];
  const idNum = driver.id?.replace(/\D/g, '') || '101';

  return [
    {
      id: `PAY-2025-0${idNum}`,
      date: '2025-07-10',
      amount: 356.0,
      paymentMethod: 'Corporate ACH Direct Debit',
      invoiceRef: `INV-2025-8${idNum}`,
      category: 'Weekly Rent + Tolls',
      status: 'Cleared',
      notes: 'Automated recurring weekly ACH collection'
    },
    {
      id: `PAY-2025-0${(Number(idNum) - 1).toString().padStart(3, '0')}`,
      date: '2025-07-03',
      amount: 600.0,
      paymentMethod: 'Credit Card (Visa ending 4912)',
      invoiceRef: `INV-2025-7${idNum}`,
      category: 'Weekly Lease Rent',
      status: 'Cleared',
      notes: 'Processed via driver mobile portal'
    },
    {
      id: `PAY-2025-0${(Number(idNum) - 2).toString().padStart(3, '0')}`,
      date: '2025-06-26',
      amount: 487.5,
      paymentMethod: 'Corporate ACH Direct Debit',
      invoiceRef: `INV-2025-6${idNum}`,
      category: 'Weekly Lease Rent',
      status: 'Cleared',
      notes: 'Automated recurring weekly ACH collection'
    },
    {
      id: `PAY-2025-0${(Number(idNum) - 3).toString().padStart(3, '0')}`,
      date: '2025-06-19',
      amount: 487.5,
      paymentMethod: 'Corporate ACH Direct Debit',
      invoiceRef: `INV-2025-5${idNum}`,
      category: 'Weekly Lease Rent',
      status: 'Cleared',
      notes: 'Automated recurring weekly ACH collection'
    }
  ];
}

export function getDriverBalance(driver) {
  if (!driver) {
    return {
      outstandingBalance: 0,
      heldDeposit: 500,
      weeklyRentDue: 0,
      unpaidTolls: 0,
      unpaidCitations: 0,
      lastPaymentDate: '2025-07-10',
      daysOverdue: 0,
      status: 'Current'
    };
  }

  const bal = Number(driver.balance) || 0;
  const isOverdue = bal > 0;

  return {
    outstandingBalance: bal,
    heldDeposit: 500,
    weeklyRentDue: isOverdue ? 260 : 0,
    unpaidTolls: isOverdue ? 15 : 0,
    unpaidCitations: isOverdue ? 75 : 0,
    lastPaymentDate: '2025-07-10',
    daysOverdue: isOverdue ? 14 : 0,
    status: isOverdue ? 'Overdue - Reconciliation Required' : 'Account in Good Standing'
  };
}

export function getDriverInspections(driver) {
  if (!driver) return [];
  const carName = driver.vehicle && driver.vehicle !== 'Unassigned' ? driver.vehicle : 'Toyota Camry SE';

  return [
    {
      id: 'INS-2025-089',
      vehicle: carName,
      type: 'Routine Monthly Check-Out',
      inspectionDate: '2025-07-01',
      odometer: '18,500 mi',
      inspector: 'Chief Tech Dave R.',
      checklistScore: '100% Passed',
      condition: 'Clean interior, tires at 7/32", windshield pristine, all safety sensors operational.',
      status: 'Passed'
    },
    {
      id: 'INS-2025-042',
      vehicle: carName,
      type: 'Quarterly Check-In Return',
      inspectionDate: '2025-06-30',
      odometer: '17,100 mi',
      inspector: 'Fleet Lead Mike T.',
      checklistScore: '98% Passed',
      condition: 'Minor bumper scuff buffed out at shop. Clean return.',
      status: 'Passed'
    }
  ];
}

export function getDriverAccidents(driver) {
  if (!driver) return [];
  const hasAccident = driver.name.toLowerCase().includes('sarah') || driver.name.toLowerCase().includes('jenkins');

  if (!hasAccident) {
    return [];
  }

  return [
    {
      id: 'ACC-2025-014',
      date: '2025-02-14',
      vehicle: 'Hyundai Sonata SEL (PR-2024-HS)',
      location: 'Queens Blvd & 48th St, Long Island City, NY',
      description: 'Low-speed rear-end parking contact while stationary in loading zone. Other driver admitted liability.',
      liability: 'Non-Fault (Third-Party 100% Liable)',
      claimAmount: 1850,
      insuranceClaimNo: 'TRV-CLM-901842',
      claimStatus: 'Settled & Paid by Geico',
      policeReportNo: 'NYPD-108-PCT-8819'
    }
  ];
}

export function getDriverTollsAndTickets(driver) {
  if (!driver) return [];
  const isSarah = driver.name.toLowerCase().includes('sarah');

  return [
    {
      id: 'TCK-2025-8819',
      date: '2025-07-04',
      type: 'NYC Parking Violation',
      location: 'W 57th St & 7th Ave, Manhattan',
      citationNo: 'NYC-PARK-881923',
      fineAmount: 75.0,
      adminFee: 15.0,
      totalAmount: 90.0,
      status: isSarah ? 'Unpaid / Charged to Ledger' : 'Reimbursed',
      notes: 'Commercial loading zone overstay (12 mins)'
    },
    {
      id: 'TOL-2025-1092',
      date: '2025-07-10',
      type: 'E-ZPass Bridge/Tunnel Toll',
      location: 'Lincoln Tunnel Inbound Plaza',
      citationNo: 'EZP-2025-449182',
      fineAmount: 16.0,
      adminFee: 0.0,
      totalAmount: 16.0,
      status: 'Paid',
      notes: 'Standard electronic transponder peak toll'
    },
    {
      id: 'TOL-2025-0981',
      date: '2025-06-28',
      type: 'E-ZPass Bridge/Tunnel Toll',
      location: 'RFK Triborough Bridge',
      citationNo: 'EZP-2025-339180',
      fineAmount: 6.94,
      adminFee: 0.0,
      totalAmount: 6.94,
      status: 'Paid',
      notes: 'Mid-day commercial transit'
    }
  ];
}

export function getDriverContracts(driver) {
  if (!driver) return [];
  const idNum = driver.id?.replace(/\D/g, '') || '101';

  return [
    {
      id: `CTR-2025-${idNum}`,
      title: 'Master Commercial Vehicle Lease & Service Rider',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      terms: 'Weekly Lease ($487.50/wk), $500 Security Deposit, Unlimited Commercial Toll Transponder, Full Comprehensive Maintenance included.',
      insuranceCoverage: '$1,000,000 Combined Single Limit (CSL) Commercial Policy',
      signedDate: '2025-01-01',
      status: 'Active Contract',
      digitalSignature: `${driver.name} (Verified via DocuSign)`
    },
    {
      id: `CTR-2024-${(Number(idNum) - 10).toString().padStart(3, '0')}`,
      title: '2024 Annual Fleet Driver Independent Contractor Lease',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      terms: 'Weekly Lease ($460.00/wk), $500 Security Deposit held in escrow.',
      insuranceCoverage: '$1,000,000 CSL Policy',
      signedDate: '2024-01-02',
      status: 'Expired / Superseded',
      digitalSignature: `${driver.name} (Verified via DocuSign)`
    }
  ];
}

export function getDriverDocuments(driver) {
  if (!driver) return [];

  return [
    {
      id: 'DOC-CDL-01',
      title: 'Commercial Driver License (CDL Class A/B/E)',
      category: 'License',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      issueDate: '2022-09-14',
      expiryDate: driver.licenseExpiry || '2026-09-14',
      fileSize: '1.8 MB PDF',
      status: 'Verified Active',
      isPersonal: true,
      description: 'State DMV certified commercial chauffeur driver license with clean endorsement.'
    },
    {
      id: 'DOC-DOT-02',
      title: 'DOT Medical Examiner Certificate (Form MCSA-5876)',
      category: 'Medical',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      issueDate: '2024-05-10',
      expiryDate: '2026-05-10',
      fileSize: '1.2 MB PDF',
      status: 'Certified Valid',
      isPersonal: true,
      description: 'Federal Motor Carrier Safety Administration (FMCSA) 24-month medical qualification certificate.'
    },
    {
      id: 'DOC-MVR-03',
      title: 'Official Motor Vehicle Record (MVR 3-Year History)',
      category: 'Background Check',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      issueDate: '2025-01-15',
      expiryDate: '2026-01-15',
      fileSize: '2.5 MB PDF',
      status: 'Clean Record',
      isPersonal: true,
      description: 'Zero suspensions, zero major moving violations, verified DMV driving abstract.'
    },
    {
      id: 'DOC-W9-04',
      title: 'IRS Form W-9 / Independent Contractor Tax Form',
      category: 'Tax & Compliance',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      issueDate: '2024-01-05',
      expiryDate: 'Permanent File',
      fileSize: '950 KB PDF',
      status: 'On File',
      isPersonal: true,
      description: 'Taxpayer identification number and certification for 1099-NEC annual filing.'
    },
    {
      id: 'DOC-ACH-05',
      title: 'Direct Deposit / Bank ACH Authorization Agreement',
      category: 'Banking',
      badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      issueDate: '2024-01-05',
      expiryDate: 'Active Mandate',
      fileSize: '1.1 MB PDF',
      status: 'Active ACH',
      isPersonal: true,
      description: 'Authorized electronic debit/credit banking mandate for weekly lease and toll reimbursement.'
    },
    {
      id: 'DOC-LEAS-06',
      title: 'Executed PrimeRoute Fleet Vehicle Lease Contract',
      category: 'Contract',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      issueDate: '2025-01-01',
      expiryDate: '2025-12-31',
      fileSize: '3.4 MB PDF',
      status: 'Executed',
      isPersonal: false,
      description: 'Countersigned commercial lease agreement specifying rental covenants, insurance, and rates.'
    }
  ];
}

export function getDriverStatementData(driver) {
  if (!driver) return { items: [], totalCharges: 0, totalPayments: 0, totalDeposits: 0, totalRefunds: 0, netBalance: 0 };

  const idNum = driver.id?.replace(/\D/g, '') || '101';
  const hasBalance = Number(driver.balance) > 0;

  // Running balance statement items
  let runningBal = 0;
  const rawItems = [
    { date: '2025-07-01', desc: 'Commercial Vehicle Weekly Lease (Week 1)', type: 'Rental Charge', debit: 487.5, credit: 0, deposit: 0, refund: 0 },
    { date: '2025-07-03', desc: 'ACH Direct Debit Payment Received – Thank You', type: 'Payment', debit: 0, credit: 487.5, deposit: 0, refund: 0 },
    { date: '2025-07-04', desc: 'NYC Parking Violation Fine (#NYC-PARK-881923)', type: 'Citation Fee', debit: 75.0, credit: 0, deposit: 0, refund: 0 },
    { date: '2025-07-04', desc: 'PrimeRoute Toll & Violation Admin Processing Fee', type: 'Admin Fee', debit: 15.0, credit: 0, deposit: 0, refund: 0 },
    { date: '2025-07-08', desc: 'Commercial Vehicle Weekly Lease (Week 2)', type: 'Rental Charge', debit: 487.5, credit: 0, deposit: 0, refund: 0 },
    { date: '2025-07-10', desc: 'Lincoln Tunnel Toll Auto-Transponder Charge', type: 'Toll Fee', debit: 16.0, credit: 0, deposit: 0, refund: 0 },
    { date: '2025-07-10', desc: 'Escrow Security Deposit Allocation Held', type: 'Deposit', debit: 0, credit: 0, deposit: 500.0, refund: 0 },
    { date: '2025-07-10', desc: 'Credit Card Payment Received (Ref: CC-9921)', type: 'Payment', debit: 0, credit: hasBalance ? 228.0 : 578.5, deposit: 0, refund: 0 },
  ];

  if (!hasBalance) {
    rawItems.push({
      date: '2025-07-11',
      desc: 'Tollway Rebate / Courtesy Account Credit',
      type: 'Refund/Credit',
      debit: 0,
      credit: 0,
      deposit: 0,
      refund: 15.0
    });
  }

  const items = rawItems.map((item) => {
    if (item.debit > 0) runningBal += item.debit;
    if (item.credit > 0) runningBal -= item.credit;
    if (item.refund > 0) runningBal -= item.refund;
    return {
      ...item,
      runningBalance: Math.max(0, runningBal)
    };
  });

  const totalCharges = items.reduce((acc, curr) => acc + curr.debit, 0);
  const totalPayments = items.reduce((acc, curr) => acc + curr.credit, 0);
  const totalDeposits = items.reduce((acc, curr) => acc + curr.deposit, 0);
  const totalRefunds = items.reduce((acc, curr) => acc + curr.refund, 0);
  const netBalance = Math.max(0, totalCharges - totalPayments - totalRefunds);

  return {
    items,
    totalCharges,
    totalPayments,
    totalDeposits,
    totalRefunds,
    netBalance
  };
}

