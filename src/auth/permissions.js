/**
 * PrimeRoute Role-Based Access Control (RBAC) Permissions Definition
 *
 * 6 Business Roles:
 * 1. owner (Owner / Primary Admin)
 * 2. secondary_admin (Secondary Admin)
 * 3. finance (Finance)
 * 4. fleet_maintenance (Fleet / Maintenance)
 * 5. rental_operations (Rental / Operations)
 * 6. readonly_manager (Read-only Manager)
 *
 * Supported Actions:
 * - view
 * - add
 * - edit
 * - approve
 * - export
 * - archive
 * - administer
 */

export const ROLES_CONFIG = {
  owner: {
    id: 'owner',
    name: 'Owner / Primary Admin',
    title: 'Owner & Managing Director',
    badge: 'Full Root Privileges',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    description: 'Unrestricted system access: users, settings, finance, accounting, reports, audit logs, and master security overrides.',
    canMaskDrivers: false, // sees full unmasked PII
  },
  secondary_admin: {
    id: 'secondary_admin',
    name: 'Secondary Admin',
    title: 'Operations Director',
    badge: 'Operational Admin',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    description: 'Broad operational administration. Sensitive actions (e.g. system config, bank releases, permanent archive) require Owner approval.',
    canMaskDrivers: false, // authorized administrative staff
  },
  finance: {
    id: 'finance',
    name: 'Finance',
    title: 'Financial Controller',
    badge: 'Financial Controller',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    description: 'Full financial authority: payments, expenses, accounting ledger, security deposit escrow, and P&L statements.',
    canMaskDrivers: true, // masked driver PII
  },
  fleet_maintenance: {
    id: 'fleet_maintenance',
    name: 'Fleet / Maintenance',
    title: 'Fleet & Service Lead',
    badge: 'Fleet Ops & Shop',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80',
    description: 'Vehicle fleet management, odometer tracking, routine maintenance schedules, workshop repair orders, and handover inspections.',
    canMaskDrivers: true, // masked driver PII
  },
  rental_operations: {
    id: 'rental_operations',
    name: 'Rental / Operations',
    title: 'Front Desk & Dispatcher',
    badge: 'Front-desk & Dispatch',
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    description: 'Booking intake, rental leasing contracts, digital driver assignment, vehicle pickup handover, and check-in return verification.',
    canMaskDrivers: true, // masked driver PII
  },
  readonly_manager: {
    id: 'readonly_manager',
    name: 'Read-only Manager',
    title: 'Compliance & Audit Officer',
    badge: 'Audit & Compliance (View-Only)',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    description: 'External auditor and managerial oversight. View-only access across authorized reports, dashboards, and records without modification rights.',
    canMaskDrivers: true, // masked driver PII
  },
};

/**
 * Permissions Matrix: role -> module -> allowed actions
 */
export const PERMISSIONS_MATRIX = {
  owner: {
    dashboard: ['view', 'export'],
    vehicles: ['view', 'add', 'edit', 'approve', 'export', 'archive', 'administer'],
    drivers: ['view', 'add', 'edit', 'approve', 'export', 'archive', 'administer'],
    rentals: ['view', 'add', 'edit', 'approve', 'export', 'archive', 'administer'],
    inspections: ['view', 'add', 'edit', 'approve', 'export', 'archive', 'administer'],
    accounting: ['view', 'add', 'edit', 'approve', 'export', 'archive', 'administer'],
    maintenance: ['view', 'add', 'edit', 'approve', 'export', 'archive', 'administer'],
    'tolls-tickets': ['view', 'add', 'edit', 'approve', 'export', 'archive', 'administer'],
    documents: ['view', 'add', 'edit', 'approve', 'export', 'archive', 'administer'],
    insurance: ['view', 'add', 'edit', 'approve', 'export', 'archive', 'administer'],
    reports: ['view', 'add', 'edit', 'approve', 'export', 'archive', 'administer'],
    vendors: ['view', 'add', 'edit', 'approve', 'export', 'archive', 'administer'],
    settings: ['view', 'add', 'edit', 'approve', 'export', 'archive', 'administer'],
    users: ['view', 'add', 'edit', 'approve', 'export', 'archive', 'administer'],
    'employee-paperwork': ['view', 'add', 'edit', 'approve', 'export', 'archive', 'administer'],
  },
  secondary_admin: {
    dashboard: ['view', 'export'],
    vehicles: ['view', 'add', 'edit', 'export'],
    drivers: ['view', 'add', 'edit', 'export'],
    rentals: ['view', 'add', 'edit', 'approve', 'export'],
    inspections: ['view', 'add', 'edit', 'approve', 'export'],
    accounting: ['view', 'export'], // Sensitive edits require approval
    maintenance: ['view', 'add', 'edit', 'approve', 'export'],
    'tolls-tickets': ['view', 'add', 'edit', 'export'],
    documents: ['view', 'add', 'edit', 'export'],
    insurance: ['view', 'add', 'edit', 'approve', 'export'],
    reports: ['view', 'export'],
    vendors: ['view', 'add', 'edit', 'export'],
    settings: ['view'], // editing requires approval
    users: [], // Owner only
    'employee-paperwork': ['view', 'add', 'edit', 'approve', 'export', 'archive', 'administer'],
  },
  finance: {
    dashboard: ['view', 'export'],
    vehicles: ['view'],
    drivers: ['view'],
    rentals: ['view', 'edit'],
    inspections: [],
    accounting: ['view', 'add', 'edit', 'approve', 'export'],
    maintenance: [],
    'tolls-tickets': ['view', 'add', 'edit', 'approve', 'export'],
    documents: ['view', 'export'],
    insurance: ['view', 'add', 'edit', 'approve', 'export'],
    reports: ['view', 'export'],
    vendors: ['view', 'add', 'edit', 'approve', 'export'],
    settings: [],
    users: [],
    'employee-paperwork': [],
  },
  fleet_maintenance: {
    dashboard: ['view'],
    vehicles: ['view', 'add', 'edit', 'export'],
    drivers: ['view'],
    rentals: ['view'],
    inspections: ['view', 'add', 'edit', 'export'],
    accounting: [],
    maintenance: ['view', 'add', 'edit', 'approve', 'export'],
    'tolls-tickets': ['view'],
    documents: ['view', 'add'],
    insurance: ['view', 'add', 'edit', 'export'],
    reports: ['view'],
    vendors: ['view', 'add', 'edit', 'export'],
    settings: [],
    users: [],
    'employee-paperwork': [],
  },
  rental_operations: {
    dashboard: ['view'],
    vehicles: ['view'],
    drivers: ['view', 'add', 'edit'],
    rentals: ['view', 'add', 'edit', 'export'],
    inspections: ['view', 'add'],
    accounting: ['view'],
    maintenance: ['view'],
    'tolls-tickets': ['view', 'add', 'edit'],
    documents: ['view'],
    insurance: ['view'],
    reports: ['view'],
    vendors: ['view'],
    settings: [],
    users: [],
    'employee-paperwork': ['view', 'add'],
  },
  readonly_manager: {
    dashboard: ['view'],
    vehicles: ['view'],
    drivers: ['view'],
    rentals: ['view'],
    inspections: ['view'],
    accounting: ['view'],
    maintenance: ['view'],
    'tolls-tickets': ['view'],
    documents: ['view'],
    insurance: ['view'],
    reports: ['view'],
    vendors: ['view'],
    settings: [],
    users: [],
    'employee-paperwork': [],
  },
};

/**
 * Sensitive actions that require Owner approval when attempted by secondary_admin
 */
const SENSITIVE_ACTIONS_SECONDARY_ADMIN = [
  { module: 'settings', action: 'edit' },
  { module: 'settings', action: 'administer' },
  { module: 'users', action: 'add' },
  { module: 'users', action: 'edit' },
  { module: 'users', action: 'administer' },
  { module: 'accounting', action: 'approve' },
  { module: 'accounting', action: 'edit' },
  { module: 'vehicles', action: 'archive' },
  { module: 'rentals', action: 'archive' },
];

/**
 * Check if a role has permission for a specific module and action
 */
export function hasPermission(roleId, module, action = 'view') {
  if (!roleId || !module) return false;
  const normalizedRole = roleId.toLowerCase();
  const rolePermissions = PERMISSIONS_MATRIX[normalizedRole];
  if (!rolePermissions) return false;

  const modulePermissions = rolePermissions[module];
  if (!modulePermissions || !Array.isArray(modulePermissions)) return false;

  return modulePermissions.includes(action);
}

/**
 * Check if an action by a role requires Owner authorization / approval
 */
export function isApprovalRequired(roleId, module, action) {
  if (!roleId) return false;
  const normalizedRole = roleId.toLowerCase();
  if (normalizedRole === 'secondary_admin') {
    return SENSITIVE_ACTIONS_SECONDARY_ADMIN.some(
      (item) => item.module === module && item.action === action
    );
  }
  return false;
}

/**
 * Check if driver data should be masked for a role
 */
export function shouldMaskDriverData(roleId) {
  if (!roleId) return true;
  const config = ROLES_CONFIG[roleId.toLowerCase()];
  return config ? config.canMaskDrivers : true;
}
