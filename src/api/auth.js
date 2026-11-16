import { delay, ApiError } from './client.js';
import { loadStoredUsers } from './users.js';
import { initialSettings } from '../data/mockData.js';

export const MOCK_AUTH_USERS = [
  {
    id: 'USR-001',
    name: 'Marcus Brody',
    email: 'marcus.brody@primeroute.io',
    password: 'password123',
    role: 'owner',
    roleName: 'Owner / Primary Admin',
    status: 'Active',
  },
  {
    id: 'USR-002',
    name: 'Elena Vance',
    email: 'elena.vance@primeroute.io',
    password: 'password123',
    role: 'secondary_admin',
    roleName: 'Secondary Admin',
    status: 'Active',
  },
  {
    id: 'USR-003',
    name: 'Michael Chang',
    email: 'michael.chang@primeroute.io',
    password: 'password123',
    role: 'finance',
    roleName: 'Finance',
    status: 'Active',
  },
  {
    id: 'USR-004',
    name: 'Tom Gallagher',
    email: 'tom.gallagher@primeroute.io',
    password: 'password123',
    role: 'fleet_maintenance',
    roleName: 'Fleet / Maintenance',
    status: 'Active',
  },
  {
    id: 'USR-005',
    name: 'Sarah Connor',
    email: 'sarah.connor@primeroute.io',
    password: 'password123',
    role: 'rental_operations',
    roleName: 'Rental / Operations',
    status: 'Active',
  },
  {
    id: 'USR-006',
    name: 'Rachel Green',
    email: 'rachel.green@primeroute.io',
    password: 'password123',
    role: 'readonly_manager',
    roleName: 'Read-only Manager',
    status: 'Active',
  },
];

export const normalizeAuthRole = (r) => {
  if (!r) return 'rental_operations';
  const lower = String(r).toLowerCase().trim();
  if (lower === 'owner' || lower === 'administrator 1' || lower === 'primary admin') return 'owner';
  if (lower === 'secondary_admin' || lower === 'admin' || lower === 'administrator' || lower === 'administrator 2') return 'secondary_admin';
  if (lower === 'finance' || lower === 'accountant') return 'finance';
  if (lower === 'fleet_maintenance' || lower === 'maintenance' || lower === 'fleet manager' || lower === 'service') return 'fleet_maintenance';
  if (lower === 'rental_operations' || lower === 'operations' || lower === 'operator' || lower === 'employee' || lower === 'rental') return 'rental_operations';
  if (lower === 'readonly_manager' || lower === 'manager' || lower === 'readonly' || lower === 'read-only') return 'readonly_manager';
  return lower;
};

export const findUserByEmail = (emailStr) => {
  if (!emailStr) return null;
  const targetEmail = String(emailStr).trim().toLowerCase();

  // 1. Check persistent localStorage users (includes admin-created users)
  try {
    const storedUsers = loadStoredUsers();
    const found = storedUsers.find((u) => (u.email || '').toLowerCase() === targetEmail);
    if (found) {
      return {
        ...found,
        role: normalizeAuthRole(found.role),
        password: found.password || 'password123',
        status: found.status || 'Active',
      };
    }
  } catch {
    // fallback
  }

  // 2. Check initialSettings.users from mockData
  if (initialSettings?.users?.length) {
    const found = initialSettings.users.find((u) => (u.email || '').toLowerCase() === targetEmail);
    if (found) {
      return {
        ...found,
        role: normalizeAuthRole(found.role),
        password: found.password || 'password123',
        status: found.status || 'Active',
      };
    }
  }

  // 3. Check MOCK_AUTH_USERS
  const found = MOCK_AUTH_USERS.find((u) => u.email.toLowerCase() === targetEmail);
  if (found) {
    return { ...found };
  }

  return null;
};

export const authenticate = async (email, password) => {
  await delay(100);
  const user = findUserByEmail(email);
  if (!user) {
    throw new ApiError('No corporate account found for this email address.', 404);
  }
  if (user.status && user.status.toLowerCase() !== 'active') {
    throw new ApiError('Account is inactive. Please contact your system administrator.', 403);
  }
  if (user.password && password && user.password !== password) {
    throw new ApiError('Invalid password. Please verify your corporate credentials.', 401);
  }
  return user;
};

export const authApi = {
  login: authenticate,
  authenticate,
  findUserByEmail,
  getMockUsers: () => [...MOCK_AUTH_USERS],
};

export default authApi;

