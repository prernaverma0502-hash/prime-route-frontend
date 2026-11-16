const ROLES = [
  'owner',
  'secondary_admin',
  'finance',
  'fleet_maintenance',
  'rental_operations',
  'readonly_manager'
];

const MODULES = [
  'dashboard',
  'vehicles',
  'drivers',
  'rentals',
  'accounting',
  'expenses',
  'vendors',
  'maintenance',
  'tolls_tickets',
  'inspections',
  'accidents',
  'insurance',
  'documents',
  'reports',
  'settings',
  'audit_logs',
  'employee_paperwork',
  'notifications'
];

const ACTIONS = [
  'view',
  'add',
  'edit',
  'approve',
  'export',
  'archive',
  'administer'
];

const VEHICLE_STATUSES = [
  'available',
  'reserved',
  'rented',
  'maintenance',
  'unavailable',
  'sold_retired'
];

const RENTAL_STATUSES = [
  'draft',
  'awaiting_signature',
  'active',
  'renewed',
  'terminated',
  'completed'
];

const TICKET_STATUSES = [
  'unassigned',
  'under_review',
  'assigned',
  'charged',
  'paid',
  'disputed'
];

const LEDGER_ENTRY_TYPES = [
  'charge',
  'payment',
  'deposit',
  'refund',
  'credit',
  'adjustment',
  'reversal'
];

const EXPENSE_CATEGORIES = [
  'insurance',
  'registration',
  'oil_change',
  'repairs',
  'tires',
  'towing',
  'cleaning',
  'tolls',
  'parking',
  'tickets',
  'marketing',
  'software',
  'bank_fees',
  'office',
  'legal_accounting',
  'other'
];

module.exports = {
  ROLES,
  MODULES,
  ACTIONS,
  VEHICLE_STATUSES,
  RENTAL_STATUSES,
  TICKET_STATUSES,
  LEDGER_ENTRY_TYPES,
  EXPENSE_CATEGORIES
};
